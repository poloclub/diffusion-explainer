function promptSelectorImageclicked () {
    if (!this.selected) {
        let prevSelectedPromptIdx = window.selectedPromptGroupIdx;
        document.getElementById(`prompt-selector-image-container-${prevSelectedPromptIdx}`).selected = false;
        d3.select(`#prompt-selector-image-container-${prevSelectedPromptIdx}`).attr("class", "prompt-selector-image-container prompt-selector-image-container-unselected");
        d3.select(`#prompt-selector-image-container-${prevSelectedPromptIdx} img`).attr("class", "prompt-selector-image prompt-selector-image-unselected");
        window.selectedPromptGroupIdx = this.promptGroupIdx;
        this.selected = true;
        d3.select(`#prompt-selector-image-container-${this.promptGroupIdx}`).attr("class", "prompt-selector-image-container prompt-selector-image-container-selected");
        d3.select(`#prompt-selector-image-container-${this.promptGroupIdx} img`).attr("class", "prompt-selector-image prompt-selector-image-selected");

        // TODO: Change prompt and overall contents below
        window.gs = "7.0";
        
        // 2. change the umap
        d3.json("./assets/json/data.json").then(data => {
            window.selectedPromptGroupName = Object.keys(data)[window.selectedPromptGroupIdx]
            let selectedData = data[window.selectedPromptGroupName];
            window.selectedPrompt1 = selectedData["prompts"][0];
            updateStep(30);
            drawUmap(data)
        });
    }
}

function updatePromptList(prompts) {
    d3.select("#prompt-1-container").html("");
    d3.select("#prompt-2-container").html("");

    d3.select("#prompt-1-container").append("select")
        .on("change", updatePrompt)
        .selectAll("option")
            .data(prompts)
            .enter()
            .append("option")
                .attr("value", d => d)
                .text(d => d)
                .property("selected", (d,i) => (i==0))
    //
    d3.select("#prompt-2-container").append("select")
        .on("change", updatePrompt)
        .selectAll("option")
            .data(prompts)
            .enter()
            .append("option")
                .attr("value", d => d)
                .text(d => d)
                .property("selected", (d,i) => {
                    if ((i == 0) && (d3.select("#prompt-1-container").property("value") == d)) return false
                    else if (i==0) return true;
                    else if (i==1) return true;
                    else return false;
                })
}

function updatePrompt() {
    console.log(this.parentElement.id);
    if (this.parentElement.id == "prompt-1-container") {
        let prevSelectedPrompt1 = window.selectedPrompt1;
        window.selectedPrompt1 = this.value;
        let timestep = document.getElementById("controller").timestep;

        // TODO: If prompt1==prompt2, change the prompt2 to be different from prompt1
        
        // update generated image
        updateStep(timestep);
        
        // update umap
        let umapSvg = d3.select("#umap-svg");
        for (let i = 0 ; i < 51 ; i++){
            if (i==0) console.log(`#umap-node-${window.selectedPrompt1.replace(/ /g, "-").replace(/,/g, "")}-${i}`);
            d3.select(`#umap-node-${window.selectedPrompt1.replace(/ /g, "-").replace(/,/g, "")}-${i}`)
                .attr("display", "").attr("opacity", "1")
            if (!window.comparison)
                umapSvg.select(`#umap-node-${prevSelectedPrompt1.replace(/ /g, "-").replace(/,/g, "")}-${i}`).attr("display", "none") 
        }
        
        // TODO: update highlighted umap
        d3.select("#umap-highlight-svg").html("");
        addUmapHighlightNodes(1)
    }
    if (this.parentElement.id == "prompt-2-container") {
        let prevSelectedPrompt2 = window.selectedPrompt2;
        window.selectedPrompt2 = this.value;
        let timestep = document.getElementById("controller").timestep;
        
        // update generated image
        updateStep(timestep);
        
        // update umap
        let umapSvg = d3.select("#umap-svg");
        for (let i = 0 ; i < 51 ; i++){
            if (i==0) console.log(`#umap-node-${window.selectedPrompt2.replace(/ /g, "-").replace(/,/g, "")}-${i}`);
            d3.select(`#umap-node-${window.selectedPrompt2.replace(/ /g, "-").replace(/,/g, "")}-${i}`)
                .attr("display", "").attr("opacity", "1")
            if (!window.comparison)
                umapSvg.select(`#umap-node-${prevSelectedPrompt2.replace(/ /g, "-").replace(/,/g, "")}-${i}`).attr("display", "none") 
        }
        
        // TODO: update highlighted umap
        d3.select("#umap-highlight-svg-2").html("");
        addUmapHighlightNodes(2)
    }
}

