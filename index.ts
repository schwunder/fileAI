import axios from "axios";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { $ } from "bun";

const getImageDescription = async (
  base64Img: string,
  prompt: string
): Promise<string> => {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
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
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
  return res.data.choices[0].message.content;
};

const getMetadata = async (
  comment: string
): Promise<{ tags: string[]; title: string }> => {
  const { object } = (await generateObject({
    schema: z.object({ tags: z.array(z.string()), title: z.string() }),
    model: createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o"),
    prompt: `${comment}---- Provide a fileTitle (under 5 words, kebab case) and 1-4 descriptive tags.`,
  })) as { object: { tags: string[]; title: string } };
  return object;
};

const updateFinderComment = (absPath: string, comment: string): void => {
  Bun.spawnSync([
    "osascript",
    "-e",
    `
    set filepath to POSIX file "${absPath}"
    set the_File to filepath as alias
    tell application "Finder" to set the comment of the_File to "${comment}"
  `.replace(/'/g, "'\\''"),
  ]);
};

async function main(): Promise<void> {
  const imgPath = "db/abc.png";
  const absPath = `${import.meta.dir}/${imgPath}`;
  const fileBuffer = await Bun.file(absPath).arrayBuffer();
  const base64Img = Buffer.from(fileBuffer).toString("base64");

  const description = await getImageDescription(
    base64Img,
    "What's in this image?"
  );
  const { tags, title } = await getMetadata(description);
  const tempPath = `db/${title}.png`;
  const absTempPath = `${import.meta.dir}/${tempPath}`;

  await Bun.write(
    "db/db.json",
    JSON.stringify([{ imgPath, tempPath, description, tags }], null, 2)
  );
  await Bun.write(tempPath, new Uint8Array(fileBuffer));
  updateFinderComment(absTempPath, description);
  await $`tag -a "${tags.join(",")}" ${absTempPath}`;
}

main().catch(console.error);
