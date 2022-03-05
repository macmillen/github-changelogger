export enum ShaType {
  Changelog = "Changelog",
  Commit = "Commit",
}

export type Entry = {
  url: string;
  repo?: string;
  owner?: string;
  id: symbol;
  lastViewedShas: Partial<Record<ShaType, string>>;
  latestShas: Partial<Record<ShaType, string>>;
  packageName?: string;
};

export type CommitData = {
  sha: string;
  author?: {
    avatar_url: string;
    login: string;
  };
  commit: {
    author: {
      date: string;
      name: string;
    };
    message: string;
  };
  committer: {
    avatar_url: string;
  };
};

export type Commit = {
  author: string;
  avatarUrl: string;
  date: string;
  message: string;
  sha: string;
};

export type EntryInStorage = Pick<Entry, "lastViewedShas" | "url">;
