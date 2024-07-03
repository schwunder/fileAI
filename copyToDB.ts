import { $ } from "bun";
import { readdir } from "fs/promises";
import { join } from "path";
import { pipe } from "./utils";
import { processImages } from "./processImage";
import { DB } from "./db.ts";
import { truncateLog } from "./utils";

//todo given tags in payload
//todo given tags in payload
//todo add other file types and categorize ui based on file type
//also just display pdf like image
export async function copyToDB(absoluteDirectoryPath: string) {
  try {
    // Copy only .png files to db/media/
    await $`cp ${absoluteDirectoryPath}/*.png db/media/`;

    // Read the files in the destination directory
    const files = await readdir("db/media/");

    // Return the list of copied .png files
    return files
      .filter((file) => file.endsWith(".png"))
      .map((file) => join("db/media/", file));
  } catch (error) {
    throw new Error(truncateLog("Error copying files to DB: " + error));
  }
}

export async function postImageDetails(
  imageDetails: {
    imgPath: string;
    tags: string[];
    title: string;
    description: string;
    matchingTags: string[];
    timeStamp: number;
  }[]
) {
  return Promise.all(
    imageDetails.map((imageDetail) => DB({ method: "POST", body: imageDetail }))
  );
}

export async function folderToDB(
  absoluteDirectoryPath: string,
  matchingTags: string[]
) {
  console.log("folderToDB", absoluteDirectoryPath, matchingTags);
  return await pipe(absoluteDirectoryPath, [
    copyToDB,
    (filePaths: string[]) => processImages(filePaths, matchingTags), // Explicitly typed
    postImageDetails,
  ]);
}
