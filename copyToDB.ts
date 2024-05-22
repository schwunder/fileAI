import { $ } from "bun";
import { readdir } from "fs/promises";
import { join } from "path";
import { pipe } from "./utils";
import { processImages } from "./processImage";

// const absoluteDirectoryPath = "/Users/alien/Projects/testImages/";

export async function copyToDB(absoluteDirectoryPath: string) {
  try {
    await $`cp ${absoluteDirectoryPath}/* db/media/`;
    const files = await readdir("db/media/");
    return files.map((file) => join("db/media/", file)); //todo: tag processed media in DB.
  } catch (error) {
    throw new Error("Error copying files to DB:" + error);
  }
}

export async function postImageDetails(
  imageDetails: {
    imgPath: string;
    tags: string[];
    title: string;
    description: string;
    timeStamp: number;
  }[]
) {
  for (const details of imageDetails) {
    try {
      const response = await fetch("http://localhost:9000/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw new Error("Error posting image:" + error);
    }
  }
}

export async function folderToDB(absoluteDirectoryPath: string) {
  return await pipe(absoluteDirectoryPath, [
    copyToDB,
    processImages,
    postImageDetails,
  ]);
}
