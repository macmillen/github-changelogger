<script lang="ts">
  import type { MappedSet } from "../helpers/type";
  import type { Entry } from "../types";
  import { ShaType } from "../types";
  import TabButton from "./tab-button.svelte";
  import UpdatesNotifier from "./updates-notifier.svelte";

  export let onExpand: ((type: ShaType) => void) | undefined = undefined;
  export let lastViewedShas: Entry["lastViewedShas"];
  export let latestShas: Entry["latestShas"];
  export let url: string;

  let expanded: ShaType | null = null;

  const onClick = (type: ShaType) => {
    if (expanded !== type) {
      expanded = type;
      onExpand?.(type);
    } else expanded = null;
  };

  const typeMap: MappedSet<ShaType> = {
    Changelog: "CHANGELOG",
    Commit: "COMMITS",
  };
</script>

<div class="flex gap-1">
  {#each [ShaType.Changelog, ShaType.Commit] as type}
    <TabButton
      selected={expanded === type}
      on:click={() => onClick(type)}
      disabled={type === ShaType.Changelog && !url.includes("CHANGELOG.md")}
    >
      {#if lastViewedShas[type] !== latestShas[type]}
        <UpdatesNotifier />
      {/if}
      {typeMap[type]}
    </TabButton>
  {/each}
</div>
<div>
  {#if expanded === ShaType.Changelog}
    <slot name="changelog" />
  {:else if expanded === ShaType.Commit}
    <slot name="commits" />
  {/if}
</div>
