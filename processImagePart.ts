import { readdir } from "node:fs/promises";
import { $ } from "bun";
import pino from "pino";
import path from "path";
import os from "os";

const logger = pino({ level: "info" });

const homeDir = os.homedir();
const sourceFolderPath = path.resolve(homeDir, "db/mediaTest");
const destinationFolderPath = path.resolve(homeDir, "db/mediaTestTwo");

async function main() {
  logger.info("Starting the process...");

  // Log the source and destination folder paths
  logger.info(`Source folder path: ${sourceFolderPath}`);
  logger.info(`Destination folder path: ${destinationFolderPath}`);

  // List files using Node.js readdir
  try {
    const files = await readdir(sourceFolderPath);
    logger.info(`Files listed by readdir: ${files.join(", ")}`);
  } catch (error) {
    logger.error(`Failed to list files using readdir: ${error.message}`);
  }

  // Read directory contents
  let files;
  try {
    files = await readdir(sourceFolderPath);
    logger.info(
      `Read ${files.length} files from source folder: ${sourceFolderPath}`
    );
  } catch (error) {
    logger.error(`Failed to read source folder: ${error.message}`);
    throw error;
  }

  // Ensure files is defined
  if (files && files.length > 0) {
    // Log the files read
    logger.info(`Files read: ${files.join(", ")}`);

    // Sort files: PNGs first, then JPEGs
    files.sort((a, b) => {
      const extA = a.split(".").pop()?.toLowerCase();
      const extB = b.split(".").pop()?.toLowerCase();

      if (extA === extB) {
        return a.localeCompare(b);
      }

      if (extA === "png") {
        return -1;
      }
      if (extB === "png") {
        return 1;
      }
      return a.localeCompare(b);
    });

    logger.info("Sorted files with PNGs first.");

    // Loop through the sorted files and move them to the new folder
    for (let i = 0; i < files.length; i++) {
      const oldPath = path.resolve(sourceFolderPath, files[i]);
      const newPath = path.resolve(destinationFolderPath, `${i + 1}`);
      logger.info(`Moving file from ${oldPath} to ${newPath}`);
      try {
        await $`mv ${oldPath} ${newPath}`;
        logger.info(`Moved file from ${oldPath} to ${newPath}`);
      } catch (error) {
        logger.error(
          `Failed to move file from ${oldPath} to ${newPath}: ${error.message}`
        );
      }
    }
  } else {
    logger.warn("No files found in the source folder.");
  }
}

main().catch((err) => logger.error(`Main process error: ${err.message}`));

// create sample tags
// done
// also find better tags in the next step with each iteration
// find better photos
// send the tagging port with the array of tags
// endings in the folder are heic, png, jpeg.
// remove heic is special case
// done
// preprocess
// rename all the photos with just a number to the amount of photos in the folder
// also make the pngs the first numbers of the array
// relative path from here is /db/mediaTest/
// use bun scripting
// than use bun run processImagePart.ts
// issues might occur while renaming since the picture paht does not exist afterwards

// const sampleTags = [
//   "screenshot",
//   "passport",
//   "document",
//   "bill",
//   "family",
//   "city",
//   "vacation",
//   "landscape",
//   "pet",
//   "art",
//   "male",
//   "female",
// ];
