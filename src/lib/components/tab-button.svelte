<script lang="ts">
  import { scale } from "svelte/transition";

  export let selected: boolean;
</script>

<button
  class="relative flex gap-2 justify-center transition items-center text-sm text-white px-2 py-3 rounded-md border border-gray-700 w-full
    {selected ? 'text-yellow-500' : ''}"
  on:click
>
  <slot />
  {#if selected}
    <div
      class="w-[calc(100%-30px)] rounded h-1 bg-yellow-600 absolute -bottom-px"
      transition:scale={{}}
    />
  {/if}
</button>
