function promptSelectorImageclicked () {
    if (!this.selected) {
        let prevSelectedPromptIdx = window.selectedPromptIdx;
        document.getElementById(`prompt-selector-image-container-${prevSelectedPromptIdx}`).selected = false;
        d3.select(`#prompt-selector-image-container-${prevSelectedPromptIdx}`).attr("class", "prompt-selector-image-container prompt-selector-image-container-unselected");
        d3.select(`#prompt-selector-image-container-${prevSelectedPromptIdx} img`).attr("class", "prompt-selector-image prompt-selector-image-unselected");
        window.selectedPromptIdx = this.promptIdx;
        this.selected = true;
        d3.select(`#prompt-selector-image-container-${this.promptIdx}`).attr("class", "prompt-selector-image-container prompt-selector-image-container-selected");
        d3.select(`#prompt-selector-image-container-${this.promptIdx} img`).attr("class", "prompt-selector-image prompt-selector-image-selected");

        // TODO: Change prompt and overall contents below
    }
}

function promptSelectorLeftScrollButtonClicked () {
    let imageContainerList = Array.from(document.querySelectorAll("#prompt-selector-images-container .prompt-selector-image-container"));
    let imagePerScreen = document.getElementById("prompt-selector-images-container").imagePerScreen;
    let leftmostImageIdx = document.getElementById("prompt-selector-images-container").leftmostImageIdx
    let leftmost = false;

    leftmostImageIdx -= imagePerScreen;
    if (leftmostImageIdx <= 0) {
        leftmost = true;
        leftmostImageIdx = 0;
    }
    
    imageContainerList[leftmostImageIdx].scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
    document.getElementById("prompt-selector-images-container").leftmostImageIdx = leftmostImageIdx;
    
    if (d3.select("#prompt-selector-images-container-cover-right").style("opacity") == "0") {
        d3.select("#prompt-selector-images-container-cover-right")
            .transition()
            .style("display", "")
            .transition()
            .duration(500)
            .style("opacity", "100%");
    }
    if (leftmost) {
        d3.select("#prompt-selector-images-container-cover-left")
            .transition()
            .duration(500)
            .style("opacity", "0")
            .transition()
            .delay(500)
            .style("display", "none")
    }
}

function promptSelectorRightScrollButtonClicked () {
    let imageContainerList = Array.from(document.querySelectorAll("#prompt-selector-images-container .prompt-selector-image-container"));
    let imagePerScreen = document.getElementById("prompt-selector-images-container").imagePerScreen;
    let leftmostImageIdx = document.getElementById("prompt-selector-images-container").leftmostImageIdx
    let lastImageIdx =  document.getElementById("prompt-selector-images-container").lastImageIdx
    let rightmost = false;

    leftmostImageIdx += imagePerScreen;
    if (leftmostImageIdx + imagePerScreen >= lastImageIdx) {
        rightmost = true;
        leftmostImageIdx = lastImageIdx - imagePerScreen;
    }
    
    imageContainerList[leftmostImageIdx].scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
    document.getElementById("prompt-selector-images-container").leftmostImageIdx = leftmostImageIdx;
    
    if (d3.select("#prompt-selector-images-container-cover-left").style("opacity") == "0") {
        d3.select("#prompt-selector-images-container-cover-left")
            .style("display", "block")
            .transition()
            .duration(500)
            .style("opacity", "100%");
    }
    if (rightmost) {
        d3.select("#prompt-selector-images-container-cover-right")
            .transition()
            .duration(500)
            .style("opacity", "0")
            .transition()
            .delay(500)
            .style("display", "none")
    }
}

function promptCompareClicked() {
    window.comparison = true;
    alert("function.js: promptcompareclicked() not implemented");
}

function controllerButtonHovered() {
    if (this.id.includes("play")) d3.select(`#${this.id} svg`).style("opacity", "100%")
    else d3.select(`#${this.id} svg`).style("opacity", "50%") 
}

function controllerButtonMouseout() {
    if (this.id.includes("play")) d3.select(`#${this.id} svg`).style("opacity", "80%");
    else d3.select(`#${this.id} svg`).style("opacity", "0%");
}

function controllerButtonClicked() {
    if (this.id.includes("play") || this.id.includes("pause")) {
        if (d3.select("#controller-button-pause").style("display") == "none") controllerPlayButtonClicked();
        else controllerPauseButtonClicked();
    }
    else if (this.id.includes("backward")) {
        controllerPlayerBackwardButtonClicked();
    }
    else if (this.id.includes("forward")) {
        controllerPlayerForwardButtonClicked();
    }
    else if (this.id.includes("repeat")) {
        controllerPlayerRepeatButtonClicked();
    }
}

