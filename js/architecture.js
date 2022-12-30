let generatedImageContainerDiv = d3.select("#architecture-container").append("div").attr("id", "generated-image-container");

d3.json("./assets/json/data.json").then(
    function(data){
        let selectedPromptIdx = window.selectedPromptIdx;
        let seed = window.seed;
        let gs = window.gs;
        let timestep = document.getElementById("controller").timestep;
        let selectedData = data[selectedPromptIdx];
        
        console.log(selectedData);

        generatedImageContainerDiv.append("img")
            .attr("id", "generated-image")
            .attr("src", `./assets/images/scheduled/${selectedData["prompts"][0]}_${timestep}_${seed}_${gs}.jpg`)

    })