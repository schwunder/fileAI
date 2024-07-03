import express from "express";
import type { Request, Response } from "express";
import { glob } from "glob";
import { readFile } from "fs/promises";
import { processImage } from "./processImage";
import { fetchEmbedding } from "./processImage";
import mutateImageData from "./mutateImageData";
import cors from "cors";
import { folderToDB } from "./copyToDB";
import { truncateLog } from "./utils";
import { runTsneVisualization } from "./tsne";
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/db/media", express.static("db/media"));

app.get("/db", async (req: Request, res: Response) => {
  try {
    const files = glob.sync("./db/testJsons/*.json");
    const jsonData = await Promise.all(
      files.map(async (file) => JSON.parse(await readFile(file, "utf8")))
    );
    res.status(200).send(jsonData);
  } catch (error) {
    res.status(500).send({
      message: `Error getting db: ${truncateLog((error as Error).message)}`,
    });
  }
});

app.post("/processImage", async (req: Request, res: Response) => {
  try {
    const {
      imgPath,
      matchingTags,
    }: { imgPath: string; matchingTags: string[] } = req.body;
    await processImage(imgPath, matchingTags);
    res.status(200).send({ message: "Image processed" });
  } catch (error) {
    res.status(500).send({
      message: `Error processing Image: 
    ${truncateLog((error as Error).message)}`,
    });
  }
});

app.post("/mutateImageData", async (req: Request, res: Response) => {
  try {
    const {
      absPath,
      newName,
      comment,
      tags,
    }: { absPath: string; newName: string; comment: string; tags: string[] } =
      req.body;
    await mutateImageData(absPath, newName, comment, tags);
    res.status(200).send({ message: "Data written successfully" });
  } catch (error) {
    res.status(500).send({
      message: `Error mutating Image Data:
      ${truncateLog((error as Error).message)}`,
    });
  }
});

app.post("/addFolder", async (req: Request, res: Response) => {
  logger.info("POST /addFolder request received");
  try {
    const {
      absPath,
      matchingTags,
    }: { absPath: string; matchingTags: string[] } = req.body;
    logger.info({ absPath, matchingTags }, "Processing addFolder request");
    await folderToDB(absPath, matchingTags);
    res.status(200).send({ message: "Folder added" });
  } catch (error) {
    logger.error({ error }, "Error adding Folder");
    res.status(500).send({
      message: `Error adding Folder: 
      ${truncateLog((error as Error).message)}`,
    });
  }
});

app.post("/fetchEmbedding", async (req: Request, res: Response) => {
  try {
    const { searchString }: { searchString: string } = req.body;
    const embedding = await fetchEmbedding(searchString);
    res.status(200).json({ embedding });
  } catch (error) {
    res.status(500).send({
      message: `Error fetching embedding:
      ${truncateLog((error as Error).message)} `,
    });
  }
});

app.post("/assignTags", async (req: Request, res: Response) => {
  try {
    const { tags }: { tags: string[] } = req.body;
    //await assignTags(tags);
    res.status(200).send({ message: "Tags assigned" });
  } catch (error) {
    res.status(500).send({
      message: `Error assigning tags:
      ${truncateLog((error as Error).message)}`,
    });
  }
});

app.post("/tsneVisualization", async (req: Request, res: Response) => {
  try {
    const coordinates = await runTsneVisualization();
    res.status(200).json({ coordinates });
  } catch (error) {
    res.status(500).send({
      message: `Error starting t-SNE visualization:
      ${truncateLog((error as Error).message)}`,
    });
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

app.listen(3000, () => {
  logger.info("Listening on http://localhost:3000");
});
