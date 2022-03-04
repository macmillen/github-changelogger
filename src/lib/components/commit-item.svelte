<script lang="ts">
  import type { Commit } from "$lib/types/types";
  import { marked } from "marked";
  import { getPullRequestUrlFromUrl } from "../utils/url";

  export let commit: Commit;
  export let url: string;
  export let selected: boolean;

  const getMdUrl = (pr: number) => `[#${pr}](${getPullRequestUrlFromUrl(url, pr)})`;

  const replacePrHashesWithLinks = (message: string) =>
    message.replaceAll(/#[0-9]+/g, (pr) => getMdUrl(+pr.substring(1)));

  const changeTarget = (node: HTMLDivElement) => {
    node.querySelectorAll("a").forEach((a) => {
      a.target = "_blank";
      a.addEventListener("click", (e) => e.stopPropagation());
    });
  };
</script>

<div
  class="bg-gray-900 text-gray-100 cursor-pointer rounded-md p-1 space-y-1
    {selected ? 'ring' : ''}"
  on:click
>
  <div class="flex justify-between mx-1">
    <p class="text-sm text-gray-300 flex items-center gap-1">
      <img src={commit.avatarUrl} class="w-4 h-4 rounded-full" alt="" />
      {commit.author}
    </p>
    <span class="whitespace-nowrap ml-2 text-gray-300 text-sm">
      {commit.date}
    </span>
  </div>

  <div class="flex justify-between">
    {#if selected}
      <div use:changeTarget class="markdown-body w-full p-2 rounded-md">
        {@html marked.parse(replacePrHashesWithLinks(commit.message))}
      </div>
    {:else}
      <p class="whitespace-nowrap overflow-ellipsis overflow-hidden">
        {commit.message}
      </p>
    {/if}
  </div>
</div>
