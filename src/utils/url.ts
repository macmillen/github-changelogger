import { GITHUB_URL, RAW_CONTENT_URL } from "../constants/github";

export const getOwnerAndRepoFromUrl = (
  url: string
): [owner: string, repo: string] =>
  url.split("/").slice(3, 5) as [owner: string, repo: string];

export const convertUrlToRawUrl = (url: string) =>
  url.replace(GITHUB_URL, RAW_CONTENT_URL).replace("/blob", "");

export const getFilePathFromUrl = (url: string) => {
  const searchString = "blob/";
  const index = url.indexOf(searchString);
  const pathWithBranchName = url.substring(index + searchString.length);
  return pathWithBranchName.split("/").slice(1).join("/");
};

export const getPackageNameFromUrl = (url: string) => {
  if (!url.includes("packages/")) return "";
  return url.split("packages/")[1]?.split("/")[0];
};

export const getPullRequestUrlFromUrl = (url: string, pr: number) => {
  const [owner, repo] = getOwnerAndRepoFromUrl(url);
  return `${GITHUB_URL}/${owner}/${repo}/pull/${pr}`;
};
