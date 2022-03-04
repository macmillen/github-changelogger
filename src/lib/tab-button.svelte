<script lang="ts">
  export let selected: boolean;
</script>

<button
  class="flex gap-2 justify-center transition items-center text-sm text-white px-2 py-2 rounded-md border-2 border-yellow-600 w-full
  {selected ? 'text-gray-800 bg-yellow-400 font-bold border-none' : ''}"
  on:click
>
  <slot />
</button>
