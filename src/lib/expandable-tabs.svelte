<script lang="ts">
  import Icon from "@iconify/svelte";
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

  const typeMap: MappedSet<ShaType, { icon: string; title: string }> = {
    Changelog: { icon: "mdi:source-repository", title: "Changelog" },
    Commit: { icon: "mdi:git", title: "Commits" },
  };
</script>

<div class="flex gap-1">
  {#each [ShaType.Changelog, ShaType.Commit] as type}
    {#if !(type === ShaType.Changelog && !url.includes("CHANGELOG.md"))}
      <TabButton selected={expanded === type} on:click={() => onClick(type)}>
        {#if lastViewedShas[type] !== latestShas[type]}
          <UpdatesNotifier />
        {/if}
        <Icon icon={typeMap[type].icon} class="w-4 h-4" />
        {typeMap[type].title}
      </TabButton>
    {/if}
  {/each}
</div>

{#if expanded}
  <div>
    {#if expanded === ShaType.Changelog}
      <slot name="changelog" />
    {:else if expanded === ShaType.Commit}
      <slot name="commits" />
    {/if}
  </div>
{/if}
