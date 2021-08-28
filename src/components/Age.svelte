


<script>
    import ageData from "../data/age.csv";
    import {group, groups, rollup, rollups, count, sum, max} from 'd3-array';
    import { onMount, tick } from "svelte";
    import ButtonSet from "./helpers/ButtonSet.svelte";

    let mounted;
    let data;

    let options = [
        "age","location"
    ];

    let filter = "age";

    let questionDict = {
        "1": "When you play Spades, do you play Big Joker, Little Joker, 2 of diamonds, two of spades?",
        "2": "Is talking over the table (about the game) allowed?",
        "3": "Whats your board?",
        "4": "How many sandbags is the other team allowed to get before they forfeit or automatically lose the game?",
        "5":"Do you typically play a whole game (to a set score) at once or rise and fly (if you lose after one round, you get up, and whoever wins stays seated to play the next team)?",
        "6":"Have you ever reneged?",
        "7":"Who taught you to play Spades?",
        "8":"Hold old were you when you learned to play Spades?",
        "9":"Is there an age in your family where learning spades is like a rite of passage?",
        "10":"Have you ever gone blind successfully?"

    }

    let filterKey = {
        "age": "Age Today",
        "location": "Where Grew Up"
    }

    let selected = 1;

    $: data = getQuestion(selected,filter);

    // $: if(selected) {
    //     getQuestion(selected,filter)
    // }

    // $: selected, getQuestion(selected,filter);

    onMount(async() => {
        mounted = true;
        await tick();
        data = getQuestion(selected,filter)

    })

    function getQuestion(questionToGet,cut){

        let questionToFilterFor = questionToGet;
        console.log(ageData)

        let grouped = ageData.filter(d => {
            // console.log(d.question,questionToFilterFor);
            return d.question == questionToFilterFor && d.answer != "";
                // console.log("same")
        });

        let rolluped = rollups(grouped, v => rollups(v, z => z, d => d.answer.toLowerCase()), d => d[cut]);


        rolluped.forEach(d => {
            let counts = []
            d[1].forEach(f => {counts.push(f[1].length)});
            d.total = sum(counts);

            d.percents = d[1].map(f => {
                let answer = f[0];
                let count = f[1].length;
                return [f[0], count/sum(counts)];

            })

        })

        let maxAnswer = max(rolluped, d => d[1].length);
        console.log(rolluped,maxAnswer)
        
        rolluped = rolluped.filter(d => {
            return d.percents.length == maxAnswer;
        });

        if(filter == "location"){
            rolluped = rolluped.filter(d => {
                return d[0] != "Other part of USA";
            })  
        }      


        return rolluped;
    }

    let thing = 'age';



</script>

    {#if data}

        <div class="age-wrapper {filter}-filter">

            <p class="big-label">Questions</p>

            <div class="select-wrapper">
                <div class="select-element">
                    {questionDict[selected]}
                </div>
                <select bind:value={selected}>
                    {#each Object.keys(questionDict) as options}
                        <option value={options}>{questionDict[options]}</option>
                    {/each}
                </select>
            </div>

            

            <p class="small-label">filter by</p>
            <div class="filter-row">

                <!-- <ButtonSet options={[{ value: "age" }, { value: "location" }]} bind:value={filter} /> -->

                {#each options as value}
                    <label on:click={() => console.log("hi")} class:selected={filter == value}><input bind:group={filter} type="radio" name="amount" {value}> {value}</label>
                {/each}

                
                <!-- <label on:click={() => filter = "location"} class:selected={filter == "location"}>
                    <input bind:group={filter} type="radio" name="amount" value={"location"} /> location
                </label> -->
            </div>

            <div class="table-wrap">
                <div class="col-hed">
                    <p class="cell filter-label">{filterKey[filter]}</p>
                    {#each data[0].percents as answer}
                        <p class="cell">{answer[0]}</p>
                    {/each}
                </div>
    
    
    
                {#each data as row, index}
    
                    <div class="row">
                        <p class="row-hed">{row[0].replace("The ","")}</p>
                        <div class="answers">
                            {#each row.percents as answer}
                                <p class="cell">{Math.round(answer[1]*100)}%</p>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>

            
            </div>
    {/if}

    <style>

        .table-wrap {
            max-width: calc(100% - 10px);
            margin: 0 auto;
            margin-top: 1rem;
        }

        .filter-row {
            display: flex;
            justify-content: center;
        }

        .select-wrapper {
            position: relative;
            margin: 0 auto;
            margin-bottom: 1rem;
            margin-left: 4rem;
            width: calc(100% - 5rem);
        }

        .select-wrapper select {
            position: absolute;
            top: 0;
            opacity: 0;
            width: 100%;
            left: 0;
            height: 100%;
        }

        .select-element {
            font-family: 'Lyon Text Web';
            border: 2px solid black;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            width: calc(100% - 40px);
            position: relative;
            padding: .5rem .5rem;
        }

        .select-element:before {
            content: '\25BC';
            position: absolute;
            right: 0;
            top: -2px;
            display: flex;
            color: #fbf7f0;
            text-align: center;
            flex-direction: column;
            justify-content: center;
            font-size: 14px;
            height: calc(100% + 4px);
            width: 40px;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            background: black;
            transform: translate(100%,0);
        }

        .filter-row label {
            width: 100px;
            background:#fbf7f0;
            color: black;
            font-family: 'Ohno Blazeface';
            text-transform: uppercase;
            font-size: 16px;
            padding: .5rem 0;
            align-self: center;
            text-align: center;
            border: 2px solid black;
            cursor: pointer;
        }

        .filter-row label:first-of-type {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }

        .filter-row label:last-of-type {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }

        .filter-row .selected {
            background: black;
            color: whitesmoke;
        }

        .filter-row input {
            display: none;
        }

        .big-label, .small-label {
            font-family: 'Ohno Blazeface';
            text-transform: uppercase;
            text-align: center;
            margin: 0 auto;
            
        }

        .big-label {
            font-size: 1.5rem;
        }


        .age-wrapper {
            width: 90%;
            margin: 0 auto;
        }

        .col-hed {
            padding-bottom: .3rem;
        }

        .col-hed .cell {
            font-size: 14px;
            line-height: 1.2;
            font-weight: 600;
        }

        .answers {
            flex-grow: 1;
        }

        .answers .cell {
            flex-grow: 1;
        }

        .cell {
            width: 50px;
            flex-grow: 1;
            margin: 0;
            align-self: center;
            font-size: 14px;
            
            text-transform: capitalize;
        }



        .filter-label, .row-hed {
            width: 50px;
            font-size: 14px;
            margin: 0;
            margin-right: 1rem;
            flex-grow: 0;
        }

        .location-filter .row-hed, .location-filter .filter-label {
            width: 100px;
        }

        .col-hed {
            display: flex;
            border-bottom: 1px solid rgba(0,0,0,1);
        }

        .row {
            display: flex;
            border-bottom: 1px solid rgba(0,0,0,.4);
        }

        .answers {
            display: flex;
        }

    </style>