function promptChanged() {
    let p = d3.select(`#${this.id}`).text()
    let i = this.id.split("-")[4]
    // change generated image and latent visualization
    window.selectedPrompt = p
    window.selectedPromptGroupIdx = +i
    window.selectedPrompt2 = window.prompts[window.selectedPromptGroupIdx][1];
    d3.select("#improved-latent-img").attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    d3.select("#generated-image").attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    d3.select("#improved-latent-img-2").attr("src", `./assets/latent_viz/${window.selectedPrompt2}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    d3.select("#generated-image-2").attr("src", `./assets/img/${window.selectedPrompt2}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    // collapse dropdown
    window.promptDropdownExpanded = false
    d3.select("#prompt-selector-dropdown").style("display", "none")
    // change text tokens
    d3.select("#prompt-selector-dropdown-box-text").text(p)
    d3.select("#prompt-box-2").text(window.selectedPrompt2)
    let h = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
    let h2 = +getComputedStyle(document.getElementById("prompt-box-2")).height.slice(0,-2)
    d3.select("#your-text-prompt").style("top", window.compare?"0px":`${38.5-h/2}px`)
    d3.select("#prompt-selector-dropdown-container").style("top", window.compare?`${136-h}px`:"0px")
    d3.select("#compare-button-container").style("top", window.compare?`${147+h2+20}px`:`${h-3}px`).style("z-index", "")
    d3.select("#prompt-box-2").style("top", window.compare?"146px":`0px`)
    // change dropdown's display
    d3.select("#prompt-selector-dropdown").selectAll("p").style("display", "block")
    d3.select(`#prompt-selector-dropdown-option-${i}`).style("display","none")
    // change tokens in text representation generator
    drawTokens();
    // drawTextVectors(); // TODO: Uncomment after computing the text vectors for the new prompts
    drawUmap()
    // d3.json("./assets/umap/global_umap_0.1_15_0.json").then(data => drawUmap(data))
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
    else if (this.id.includes("backward")) controllerPlayerBackwardButtonClicked();
    else if (this.id.includes("forward")) controllerPlayerForwardButtonClicked();
    else if (this.id.includes("repeat")) controllerPlayerRepeatButtonClicked();
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
    if (!window.promptHovered) {
        d3.select("#improved-latent-img").attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${timestep}.jpg`)
        d3.select("#generated-image").attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${timestep}.jpg`)
        d3.select("#improved-latent-img-2").attr("src", `./assets/latent_viz/${window.selectedPrompt2}/${window.seed}_${window.gs}_${timestep}.jpg`)
        d3.select("#generated-image-2").attr("src", `./assets/img/${window.selectedPrompt2}/${window.seed}_${window.gs}_${timestep}.jpg`)
    }
    else {
        d3.select("#improved-latent-img").attr("src", `./assets/latent_viz/${window.hoveredPrompt}/${window.seed}_${window.gs}_${timestep}.jpg`)
        d3.select("#generated-image").attr("src", `./assets/img/${window.hoveredPrompt}/${window.seed}_${window.gs}_${timestep}.jpg`)
    }

    // update UMAP Highlight
    let fullOpacity = 0.7
    let currentNode1X = d3.select(`#global-umap-node-1-${window.timestep}`).attr("cx")
    let currentNode1Y = d3.select(`#global-umap-node-1-${window.timestep}`).attr("cy")
    let currentNode2X = d3.select(`#global-umap-node-2-${window.timestep}`).attr("cx")
    let currentNode2Y = d3.select(`#global-umap-node-2-${window.timestep}`).attr("cy")
    d3.select("#global-umap-g-1").selectAll("circle").style("opacity", (d,i) => (i<=window.timestep)?fullOpacity:0)
    d3.select("#global-umap-g-2").selectAll("circle").style("opacity", (d,i) => (i<=window.timestep)?fullOpacity:0)
    d3.select("#global-umap-highlight-line-1").attr("x2", currentNode1X).attr("y2", currentNode1Y)
    d3.select("#global-umap-highlight-line-2").attr("x2", currentNode2X).attr("y2", currentNode2Y)
    d3.select("#umap-gradient-1").attr("x2", currentNode1X).attr("y2", currentNode1Y)
    d3.select("#umap-gradient-2").attr("x2", currentNode2X).attr("y2", currentNode2Y)

    // Latent denoiser l2 expl update
    d3.select("#denoise-latent-l2-expl-prev-latent-timestep").text(timestep-1)
    d3.select("#denoise-latent-l2-expl-prev-latent-text").text(`Representation of timestep ${window.timestep-1}`)
    d3.select("#improved-latent-timestep").text(timestep)
    if (!window.promptHovered) 
        d3.select("#denoise-latent-l2-expl-prev-latent-img").attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${timestep-1}.jpg`)
    else
        d3.select("#denoise-latent-l2-expl-prev-latent-img").attr("src", `./assets/latent_viz/${window.hoveredPrompt}/${window.seed}_${window.gs}_${timestep-1}.jpg`)
}

function controllerPauseButtonClicked() {
    d3.select("#controller-button-pause").style("display", "none");
    d3.select("#controller-button-play").style("display", "inline-block");

    if (window.playing) clearInterval(document.getElementById("controller").playingInterval);

    window.playing = false;
    d3.select("#latent-denoiser-cycle")
        .style("animation-play-state", "paused")
    d3.select("#latent-denoiser-cycle-2")
        .style("animation-play-state", "paused")
    d3.select("#denoise-latent-l2-expl-central-line-arrow")
        .style("animation-play-state", "paused")
}

function timestepSliderFunction(){
    controllerPauseButtonClicked();
    let timestep = +(this.value);
    updateStep(timestep);
}

function animateArchCycle() {
    d3.select("#latent-denoiser-cycle").style("animation-play-state", "")
    d3.select("#latent-denoiser-cycle-2").style("animation-play-state", "")
    d3.select("#denoise-latent-l2-expl-central-line-arrow")
        .style("animation-play-state", "")
}

function seedChanged(e) {
    // when seed is changed
    let newSeed = this.value
    hyperparamChanged(e, newSeed, window.gs);
    // TODO: change image galleries
}

function gsChanged(e) {
    // when guidance scale is changed
    let newGs = d3.select(this).property('value');
    hyperparamChanged(e, window.seed, newGs);
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
    
    // 2. change highlighted umap
    updateHighlightedUmapNodes(1)
    // TODO: Add updateHighlightedUmapNodes(2) after implementing comparison
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
    d3.select("#text-vector-generator-l2-vectors-vertical-dots-svg").append("circle").attr("r", "1.5").attr("cx","35").attr("cy", "10").attr("class", "text-dot")
    d3.select("#text-vector-generator-l2-vectors-vertical-dots-svg").append("circle").attr("r", "1.5").attr("cx","35").attr("cy", "17").attr("class", "text-dot")
    d3.select("#text-vector-generator-l2-vectors-vertical-dots-svg").append("circle").attr("r", "1.5").attr("cx","35").attr("cy", "24").attr("class", "text-dot")
    // TODO: Compute text vector and tokens for new prompts
    d3.json("./assets/json/text_vector.json")
        .then(function(d){
            for (let i = 0 ; i< tokenNum ; i++) {
                for (let j = 0 ; j< vectorDim ; j++) {
                    d3.select(`#text-vector-generator-l2-vector-cell-${i}-${j}`)
                        .text(Number(d[window.selectedPrompt][i][j]).toFixed(2))
                }
            }
        })
}

