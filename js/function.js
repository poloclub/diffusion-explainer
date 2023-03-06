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

        window.gs = "7.0";
        document.getElementById("unet-guidance-scale-control-dropdown-select").selectedIndex = 1
        
        // 2. change the umap
        d3.json("./assets/json/data.json").then(data => {
            window.selectedPromptGroupName = Object.keys(data)[window.selectedPromptGroupIdx]
            let selectedData = data[window.selectedPromptGroupName];
            window.selectedPrompt1 = selectedData["prompts"][0];
            window.selectedPrompt2 = selectedData["prompts"][1];
            updatePromptList(selectedData["prompts"])
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
    if (this.parentElement.id == "prompt-1-container") {
        let prevSelectedPrompt1 = window.selectedPrompt1;
        window.selectedPrompt1 = this.value;
        let timestep = document.getElementById("controller").timestep;

        if (window.selectedPrompt1 == window.selectedPrompts[1] && !window.comparison) {
            window.selectedPrompt2 = window.selectedPrompts[0]
        }
        else {
            window.selectedPrompt2 = window.selectedPrompts[1]
        }
        
        d3.select("#prompt-2-container").select("select").property("value", window.selectedPrompt2)
        
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
    let selectedUmapColor = d3.scaleLinear().domain([-50,totalTimesteps]).range([fadeColor, mainColor]);
    // let selectedUmapColor = d3.scaleLinear().domain([-50,totalTimesteps]).range([mainColor, mainColor]);
    let fullOpacity = window.comparison?0.7:1

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
                .style("opacity", i => (i > timestep)?0:fullOpacity)
                .style("cursor", "pointer")
                .each(i => { document.getElementById(`umap-node-highlight-${promptNum}-${i}`).idx = i })
                .on("mouseover", e => umapHighlightNodeHovered(e, promptNum))
                .on("mouseout", e => umapHighlightNodeMouseout(e, promptNum))
                .on("click", e => umapHighlightNodeClicked(e))
}

function umapHighlightNodeHovered(e, promptNum) {
    // TODO: When hover during comparison
    let i = document.getElementById(e.target.id).idx;
    let fullOpacity = window.comparison?0.7:1
    document.getElementById("umap-highlight-svg").hovered = true;

    d3.select(`#umap-node-highlight-${promptNum}-${i}`).style("stroke", "black").style("stroke-width", "2px")

    let cursorX = e.offsetX;
    let cursorY = e.offsetY;
    let umapHighlightSvg = d3.select("#umap-highlight-svg")
    umapHighlightSvg.append("text").text(`Step ${i}`).attr("id", `highlight-hovered-text-step-${i}`).attr("x", cursorX+10).attr("y", cursorY+10)
    umapHighlightSvg.append("use").attr("xlink:href", `#umap-node-highlight-${promptNum}-${i}`).attr("id", `use-umap-node-highlight-${promptNum}-${i}`).style("pointer-events", "none")

    for (let j=0 ; j <= i ; j++) {
        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", fullOpacity)
        if (window.comparison) d3.select(`#umap-node-highlight-2-${j}`).style("opacity", fullOpacity)
    }
    for (let j = i+1 ; j < totalTimesteps ; j++) {
        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 0)
        if (window.comparison) d3.select(`#umap-node-highlight-2-${j}`).style("opacity", 0)
    }

    d3.select("#generated-image").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt1}_${i}_${seed}_${gs}.jpg`)
    d3.select("#generated-image-2").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt2}_${i}_${seed}_${gs}.jpg`)
}

