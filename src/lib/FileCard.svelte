<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card";
    import { AspectRatio } from "$lib/components/ui/aspect-ratio";
    import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";
    import { processImage, writeData } from "../api";
  
    export let metaData: {
      imgPath: string;
      title: string;
      description: string;
      tags: string[];
    };
    export const folderPath = '';
    let selectedTag: string | undefined = undefined;
  </script>
  
  <Card.Root>
    <Card.Header>
      <Card.Title>{metaData.imgPath.split("/").pop()}</Card.Title>
      <input type="checkbox" class="ml-auto" />
    </Card.Header>
    <Card.Content>
      <AspectRatio ratio={16 / 9} class="bg-muted">
        <img src={`http://localhost:3000/${metaData.imgPath}`} alt={""} class="rounded-md object-cover" />
      </AspectRatio>
      <Label for="title" class="mt-4">Title</Label>
      <Input id="title" bind:value={metaData.title} class="title" />
      <Label for="tags" class="mt-4">Tags</Label>
      <ToggleGroup type="single" bind:value={selectedTag} class="tags mt-4">
        {#each metaData.tags as tag}
          <ToggleGroupItem value={tag} class="tag-button">
            {tag}
          </ToggleGroupItem>
        {/each}
      </ToggleGroup>
      <Label for="description" class="mt-4">Description</Label>
      <Input id="description" bind:value={metaData.description} class="description" />
    </Card.Content>
    <Card.Footer>
      <Button
        variant="default"
        class="write-button"
        on:click={() => {
          writeData(metaData.imgPath, metaData.title, metaData.description, metaData.tags);
        }}
      >
        Write
      </Button>
      <Button variant="secondary" class="discard-button" on:click={() => {}}>
        Discard
      </Button>
    </Card.Footer>
  </Card.Root>
  
  <style>
    .tags {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
  
    .tag-button[data-state="on"] {
      background-color: var(--danger-color);
    }
  
    img {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
      margin-bottom: 15px;
      border-radius: 10px;
    }
  </style>