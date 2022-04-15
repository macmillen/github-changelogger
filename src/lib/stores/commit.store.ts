import { browser } from "$app/env";
import { LocalStorageKey } from "$lib/constants/local-storage";
import { writable } from "svelte/store";

type ViewedCommitShasMap = Record<string, "1">;

const getViewedCommitShasFromLocalStorage = (): ViewedCommitShasMap => {
  const value = localStorage.getItem(LocalStorageKey.ViewedCommitShas);
  return JSON.parse(value ?? "{}");
};

const createViewedCommitShas = () => {
  if (!browser) return undefined;
  const { subscribe, update } = writable<ViewedCommitShasMap>(
    getViewedCommitShasFromLocalStorage()
  );

  return {
    subscribe,
    add: (commitSha: string) =>
      update((map) => {
        const updatedMap = { ...map, [commitSha]: "1" } as const;
        localStorage.setItem(LocalStorageKey.ViewedCommitShas, JSON.stringify(updatedMap));
        return updatedMap;
      }),
  };
};

export const viewedCommitShas = createViewedCommitShas();
