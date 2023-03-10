function promptChanged() {
    let p = d3.select(`#${this.id}`).text()
    let i = this.id.split("-")[4]
    // change generated image and latent visualization
    window.selectedPrompt = p
    window.selectedPromptGroupIdx = +i
    d3.select("#improved-latent-img")
        .attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    d3.select("#generated-image")
        .attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    // collapse dropdown
    window.promptDropdownExpanded = false
    d3.select("#prompt-selector-dropdown").style("display", "none")
    // change text tokens...
    d3.select("#prompt-selector-dropdown-box-text").text(p)
    let h = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
    d3.select("#your-text-prompt").style("top", `${20.5-h/2}px`)
    // change dropdown's display
    d3.select("#prompt-selector-dropdown").selectAll("p").style("display", "block")
    d3.select(`#prompt-selector-dropdown-option-${i}`).style("display","none")
    // change tokens in text representation generator
    drawTokens();
    drawTextVectors();
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

// Controller: Hover, Play/Pause...
function controllerButtonHovered() {
    if (this.id.includes("play")) d3.select(`#${this.id}`).style("fill", "#bababa")
    else d3.select(`#${this.id}`).style("opacity", "30%")
}

function controllerButtonMouseout() {
    if (this.id.includes("play")) d3.select(`#${this.id}`).style("fill", "#d0d0d0")
    else d3.select(`#${this.id}`).style("opacity", "0%")
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
    controllerPauseButtonClicked();
    updateStep(0);
    controllerPlayButtonClicked();
}

function controllerPlayButtonClicked() {
    animateArchCycle();
    
    d3.select("#controller-button-pause").style("display", "inline-block");
    d3.select("#controller-button-play").style("display", "none");

    window.playing = true;
    document.getElementById("controller").playingInterval = setInterval(increaseStep, 100);
}

function increaseStep() {
    let timestep = window.timestep + 1;
    if (timestep > 50) timestep = 1;
    updateStep(timestep);
}

function decreaseStep() {
    let timestep = window.timestep - 1;
    updateStep(timestep);
}

function updateStep(timestep) {
    window.timestep = timestep;
    d3.select("#controller-timestep-number").text(timestep);
    document.getElementById("controller-timestep-slider").value = timestep;
    d3.select("#improved-latent-img")
        .attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${timestep}.jpg`)
    d3.select("#generated-image")
        .attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${timestep}.jpg`)

    // TODO: Comparison view, UMAP update
    // d3.select("#generated-image-2")
    //     .attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${selectedPrompt2}_${timestep}_${seed}_${gs}.jpg`)
    // if (!document.getElementById("umap-highlight-svg").hovered) {
    //     d3.select("#umap-highlight-svg")
    //         .selectAll("circle")
    //         .style("opacity", (d,i) => {
    //             if (i > timestep) return 0;
    //             return 1;
    //         })
    // }
    // if (window.comparison && !document.getElementById("umap-highlight-svg-2").hovered) {
    //     d3.select("#umap-highlight-svg-2")
    //         .selectAll("circle")
    //         .style("opacity", (d,i) => {
    //             if (i > timestep) return 0;
    //             return 1;
    //         })
    // }

    // Latent denoiser l2 expl update
    d3.select("#denoise-latent-l2-expl-prev-latent-timestep").text(timestep-1)
    d3.select("#denoise-latent-l2-expl-prev-latent-text").text(`Representation of timestep ${window.timestep-1}`)
    d3.select("#improved-latent-timestep").text(timestep)
    d3.select("#denoise-latent-l2-expl-prev-latent-img").attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${timestep-1}.jpg`)
}

function controllerPauseButtonClicked() {
    d3.select("#controller-button-pause").style("display", "none");
    d3.select("#controller-button-play").style("display", "inline-block");

    if (window.playing) clearInterval(document.getElementById("controller").playingInterval);

    window.playing = false;
    d3.select("#latent-denoiser-cycle")
        .style("animation-play-state", "paused")
    d3.select("#denoise-latent-l2-expl-central-line-arrow")
        .style("animation-play-state", "paused")
    //     .attr("stroke", "var(--img4)")
}

function timestepSliderFunction(){
    controllerPauseButtonClicked();
    let timestep = +(this.value);
    updateStep(timestep);
}

function animateArchCycle() {
    d3.select("#latent-denoiser-cycle").style("animation-play-state", "")
    d3.select("#denoise-latent-l2-expl-central-line-arrow")
        .style("animation-play-state", "")
        // .attr("stroke", "url(#denoise-latent-l2-expl-central-line-arrow-lineargradient)")
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
    let newSeed = this.value
    hyperparamChanged(e, newSeed, window.gs);
    // change image galleries
}

function gsChanged(e) {
    // when guidance scale is changed
    let newGs = d3.select(this).property('value');
    console.log(newGs)
    hyperparamChanged(e, window.seed, newGs);
    // TODO: change the slider position of l3 expl 
    let sliderWidth = 250;
    let sliderHeight = 0;
    let partitions = [0,0.1,0.4,1.]
    let colors = {0: "#a0a0a0", 1: "var(--text1)", 7: "var(--text2)", 20: "var(--text3)"}
    let path = {
        0: "M0 0 l 0 -15 C 0 -30, 15.2 -31, 30.4 -32 L121.6 -38 C 136.8 -39, 152 -40, 152 -55 L152 -70", 
        1: "M25 0 l 0 -15 C 25 -30, 40.2 -31, 55.4 -32 L121.6 -38 C 136.8 -39, 152 -40, 152 -55 L152 -70", 
        7: "M100 0 l 0 -20 C 100 -25, 107.8 -31.5, 113 -32.5 L139 -37.5 C 144.2 -38.5, 152 -40, 152 -45 L152 -70", 
        20: "M250 0 l 0 -20 C 250 -25, 242.2 -31.5, 237 -32.5 L165 -37.5 C 159.8 -38.5, 152 -40, 152 -45 L152 -70"
    }
    let points = {
        0: [partitions[0]*sliderWidth, (1-partitions[0])*sliderHeight],
        1: [partitions[1]*sliderWidth, (1-partitions[1])*sliderHeight],
        7: [partitions[2]*sliderWidth, (1-partitions[2])*sliderHeight],
        20: [partitions[3]*sliderWidth, (1-partitions[3])*sliderHeight],
    }
    function moveThumb(gs) {
        gs = +(gs)
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("x1", points[gs][0])
            .attr("y1", points[gs][1])
            .attr("x2", points[gs][0])
            .attr("stroke", colors[gs])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle")
            .attr("cx", points[gs][0])
            .attr("cy", points[gs][1])
            .attr("fill", colors[gs])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("d", path[gs])
    }
    moveThumb(newGs)
}

function hyperparamChanged(e, newSeed, newGs) {
    // when seed or guidance scale is changed
    window.seed = newSeed;
    window.gs = newGs;
    let timestep = window.timestep;
    let p = window.selectedPrompt
    // 1. change the image
    d3.select("#improved-latent-img").attr("src", `./assets/latent_viz/${p}/${newSeed}_${newGs}_${timestep}.jpg`)
    d3.select("#denoise-latent-l2-expl-prev-latent-img").attr("src", `./assets/latent_viz/${p}/${newSeed}_${newGs}_${timestep-1}.jpg`)
    d3.select("#generated-image").attr("src", `./assets/img/${p}/${newSeed}_${newGs}_${timestep}.jpg`)
    
    // 2. change the umap
    // TODO
    // d3.json("./assets/json/data.json").then(data => drawUmap(data));
}

function drawTokens() {
    let tokenList = window.selectedPrompt.split(" ")
    let containerId = "text-vector-generator-l2-tokens-container"
    d3.selectAll("#text-vector-generator-l2-tokens-container > *").remove()
    d3.select("#text-vector-generator-l2-expl-container").style("display", "block")
    
    let full = false;
    d3.select(`#${containerId}`)
        .append("div")
            .attr("class", "text-vector-generator-token")
            .text("<start>")
    for (let i = 0 ; i < tokenList.length ; i ++) {
        d3.select(`#${containerId}`)
            .append("div")
                .attr("class", "text-vector-generator-token")
                .text(tokenList[i])
        let height = +getComputedStyle(document.getElementById(containerId))["height"].slice(0,-2)
        if (height > 70) {
            document.getElementById(containerId).lastChild.remove();
            full = true;
            break;
        }
    }
    if (!full) {
        while (true) {
            d3.select(`#${containerId}`)
                .append("div")
                    .attr("class", "text-vector-generator-token")
                    .text("<end>")
            let height = +getComputedStyle(document.getElementById(containerId))["height"].slice(0,-2)
            if (height > 70) {
                document.getElementById(containerId).lastChild.remove();
                full = true;
                break;
            }
        }
    }
    d3.select("#text-vector-generator-l2-expl-container").style("display", "none")
    d3.select(`#${containerId}`).append("svg").attr("id", "text-vector-generator-l2-tokens-dots-svg")
    d3.select("#text-vector-generator-l2-tokens-dots-svg").append("circle").attr("r", "1.5").attr("cx","68").attr("cy", "10").attr("class", "text-dot")
    d3.select("#text-vector-generator-l2-tokens-dots-svg").append("circle").attr("r", "1.5").attr("cx","68").attr("cy", "17").attr("class", "text-dot")
    d3.select("#text-vector-generator-l2-tokens-dots-svg").append("circle").attr("r", "1.5").attr("cx","68").attr("cy", "24").attr("class", "text-dot")
}

