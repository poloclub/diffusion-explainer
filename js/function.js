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
    // console.log(this)
    // console.log("function.js: should implement the actions for each button")
}

function controllerPlayerBackwardButtonClicked() {
    let timestep = document.getElementById("controller").timestep - 1;
    document.getElementById("controller").timestep = timestep 
    d3.select("#controller-timestep-number").text(timestep);
    document.getElementById("controller-timestep-slider").value = timestep;

    d3.select("#generated-image")
        .attr("src", `./assets/images/scheduled/${selectedPrompt}_${timestep}_${seed}_${gs}.jpg`)

    // TODO: Backward umap 
}

function controllerPlayerForwardButtonClicked() {
    increaseStep();
}

function controllerPlayButtonClicked() {
    d3.select("#controller-button-pause")
        .style("display", "inline-block");
    d3.select("#controller-button-play")
        .style("display", "none");

    document.getElementById("controller").playing = true;
    document.getElementById("controller").playingInterval = setInterval(increaseStep, 100);

    // TODO: Play umap 
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

    // TODO: Umap Step
}

function controllerPauseButtonClicked() {
    console.log("pause button clicked")
    d3.select("#controller-button-pause")
        .style("display", "none");
    d3.select("#controller-button-play")
        .style("display", "inline-block");

    document.getElementById("controller").playing = false;
    clearInterval(document.getElementById("controller").playingInterval);
}

function timestepSliderFunction(){
    let timestep = this.value;
    d3.select("#controller-timestep-number").text(timestep);
    document.getElementById("controller").timestep = timestep;

    // change image
    // let selectedPromptIdx = window.selectedPromptIdx;
    d3.select("#generated-image")
        .attr("src", `./assets/images/scheduled/${selectedPrompt}_${timestep}_${seed}_${gs}.jpg`)

    // change umap
}


export {promptSelectorImageclicked, promptSelectorLeftScrollButtonClicked, promptSelectorRightScrollButtonClicked, promptCompareClicked, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked};