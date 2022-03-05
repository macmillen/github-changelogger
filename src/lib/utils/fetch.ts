import type { Commit, CommitData } from "$lib/types/types";
import { GITHUB_API_URL } from "../constants/github";
import { getTimeAgo } from "./time";
import { convertUrlToRawUrl, getFilePathFromUrl, getOwnerAndRepoFromUrl } from "./url";

export const fetchDiff = async (url: string, sha: string): Promise<string> => {
  const [owner, repo] = getOwnerAndRepoFromUrl(url);
  const constructedUrl = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits/${sha}`;
  const response = await fetch(constructedUrl, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  return response.text();
};

export const fetchChangelog = async (url: string): Promise<string> => {
  const rawUrl = convertUrlToRawUrl(url);
  const response = await fetch(rawUrl);
  return response.text();
};

export const fetchCommits = async (url: string): Promise<Commit[]> => {
  const [owner, repo] = getOwnerAndRepoFromUrl(url);
  const constructedUrl = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits?per_page=20`;
  const response = await fetch(constructedUrl);
  const json = (await response.json()) as CommitData[];

  return json.map((c) => ({
    author: c.author?.login ?? c.commit.author.name,
    date: getTimeAgo(new Date(c.commit.author.date)),
    message: c.commit.message,
    sha: c.sha,
    avatarUrl: c.author?.avatar_url ?? c.committer.avatar_url,
  }));
};

export const fetchLatestChangelogSha = async (url: string): Promise<string | undefined> => {
  if (!url) return undefined;
  try {
    const [owner, repo] = getOwnerAndRepoFromUrl(url);
    const filePath = getFilePathFromUrl(url);
    const constructedUrl = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits?path=${filePath}&per_page=1`;
    const response = await fetch(constructedUrl);
    const json = await response.json();
    const sha = json[0]?.sha;
    return typeof sha === "string" ? sha : undefined;
  } catch {
    return undefined;
  }
};

export const fetchLatestCommitSha = async (url: string): Promise<string | undefined> => {
  if (!url) return undefined;
  try {
    const [owner, repo] = getOwnerAndRepoFromUrl(url);
    const constructedUrl = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits?per_page=1`;
    const response = await fetch(constructedUrl);
    const json = (await response.json()) as CommitData[];

    const sha = json[0]?.sha;
    return typeof sha === "string" ? sha : undefined;
  } catch {
    return undefined;
  }
};
