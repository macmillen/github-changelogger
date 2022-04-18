import { browser } from "$app/env";
import { LocalStorageKey } from "$lib/constants/local-storage";
import { writable } from "svelte/store";

type ViewedCommitShasMap = Record<string, "1">;

const createViewedCommitShas = () => {
  if (!browser) return undefined;

  const value = localStorage.getItem(LocalStorageKey.ViewedCommitShas);
  const viewedCommitShas = JSON.parse(value ?? "{}") as ViewedCommitShasMap;

  const { subscribe, update } = writable(viewedCommitShas);

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
