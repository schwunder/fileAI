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
    <span>Title:</span><span class="title" contenteditable="true">${
      jsonData[0].title
    }</span>
    <span>Tags:</span><span class="tags">${jsonData[0].tags
      .map((tag) => `<button class="tag-button">${tag}</button>`)
      .join("")}</span>
    <span>Description:</span><span class="description">${
      jsonData[0].description
    }</span>
    <div class="action-buttons">
      <button class="write-button">Write</button>
      <button class="retry-button">Retry</button>
      <button class="discard-button">Discard</button>
    </div>
  `;

  // Add event listeners for tag buttons
  const tagButtons = jsonDataElement.querySelectorAll(".tag-button");
  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("selected");
    });
  });

  // Add event listeners for action buttons
  jsonDataElement
    .querySelector(".write-button")
    .addEventListener("click", () => {
      console.log("Write button clicked");
    });
  jsonDataElement
    .querySelector(".retry-button")
    .addEventListener("click", () => {
      console.log("Retry button clicked");
    });
  jsonDataElement
    .querySelector(".discard-button")
    .addEventListener("click", () => {
      console.log("Discard button clicked");
    });
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
