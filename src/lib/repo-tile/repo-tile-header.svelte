<script lang="ts">
  import DeleteButton from "./delete-button.svelte";
  import PackageName from "./package-name.svelte";

  export let packageName: string | undefined;
  export let repoName: string | undefined;
  export let onDelete: () => void;
</script>

<div class="flex items-center">
  <h2 class="text-white text-lg">
    {repoName || "[New Repo]"}
  </h2>
  <PackageName {packageName} />
  <div class="flex-grow" />
  <DeleteButton on:click={onDelete} />
</div>
