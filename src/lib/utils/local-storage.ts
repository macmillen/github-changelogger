import { browser } from "$app/environment";

export const localStorage = browser ? window.localStorage : undefined;
