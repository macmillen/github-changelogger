export type Entry = {
  url: string;
  id: symbol;
  lastViewedSha?: string;
  latestSha?: string;
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
