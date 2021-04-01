<script>
  export let options = [];
  export let legend = "";
  export let legendPosition = "top";
  export let labelClass = "";
  export let disabled = false;
  export let selected = options.length ? options[0].value : "";

  const id = `legend-${Math.floor(Math.random() * 1000000)}`;
  const makeSlug = (str = "") => str.toLowerCase().replace(/\W/g, "");

  $: optionsWithSlug = options.map((d) => ({ ...d, slug: makeSlug(d.value) }));
  $: isTop = legendPosition === "top";
</script>

<div class="container">
  <div
    id="{`group-${id}`}"
    class="group"
    class:is-top="{isTop}"
    role="radiogroup"
    aria-labelledby="{`label-${id}`}"
  >
    <div class="legend" id="label-{id}">{legend}</div>
    <div class="options">
      {#each optionsWithSlug as { value, label, slug } (value)}
        <div class="option">
          <input
            type="radio"
            id="{`${id}-${slug}`}"
            class="sr-only"
            value="{value}"
            disabled="{disabled}"
            bind:group="{selected}"
          />
          <label class="option {labelClass}" for="{`${id}-${slug}`}">
            {label || value}
          </label>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .container {
    display: inline-block;
    margin-bottom: 4px;
  }

  .group {
    display: flex;
    align-items: center;
  }

  .group.is-top {
    flex-direction: column;
  }

  .is-top .legend {
    padding-bottom: 0.5em;
    padding-right: 0;
  }

  .legend {
    padding-right: 0.5em;
  }

  .options {
    display: flex;
  }

  label {
    appearance: none;
    user-select: none;
    line-height: 1;
    margin: 0;
    padding: 0.5em;
    border-radius: 0;
    border: 2px solid var(--base-off-black, #222);
    outline: none;
    cursor: pointer;
  }

  .option + .option label {
    border-left-width: 0;
  }

  .option:first-of-type label {
    border-radius: 4px 0 0 4px;
  }

  .option:last-of-type label {
    border-radius: 0 4px 4px 0;
  }

  .option + .option > label {
    border-left-width: 0;
  }

  input[type="radio"] + label {
    background: var(--base-white, #fff);
    color: var(--base-off-black, var(--base-gray-dark, #555));
  }

  input[type="radio"]:checked + label,
  input[type="radio"]:checked:hover + label {
    background: var(--base-off-black, #222);
    color: var(--base-white, #fff);
  }

  input[type="radio"]:hover + label {
    background: var(--base-gray-light, #ccc);
  }

  input[type="radio"]:focus + label {
    box-shadow: 0 0 4px 0 var(--base-focus, blue);
  }

  input[type="radio"]:disabled + label {
    color: var(--base-gray-dark, #555);
    background: var(--base-gray, #999);
    cursor: not-allowed;
  }
</style>
