import { LocalStorageKey } from "$lib/constants/local-storage";
import type { Entry, EntryInStorage, ShaType } from "$lib/types/types";
import { getStorableEntryFields } from "$lib/utils/entry";
import { fetchLatestChangelogSha, fetchLatestCommitSha } from "$lib/utils/fetch";
import { localStorage } from "$lib/utils/local-storage";
import { getOwnerAndRepoFromUrl, getPackageNameFromUrl } from "$lib/utils/url";
import { writable } from "svelte/store";

const storeEntriesInLocalStorage = (entries: Entry[]) => {
  const storableEntries: EntryInStorage[] = entries.map(getStorableEntryFields);
  localStorage?.setItem(LocalStorageKey.Values, JSON.stringify(storableEntries));
};

const loadDerivedData = async (entry: EntryInStorage | Entry): Promise<Entry> => {
  const [owner, repo] = getOwnerAndRepoFromUrl(entry.url);
  return {
    ...getStorableEntryFields(entry),
    id: "id" in entry ? entry.id : Symbol(),
    latestShas: {
      Changelog: await fetchLatestChangelogSha(entry.url),
      Commit: await fetchLatestCommitSha(entry.url),
    },
    packageName: getPackageNameFromUrl(entry.url),
    repo,
    owner,
  };
};

const loadEntries = async (cb: (entries: Entry[]) => void) => {
  const storageEntries = localStorage?.getItem(LocalStorageKey.Values);
  const parsedEntries = JSON.parse(storageEntries ?? "[]") as EntryInStorage[];

  const entries = parsedEntries.map<Promise<Entry>>(loadDerivedData);

  cb(await Promise.all(entries));
};

const createEntryStore = () => {
  const { subscribe, update, set } = writable<Entry[]>([]);

  loadEntries(set);

  subscribe(storeEntriesInLocalStorage);

  return {
    subscribe,
    addNewUrl: () => {
      update((entries) => {
        const newEntry: Entry = {
          url: "",
          id: Symbol(),
          lastViewedShas: {},
          latestShas: {},
        };
        return [...entries, newEntry];
      });
    },
    updateUrl: async (entry: Entry, url: string) => {
      entry.url = url;
      const updatedEntry = await loadDerivedData(entry);
      update((entries) => {
        return entries.map((e) => (entry.id === e.id ? updatedEntry : e));
      });
    },
    delete: (entry: Entry) => {
      update((entries) => {
        return entries.filter((e) => e !== entry);
      });
    },
    updateLastViewedSha: (entry: Entry, type: ShaType) => {
      update((entries) => {
        const { lastViewedShas, latestShas } = entry;
        if (lastViewedShas[type] !== latestShas[type]) {
          entry.lastViewedShas[type] = latestShas[type];
        }
        return [...entries];
      });
    },
  };
};

export const entryStore = createEntryStore();
