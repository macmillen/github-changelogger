<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import AddChangelogButton from "./lib/add-changelog-button.svelte";
  import ChangelogInput from "./lib/changelog-input.svelte";
  import ChangelogTab from "./lib/changelog-tab.svelte";
  import CommitsTab from "./lib/commits-tab.svelte";
  import DeleteButton from "./lib/delete-button.svelte";
  import ExpandableTabs from "./lib/expandable-tabs.svelte";
  import PackageName from "./lib/package-name.svelte";
  import TitleBar from "./lib/title-bar.svelte";
  import type { Entry, EntryInStorage } from "./types";
  import { getStorableEntryValues } from "./utils/entry";
  import { fetchLatestChangelogSha, fetchLatestCommitSha } from "./utils/fetch";
  import { getPackageNameFromUrl, getRepoNameFromUrl } from "./utils/url";

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
    const data: Entry = {
      ...entry,
      latestShas: {
        Changelog: await fetchLatestChangelogSha(entry.url),
        Commit: await fetchLatestCommitSha(entry.url),
      },
      packageName: getPackageNameFromUrl(entry.url),
      repoName: getRepoNameFromUrl(entry.url),
    };
    return data;
  };

  const addNewUrl = () =>
    (values = [
      ...values,
      { url: "", id: Symbol(), lastViewedShas: {}, latestShas: {} },
    ]);
</script>

<TitleBar />
<div class="m-3 flex flex-col gap-3">
  <AddChangelogButton on:click={addNewUrl} />

  <div class="flex flex-col gap-5">
    {#each values as { id, url, lastViewedShas, latestShas, packageName, repoName }, i (id)}
      <div
        animate:flip={{ duration: 200 }}
        transition:fade={{ duration: 200 }}
        class="flex flex-col gap-3 border border-black p-2 even:bg-gray-900 odd:bg-gray-900 rounded-md"
      >
        <div class="flex items-center">
          <h2 class="text-white text-lg">
            {repoName}
          </h2>
          <PackageName {packageName} />
          <div class="flex-grow" />
          <DeleteButton
            on:click={() => {
              if (confirm("Are you sure you want to delete this repo?"))
                values = values.filter((_, index) => index !== i);
            }}
          />
        </div>

        <div class="flex gap-2">
          <ChangelogInput
            on:input={async () => {
              values[i] = await updateDerivedValues(values[i]);
            }}
            bind:value={values[i].url}
          />
        </div>

        {#if url}
          <ExpandableTabs
            {url}
            {lastViewedShas}
            {latestShas}
            onExpand={(type) => {
              const { lastViewedShas, latestShas } = values[i];
              if (lastViewedShas[type] !== latestShas[type]) {
                values[i].lastViewedShas[type] = latestShas[type];
              }
            }}
          >
            <div slot="commits">
              <CommitsTab {url} />
            </div>

            <div slot="changelog">
              <ChangelogTab {url} />
            </div>
          </ExpandableTabs>
        {/if}
      </div>
    {/each}
  </div>
</div>
