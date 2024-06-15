<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { writable } from 'svelte/store';
    import { scale } from 'svelte/transition'; // Import the scale transition

    let activeImg = null;
    let isCarouselActive = true;
    const cards = Array.from({ length: 12 }, (_, i) => `db/media/${i + 1}.png`);
    const rotation = tweened(0, { duration: 400, easing: cubicOut });

    const handleClick = (imgUrl) => {
        activeImg = imgUrl;
        isCarouselActive = false;
        rotation.set(0); // Stop rotation
    };

    const handleClose = () => {
        activeImg = null;
        isCarouselActive = true;
    };

    onMount(() => {
        console.log("Cards loaded:", cards);
    });

    const duration = 0.15;
    const transition = { duration, ease: [0.32, 0.72, 0, 1] };
    const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] };

    // Define missing variables
    let isScreenSizeSm = false; // Set this based on your screen size logic
    let faceWidth = 200; // Example value, adjust as needed
    let faceCount = cards.length;
    let radius = 500; // Example value, adjust as needed
</script>
  
<style>
    .carousel-container {
        perspective: 1000px;
        transform-style: preserve-3d;
        will-change: transform;
    }
    .carousel {
        transform-style: preserve-3d;
    }
    .carousel-item {
        position: absolute;
        transform-origin: center;
    }
</style>
  
<div class="relative">
    {#if activeImg}
        <button
            on:click={handleClose}
            on:keydown={(e) => e.key === 'Escape' && handleClose()}
            class="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 m-5 md:m-36 lg:mx-[19rem] rounded-3xl"
            style="will-change: opacity"
            aria-label="Close image"
        >
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src={activeImg}
                class="max-w-full max-h-full rounded-lg shadow-lg"
                style="will-change: transform"
                transition:scale={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            />
        </button>
    {/if}
  
    <div class="relative h-[500px] w-full overflow-hidden">
        <div class="carousel-container flex h-full items-center justify-center bg-mauve-dark-2">
            <div
                class="carousel relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
                style={{ rotateY: $rotation, width: isScreenSizeSm ? 1100 : 1800 }}
                on:drag={(e) => isCarouselActive && rotation.update(n => n + e.detail.dx * 0.05)}
                on:dragend={(e) => isCarouselActive && rotation.set($rotation + e.detail.velocityX * 0.05)}
                role="listbox"
                tabindex="0"
            >
                {#each cards as imgUrl, i}
                    <button
                        key={`key-${imgUrl}-${i}`}
                        class="carousel-item flex h-full origin-center items-center justify-center rounded-xl bg-mauve-dark-2 p-2"
                        style={{ width: `${faceWidth}px`, transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)` }}
                        on:click={() => handleClick(imgUrl)}
                        on:keydown={(e) => e.key === 'Enter' && handleClick(imgUrl)}
                        role="option"
                        aria-selected={activeImg === imgUrl}
                    >
                        <img
                            src={imgUrl}
                            alt="Carousel item"
                            class="pointer-events-none w-full rounded-xl object-cover aspect-square"
                            transition:blur={{ duration, ease: [0.32, 0.72, 0, 1] }}
                            on:load={() => console.log(`Image loaded: ${imgUrl}`)}
                            on:error={() => console.error(`Failed to load image: ${imgUrl}`)}
                            style="filter: blur(0px);"  
                            />
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>