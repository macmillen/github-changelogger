import type { Entry, EntryInStorage } from "$lib/types/types";

export const getStorableEntryValues = ({
  url,
  lastViewedShas,
}: Entry | EntryInStorage): EntryInStorage => ({
  url,
  lastViewedShas,
});
