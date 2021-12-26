<script lang="ts">
  export let selected: boolean;
</script>

<button
  class="flex gap-2 justify-center transition items-center text-sm text-white px-2 py-1 rounded-md hover:bg-purple-900 border border-purple-900
  {selected ? 'bg-purple-900' : ''}"
  on:click
>
  <slot />
</button>
