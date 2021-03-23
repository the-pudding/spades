<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { sum } from "d3-array";
  import { getContext } from "svelte";
  import Node from "./Swarm.Node.svelte";

  import forceCollideRect from "../utils/forceCollideRect.js";
  import forceCollideRect2 from "../utils/forceCollideRect2.js";

  const { data, xGet, rGet, yRange, custom } = getContext("LayerCake");
  let simData = [];
  const simulation = forceSimulation().stop();

  const runSim = () => {
    simulation.stop();

    simData = [
      ...$data.map((d) => ({
        ...d,
        x: $xGet(d),
        y: Math.random() * 100,
        width: $rGet(d),
        height: $rGet(d),
      })),
    ];

    simulation
      .nodes(simData)
      .velocityDecay(0.5)
      .force("y", forceY(midY).strength(0.5))
      .force("x", forceX().x($xGet).strength(1))
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
  $: $data, ratio, runSim();
</script>

{#each simData as d}
  <Node {...d} size="{$rGet(d)}" ratio="{ratio}" />
{/each}
