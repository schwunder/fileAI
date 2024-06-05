import axios from "axios";
import pino from "pino";
const logger = pino();

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const truncateLog = (
  message: string,
  maxLength: number = 500
): string => {
  return message.length > maxLength
    ? message.substring(0, maxLength) + "..."
    : message;
};

export const isPromise = (val: any): val is Promise<any> =>
  val && typeof val.then === "function";

export const pipe = (initialValue: any, fns: any[]) => {
  return fns.reduce((acc, fn) => {
    return isPromise(acc) ? acc.then(fn) : fn(acc);
  }, initialValue);
};

// Function to compute cosine similarity between two vectors
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

export const retryWithExponentialBackoff = async <T>(
  func: (...args: any[]) => Promise<T>,
  args: any[],
  maxRetries = 3,
  initialDelay = 2000
): Promise<T> => {
  let retries = 0;
  let delayTime = initialDelay;

  while (retries < maxRetries) {
    try {
      logger.info(
        truncateLog(`Attempt ${retries + 1} for function ${func.name}`)
      );
      return await func(...args);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        retries++;
        logger.warn(
          truncateLog(
            `Rate limit hit. Retrying in ${delayTime} milliseconds (Attempt ${retries})`
          )
        );
        await delay(delayTime);
        delayTime *= 2;
      } else {
        logger.error(
          truncateLog(
            `Error in function ${func.name}: ${(error as Error).message}`
          )
        );
        throw error;
      }
    }
  }
  logger.error(truncateLog("Max retries exceeded"));
  throw new Error(truncateLog("Max retries exceeded"));
};
