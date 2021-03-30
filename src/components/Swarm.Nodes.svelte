<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { sum } from "d3-array";
  import { onMount, getContext } from "svelte";
  import Node from "./Swarm.Node.svelte";
  import forceCollideRect from "../utils/forceCollideRect.js";

  export let simData;

  let mounted;

  const { data, xGet, rGet, yRange, custom } = getContext("LayerCake");
  const simulation = forceSimulation().stop();

  const runSim = () => {
    if (mounted) return false;
    console.log("run sim");
    simulation.stop();

    simData = [
      ...$data.map((d) => ({
        ...d,
        x: mobile ? Math.random() * 100 : $xGet(d),
        y: mobile ? $xGet(d) : Math.random() * 100,
        width: $rGet(d),
        height: $rGet(d),
      })),
    ];

    simulation
      .nodes(simData)
      .velocityDecay(0.2)
      .force(
        "x",
        forceX()
          .x((d) => (mobile ? midY : $xGet(d)))
          .strength(mobile ? 0.2 : 1)
      )
      .force(
        "y",
        forceY()
          .y((d) => (mobile ? $xGet(d) : midY))
          .strength(mobile ? 1 : 0.2)
      )
      .force("collide", forceCollideRect())
      .alpha(1)
      .restart();

    for (var i = 0; i < 300; i++) {
      simulation.tick();
    }

    simData = [...simData];
  };

  $: midY = sum($yRange) / 2;
  $: ratio = $custom.aspectRatio;
  $: mobile = $custom.mobile;
  $: $data, ratio, runSim();

  onMount(() => {
    mounted = true;
  });
</script>

{#if simData}
  {#each simData as d}
    <Node {...d} size="{$rGet(d)}" ratio="{ratio}" />
  {/each}
{/if}
