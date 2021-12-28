<script lang="ts">
  import { onMount, tick } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import AddChangelogButton from "./lib/add-changelog-button.svelte";
  import ChangelogInput from "./lib/changelog-input.svelte";
  import RepoTile from "./lib/repo-tile/repo-tile.svelte";
  import TitleBar from "./lib/title-bar.svelte";
  import type { Entry, EntryInStorage } from "./types";
  import { getStorableEntryValues } from "./utils/entry";
  import { fetchLatestChangelogSha, fetchLatestCommitSha } from "./utils/fetch";
  import { getOwnerAndRepoFromUrl, getPackageNameFromUrl } from "./utils/url";

  let values: Entry[] = [];

  onMount(() => {
    const storageValue = localStorage.getItem("values");
    const parsedValue = JSON.parse(storageValue ?? "[]") as EntryInStorage[];

    values = parsedValue.map((entry) => ({
      ...getStorableEntryValues(entry),
      id: Symbol(),
      latestShas: {},
    }));
  });

  onMount(async () => {
    values = await Promise.all(values.map(updateDerivedValues));
  });

  $: {
    if (values.length !== 0) {
      const storableValues: EntryInStorage[] = values.map((entry) =>
        getStorableEntryValues(entry)
      );
      localStorage.setItem("values", JSON.stringify(storableValues));
    }
  }

  const updateDerivedValues = async (entry: Entry): Promise<Entry> => {
    const [owner, repo] = getOwnerAndRepoFromUrl(entry.url);

    const data: Entry = {
      ...entry,
      latestShas: {
        Changelog: await fetchLatestChangelogSha(entry.url),
        Commit: await fetchLatestCommitSha(entry.url),
      },
      packageName: getPackageNameFromUrl(entry.url),
      repo,
      owner,
    };
    return data;
  };

  const gotoBottom = () => {
    window.scrollTo(0, document.body.scrollHeight), 200;
  };

  const addNewUrl = () =>
    (values = [
      ...values,
      { url: "", id: Symbol(), lastViewedShas: {}, latestShas: {} },
    ]);
</script>

<TitleBar />
<div class="m-3 flex flex-col gap-3">
  <AddChangelogButton
    on:click={async () => {
      addNewUrl();
      await tick();
      gotoBottom();
    }}
  />

  {#each values as entry, i (entry.id)}
    <div animate:flip={{ duration: 200 }} transition:fade={{ duration: 200 }}>
      <RepoTile
        {entry}
        onExpand={(type) => {
          const { lastViewedShas, latestShas } = values[i];
          if (lastViewedShas[type] !== latestShas[type]) {
            values[i].lastViewedShas[type] = latestShas[type];
          }
        }}
        onDelete={() => {
          if (confirm("Are you sure you want to delete this repo?"))
            values = values.filter((_, index) => index !== i);
        }}
      >
        <ChangelogInput
          on:input={async () => {
            values[i] = await updateDerivedValues(values[i]);
          }}
          bind:value={values[i].url}
        />
      </RepoTile>
    </div>
  {/each}
</div>