function umapHighlightNodeMouseout (e, promptNum) {
    document.getElementById("umap-highlight-svg").hovered = false;
    let i = document.getElementById(e.target.id).idx;
    let fullOpacity = window.comparison?0.7:1
    let timestep = document.getElementById("controller").timestep;

    d3.select(`#umap-node-highlight-${promptNum}-${i}`).style("stroke", "")
    d3.select(`#umap-node-highlight-${promptNum}-${i}`).style("stroke-width", "")
    
    let umapHighlightSvg = d3.select("#umap-highlight-svg")
    umapHighlightSvg.select("text").remove();
    d3.select(`#use-umap-node-highlight-${promptNum}-${i}`).remove()
    
    for (let j=0 ; j <= timestep ; j++) {
        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", fullOpacity)
        if (window.comparison) d3.select(`#umap-node-highlight-2-${j}`).style("opacity", fullOpacity)
    }
    for (let j=timestep+1 ; j < totalTimesteps ; j++) {
        d3.select(`#umap-node-highlight-1-${j}`).style("opacity", 0)
        if (window.comparison) d3.select(`#umap-node-highlight-2-${j}`).style("opacity", 0)
    }
    
    // change the displayed image back
    d3.select("#generated-image").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt1}_${timestep}_${seed}_${gs}.jpg`)
    d3.select("#generated-image-2").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt2}_${timestep}_${seed}_${gs}.jpg`)
}

function umapHighlightNodeClicked (e) {
    let timestep = document.getElementById(e.target.id).idx;
    document.getElementById("controller").timestep = timestep

    if (document.getElementById("controller").playing)
        controllerPauseButtonClicked();
    updateStep(timestep)
}

function promptCompareClicked() {
    window.comparison = true;
    d3.select("#prompt-2-container").style("display", "block")
    d3.select("#prompt-compare-add-button").style("display", "none")
    d3.select("#prompt-compare-text").style("display", "none")
    d3.select("#prompt-compare").style("top", "-24px")
    d3.select("#prompt-compare-minus-button")
        .style("display", "initial")
        .style("opacity", "1")
        .style("cursor", "pointer")
        .style("left", "-20px")
        .on("click", promptCompareOffed)
    d3.select("#umap-svg")
        .selectAll("circle")
            .attr("display", "")
            .transition()
                .duration(500)
                .attr("opacity", 1)
    d3.select("#generated-image-2")
        .style("pointer-events", "initial")
        .transition()
            .duration(1000)
            .style("opacity", "1")
    d3.select("#generated-image")
        .transition()
            .duration(1000)
            .style("margin-top", "45px")
    d3.select("#unet-decoder-arrow")
        .transition()
            .duration(1000)
            .attr("d", "M 3,137 L161,137 a5,5 0 0 0 5,-5 L166,85 a5,5 0 0 1 5,-5 L177,80")
    d3.select("#unet-decoder-arrow-2")
        .transition()
            .duration(1000)
            .attr("d", "M 3,143 L161,143 a5,5 0 0 1 5,5 L166,185 a5,5 0 0 0 5,5 L177,190")
    // TODO: Add minus button to return back to non-comparison view
    // TODO: Double all the arrows
    
    addUmapHighlightNodes(2)
}

function promptCompareOffed() {
    d3.select("#prompt-2-container").style("display", "none")
    d3.select("#prompt-compare-add-button").style("display", "inline-block")
    d3.select("#prompt-compare-text").style("display", "inline-block")
    d3.select("#prompt-compare-minus-button").style("display", "none").style("opacity", "0")
    d3.select("#prompt-compare").style("top", "")
}

function controllerButtonHovered() {
    if (this.id.includes("play")) d3.select(`#${this.id} svg`).style("opacity", "100%")
    else d3.select(`#${this.id} svg`).style("opacity", "20%") 
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
    animateArchCycle();
    
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
    d3.select("#denoise-latent-out-noise-img")
        .attr("src", `./assets/latents/${selectedPromptGroupName}/${selectedPrompt1}_${Math.min(timestep+1,49)}_${seed}_${gs}.jpg`)
    d3.select("#generated-image")
        .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt1}_${timestep}_${seed}_${gs}.jpg`)
    d3.select("#generated-image-2")
        .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt2}_${timestep}_${seed}_${gs}.jpg`)
    if (!document.getElementById("umap-highlight-svg").hovered) {
        d3.select("#umap-highlight-svg")
            .selectAll("circle")
            .style("opacity", (d,i) => {
                if (i > timestep) return 0;
                return 1;
            })
    }
    if (window.comparison && !document.getElementById("umap-highlight-svg-2").hovered) {
        d3.select("#umap-highlight-svg-2")
            .selectAll("circle")
            .style("opacity", (d,i) => {
                if (i > timestep) return 0;
                return 1;
            })
    }
    d3.select("#denoise-latent-l2-expl-prev-latent-timestep")
        .text(timestep<50?timestep:49)
    d3.select("#denoise-latent-l2-expl-prev-latent-text")
        .text(`Latent from timestep ${timestep<50?timestep:49}`)
    d3.select("#denoise-latent-out-latent-timestep")
        .text(timestep<50?timestep+1:50)
    d3.select("#denoise-latent-l2-expl-prev-latent-img")
        .attr("src", `./assets/latents/${selectedPromptGroupName}/${selectedPrompt1}_${Math.min(timestep,49)}_${seed}_${gs}.jpg`)
}