function controllerPlayerBackwardButtonClicked() {
    controllerPauseButtonClicked();
    decreaseStep();
}

function controllerPlayerForwardButtonClicked() {
    controllerPauseButtonClicked();
    increaseStep();
}

function controllerPlayerRepeatButtonClicked() {
    updateStep(0);
    controllerPlayButtonClicked();
}

function controllerPlayButtonClicked() {
    animateUmapCycle();
    
    d3.select("#controller-button-pause")
        .style("display", "inline-block");
    d3.select("#controller-button-play")
        .style("display", "none");

    document.getElementById("controller").playing = true;
    document.getElementById("controller").playingInterval = setInterval(increaseStep, 100);
}

function increaseStep() {
    let timestep = document.getElementById("controller").timestep + 1;
    if (timestep > 50) timestep = 0;
    updateStep(timestep);
}

function decreaseStep() {
    let timestep = document.getElementById("controller").timestep - 1;
    updateStep(timestep);
}

function updateStep(timestep) {
    document.getElementById("controller").timestep = timestep 
    d3.select("#controller-timestep-number").text(timestep);
    document.getElementById("controller-timestep-slider").value = timestep;
    d3.select("#generated-image")
        .attr("src", `./assets/images/scheduled/${selectedPrompt}_${timestep}_${seed}_${gs}.jpg`)
    if (!document.getElementById("umap-highlight-svg").hovered) {
        d3.select("#umap-highlight-svg")
            .selectAll("circle")
            .style("opacity", (d,i) => {
                if (i > timestep) return 0;
                return 1;
            })
    }
}

function controllerPauseButtonClicked() {
    console.log("pause button clicked")
    d3.select("#controller-button-pause")
        .style("display", "none");
    d3.select("#controller-button-play")
        .style("display", "inline-block");

    if (document.getElementById("controller").playing) {
        document.getElementById("controller").playing = false;
        clearInterval(document.getElementById("controller").playingInterval);
    }

    d3.select("#unet-cycle")
        .style("animation-play-state", "paused")
    d3.select("#unet-decoder-arrow")
        .style("animation-play-state", "paused")
}

function timestepSliderFunction(){
    if (document.getElementById("controller").playing) {
        document.getElementById("controller").playing = false;
        controllerPauseButtonClicked();
    }
    let timestep = +(this.value);
    updateStep(timestep);
}

function animateUmapCycle() {
    d3.select("#unet-cycle")
        .style("animation-play-state", "")
    d3.select("#unet-decoder-arrow")
        .style("animation-play-state", "")
}

function seedChanged(e) {
    // when seed is changed
}

function gsChanged(e) {
    // when guidance scale is changed
    let newGs = eval(d3.select(this).property('value'));
    console.log(newGs);
    hyperparamChanged(e, window.seed, newGs);
}

