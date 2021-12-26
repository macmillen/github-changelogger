<script lang="ts">
  import { marked } from "marked";
  import { fetchChangelog } from "../utils/fetch";
  import Error from "./error.svelte";
  import Loader from "./loader.svelte";

  export let url: string;

  let showEverything = false;
</script>

<!-- Open all links in new tab -->
<base target="_blank" />

{#await fetchChangelog(url)}
  <Loader />
{:then content}
  <div class="markdown-body p-2">
    {@html marked.parse(showEverything ? content : content.slice(0, 4000))}
  </div>
  {#if !showEverything}
    <button
      class="bg-gray-900 text-white rounded-md px-4 py-2 m-2"
      on:click={() => (showEverything = true)}
    >
      Show everything
    </button>
  {/if}
{:catch error}
  <Error {error} />
{/await}
