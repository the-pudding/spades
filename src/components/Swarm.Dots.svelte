<script>
  import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
  import { getContext } from "svelte";

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

  $: ratio = $custom.fixedAspectRatio;
</script>

<p class="zero" style="left: {$xScale(0) / 2}%"></p>
{#each simData as { x, y, id, name, delta, image, followers }}
  <div
    class="dot"
    class:bigger="{delta > 0}"
    data-name="{name}"
    data-delta="{delta}"
    style="width: {$rScale(followers)}%; height: {$rScale(followers) *
      2}%; left: {x / 2}%; top: {y}%;"
  >
    <div
      class="image"
      style="background-image: url('https://i.scdn.co/image/{image}');"
    ></div>
    <span>{name}</span>
  </div>
{/each}

<style>
  .dot {
    position: absolute;
    background: gray;
    /* border-radius: 50%; */
    border: 2px solid white;
    transform: translate(-50%, -50%);
    transition: transform 250ms;
    transform-origin: 50% 50%;
  }
  .dot:hover {
    transform: translate(-50%, -50%) scale(2);
    z-index: 1000;
  }
  .dot:hover span {
    display: block;
  }
  .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    filter: grayscale(100%);
  }
  .bigger {
    /* border: 3px solid red; */
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
