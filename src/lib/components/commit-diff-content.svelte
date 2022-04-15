<script lang="ts">
  import { html as diffHtml } from "diff2html";

  export let text: string;
</script>

<div class="diff-container">
  {@html diffHtml(text, { diffMaxChanges: 200, matching: "none" })}
</div>
