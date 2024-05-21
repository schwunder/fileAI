<script>
  export let tags = [];
  let selectedTag = null;

  function toggleSelected(tag) {
    selectedTag = selectedTag === tag ? null : tag;
  }
</script>

<div>
  <span>Tags</span>
  {#each tags as tag}
    <button
      class="tag-button {selectedTag === tag ? 'selected' : ''}"
      on:click={() => toggleSelected(tag)}
    >
      <span class="tags">{tag}</span>
    </button>
  {/each}
</div>

<style>
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
</style>
