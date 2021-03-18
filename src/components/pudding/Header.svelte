<script>
  import wordmark from "../../svg/pudding/wordmark.svg";
</script>

<header>
  <p>
    <a href="https://pudding.cool">{@html wordmark}</a> <span>wonders...</span>
  </p>
</header>

<style>
  header {
    max-width: 40em;
    margin: 0 auto;
  }

  p {
    display: flex;
    align-items: center;
    line-height: 1;
  }

  a {
    display: inline-block;
    max-width: 8em;
    width: 100%;
    border: none;
    color: var(--fg);
    margin-right: 0.5em;
  }

  span {
    transform: translateY(-1px);
  }
</style>
