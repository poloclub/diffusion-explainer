function promptChanged() {
    let p = d3.select(`#${this.id}`).text()
    let i = this.id.split("-")[4]
    // change generated image and latent visualization
    window.selectedPrompt = p
    window.selectedPromptGroupIdx = +i
    window.selectedPrompt2 = window.prompts[window.selectedPromptGroupIdx][1];
    window.selectedPromptHtmlCode = window.promptsHtmlCode[window.selectedPromptGroupIdx][0];
    window.selectedPromptHtmlCode2 = window.promptsHtmlCode[window.selectedPromptGroupIdx][1];
    d3.select("#improved-latent-img").attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    d3.select("#generated-image").attr("src", `./assets/img/${window.selectedPrompt}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    d3.select("#improved-latent-img-2").attr("src", `./assets/latent_viz/${window.selectedPrompt2}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    d3.select("#generated-image-2").attr("src", `./assets/img/${window.selectedPrompt2}/${window.seed}_${window.gs}_${window.timestep}.jpg`)
    // collapse dropdown
    window.promptDropdownExpanded = false
    d3.select("#prompt-selector-dropdown").style("display", "none")
    // change text tokens
    d3.select("#prompt-selector-dropdown-box-text").html(window.selectedPromptHtmlCode)
    if (window.compare) d3.selectAll("#prompt-selector-dropdown-box-container .prompt-keyword").style("color", "#b2182b").style("font-weight", "700")
    d3.select("#prompt-box-2").html(window.selectedPromptHtmlCode2)
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
    drawTextVectors(); 
    drawUmap();
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
    d3.select("#global-umap-g-1").selectAll("circle").style("opacity", (d,i) => (i<=window.timestep)?fullOpacity:0)
    d3.select("#global-umap-g-2").selectAll("circle").style("opacity", (d,i) => (i<=window.timestep)?fullOpacity:0)

    // Highlight lines
    let currentNode1X = +(d3.select(`#global-umap-node-1-${window.timestep}`).attr("cx"))
    let currentNode1Y = +(d3.select(`#global-umap-node-1-${window.timestep}`).attr("cy"))
    let currentNode2X = +(d3.select(`#global-umap-node-2-${window.timestep}`).attr("cx"))
    let currentNode2Y = +(d3.select(`#global-umap-node-2-${window.timestep}`).attr("cy"))
    let scale = +d3.select("#global-umap-svg").style("scale")
    let translate = d3.select("#global-umap-svg").style("translate").split(" ")
    let translateX = +(translate[0].slice(0,-2))
    let translateY = (translate[1])?+(translate[1].slice(0,-2)):translateX;
    let translated1X = (currentNode1X-75)*scale+translateX+75
    let translated1Y = (currentNode1Y-75)*scale+translateY+75
    let translated2X = (currentNode2X-75)*scale+translateX+75
    let translated2Y = (currentNode2Y-75)*scale+translateY+75

    d3.select("#global-umap-highlight-line-1").attr("x2", (translated1X)+1).attr("y2", (translated1Y)+7.5)
        .style("opacity", translated1X>=0&&translated1X<=150&&translated1Y>=0&&translated1Y<=150?1:0)
    d3.select("#global-umap-highlight-line-2").attr("x2", (translated2X)+1).attr("y2", (translated2Y)+7.5)
        .style("opacity", translated2X>=0&&translated2X<=150&&translated2Y>=0&&translated2Y<=150?1:0)
    d3.select("#umap-gradient-1").attr("x2", (translated1X)+1).attr("y2", (translated1Y)+7.5)
    d3.select("#umap-gradient-2").attr("x2", (translated2X)+1).attr("y2", (translated2Y)+7.5)

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
    setMinMaxCoord();
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
        0: "M0 0 l 0 -10 a10 10, 0 0 1, 10 -10 L142 -20 a10 10, 0 0 0, 10 -10 L152 -54", 
        1: "M20 0 l 0 -10 a10 10, 0 0 1, 10 -10 L142 -20 a10 10, 0 0 0, 10 -10 L152 -54", 
        7: "M100 0 l 0 -10 a10 10, 0 0 1, 10 -10 L142 -20 a10 10, 0 0 0, 10 -10 L152 -54", 
        20: "M250 0 l 0 -10 a10 10, 0 0 0, -10 -10 L162 -20 a10 10, 0 0 1, -10 -10 L152 -54", 
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
    let p2 = window.selectedPrompt2
    // 1. change the image
    d3.select("#improved-latent-img").attr("src", `./assets/latent_viz/${p}/${newSeed}_${newGs}_${timestep}.jpg`)
    d3.select("#denoise-latent-l2-expl-prev-latent-img").attr("src", `./assets/latent_viz/${p}/${newSeed}_${newGs}_${timestep-1}.jpg`)
    d3.select("#generated-image").attr("src", `./assets/img/${p}/${newSeed}_${newGs}_${timestep}.jpg`)
    d3.select("#improved-latent-img-2").attr("src", `./assets/latent_viz/${p2}/${newSeed}_${newGs}_${timestep}.jpg`)
    d3.select("#generated-image-2").attr("src", `./assets/img/${p2}/${newSeed}_${newGs}_${timestep}.jpg`)
    
    // 2. change umap
    drawUmap();
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

function setMinMaxCoord() {
    let seed = window.seed
    let data = window.umapData 

    let minX=10000000, maxX=-10000000, minY=10000000, maxY=-10000000;
    let min10X=10000000, max10X=-10000000, min10Y=10000000, max10Y=-10000000;
    for (let p in data) {
        for (let gs_i = 0 ; gs_i < window.gs_list.length; gs_i++) {
            let umap_array = data[p][seed][window.gs_list[gs_i]]
            for (let step = 0 ; step <= 50 ; step++) {
                let coord = umap_array[step]
                if (+(coord[0]) < minX) minX = +(coord[0]); 
                if (+(coord[0]) > maxX) maxX = +(coord[0])
                if (+(coord[1]) < minY) minY = +(coord[1])
                if (+(coord[1]) > maxY) maxY = +(coord[1])
            }
        }
    }
    for (let p in data) {
        let gs = window.gs
        let umap_array = data[p][seed][gs]
        for (let step = 0 ; step <= 50 ; step++) {
            let coord = umap_array[step]
            if (+(coord[0]) < min10X && step >= 10) min10X = +(coord[0])
            if (+(coord[0]) > max10X && step >= 10) max10X = +(coord[0])
            if (+(coord[1]) < min10Y && step >= 10) min10Y = +(coord[1])
            if (+(coord[1]) > max10Y && step >= 10) max10Y = +(coord[1])
        }
    }
    window.umapMinX = minX;
    window.umapMinY = minY;
    window.umapMaxX = maxX;
    window.umapMaxY = maxY;
    window.umapMin10X = min10X;
    window.umapMin10Y = min10Y;
    window.umapMax10X = max10X;
    window.umapMax10Y = max10Y;
}

function drawUmap(p1,p2) {
    let data = window.umapData;
    if (!p1) {
        p1 = window.selectedPrompt
        p2 = window.selectedPrompt2
    }
    function convertCoordX (x) {return (0.05*svgWidth + (x-window.umapMinX)/(window.umapMaxX-window.umapMinX)*svgWidth*0.90);}
    function convertCoordY (y) {return (svgHeight - (0.05*svgHeight + (y-window.umapMinY)/(window.umapMaxY-window.umapMinY)*svgHeight*0.90) + 6.5);}
    function svgScale(fixedPoint, origScale, newScale) {
        if (newScale < 0.5 || newScale >= 10) return;

        let origTranslate = d3.select("#global-umap-svg").style("translate").split(" ")
        let origTranslateX = +(origTranslate[0].slice(0,-2));
        let origTranslateY;
        if (!origTranslate[1]) origTranslateY = +(origTranslate[0].slice(0,-2));
        else origTranslateY = +(origTranslate[1].slice(0,-2));
        let newTranslateX = (1-newScale/origScale)*(fixedPoint.x-origTranslateX-75)+origTranslateX
        let newTranslateY = (1-newScale/origScale)*(fixedPoint.y-origTranslateY-75)+origTranslateY
        
        window.umapScale = newScale;
        window.umapTranslateX = newTranslateX;
        window.umapTranslateY = newTranslateY;
        
        d3.select("#global-umap-svg")
            .style("scale", newScale)
            .style("translate", `${newTranslateX}px ${newTranslateY}px`);
        d3.select("#global-umap-zoom-text").text(`${Math.floor(newScale*100)}%`)
        d3.select("#global-umap-g-1")
            .selectAll(".umap-node")
                .attr("r", 1.0*2/newScale)
        d3.select("#global-umap-g-2")
            .selectAll(".umap-node")
                .attr("r", 2/newScale)
        
        // Move the end point of the highlight line
        let currentNode1X = +(d3.select(`#global-umap-node-1-${window.timestep}`).attr("cx"))
        let currentNode1Y = +(d3.select(`#global-umap-node-1-${window.timestep}`).attr("cy"))
        let currentNode2X = +(d3.select(`#global-umap-node-2-${window.timestep}`).attr("cx"))
        let currentNode2Y = +(d3.select(`#global-umap-node-2-${window.timestep}`).attr("cy"))
        let translated1X = (currentNode1X-75)*newScale+newTranslateX+75
        let translated1Y = (currentNode1Y-75)*newScale+newTranslateY+75
        let translated2X = (currentNode2X-75)*newScale+newTranslateX+75
        let translated2Y = (currentNode2Y-75)*newScale+newTranslateY+75
        d3.select("#global-umap-highlight-line-1")
            .attr("x2", translated1X+1)
            .attr("y2", translated1Y+7.5)
            .style("opacity", translated1X>=1&&translated1X<=151&&translated1Y>=7.5&&translated1Y<=157.5?1:0)
        d3.select("#umap-gradient-1")
            .attr("x2", translated1X+1)
            .attr("y2", translated1Y+7.5)
        d3.select("#global-umap-highlight-line-2")
            .attr("x2", translated2X+1)
            .attr("y2", translated2Y+7.5)
            .style("opacity", translated2X>=1&&translated2X<=151&&translated2Y>=7.5&&translated2Y<=157.5?1:0)
        d3.select("#umap-gradient-2")
            .attr("x2", translated2X+1)
            .attr("y2", translated2Y+7.5)
    }
    function umapScrolled (e) {
        e.preventDefault();
        let scale = +d3.select("#global-umap-svg").style("scale")
        let delta = e.deltaY || e.deltaX;
        let nextScale = delta>0?scale-0.25:scale+0.25;
        let fixedPoint = {x: e.layerX, y:e.layerY};
        svgScale(fixedPoint, scale, nextScale);
    }
    function umapClicked(e) {
        let fixedPoint = {x: e.layerX, y:e.layerY};
        let currScale = +(d3.select("#global-umap-svg").style("scale"));
        let newScale = currScale + 0.25;
        svgScale(fixedPoint, currScale, newScale)
    }
    function umapDragStart(e) {
        document.getElementById("global-umap-svg").dragStartX = e.x;
        document.getElementById("global-umap-svg").dragStartY = e.y;
        let origTranslate = d3.select("#global-umap-svg").style("translate").split(" ")
        document.getElementById("global-umap-svg").origTranslateX = +(origTranslate[0].slice(0,-2));
        if (!origTranslate[1]) document.getElementById("global-umap-svg").origTranslateY = +(origTranslate[0].slice(0,-2));
        else document.getElementById("global-umap-svg").origTranslateY = +(origTranslate[1].slice(0,-2));
    }
    function umapDragged(e) {
        d3.select("#global-umap-svg").style("cursor", "grabbing")
        let deltaX = e.x - document.getElementById("global-umap-svg").dragStartX;
        let deltaY = e.y - document.getElementById("global-umap-svg").dragStartY;
        let origTranslateX = document.getElementById("global-umap-svg").origTranslateX;
        let origTranslateY = document.getElementById("global-umap-svg").origTranslateY;
        let newTranslateX = origTranslateX + deltaX;
        let newTranslateY = origTranslateY + deltaY;
        d3.select("#global-umap-svg").style("translate", `${newTranslateX}px ${newTranslateY}px`)
        window.umapTranslateX = newTranslateX;
        window.umapTranslateY = newTranslateY;

        // Move the end point of the highlight line
        let scale = +d3.select("#global-umap-svg").style("scale")
        let currentNode1X = +(d3.select(`#global-umap-node-1-${window.timestep}`).attr("cx"))
        let currentNode1Y = +(d3.select(`#global-umap-node-1-${window.timestep}`).attr("cy"))
        let currentNode2X = +(d3.select(`#global-umap-node-2-${window.timestep}`).attr("cx"))
        let currentNode2Y = +(d3.select(`#global-umap-node-2-${window.timestep}`).attr("cy"))
        let translated1X = (currentNode1X-75)*scale+newTranslateX+75
        let translated1Y = (currentNode1Y-75)*scale+newTranslateY+75
        let translated2X = (currentNode2X-75)*scale+newTranslateX+75
        let translated2Y = (currentNode2Y-75)*scale+newTranslateY+75
        d3.select("#global-umap-highlight-line-1")
            .attr("x2", translated1X+1)
            .attr("y2", translated1Y+7.5)
            .style("opacity", translated1X>=0&&translated1X<=150&&translated1Y>=0&&translated1Y<=150?1:0)
        d3.select("#umap-gradient-1")
            .attr("x2", translated1X+1)
            .attr("y2", translated1Y+7.5)
        d3.select("#global-umap-highlight-line-2")
            .attr("x2", translated2X+1)
            .attr("y2", translated2Y+7.5)
            .style("opacity", translated2X>=0&&translated2X<=150&&translated2Y>=0&&translated2Y<=150?1:0)
        d3.select("#umap-gradient-2")
            .attr("x2", translated2X+1)
            .attr("y2", translated2Y+7.5)
    }
    function umapDragEnd(e) {
        d3.select("#global-umap-svg").style("cursor", "zoom-in");
    }
    
    let drag = d3.drag()
        .on("start", umapDragStart)
        .on("drag", umapDragged)
        .on("end", umapDragEnd)
    d3.select("#global-umap-svg-container")
        .on("wheel", umapScrolled)
        .on("click", umapClicked)
        .call(drag)

    d3.select("#global-umap-zoom-in-button")
        .on("click", () => {
            let scale = +d3.select("#global-umap-svg").style("scale")
            let nextScale = scale+0.25;
            let fixedPoint = {x: svgWidth/2, y:svgHeight/2};
            svgScale(fixedPoint, scale, nextScale);
        })
    d3.select("#global-umap-zoom-out-button")
        .on("click", () => {
            let scale = +d3.select("#global-umap-svg").style("scale")
            let nextScale = scale-0.25;
            let fixedPoint = {x: svgWidth/2, y:svgHeight/2};
            svgScale(fixedPoint, scale, nextScale);
        })
    
    d3.select("#global-umap-g-1").html("")
    d3.select("#global-umap-g-2").html("")

    let svgHeight = 150
    let svgWidth = 150
    let fullOpacity = 0.7

    let data1 = data[p1][window.seed][window.gs];
    let data2 = data[p2][window.seed][window.gs];
    let colorBuffer = 30
    let selectedUmapColor1 = d3.scaleLinear().domain([-colorBuffer,window.totalTimesteps+1]).range(["#f7f7f7", "#d6604d"]);
    let selectedUmapColor2 = d3.scaleLinear().domain([-colorBuffer,window.totalTimesteps+1]).range(["#f7f7f7", "#4393c3"]);
    let scale = +(d3.select("#global-umap-svg").style("scale"))

    if (true || window.firstCompare) {
        // 1. Get the min/max value of coordX/coordY for step 10 to 50 for given prompts/seed/gs 
        let coordMin10X = convertCoordX(window.umapMin10X);
        let coordMax10X = convertCoordX(window.umapMax10X);
        let coordMin10Y = convertCoordY(window.umapMin10Y);
        let coordMax10Y = convertCoordY(window.umapMax10Y);

        // 2. get the center and scale (compare with 150 and max-min)
        let centerX = (coordMin10X+coordMax10X)/2;
        let centerY = (coordMin10Y+coordMax10Y)/2;
        scale = 150 / Math.max(coordMax10X-coordMin10X, coordMin10Y-coordMax10Y)
        scale = Math.floor(scale * 100 / 25)*25/100
        let translateX = (75-centerX) * scale 
        let translateY = (75-centerY) * scale 
        
        // 3. apply the translate (75-center) and scale
        d3.select("#global-umap-svg")
            .style("scale", scale)
            .style("translate", `${translateX}px ${translateY}px`);
        d3.select("#global-umap-zoom-text").text(`${Math.floor(scale*100)}%`)
    }

    let nodeRadius = 2/scale;

    d3.select("#global-umap-g-1")
        .selectAll("circle")
        .data(data1)
        .enter()
        .append("circle")
            .attr("id", (d,i)=>`global-umap-node-1-${i}`)
            .attr("class", "umap-node")
            .attr("cx", d=>convertCoordX(d[0]))
            .attr("cy", d=>convertCoordY(d[1]))
            .attr("r", nodeRadius*1.0)
            .attr("fill", (d,i)=>selectedUmapColor1(colorBuffer+i))
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
            .attr("fill", (d,i)=>selectedUmapColor2(colorBuffer+i))
            .style("opacity", (d,i) => (i<=window.timestep)?fullOpacity:0)

    let currentNode1X = d3.select(`#global-umap-node-1-${window.timestep}`).attr("cx")
    let currentNode1Y = d3.select(`#global-umap-node-1-${window.timestep}`).attr("cy")
    let currentNode2X = d3.select(`#global-umap-node-2-${window.timestep}`).attr("cx")
    let currentNode2Y = d3.select(`#global-umap-node-2-${window.timestep}`).attr("cy")
    let translate = d3.select("#global-umap-svg").style("translate").split(" ")
    let translateX = +(translate[0].slice(0,-2))
    let translateY = (translate[1])?+(translate[1].slice(0,-2)):translateX;
    let translated1X = (currentNode1X-75)*scale+translateX+75
    let translated1Y = (currentNode1Y-75)*scale+translateY+75
    let translated2X = (currentNode2X-75)*scale+translateX+75
    let translated2Y = (currentNode2Y-75)*scale+translateY+75

    d3.select("#global-umap-highlight-line-1")
        .attr("x1", "76")
        .attr("y1", "0")
        .attr("x2", (+translated1X)+1)
        .attr("y2", (+translated1Y)+7.5)
        .style("stroke-width", "2px")
        .style("stroke", "url(\'#umap-gradient-1\')")  
        .style("opacity", translated1X>=0&&translated1X<=150&&translated1Y>=0&&translated1Y<=150?1:0)
    d3.select("#global-umap-highlight-line-2")
        .attr("x1", "76")
        .attr("y1", "165")
        .attr("x2", (+translated2X)+1)
        .attr("y2", (+translated2Y)+7.5)
        .style("stroke-width", "2px")
        .style("stroke", "url(\'#umap-gradient-2\')")  
        .style("opacity", translated2X>=0&&translated2X<=150&&translated2Y>=0&&translated2Y<=150?1:0)
    d3.select("#umap-gradient-1")
        .attr("x2", (+translated1X)+1)
        .attr("y2", (+translated1Y)+7.5)
    d3.select("#umap-gradient-2")
        .attr("x2", (+translated2X)+1)
        .attr("y2", (+translated2Y)+7.5)
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
    d3.select("#text-vector-generator-l2-text-encoder-container")
        .style("pointer-events", "initial")
    
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
            .style("border-width", "0px")

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
            .style("top", `${38.5-ph/2}px`)
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
            .style("top", "87px")
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
            .style("left", "30px")
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
    d3.select("#text-vector-generator-l2-text-encoder-container")
        .style("pointer-events", "none")

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
            .style("border-width", "1px")
            
    // Change the height of main
    d3.select("#architecture-wrapper")
        .transition()
            .duration(animationDuration)
            .style("height", "270px")

    // Move things back
    let h = +getComputedStyle(document.getElementById("prompt-selector-dropdown-container")).height.slice(0,-2)
    d3.select("#your-text-prompt")
    .transition()
        .duration(animationDuration)
        .style("left", "0px")
        .style("top", `${38.5-h/2}px`)
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
            .style("left", "751px")
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
            .style("left", "7px")

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
    let latentDenoiserExpandedHeight = 230;
    let latentDenoiserGeneratorOrigWidth = 145;
    let textVectorGeneratorRectOrigWidth = 145
    let textVectorGeneratorRectOrigHeight = 80
    let animationDuration = 1000
    let movePx = (latentDenoiserExpandedWidth-latentDenoiserGeneratorOrigWidth)/2
    if (window.textVectorGeneratorL2Expanded) reduceTextVectorGeneratorL2();
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
            .style("border-width", "0px")
    
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
            .style("top", `${119.5-ph/2}px`)
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
            .style("left", "20px")
    d3.select("#improved-latent-expl-container")
        .transition()
        .duration(animationDuration)
            .style("font-size", "12px")
            
    d3.select("#guidance-scale-control-container")
        .style("display", "block")
        .transition()
            .duration(animationDuration)
            .style("opacity", "100%")
            .style("top", "154px")
            .style("left", "516px")
    d3.select("#guidance-scale-control-text")
        .transition()
            .duration(animationDuration)
            .style("color", "#4d9221")
    
    // Covers
    d3.select("#denoise-latent-l2-left-cover")
        .style("display", "block")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
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
            .style("border-width", "1px")

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
            .style("top", `${38.5-ph/2}px`)
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
            .style("left", "7px")
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
    d3.select("#guidance-scale-control-text")
        .transition()
            .duration(animationDuration)
            .style("color", "#808080")
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
            .style("height", "383px")
    
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
            .style("height", "230px")
    
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
    if (window.firstCompare){window.firstCompare = false;}
    if (window.textVectorGeneratorL3Expanded || window.textVectorGeneratorL2Expanded) reduceTextVectorGeneratorL2();
    if (window.latentDenoiserL2Expanded || window.latentDenoiserL3Expanded) reduceLatentDenoiserL2(); 

    let animationDuration = 1000;

    // add interrupt to the components that are additionally displayed during "onCompare"
    d3.interrupt(d3.select("#prompt-box-2"))
    d3.interrupt(d3.select("#prompt-text-vector-generator-svg-2"))
    d3.interrupt(d3.select("#text-vector-generator-latent-denoiser-svg-2"))
    d3.interrupt(d3.select("#timestep-0-random-noise-container-2"))
    d3.interrupt(d3.select("#improved-latent-container-2"))
    d3.interrupt(d3.select("#improved-latent-img-2"))
    d3.interrupt(d3.select("#global-umap-svg-container"))
    d3.interrupt(d3.select("#global-umap-zoom-button-container"))
    d3.interrupt(d3.select("#global-umap-unscaled-svg-container"))
    d3.interrupt(d3.select("#improved-latent-generated-image-container-2"))
    d3.interrupt(d3.select("#generated-image-container-2"))

    // change display from none to block/inline-block
    d3.select("#prompt-box-2").style("display", "block")
    d3.select("#prompt-text-vector-generator-svg-2").style("display", "block")
    d3.select("#text-vector-generator-latent-denoiser-svg-2").style("display", "block")
    d3.select("#timestep-0-random-noise-container-2").style("display", "block")
    d3.select("#improved-latent-container-2").style("display", "block")
    d3.select("#improved-latent-img-2").style("display", "block")
    d3.select("#global-umap-svg-container").style("display", "block")
    d3.select("#global-umap-zoom-button-container").style("display", "block")
    d3.select("#global-umap-unscaled-svg-container").style("display", "block")
    d3.select("#improved-latent-generated-image-container-2").style("display", "block")
    d3.select("#generated-image-container-2").style("display", "block")

    // change the position of prompt boxes and compare-button-container
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
            .style("left", `0px`)
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
    d3.selectAll("#prompt-selector-dropdown-box-container .prompt-keyword")
        .transition()
        .duration(animationDuration)
            .style("color", "#b2182b")
            .style("font-weight", "700")
    d3.selectAll(".prompt-selector-dropdown-options .prompt-keyword")
        .transition()
        .duration(animationDuration)
            .style("font-weight", "700")
            
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
            .style("left", "250px")
    d3.select("#prompt-text-vector-generator-svg-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", `42px`)
    d3.select("#text-vector-generator-container")
        .transition()
        .duration(animationDuration)
            .style("top", `101px`)
            .style("left", "290px")
            .style("background-color", "#f4f4f4")
            .style("color", "#404040")
            .style("pointer-events", "none")
            .style("border-width", "0px")
            .style("width", `${145}px`)
            .style("height", `${80}px`)
            .style("padding", "11.5px 0")
    d3.select("#text-vector-generator-latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("left", "437px")
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
    d3.select("#global-umap-zoom-button-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
    d3.select("#global-umap-unscaled-svg-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")        
    d3.select("#improved-latent-generated-image-container")
        .transition()
        .duration(animationDuration)
            .style("left", `798px`)
    d3.select("#improved-latent-generated-image-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("left", `798px`)
            .style("top", "236px")
    d3.select("#generated-image-container")
        .transition()
        .duration(animationDuration)
            .style("left", `880px`)
    d3.select("#generated-image-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("left", `880px`)
    d3.select("#generated-image-2")
        .transition()
        .duration(animationDuration)
            .style("top", `173px`)
    d3.select("#controller")
        .transition()
        .duration(animationDuration)
            .style("left", `531px`)
            .style("top", `40px`)
    d3.select("#guidance-scale-control-container")
        .transition()
        .duration(animationDuration)
            .style("top", `178px`)
            .style("left", `${546}px`)
            .style("opacity", window.gsControlDisplayed?"1":"0")
        .transition()
            .style("display", window.gsControlDisplayed?"block":"none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    if (window.gsControlDisplayed)
        d3.select("#guidance-scale-expl-container")
            .transition()
            .duration(0)
                .style("text-align", "right")
                .style("display", "block")
            .transition()
            .duration(animationDuration)
                .style("left", `152px`)
                .style("top", `191px`)
                .style("opacity", "1")
    else
        d3.select("#guidance-scale-expl-container")
            .transition()
            .duration(0)
                .style("text-align", "right")
            .transition()
            .duration(animationDuration)
                .style("left", `152px`)
                .style("top", `191px`)
    d3.select("#guidance-scale-expl-container svg")
        .transition()
        .duration(animationDuration)
            .style("transform", `translate(-43px, -31px) rotate(43deg)`)

    // Change size of image representation refiner
    d3.select("#latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("left", "542px")
            .style("width", "145px")
            .style("height", "282px")
            .style("padding", "117.5px 0")
            .style("top", "0px")
            .style("background-color", "#f4f4f4")
            .style("color", "#404040")
            .style("pointer-events", "none")
            .style("border-width", "0px")

    // Change the cycle
    d3.select("#latent-denoiser-cycle-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("top", "236px")
    d3.select("#latent-denoiser-cycle")
        .transition()
        .duration(animationDuration)
            .attr("d", "M 230 10 l 86,0 l0 -53 a5,5 0 0 0 -5,-5 l-256,0 a5,5 0 0 0 -5,5 l0,48 a5,5 0 0 0 5,5 l20,0")
            .attr("stroke", "#f4a582")
    d3.select("#latent-denoiser-cycle-2")
        .transition()
        .duration(animationDuration/2)
            .attr("d", "M 230 10 l 86,0 l0 0 a5,5 0 0 0 -5,0 l-256,0 a5,5 0 0 0 -5,0 l0,0 a5,5 0 0 0 5,0 l20,0")
            .style("opacity", "0.5")
        .transition()
            .duration(0)
            .attr("d", "M 230 10 l 86,0 l0 0 a5,5 0 0 1 -5,0 l-256,0 a5,5 0 0 1 -5,0 l0,0 a5,5 0 0 1 5,0 l20,0")
        .transition()
        .duration(animationDuration/2)
            .attr("d", "M 230 10 l 86,0 l0 53 a5,5 0 0 1 -5,5 l-256,0 a5,5 0 0 1 -5,-5 l0,-48 a5,5 0 0 1 5,-5 l20,0")
            .style("opacity", "1")
    d3.select("#improved-latent-generated-image-arrow")
        .transition()
        .duration(animationDuration)
            .attr("x2", "70")
            .style("stroke", "#f4a582")
    d3.select("#improved-latent-generated-image-arrow-2")
        .transition()
        .duration(animationDuration)
            .attr("x2", "70")

    // Change the color theme
    d3.selectAll("#text-vector-generator-latent-denoiser-arrow")
        .transition()
        .duration(animationDuration)
            .attr("d", "M 0 10 L 30 10 C 42,10 55,10 67,10 L 95 10")
            .style("stroke", "#f4a582")
    d3.selectAll("#prompt-text-vector-generator-arrow")
        .transition()
        .duration(animationDuration)
            .style("stroke", "#f4a582")
            .attr("x2", "30")
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
            .style("left", "10px")
    d3.select("#timestep-0-random-noise-expl")
        .transition()
        .duration(animationDuration)
            .style("color", "#d6604d")
    d3.select("#timestep-0-random-noise-expl-1-1")
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
            .style("left", "7px")
    d3.select("#guidance-scale-expl-container-2-2")
        .transition()
        .duration(animationDuration)
            .style("color", "#646464") 
    d3.select("#guidance-scale-expl-container-1-2")
        .transition()
        .duration(animationDuration)
            .style("color", "#646464") 


    // Hide "refined representation" text
    d3.select("#improved-latent-expl-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("left", "48px")
            .style("font-size", "13px")
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
    d3.selectAll("#prompt-selector-dropdown-box-container .prompt-keyword")
        .transition()
        .duration(animationDuration)
            .style("font-weight", "400")
            .style("color", "#276419")
    d3.selectAll(".prompt-selector-dropdown-options .prompt-keyword")
        .transition()
        .duration(animationDuration)
            .style("font-weight", "400")
    d3.select("#prompt-box-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("top", `0px`)
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
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
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#text-vector-generator-container")
        .transition()
        .duration(animationDuration)
            .style("top", `0px`)
            .style("background-color", "#f4f7ef")
            .style("color", "#276419")
            .style("pointer-events", "")
            .style("border-width", "1px")
    d3.select("#text-vector-generator-latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("top", `35px`)
    d3.select("#text-vector-generator-latent-denoiser-svg-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("top", `0px`)
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#timestep-0-random-noise-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("top", `21px`)
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#improved-latent-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
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
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#global-umap-svg-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#global-umap-unscaled-svg-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#global-umap-zoom-button-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#improved-latent-generated-image-container")
        .transition()
        .duration(animationDuration)
            .style("left", `751px`)
    d3.select("#improved-latent-generated-image-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("left", `751px`)
            .style("top", "30px")
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#generated-image-container")
        .transition()
        .duration(animationDuration)
            .style("left", `810px`)
    d3.select("#generated-image-container-2")
        .transition()
        .duration(animationDuration)
            .style("opacity", "0")
            .style("left", `810px`)
        .transition()
            .style("display", "none")
        .on("interrupt", function() {
            d3.select(this).style("display", "block")
        })
    d3.select("#generated-image-2")
        .transition()
        .duration(animationDuration)
            .style("top", `-37px`)
    d3.select("#controller")
        .transition()
        .duration(animationDuration)
            .style("left", `514px`)
    d3.select("#guidance-scale-control-container")
        .transition()
        .duration(animationDuration)
            .style("top", `87px`)
    d3.select("#guidance-scale-expl-container")
        .transition()
        .duration(0)
            .style("text-align", "center")
        .transition()
        .duration(animationDuration)
            .style("left", `347px`)
            .style("top", `107px`)
    d3.select("#guidance-scale-expl-container svg")
        .transition()
        .duration(animationDuration)
            .style("transform", "translate(-40px, -32px) rotate(25deg)")

    d3.select("#latent-denoiser-container")
        .transition()
        .duration(animationDuration)
            .style("height", "80px")
            .style("padding", "11.5px 0")
            .style("background-color", "#fbf5f8")
            .style("color", "#8e0152")
            .style("pointer-events", "")
            .style("border-width", "1px")

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

    d3.select("#improved-latent-generated-image-arrow")
        .transition()
        .duration(animationDuration)
            .attr("x2", "48")
            .style("stroke", "#de77ae")
    d3.select("#improved-latent-generated-image-arrow-2")
        .transition()
        .duration(animationDuration)
            .attr("x2", "48")

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
            .style("left", "0px")
    d3.select("#timestep-0-random-noise-expl")
        .transition()
        .duration(animationDuration)
            .style("color", "#c51b7d") 
    d3.select("#timestep-0-random-noise-expl-1-1")
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
    d3.select("#guidance-scale-expl-container-2-2")
        .transition()
        .duration(animationDuration)
            .style("color", "#7fbc41") 
    d3.select("#guidance-scale-expl-container-1-2")
        .transition()
        .duration(animationDuration)
            .style("color", "#c51b7d") 

    // Hide "refined representation" text
    d3.select("#improved-latent-expl-container")
        .transition()
        .duration(animationDuration)
            .style("opacity", "1")
            .style("left", "0px")
}

export {promptChanged, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updateStep, controllerPauseButtonClicked, seedChanged, gsChanged, drawUmap, expandTextVectorGeneratorL2, reduceTextVectorGeneratorL2, expandLatentDenoiserL2, reduceLatentDenoiserL2, expandLatentDenoiserL3,reduceLatentDenoiserL3, hyperparamChanged, drawTokens, drawTextVectors, compareButtonClicked, setMinMaxCoord};
