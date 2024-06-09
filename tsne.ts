import * as tf from "@tensorflow/tfjs-node";
import "@tensorflow/tfjs-backend-webgl";
import * as d3 from "d3";
import * as fs from "fs";
import * as path from "path";
import { createCanvas, loadImage, Canvas, Image } from "@napi-rs/canvas";
import TSNE from "tsne-js";
import pino from "pino";
import { truncateLog } from "./utils"; // Adjust the path as necessary

// Initialize Pino logger
const logger = pino();

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const COLOR_SCALE = d3.scaleOrdinal(d3.schemeCategory10);
const IMAGE_FOLDER = "db/media";
const NUM_IMAGES = 12;

// Ensure canvas and context are properly initialized
const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
const context = canvas.getContext("2d");
if (!context) {
  logger.error("Failed to get 2D context");
  throw new Error("Failed to get 2D context");
}

// Example usage of context.clearRect
context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

// Read image files from the specified folder
const readImageFiles = (folder: string, numImages: number) => {
  logger.info(`Reading ${numImages} images from folder: ${folder}`);
  return fs.readdirSync(folder).slice(0, numImages);
};

const loadImagesFromFiles = (files: string[], folder: string) => {
  logger.info(`Loading images from files: ${truncateLog(files.join(", "))}`);
  return Promise.all(
    files.map((file) => {
      const filePath = path.join(folder, file);
      logger.info(`File path: ${filePath}, Type: ${typeof filePath}`);
      return loadImage(filePath);
    })
  );
};

// Convert an Image object to a Tensor
const convertImageToTensor = (image: Image) => {
  logger.info(
    `Converting image to tensor: ${truncateLog(image.src.toString())}`
  );
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);

  const { data, width, height } = imageData;
  const uint8Array = new Uint8Array(data.buffer);
  return tf.browser
    .fromPixels({ data: uint8Array, width, height })
    .resizeBilinear([28, 28])
    .toFloat()
    .div(tf.scalar(255));
};

// Stack multiple tensors into a single tensor
const stackImageTensors = (tensors: tf.Tensor[]) => {
  logger.info(`Stacking ${tensors.length} image tensors`);
  return tf.stack(tensors) as tf.Tensor4D;
};

export const loadAndProcessImages = async (
  folder: string,
  numImages: number
): Promise<tf.Tensor4D> => {
  logger.info(`Loading and processing images from folder: ${folder}`);
  const files = readImageFiles(folder, numImages);
  const images = await loadImagesFromFiles(files, folder);
  const tensors = images.map(convertImageToTensor);
  return stackImageTensors(tensors);
};

// Initialize t-SNE embedding using tsne-js
export const initializeTsneEmbedding = (data: number[][]): number[][] => {
  logger.info("Initializing t-SNE embedding");
  const tsne = new TSNE({
    dim: 2,
    perplexity: 30,
    earlyExaggeration: 4.0,
    learningRate: 100.0,
    nIter: 1000,
    metric: "euclidean",
  });

  tsne.init({ data });
  tsne.run();
  return tsne.getOutputScaled();
};

// Function to start t-SNE visualization and return the coordinates
export const startTsneVisualization = async (): Promise<number[][]> => {
  logger.info("Starting t-SNE visualization");
  const numImages = NUM_IMAGES;
  const folder = IMAGE_FOLDER;
  const imageTensors = await loadAndProcessImages(folder, numImages);
  const imageData = imageTensors.arraySync();
  const flattenedData = imageData.map((img) => img.flat(2)); // Flatten the 3D array to 2D
  const tsneCoordinates = initializeTsneEmbedding(flattenedData);

  logger.info("t-SNE visualization complete");
  return tsneCoordinates;
};

// // Main function to execute the script
// const main = async () => {
//   try {
//     const coordinates = await startTsneVisualization();
//     console.log("t-SNE Coordinates:", coordinates);
//   } catch (error) {
//     logger.error("Error during t-SNE visualization:", error);
//   }
// };

// // Execute the main function
// main();
