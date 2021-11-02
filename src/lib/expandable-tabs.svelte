<script lang="ts">
  import TabButton from "./tab-button.svelte";
  import UpdatesNotifier from "./updates-notifier.svelte";

  type ExpansionType = "changelog" | "commits";

  export let onExpand: ((type: ExpansionType) => void) | undefined = undefined;
  export let changelogUpdates: boolean;
  export let commitUpdates: boolean;

  let expanded: ExpansionType | null = null;

  const onClick = (type: ExpansionType) => {
    if (expanded !== type) {
      expanded = type;
      onExpand?.(type);
    } else expanded = null;
  };
</script>

<div class="flex gap-1">
  <TabButton
    selected={expanded === "changelog"}
    on:click={() => onClick("changelog")}
  >
    {#if changelogUpdates}
      <UpdatesNotifier />
    {/if}
    CHANGELOG
  </TabButton>
  <TabButton
    selected={expanded === "commits"}
    on:click={() => onClick("commits")}
  >
    {#if commitUpdates}
      <UpdatesNotifier />
    {/if}
    COMMITS
  </TabButton>
</div>
<div>
  {#if expanded === "changelog"}
    <slot name="changelog" />
  {:else if expanded === "commits"}
    <slot name="commits" />
  {/if}
</div>
