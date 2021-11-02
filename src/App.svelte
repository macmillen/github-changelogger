<script lang="ts">
  import marked from "marked";
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import AddChangelogButton from "./lib/add-changelog-button.svelte";
  import CommitItem from "./lib/commit-item.svelte";
  import Error from "./lib/error.svelte";
  import ExpandableTabs from "./lib/expandable-tabs.svelte";
  import IconDelete from "./lib/icon-delete.svelte";
  import Loader from "./lib/loader.svelte";
  import type { Commit, CommitData, Entry } from "./types";

  const RAW_CONTENT_URL = "https://raw.githubusercontent.com";
  const GITHUB_URL = "https://github.com";
  const GITHUB_API_URL = "https://api.github.com";

  let values: Entry[] = [];
  let loading = true;
  let showEverything = false;
  let selectedCommitSha: string | null = null;

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
    packageName: getPackageNameFromUrl(entry.url),
  });

  const addNewUrl = () => (values = [...values, { url: "", id: Symbol() }]);

  const convertUrl = (url: string) =>
    url.replace(GITHUB_URL, RAW_CONTENT_URL).replace("/blob", "");

  const getRepoNameFromUrl = (url: string) =>
    url.split("/").slice(3, 5).join("/");

  const fetchChangelog = async (url: string) =>
    await (await fetch(convertUrl(url))).text();

  const fetchCommits = async (url: string): Promise<Commit[]> => {
    const repoName = getRepoNameFromUrl(url);
    const constructedUrl = `${GITHUB_API_URL}/repos/${repoName}/commits?per_page=10`;
    const jsonResult = (await (
      await fetch(constructedUrl)
    ).json()) as CommitData[];

    const data = jsonResult.map((c) => ({
      author: c.author.login,
      date: getTimeAgo(new Date(c.commit.author.date)),
      message: c.commit.message,
      sha: c.sha,
      avatarUrl: c.author.avatar_url,
    }));

    return data;
  };

  const getTimeAgo = (date: Date): string => {
    const dateDiff = Date.now() - +date;
    const diffMinutes = Math.ceil(dateDiff / (1000 * 60));
    const diffHours = Math.ceil(diffMinutes / 60);
    const diffDays = Math.ceil(diffHours / 24);

    if (diffMinutes < 60) return `${diffMinutes} m`;
    else if (diffHours < 24) return `${diffHours} h`;
    else return `${diffDays} d`;
  };

  const fetchDiff = async (url: string, sha: string): Promise<string> => {
    const repoName = getRepoNameFromUrl(url);
    const constructedUrl = `${GITHUB_API_URL}/repos/${repoName}/commits/${sha}`;
    const textResult = await (
      await fetch(constructedUrl, {
        headers: {
          Accept: "application/vnd.github.v3.diff",
        },
      })
    ).text();
    return textResult;
  };

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

  const gitDiffToHtml = (s: string): { html: string; modification: number } => {
    switch (s[0]) {
      case "+":
        return { html: `<ins>${s}</ins>`, modification: 1 };
      case "-":
        return { html: `<del>${s}</del>`, modification: -1 };
      default:
        return { html: s, modification: 0 };
    }
  };

  const getDiffDataFromRawTextFile = (
    rawText: string
  ): {
    files: { html: string; filePath: string }[];
    ins: number;
    del: number;
    filesChanged: number;
  } => {
    const files = rawText
      .split("diff --git ")
      .slice(1)
      .map((s) => {
        const [filePath, _1, _2, _3, _4, ...otherLines] = s.split("\n");
        const { html, ins, del } = otherLines.reduce(
          (acc, l) => {
            const sanatizedText = l
              .replaceAll("<", "&#60;")
              .replaceAll(">", "&#62;");
            const { html, modification } = gitDiffToHtml(sanatizedText);
            const ins = acc.ins + Number(modification === 1);
            const del = acc.del + Number(modification === -1);
            return {
              html: `${acc.html}\n${html}`,
              ins,
              del,
            };
          },
          { html: "", ins: 0, del: 0 }
        );
        return {
          html,
          filePath: filePath.split(" ")[0].split("/").slice(1).join("/"),
          del,
          ins,
        };
      });
    return {
      ...files.reduce(
        (acc, { del, ins }) => ({ del: acc.del + del, ins: acc.ins + ins }),
        { ins: 0, del: 0 }
      ),
      filesChanged: files.length,
      files,
    };
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
      {#each values as { id, url, lastViewedSha, latestSha, packageName }, i (id)}
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
              class="w-full text-xs bg-gray-800 hover:bg-gray-700 transition text-white rounded-md border-none"
              type="text"
              bind:value={values[i].url}
              on:input={async () =>
                (values[i] = await updateDerivedValues(values[i]))}
            />
            <button
              class="px-2 bg-red-600 hover:bg-red-800 transition ring-4 ring-red-900/50 text-white rounded-md"
              on:click={() =>
                (values = values.filter((_, index) => index !== i))}
            >
              <IconDelete />
            </button>
          </div>

          {#if url}
            <ExpandableTabs
              changelogUpdates={lastViewedSha !== latestSha}
              onExpand={() => {
                const { lastViewedSha, latestSha } = values[i];
                if (lastViewedSha !== latestSha)
                  values[i].lastViewedSha = latestSha;
              }}
            >
              <div slot="commits">
                {#await fetchCommits(url)}
                  <Loader />
                {:then commits}
                  <div class="flex flex-col divide-y divide-gray-600">
                    {#each commits as commit}
                      <CommitItem
                        {commit}
                        selected={commit.sha === selectedCommitSha}
                        on:click={() => {
                          if (selectedCommitSha === commit.sha)
                            selectedCommitSha = null;
                          else selectedCommitSha = commit.sha;
                        }}
                      />
                      {#if commit.sha === selectedCommitSha}
                        {#await fetchDiff(url, commit.sha)}
                          <Loader />
                        {:then text}
                          <p class="text-gray-100">
                            {getDiffDataFromRawTextFile(text).filesChanged} files
                            changed
                          </p>
                          <div class="flex gap-2">
                            <span class="text-green-600"
                              >{getDiffDataFromRawTextFile(text).ins} additions</span
                            >
                            <span class="text-red-600"
                              >{getDiffDataFromRawTextFile(text).del} deletions</span
                            >
                          </div>
                          {#each getDiffDataFromRawTextFile(text).files as { filePath, html }}
                            <p class="text-gray-100">
                              {filePath}
                            </p>
                            <div class="markdown-body">
                              {@html `<pre class="!px-0">${html}</pre>`}
                            </div>
                          {/each}
                        {:catch error}
                          <Error {error} />
                        {/await}
                      {/if}
                    {/each}
                  </div>
                {:catch error}
                  <Error {error} />
                {/await}
              </div>

              <div slot="changelog">
                {#await fetchChangelog(url)}
                  <Loader />
                {:then content}
                  <div class="markdown-body p-2">
                    {@html marked(
                      showEverything ? content : content.slice(0, 4000)
                    )}
                  </div>
                  {#if !showEverything}
                    <button
                      class="bg-gray-900 text-white rounded-md px-4 py-2 m-2"
                      on:click={() => (showEverything = true)}
                    >
                      Show everything
                    </button>
                  {/if}
                {:catch error}
                  <Error {error} />
                {/await}
              </div>
            </ExpandableTabs>
          {/if}
        </div>
      {/each}
    </div>

    <AddChangelogButton on:click={addNewUrl} />
  </div>
{/if}
