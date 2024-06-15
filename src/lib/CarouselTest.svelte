  
  <script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
  </script>
   
  <Accordion.Root>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
      <Accordion.Content>
        Yes. It adheres to the WAI-ARIA design pattern.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>