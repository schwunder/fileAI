import axios from "axios";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { $ } from "bun";

const getConfig = (base64Img: string, prompt: string) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  payload: {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Img}` },
          },
        ],
      },
    ],
    max_tokens: 40,
  },
});

const fetchDescription = async (cfg: {
  headers: any;
  payload: any;
}): Promise<string> => {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    cfg.payload,
    { headers: cfg.headers }
  );
  return res.data.choices[0].message.content;
};

const updateFinderComment = (absPath: string, comment: string): void => {
  const script = `
    set filepath to POSIX file "${absPath}"
    set the_File to filepath as alias
    tell application "Finder" to set the comment of the_File to "${comment}"
  `.replace(/'/g, "'\\''");

  const command = `osascript -e '${script}'`;

  const result = Bun.spawnSync(["sh", "-c", command], {
    stdio: ["pipe", "pipe", "pipe"], // Capture stdout and stderr
  });
};

const fetchMetadata = async (
  comment: string
): Promise<{ tags: string[]; title: string }> => {
  const { object } = (await generateObject({
    schema: z.object({
      tags: z.array(z.string()),
      title: z.string(),
    }),
    model: createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o"),
    prompt: `${comment}---- Provide a fileTitle (under 5 words, kebab case) and 1-4 descriptive tags.`,
  })) as { object: { tags: string[]; title: string } };
  return object;
};

async function copyFile(srcPath: string, destPath: string) {
  const data = await Bun.file(srcPath).arrayBuffer();
  await Bun.write(destPath, new Uint8Array(data));
}

//const db: { imgPath: string; tempPath: string; comment: string; tags: string[] }[] = [];

async function main(): Promise<void> {
  const imgPath = "db/abc.png";
  const absPath = `${import.meta.dir}/${imgPath}`;
  const prompt = "What's in this image?";
  const fileBuffer = await Bun.file(absPath).arrayBuffer();
  const base64Img = Buffer.from(fileBuffer).toString("base64");
  const cfg = getConfig(base64Img, prompt);
  const description = await fetchDescription(cfg);
  const { tags, title } = await fetchMetadata(description);
  const tempPath = `db/${title}.png`;
  const absTempPath = `${import.meta.dir}/${tempPath}`;
  /*
  db.push({
    imgPath,
    tempPath,
    description,
    tags,
  });
  fs.writeFileSync("db/db.json", JSON.stringify(db, null, 2));
  */
  await copyFile(imgPath, tempPath);
  updateFinderComment(absTempPath, description);
  await $`tag -a "${tags.join(",")}" ${absTempPath}`;
}

main().catch(console.error);
