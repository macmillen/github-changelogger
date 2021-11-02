<script lang="ts">
  import { fetchCommits, fetchDiff } from "../utils/fetch";
  import CommitDiffContent from "./commit-diff-content.svelte";
  import CommitItem from "./commit-item.svelte";
  import Error from "./error.svelte";
  import Loader from "./loader.svelte";

  export let url: string;

  let selectedCommitSha: string | null = null;
</script>

{#await fetchCommits(url)}
  <Loader />
{:then commits}
  <div class="flex flex-col divide-y divide-gray-600">
    {#each commits as commit}
      <CommitItem
        {commit}
        selected={commit.sha === selectedCommitSha}
        on:click={() => {
          if (selectedCommitSha === commit.sha) selectedCommitSha = null;
          else selectedCommitSha = commit.sha;
        }}
      />
      {#if commit.sha === selectedCommitSha}
        {#await fetchDiff(url, commit.sha)}
          <Loader />
        {:then text}
          <CommitDiffContent {text} />
        {:catch error}
          <Error {error} />
        {/await}
      {/if}
    {/each}
  </div>
{:catch error}
  <Error {error} />
{/await}