function drawUmap(p1,p2) {
    let data = window.umapData;
    if (!p1) {
        p1 = window.selectedPrompt
        p2 = window.selectedPrompt2
    }

    function convertCoordX (x) {return (0.05*svgWidth + (x-minX)/(maxX-minX)*svgWidth*0.95);}
    function convertCoordY (y) {return (svgHeight - (0.05*svgHeight + (y-minY)/(maxY-minY)*svgHeight*0.95) + 6.5);}
    d3.select("#global-umap-g-1").html("")
    d3.select("#global-umap-g-2").html("")

    let svgHeight = 150
    let svgWidth = 150
    let nodeRadius = 2;
    let minX=window.umapMinX, maxX = window.umapMaxX;
    let minY=window.umapMinY, maxY = window.umapMaxY;
    let fullOpacity = 0.7

    let data1 = data[p1][window.seed][window.gs];
    let data2 = data[p2][window.seed][window.gs];
    // TODO: Would need to change the color gradient to be more clear and smooth
    let selectedUmapColor1 = d3.scaleLinear().domain([-20,window.totalTimesteps+1]).range([window.umapNodeFadeColor,window.umapNodeHighlightColor1]);
    let selectedUmapColor2 = d3.scaleLinear().domain([-20,window.totalTimesteps+1]).range([window.umapNodeFadeColor,window.umapNodeHighlightColor2]);

    d3.select("#global-umap-g-1")
        .selectAll("circle")
        .data(data1)
        .enter()
        .append("circle")
            .attr("id", (d,i)=>`global-umap-node-1-${i}`)
            .attr("class", "umap-node")
            .attr("cx", d=>convertCoordX(d[0]))
            .attr("cy", d=>convertCoordY(d[1]))
            .attr("r", nodeRadius)
            .attr("fill", (d,i)=>selectedUmapColor1(i))
            .style("opacity", (d,i) => (i<=window.timestep)?fullOpacity:0)

    d3.select("#global-umap-g-2")
        .selectAll("circle")
        .data(data2)
        .enter()
        .append("circle")
            .attr("id", (d,i)=>`global-umap-node-2-${i}`)
            .attr("class", "umap-node")
            .attr("cx", d=>convertCoordX(d[0]))
            .attr("cy", d=>convertCoordY(d[1]))
            .attr("r", nodeRadius)
            .attr("fill", (d,i)=>selectedUmapColor2(i))
            .style("opacity", (d,i) => (i<=window.timestep)?fullOpacity:0)

    let currentNode1X = d3.select(`#global-umap-node-1-${window.timestep}`).attr("cx")
    let currentNode1Y = d3.select(`#global-umap-node-1-${window.timestep}`).attr("cy")
    let currentNode2X = d3.select(`#global-umap-node-2-${window.timestep}`).attr("cx")
    let currentNode2Y = d3.select(`#global-umap-node-2-${window.timestep}`).attr("cy")
    d3.select("#global-umap-highlight-line-1")
        .attr("x1", "75")
        .attr("y1", "0")
        .attr("x2", currentNode1X)
        .attr("y2", currentNode1Y)
        .style("stroke-width", "2px")
        // .style("stroke", window.umapNodeHighlightColor1)  // TODO: Change it to gradient
        .style("stroke", "url(\'#umap-gradient-1\')")  // TODO: Change it to gradient
    d3.select("#global-umap-highlight-line-2")
        .attr("x1", "75")
        .attr("y1", "165")
        .attr("x2", currentNode2X)
        .attr("y2", currentNode2Y)
        .style("stroke-width", "2px")
        // .style("stroke", window.umapNodeHighlightColor2)  // TODO: Change it to gradient
        .style("stroke", "url(\'#umap-gradient-2\')")  // TODO: Change it to gradient
    d3.select("#umap-gradient-1")
        .attr("x2", currentNode1X)
        .attr("y2", currentNode1Y)
    d3.select("#umap-gradient-2")
        .attr("x2", currentNode2X)
        .attr("y2", currentNode2Y)
}

