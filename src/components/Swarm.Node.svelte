<script>
  export let x;
  export let y;
  export let size;
  export let delta;
  export let name;
  export let spotifyName;
  export let imageUrl;
  export let ratio;

  $: factor = ratio < 1 ? 1 / ratio : 1;
  $: width = size / ratio / factor;
  $: height = size / factor;
  $: left = x / ratio / factor;
  $: top = y / factor;
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

  .bigger {
    border-color: var(--off-white);
  }

  .bigger .image {
    filter: grayscale(0);
  }

  span {
    display: block;
    white-space: nowrap;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -100%);
    padding: 0 0.25em;
    background: white;
    font-weight: bold;
    display: none;
    color: red;
    pointer-events: none;
  }

  .bigger span {
    background: var(--off-white);
  }
</style>
