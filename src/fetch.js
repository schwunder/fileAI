export async function processImage(imageUrl) {
  try {
    const response = await fetch("/processImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imgPath: imageUrl }),
    });
    if (!response.ok) throw new Error("Network response was not ok");

    console.log("Image processed successfully");
  } catch (error) {
    throw new Error("Error processing image:", error);
  }
}

export async function writeData(title, description, tags) {
  try {
    const response = await fetch("/mutateImageData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, tags }),
    });
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    console.log("Data written successfully:", data);
  } catch (error) {
    throw new Error("Error writing data:", error);
  }
}
export async function fetchJsons() {
  try {
    const res = await fetch("http://localhost:3000/db/");
    return await res.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}
