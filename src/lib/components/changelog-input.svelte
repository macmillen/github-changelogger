<script lang="ts">
  export let value: string;
</script>

<input
  class="w-full text-xs hover:bg-gray-600 transition text-white rounded-md border-gray-700 bg-transparent"
  placeholder="Add Github Repo URL or Changelog File URL"
  type="text"
  {value}
  on:input
/>
