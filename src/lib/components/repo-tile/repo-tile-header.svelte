<script lang="ts">
  import Icon from "@iconify/svelte";
  import DeleteButton from "./delete-button.svelte";
  import PackageName from "./package-name.svelte";

  export let url: string;
  export let packageName: string | undefined;
  export let repo: string | undefined;
  export let onDelete: () => void;
</script>

<div class="flex items-center">
  <h2 class="text-white text-lg">
    {repo || "[New Repo]"}
  </h2>
  <PackageName {packageName} />
  <div class="flex-grow" />
  <a href={url} class="mr-1" target="_blank">
    <Icon icon="mdi:github" class="w-5 h-5 text-white" />
  </a>
  <DeleteButton on:click={onDelete} />
</div>
