<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { sum } from "d3-array";
  import { onMount, getContext } from "svelte";
  import Node from "./Swarm.Node.svelte";
  import forceCollideRect from "../utils/forceCollideRect.js";

  export let orientation;

  const { data, xGet, rGet, yRange, custom } = getContext("LayerCake");
  const simulation = forceSimulation().stop();

  const isRendered =
    typeof document === "undefined"
      ? false
      : !!document.querySelector(`.swarm-${orientation} .node`);

  const getDataAttrs = (id) => {
    const q = `.swarm-${orientation} [data-id="${id}"]`;
    console.log(q);
    const node = document.querySelector(q);
    const x = +node.dataset.x;
    const y = +node.dataset.y;
    const width = +node.dataset.width;
    const height = +node.dataset.height;
    return { x, y, width, height };
  };

  const getSimData = () => {
    return [
      ...$data.map((d) => ({
        ...d,
        ...getDataAttrs(d.id),
      })),
    ];
  };

  let simData = isRendered ? getSimData() : undefined;

  const runSim = () => {
    if (isRendered) return false;
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
</script>

{#if simData}
  {#each simData as d}
    <Node {...d} size="{$rGet(d)}" ratio="{ratio}" />
  {/each}
{/if}
