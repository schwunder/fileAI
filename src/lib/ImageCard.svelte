<script>
  import { processImage, writeData } from "../fetch";

  export let metaData;
  let selectedTag = null;

  function toggleSelected(tag) {
    selectedTag = selectedTag === tag ? null : tag;
  }
</script>

<div class="item">
  <div class="picture">
    <div class="box">
      <p class="header">{metaData.imgPath.split("/").pop()}</p>
      <input type="checkbox" />
    </div>
    <button on:click={() => processImage(metaData.imgPath)}>
      <img src={`http://localhost:3000/${metaData.imgPath}`} alt={""} />
    </button>
  </div>
  <div class="meta-data">
    <span>Title:</span>
    <span class="title" contenteditable="true">{metaData.title}</span>
    <div>
      <span>Tags</span>
      {#each metaData.tags as tag}
        <button
          class="tag-button {selectedTag === tag ? 'selected' : ''}"
          on:click={() => toggleSelected(tag)}
        >
          <span class="tags">{tag}</span>
        </button>
      {/each}
    </div>
    <span>Description:</span>
    <span class="description">{metaData.description}</span>
  </div>
  <div class="action-buttons">
    <button
      class="write-button"
      on:click={() =>
        writeData(metaData.title, metaData.description, metaData.tags)}
      >Write</button
    >
    <button class="discard-button" on:click={() => {}}>Discard</button>
  </div>
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
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
  }
  .write-button {
    background-color: blue;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  .discard-button {
    background-color: yellow;
    color: black;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  button {
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
  }
  .meta-data {
    width: 100%;
    height: auto; /* Adjust the height as needed */
    overflow: auto;
    white-space: pre-wrap;
    background-color: #f9f9f9;
    padding: 5px;
    box-sizing: border-box;
    border-top: 1px solid #ccc;
  }
  .title[contenteditable="true"] {
    border: 1px dashed #ccc;
    padding: 2px;
  }
  .title {
    font-weight: normal;
    margin-left: 10px;
  }
  .description {
    font-family: Arial, sans-serif;
    color: #333;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  .tag-button {
    background-color: green;
    color: white;
    border: none;
    padding: 5px;
    margin: 2px;
    cursor: pointer;
  }

  .tag-button.selected {
    background-color: red;
  }
  .tags {
    font-weight: normal;
    margin-left: 10px;
  }
  span {
    display: block;
    margin: 5px 0;
    font-weight: bold;
  }
  button {
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
  }
  img {
    max-width: 100%;
    max-height: 150px; /* Adjust the height as needed */
    object-fit: contain;
    margin-bottom: 10px;
  }
  .box {
    display: flex;
    align-items: center;
    margin: 1rem;
  }
  .header {
    margin: 5px 0;
    font-weight: bold;
  }
  .picture {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
