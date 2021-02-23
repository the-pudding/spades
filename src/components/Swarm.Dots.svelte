<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { onMount, getContext } from "svelte";

  export let r = 4;

  const { data, xGet, yGet, rGet, xScale, yScale, rScale, custom } = getContext(
    "LayerCake"
  );
  let simData = [];
  const simulation = forceSimulation().stop();

  const runSim = () => {
    simData = [...$data];
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
      .force("collide", forceCollide($rGet).strength(1))
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

  $: ratio = $custom.fixedAspectRatio;

  onMount(() => {});
</script>

<p class="zero" style="left: {$xScale(0) / 2}%"></p>
{#each simData as { x, y, id, name, delta, imageUrl1, followers }}
  <div
    class:bigger="{delta > 0}"
    data-name="{name}"
    data-delta="{delta}"
    style="width: {$rScale(followers)}%; height: {$rScale(followers) *
      2}%; left: {x / 2}%; top: {y}%; background-image: url({imageUrl1});"
  >
    <span>{name}</span>
  </div>
{/each}

<style>
  div {
    position: absolute;
    background: gray;
    border-radius: 50%;
    border: 2px solid white;
    background-size: cover;
    background-position: center center;
    transform: translate(-50%, -50%);
    transition: transform 250ms;
    transform-origin: 50% 50%;
  }
  div:hover {
    transform: translate(-50%, -50%) scale(2);
    z-index: 1000;
  }
  div:hover span {
    display: block;
  }
  .bigger {
    border: 3px solid red;
  }
  span {
    display: block;
    width: 10em;
    text-align: center;
    transform: translate(0, -100%);
    text-shadow: 0 0 4px white;
    font-weight: bold;
    display: none;
    color: red;
  }
  .zero {
    height: 100%;
    width: 1px;
    border-left: 2px dashed black;
    position: absolute;
    top: 0;
    margin: 0;
  }
</style>
