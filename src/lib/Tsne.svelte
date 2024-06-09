<script>
  import { onMount } from 'svelte';
  import { startTsneVisualization } from '../api';

  let canvas;

  async function handleTsneVisualization() {
    try {
      const coordinates = await startTsneVisualization();
      console.log('Coordinates:', coordinates);
      //const context = canvas.getContext('2d');
      //renderEmbedding(context, coordinates);
      console.log('Visualization started');
    } catch (err) {
      console.error('Visualization error:', err);
    }
  }

  // onMount(async () => {
  //   try {
  //     const coordinates = await startTsneVisualization();
  //     console.log('Coordinates:', coordinates);
  //     //const context = canvas.getContext('2d');
  //     //renderEmbedding(context, coordinates);
  //     console.log('Visualization started');
  //   } catch (err) {
  //     console.error('Visualization error:', err);
  //   }
  // });

  // function renderEmbedding(context, coordinates) {
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   coordinates.forEach((d, i) => {
  //     context.fillStyle = d3.schemeCategory10[i % 10];
  //     context.beginPath();
  //     context.arc(d[0] * canvas.width, d[1] * canvas.height, 3, 0, 2 * Math.PI);
  //     context.fill();
  //   });
  // }
  // <canvas bind:this={canvas} id="tsneCanvas" width="800" height="800"></canvas>
</script>

<style>
  /* Add your styles here */
</style>


<button on:click={handleTsneVisualization}>Start t-SNE Visualization</button>