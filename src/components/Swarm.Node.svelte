<script>
  export let x;
  export let y;
  export let size;
  export let delta;
  export let name;
  export let spotifyName;
  export let imageUrl;
  export let ratio;

  $: width = size / ratio;
  $: height = size;
  $: left = x / ratio;
  $: top = y;
  $: style = `width: ${width}%; height: ${height}%; left: ${left}%; top: ${top}%;`;
</script>

<div
  class="dot"
  class:bigger="{delta > 0}"
  data-name="{name}"
  data-delta="{delta}"
  style="{style}"
>
  <div
    class="image"
    style="background-image: url('https://i.scdn.co/image/{imageUrl}');"
  ></div>
  <span>{spotifyName}</span>
</div>

<style>
  .dot {
    position: absolute;
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
  .bigger .image {
    filter: grayscale(0);
  }
  span {
    display: block;
    width: 8em;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -100%);
    background: white;
    font-weight: bold;
    display: none;
    color: red;
  }
</style>
