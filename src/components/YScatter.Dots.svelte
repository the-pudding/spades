<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { getContext, onMount } from "svelte";
  import Dot from "./Scatter.Dot.svelte";

  import forceCollideRect from "../utils/forceCollideRect2.js";

  export let r;
  export let active;

  let shadow;
  let dimensions = [];

  const { data, xGet, yGet, xRange, yRange } = getContext("LayerCake");

  let simData = [];
  const simulation = forceSimulation().stop();

  const runSim = () => {
    simData = [
      ...$data.map((d, i) => ({
        ...d,
        x: $xGet(d),
        y: $yGet(d),
        ...dimensions[i],
      })),
    ];

    simulation
      .nodes(simData)
      .velocityDecay(0.5)
      .force(
        "y",
        forceY()
          .y((d) => $yGet(d))
          .strength(0.5)
      )
      .force(
        "x",
        forceX()
          .x((d) => $xGet(d))
          .strength(0.5)
      )
      // .force("collide", forceCollide($rGet).strength(1))
      .force(
        "collide",
        forceCollideRect().size((d) => [d.width, d.height])
      )
      .on("tick", () => {
        simData = [...simData];
      })
      .restart();
    // for (var i = 0; i < 300; i++) {
    //   console.log(simData[0].x);
    //   simulation.tick();
    // }
    simData = [...simData];
  };
  // $: $data, runSim();
  onMount(() => {
    shadow.querySelectorAll("p").forEach((el) => {
      const { width, height } = el.getBoundingClientRect();
      dimensions.push({ width: 100, height: 22 });
    });
  });

  $: if ($yRange[0] > 1) runSim();
</script>

<div class="shadow" bind:this="{shadow}">
  {#each $data as d, i}
    <p>{d.name}</p>
  {/each}
</div>

{#each simData as d}
  <Dot
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
    line-height: 1;
    padding: 0 0.25em;
  }
</style>
