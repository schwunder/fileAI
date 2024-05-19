import { fetchJson, fetchBlob } from "./fetch.js";
import { createGridItem, updateGridItemWithJsonData } from "./components.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const images = await fetchJson("/testImages");
    const gridContainer = document.getElementById("imageGrid");

    images.forEach((imageUrl) => {
      fetchImageAndAppendToGrid(imageUrl, gridContainer);
    });
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

// Event handling logic
async function fetchImageAndAppendToGrid(imageUrl, gridContainer) {
  try {
    const imageBlob = await fetchBlob(imageUrl);
    const imageObjectURL = URL.createObjectURL(imageBlob);

    const gridItem = createGridItem(imageUrl, imageObjectURL);
    gridContainer.appendChild(gridItem);

    const jsonData = await fetchJson(
      `/db/testImages/${imageUrl.split("/").pop()}.json`
    );
    updateGridItemWithJsonData(gridItem, jsonData);
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}
