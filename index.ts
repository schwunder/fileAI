import axios from "axios";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { $, FileBlob } from "bun";
import { descriptor } from "effect/Effect";

const isPromise = (val: any): val is Promise<any> =>
  val && typeof val.then === "function";

const pipe = (initialValue: any, fns: any[]) => {
  return fns.reduce((acc, fn) => {
    return isPromise(acc) ? acc.then(fn) : fn(acc);
  }, initialValue);
};
const maxDescriptionLength = 50;
const getImageDescription =
  (base64Img: string) =>
  async (prompt: string): Promise<string> => {
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
        max_tokens: maxDescriptionLength,
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

const updateFinderComment =
  (absPath: string) =>
  (comment: string): void => {
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

const getMethod = (key) => (obj) => obj[key];

async function main(imgPath: string): Promise<void> {
  //check if file in db.json already processed -> skip

  const absPath = `${import.meta.dir}/${imgPath}`;

  const description = await pipe(absPath, [
    Bun.file,
    async (file) => await file.arrayBuffer(),
    Buffer.from,
    (buffer) => buffer.toString("base64"),
    getImageDescription,
    (getDescription) =>
      getDescription(
        `What's in this image? Be concise and use under ${maxDescriptionLength} tokens`
      ),
  ]);
  getMetadata(description).then((meta) =>
    Bun.write(
      "db/db2.json",
      JSON.stringify([{ imgPath, ...meta, description }], null, 2)
    )
  );

  // const updateComment = updateFinderComment(absTempPath);
  // updateComment(description);

  // await $`tag -a "${tags.join(",")}" ${absTempPath}`;
}

main("db/abc.png").catch(console.error);
