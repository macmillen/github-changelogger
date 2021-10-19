<script lang="ts">
  type Entry = { url: string };

  let values: Entry[] = [];
</script>

{#each values as url, i}
  <input type="text" bind:value={values[i].url} />
{/each}

<button on:click={() => (values = [...values, { url: "" }])}>Add</button>
