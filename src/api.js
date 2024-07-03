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
}

export async function writeData(absPath, newName, comment, tags) {
  const data = await fetchAPI("/mutateImageData", "POST", {
    absPath,
    newName,
    comment,
    tags,
  });
}
export async function addFolder(absPath, matchingTags) {
  await fetchAPI("/addFolder", "POST", { absPath, matchingTags });
}

export async function getDB() {
  return fetchAPI("/db");
}

export async function fetchEmbedding(searchString) {
  return fetchAPI("/fetchEmbedding", "POST", { searchString });
}

export async function tsneVisualization() {
  return fetchAPI("/tsneVisualization", "POST");
}

export async function filterTags(description, samples) {
  return fetchAPI("/filterTags", "POST", { description, samples });
}
