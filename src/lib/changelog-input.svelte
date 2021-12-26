<script lang="ts">
  export let value: string;
</script>

<input
  class="w-full text-xs bg-gray-800 hover:bg-gray-700 transition text-white rounded-md border-none"
  placeholder="Add Github Repo URL or Changelog File URL"
  type="text"
  bind:value
  on:input
/>
