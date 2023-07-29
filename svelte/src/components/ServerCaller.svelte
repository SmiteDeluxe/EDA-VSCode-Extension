<script>
  let pythonString = "";
  async function callPythonServer() {
    fetch("http://127.0.0.1:5000/", { method: "GET" })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        pythonString = data;
      })
      .catch((err) => console.error(err));
  }
</script>

<button
  on:click={() => {
    callPythonServer();
  }}>Call Python Mini Server</button
>
<p>{pythonString}</p>
