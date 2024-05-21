<script>
  //import { triggerConfetti, playSirenSound } from "../utilsFrontend.js";

  export let imageSrc; // Define imageSrc as a prop
  export let onClick; // Define onClick as a prop

  function handleClick() {
    onClick();
    console.log(imageSrc);
    //triggerConfetti();
    //playSirenSound();
  }
</script>

<button on:click={handleClick}>
  <img src={imageSrc} alt={""} />
</button>

<style>
  button {
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
  }
  img {
    max-width: 100%;
    max-height: 150px; /* Adjust the height as needed */
    object-fit: contain;
    margin-bottom: 10px;
  }
</style>
