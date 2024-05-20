<!-- MyComponent.svelte -->
<script>
  export let text = "";
</script>

<div class="container">
  <p class="header">{text}</p>
  <input type="checkbox" />
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    margin: 1rem;
  }
  .header {
    margin: 5px 0;
    font-weight: bold;
  }
</style>
