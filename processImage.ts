import axios from "axios";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { pipe, truncateLog } from "./utils";
import { delay, retryWithExponentialBackoff } from "./utils";

const maxDescriptionLength = 50;

const getImageDescription = async (
  base64Img: string,
  prompt: string
): Promise<string> => {
  const request = async (): Promise<string> => {
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
  };

  try {
    return await retryWithExponentialBackoff(request, []);
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

export async function processImage(imgPath: string): Promise<imageMeta> {
  const absPath = `${import.meta.dir}/${imgPath}`;

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

    const { tags, title } = await getMetadata(description);

    const imageData: imageMeta = {
      imgPath,
      tags,
      title,
      description,
      timeStamp: Date.now(),
    };

    // Validate with zod
    const imageDataSchema = z.object({
      imgPath: z.string(),
      tags: z.array(z.string()),
      title: z.string(),
      description: z.string(),
      timeStamp: z.number(),
    });
    imageDataSchema.parse(imageData);
    // Return or save imageData as needed
    return imageData;
  } catch (error) {
    const errorMessage = truncateLog(
      "Error processing image: " + (error as Error).message
    );
    throw new Error(errorMessage);
  }
}

// Define the schema
const imageMetaSchema = z.object({
  imgPath: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  timeStamp: z.number(),
});

// Infer the type from the schema
export type imageMeta = z.infer<typeof imageMetaSchema>;

export async function processImages(filePaths: string[]): Promise<imageMeta[]> {
  const imageDetails: imageMeta[] = [];
  const batchSize = 4; // Number of images to process in each batch

  for (let i = 0; i < filePaths.length; i += batchSize) {
    const batch = filePaths.slice(i, i + batchSize);
    const batchPromises = batch.map(async (filePath) => {
      try {
        return await processImage(filePath);
      } catch (error) {
        throw new Error(
          truncateLog(
            `Error processing image ${filePath}:` + (error as Error).message
          )
        );
      }
    });

    const batchResults = await Promise.all(batchPromises);
    imageDetails.push(...batchResults);

    if (i + batchSize < filePaths.length) {
      await delay(2000); // Increased delay between batches to 2 seconds
    }
  }

  return imageDetails;
}
