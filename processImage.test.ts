import { expect, test, beforeAll, describe, it, vi } from "vitest";
import { z } from "zod";
import {
  imageMetaSchema,
  maxDescriptionLength,
  type imageMeta,
} from "./processImage";

// export const maxDescriptionLength = 50;
// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Define the schema
// export const imageMetaSchema = z.object({
//   imgPath: z.string(),
//   tags: z.array(z.string()),
//   title: z.string(),
//   description: z.string(),
//   timeStamp: z.number(),
//   embedding: z.array(z.number()), // Added embedding field
// });

// // Infer the type from the schema
// export type imageMeta = z.infer<typeof imageMetaSchema>;

// Mock the environment variable before importing the module
const mockedEnv = { OPENAI_API_KEY: "test-api-key" };

// Mock the process.env to include the mocked environment variable
beforeAll(() => {
  process.env.OPENAI_API_KEY = mockedEnv.OPENAI_API_KEY;
});

// Ensure the module uses the mocked environment variable by importing it after the mock is set
import { openai } from "./processImage";

const openAIMock = new Promise((resolve) => {
  resolve(
    
  ),
  });
});

describe("openai", () => {
  it("should be instantiated with the mocked API key", () => {
    // Check if the OpenAI instance was created with the mocked API key
    expect(openai).toBeDefined();
    // If there is a way to access the apiKey from openai instance, assert it here
    // Assuming there is a property apiKey for demonstration purposes
    expect((openai as any).apiKey).toBe("test-api-key"); // Adjusted to access apiKey
  });
});

test("valid imageMeta object", () => {
  const validImageMeta = {
    imgPath: "path/to/image.jpg",
    tags: ["tag1", "tag2"],
    title: "Sample Title",
    description: "This is a sample description.",
    timeStamp: 1627849923,
    embedding: [0.1, 0.2, 0.3, 0.4],
  };

  expect(() => imageMetaSchema.parse(validImageMeta)).not.toThrow();
});

test("invalid imageMeta object - missing fields", () => {
  const invalidImageMeta = {
    imgPath: "path/to/image.jpg",
    tags: ["tag1", "tag2"],
    title: "Sample Title",
    // description is missing
    timeStamp: 1627849923,
    embedding: [0.1, 0.2, 0.3, 0.4],
  };

  expect(() => imageMetaSchema.parse(invalidImageMeta)).toThrow();
});

test("invalid imageMeta object - wrong types", () => {
  const invalidImageMeta = {
    imgPath: "path/to/image.jpg",
    tags: "tag1, tag2", // should be an array
    title: "Sample Title",
    description: "This is a sample description.",
    timeStamp: "1627849923", // should be a number
    embedding: [0.1, 0.2, 0.3, 0.4],
  };

  expect(() => imageMetaSchema.parse(invalidImageMeta)).toThrow();
});

test("invalid imageMeta object - embedding not an array of numbers", () => {
  const invalidImageMeta = {
    imgPath: "path/to/image.jpg",
    tags: ["tag1", "tag2"],
    title: "Sample Title",
    description: "This is a sample description.",
    timeStamp: 1627849923,
    embedding: ["0.1", "0.2", "0.3", "0.4"], // should be numbers
  };

  expect(() => imageMetaSchema.parse(invalidImageMeta)).toThrow();
});

test("invalid imageMeta object - description too long", () => {
  const invalidImageMeta = {
    imgPath: "path/to/image.jpg",
    tags: ["tag1", "tag2"],
    title: "Sample Title",
    description: "A".repeat(maxDescriptionLength + 1), // exceeds max length
    timeStamp: 1627849923,
    embedding: [0.1, 0.2, 0.3, 0.4],
  };

  expect(() => imageMetaSchema.parse(invalidImageMeta)).toThrow();
});
