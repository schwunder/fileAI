export function createGridItem(imageUrl, imageObjectURL) {
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item");

  const imageName = document.createElement("p");
  imageName.textContent = imageUrl.split("/").pop();
  gridItem.appendChild(imageName);

  const buttonElement = document.createElement("button");
  const imgElement = document.createElement("img");
  imgElement.src = imageObjectURL;
  buttonElement.appendChild(imgElement);
  buttonElement.onclick = () => processImage(imageUrl);
  gridItem.appendChild(buttonElement);

  const jsonDataElement = document.createElement("div");
  jsonDataElement.classList.add("json-data");
  gridItem.appendChild(jsonDataElement);

  return gridItem;
}

export function updateGridItemWithJsonData(gridItem, jsonData) {
  const jsonDataElement = gridItem.querySelector(".json-data");
  jsonDataElement.innerHTML = `
    <span>Title:</span><span class="title">${jsonData[0].title}</span>
    <span>Tags:</span><span class="tags">${jsonData[0].tags.join(", ")}</span>
    <span>Description:</span><span class="description">${
      jsonData[0].description
    }</span>
  `;
}

async function processImage(imageUrl) {
  try {
    const response = await fetch("/processImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imgPath: imageUrl }),
    });
    if (!response.ok) throw new Error("Network response was not ok");

    console.log("Image processed successfully");
  } catch (error) {
    console.error("Error processing image:", error);
  }
}
