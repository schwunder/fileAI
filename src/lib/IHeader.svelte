<!-- MyComponent.svelte -->
<script>
  export let text = "";
</script>

<div class="box">
  <p class="header">{text}</p>
  <input type="checkbox" />
</div>

<style>
  .box {
    display: flex;
    align-items: center;
    margin: 1rem;
  }
  .header {
    margin: 5px 0;
    font-weight: bold;
  }
</style>
