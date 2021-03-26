<script>
  import { csvFormat } from "d3-dsv";
  import { onMount } from "svelte";
  export let source;
  export let data;
  export let filename;

  let mounted = false;

  let hiddenEl;
  let url;

  $: if (mounted && data) {
    const formatted = csvFormat(data);
    const blob = new Blob([formatted], { type: "text/csv;charset=utf-8;" });
    url = window.URL.createObjectURL(blob);
  }

  const download = () => {
    hiddenEl.click();
  };

  onMount(() => {
    mounted = true;
  });
</script>

<div>
  <p>{source} <button on:click="{download}">Download the data.</button></p>

  <a href="{url}" download="{filename}" hidden bind:this="{hiddenEl}"
    >Download the data</a
  >
</div>

<style>
  div {
    border-top: 1px solid var(--off-white);
    margin: 2em auto;
    max-width: 40em;
  }

  p {
    margin: 0;
    padding-top: 0.5em;
    font-size: 0.9em;
    color: var(--gray-dark);
    line-height: 1.4;
  }

  button {
    padding: 0;
    border-bottom: 1px solid var(--gray-light);
  }

  button:hover {
    background: transparent;
  }
</style>
