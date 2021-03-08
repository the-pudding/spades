<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { getContext } from "svelte";
  import Dot from "./Scatter.Dot.svelte";

  import forceCollideRect from "../utils/forceCollideRect.js";

  export let r;
  export let active;

  const { data, xGet, yGet } = getContext("LayerCake");

  let simData = [];
  const simulation = forceSimulation().stop();

  const runSim = () => {
    simData = [
      ...$data.map((d) => ({
        ...d,
        width: 20,
        height: 12,
      })),
    ];
    simulation
      .nodes(simData)
      .velocityDecay(0.5)
      .force(
        "y",
        forceY()
          .y((d) => $yGet(d))
          .strength(1)
      )
      .force(
        "x",
        forceX()
          .x((d) => $xGet(d))
          .strength(1)
      )
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
  $: $data, runSim();
</script>

{#each $data as d}
  <Dot
    r="{r}"
    d="{d}"
    on:enter="{({ detail }) => (active = detail)}"
    on:exit="{({ detail }) => (active = null)}"
  />
{/each}
