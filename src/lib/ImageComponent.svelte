<script>
  import Header from "./ImageHeader.svelte";
  import Button from "./ImageButton.svelte";
  import JsonData from "./ImageJsonData.svelte";
  import Choices from "./ImageChoices.svelte";

  export let imageData;

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

  async function writeData(title, description, tags) {
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
      console.error("Error writing data:", error);
    }
  }

  function decomposeImageData(data) {
    console.log(data);
    return {
      text: data.imgPath.split("/").pop(),
      button: { imageSrc: data.src, onClick: () => processImage(data.imgPath) }, // Use processImage function
      jsonData: {
        title: data.title,
        tags: data.tags,
        description: data.description,
      },
      choices: {
        onWrite: () => writeData(data.title, data.description, data.tags),
        onDiscard: () => {},
      },
    };
  }

  const { text, button, jsonData, choices } = decomposeImageData(imageData);
  console.log(text, button, jsonData, choices);
</script>

<div class="grid-item">
  <Header {text} />
  <Button {...button} />
  <JsonData {...jsonData} />
  <Choices {...choices} />
</div>

<style>
  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
  }
</style>
