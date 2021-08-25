


<script>
    import ageData from "../data/age.csv";
    import {group} from 'd3-array';


    let cleaned = ageData;
    console.log(group(cleaned, d => d.question));

</script>


<p>hi</p>