function addUmapHighlightNodes(promptNum) {
    let timestep = document.getElementById("controller").timestep;
    let selectedPrompt = (promptNum==1)?window.selectedPrompt1:window.selectedPrompt2
    let fadeColor = "#e0e0e0";
    let mainColor = (promptNum==1)?"#51B3D2":"#F6CC35";
    let umapHighlightSvg = (promptNum==1)?d3.select("#umap-highlight-svg"):d3.select("#umap-highlight-svg-2")
    console.log(selectedPrompt, mainColor)
    let selectedUmapColor = d3.scaleLinear().domain([-15,totalTimesteps]).range([fadeColor, mainColor]);

    umapHighlightSvg
        .selectAll("circle")
            .data([...Array(totalTimesteps).keys()])
            .enter()
            .append("circle")
                .attr("id", i => `umap-node-highlight-${promptNum}-${i}`)
                .attr("class", `umap-node-highlight`)
                .attr("cx", i => d3.select(`#umap-node-${selectedPrompt.replace(/ /g, "-").replace(/,/g, "")}-${i}`).attr("cx"))
                .attr("cy", i => d3.select(`#umap-node-${selectedPrompt.replace(/ /g, "-").replace(/,/g, "")}-${i}`).attr("cy"))
                .attr("r", i => d3.select(`#umap-node-${selectedPrompt.replace(/ /g, "-").replace(/,/g, "")}-${i}`).attr("r"))
                .attr("fill", i => selectedUmapColor(i))
                .style("opacity", i => (i > timestep)?0:1)
                .style("cursor", "pointer")
                .each(i => { document.getElementById(`umap-node-highlight-${promptNum}-${i}`).idx = i })
                .on("mouseover", e => umapHighlightNodeHovered(e, promptNum))
                .on("mouseout", e => umapHighlightNodeMouseout(e, promptNum))
                .on("click", e => umapHighlightNodeClicked(e))
}

function umapHighlightNodeHovered(e, promptNum) {
    let i = document.getElementById(e.target.id).idx;
    document.getElementById("umap-highlight-svg").hovered = true;

    d3.select(`#umap-node-highlight-1-${i}`).style("stroke", "black").style("stroke-width", "2px")

    let cursorX = e.offsetX;
    let cursorY = e.offsetY;
    let umapHighlightSvg = d3.select("#umap-highlight-svg")
    umapHighlightSvg.append("text").text(`Step ${i}`).attr("id", `highlight-hovered-text-step-${i}`).attr("x", cursorX+10).attr("y", cursorY+10)
    umapHighlightSvg.append("use").attr("xlink:href", `#umap-node-highlight-1-${i}`).attr("id", `use-umap-node-highlight-1-${i}`).style("pointer-events", "none")

    for (let j=0 ; j <= i ; j++) 
        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 1)
    for (let j = i+1 ; j < totalTimesteps ; j++)
        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 0)

    console.log("hovered", promptNum)
    if (promptNum == 1)
        d3.select("#generated-image").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt1}_${i}_${seed}_${gs}.jpg`)
    else if (promptNum == 2)
        d3.select("#generated-image").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt2}_${i}_${seed}_${gs}.jpg`)
}

