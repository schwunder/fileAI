import axios from "axios";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { pipe, truncateLog } from "./utils";
import { delay, retryWithExponentialBackoff } from "./utils";
import OpenAI from "openai";
import pino from "pino";

// Setup Pino logger
const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const maxDescriptionLength = 50;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fetchEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
      encoding_format: "float",
    });

    if (
      response &&
      response.data &&
      response.data[0] &&
      response.data[0].embedding
    ) {
      return response.data[0].embedding;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    throw new Error(`Error fetching embedding for text: ${text}`);
  }
};

const getImageDescription = async (
  base64Img: string,
  prompt: string
): Promise<string> => {
  try {
    const res = await axios.post<{
      choices: { message: { content: string } }[];
    }>(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Img}` },
              },
            ],
          },
        ],
        max_tokens: maxDescriptionLength,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    const errorMessage = truncateLog(
      "Error sending request to OpenAI: " + (error as Error).message
    );
    throw new Error(errorMessage);
  }
};

// make this take an array of descriptipons as an input and return an array of metadata
const getMetadata = async (
  comment: string
): Promise<{ tags: string[]; title: string }> => {
  try {
    const { object } = (await generateObject({
      schema: z.object({ tags: z.array(z.string()), title: z.string() }),
      model: createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o"),
      prompt: `${comment}---- Provide a fileTitle (under 5 words, kebab case) and 1-4 descriptive tags.`,
    })) as { object: { tags: string[]; title: string } };
    return object;
  } catch (error) {
    throw new Error(
      truncateLog("Error getting metadata: " + (error as Error).message)
    );
  }
};

// Define the schema
const imageMetaSchema = z.object({
  imgPath: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  timeStamp: z.number(),
  embedding: z.array(z.number()), // Added embedding field
});

// Infer the type from the schema
export type imageMeta = z.infer<typeof imageMetaSchema>;

export async function processImage(imgPath: string): Promise<imageMeta> {
  const absPath = `${import.meta.dir}/${imgPath}`;
  logger.info(`Processing image: ${absPath}`);
  try {
    const description = await pipe(absPath, [
      (path: string) => Bun.file(path),
      async (file: File) => await file.arrayBuffer(),
      (buffer: ArrayBuffer) => Buffer.from(buffer),
      (buffer: Buffer) => buffer.toString("base64"),
      (base64Img: string) =>
        getImageDescription(
          base64Img,
          `What's in this image? Be concise and use under ${maxDescriptionLength} tokens`
        ),
    ]);
    logger.info(`Processing image: ${description}`);
    const embedding = await fetchEmbedding(description);
    const { tags, title } = await getMetadata(description);

    const imageData: imageMeta = {
      imgPath,
      tags,
      title,
      description,
      timeStamp: Date.now(),
      embedding, // Added embedding field
    };

    // Validate with zod
    imageMetaSchema.parse(imageData);
    // Return or save imageData as needed
    return imageData;
  } catch (error) {
    const errorMessage = truncateLog(
      "Error processing image: " + (error as Error).message
    );
    throw new Error(errorMessage);
  }
}

export async function processImages(filePaths: string[]): Promise<imageMeta[]> {
  const imageDetails: imageMeta[] = [];
  logger.info(`Processing images: ${filePaths}`);
  for (const filePath of filePaths) {
    try {
      logger.info(`Processing image: ${filePath}`);
      logger.info(process.env.OPENAI_API_KEY);
      const imageData = await processImage(filePath);
      imageDetails.push(imageData);
    } catch (error) {
      throw new Error(
        truncateLog(
          `Error processing image ${filePath}:` + (error as Error).message
        )
      );
    }
  }

  return imageDetails;
}
