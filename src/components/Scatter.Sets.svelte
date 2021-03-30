<script>
  import { getContext, onMount } from "svelte";
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { descending } from "d3-array";
  import Node from "./Scatter.Node.svelte";

  import forceCollideRect from "../utils/forceCollideRect.js";

  let simData = [];

  const { data, xGet, yGet, xDomain, yDomain, custom } = getContext(
    "LayerCake"
  );

  const simulation = forceSimulation().stop();

  const getSimData = () => {
    const all = $data.map((d, i) => {
      return d.dates.map((date, j) => {
        const topDate = date;
        const topRank = d.ranks[j];
        const title = d.titles[j];
        const dim = d.dimensions[j];
        const { spotifyName, name, band } = d;

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
    flat.sort((a, b) => descending(a.topRank, b.topRank));
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
          .strength(0.1)
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

  $: $xDomain, $yDomain, runSim();
</script>

{#each simData as d}
  <Node d="{d}" />
{/each}
