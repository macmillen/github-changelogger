<script lang="ts">
  export let packageName: string | undefined;
</script>

{#if packageName}
  <span class="text-yellow-400 px-1 rounded text-sm ml-2 italic">
    packages / <span class="underline font-black not-italic">{packageName}</span>
  </span>
{/if}
