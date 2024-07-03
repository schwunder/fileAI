import { file } from "bun";
import path from "path";
import axios from "axios";
import sharp from "sharp";
import convert from "heic-convert";

const maxDescriptionLength = 4096;
const maxImageSizeMB = 20;

const getImageDescription = async (
  base64Img: string,
  prompt: string
): Promise<string> => {
  const requestBody = {
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
  };

  try {
    const res = await axios.post<{
      choices: { message: { content: string } }[];
    }>("https://api.openai.com/v1/chat/completions", requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    return res.data.choices[0].message.content;
  } catch (error) {
    let errorMessage = `Error sending request to OpenAI: `;
    if (axios.isAxiosError(error) && error.response) {
      errorMessage += JSON.stringify(error.response.data);
    } else {
      errorMessage += (error as Error).message;
    }
    throw new Error(errorMessage);
  }
};

const processImage = async (imgPath: string, prompt: string): Promise<void> => {
  try {
    const imgFile = Bun.file(imgPath);
    const mimeType = imgFile.type;

    let imgBuffer = await imgFile.arrayBuffer();
    let imgSizeMB = imgBuffer.byteLength / (1024 * 1024);

    // Convert HEIF to JPEG if necessary
    if (
      imgPath.endsWith(".heic") ||
      imgPath.endsWith(".heif") ||
      mimeType === "image/heif" ||
      mimeType === "image/heic"
    ) {
      try {
        const arrayBuffer = imgBuffer;
        const convertedBuffer = await convert({
          buffer: arrayBuffer, // the HEIC file buffer
          format: "JPEG", // output format
          quality: 1, // the jpeg compression quality, between 0 and 1
        });
        imgBuffer = convertedBuffer as ArrayBuffer;
      } catch (conversionError) {
        console.error("Error converting HEIF to JPEG:", conversionError);
        return;
      }
    }

    // Re-encode the image to strip metadata
    try {
      const jpegBuffer = await sharp(Buffer.from(imgBuffer))
        .jpeg({ quality: 80 })
        .toBuffer();

      imgBuffer = jpegBuffer.buffer as ArrayBuffer;
      imgSizeMB = imgBuffer.byteLength / (1024 * 1024);
    } catch (sharpError) {
      console.error("Error processing image with sharp:", sharpError);
      throw sharpError;
    }

    // Check image size
    if (imgSizeMB > maxImageSizeMB) {
      console.log(
        `Image size (${imgSizeMB.toFixed(
          2
        )}MB) exceeds the maximum allowed size (${maxImageSizeMB}MB).`
      );
      return;
    }

    const base64Img = Buffer.from(imgBuffer).toString("base64");

    const description = await getImageDescription(base64Img, prompt);
    console.log("Image Description:", description);
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

// Main function to read image and call processImage
const main = async () => {
  const imgPath = path.join(import.meta.dir, "db", "media", "1.png");
  const prompt = `What's in this image? Be and use close to but not more than ${maxDescriptionLength} tokens`;
  await processImage(imgPath, prompt);
};

main();
