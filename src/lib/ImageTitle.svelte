<script>
  export let title = "";
</script>

<span>Title:</span>
<span class="title" contenteditable="true">{title}</span>

<style>
  /* Editable title */
  .title[contenteditable="true"] {
    border: 1px dashed #ccc;
    padding: 2px;
  }
  .title {
    font-weight: normal;
    margin-left: 10px;
  }
  span {
    display: block;
    margin: 5px 0;
    font-weight: bold;
  }
</style>
