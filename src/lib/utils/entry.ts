import type { Entry, EntryInStorage } from "$lib/types/types";

export const getStorableEntryFields = ({
  url,
  lastViewedShas,
}: Entry | EntryInStorage): EntryInStorage => ({
  url,
  lastViewedShas,
});