function umapHighlightNodeMouseout (e, promptNum) {
    document.getElementById("umap-highlight-svg").hovered = false;
    let i = document.getElementById(e.target.id).idx;
    let timestep = document.getElementById("controller").timestep;

    d3.select(`#umap-node-highlight-1-${i}`).style("stroke", "")
    d3.select(`#umap-node-highlight-1-${i}`).style("stroke-width", "")
    
    let umapHighlightSvg = d3.select("#umap-highlight-svg")
    umapHighlightSvg.select("text").remove();
    d3.select(`#use-umap-node-highlight-1-${i}`).remove()
    
    for (let j=0 ; j <= timestep ; j++)
        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 1)
    for (let j=timestep+1 ; j < totalTimesteps ; j++)
        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 0)
    
    // change the displayed image back
    if (promptNum == 1) d3.select("#generated-image").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt1}_${timestep}_${seed}_${gs}.jpg`)
    else if (promptNum == 2) d3.select("#generated-image").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt2}_${timestep}_${seed}_${gs}.jpg`)
}

function umapHighlightNodeClicked (e, promptNum) {
    let timestep = document.getElementById(e.target.id).idx;
    document.getElementById("controller").timestep = timestep

    if (document.getElementById("controller").playing)
        controllerPauseButtonClicked();
    updateStep(timestep)
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
    d3.select("#prompt-2-container").style("display", "block")
    d3.select("#prompt-compare").style("display", "none")
    d3.select("#umap-svg")
        .selectAll("circle")
        .attr("display", "")
        .transition()
        .duration(500)
        .attr("opacity", "1")
    addUmapHighlightNodes(2)
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
        .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt1}_${timestep}_${seed}_${gs}.jpg`)
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

function drawUmap(data) {
    console.log("draw umap", seed, gs)
    let umapSvg = d3.select("#umap-svg").html("");

    let svgHeight = 220
    let svgWidth = 220
    
    let selected = data[selectedPromptGroupName];
    // let prompt = selected["prompts"][0];
    let prompt = selectedPrompt1;
    window.totalTimesteps = selected["data"][prompt][seed][gs]["umap"].length

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

    let allUmaps = []
    selected["prompts"].forEach(p => {
        let umap = selected["data"][p][seed][gs]["umap"];
        allUmaps = allUmaps.concat(umap)
    });

    let nodeRadius = 3;
    let fadeColor = "#e0e0e0";
    umapSvg
        .selectAll("circle")
        .data(allUmaps)
        .enter()
        .append("circle")
            .attr("id", (d,i) => `umap-node-${selected["prompts"][Math.floor(i/totalTimesteps)].replace(/ /g, "-").replace(/,/g, "")}-${i%totalTimesteps}`)
            .attr("class", `umap-node`)
            .attr("cx", d => convertCoordX(d[0]))
            .attr("cy", d => convertCoordY(d[1]))
            .attr("r", nodeRadius)
            .attr("fill", fadeColor)
            .attr("opacity", (d,i)=>{
                if (selected["prompts"][Math.floor(i/totalTimesteps)] == prompt) return 1;
                return 0;
            })
            .attr("display", (d,i)=>{
                if (selected["prompts"][Math.floor(i/totalTimesteps)] == prompt) return "";
                return "none";
            })

    d3.select("#umap-svg").append("svg").attr("id", "umap-highlight-svg")
    d3.select("#umap-svg").append("svg").attr("id", "umap-highlight-svg-2")
    addUmapHighlightNodes(1)
}

function seedChanged(e) {
    // when seed is changed
    let newSeed = eval(d3.select(this).property('value'));
    hyperparamChanged(e, newSeed, window.gs);
}

function gsChanged(e) {
    // when guidance scale is changed
    let newGs = d3.select(this).property('value');
    hyperparamChanged(e, window.seed, newGs);
}

function hyperparamChanged(e, newSeed, newGs) {
    // when seed or guidance scale is changed
    window.seed = newSeed;
    window.gs = newGs;
    let timestep = document.getElementById("controller").timestep;
    // 1. change the image
    d3.select("#generated-image")
        .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt1}_${timestep}_${seed}_${gs}.jpg`)
    
    // 2. change the umap
    d3.json("./assets/json/data.json").then(data => drawUmap(data));
}

export {promptSelectorImageclicked, promptSelectorLeftScrollButtonClicked, promptSelectorRightScrollButtonClicked, promptCompareClicked, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updateStep, controllerPauseButtonClicked, seedChanged, gsChanged, drawUmap, updatePromptList};