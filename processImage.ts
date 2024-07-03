import axios from "axios";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { pipe } from "./utils";
import OpenAI from "openai";
import sharp from "sharp";
import convert from "heic-convert";

export const maxDescriptionLength = 50;
export const maxTextToEmbedLength = 5000;
export const maxImageSizeMB = 20;
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const imageMetaSchema = z.object({
  imgPath: z.string(),
  tags: z.array(z.string()),
  matchingTags: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  timeStamp: z.number(),
  embedding: z.array(z.number()), // Added embedding field
});

export type imageMeta = z.infer<typeof imageMetaSchema>;

export const fetchEmbedding = async (text: string): Promise<number[]> => {
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
  const requestBody = {
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
  };

  try {
    const res = await axios.post<{
      choices: { message: { content: string } }[];
    }>("https://api.openai.com/v1/chat/completions", requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    return res.data.choices[0].message.content;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response
        ? `Error sending request to OpenAI: ${error.response.data}`
        : `Error sending request to OpenAI: ${(error as Error).message}`;
    throw new Error(errorMessage);
  }
};

const getMetadata = async (
  comment: string,
  sampleTags: string[]
): Promise<{
  tags: string[];
  title: string;
  description: string;
  matchingTags: string[];
}> => {
  try {
    const sampleList = sampleTags.join(", ");
    const { object } = (await generateObject({
      schema: z.object({
        tags: z.array(z.string()),
        title: z.string(),
        description: z.string(),
        matchingTags: z.array(z.string()),
      }),
      model: createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o"),
      prompt: `${comment}---- 
        1. Provide a description and use under ${maxDescriptionLength} tokens.
        2. Generate 1-4 descriptive tags that are relevant to the description. Do not consider the following list of sample tags while generating these tags: ${sampleList}.
        3. After generating the description and tags, choose 1-4 matching tags from the following list:  ${sampleList}. Ensure that the matching tags and the generated tags are completely different and do not overlap.`,
    })) as {
      object: {
        description: string;
        matchingTags: string[];
        tags: string[];
        title: string;
      };
    };
    return object;
  } catch (error) {
    throw new Error(`Error getting metadata: ${(error as Error).message}`);
  }
};

export async function processImage(
  imgPath: string,
  sampleTags: string[]
): Promise<imageMeta> {
  const absPath = `${import.meta.dir}/${imgPath}`;
  try {
    const imgFile = Bun.file(absPath);
    const mimeType = imgFile.type;

    let imgBuffer = await imgFile.arrayBuffer();
    let imgSizeMB = imgBuffer.byteLength / (1024 * 1024);

    // Convert HEIF to JPEG if necessary
    if (
      imgPath.endsWith(".heic") ||
      imgPath.endsWith(".heif") ||
      mimeType === "image/heif" ||
      mimeType === "image/heic"
    ) {
      try {
        const arrayBuffer = imgBuffer;
        const convertedBuffer = await convert({
          buffer: arrayBuffer, // the HEIC file buffer
          format: "JPEG", // output format
          quality: 1, // the jpeg compression quality, between 0 and 1
        });
        imgBuffer = convertedBuffer as ArrayBuffer;
      } catch (conversionError) {
        throw new Error("Error converting HEIF to JPEG: " + conversionError);
      }
    }

    // Re-encode the image to strip metadata
    try {
      const jpegBuffer = await sharp(Buffer.from(imgBuffer))
        .jpeg({ quality: 80 })
        .toBuffer();

      imgBuffer = jpegBuffer.buffer as ArrayBuffer;
      imgSizeMB = imgBuffer.byteLength / (1024 * 1024);
    } catch (sharpError) {
      throw new Error("Error processing image with sharp: " + sharpError);
    }

    // Check image size
    if (imgSizeMB > maxImageSizeMB) {
      throw new Error(
        `Image size (${imgSizeMB.toFixed(
          2
        )}MB) exceeds the maximum allowed size (${maxImageSizeMB}MB).`
      );
    }

    const base64Img = Buffer.from(imgBuffer).toString("base64");

    const imgDescription = await getImageDescription(
      base64Img,
      `What's in this image? Be concise and use under ${maxTextToEmbedLength} tokens`
    );
    const embedding = await fetchEmbedding(imgDescription);
    const { tags, title, description, matchingTags } = await getMetadata(
      imgDescription,
      sampleTags
    );

    const imageMeta: imageMeta = {
      imgPath,
      tags,
      matchingTags,
      title,
      description,
      timeStamp: Date.now(),
      embedding,
    };

    return imageMeta;
  } catch (error) {
    throw new Error(`Error processing image: ${(error as Error).message}`);
  }
}

export async function processImages(
  filePaths: string[],
  sampleTags: string[]
): Promise<imageMeta[]> {
  const imageDetails: imageMeta[] = [];
  for (const filePath of filePaths) {
    try {
      const imageData = await processImage(filePath, sampleTags);
      imageDetails.push(imageData);
    } catch (error) {
      throw new Error(
        `Error processing image ${filePath}: ${(error as Error).message}`
      );
    }
  }

  return imageDetails;
}