function controllerPauseButtonClicked() {
    d3.select("#controller-button-pause")
        .style("display", "none");
    d3.select("#controller-button-play")
        .style("display", "inline-block");

    if (document.getElementById("controller").playing) {
        document.getElementById("controller").playing = false;
        clearInterval(document.getElementById("controller").playingInterval);
    }

    d3.select("#denoise-latent-cycle")
        .style("animation-play-state", "paused")
    d3.select("#denoise-latent-decoder-arrow")
        .style("animation-play-state", "paused")
    d3.select("#decoder-generated-image-arrow")
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

function animateArchCycle() {
    d3.select("#denoise-latent-cycle")
        .style("animation-play-state", "")
    d3.select("#denoise-latent-decoder-arrow")
        .style("animation-play-state", "")
    d3.select("#decoder-generated-image-arrow")
        .style("animation-play-state", "")
}

function drawUmap(data) {
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
                if (window.comparison) return 1
                else if (selected["prompts"][Math.floor(i/totalTimesteps)] == prompt) return 1;
                return 0;
            })
            .attr("display", (d,i)=>{
                if (window.comparison) return "";
                else if (selected["prompts"][Math.floor(i/totalTimesteps)] == prompt) return "";
                return "none";
            })

    d3.select("#umap-svg").append("svg").attr("id", "umap-highlight-svg")
    d3.select("#umap-svg").append("svg").attr("id", "umap-highlight-svg-2")
    addUmapHighlightNodes(1)
    if (window.comparison) addUmapHighlightNodes(2)
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
    // TODO: change the slider position of l3 expl + if slider position changed, call gsChanged
    let sliderWidth = 120;
    let sliderHeight = 120;
    let partitions = [0,0.25,0.55,1.]
    let borderColors = ["#C8E4F0FF","#A5D2E4FF","#6CB2D0FF"]
    let points = {
        1: [partitions[1]*sliderWidth, (1-partitions[1])*sliderHeight],
        7: [partitions[2]*sliderWidth, (1-partitions[2])*sliderHeight],
        20: [partitions[3]*sliderWidth, (1-partitions[3])*sliderHeight],
    }
    if (newGs == 1) {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("x1", points[1][0])
            .attr("y1", points[1][1])
            .attr("x2", points[1][0])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle")
            .attr("cx", points[1][0])
            .attr("cy", points[1][1])
        d3.select("#denoise-latent-l2-expl-noise-img")
            .style("border-color", borderColors[0])
        if (window.latentDenoiserL3Expanded) {
            d3.select("#denoise-latent-l2-expl-noise-img")
                .style("left", `${defaultNoiseLeftValue+points[1][0]-points[7][0]}px`)
            d3.select("#denoise-latent-l2-expl-noise-text")
                .style("left", `${defaultNoiseLeftValue+points[1][0]-points[7][0]-4}px`)
        }
    }
    else if (newGs == 20) {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("x1", points[20][0])
            .attr("y1", points[20][1])
            .attr("x2", points[20][0])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle")
            .attr("cx", points[20][0])
            .attr("cy", points[20][1])
        d3.select("#denoise-latent-l2-expl-noise-img")
            .style("border-color", borderColors[1])
        if (window.latentDenoiserL3Expanded) {
            d3.select("#denoise-latent-l2-expl-noise-img")
                .style("left", `${defaultNoiseLeftValue+points[20][0]-points[7][0]}px`)
            d3.select("#denoise-latent-l2-expl-noise-text")
                .style("left", `${defaultNoiseLeftValue+points[20][0]-points[7][0]-4}px`)
        }
    }
    else {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("x1", points[7][0])
            .attr("y1", points[7][1])
            .attr("x2", points[7][0])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle")
            .attr("cx", points[7][0])
            .attr("cy", points[7][1])
        d3.select("#denoise-latent-l2-expl-noise-img")
            .style("border-color", borderColors[1])
        if (window.latentDenoiserL3Expanded) {
            d3.select("#denoise-latent-l2-expl-noise-img")
                .style("left", `${defaultNoiseLeftValue}px`)
            d3.select("#denoise-latent-l2-expl-noise-text")
                .style("left", `${defaultNoiseLeftValue-4}px`)
        }
    }
}

