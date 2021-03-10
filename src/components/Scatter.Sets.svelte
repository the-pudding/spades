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

  const { data, xGet, yGet, xRange, yRange, width } = getContext("LayerCake");

  let simData = [];
  const simulation = forceSimulation().stop();

  const getSimData = () => {
    let a = 0;
    const all = $data.map((d, i) => {
      return d.dates.map((date, j) => {
        const dim = dimensions[a];
        const topDate = date;
        const topRank = d.ranks[j];
        const title = d.titles[j];
        const { spotifyName, name, band } = d;

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
      .velocityDecay(0.5)
      .force("x", forceX().x($xGet).strength(1))
      .force("y", forceY().y($yGet).strength(1))
      // .force("collide", forceCollide($rGet).strength(1))
      .force("collide", forceCollideRect())

      .on("tick", () => {
        simData = [...simData];
      })
      .restart();
    // for (var i = 0; i < 300; i++) {
    //   console.log(simData[0].x);
    //   simulation.tick();
    // }
    // simData = [...simData];
  };

  const renderShadow = () => {
    if (!shadow) return false;
    shadow.querySelectorAll("p").forEach((el) => {
      // const bbox = el.getBoundingClientRect();
      dimensions.push({
        width: (50 / $width) * 100,
        height: (50 / $width) * 100,
      });
    });
    runSim();
  };

  $: $width, renderShadow();
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

<!-- 
{#each $data as d}
  {#each d.dates as date, i}
    <Node
      r="{r}"
      d="{{ ...d, topDate: date, topRank: d.ranks[i], title: d.titles[i] }}"
      on:enter="{({ detail }) => (active = detail)}"
      on:exit="{({ detail }) => (active = null)}"
    />
  {/each}
{/each} -->
<style>
  .shadow {
    height: 0;
    overflow: hidden;
    visibility: none;
  }

  .shadow p {
    display: inline-block;
    margin: 0;
    line-height: 1;
    padding: 0 0.25em;
  }
</style>
