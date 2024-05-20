import { pipe } from "./utilsFrontend.js";
import { triggerConfetti, playSirenSound } from "./utilsFrontend.js";

export function createGridItem(imageUrl, imageObjectURL) {
  return pipe(null, [
    () => createElementWithClass("div", "grid-item"),
    (gridItem) => {
      const imageName = createElementWithText("p", extractFileName(imageUrl));
      gridItem.appendChild(imageName);
      return gridItem;
    },
    (gridItem) => {
      const buttonElement = createButtonWithImage(imageObjectURL, () =>
        processImage(imageUrl)
      );
      gridItem.appendChild(buttonElement);
      return gridItem;
    },
    (gridItem) => {
      const jsonDataElement = createElementWithClass("div", "json-data");
      gridItem.appendChild(jsonDataElement);
      return gridItem;
    },
  ]);
}

export function updateGridItemWithJsonData(gridItem, jsonData) {
  const jsonDataElement = gridItem.querySelector(".json-data");
  jsonDataElement.innerHTML = generateJsonDataHtml(jsonData[0]);

  addEventListeners(jsonDataElement);
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

// Helper Functions
function createElementWithClass(tag, className) {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
}

function createElementWithText(tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function createButtonWithImage(imageSrc, onClick) {
  const button = document.createElement("button");
  const img = document.createElement("img");
  img.src = imageSrc;
  button.appendChild(img);
  button.onclick = () => {
    onClick();
    triggerConfetti();
    playSirenSound();
  };
  return button;
}

function extractFileName(url) {
  return url.split("/").pop();
}

function generateJsonDataHtml(data) {
  return `
    <span>Title:</span><span class="title" contenteditable="true">${
      data.title
    }</span>
    <span>Tags:</span><span class="tags">${data.tags
      .map((tag) => `<button class="tag-button">${tag}</button>`)
      .join("")}</span>
    <span>Description:</span><span class="description">${
      data.description
    }</span>
    <div class="action-buttons">
      <button class="write-button">Write</button>
      <button class="retry-button">Retry</button>
      <button class="discard-button">Discard</button>
    </div>
  `;
}

function addEventListeners(jsonDataElement) {
  jsonDataElement.querySelectorAll(".tag-button").forEach((button) => {
    button.addEventListener("click", () => button.classList.toggle("selected"));
  });

  jsonDataElement
    .querySelector(".write-button")
    .addEventListener("click", () => {
      console.log("Write button clicked");
      // handleWriteButtonClick(jsonDataElement);
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

function handleWriteButtonClick(jsonDataElement) {
  const title = jsonDataElement.querySelector(".title").textContent;
  const description = jsonDataElement.querySelector(".description").textContent;
  const tags = Array.from(
    jsonDataElement.querySelectorAll(".tag-button.selected")
  ).map((button) => button.textContent);

  fetch("/writeData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, tags }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Data written successfully:", data))
    .catch((error) => console.error("Error writing data:", error));
}
