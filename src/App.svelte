<script>
  import { onMount } from "svelte";
  import ImageGrid from "./lib/ImageGrid.svelte";

  let imageProps = [];

  export async function fetchJsons(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    console.log("Fetched JSON response:", response);
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Received non-JSON response");
    }

    return response.json();
  }

  export async function fetchBlobs(url) {
    const response = await fetch(url);
    console.log("Fetched Blob response:", response);
    if (!response.ok) throw new Error("Network response was not ok");
    return response.blob();
  }

  async function fetchProps() {
    try {
      const jsons = await fetchJsons("/db/testImages/all");

      console.log("Fetched JSONs:", jsons);

      const blobs = await Promise.all(
        jsons.map(async (img) => {
          const blob = await fetchBlobs(img.imgPath);
          const src = URL.createObjectURL(blob);
          console.log("Created object URL:", src); // Log the created object URL
          return { ...img, src };
        })
      );
      console.log("Fetched Blobs and created object URLs:", blobs);
      imageProps = blobs;
      if (imageProps.length > 0) {
        firstImageSrc = imageProps[0].src;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  onMount(fetchProps);
</script>

<body>
  <header>
    <h1>Images Gallery with Tags and Description and suggested Title</h1>
  </header>
  <main>
    {#if imageProps.length > 0}
      <ImageGrid {imageProps} />
    {:else}
      <p>Loading images...</p>
    {/if}
  </main>
  <footer>
    <p>&copy; 2023 Sample HTML Page. All rights reserved.</p>
  </footer>
</body>

<style>
  body {
    font-family: Arial, sans-serif;
  }
</style>
