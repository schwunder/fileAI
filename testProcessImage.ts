import { processImage } from "./processImage";
import pino from "pino";
import pretty from "pino-pretty";

const logger = pino(
  pretty({
    colorize: true,
    translateTime: true,
    ignore: "pid,hostname",
  })
);

const testImagePath = "db/media/1.png"; // Update this path to your test image
type imageMeta = {
  imgPath: string;
  tags: string[];
  title: string;
  description: any;
  timeStamp: number;
};
const filePaths = [
  "db/media/8.png",
  "db/media/9.png",
  "db/media/12.png",
  "db/media/11.png",
  "db/media/10.png",
  "db/media/4.png",
  "db/media/5.png",
  "db/media/7.png",
  "db/media/6.png",
  "db/media/2.png",
  "db/media/3.png",
  "db/media/1.png",
];
async function processImages(filePaths: string[]): Promise<imageMeta[]> {
  const imageDetails = [];
  for (const filePath of filePaths) {
    try {
      logger.info(`Processing image: ${filePath}`);
      const details = await processImage(filePath);
      imageDetails.push(details);
      logger.info(`Processed image: ${filePath}`);
    } catch (error) {
      logger.error(`Error processing image ${filePath}:`, error);
    }
  }
  return imageDetails;
}

async function test() {
  try {
    logger.info(`Testing processImage with ${testImagePath}`);
    const result = await processImages(filePaths);
    const results = result.map((res) => JSON.stringify(res)).join(",");
    logger.info(`Files copied to DB: ${results}`);
    logger.info("Process Image Result:", result);
  } catch (error) {
    logger.error("Error during processImage test:", error);
  }
}

test();
