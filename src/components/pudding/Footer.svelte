<script>
  import { onMount } from "svelte";
  import wordmark from "../../svg/pudding/wordmark.svg";

  const v = Date.now();
  const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;

  let localURL;

  const links = [
    { name: "about", url: "https://pudding.cool/about" },
    { name: "facebook", url: "https://facebook.com/pudding.viz/" },
    { name: "twitter", url: "https://twitter.com/puddingviz/" },
    {
      name: "instagram",
      url: "https://www.instagram.com/the.pudding",
    },
    { name: "patreon", url: "https://patreon.com/thepudding/" },
    { name: "privacy", url: "https://pudding.cool/privacy/" },
    { name: "newsletter", url: "http://eepurl.com/czym6f" },
    { name: "rss", url: "https://pudding.cool/feed/index.xml" },
  ];

  onMount(() => {
    localURL = window.location.href;
  });

  const fetchData = (async () => {
    const response = await fetch(url);
    const data = await response.json();
    const stories = data.filter((d) => d.url !== localURL).slice(0, 4);
    return stories;
  })();
</script>

<footer>
  <p style="text-align: center;">Check out some of our other projects</p>
  <section class="stories">
    {#await fetchData then data}
      {#each data as { hed, url, image }}
        <div class="story">
          <a href="https://pudding.cool/{url}">
            <img
              src="https://pudding.cool/common/assets/thumbnails/640/{image}.jpg"
              alt="thumbnail"
            />
            <span>{hed}</span>
          </a>
        </div>
      {/each}
    {/await}
  </section>
</footer>

<style>
  footer {
  }

  p {
    font-size: 1rem;
    line-height: 1.1;
  }

  .stories {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: calc(100% - 1rem);
    margin: 0 auto;
  }

  .story {
    display: block;
    width: 100%;
    border: none;
    margin-bottom: 1rem;
    width: 50%;
  }

  .story a {
    display: block;
    font-weight: 700;
    text-decoration: none;
  }

  .story span {
    display: block;
    margin-top: 1em;
    line-height: 1.2;
    font-family: 'Lyon Text Web';
    text-align: center;
  }

  .wordmark {
    max-width: 10em;
    margin: 1em auto;
  }

  .about {
    margin: 3rem auto;
    margin-top: 0;
    text-align: center;
  }

  .links ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .links li {
    display: flex;
    padding: 0.5em 1em;
  }

  .links a {
    display: flex;
    border: none;
    align-items: center;
    text-decoration: none;
  }

  .links span {
    margin-left: 0.5em;
  }

  @media only screen and (min-width: 30em) {
    .story {
      padding: 0 1em;
    }
  }

  @media only screen and (min-width: 50em) {
    .story {
      padding: 0 1em;
    }
  }
</style>
