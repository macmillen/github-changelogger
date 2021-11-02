import type { Entry, EntryInStorage } from "../types";

export const getStorableEntryValues = ({
  url,
  lastViewedShas,
}: Entry | EntryInStorage): EntryInStorage => ({
  url,
  lastViewedShas,
});
