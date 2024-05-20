import { fetchJson, fetchBlob } from "./fetch.js";
import { createGridItem, updateGridItemWithJsonData } from "./components.js";
import { pipe, playSirenSound } from "./utilsFrontend.js";

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
const fetchImageAndAppendToGrid = (imageUrl, gridContainer) => {
  pipe(imageUrl, [
    fetchBlob,
    createObjectURL,
    createGridItemWithJsonData(imageUrl),
    appendToGrid(gridContainer),
  ]).catch((error) => console.error("Error fetching image:", error));
};

const createObjectURL = async (blobPromise) => {
  const blob = await blobPromise;
  return URL.createObjectURL(blob);
};

const createGridItemWithJsonData = (imageUrl) => async (imageObjectURL) => {
  const gridItem = createGridItem(imageUrl, imageObjectURL);
  try {
    const jsonData = await fetchJson(
      `/db/testImages/${imageUrl.split("/").pop()}.json`
    );
    updateGridItemWithJsonData(gridItem, jsonData);
  } catch (error) {
    console.warn(`No JSON data for image ${imageUrl}:`, error);
  }
  return gridItem;
};

const appendToGrid = (gridContainer) => (gridItem) => {
  gridContainer.appendChild(gridItem);
};
