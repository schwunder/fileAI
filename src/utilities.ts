import { z } from "zod";

// Define the schema
const imageMetaSchema = z.object({
  imgPath: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
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
