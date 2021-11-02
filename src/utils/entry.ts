import type { Entry, EntryInStorage } from "../types";

export const getStorableEntryValues = ({
  url,
  lastViewedChangelogSha,
  lastViewedCommitSha,
}: Entry | EntryInStorage): EntryInStorage => ({
  url,
  lastViewedChangelogSha,
  lastViewedCommitSha,
});
