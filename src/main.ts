import "github-markdown-css";
import "./app.css";
import App from "./App.svelte";
import "./diff-theme.css";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
