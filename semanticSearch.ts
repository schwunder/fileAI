import OpenAI from "openai";
import pino from "pino";
import { pipe, cosineSimilarity } from "./utils";

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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to fetch embedding for a given text using OpenAI API
export const fetchEmbedding = async (text: string): Promise<number[]> => {
  logger.info(`Fetching embedding for text: ${text}`);

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
      encoding_format: "float",
    });

    logger.info(`Received response for text: ${text}`);
    logger.info(`Response keys: ${Object.keys(response)}`);
    logger.info(
      `Response data keys: ${
        response.data ? Object.keys(response.data) : "No data keys"
      }`
    );

    if (
      response &&
      response.data &&
      response.data[0] &&
      response.data[0].embedding
    ) {
      const embedding = response.data[0].embedding;
      logger.info(`Type of embedding: ${typeof embedding}`);
      logger.info(`Is embedding an array: ${Array.isArray(embedding)}`);
      if (Array.isArray(embedding)) {
        logger.info(`Length of embedding array: ${embedding.length}`);
        logger.info(`First element type: ${typeof embedding[0]}`);
      }
      logger.info(`Received embedding for text: ${text}`, embedding);
      return embedding;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    logger.error(`Error fetching embedding for text: ${text}`, error);
    throw error;
  }
};

// Function to calculate cosine similarities between search embedding and token embeddings
const calculateSimilarities = (
  searchEmbedding: number[],
  tokenEmbeddings: number[][],
  tokens: string[]
): { token: string; similarity: number }[] => {
  logger.info(`Calculating similarities for search embedding`);

  const similarities = tokens.map((token, idx) => ({
    token,
    similarity: cosineSimilarity(searchEmbedding, tokenEmbeddings[idx]),
  }));

  logger.info(`Calculated similarities: ${JSON.stringify(similarities)}`);

  return similarities;
};

// Function to find the token with the highest similarity score
const findClosest = (
  similarities: { token: string; similarity: number }[]
): string => {
  logger.info(`Finding closest token from similarities`);

  const closestToken = similarities.reduce(
    (best, current) => (current.similarity > best.similarity ? current : best),
    { token: "", similarity: -Infinity }
  ).token;

  logger.info(`Closest token found: ${closestToken}`);

  return closestToken;
};

// Redesigned findClosestToken function to sequentially process steps using pipe
export const findClosestToken = async (
  searchString: string,
  tokenArray: string[],
  tokenEmbeddings: number[][]
): Promise<string> => {
  logger.info(
    `Starting process to find closest token for search string: ${searchString}`
  );

  // Step 1: Use pipe function to process steps sequentially
  return pipe(searchString, [
    // Fetch embedding for the search string
    (text: string) => fetchEmbedding(text),
    // Calculate cosine similarities between search string embedding and token embeddings
    (searchEmbedding: number[]) =>
      calculateSimilarities(searchEmbedding, tokenEmbeddings, tokenArray),
    // Find and return the closest token based on highest similarity score
    (similarities: { token: string; similarity: number }[]) =>
      findClosest(similarities),
  ]);
};

// Main function to run the script
const main = async () => {
  const tokens = ["token1", "token2", "token3", "token50"];
  const searchString = process.argv[2];
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    logger.error("API key is not defined");
    return;
  }

  if (!searchString) {
    logger.error("Search string is not provided");
    return;
  }

  let tokenEmbeddings: number[][];

  try {
    // Fetch embeddings for all tokens in the array
    tokenEmbeddings = await Promise.all(
      tokens.map((token) => fetchEmbedding(token))
    );
    logger.info(`Fetched embeddings for all tokens`);
    logger.info(`Token embeddings: ${tokenEmbeddings}`);
  } catch (error) {
    logger.error("Error fetching token embeddings:", error);
    return;
  }

  try {
    // Find the closest token using the pre-fetched embeddings
    const closestToken = await findClosestToken(
      searchString,
      tokens,
      tokenEmbeddings
    );
    logger.info(`The closest token is: ${closestToken}`);
  } catch (error) {
    logger.error("Error finding closest token:", error);
  }
};

// Execute the main function
main();
