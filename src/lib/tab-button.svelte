<script lang="ts">
  export let selected: boolean;
</script>

<button
  class="flex gap-2 justify-center transition duration-300 items-center flex-grow bg-black text-white px-2 py-1 rounded-md hover:bg-purple-900/20 border border-purple-900
  {selected ? 'bg-purple-900/10' : ''}"
  on:click
>
  <slot />
</button>
