import OpenAI from "openai";

export const maxDescriptionLength = 50;
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const fetchEmbeddingUpdated = async (
  text: string
): Promise<number[]> => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // Updated model
      input: text,
      encoding_format: "float",
    });

    if (
      response &&
      response.data &&
      response.data[0] &&
      response.data[0].embedding
    ) {
      return response.data[0].embedding;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    throw new Error(`Error fetching embedding for text: ${text}`);
  }
};

async function main() {
  const text = "Your input text here";
  try {
    const embedding = await fetchEmbeddingUpdated(text);
    console.log("Embedding:", embedding);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