function umapHighlightNodeHovered(e, promptNum) {
    let i = document.getElementById(e.target.id).idx;
    // let fullOpacity = window.comparison?0.7:1
    let fullOpacity = 1
    window.umapNodeHovered = true;

    let umapSvg = d3.select("#global-umap-svg")
    let umapScale = umapSvg.style("scale")
    let origTranslate = umapSvg.style("translate").split(" ")
    let origTranslateX = +(origTranslate[0].slice(0,-2));
    let origTranslateY;
    if (!origTranslate[1]) origTranslateY = +(origTranslate[0].slice(0,-2));
    else origTranslateY = +(origTranslate[1].slice(0,-2));
    let cursorX = +(d3.select(`#${e.target.id}`).style("cx").slice(0,-2));
    let cursorY = +(d3.select(`#${e.target.id}`).style("cy").slice(0,-2));
    console.log(cursorX, cursorY)

    d3.select(`#global-umap-node-highlight-${promptNum}-${i}`)
        .style("stroke", "black")
        .style("stroke-width", `${2/umapScale}px`)
    
    let umapHighlightG = d3.select(`#global-umap-highlight-g-${promptNum}`)
    umapHighlightG.append("text")
        .text(`Step ${i}`)
        .attr("id", `highlight-hovered-text-step-${i}`)
        .attr("x", cursorX+10/umapScale)
        .attr("y", cursorY+10/umapScale)
        .attr("font-size", `${13/umapScale}px`)
    umapHighlightG.append("use").attr("xlink:href", `#global-umap-node-highlight-${promptNum}-${i}`).attr("id", `use-global-umap-node-highlight-${promptNum}-${i}`).style("pointer-events", "none")

    for (let j=0 ; j <= i ; j++) {
        d3.select(`#global-umap-node-highlight-1-${j}`).style("opacity", fullOpacity)
        // TODO: After implementing comparison, do the same for 2nd prompt highlight
        // if (window.comparison) d3.select(`#global-umap-node-highlight-2-${j}`).style("opacity", fullOpacity)
    }
    for (let j = i+1 ; j < window.totalTimesteps+1 ; j++) {
        d3.select(`#global-umap-node-highlight-1-${j}`).style("opacity", 0)
        // TODO: After implementing comparison, do the same for 2nd prompt highlight
        // if (window.comparison) d3.select(`#global-umap-node-highlight-2-${j}`).style("opacity", 0)
    }

    d3.select("#generated-image").attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${i}.jpg`)
    // TODO: After implementing comparison, do the same for 2nd prompt highlight
    // d3.select("#generated-image-2").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt2}_${i}_${seed}_${gs}.jpg`)
}

