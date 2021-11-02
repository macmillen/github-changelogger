export type Entry = {
  url: string;
  repoName?: string;
  id: symbol;
  lastViewedChangelogSha?: string;
  latestChangelogSha?: string;
  lastViewedCommitSha?: string;
  latestCommitSha?: string;
  packageName?: string;
};

export type CommitData = {
  sha: string;
  author: {
    avatar_url: string;
    login: string;
  };
  commit: {
    author: {
      date: string;
    };
    message: string;
  };
};

export type Commit = {
  author: string;
  avatarUrl: string;
  date: string;
  message: string;
  sha: string;
};

export type EntryInStorage = Pick<
  Entry,
  "lastViewedChangelogSha" | "lastViewedCommitSha" | "url"
>;
