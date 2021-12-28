<script lang="ts">
  import { scale } from "svelte/transition";
  import type { Entry, ShaType } from "../../types";
  import ChangelogTab from "../changelog-tab.svelte";
  import CommitsTab from "../commits-tab.svelte";
  import ExpandableTabs from "../expandable-tabs.svelte";
  import RepoTileHeader from "./repo-tile-header.svelte";

  export let onDelete: () => void;
  export let entry: Entry;
  export let onExpand: ((type: ShaType) => void) | undefined;

  $: ({ packageName, repo, lastViewedShas, latestShas, url } = entry);
</script>

<div
  class="p-2 flex flex-col gap-3 border border-black bg-black/80 rounded-md"
  in:scale={{ delay: 200 }}
>
  <RepoTileHeader {packageName} {repo} {onDelete} />

  <slot />

  {#if url}
    <ExpandableTabs {url} {lastViewedShas} {latestShas} {onExpand}>
      <div slot="commits">
        <CommitsTab {url} />
      </div>

      <div slot="changelog">
        <ChangelogTab {url} />
      </div>
    </ExpandableTabs>
  {/if}
</div>
