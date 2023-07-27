<script>
  import * as extensionApi from "../extensionApi";
</script>

<button
  on:click={() => {
    extensionApi.createInfoToast("Hello");
  }}>Click me</button
>