function drawTextVectors() {
    // TEXT TOKENS
    let containerId = "text-vector-generator-l2-vectors-container"
    d3.selectAll(`#${containerId} > *`).remove()
    let tokenList = window.selectedPrompt.split(" ")
    // let vectors = data[window.selectedPromptGroupName]["vector"][selectedPrompt1]
    let tokenNum = 3;
    let vectorDim = 3;
    for (let i = 0 ; i < tokenNum; i++){
        let token = "<start>"
        if (i > 0) token = tokenList[i-1]
        d3.select("#text-vector-generator-l2-vectors-container")
            .append("div")
            .attr("id", `text-vector-generator-l2-vector-container-${i}`)
                .append("div")
                    .attr("class", "text-vector-generator-token text-vector-generator-l2-vector-token")
                    .text(token)
        d3.select(`#text-vector-generator-l2-vector-container-${i}`)
            .append("div")
                .attr("class", "text-vector-generator-l2-vectors")
                .attr("id", `text-vector-generator-l2-vector-${i}`)
        for (let j = 0 ; j< vectorDim ; j++) {
            d3.select(`#text-vector-generator-l2-vector-${i}`)
                .append("div")
                    .attr("class", "text-vector-generator-l2-vector-cell")
                    .attr("id", `text-vector-generator-l2-vector-cell-${i}-${j}`)
                    // .text(Math.round(+(vectors[i][j])*100)/100)
                    // .text("0.00")
                    .style("left", `${21*j}px`)
        }
        d3.select(`#text-vector-generator-l2-vector-${i}`)
            .append("div")
                .attr("class", "text-vector-generator-l2-vector-cell text-vector-generator-l2-vector-cell-last")
                .style("left", `${21*vectorDim}px`)
                
        d3.select(`#text-vector-generator-l2-vector-${i}`)
            .append("svg")
                .attr("class", "text-vector-generator-l2-vector-horizontal-dots-svg")
                .attr("id", `text-vector-generator-l2-vector-horizontal-dots-svg-${i}`)
        d3.select(`#text-vector-generator-l2-vector-horizontal-dots-svg-${i}`).append("circle").attr("r", "1.5").attr("cx","16").attr("cy", "11").attr("class", "text-dot")
        d3.select(`#text-vector-generator-l2-vector-horizontal-dots-svg-${i}`).append("circle").attr("r", "1.5").attr("cx","22").attr("cy", "11").attr("class", "text-dot")
        d3.select(`#text-vector-generator-l2-vector-horizontal-dots-svg-${i}`).append("circle").attr("r", "1.5").attr("cx","28").attr("cy", "11").attr("class", "text-dot")
    }
    d3.select(`#text-vector-generator-l2-vectors-container`).append("svg").attr("id", "text-vector-generator-l2-vectors-vertical-dots-svg")
    d3.select("#text-vector-generator-l2-vectors-vertical-dots-svg").append("circle").attr("r", "1.5").attr("cx","25").attr("cy", "10").attr("class", "text-dot")
    d3.select("#text-vector-generator-l2-vectors-vertical-dots-svg").append("circle").attr("r", "1.5").attr("cx","25").attr("cy", "17").attr("class", "text-dot")
    d3.select("#text-vector-generator-l2-vectors-vertical-dots-svg").append("circle").attr("r", "1.5").attr("cx","25").attr("cy", "24").attr("class", "text-dot")
    d3.json("./assets/json/text_vector.json")
        .then(function(d){
            for (let i = 0 ; i< tokenNum ; i++) {
                for (let j = 0 ; j< vectorDim ; j++) {
                    d3.select(`#text-vector-generator-l2-vector-cell-${i}-${j}`)
                        .text(Number(d[window.selectedPrompt][i][j]).toFixed(2))
                    // .text(Math.round(+(vectors[i][j])*100)/100)
                }
            }
        })
}

