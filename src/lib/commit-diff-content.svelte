<script lang="ts">
  import { getDiffDataFromRawTextFile } from "../utils/diff";

  export let text: string;

  $: ({ del, files, filesChanged, ins } = getDiffDataFromRawTextFile(text));
</script>

<p class="text-gray-100">
  {filesChanged} files changed
</p>
<div class="flex gap-2">
  <span class="text-green-600">{ins} additions</span>
  <span class="text-red-600">{del} deletions</span>
</div>
{#each files as { filePath, html }}
  <p class="text-gray-100">
    {filePath}
  </p>
  <div class="markdown-body">
    {@html `<pre class="!px-0">${html}</pre>`}
  </div>
{/each}
