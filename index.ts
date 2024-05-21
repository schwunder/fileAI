import express from "express";
import type { Request, Response } from "express";
import { glob } from "glob";
import { readFile } from "fs/promises";
import processImage from "./processImage";
import mutateImageData from "./mutateImageData";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/db", async (req: Request, res: Response) => {
  try {
    const files = await glob.sync("./db/testJsons/*.json");
    const jsonData = await Promise.all(
      files.map(async (file) => JSON.parse(await readFile(file, "utf8")))
    );
    res.send(jsonData);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

app.get("/testImages/*", async (req: Request, res: Response) => {
  const filePath = `.${req.path}`;
  const file = await readFile(filePath);
  res.type("png").send(file);
});

app.post("/processImage", async (req: Request, res: Response) => {
  const { imgPath }: { imgPath: string } = req.body;
  await processImage(imgPath);
  res.sendStatus(200);
});

app.post("/mutateImageData", async (req: Request, res: Response) => {
  const {
    absPath,
    comment,
    tags,
  }: { absPath: string; comment: string; tags: string[] } = req.body;
  await mutateImageData(absPath, comment, tags);
  res.send({ message: "Data written successfully" });
});

app.use((req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
