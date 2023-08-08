<script lang="ts">
  import * as extensionApi from "../Apis/extensionApi";
</script>

<button
  on:click={() => {
    extensionApi.createInfoToast("Hello");
  }}>Click me</button
>