function drawUmap(data) {
    //
    let umapSvg = d3.select("#umap-svg")
    let svgHeight = +(umapSvg.style("height").substring(0,3));
    let svgWidth = +(umapSvg.style("width").substring(0,3));
    
    let selected = data[selectedPromptIdx];
        let prompt = selected["prompts"][0];
        let totalTimesteps = selected["data"][prompt][seed][gs]["umap"].length

        window.totalTimesteps = totalTimesteps;

        let minX=1000000, maxX = -1000000;
        let minY=1000000, maxY = -1000000;
        selected["prompts"].forEach(p => {
            let umap = selected["data"][p][seed][gs]["umap"];
            umap.forEach(coord => {
                if (+(coord[0]) < minX) minX = +(coord[0])
                if (+(coord[0]) > maxX) maxX = +(coord[0])
                if (+(coord[1]) < minY) minY = +(coord[1])
                if (+(coord[1]) > maxY) maxY = +(coord[1])
            })
        });

        function convertCoordX (x) {
            return (0.1*svgWidth + (x-minX)/(maxX-minX)*svgWidth*0.8);
        }

        function convertCoordY (y) {
            return (svgHeight - (0.1*svgHeight + (y-minY)/(maxY-minY)*svgHeight*0.8));
        }

        let timestep = document.getElementById("controller").timestep;
        let selectedUmap = selected["data"][prompt][seed][gs]["umap"];

        let allUmaps = []
        selected["prompts"].forEach(p => {
            let umap = selected["data"][p][seed][gs]["umap"];
            allUmaps = allUmaps.concat(umap)
        });

        let nodeRadius = 3;
        let fadeColor = "#e0e0e0";
        let mainColor = "#51B3D2";
        
        umapSvg
            .selectAll("circle")
            .data(allUmaps)
            .enter()
            .append("circle")
                .attr("id", (d,i) => `umap-node-${selected["prompts"][Math.floor(i/totalTimesteps)]}-${i%totalTimesteps}`)
                .attr("class", `umap-node`)
                .attr("cx", d => convertCoordX(d[0]))
                .attr("cy", d => convertCoordY(d[1]))
                .attr("r", 3)
                .attr("fill", fadeColor)
                .attr("display", (d,i)=>{
                    if (selected["prompts"][Math.floor(i/totalTimesteps)] == prompt) return "";
                    return "none";
                })

        let umapHighlightSvg = umapSvg.append("svg").attr("id", "umap-highlight-svg")
        let selectedUmapColor = d3.scaleLinear().domain([-15,totalTimesteps]).range([fadeColor, mainColor]);

        umapHighlightSvg.selectAll("circle")
            .data(selectedUmap)
            .enter()
            .append("circle")
                .attr("id", (d,i) => `umap-node-highlight-1-${i}`)
                .attr("class", `umap-node-highlight`)
                .attr("cx", d => convertCoordX(d[0]))
                .attr("cy", d => convertCoordY(d[1]))
                .attr("r", nodeRadius)
                .attr("fill", (d,i) => selectedUmapColor(i))
                .style("opacity", (d,i) => {
                    if (i > timestep) return 0;
                    return 1;
                })
                .style("cursor", "pointer")
                .each((d,i) => {
                    document.getElementById(`umap-node-highlight-1-${i}`).idx = i
                })
                .on("mouseover", (e) => {
                    let i = document.getElementById(e.target.id).idx;
                    document.getElementById("umap-highlight-svg").hovered = true;

                    d3.select(`#umap-node-highlight-1-${i}`).style("stroke", "black").style("stroke-width", "2px")

                    let cursorX = e.offsetX;
                    let cursorY = e.offsetY;
                    umapHighlightSvg.append("text").text(`Step ${i}`).attr("id", `highlight-hovered-text-step-${i}`).attr("x", cursorX+10).attr("y", cursorY+10)
                    umapHighlightSvg.append("use").attr("xlink:href", `#umap-node-highlight-1-${i}`).attr("id", `use-umap-node-highlight-1-${i}`).style("pointer-events", "none")

                    for (let j=0 ; j <= i ; j++) 
                        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 1)
                    for (let j = i+1 ; j < totalTimesteps ; j++)
                        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 0)

                    d3.select("#generated-image").attr("src", `./assets/images/scheduled/${selected["prompts"][0]}_${i}_${seed}_${gs}.jpg`)
                })
                .on("mouseout", (e) => {
                    document.getElementById("umap-highlight-svg").hovered = false;
                    console.log("mouseout")
                    let i = document.getElementById(e.target.id).idx;
    
                    d3.select(`#umap-node-highlight-1-${i}`).style("stroke", "")
                    d3.select(`#umap-node-highlight-1-${i}`).style("stroke-width", "")
                    umapHighlightSvg.select("text").remove();
                    d3.select(`#use-umap-node-highlight-1-${i}`).remove()
                    for (let j=0 ; j <= timestep ; j++)
                        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 1)
                    for (let j=timestep+1 ; j < totalTimesteps ; j++)
                        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 0)
                    // change the displayed image back
                    d3.select("#generated-image").attr("src", `./assets/images/scheduled/${selected["prompts"][0]}_${timestep}_${seed}_${gs}.jpg`)
                })
                .on("click", (e) => {
                    timestep = document.getElementById(e.target.id).idx;
                    if (document.getElementById("controller").playing)
                        controllerPauseButtonClicked();
                    updateStep(timestep)
                })
}

function hyperparamChanged(e, newSeed, newGs) {
    // when seed or guidance scale is changed
    window.seed = newSeed;
    window.gs = 1;
    let timestep = document.getElementById("controller").timestep;
    // 1. change the image
    d3.select("#generated-image")
        .attr("src", `./assets/images/scheduled/${selectedPrompt}_${timestep}_${seed}_${gs}.jpg`)
    // 2. change the umap
    d3.json("./assets/json/data.json").then(
        function(data) {
            //
        }
    )
}

export {promptSelectorImageclicked, promptSelectorLeftScrollButtonClicked, promptSelectorRightScrollButtonClicked, promptCompareClicked, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updateStep, controllerPauseButtonClicked, seedChanged, gsChanged, drawUmap};