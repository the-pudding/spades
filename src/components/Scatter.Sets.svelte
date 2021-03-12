<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { getContext, onMount } from "svelte";
  import Node from "./Scatter.Node.svelte";

  import forceCollideRect from "../utils/forceCollideRect.js";

  export let r;
  export let active;

  let ready;
  let shadow;
  let dimensions = [];
  let simData = [];

  const { data, xGet, yGet, yDomain, width, height } = getContext("LayerCake");

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
          .strength(0.9)
      )
      .force(
        "y",
        forceY()
          .y((d) => $yGet(d))
          .strength(0.5)
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
    shadow.querySelectorAll("p").forEach((el) => {
      const bbox = el.getBoundingClientRect();
      dimensions.push({
        width: Math.ceil((bbox.width / $width) * 100) + 2,
        height: Math.ceil((bbox.height / $height) * 100),
      });
    });
    runSim();
  };

  $: $width > 100, renderShadow();
  $: $yDomain, runSim();
</script>

<div class="shadow" bind:this="{shadow}">
  {#each $data as d}
    {#each d.dates as date, i}
      <p>#{d.ranks[i]} {d.titles[i]}</p>
    {/each}
  {/each}
</div>

{#each simData as d}
  <Node
    r="{r}"
    d="{d}"
    on:enter="{({ detail }) => (active = detail)}"
    on:exit="{({ detail }) => (active = null)}"
  />
{/each}

<style>
  .shadow {
    height: 0;
    overflow: hidden;
    visibility: none;
  }

  .shadow p {
    display: inline-block;
    margin: 0;
    padding: 0;
    font-size: 16px;
    padding: 2px 4px;
    line-height: 1;
  }
</style>
