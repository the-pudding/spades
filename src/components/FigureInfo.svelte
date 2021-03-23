<script>
  export let hed;
</script>

<div>
  <h2>
    {hed}
    <slot />
  </h2>
</div>

<style>
  div {
    margin: 0 auto;
    margin-top: 4em;
    max-width: 40em;
  }

  h2 {
    font-size: 32px;
    line-height: 1.4;
  }
</style>
