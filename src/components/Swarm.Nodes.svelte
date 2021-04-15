<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { sum } from "d3-array";
  import { onMount, getContext } from "svelte";
  import Node from "./Swarm.Node.svelte";
  import forceCollideRect from "../utils/forceCollideRect.js";

  export let orientation;

  const prerendered =
    typeof document === "undefined"
      ? false
      : !!document.querySelector(`.swarm-${orientation} .node`);

  const { data, xGet, rGet, rScale, yRange, custom } = getContext("LayerCake");
  const simulation = forceSimulation().stop();

  const getDataAttrs = (id) => {
    const q = `.swarm-${orientation} [data-id="${id}"]`;
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

  let simData = prerendered ? getSimData() : [];

  const runSim = () => {
    if (prerendered) return false;
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

{#each simData as d}
  <Node
    id="{d.id}"
    x="{d.x}"
    y="{d.y}"
    delta="{d.delta}"
    spotifyName="{d.spotifyName}"
    imageUrl="{d.imageUrl}"
    headshot="{d.headshot}"
    ratio="{ratio}"
    size="{$rGet(d)}"
  />
{/each}
