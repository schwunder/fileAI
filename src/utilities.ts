import { z } from "zod";

import clsx from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the schema
const imageMetaSchema = z.object({
  imgPath: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
  matchingTags: z.array(z.string()),
  description: z.string(),
  timeStamp: z.number(),
  embedding: z.array(z.number()), // Added embedding field
});

type ImageMeta = z.infer<typeof imageMetaSchema>;

const isPromise = (val: any): val is Promise<any> =>
  val && typeof val.then === "function";
const pipe = (initialValue: any, fns: any[]) => {
  return fns.reduce((acc, fn) => {
    return isPromise(acc) ? acc.then(fn) : fn(acc);
  }, initialValue);
};

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

export const calculateSimilarities = (
  searchEmbedding: number[],
  tokenMetas: ImageMeta[]
): { token: ImageMeta; similarity: number }[] => {
  console.log(`Calculating similarities for search embedding`);

  const similarities = tokenMetas.map((tokenMeta) => ({
    token: tokenMeta,
    similarity: cosineSimilarity(searchEmbedding, tokenMeta.embedding),
  }));

  console.log(`Calculated similarities: ${JSON.stringify(similarities)}`);

  return similarities;
};

// Function to find the token with the highest similarity score
const findClosest = (
  similarities: { token: ImageMeta; similarity: number }[]
): ImageMeta => {
  console.log(`Finding closest token from similarities`);

  const closestToken = similarities.reduce(
    (best, current) => (current.similarity > best.similarity ? current : best),
    { token: {} as ImageMeta, similarity: -Infinity }
  ).token;

  console.log(`Closest token found: ${closestToken.title}`);

  return closestToken;
};

// Redesigned findClosestToken function to take an embedding instead of the search string
export const findClosestToken = async (
  searchEmbedding: number[],
  tokenMetas: ImageMeta[]
): Promise<ImageMeta> => {
  console.log(`Starting process to find closest token for provided embedding`);

  // Step 1: Use pipe function to process steps sequentially
  return pipe(searchEmbedding, [
    // Calculate cosine similarities between search string embedding and token embeddings
    (embedding: number[]) => calculateSimilarities(embedding, tokenMetas),
    // Find and return the closest token based on highest similarity score
    (similarities: { token: ImageMeta; similarity: number }[]) =>
      findClosest(similarities),
  ]);
};

// Define the type for the coordinates
type Coordinates = number[][];

// Function to normalize t-SNE coordinates to fit within a specified range with a margin
export function normalizeCoordinates(
  coordinates: Coordinates,
  rangeMin: number,
  rangeMax: number,
  marginPx: number,
  canvasSize: number
): Coordinates {
  const margin = marginPx / canvasSize; // Convert pixel margin to normalized margin
  const xValues = coordinates.map((coord) => coord[0]);
  const yValues = coordinates.map((coord) => coord[1]);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  return coordinates.map(([x, y]) => [
    ((x - xMin) / (xMax - xMin)) * (rangeMax - rangeMin - 2 * margin) +
      rangeMin +
      margin,
    ((y - yMin) / (yMax - yMin)) * (rangeMax - rangeMin - 2 * margin) +
      rangeMin +
      margin,
  ]);
}

// Function to render the embedding on the canvas
export function renderEmbedding(
  context: CanvasRenderingContext2D,
  coordinates: Coordinates,
  imageSize: number,
  canvas: HTMLCanvasElement
): void {
  context.clearRect(0, 0, canvas.width, canvas.height);
  coordinates.forEach((d, i) => {
    const img = new Image();
    img.src = `../../db/media/${i}.png`;
    img.onload = () => {
      // Adjust coordinates to prevent clipping
      const x = Math.max(
        imageSize / 2,
        Math.min(d[0] * canvas.width, canvas.width - imageSize / 2)
      );
      const y = Math.max(
        imageSize / 2,
        Math.min(d[1] * canvas.height, canvas.height - imageSize / 2)
      );

      context.drawImage(
        img,
        x - imageSize / 2,
        y - imageSize / 2,
        imageSize,
        imageSize
      );
    };
  });
}
