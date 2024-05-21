const API_BASE_URL = "http://localhost:3000";

async function fetchAPI(endpoint, method = "GET", data = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (method === "GET") {
    return response.json();
  }
}

export async function processImage(imageUrl) {
  await fetchAPI("/processImage", "POST", { imgPath: imageUrl });
  console.log("Image processed successfully");
}

export async function writeData(title, description, tags) {
  const data = await fetchAPI("/mutateImageData", "POST", {
    title,
    description,
    tags,
  });
  console.log("Data written successfully:", data);
}

export async function getDB() {
  return fetchAPI("/db");
}
