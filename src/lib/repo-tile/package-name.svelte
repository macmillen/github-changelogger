<script lang="ts">
  export let packageName: string | undefined;
</script>

{#if packageName}
  <span
    class="bg-blue-700 text-white border border-gray-400 px-1 rounded text-sm ml-2"
  >
    {packageName}
  </span>
{/if}
