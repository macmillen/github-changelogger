<script lang="ts">
  import marked from "marked";
  import type { Commit } from "src/types";

  export let commit: Commit;
  export let selected: boolean;
</script>

<div
  class="bg-gray-800 hover:bg-gray-700 text-gray-100 px-2 py-1 cursor-pointer"
  on:click
>
  <div class="flex justify-between">
    {#if selected}
      <div>
        {@html marked(commit.message)}
      </div>
    {:else}
      <p class="whitespace-nowrap overflow-ellipsis overflow-hidden">
        {commit.message}
      </p>
    {/if}
    <span class="whitespace-nowrap ml-2 text-gray-300 text-sm">
      {commit.date}
    </span>
  </div>
  <p class="text-sm text-gray-300 flex items-center gap-1">
    <img src={commit.avatarUrl} class="w-4 h-4 rounded-full" alt="" />
    {commit.author}
  </p>
</div>
