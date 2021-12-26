import "diff2html/bundles/css/diff2html.min.css";
import "github-markdown-css";
import "./app.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
