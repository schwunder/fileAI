<script>
  import Header from "./ImageHeader.svelte";
  import Button from "./ImageButton.svelte";
  import JsonData from "./ImageJsonData.svelte";
  import Choices from "./ImageChoices.svelte";

  export let imageData;

  function decomposeImageData(data) {
    console.log(data);
    return {
      text: data.imgPath.split("/").pop(),
      button: { imageSrc: data.src, onClick: () => console.log(data.src) }, // Pass src directly to Button
      jsonData: {
        title: data.title,
        tags: data.tags,
        description: data.description,
      },
      choices: {
        onWrite: () => {},
        onRetry: () => {},
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
