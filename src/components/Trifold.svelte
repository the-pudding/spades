


<script>
	export let content;
	
    import { onMount, tick } from "svelte";

    onMount(async() => {
        
        await tick();

    
    })


</script>

<div class="trifold-wrapper">
    {#each content.cardText as cardText, indexInner}
        <div class="page">

            <div class="loop-container">

            </div>

            {#if cardText.img}

                <img class="{cardText.class}" src="assets/{cardText.img}">

                <img src="" alt="">
            {/if}
            <div class="text-wrapper text-wrapper-inner">
                {#each cardText.innerCardText as innerCardText }
                        <p>{@html innerCardText.value}</p>
                {/each}
            </div>

        </div>
    {/each}    
</div>

<style>
    .trifold-wrapper {
        display: flex;
        height: 100%;
        padding-right: 300px;
    }

    .page .text-wrapper {
        padding: 1rem;
        padding-top: 7rem;

    }

    .page .text-wrapper p{
        font-size: .95rem;
        line-height: 1.2;
    }

    .page {
        width: 400px;
        height: 100%;
        transform: perspective(100px) translate3d(0, 0px, -2.7px) rotateZ(0deg);
        background:var(--card-bg);
        border:1px solid#a0a0a0;
        box-shadow: 0 5px 34px rgba(0,0,0,.10);
        position: relative;
        
    }

    .page:first-of-type {
        transform: perspective(100px) translate3d(13px, 0px, 0) rotateY(0.8deg);
        border-radius: 4px;
    }

    .page:first-of-type .loop-container {
        background: url('../assets/trifold-loop-left.svg');
    }

    .page .loop-container {
        background: url('../assets/trifold-loop-center.svg');
        transform: translate3d(0,0,0);
        background-repeat: no-repeat;
        margin: 0 auto;
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }


    .page:before {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .page:first-of-type:before {
        background-color: rgba(0,0,0,.03);
    }

    .page:last-of-type {
        transform: perspective(100px) translate3d(-13px, 0px, 0) rotateY(-0.8deg);
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    .page:last-of-type .loop-container {
        background: url('../assets/trifold-loop-right.svg');
        right: 0;
        left: auto;
        background-position: top right;
    }

    .page:first-of-type .text-wrapper {
        padding-left: 6rem;
        padding-top: 12rem;
    }

    .page:last-of-type .text-wrapper {
        padding-right: 6rem;
        padding-top: 7rem;
    }

    .page:last-of-type:before {
        background-color: rgba(0,0,0,.03);
    }

    @media only screen and (max-width: 640px) {
        .trifold-wrapper {
            flex-direction: column;
            height: auto;
        }
    }

</style>

