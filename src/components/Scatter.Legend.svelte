<script>
  export let band;
  $: data = band ? band[1] : [];
  $: console.log(band);
</script>

<ul>
  {#each data as d, i}
    <li class="node-{i}">
      <p>{d.spotifyName}</p>
    </li>
  {/each}
</ul>

<style>
  ul {
    display: flex;
    list-style-type: none;
  }

  li p {
    display: inline-block;
    padding: 0.5em;
    margin: 0;
    line-height: 1;
  }

  .node-0 p {
    background-color: var(--node-0);
  }

  .node-1 p {
    background-color: var(--node-1);
    color: var(--off-white);
  }

  .node-2 p {
    background-color: var(--node-2);
    color: var(--off-white);
  }

  .node-3 p {
    background-color: var(--node-3);
  }

  .node-4 p {
    background-color: var(--node-4);
  }

  .node-5 p {
    background-color: var(--node-5);
  }
</style>
