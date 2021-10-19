<script lang="ts">
  import marked from "marked";
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import AddChangelogButton from "./lib/add-changelog-button.svelte";

  type Entry = {
    url: string;
    id: symbol;
    lastViewedSha?: string;
    latestSha?: string;
    content?: string;
    packageName?: string;
  };

  const RAW_CONTENT_URL = "https://raw.githubusercontent.com";
  const GITHUB_URL = "https://github.com";
  const GITHUB_API_URL = "https://api.github.com";

  let values: Entry[] = [];
  let loading = true;
  let showEverything = false;

  onMount(() => {
    const storageValue = localStorage.getItem("values");
    const parsedValue = JSON.parse(storageValue ?? "[]") as Omit<Entry, "id">[];

    values = parsedValue.map((v) => ({ ...v, id: Symbol() }));
  });

  onMount(async () => {
    values = await Promise.all(values.map(updateDerivedValues));
    loading = false;
  });

  $: {
    if (values.length !== 0)
      localStorage.setItem("values", JSON.stringify(values));
  }

  const updateDerivedValues = async (entry: Entry) => ({
    ...entry,
    latestSha: await getLatestSha(entry.url),
    content: await fetchChangelog(entry.url),
    packageName: getPackageNameFromUrl(entry.url),
  });

  const addNewUrl = () => (values = [...values, { url: "", id: Symbol() }]);

  const convertUrl = (url: string) =>
    url.replace(GITHUB_URL, RAW_CONTENT_URL).replace("/blob", "");

  const getRepoNameFromUrl = (url: string) =>
    url.split("/").slice(3, 5).join("/");

  const fetchChangelog = async (url: string) =>
    await (await fetch(convertUrl(url))).text();

  const getLatestSha = async (url: string) => {
    if (!url) return undefined;
    try {
      const repoName = getRepoNameFromUrl(url);
      const filePath = getFilePathFromUrl(url);
      const constructedUrl = `${GITHUB_API_URL}/repos/${repoName}/commits?path=${filePath}&per_page=1`;
      const jsonResult = await (await fetch(constructedUrl)).json();
      return jsonResult[0].sha as string;
    } catch {
      return undefined;
    }
  };

  const getFilePathFromUrl = (url: string) => {
    const searchString = "blob/";
    const index = url.indexOf(searchString);
    const pathWithBranchName = url.substring(index + searchString.length);
    return pathWithBranchName.split("/").slice(1).join("/");
  };

  const getPackageNameFromUrl = (url: string) => {
    if (!url.includes("packages/")) return "";
    return url.split("packages/")[1]?.split("/")[0];
  };
</script>

<!-- Open all links in new tab -->
<base target="_blank" />

<h1 class="font-mono p-5 bg-black text-3xl text-white">[ChangeLogger]</h1>

{#if loading}
  <div class="w-full h-full flex justify-center mt-20">
    <span class="text-white">Loading...</span>
  </div>
{:else}
  <div class="m-3 flex flex-col gap-3">
    <AddChangelogButton on:click={addNewUrl} />

    <div class="flex flex-col gap-5">
      {#each values as { id, url, lastViewedSha, latestSha, content, packageName }, i (id)}
        <div
          animate:flip={{ duration: 200 }}
          transition:fade={{ duration: 200 }}
          class="flex flex-col gap-3 border border-black p-2 even:bg-gray-900 odd:bg-gray-900 rounded-md"
        >
          <div class="flex items-center">
            <h2 class="text-white text-lg">
              {getRepoNameFromUrl(url)}
            </h2>
            {#if packageName}
              <span
                class="bg-blue-700 text-white border border-gray-400 px-1 rounded text-sm ml-2"
                >{packageName}</span
              >
            {/if}
          </div>

          <div class="flex gap-2">
            <input
              class="w-full text-xs"
              type="text"
              bind:value={values[i].url}
              on:input={async () =>
                (values[i] = await updateDerivedValues(values[i]))}
            />
            <button
              class="px-2 bg-red-600 text-white rounded-md"
              on:click={() =>
                (values = values.filter((_, index) => index !== i))}
              >Remove</button
            >
          </div>

          {#if url}
            <details
              on:toggle={(e) => {
                const opened = e.target?.open;
                const { lastViewedSha, latestSha } = values[i];
                if (opened && lastViewedSha !== latestSha)
                  values[i].lastViewedSha = latestSha;
              }}
              class="bg-black text-white rounded-md text-lg"
            >
              <summary class="py-2 pl-3 cursor-pointer">
                Changelog
                {#if lastViewedSha !== latestSha}
                  <span class="bg-blue-800 rounded-md px-2 py-1 ml-2 text-sm">
                    New Updates! 🦭
                  </span>
                {/if}
              </summary>

              {#if content}
                <article class="markdown-body p-2">
                  {@html marked(
                    showEverything ? content : content.slice(0, 4000)
                  )}
                </article>
                {#if !showEverything}
                  <button
                    class="bg-gray-900 text-white rounded-md px-4 py-2 m-2"
                    on:click={() => (showEverything = true)}
                  >
                    Show everything
                  </button>
                {/if}
              {/if}
            </details>
          {/if}
        </div>
      {/each}
    </div>

    <AddChangelogButton on:click={addNewUrl} />
  </div>
{/if}
