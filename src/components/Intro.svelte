<script>
  export let copy;
</script>

<div>
  <h1>{copy.title}</h1>
  <p>{copy.description}</p>
</div>

<div>
  {#each copy.intro as { type, value }}
    {#if type === "text"}
      <p>{@html value}</p>
    {:else if type === "quote"}
      <blockquote>{value}</blockquote>
    {/if}
  {/each}
</div>

<style>
  div {
    max-width: 40em;
    margin: 0 auto;
  }
</style>
