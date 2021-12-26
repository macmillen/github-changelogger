<script lang="ts">
  export let selected: boolean;
  export let disabled = false;
</script>

<button
  class="flex gap-2 justify-center transition duration-300 items-center bg-black text-white px-2 py-1 rounded-md hover:bg-purple-900/20 border border-purple-900 disabled:brightness-50 disabled:hover:bg-black
  {selected ? 'bg-purple-900/10' : ''}"
  {disabled}
  on:click
>
  <slot />
</button>