function hyperparamChanged(e, newSeed, newGs) {
    // when seed or guidance scale is changed
    window.seed = newSeed;
    window.gs = newGs;
    let timestep = document.getElementById("controller").timestep;
    // 1. change the image
    d3.select("#generated-image")
        .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt1}_${timestep}_${seed}_${gs}.jpg`)
    d3.select("#generated-image-2")
        .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt2}_${timestep}_${seed}_${gs}.jpg`)
    
    // 2. change the umap
    d3.json("./assets/json/data.json").then(data => drawUmap(data));

    // 3. change improved latent, noise images in latent denoiser
    d3.select("#denoise-latent-l2-expl-prev-latent-img")
        .attr("src", `./assets/latents/${selectedPromptGroupName}/${selectedPrompt1}_${Math.min(timestep,49)}_${seed}_${gs}.jpg`)
    d3.select("#denoise-latent-out-noise-img")
        .attr("src", `./assets/latents/${selectedPromptGroupName}/${selectedPrompt1}_${Math.min(timestep,50)}_${seed}_${gs}.jpg`)
}

function generatedImageHovered(e){
    if (this.id=="generated-image")
        d3.select("#generated-image")
            .attr("src", `./assets/images/${selectedPromptGroupName}/unscheduled/${selectedPrompt1}_1_${seed}_${gs}.jpg`)
    else if (this.id=="generated-image-2")
        d3.select("#generated-image-2")
            .attr("src", `./assets/images/${selectedPromptGroupName}/unscheduled/${selectedPrompt2}_1_${seed}_${gs}.jpg`)
}

function generatedImageMouseOut(e){
    let timestep = document.getElementById("controller").timestep;
    if (this.id=="generated-image")
        d3.select("#generated-image")
            .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt1}_${timestep}_${seed}_${gs}.jpg`)
    else if (this.id=="generated-image-2")
        d3.select("#generated-image-2")
            .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt2}_${timestep}_${seed}_${gs}.jpg`)
}

