import {updateStep, controllerPauseButtonClicked, drawUmap} from "./function.js";

d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "latent-umap-title")
        .text("Latents over all timesteps")
        
d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "latent-umap-subtitle")
        .text("Latent is vector summarization of image")

let umapSvg = d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "umap-container")
        .append("svg")
            .attr("id", "umap-svg");

d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "latent-umap-reduced")
        .text("Reduced to 2D by UMAP")

d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "latent-umap-expl")
        .text("Since the final generated image can be of high resolution, directly operating in that high-resolution space can be slow (e.g., 512 pixels by 512 pixels). So, instead, Stable Diffusion operates in the “latent” space, where a “latent” is the summarized representation of the image, and is much smaller (at 4 x 64 x 64).")


let svgHeight = +(umapSvg.style("height").substring(0,3));
let svgWidth = +(umapSvg.style("width").substring(0,3));

d3.json("./assets/json/data.json").then(
    function(data) {
        // let selected = data[selectedPromptIdx];
        // let prompt = selected["prompts"][0];
        // let totalTimesteps = selected["data"][prompt][seed][gs]["umap"].length

        // window.totalTimesteps = totalTimesteps;

        // let minX=1000000, maxX = -1000000;
        // let minY=1000000, maxY = -1000000;
        // selected["prompts"].forEach(p => {
        //     let umap = selected["data"][p][seed][gs]["umap"];
        //     umap.forEach(coord => {
        //         if (+(coord[0]) < minX) minX = +(coord[0])
        //         if (+(coord[0]) > maxX) maxX = +(coord[0])
        //         if (+(coord[1]) < minY) minY = +(coord[1])
        //         if (+(coord[1]) > maxY) maxY = +(coord[1])
        //     })
        // });

        // function convertCoordX (x) {
        //     return (0.1*svgWidth + (x-minX)/(maxX-minX)*svgWidth*0.8);
        // }

        // function convertCoordY (y) {
        //     return (svgHeight - (0.1*svgHeight + (y-minY)/(maxY-minY)*svgHeight*0.8));
        // }

        // let timestep = document.getElementById("controller").timestep;
        // let selectedUmap = selected["data"][prompt][seed][gs]["umap"];

        // let allUmaps = []
        // selected["prompts"].forEach(p => {
        //     let umap = selected["data"][p][seed][gs]["umap"];
        //     allUmaps = allUmaps.concat(umap)
        // });

        // let nodeRadius = 3;
        // let fadeColor = "#e0e0e0";
        // let mainColor = "#51B3D2";
        
        // umapSvg
        //     .selectAll("circle")
        //     .data(allUmaps)
        //     .enter()
        //     .append("circle")
        //         .attr("id", (d,i) => `umap-node-${selected["prompts"][Math.floor(i/totalTimesteps)]}-${i%totalTimesteps}`)
        //         .attr("class", `umap-node`)
        //         .attr("cx", d => convertCoordX(d[0]))
        //         .attr("cy", d => convertCoordY(d[1]))
        //         .attr("r", 3)
        //         .attr("fill", fadeColor)
        //         .attr("display", (d,i)=>{
        //             if (selected["prompts"][Math.floor(i/totalTimesteps)] == prompt) return "";
        //             return "none";
        //         })

        // let umapHighlightSvg = umapSvg.append("svg").attr("id", "umap-highlight-svg")
        // let selectedUmapColor = d3.scaleLinear().domain([-15,totalTimesteps]).range([fadeColor, mainColor]);

        // umapHighlightSvg.selectAll("circle")
        //     .data(selectedUmap)
        //     .enter()
        //     .append("circle")
        //         .attr("id", (d,i) => `umap-node-highlight-1-${i}`)
        //         .attr("class", `umap-node-highlight`)
        //         .attr("cx", d => convertCoordX(d[0]))
        //         .attr("cy", d => convertCoordY(d[1]))
        //         .attr("r", nodeRadius)
        //         .attr("fill", (d,i) => selectedUmapColor(i))
        //         .style("opacity", (d,i) => {
        //             if (i > timestep) return 0;
        //             return 1;
        //         })
        //         .style("cursor", "pointer")
        //         .each((d,i) => {
        //             document.getElementById(`umap-node-highlight-1-${i}`).idx = i
        //         })
        //         .on("mouseover", (e) => {
        //             let i = document.getElementById(e.target.id).idx;
        //             document.getElementById("umap-highlight-svg").hovered = true;

        //             d3.select(`#umap-node-highlight-1-${i}`).style("stroke", "black").style("stroke-width", "2px")

        //             let cursorX = e.offsetX;
        //             let cursorY = e.offsetY;
        //             umapHighlightSvg.append("text").text(`Step ${i}`).attr("id", `highlight-hovered-text-step-${i}`).attr("x", cursorX+10).attr("y", cursorY+10)
        //             umapHighlightSvg.append("use").attr("xlink:href", `#umap-node-highlight-1-${i}`).attr("id", `use-umap-node-highlight-1-${i}`).style("pointer-events", "none")

        //             for (let j=0 ; j <= i ; j++) 
        //                 d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 1)
        //             for (let j = i+1 ; j < totalTimesteps ; j++)
        //                 d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 0)

        //             d3.select("#generated-image").attr("src", `./assets/images/scheduled/${selected["prompts"][0]}_${i}_${seed}_${gs}.jpg`)
        //         })
        //         .on("mouseout", (e) => {
        //             document.getElementById("umap-highlight-svg").hovered = false;
        //             console.log("mouseout")
        //             let i = document.getElementById(e.target.id).idx;
    
        //             d3.select(`#umap-node-highlight-1-${i}`).style("stroke", "")
        //             d3.select(`#umap-node-highlight-1-${i}`).style("stroke-width", "")
        //             umapHighlightSvg.select("text").remove();
        //             d3.select(`#use-umap-node-highlight-1-${i}`).remove()
        //             for (let j=0 ; j <= timestep ; j++)
        //                 d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 1)
        //             for (let j=timestep+1 ; j < totalTimesteps ; j++)
        //                 d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 0)
        //             // change the displayed image back
        //             d3.select("#generated-image").attr("src", `./assets/images/scheduled/${selected["prompts"][0]}_${timestep}_${seed}_${gs}.jpg`)
        //         })
        //         .on("click", (e) => {
        //             timestep = document.getElementById(e.target.id).idx;
        //             if (document.getElementById("controller").playing)
        //                 controllerPauseButtonClicked();
        //             updateStep(timestep)
        //         })
        drawUmap(data);
    }
)