function umapHighlightNodeMouseout (e, promptNum) {
    let i = document.getElementById(e.target.id).idx;
    // let fullOpacity = window.comparison?0.7:1
    let fullOpacity = 1
    window.umapNodeHovered = false;

    d3.select(`#global-umap-node-highlight-${promptNum}-${i}`).style("stroke", "").style("stroke-width", "")    
    d3.select(`#global-umap-highlight-g-${promptNum}`).select("text").remove(); 
    d3.select(`#use-global-umap-node-highlight-${promptNum}-${i}`).remove()
    
    for (let j=0 ; j <= window.timestep ; j++) {
        d3.select(`#global-umap-node-highlight-1-${j}`).style("opacity", fullOpacity)
        // TODO: After implementing comparison, do the same for 2nd prompt highlight
        // if (window.comparison) d3.select(`#global-umap-node-highlight-2-${j}`).style("opacity", fullOpacity)
    }
    for (let j=window.timestep+1 ; j < window.totalTimesteps+1 ; j++) {
        d3.select(`#global-umap-node-highlight-1-${j}`).style("opacity", 0)
        // TODO: After implementing comparison, do the same for 2nd prompt highlight
        // if (window.comparison) d3.select(`#global-umap-node-highlight-2-${j}`).style("opacity", 0)
    }
    
    // change the displayed image back
    d3.select("#generated-image").attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    // TODO: After implementing comparison, do the same for 2nd prompt highlight
    // d3.select("#generated-image-2").attr("src", `./assets/images/${selectedPromptGroupName}/scheduled/${window.selectedPrompt2}_${timestep}_${seed}_${gs}.jpg`)
}

