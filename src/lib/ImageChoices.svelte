<script>
  export let onWrite;
  export let onDiscard;
</script>

<div class="action-buttons">
  <button class="write-button" on:click={onWrite}>Write</button>
  <button class="discard-button" on:click={onDiscard}>Discard</button>
</div>

<style>
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
</style>
