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
    await $`cp ${absoluteDirectoryPath}/* db/media/`;
    const files = await readdir("db/media/");
    return files.map((file) => join("db/media/", file)); //todo: tag processed media in DB.
  } catch (error) {
    throw new Error(truncateLog("Error copying files to DB:" + error));
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
  return Promise.all(
    imageDetails.map((imageDetail) => DB({ method: "POST", body: imageDetail }))
  );
}

export async function folderToDB(absoluteDirectoryPath: string) {
  return await pipe(absoluteDirectoryPath, [
    copyToDB,
    processImages,
    postImageDetails,
  ]);
}
