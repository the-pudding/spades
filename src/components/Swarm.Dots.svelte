<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { getContext } from "svelte";
  import Dot from "./Swarm.Dot.svelte";

  import forceCollideRect from "../utils/forceCollideRect.js";

  const { data, xGet, yGet, rGet, xScale, yScale, rScale, custom } = getContext(
    "LayerCake"
  );
  let simData = [];
  const simulation = forceSimulation().stop();

  const runSim = () => {
    simData = [
      ...$data.map((d) => ({
        ...d,
        width: $rGet(d) * 2,
        height: $rGet(d) * 2,
      })),
    ];
    simulation
      .nodes(simData)
      .velocityDecay(0.5)
      .force("y", forceY(50).strength(0.2))
      .force(
        "x",
        forceX()
          .x((d) => $xGet(d))
          .strength(1)
      )
      .force("collide", forceCollideRect())
      .on("tick", () => {
        simData = [...simData];
      })
      .stop();

    for (var i = 0; i < 300; i++) {
      simulation.tick();
    }
    simData = [...simData];
  };

  $: $data, runSim();

  $: ratio = $custom.fixedAspectRatio;
</script>

<p class="zero" style="left: {$xScale(0) / 2}%"></p>
{#each simData as { x, y, id, name, delta, image, followers }}
  <Dot
    x="{x}"
    y="{y}"
    image="{image}"
    name="{name}"
    delta="{delta}"
    size="{$rScale(followers)}"
  />
{/each}

<style>
  .zero {
    height: 100%;
    width: 1px;
    border-left: 2px dashed black;
    position: absolute;
    top: 0;
    margin: 0;
    display: none;
  }
</style>
