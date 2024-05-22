import copyToDB from "./copyToDB";
import processImage from "./processImage";
import pino from "pino";
import pretty from "pino-pretty";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

type imageMeta = {
  imgPath: string;
  tags: string[];
  title: string;
  description: any;
  timeStamp: number;
};

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

const testMain = async (directoryPath: string) => {
  try {
    logger.info("Starting main execution...");
    let filePaths = ["sdsf", "sdf"];
    try {
      filePaths = await copyToDB(directoryPath);
      const paths = filePaths.join(",");
      logger.info(`Files copied to DB: ${paths}`);
    } catch (error) {
      logger.error("Error copying files to DB:", error);
      // If you want to stop execution in case of an error, uncomment the next line
      // throw error;
    }

    // const imageDetails = await processImages(filePaths);
    // imageDetails.forEach((details) => logger.info(details));
    // const processedFiles = filePaths ? filePaths.join(", ") : "No files processed";
    // logger.info("Files processed:", processedFiles);
    return filePaths;
  } catch (error) {
    logger.error("Error in test execution:", error);
    throw error;
  }
};

// Run the test
await testMain("/Users/alien/Projects/testImages/")
  .then((filePaths) =>
    logger.info("Test execution completed successfully", filePaths[0])
  )
  .catch((error) => logger.error("Test execution failed", error));
