import { browser } from "$app/env";

export const localStorage = browser ? window.localStorage : undefined;
