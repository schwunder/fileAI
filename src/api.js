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

  if (method === "GET" || method === "POST") {
    return response.json();
  }
  return response;
}

export async function processImage(imageUrl) {
  await fetchAPI("/processImage", "POST", { imgPath: imageUrl });
  console.log("Image processed successfully");
}

export async function writeData(absPath, newName, comment, tags) {
  const data = await fetchAPI("/mutateImageData", "POST", {
    absPath,
    newName,
    comment,
    tags,
  });
  console.log("Data written successfully:", data);
}
export async function addFolder(absPath) {
  await fetchAPI("/addFolder", "POST", { absPath });
}

export async function getDB() {
  return fetchAPI("/db");
}

export async function fetchEmbedding(searchString) {
  return fetchAPI("/fetchEmbedding", "POST", { searchString });
}

export async function startTsneVisualization() {
  return fetchAPI("/startTsneVisualization", "POST");
}
