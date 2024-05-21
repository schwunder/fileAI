<script>
  import { processImage, writeData } from "../api";

  export let metaData;
  let selectedTag = null;
</script>

<div class="item">
  <div>
    <div>
      <span>{metaData.imgPath.split("/").pop()}</span>
      <input type="checkbox" />
    </div>
    <button on:click={() => processImage(metaData.imgPath)}>
      <img src={`http://localhost:3000/${metaData.imgPath}`} alt={""} />
    </button>
  </div>
  <div>
    <span>Title:</span>
    <span class="title" contenteditable="true">{metaData.title}</span>
    <div>
      <span>Tags</span>
      {#each metaData.tags as tag}
        <button
          class="tag-button {selectedTag === tag ? 'selected' : ''}"
          on:click={() => {
            selectedTag = selectedTag === tag ? null : tag;
          }}
        >
          <span>{tag}</span>
        </button>
      {/each}
    </div>
    <span>Description:</span>
    <span>{metaData.description}</span>
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
  }
  .action-buttons {
    display: flex;
  }
  .write-button {
    background-color: blue;
    color: white;
  }
  .discard-button {
    background-color: yellow;
    color: black;
  }

  .title[contenteditable="true"] {
    border: 1px dashed #ccc;
    padding: 2px;
  }
  .tag-button {
    background-color: green;
  }

  .tag-button.selected {
    background-color: red;
  }

  button {
    cursor: pointer;
  }
  img {
    max-width: 100%;
    max-height: 150px; /* Adjust the height as needed */
    object-fit: contain;
    margin-bottom: 10px;
  }
</style>
