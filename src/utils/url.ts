import { GITHUB_URL, RAW_CONTENT_URL } from "../constants/github";

export const getRepoNameFromUrl = (url: string) =>
  url.split("/").slice(3, 5).join("/");

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