function textVectorGeneratorClicked(e) {
    window.textVectorGeneratorL2Expanded = true;
    let textVectorGeneratorRectExpandedWidth = 500
    let textVectorGeneratorRectExpandedHeight = 214
    let textVectorGeneratorRectOrigWidth = +(getComputedStyle(this).width.slice(0,-2))
    let animationDuration = 1000
    d3.interrupt(d3.select("#generate-text-vector-l2-expl-container"))
    d3.select("#generate-text-vector-l2-expl-container")
        .style("display", "block")
        .style("pointer-events", "initial")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#generate-text-vector-container")
        .transition()
            .duration(animationDuration)
            .style("top", "126px")
    d3.select("#generate-text-vector-svg")
        .transition()
            .duration(animationDuration)
            .style("width", `${textVectorGeneratorRectExpandedWidth}px`)
    d3.select("#generate-text-vector-rectangle")
        .style("fill", "#ffffff")
        .style("cursor", "default")
        .transition()
            .duration(animationDuration)
            .attr("width", textVectorGeneratorRectExpandedWidth)
            .attr("height", textVectorGeneratorRectExpandedHeight)
    d3.select("#denoise-latent-cycle-container")
        .transition()
            .duration(animationDuration)
            .style("left", "722px")
    d3.select("#denoise-latent-container")
        .transition()
            .duration(animationDuration)
            .style("left", "786px")
    d3.select("#unet-in-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", "750px")
    d3.select("#denoise-latent-decoder-container")
        .transition()
            .duration(animationDuration)
            .style("left", "928px")
    d3.select("#denoise-latent-out-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", "955px")
    d3.select("#decoder-container")
        .transition()
            .duration(animationDuration)
            .style("left", "1020px")
    d3.select("#decoder-generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", "1097px")
    d3.select("#generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", "1128px")
    d3.select("#generate-text-vector-text")
        .transition()
        .duration(animationDuration)
            .style("width", `${textVectorGeneratorRectExpandedWidth}px`)
            .style("top", "14px")
            .style("font-size", "20px")
    d3.select("#generate-text-vector-denoise-latent-container")
        .transition()
        .duration(animationDuration)
            .style("left","454px")
    d3.select("#generate-text-vector-denoise-latent-guide-text")
        .transition()
        .duration(animationDuration)
            .style("left","174px")
    d3.select("#generate-text-vector-denoise-latent-arrow")
        .transition()
        .duration(animationDuration)
            .attr("x2", "215")
    d3.select("#generate-text-vector-l2-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
}

function reduceTextVectorGenerator(e) {
    if (window.textVectorGeneratorL3Expanded) {
        d3.select("#generate-text-vector-l3-expl-container").style("display", "none")
        window.textVectorGeneratorL3Expanded = false;
    }
    window.textVectorGeneratorL2Expanded = false;
    
    let textVectorGeneratorRectReducedWidth = 100
    let textVectorGeneratorRectReducedHeight = 50
    let animationDuration = 1000
    d3.select("#generate-text-vector-l2-expl-container")
        .style("pointer-events", "none")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#generate-text-vector-container")
        .transition()
            .duration(animationDuration)
            .style("top", "202px")
    d3.select("#generate-text-vector-svg")
        .transition()
            .duration(animationDuration)
            .style("width", `${textVectorGeneratorRectReducedWidth}px`)
    d3.select("#generate-text-vector-rectangle")
        .style("fill", "none")
        .style("cursor", "pointer")
        .transition()
            .duration(animationDuration)
            .attr("width", textVectorGeneratorRectReducedWidth)
            .attr("height", textVectorGeneratorRectReducedHeight)
    d3.select("#denoise-latent-cycle-container")
        .transition()
            .duration(animationDuration)
            .style("left", "322px")
    d3.select("#denoise-latent-container")
        .transition()
            .duration(animationDuration)
            .style("left", "386px")
    d3.select("#unet-in-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", "350px")
    d3.select("#denoise-latent-decoder-container")
        .transition()
            .duration(animationDuration)
            .style("left", "528px")
    d3.select("#denoise-latent-out-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", "555px")
    d3.select("#decoder-container")
        .transition()
            .duration(animationDuration)
            .style("left", "620px")
    d3.select("#decoder-generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", "697px")
    d3.select("#generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", "728px")
    d3.select("#generate-text-vector-text")
        .transition()
        .duration(animationDuration)
            .style("width", `${textVectorGeneratorRectReducedWidth}px`)
            .style("top", "10px")
            .style("font-size", "16px")
    d3.select("#generate-text-vector-denoise-latent-container")
        .transition()
        .duration(animationDuration)
            .style("left","224px")
    d3.select("#generate-text-vector-denoise-latent-guide-text")
        .transition()
        .duration(animationDuration)
            .style("left","0")
    d3.select("#generate-text-vector-denoise-latent-arrow")
        .transition()
        .duration(animationDuration)
            .attr("x2", "152")
    d3.select("#generate-text-vector-l2-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0%")
    
}

function latentDenoiserClicked(e) {
    window.latentDenoiserL2Expanded = true;
    let latentDenoiserExpandedWidth = 323;
    let latentDenoiserExpandedHeight = 263;
    // let latentDenoiserGeneratorOrigWidth =+(getComputedStyle(this).width.slice(0,-2))
    let latentDenoiserGeneratorOrigWidth = 140;
    let animationDuration = 1000

    d3.interrupt(d3.select(this))
    d3.interrupt(d3.select("#denoise-latent-l2-expl-container"))
    d3.interrupt(d3.select("#unet-guidance-scale-control-container"))

    d3.select("#denoise-latent-l2-expl-container")
        .style("pointer-events", "initial")
        .style("display", "block")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#denoise-latent-container")
        .style("cursor", "default")
        .transition()
            .duration(animationDuration)
            .style("width", latentDenoiserExpandedWidth)
            .style("height", latentDenoiserExpandedHeight)
            .style("left", `${386-(latentDenoiserExpandedWidth-latentDenoiserGeneratorOrigWidth)/2}px`)
            .style("top", "152px")
    d3.select("#denoise-latent-rectangle")
        .style("fill", "none")
        .style("cursor", "default")
        .transition()
            .duration(animationDuration)
            .attr("width", latentDenoiserExpandedWidth)
            .attr("height", latentDenoiserExpandedHeight)
    d3.select("#your-prompt-container")
        .transition()
            .duration(animationDuration)
            .style("left", `-150px`)
    d3.select("#generate-text-vector-container")
        .transition()
            .duration(animationDuration)
            .style("left", `-58px`)
    d3.select("#generate-text-vector-denoise-latent-container")
        .transition()
            .duration(animationDuration)
            .style("left", `132px`)
            .style("top", `134px`)
    d3.select("#denoise-latent-cycle-container")
        .transition()
            .duration(animationDuration)
            .style("left", `235px`)
            .style("opacity", "0.2")
    d3.select("#unet-in-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", `350px`)
    d3.select("#denoise-latent-decoder-container")
        .transition()
            .duration(animationDuration)
            .style("left", `528px`)
            .style("opacity", "0%")
    d3.select("#denoise-latent-out-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", `652px`)
    d3.select("#decoder-container")
        .transition()
            .duration(animationDuration)
            .style("left", `717px`)
    d3.select("#decoder-generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `794px`)
    d3.select("#generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `825px`)
    d3.select("#denoise-latent-cycle-container svg g path")
        .transition()
            .duration(animationDuration)
            .attr("d", `M ${257+latentDenoiserExpandedWidth-latentDenoiserGeneratorOrigWidth},128.5 l0 -75 a5,5 0 0 0 -5,-5 l${-245-latentDenoiserExpandedWidth+latentDenoiserGeneratorOrigWidth-10},0 a5,5 0 0 0 -5,5 l0,75 a5,5 0 0 0 5,5 l47,0`)
    d3.select("#denoise-latent-cycle-latent-text")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0%")
    d3.select("#generate-text-vector-denoise-latent-arrow")
        .transition()
            .duration(animationDuration)
            .attr("x2", "213")
    d3.select("#denoise-latent-text")
        .transition()
        .duration(animationDuration)
        .style("width", `${latentDenoiserExpandedWidth}px`)
        .style("top", "12px")
        .style("font-size", "20px")
    d3.select("#unet-guidance-scale-control-container")
        .style("display", "block")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
            .style("top", "324px")
            .style("left", "390px")
    d3.select("#predict-noise")
        .transition()
            .duration(animationDuration)
            .style("opacity","0%")
    d3.select("#remove-noise")
        .transition()
            .duration(animationDuration)
            .style("opacity","0%")
    d3.select("#denoise-latent-l2-left-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#denoise-latent-l2-right-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#denoise-latent-out-latent-timestep")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#denoise-latent-l2-expl-text-vectors-arrow-svg")
        .transition()
        .delay(animationDuration)
        .duration(animationDuration*0.5)
            .style("opacity","100%")
}

function reduceLatentDenoiser () {
    if (window.latentDenoiserL3Expanded) reduceLatentDenoiserL3();
    window.latentDenoiserL2Expanded = false;
    window.latentDenoiserL3Expanded = false;
    let animationDuration = 1000

    d3.select("#denoise-latent-l2-expl-container")
        .style("pointer-events", "none")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#denoise-latent-container")
        .style("cursor", "pointer")
        .transition()
            .duration(animationDuration)
            .style("width", "140px")
            .style("height", "105px")
            .style("left", "386px")
            .style("top", "155px")
    d3.select("#denoise-latent-rectangle")
        .style("fill", "none")
        .style("cursor", "")
        .transition()
        .duration(animationDuration)
            .attr("width", "140")
            .attr("height", "105")
    d3.select("#denoise-latent-svg")
        .transition()
            .duration(animationDuration)
            .style("width", "140px")
            .style("top", "0px")
    d3.select("#your-prompt-container")
        .transition()
            .duration(animationDuration)
            .style("left", `30px`)
    d3.select("#generate-text-vector-container")
        .transition()
            .duration(animationDuration)
            .style("left", `122px`)
    d3.select("#generate-text-vector-denoise-latent-container")
        .transition()
            .duration(animationDuration)
            .style("left", `224px`)
            .style("top", "67px")
    d3.select("#denoise-latent-cycle-container")
        .transition()
            .duration(animationDuration)
            .style("left", `322px`)
            .style("opacity", "1.0")
    d3.select("#unet-in-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", `350px`)
    d3.select("#denoise-latent-decoder-container")
        .transition()
            .duration(animationDuration)
            .style("left", `528px`)
    d3.select("#denoise-latent-out-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", `555px`)
    d3.select("#decoder-container")
        .transition()
            .duration(animationDuration)
            .style("left", `620px`)
    d3.select("#decoder-generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `697px`)
    d3.select("#generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `728px`)
    d3.select("#denoise-latent-cycle-container svg g path")
        .transition()
            .duration(animationDuration)
            .attr("d", `M 257,128.5 l0 -55.5 a5,5 0 0 0 -5,-5 l-245,0 a5,5 0 0 0 -5,5 l0,41 a5,5 0 0 0 5,5 l47,0`)
    d3.select("#denoise-latent-cycle-latent-text")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#generate-text-vector-denoise-latent-arrow")
        .transition()
            .duration(animationDuration)
            .attr("x2", "152")
    d3.select("#denoise-latent-text")
        .transition()
        .duration(animationDuration)
            .style("width", "140px")
            .style("top", "12px")
            .style("font-size", "16px")
    d3.select("#unet-guidance-scale-control-container")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0%")  // TODO: FIX: Depending on hyperparameter show/hide
            .style("top", "324px")
            .style("left", "390px")
            // .style("top", "200px")
            // .style("left", "9px")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#predict-noise")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#remove-noise")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#denoise-latent-l2-left-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0%")
    d3.select("#denoise-latent-l2-right-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0%")
    d3.select("#denoise-latent-decoder-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#denoise-latent-out-latent-timestep")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0%")
    d3.select("#denoise-latent-l2-expl-text-vectors-arrow-svg")
        .transition()
        .duration(animationDuration*0.5)
            .style("opacity","0%")
}

function expandLatentDenoiserL3 () {
    window.latentDenoiserL3Expanded = true;
    let animationDuration = 1000
    // ADD Interrupt
    d3.interrupt(d3.select("#latent-denoiser-l3-expl-container"))    

    d3.select("#latent-denoiser-l3-expl-container")    
        .style("display", "block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#denoise-latent-rectangle")
        .transition()
        .duration(animationDuration)
            .attr("height", "326")
    // add noise border, border color: function of guidance scale
    let borderColors = ["#C8E4F0FF","#A5D2E4FF","#6CB2D0FF"]
    d3.select("#denoise-latent-l2-expl-noise-img")
        .transition()
        .duration(animationDuration)
            .style("border-width", `3px`)
            .style("border-color", `${borderColors[1]}`)
    // hide guidance scale expl ...
    d3.select("#unet-guidance-scale-control-dropdown-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0%")
        .transition()
            .style("display","none")
        .on("interrupt", function () {
            d3.select(this).style("display", "block")
        })
    d3.select("#denoise-latent-l2-expl-guidance-scale-expl-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0%")
        .transition()
            .style("display","none")
        .on("interrupt", function () {
            d3.select(this).style("display", "block")
        })
    // move the text Guidance Scale
    d3.select("#unet-guidance-scale-control-text-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0%")
        .transition()
            .style("display","none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
}

function reduceLatentDenoiserL3 () {
    window.latentDenoiserL3Expanded = false;
    let animationDuration = 1000
    // ADD interrupt 
    d3.interrupt(d3.select("#unet-guidance-scale-control-dropdown-container"))
    d3.interrupt(d3.select("#denoise-latent-l2-expl-guidance-scale-expl-container"))
    d3.interrupt(d3.select("#denoise-latent-l2-expl-question-mark"))

    // Hide L3 Explanations
    d3.select("#latent-denoiser-l3-expl-container")    
        .transition()
        .duration(animationDuration)
            .style("opacity", "0%")
        .transition()
            .style("display", "none")
        .on("interrupt", function () {
            d3.select(this).style("display", "block")
        })
    d3.select("#denoise-latent-rectangle")
        .transition()
        .duration(animationDuration)
            .attr("height", "263")
            .attr("width", "500")
    d3.select("#denoise-latent-l2-expl-central-line-svg")
        .select("line")
            .transition()
            .duration(animationDuration)
                .attr("x2", "522")
    d3.select("#denoise-latent-l2-expl-central-line-svg")
        .select("text")
            .transition()
            .duration(animationDuration)
                .attr("x", "494")
    d3.select("#denoise-latent-l2-expl-central-line-svg")
        .select("circle")
            .transition()
            .duration(animationDuration)
                .attr("cx", "498")
    d3.select("#denoise-latent-l2-expl-weaken-expl")
        .transition()
        .duration(animationDuration)
            .style("left", "-66px")
    d3.select("#denoise-latent-out-noise-container")
        .transition()
        .duration(animationDuration)
            .style("left", "735px")
    d3.select("#decoder-container")
        .transition()
        .duration(animationDuration)
            .style("left", "800px")
    d3.select("#denoise-latent-cycle")
        .transition()
        .duration(animationDuration)
            .attr("d", "M 617,128.5 l0 -75 a5,5 0 0 0 -5,-5 l-615,0 a5,5 0 0 0 -5,5 l0,75 a5,5 0 0 0 5,5 l47,0")
    // move noise text
    d3.select("#denoise-latent-l2-expl-noise-text")
        .transition()
        .duration(animationDuration)
            .style("top", "14px")
            .style("left", "25px")
    // add noise border, border color: function of guidance scale
    d3.select("#denoise-latent-l2-expl-noise-img")
        .transition()
        .duration(animationDuration)
            .style("border-width", `0px`)
            .style("border-color", `#ffffff00`)
            .style("left", "29px")
    d3.select("#unet-guidance-scale-control-dropdown-container")
        .transition()
            .style("display","inline-block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#denoise-latent-l2-expl-guidance-scale-expl-container")
        .transition()
            .style("display","block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
    // move the text Guidance Scale
    d3.select("#unet-guidance-scale-control-text-container")
        .transition()
            .style("width", "84px")
        .transition()
        .duration(animationDuration)
            .style("left", "0px")
            .style("top", "0px")
    // move text weaken and arrow
    d3.select("#denoise-latent-l2-expl-weaken-text")
        .transition()
        .duration(animationDuration)
            .style("left", "93px")
    d3.select("#denoise-latent-l2-expl-weaken-arrow-svg")
        .transition()
        .duration(animationDuration)
            .style("left", "112px")
    // elongate unet-minus connecting line 
    d3.select("#denoise-latent-l2-expl-noise-arrow")
        .transition()
        .duration(animationDuration)
            .attr("d", "M0 0 l180 0 a 10 10 81.46923439005187 0 0 9.889363528682974 -8.516595470697553 l9 -60 a 10 10 81.46923439005187 0 1 9.889363528682974 -8.516595470697553 l 3 0")
    d3.select("#denoise-latent-l2-expl-question-mark")
        .transition()
            .style("display", "block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
}

export {promptSelectorImageclicked, promptCompareClicked, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updateStep, controllerPauseButtonClicked, seedChanged, gsChanged, drawUmap, updatePromptList, generatedImageHovered, generatedImageMouseOut, textVectorGeneratorClicked, reduceTextVectorGenerator, latentDenoiserClicked, reduceLatentDenoiser, expandLatentDenoiserL3,reduceLatentDenoiserL3, hyperparamChanged};
