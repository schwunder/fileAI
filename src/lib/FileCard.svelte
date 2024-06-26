<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card";
    import { AspectRatio } from "$lib/components/ui/aspect-ratio";
    import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { processImage, writeData } from "../api";
  
    export let metaData: {
      imgPath: string;
      title: string;
      description: string;
      tags: string[];
    };
    export let onImageClick: (imgUrl: string, event: MouseEvent) => void = () => {};

    let selectedTag: string | undefined = undefined;
    let isChecked: boolean = false;

  </script>
  
  <Card.Root class="max-w-[450px] mx-auto p-4 bg-white rounded-md shadow-md">
    <Card.Header class="flex items-center">
      <Card.Title>{metaData.imgPath.split("/").pop()}</Card.Title>
      <Checkbox class="ml-auto" bind:checked={isChecked} />
    </Card.Header>
    <Card.Content>
      <AspectRatio ratio={16 / 9} class="bg-muted w-full">
        <Button on:click={(e) => { processImage(metaData.imgPath); onImageClick(metaData.imgPath, e); }} variant="ghost" class="w-full h-full">
          <img src={`http://localhost:3000/${metaData.imgPath}`} alt={""} class="rounded-md object-contain w-full h-full" />
        </Button>
      </AspectRatio>
      <Input id="title" bind:value={metaData.title} class="mt-4 w-full" contenteditable="true" />
      <ToggleGroup type="single" bind:value={selectedTag} class="mt-4 w-full">
        {#each metaData.tags as tag}
          <ToggleGroupItem value={tag} class="{selectedTag === tag ? 'selected' : ''} px-2 py-1 m-1 border rounded">
            {tag}
          </ToggleGroupItem>
        {/each}
      </ToggleGroup>
      <Input id="description" bind:value={metaData.description} class="mt-4 w-full" contenteditable="true" />
    </Card.Content>
    <Card.Footer class="flex justify-end mt-4">
      <Button variant="default" class="mr-2" on:click={() => writeData(metaData.imgPath, metaData.title, metaData.description, metaData.tags)}>
        Write
      </Button>
      <Button variant="secondary">
        Discard
      </Button>
    </Card.Footer>
  </Card.Root>