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
      latestChangelogSha: await fetchLatestChangelogSha(entry.url),
      latestCommitSha: await fetchLatestCommitSha(entry.url),
      packageName: getPackageNameFromUrl(entry.url),
      repoName: getRepoNameFromUrl(entry.url),
    };
    return data;
  };

  const addNewUrl = () => (values = [...values, { url: "", id: Symbol() }]);
</script>

<!-- Open all links in new tab -->
<base target="_blank" />

<TitleBar />
<div class="m-3 flex flex-col gap-3">
  <AddChangelogButton on:click={addNewUrl} />

  <div class="flex flex-col gap-5">
    {#each values as { id, url, lastViewedChangelogSha, latestChangelogSha, lastViewedCommitSha, latestCommitSha, packageName, repoName }, i (id)}
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
        </div>

        <div class="flex gap-2">
          <ChangelogInput
            on:input={async () => {
              values[i] = await updateDerivedValues(values[i]);
            }}
            bind:value={values[i].url}
          />
          <DeleteButton
            on:click={() => (values = values.filter((_, index) => index !== i))}
          />
        </div>

        {#if url}
          <ExpandableTabs
            commitUpdates={lastViewedCommitSha !== latestCommitSha}
            changelogUpdates={lastViewedChangelogSha !== latestChangelogSha}
            onExpand={(type) => {
              if (type === "changelog") {
                const { lastViewedChangelogSha, latestChangelogSha } =
                  values[i];
                if (lastViewedChangelogSha !== latestChangelogSha) {
                  values[i].lastViewedChangelogSha = latestChangelogSha;
                }
              } else if (type === "commits") {
                const { lastViewedCommitSha, latestCommitSha } = values[i];
                if (lastViewedCommitSha !== latestCommitSha) {
                  values[i].lastViewedCommitSha = latestCommitSha;
                }
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
