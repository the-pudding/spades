<script>
  import { csvFormat } from "d3-dsv";

  export let data;
  let shadow;

  const getComputedValues = () => {
    const songs = [];
    shadow.querySelectorAll("p.lg").forEach((el) => {
      const { width, height } = el.getBoundingClientRect();
      const id = el.dataset.id;
      songs.push({ id, width: Math.ceil(width), height: Math.ceil(height) });
    });
    window.songs = csvFormat(songs);
  };

  $: if (shadow) getComputedValues();
</script>

<div class="shadow" bind:this="{shadow}">
  {#each data as d}
    {#each d.dates as date, i}
      <p data-id="{d.name}|{i}" class="lg scatter-node-text">
        #{d.ranks[i]}
        {d.titles[i]}
      </p>
      <!-- <p
        data-id="{d.name}|{i}"
        class="sm scatter-node-text scatter-node-text--sm"
      >
        #{d.ranks[i]}
        {d.titles[i]}
      </p> -->
    {/each}
  {/each}
</div>

<style>
  .shadow {
    height: 0;
    overflow: hidden;
    visibility: none;
  }
</style>
