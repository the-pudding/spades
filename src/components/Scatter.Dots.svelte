<script>
  import { getContext } from "svelte";
  import { tweened } from "svelte/motion";

  export let r = 4;

  const { data, xGet, yGet, xScale, yScale, custom } = getContext("LayerCake");

  $: ratio = $custom.fixedAspectRatio;
  $: visible = $custom.visible;

  const pos = tweened(
    $data.map((d) => [d.bandRank || d.rank, d.bandFollowers || d.followers]),
    { duration: 500 }
  );

  $: visible,
    ($pos = $data.map((d) => [
      visible ? d.rank : d.bandRank || d.rank,
      visible ? d.followers : d.bandFollowers || d.followers,
    ]));
</script>

{#each $data as d, i}
  <div
    data-name="{d.name}"
    style="width: {r / ratio}%; height: {r * ratio}%; left: {$xScale(
      $pos[i][0]
    )}%; top: {$yScale($pos[i][1])}%; background-image: url({d.imageUrl1});"
  >
    <span>{d.spotifyName}</span>
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
    transform: translate(-50%, -50%) scale(4);
    z-index: 1000;
  }
  div:hover span {
    display: block;
  }
  .bigger {
    border: 3px solid red;
  }
  span {
    display: none;
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
