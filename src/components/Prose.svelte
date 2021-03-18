<script>
  export let grafs;
</script>

<div>
  {#each grafs as { type, value }}
    <p>{value}</p>
  {/each}
</div>

<style>
  div {
    max-width: 40em;
    margin: 0 auto;
  }
</style>
