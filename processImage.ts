import axios from "axios";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { pipe } from "./utils";

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

export default async function processImage(imgPath: string): Promise<void> {
  //check if file in db.json already processed -> skip

  const absPath = `${import.meta.dir}/${imgPath}`;

  const description = await pipe(absPath, [
    Bun.file,
    async (file: File) => await file.arrayBuffer(),
    Buffer.from,
    (buffer: Buffer) => buffer.toString("base64"),
    getImageDescription,
    (getDescription: (prompt: string) => Promise<string>) =>
      getDescription(
        `What's in this image? Be concise and use under ${maxDescriptionLength} tokens`
      ),
  ]);
  getMetadata(description).then(({ tags, title }) => {
    const imageData = {
      imgPath,
      tags,
      title,
      description,
    };
    //validate with zod
    const imageDataSchema = z.object({
      imgPath: z.string(),
      tags: z.array(z.string()),
      title: z.string(),
      description: z.string(),
    });
    imageDataSchema.parse(imageData);
    Bun.write(
      `db/${imgPath}.json`,

      JSON.stringify(imageData, null, 2)
    );
  });
}
