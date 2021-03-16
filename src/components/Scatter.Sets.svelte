<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { getContext, onMount } from "svelte";
  import Node from "./Scatter.Node.svelte";

  import forceCollideRect from "../utils/forceCollideRect.js";

  export let key;

  let ready;
  let shadow;
  let dimensions = [];
  let simData = [];

  const { data, xGet, yGet, yDomain, width, height, custom } = getContext(
    "LayerCake"
  );

  const simulation = forceSimulation().stop();

  const getSimData = () => {
    let a = 0;
    const all = $data.map((d, i) => {
      return d.dates.map((date, j) => {
        const topDate = date;
        const topRank = d.ranks[j];
        const title = d.titles[j];
        const { spotifyName, name, band } = d;
        const dim = dimensions[a];

        a += 1;
        return {
          i,
          spotifyName,
          name,
          band,
          topDate,
          topRank,
          title,
          ...dim,
        };
      });
    });
    const flat = [].concat(...all);
    return flat;
  };

  const runSim = () => {
    simulation.stop();
    simData = getSimData();
    simulation
      .nodes(simData)
      // .velocityDecay(0.5)
      .force(
        "x",
        forceX()
          .x((d) => $xGet(d))
          .strength(1)
      )
      .force(
        "y",
        forceY()
          .y((d) => $yGet(d))
          .strength(0.05)
      )
      .force("collide", forceCollideRect())

      .on("tick", () => {
        simData = [...simData];
      })
      .alpha(1);

    for (var i = 0; i < 300; i++) {
      simulation.tick();
    }

    simData = [...simData];
  };

  const renderShadow = () => {
    if (!shadow) return false;
    // if (!window.songs) window.songs = [];
    shadow.querySelectorAll("p.lg").forEach((el) => {
      const bbox = el.getBoundingClientRect();
      dimensions.push({
        width: Math.ceil((bbox.width / $width) * 100) + 2,
        height: Math.ceil((bbox.height / $height) * 100),
      });
      // window.songs.push({
      //   i: el.dataset.id,
      //   w: bbox.width,
      //   h: bbox.height,
      // });
    });
    runSim();
  };

  $: $width > 100, renderShadow();
  $: $yDomain, runSim();
</script>

<div class="shadow" bind:this="{shadow}">
  {#each $data as d}
    {#each d.dates as date, i}
      <p data-id="{d.name}" class="lg scatter-node-text">
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

{#each simData as d}
  <Node d="{d}" />
{/each}

<ul>
  {#each $data as d, i}
    <li class:active="{$custom.activeBand === key}" class="node-{i}">
      <p>{d.spotifyName}</p>
    </li>
  {/each}
</ul>

<style>
  .shadow {
    height: 0;
    overflow: hidden;
    visibility: none;
  }

  ul {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
  }

  li {
    display: none;
  }

  li.active {
    display: block;
  }

  li p {
    display: inline-block;
    padding: 0.5em;
    margin: 0;
    line-height: 1;
  }
</style>