function expandTextVectorGeneratorL2(e) {
    if (window.textVectorGeneratorL2Expanded) return;
    if (window.latentDenoiserL3Expanded) {
        reduceLatentDenoiserL3(); 
        reduceLatentDenoiserL2();
    }
    else if (window.latentDenoiserL2Expanded) {
        reduceLatentDenoiserL2();
    }
    window.textVectorGeneratorL2Expanded = true;
    let textVectorGeneratorRectExpandedWidth = 550
    let textVectorGeneratorRectExpandedHeight = 230
    let textVectorGeneratorRectOrigWidth = 145
    let animationDuration = 1000
    let movePx = (textVectorGeneratorRectExpandedWidth-textVectorGeneratorRectOrigWidth) / 2
    d3.interrupt(d3.select("#text-vector-generator-l2-expl-container"))
    d3.interrupt(d3.select("#text-vector-generator-l2-left-cover"))
    d3.interrupt(d3.select("#text-vector-generator-l2-right-cover"))
    
    d3.select("#text-vector-generator-l2-expl-container")
        .style("display", "block")
        .style("pointer-events", "initial")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
    
    // Resize text vector generator
    d3.select("#text-vector-generator-container")
        .style("background-color", "var(--text00)")
        .style("cursor", "default")
        .transition()
            .duration(animationDuration)
            .style("width", `${textVectorGeneratorRectExpandedWidth}px`)
            .style("height", `${textVectorGeneratorRectExpandedHeight}px`)
            .style("left", `${290-movePx}px`)
            .style("top", "-69px")
            .style("padding", "15px 0")

    // Change the height of main
    d3.select("#main-wrapper")
        .transition()
            .duration(animationDuration)
            .style("height", "300px")

    // Move other things to left
    let ph = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
    d3.select("#your-text-prompt")
        .transition()
            .duration(animationDuration)
            .style("left", `${-movePx}px`)
            .style("top", `${20.5-ph/2}px`)
    d3.select("#prompt-text-vector-generator-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${250-movePx}px`)
            .style("top", `30px`)
    // Move other things to right
    d3.select("#text-vector-generator-latent-denoiser-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${437+movePx-7.5}px`)
            .style("top", `${30}px`)
    d3.select("#latent-denoiser-container")
        .style("cursor", "pointer")
        .transition()
            .duration(animationDuration)
            .style("left", `${542+movePx+20}px`)
            .style("width", "145px")
            .style("height", "80px")
            .style("top", "0px")
            .style("background-color", "var(--img00)")
    d3.select("#latent-denoiser-cycle-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${457+movePx+20}px`)
            .style("top", `30px`)
    d3.select("#improved-latent-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${707+movePx+20}px`)
    d3.select("#improved-latent-generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${753+movePx+20}px`)
    d3.select("#generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${800+movePx+20}px`)
    d3.select("#controller")
        .transition()
            .duration(animationDuration)
            .style("left", `${514+movePx+20}px`)
            .style("top", `37px`)
    d3.select("#guidance-scale-control-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${546+movePx+20}px`)
            .style("top", "95px")
            .style("opacity", window.gsControlDisplayed?"1":"0")
        .transition()
            .style("display", window.gsControlDisplayed?"block":"none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#guidance-scale-expl-container")
        .style("display", window.gsControlDisplayed?"block":"none")
        .transition()
            .duration(animationDuration)
            .style("left", `${347+movePx+20}px`)
            .style("opacity", window.gsControlDisplayed?"1":"0")
    d3.select("#seed-control-container")
        .style("display", window.seedControlDisplayed?"block":"none")
        .transition()
            .duration(animationDuration)
            .style("left", `${427+movePx+20}px`)
            .style("opacity", window.seedControlDisplayed?"1":"0")
    d3.select("#timestep-0-random-noise-container")
        .style("display", "block")
        .transition()
            .duration(animationDuration)
            .style("left", `${507+movePx+20}px`)
            .style("opacity", "1")

    // Set the cycle back
    d3.select("#latent-denoiser-cycle")
        .transition()
            .duration(animationDuration)
            .attr("d", `M 230 10 l 43,0 l0 -53 a5,5 0 0 0 -5,-5 l-213,0 a5,5 0 0 0 -5,5 l0,34 a5,5 0 0 0 5,5 l20,0`)

    // Extend the arrow to latent denoiser
    d3.select("#prompt-text-vector-generator-arrow")
        .transition()
            .duration(animationDuration)
            .attr("x2", "42")
    d3.select("#text-vector-generator-latent-denoiser-arrow")
        .transition()
            .duration(animationDuration)
            .attr("d", "M -178 10 L 40 10 C 50,10 50,10 60,10 L 122 10")

    // Move Text
    d3.select("#text-vector-generator-latent-denoiser-text")
        .transition()
            .duration(animationDuration)
            .style("left", "16px")
            .style("font-size", "13px")
    
    // cover
    d3.select("#text-vector-generator-l2-left-cover")
        .style("display", "block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")
    d3.select("#text-vector-generator-l2-right-cover")
        .style("display", "block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "100%")

    // To bring arrow to the front
    d3.select("#text-vector-generator-l2-expl-prompt-text-vector-arrow-svg")
        .transition()
        .delay(animationDuration*0.5)
        .duration(animationDuration*0.5)
            .style("opacity","100%")
}

function reduceTextVectorGeneratorL2(e) {
    if (window.textVectorGeneratorL3Expanded) {
        d3.select("#generate-text-vector-l3-expl-container").style("display", "none")
        window.textVectorGeneratorL3Expanded = false;
    }
    window.textVectorGeneratorL2Expanded = false;
    
    let textVectorGeneratorRectOrigWidth = 145
    let textVectorGeneratorRectOrigHeight = 80
    let animationDuration = 1000
    d3.select("#text-vector-generator-l2-expl-container")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })

    // Text vector generator resize
    d3.select("#text-vector-generator-container")
        .transition()
            .duration(animationDuration)
            .style("top", "0px")
            .style("left", "290px")
            .style("background-color", "var(--text00)")
            .style("cursor", "pointer")
            .style("width", `${textVectorGeneratorRectOrigWidth}px`)
            .style("height", `${textVectorGeneratorRectOrigHeight}px`)
            .style("padding", "11.5px 0")
            
    // Change the height of main
    d3.select("#main-wrapper")
        .transition()
            .duration(animationDuration)
            .style("height", "270px")

    // Move things back
    d3.select("#your-text-prompt")
    .transition()
        .duration(animationDuration)
        .style("left", "0px")
    d3.select("#prompt-text-vector-generator-container")
        .transition()
            .duration(animationDuration)
            .style("left", "250px")
    d3.select("#text-vector-generator-latent-denoiser-container")
        .transition()
            .duration(animationDuration)
            .style("left", "437px")
    d3.select("#latent-denoiser-container")
        .transition()
            .duration(animationDuration)
            .style("left", "542px")
    d3.select("#latent-denoiser-cycle-container")
        .transition()
            .duration(animationDuration)
            .style("left", "457px")
    d3.select("#improved-latent-container")
        .transition()
            .duration(animationDuration)
            .style("left", "707px")
    d3.select("#improved-latent-generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", "753px")
    d3.select("#generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", "810px")
    d3.select("#guidance-scale-control-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${546}px`)
    d3.select("#guidance-scale-expl-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${347}px`)
    d3.select("#timestep-0-random-noise-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${507}px`)
    d3.select("#seed-control-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${427}px`)
    d3.select("#controller")
        .transition()
            .duration(animationDuration)
            .style("left", "514px")

    // Move Text
    d3.select("#text-vector-generator-latent-denoiser-text")
        .transition()
            .duration(animationDuration)
            .style("left", "-2px")

    // arrows
    d3.select("#text-vector-generator-latent-denoiser-arrow")
        .transition()
        .duration(animationDuration)
            .attr("d", "M 0 10 L 30 10 C 42,10 55,10 67,10 L 95 10")
    d3.select("#prompt-text-vector-generator-arrow")
        .transition()
            .duration(animationDuration)
            .attr("x2", "30")
    
    // cover
    d3.select("#text-vector-generator-l2-left-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#text-vector-generator-l2-right-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })

    // Hide arrow use back
    d3.select("#text-vector-generator-l2-expl-prompt-text-vector-arrow-svg")
        .transition()
        .delay(animationDuration)
            .style("opacity","0")
}

function expandLatentDenoiserL2(e) {
    window.latentDenoiserL2Expanded = true;
    let latentDenoiserExpandedWidth = 323;
    let latentDenoiserExpandedHeight = 263;
    let latentDenoiserGeneratorOrigWidth = 145;
    let textVectorGeneratorRectOrigWidth = 145
    let textVectorGeneratorRectOrigHeight = 80
    let animationDuration = 1000
    let movePx = (latentDenoiserExpandedWidth-latentDenoiserGeneratorOrigWidth)/2
    // movePx += 5;
    d3.interrupt(d3.select(this))
    d3.interrupt(d3.select("#latent-denoiser-l2-expl-container"))
    d3.interrupt(d3.select("#improved-latent-timestep"))
    d3.interrupt(d3.select("#guidance-scale-control-container"))
    d3.interrupt(d3.select("#denoise-latent-l2-left-cover"))

    // show hidden elements
    d3.select("#latent-denoiser-l2-expl-container")
        .style("pointer-events", "initial")
        .style("display", "block")
        .transition()
            .duration(animationDuration)
            .style("opacity", "1")
    d3.select("#improved-latent-timestep")
        .style("display", "block")
        .transition()
            .duration(animationDuration)
            .style("opacity", "1")
            // .style("left", `${26+movePx}px`)

    // Hide random noise at timestep 0
    d3.select("#timestep-0-random-noise-container")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0")
            .style("left", `${507}px`)
        .transition()
            .style("display", "none")
        .on("interrupt", function(){
            d3.select(this).style("display", "block")
        })
    d3.select("#guidance-scale-expl-container")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0")
            .style("left", `${347}px`)
        .transition()
            .style("display", "none")
        .on("interrupt", function(){
            if (window.gsControlDisplayed) d3.select(this).style("display", "block")
        })
    d3.select("#seed-control-container")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0")
            .style("left", `${427}px`)
        .transition()
            .style("display", "none")
        .on("interrupt", function(){
            if (window.seedControlDisplayed) d3.select(this).style("display", "block")
        })


    // expand latent denoiser container
    d3.select("#latent-denoiser-container")
        .style("cursor", "default")
        .style("background-color", "var(--img00)")
        .transition()
            .duration(animationDuration)
            .style("width", `${latentDenoiserExpandedWidth}px`)
            .style("height", `${latentDenoiserExpandedHeight}px`)
            .style("left", `${542-movePx}px`)
            .style("top", "-13px")
    
    // Change the height of main
    d3.select("#main-wrapper")
        .transition()
            .duration(animationDuration)
            .style("height", "400px")

    // Move other things to left
    let ph = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
    d3.select("#your-text-prompt")
        .transition()
            .duration(animationDuration)
            .style("left", `-${movePx+20}px`)
            .style("top", `${101.5-ph/2}px`)
    d3.select("#prompt-text-vector-generator-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${250-movePx-20}px`)
            .style("top", `111px`)
    d3.select("#text-vector-generator-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${290-movePx-20}px`)
            .style("top", `87px`)
            .style("background-color", "var(--text00)")
            .style("cursor", "pointer")
            .style("width", `${textVectorGeneratorRectOrigWidth}px`)
            .style("height", `${textVectorGeneratorRectOrigHeight}px`)
            .style("padding", "11.5px 0")
    d3.select("#text-vector-generator-latent-denoiser-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${437-movePx-20}px`)
            .style("top", "114px")
    // Move other things to right
    d3.select("#improved-latent-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${707+movePx}px`)
    d3.select("#improved-latent-generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${753+movePx}px`)
    d3.select("#generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${810+movePx}px`)
    // Move controller
    d3.select("#controller")
        .transition()
            .duration(animationDuration)
            .style("top", `19px`)
    
    // Change the cycle to fit the new box
    d3.select("#latent-denoiser-cycle-container")
        .transition()
            .duration(animationDuration)
            .style("top", `${-110}px`)
            .style("left", `461px`)
    d3.select("#latent-denoiser-cycle")
        .transition()
            .duration(animationDuration)
            .attr("d", "M 356.5 135 l 0,0 l0 -58.5 a5,5 0 0 0 -5,-5 l-393,0 a5,5 0 0 0 -5,5 l0,53.5 a5,5 0 0 0 5,5 l0,0")

    // Change arrow from text vector generator to UNet
    d3.select("#text-vector-generator-latent-denoiser-arrow")
        .transition()
            .duration(animationDuration)
            .attr("d", "M 0 10 L 40 10 C 50,10 50,10 60,10 L 137 10")
    // Text position
    d3.select("#text-vector-generator-latent-denoiser-text")
        .transition()
        .duration(animationDuration)
            .style("font-size", "12px")
            .style("top", "15px")
            .style("text-align", "right")
            .style("left", "6px")
    d3.select("#improved-latent-expl-container")
        .transition()
        .duration(animationDuration)
            .style("font-size", "12px")
            
    // TODO: Guidance scale controller
    d3.select("#guidance-scale-control-container")
        .style("display", "block")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
            .style("top", "154px")
            .style("left", "539px")
    
    // Covers
    // TODO: Check whether cover positions work fine with interactive screen size
    d3.select("#denoise-latent-l2-left-cover")
        .style("display", "block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")

    // To bring arrow to the front
    d3.select("#denoise-latent-l2-expl-text-vectors-arrow-svg")
        .transition()
        .delay(animationDuration*0.5)
        .duration(animationDuration*0.5)
            .style("opacity","100%")
}

function reduceLatentDenoiserL2 () {
    if (window.latentDenoiserL3Expanded) reduceLatentDenoiserL3();
    window.latentDenoiserL2Expanded = false;
    window.latentDenoiserL3Expanded = false;
    let animationDuration = 1000

    d3.interrupt(d3.select("#timestep-0-random-noise-container"))
    d3.interrupt(d3.select("#guidance-scale-expl-container"))
    d3.interrupt(d3.select("#seed-control-container"))

    // hide elements
    d3.select("#latent-denoiser-l2-expl-container")
        .style("pointer-events", "none")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })

    // Bring random noise at timestep 0 back
    d3.select("#timestep-0-random-noise-container")
        .style("display", "block")
        .transition()
            .duration(animationDuration)
            .style("opacity", "1")
    // resize latent denoiser
    d3.select("#latent-denoiser-container")
        .style("cursor", "pointer")
        .transition()
            .duration(animationDuration)
            .style("width", "145px")
            .style("height", "80px")
            .style("left", "542px")
            .style("top", "0px")
            .style("background-color", "var(--img00)")

    // Change the height of main
    d3.select("#main-wrapper")
        .transition()
            .duration(animationDuration)
            .style("height", "270px")

    // Move other things back
    let ph = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
    d3.select("#your-text-prompt")
        .transition()
            .duration(animationDuration)
            .style("left", `0px`)
            .style("top", `${20.5-ph/2}px`)
    d3.select("#prompt-text-vector-generator-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${250}px`)
            .style("top", `30px`)
    d3.select("#text-vector-generator-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${290}px`)
            .style("top", `0px`)
    d3.select("#text-vector-generator-latent-denoiser-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${437}px`)
            .style("top", `${35}px`)
    d3.select("#improved-latent-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${707}px`)
    d3.select("#improved-latent-generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${753}px`)
    d3.select("#generated-image-container")
        .transition()
            .duration(animationDuration)
            .style("left", `${810}px`)
    // Move controller
    d3.select("#controller")
        .transition()
            .duration(animationDuration)
            .style("top", `40px`)

    // Set the cycle back
    d3.select("#latent-denoiser-cycle-container")
        .transition()
            .duration(animationDuration)
            .style("top", `30px`)
            .style("left", `457px`)
    d3.select("#latent-denoiser-cycle")
        .transition()
            .duration(animationDuration)
            .attr("d", `M 230 10 l 43,0 l0 -53 a5,5 0 0 0 -5,-5 l-213,0 a5,5 0 0 0 -5,5 l0,34 a5,5 0 0 0 5,5 l20,0`)
    // Set the arrow back
    d3.select("#text-vector-generator-latent-denoiser-arrow")
        .transition()
            .duration(animationDuration)
            .attr("d", `M 0 10 L 30 10 C 42,10 55,10 67,10 L 95 10`)
    // Text position
    d3.select("#text-vector-generator-latent-denoiser-text")
        .transition()
        .duration(animationDuration)
            .style("top", "15px")
            .style("left", "-7px")
            .style("text-align", "right")
            .style("font-size", "13px")
    d3.select("#improved-latent-expl-container")
        .transition()
        .duration(animationDuration)
            .style("font-size", "13px")
    
    // Guidance scale controller
    d3.select("#guidance-scale-control-container")
        .transition()
            .duration(animationDuration)
            .style("top", "87px")
            .style("left", "546px")
            .style("opacity", window.gsControlDisplayed?"1":"0")
        .transition()
            .style("display", window.gsControlDisplayed?"block":"none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    if (window.gsControlDisplayed)
        d3.select("#guidance-scale-expl-container")
            .transition()
                .style("display", "block")
            .transition()
                .duration(500)
                .style("opacity", "1")

    // Seed controller
    if (window.seedControlDisplayed)
        d3.select("#seed-control-container")
            .style("display", "block")
            .transition()
                .duration(animationDuration)
                .style("opacity", "1")
    
    // Cover
    d3.select("#denoise-latent-l2-left-cover")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    
    // Hide arrows
    d3.select("#denoise-latent-l2-expl-text-vectors-arrow-svg")
        .transition()
        .duration(animationDuration*0.5)
            .style("opacity","0%")

    // Hide timestep
    d3.select("#improved-latent-timestep")
        .transition()
            .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
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

    // increase the height of latent denoiser
    d3.select("#latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("height", "403px")
    
    // Change the height of main
    d3.select("#main-wrapper")
        .transition()
            .duration(animationDuration)
            .style("height", "515px")

    // hide guidance scale expl ...
    d3.select("#guidance-scale-control-dropdown-container")
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
    
    // hide Guidance Scale text
    d3.select("#guidance-scale-control-text")
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
    d3.interrupt(d3.select("#guidance-scale-control-dropdown-container"))
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

    // Change the height of main
    d3.select("#main-wrapper")
        .transition()
            .duration(animationDuration)
            .style("height", "400px")

    // Set the size of latent denoiser container back
    d3.select("#latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("height", "263px")
    
    // guidance scale
    d3.select("#guidance-scale-control-dropdown-container")
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
    d3.select("#guidance-scale-control-text")
        .transition()
            .style("display","inline-block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
}

// export {promptSelectorImageclicked, promptCompareClicked, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updateStep, controllerPauseButtonClicked, seedChanged, gsChanged, drawUmap, updatePromptList, textVectorGeneratorClicked, reduceTextVectorGenerator, latentDenoiserClicked, reduceLatentDenoiser, expandLatentDenoiserL3,reduceLatentDenoiserL3, hyperparamChanged};
export {promptChanged, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updateStep, controllerPauseButtonClicked, seedChanged, gsChanged, drawUmap, expandTextVectorGeneratorL2, reduceTextVectorGeneratorL2, expandLatentDenoiserL2, reduceLatentDenoiserL2, expandLatentDenoiserL3,reduceLatentDenoiserL3, hyperparamChanged, drawTokens, drawTextVectors};
