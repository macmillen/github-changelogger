<script lang="ts">
  import AddChangelogButton from "$lib/components/add-changelog-button.svelte";
  import ChangelogInput from "$lib/components/changelog-input.svelte";
  import RepoTile from "$lib/components/repo-tile/repo-tile.svelte";
  import TitleBar from "$lib/components/title-bar.svelte";
  import { entryStore } from "$lib/stores/entry.store";
  import { getInputEventValue } from "$lib/utils/event";
  import { tick } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";

  const gotoBottom = () => {
    window.scrollTo(0, document.body.scrollHeight), 200;
  };
</script>

<TitleBar />
<div class="m-3 flex flex-col gap-3">
  <AddChangelogButton
    on:click={async () => {
      entryStore?.addNewUrl();
      await tick();
      gotoBottom();
    }}
  />

  {#each $entryStore as entry (entry.id)}
    <div animate:flip={{ duration: 200 }} transition:fade={{ duration: 200 }}>
      <RepoTile
        {entry}
        onExpand={(type) => {
          entryStore?.updateLastViewedSha(entry, type);
        }}
        onDelete={() => {
          if (confirm("Are you sure you want to delete this repo?")) entryStore.delete(entry);
        }}
      >
        <ChangelogInput
          on:input={async (e) => {
            entryStore?.updateUrl(entry, getInputEventValue(e));
          }}
          value={entry.url}
        />
      </RepoTile>
    </div>
  {/each}
</div>
