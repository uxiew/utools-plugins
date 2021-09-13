<script>
  let promise;
  async function getRandomNumber() {
    const res = await fetch(
      `https://developer.mozilla.org/en-US/search-index.json`,
      {
        headers: {
          'content-type': 'application/json'
        },
        method: 'GET',
        mode: 'cors'
      }
    );
    const text = await res.json();

    if (res.ok) {
      return text;
    } else {
      throw new Error(text);
    }
  }

  function handleClick() {
    promise = downloadFileAsync(
      `https://developer.mozilla.org/en-US/search-index.json`
    );
  }

  let pluginPath = window.pluginPath; //	utools 插件路径
  let asarFileName = window.asarFileName; // 数据存储文件夹

  // let destDBDir = window.mkdir(pluginPath + asarFileName);
</script>

<h1>-window.asarFileName: {asarFileName}</h1>
<h1>-utools plugins: {pluginPath}</h1>

<button on:click={handleClick}>generate random number</button>

<button on:click={handleClick}>test</button>

<!-- replace this element -->
{#await promise}
  <p>...waiting</p>
{:then number}
  <p>The number is {number}</p>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  * {
    color: #dde8dc;
  }
</style>