function umapHighlightNodeClicked (e) {
    let newTimestep = Math.max(document.getElementById(e.target.id).idx, 1);
    window.timestep = newTimestep;
    if (window.playing) controllerPauseButtonClicked();
    updateStep(timestep)
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
    d3.select("#architecture-wrapper")
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
            .attr("x2", "55")
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
    d3.select("#architecture-wrapper")
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
            .style("top", `${35}px`)
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
    d3.interrupt(d3.select("#denoise-latent-l2-right-cover"))

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
    d3.select("#architecture-wrapper")
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
            .style("left", "514px")
    
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
            .attr("d", "M 0 10 L 40 10 C 50,10 50,10 60,10 L 172 10")
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
    d3.select("#denoise-latent-l2-right-cover")
        .style("display", "block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")

    // To bring arrow to the front
    // d3.select("#denoise-latent-l2-expl-text-vectors-arrow-svg")
    //     .transition()
    //     .delay(animationDuration*0.5)
    //     .duration(animationDuration*0.5)
    //         .style("opacity","100%")
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
    d3.select("#architecture-wrapper")
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
    d3.select("#architecture-wrapper")
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
    d3.select("#architecture-wrapper")
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

function compareButtonClicked () {
    if (this.checked) {
        onCompare()
    }
    else {
        offCompare()
    }
}

function onCompare () {
    window.compare = true;

    let animationDuration = 1000;

    // change the position of prompt boxes and compare-button-container
    // TODO: Change the position of guidance scale controller
    let h1 = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
    let h2 = +getComputedStyle(document.getElementById("prompt-box-2")).height.slice(0,-2)
    d3.select("#architecture-wrapper")
        .transition()
        .duration(animationDuration)
            .style("height", `430px`)
            .style("padding", `25px 40px 85px 40px`)
    d3.select("#your-text-prompt")
        .transition()
        .duration(animationDuration)
            .style("top", `0px`)
    d3.select("#prompt-selector-dropdown-container")
        .transition()
        .duration(animationDuration)
            .style("top", `${136-h1}px`)
    d3.select("#prompt-selector-dropdown-box-container")
        .transition()
        .duration(animationDuration)
            .style("background-color", "#fddbc7")
            .style("border-color", "#f4a582")
            .style("color", "#646464")
    d3.select("#prompt-box-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", `146px`)
    d3.select("#compare-button-container")
        .transition()
        .duration(animationDuration)
            .style("top", `${147+h2+20}px`)
    d3.select("#prompt-text-vector-generator-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", `110px`)
    d3.select("#prompt-text-vector-generator-svg-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", `42px`)
    d3.select("#text-vector-generator-container")
        .transition()
        .duration(animationDuration)
            .style("top", `101px`)
            .style("background-color", "#f4f4f4")
            .style("color", "#404040")
            .style("pointer-events", "none")
    d3.select("#text-vector-generator-latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("top", `110px`)
    d3.select("#text-vector-generator-latent-denoiser-svg-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", `42px`)
    d3.select("#timestep-0-random-noise-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", `299px`)
    d3.select("#improved-latent-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
    d3.select("#improved-latent-img")
        .transition()
        .duration(animationDuration)
            .style("left", `48px`)
    d3.select("#improved-latent-img-2")
        .transition()
        .duration(animationDuration)
            .style("left", `48px`)
            .style("top", `223.5px`)
    d3.select("#global-umap-svg-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
    d3.select("#improved-latent-generated-image-container")
        .transition()
        .duration(animationDuration)
            .style("left", `801px`)
    d3.select("#improved-latent-generated-image-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("left", `801px`)
            .style("top", "236px")
    d3.select("#generated-image-container")
        .transition()
        .duration(animationDuration)
            .style("left", `858px`)
    d3.select("#generated-image-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("left", `858px`)
    d3.select("#generated-image-2")
        .transition()
        .duration(animationDuration)
            .style("top", `173px`)

    // Change size of image representation refiner
    d3.select("#latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("height", "282px")
            .style("padding", "117.5px 0")
            .style("background-color", "#f4f4f4")
            .style("color", "#404040")
            .style("pointer-events", "none")

    // Change the cycle
    d3.select("#latent-denoiser-cycle-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", "236px")
    d3.select("#latent-denoiser-cycle")
        .transition()
        .duration(animationDuration)
            .attr("d", "M 230 10 l 91,0 l0 -53 a5,5 0 0 0 -5,-5 l-261,0 a5,5 0 0 0 -5,5 l0,34 a5,5 0 0 0 5,5 l20,0")
            .attr("stroke", "#f4a582")
    d3.select("#latent-denoiser-cycle-2")
        .transition()
        .duration(animationDuration/2)
            .attr("d", "M 230 10 l 91,0 l0 0 a5,5 0 0 0 -5,0 l-261,0 a5,5 0 0 0 -5,0 l0,0 a5,5 0 0 0 5,0 l20,0")
            .style("opacity", "0.5")
        .transition()
            .duration(0)
            .attr("d", "M 230 10 l 91,0 l0 0 a5,5 0 0 1 -5,0 l-261,0 a5,5 0 0 1 -5,0 l0,0 a5,5 0 0 1 5,0 l20,0")
        .transition()
        .duration(animationDuration/2)
            .attr("d", "M 230 10 l 91,0 l0 53 a5,5 0 0 1 -5,5 l-261,0 a5,5 0 0 1 -5,-5 l0,-34 a5,5 0 0 1 5,-5 l20,0")
            .style("opacity", "1")

    // Change the color theme
    d3.selectAll(".architecture-arrow-text")
        .transition()
        .duration(animationDuration)
            .style("stroke", "#f4a582")
    d3.selectAll(".architecture-arrow-img")
        .transition()
        .duration(animationDuration)
            .style("stroke", "#f4a582")
    d3.select("#architecture-arrow-text-head polygon")
        .transition()
        .duration(animationDuration)
            .attr("fill", "#f4a582")
    d3.select("#architecture-arrow-img-head polygon")
        .transition()
        .duration(animationDuration)
            .attr("fill", "#f4a582")
    d3.select("#prompt-selector-dropdown-box-arrow-g path")
        .transition()
        .duration(animationDuration)
            .style("stroke", "#d6604d")
    d3.select("#improved-latent-generated-image-text")
        .transition()
        .duration(animationDuration)
            .style("color", "#d6604d")
    d3.select("#timestep-0-random-noise-expl")
        .transition()
        .duration(animationDuration)
            .style("color", "#d6604d")
    d3.select("#timestep-0-random-noise-line")
        .transition()
        .duration(animationDuration)
            .attr("stroke", "#f4a582")
    d3.select("#text-vector-generator-latent-denoiser-text")
        .transition()
        .duration(animationDuration)
            .style("color", "#808080") 


    // Hide "refined representation" text
    d3.select("#improved-latent-expl-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("left", "48px")
}

function offCompare () {
    window.compare = false;
    let animationDuration = 1000;
    let h1 = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
    let h2 = +getComputedStyle(document.getElementById("prompt-box-2")).height.slice(0,-2)

    // Change position
    d3.select("#architecture-wrapper")
        .transition()
        .duration(animationDuration)
            .style("height", `270px`)
            .style("padding", `55px 40px 85px 40px`)
    d3.select("#your-text-prompt")
        .transition()
        .duration(animationDuration)
            .style("top", `${38.5-h1/2}px`)
    d3.select("#prompt-selector-dropdown-container")
        .transition()
        .duration(animationDuration)
            .style("top", `0px`)
    d3.select("#prompt-selector-dropdown-box-container")
        .transition()
        .duration(animationDuration)
            .style("background-color", "#f4f7ef")
            .style("border-color", "#7fbc41")
            .style("color", "#276419")
    d3.select("#prompt-box-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("top", `0px`)
    d3.select("#compare-button-container")
        .transition()
        .duration(animationDuration)
            .style("top", `${h1-3}px`)
    d3.select("#prompt-text-vector-generator-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", `30px`)
    d3.select("#prompt-text-vector-generator-svg-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("top", `${0}px`)
    d3.select("#text-vector-generator-container")
        .transition()
        .duration(animationDuration)
            .style("top", `0px`)
            .style("background-color", "#f4f7ef")
            .style("color", "#276419")
            .style("pointer-events", "")
    d3.select("#text-vector-generator-latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("top", `35px`)
    d3.select("#text-vector-generator-latent-denoiser-svg-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("top", `0px`)
    d3.select("#timestep-0-random-noise-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("top", `21px`)
    d3.select("#improved-latent-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
    d3.select("#improved-latent-img")
        .transition()
        .duration(animationDuration)
            .style("left", `0px`)
    d3.select("#improved-latent-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
    d3.select("#improved-latent-img-2")
        .transition()
        .duration(animationDuration)
            .style("left", `0px`)
            .style("top", "13.5px")
    d3.select("#global-umap-svg-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
    d3.select("#improved-latent-generated-image-container")
        .transition()
        .duration(animationDuration)
            .style("left", `753px`)
    d3.select("#improved-latent-generated-image-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("left", `753px`)
            .style("top", "30px")
    d3.select("#generated-image-container")
        .transition()
        .duration(animationDuration)
            .style("left", `810px`)
    d3.select("#generated-image-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("left", `810px`)
    d3.select("#generated-image-2")
        .transition()
        .duration(animationDuration)
            .style("top", `-37px`)

    d3.select("#latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("height", "80px")
            .style("padding", "11.5px 0")
            .style("background-color", "#fbf5f8")
            .style("color", "#8e0152")
            .style("pointer-events", "")

    // Change the cycle path
    d3.select("#latent-denoiser-cycle-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("top", "30px")
    d3.select("#latent-denoiser-cycle")
        .transition()
        .duration(animationDuration)
            .attr("d", "M 230 10 l 43,0 l0 -53 a5,5 0 0 0 -5,-5 l-213,0 a5,5 0 0 0 -5,5 l0,34 a5,5 0 0 0 5,5 l20,0")
            .attr("stroke", "#de77ae")
    d3.select("#latent-denoiser-cycle-2")
        .transition()
        .duration(animationDuration/2)
            .attr("d", "M 230 10 l 43,0 l0 0 a5,5 0 0 1 -5,0 l-213,0 a5,5 0 0 1 -5,0 l0,0 a5,5 0 0 1 5,0 l20,0")
            .style("opacity", "0.5")
        .transition()
        .duration(0)
            .attr("d", "M 230 10 l 43,0 l0 0 a5,5 0 0 0 -5,0 l-213,0 a5,5 0 0 0 -5,0 l0,0 a5,5 0 0 0 5,0 l20,0")
        .transition()
        .duration(animationDuration/2)
            .attr("d", "M 230 10 l 43,0 l0 -53 a5,5 0 0 0 -5,-5 l-213,0 a5,5 0 0 0 -5,5 l0,34 a5,5 0 0 0 5,5 l20,0")
            .style("opacity", "0")

    // Change the color theme
    d3.selectAll(".architecture-arrow-text")
        .transition()
        .duration(animationDuration)
            .style("stroke", "#7fbc41")
    d3.selectAll(".architecture-arrow-img")
        .transition()
        .duration(animationDuration)
            .style("stroke", "#de77ae")
    d3.select("#architecture-arrow-text-head polygon")
        .transition()
        .duration(animationDuration)
            .attr("fill", "#7fbc41")
    d3.select("#architecture-arrow-img-head polygon")
        .transition()
        .duration(animationDuration)
            .attr("fill", "#de77ae")
    d3.select("#prompt-selector-dropdown-box-arrow-g path")
        .transition()
        .duration(animationDuration)
            .style("stroke", "#7fbc41")
    d3.select("#improved-latent-generated-image-text")
        .transition()
        .duration(animationDuration)
            .style("color", "#c51b7d")
    d3.select("#timestep-0-random-noise-expl")
        .transition()
        .duration(animationDuration)
            .style("color", "#c51b7d") 
    d3.select("#timestep-0-random-noise-line")
        .transition()
        .duration(animationDuration)
            .attr("stroke", "#de77ae") 
    d3.select("#text-vector-generator-latent-denoiser-text")
        .transition()
        .duration(animationDuration)
            .style("color", "#4d9221") 

    // Hide "refined representation" text
    d3.select("#improved-latent-expl-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("left", "0px")
}

// export {promptSelectorImageclicked, promptCompareClicked, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updateStep, controllerPauseButtonClicked, seedChanged, gsChanged, drawUmap, updatePromptList, textVectorGeneratorClicked, reduceTextVectorGenerator, latentDenoiserClicked, reduceLatentDenoiser, expandLatentDenoiserL3,reduceLatentDenoiserL3, hyperparamChanged};
export {promptChanged, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updateStep, controllerPauseButtonClicked, seedChanged, gsChanged, drawUmap, expandTextVectorGeneratorL2, reduceTextVectorGeneratorL2, expandLatentDenoiserL2, reduceLatentDenoiserL2, expandLatentDenoiserL3,reduceLatentDenoiserL3, hyperparamChanged, drawTokens, drawTextVectors, compareButtonClicked};
