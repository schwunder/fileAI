<script>
  import { processImage, writeData } from "../api";

  export let metaData;
  export const folderPath = '';
  let selectedTag = null;
</script>

<div class="item">
  <div class="header">
    <span>{metaData.imgPath.split("/").pop()}</span>
    <input type="checkbox" />
  </div>
  <button on:click={() => processImage(metaData.imgPath)}>
    <img src={`http://localhost:3000/${metaData.imgPath}`} alt={""} />
  </button>
  <div>
    <span class="title" contenteditable="true">{metaData.title}</span>
    <div class="tags">
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
    <span class="description" contenteditable="true">{metaData.description}</span>
  </div>
  <div class="action-buttons">
    <button
      class="write-button"
      on:click={() => {
        writeData(metaData.imgPath, metaData.title, metaData.description, metaData.tags)}}
      >Write</button
    >
    <button class="discard-button" on:click={() => {}}>Discard</button>
  </div>
</div>

<style>
  :root {
    --primary-color: #007bff;
    --secondary-color: #ffc107;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --background-color: #ffffff;
    --text-color: #333;
    --border-color: #ccc;
    --hover-scale: 1.05;
    --transition-duration: 0.3s;
    --font-family: 'Arial, sans-serif';
    --shadow-color: rgba(0, 0, 0, 0.1);
    --shadow-hover-color: rgba(0, 0, 0, 0.2);
  }

  .item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: var(--background-color);
    border-radius: 15px;
    box-shadow: 0 4px 12px var(--shadow-color);
    overflow: hidden auto;
    transition: transform var(--transition-duration) ease, box-shadow var(--transition-duration) ease;
    perspective: 1000px;
    margin: 20px;
    font-family: var(--font-family);
    animation: fadeIn 0.5s ease-in-out;
    max-height: 600px;
  }
  .item:hover {
    transform: translateY(-10px) rotateY(3deg);
    box-shadow: 0 8px 24px var(--shadow-hover-color);
  }

  .item > div {
    padding: 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    color: white;
    font-weight: bold;
    border-radius: 15px 15px 0 0;
  }

  .header span {
    font-size: 1.2em;
  }

  .header input[type="checkbox"] {
    transform: scale(1.5);
    cursor: pointer;
    accent-color: var(--success-color);
  }

  .action-buttons {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    background: #f1f1f1;
    border-top: 1px solid #eee;
    border-radius: 0 0 15px 15px;
  }

  .write-button, .discard-button {
    flex: 1;
    margin: 0 10px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    transition: background-color var(--transition-duration) ease, color var(--transition-duration) ease, transform var(--transition-duration) ease;
  }

  .write-button {
    background-color: var(--primary-color);
    color: white;
  }

  .write-button:hover {
    background-color: darken(var(--primary-color), 10%);
    transform: scale(var(--hover-scale));
  }

  .discard-button {
    background-color: var(--secondary-color);
    color: black;
  }

  .discard-button:hover {
    background-color: darken(var(--secondary-color), 10%);
    transform: scale(var(--hover-scale));
  }

  .title[contenteditable="true"] {
    border: 1px dashed var(--border-color);
    padding: 10px;
    border-radius: 8px;
    transition: border-color var(--transition-duration) ease, box-shadow var(--transition-duration) ease;
    font-size: 1.4em;
    margin-bottom: 15px;
    text-align: center;
  }

  .title[contenteditable="true"]:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  }

  .tag-button {
    background-color: var(--success-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 15px;
    margin: 5px;
    transition: background-color var(--transition-duration) ease, transform var(--transition-duration) ease;
    font-weight: bold;
  }

  .tag-button:hover {
    background-color: darken(var(--success-color), 10%);
    transform: scale(var(--hover-scale)) rotate(-5deg);
  }

  .tag-button.selected {
    background-color: var(--danger-color);
  }

  button {
    cursor: pointer;
    outline: none;
  }

  img {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    margin-bottom: 15px;
    border-radius: 10px;
    transition: transform var(--transition-duration) ease, box-shadow var(--transition-duration) ease;
  }

  img:hover {
    transform: scale(var(--hover-scale)) rotate(3deg);
    box-shadow: 0 4px 12px var(--shadow-hover-color);
  }

  span {
    display: block;
    margin-bottom: 10px;
    color: var(--text-color);
    font-size: 1.1em;
  }

  .tags {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

