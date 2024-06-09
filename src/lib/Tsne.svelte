<script>
  import { onMount, tick } from 'svelte';
  import { startTsneVisualization } from '../api'; // Adjust the path as necessary

  let canvas;
  let showCanvas = false;
  let showButton = true;
  let marginPx = 75; // Default margin in pixels
  let canvasSize = 800; // Canvas size in pixels
  let imageSize = 75; // Image size in pixels

  // Function to normalize t-SNE coordinates to fit within a specified range with a margin
  const normalizeCoordinates = (coordinates, rangeMin, rangeMax, marginPx, canvasSize) => {
    const margin = marginPx / canvasSize; // Convert pixel margin to normalized margin
    const xValues = coordinates.map((coord) => coord[0]);
    const yValues = coordinates.map((coord) => coord[1]);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    return coordinates.map(([x, y]) => [
      ((x - xMin) / (xMax - xMin)) * (rangeMax - rangeMin - 2 * margin) + rangeMin + margin,
      ((y - yMin) / (yMax - yMin)) * (rangeMax - rangeMin - 2 * margin) + rangeMin + margin,
    ]);
  };

  async function handleTsneVisualization() {
    try {
      const response = await startTsneVisualization();
      console.log('Coordinates:', response.coordinates);
      if (!Array.isArray(response.coordinates)) {
        throw new Error('Invalid coordinates format');
      }

      // Normalize coordinates to fit within the range [0, 1] with a margin
      const adjustedCoordinates = normalizeCoordinates(response.coordinates, 0, 1, marginPx, canvasSize);

      showCanvas = true;
      showButton = false;
      await tick(); // Wait for the DOM to update
      const context = canvas.getContext('2d');
      renderEmbedding(context, adjustedCoordinates);
      console.log('Visualization started');
    } catch (err) {
      console.error('Visualization error:', err);
    }
  }

  function renderEmbedding(context, coordinates) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    coordinates.forEach((d, i) => {
      const img = new Image();
      img.src = `../../db/media/${i}.png`; // Update with the correct path to your images
      img.onload = () => {
        // Adjust coordinates to prevent clipping
        const x = Math.max(imageSize / 2, Math.min(d[0] * canvas.width, canvas.width - imageSize / 2));
        const y = Math.max(imageSize / 2, Math.min(d[1] * canvas.height, canvas.height - imageSize / 2));
        
        context.drawImage(
          img,
          x - imageSize / 2,
          y - imageSize / 2,
          imageSize,
          imageSize
        );
      };
    });
  }
</script>

  {#if showButton}
    <button on:click={handleTsneVisualization}>Start t-SNE Visualization</button>
  {/if}
  {#if showCanvas}
    <canvas bind:this={canvas} width={canvasSize} height={canvasSize}></canvas>
  {/if}