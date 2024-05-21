<script>
  import Header from "./IHeader.svelte";
  import Button from "./IButton.svelte";
  import JsonData from "./IJsonData.svelte";
  import Choices from "./IChoices.svelte";
  import { processImage, writeData } from "../fetch";

  export let data;
</script>

<div class="item">
  <Header text={data.imgPath.split("/").pop()} />
  <Button
    imageSrc={`http://localhost:3000/${data.imgPath}`}
    onClick={() => processImage(data.imgPath)}
  />
  <JsonData
    title={data.title}
    tags={data.tags}
    description={data.description}
  />
  <Choices
    onWrite={() => writeData(data.title, data.description, data.tags)}
    onDiscard={() => {}}
  />
</div>

<style>
  .item {
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
