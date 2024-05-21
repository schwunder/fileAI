<script>
  import Title from "./ITitle.svelte";
  import Tags from "./ITags.svelte";
  import Description from "./IDescription.svelte";
  export let title;
  export let tags;
  export let description;
</script>

<div class="json-data">
  <Title {title} />
  <Tags {tags} />
  <Description {description} />
</div>

<style>
  .json-data {
    width: 100%;
    height: auto; /* Adjust the height as needed */
    overflow: auto;
    white-space: pre-wrap;
    background-color: #f9f9f9;
    padding: 5px;
    box-sizing: border-box;
    border-top: 1px solid #ccc;
  }
</style>
