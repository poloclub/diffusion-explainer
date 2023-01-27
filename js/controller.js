import {promptSelectorImageclicked, promptSelectorLeftScrollButtonClicked, promptSelectorRightScrollButtonClicked, promptCompareClicked, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked, controllerPlayButtonClicked, updatePromptList} from "./function.js";

let selectorDiv = d3.select("#prompt-selector")
selectorDiv.append("div")
    .text("What text prompt do you want to use?")
    .attr("id", "prompt-selector-text")

let selectorImagesDiv = selectorDiv.append("div").attr("id", "prompt-selector-images-container")
document.getElementById("prompt-selector-images-container").leftmostImageIdx = 0;
document.getElementById("prompt-selector-images-container").imagePerScreen = 4;
window.selectedPromptGroupIdx = 0;
window.seed = 0;
window.gs = "7.0";
window.comparison = false;

d3.json("./assets/json/data.json").then(
    function (data) {
        window.selectedPromptGroupName = Object.keys(data)[selectedPromptGroupIdx]
        document.getElementById("prompt-selector-images-container").lastImageIdx = Object.keys(data).length-1;
        Object.entries(data).forEach((d, i) => {
            let promptGroupName = d[0];
            let promptGroupData = d[1];

            selectorImagesDiv.append("div")
                .attr("class", "prompt-selector-image-container prompt-selector-image-container-unselected")
                .attr("id", `prompt-selector-image-container-${i}`)
                .on("click", promptSelectorImageclicked)
                .append("img")
                    .attr("class", "prompt-selector-image prompt-selector-image-unselected")
                    .attr("id", `prompt-selector-image-${i}`)
                    .attr("src", `./assets/images/${promptGroupName}/${promptGroupData["thumbnail"]}`)
                    .attr("height", `60px`)

            document.getElementById(`prompt-selector-image-container-${i}`).promptGroupIdx = i;
            document.getElementById(`prompt-selector-image-container-${i}`).selected = false;

            if (i == window.selectedPromptGroupIdx) {
                document.getElementById(`prompt-selector-image-container-${i}`).selected = true;
                d3.select(`#prompt-selector-image-${i}`).attr("class", "prompt-selector-image prompt-selector-image-selected")
                d3.select(`#prompt-selector-image-container-${i}`).attr("class", "prompt-selector-image-container prompt-selector-image-container-selected")
            }
        });
        selectorImagesDiv.append("div")
            .attr("class", "prompt-selector-images-container-cover")
            .attr("id", "prompt-selector-images-container-cover-left")
            .append("div")
                .attr("class", "prompt-selector-images-container-scroll-container")
                .attr("id", "prompt-selector-images-container-left-scroll-container")
                .on("click", promptSelectorLeftScrollButtonClicked)
                .append("img")
                    .attr("class", "prompt-selector-scroll-button")
                    .attr("id", "prompt-selector-left-scroll-button")
                    .attr("src", "./icons/left.svg")
        selectorImagesDiv.append("div")
            .attr("class", "prompt-selector-images-container-cover")
            .attr("id", "prompt-selector-images-container-cover-right")
            .append("div")
                .attr("class", "prompt-selector-images-container-scroll-container")
                .attr("id", "prompt-selector-images-container-right-scroll-container")
                .on("click", promptSelectorRightScrollButtonClicked)
                .append("img")
                    .attr("class", "prompt-selector-scroll-button")
                    .attr("id", "prompt-selector-right-scroll-button")
                    .attr("src", "./icons/right.svg")

        let selectedData = data[window.selectedPromptGroupName];
        selectorDiv.append("div")
            .attr("id", "prompt-1-container")
            .attr("class", "prompt-select")

                
        selectorDiv.append("div")
            .attr("id", "prompt-2-container")
            .attr("class", "prompt-select")
        window.selectedPrompts = selectedData["prompts"];
        window.selectedPrompt1 = selectedData["prompts"][0];
        window.selectedPrompt2 = selectedData["prompts"][1];
        updatePromptList(selectedData["prompts"])

        let r = 7.5;
        let promptCompareDiv = selectorDiv.append("div")
            .attr("id", "prompt-compare")
        let promptCompareMinusButtonDiv = promptCompareDiv.append("div")
            .attr("id", "prompt-compare-minus-button")
            .style("height", `${2*r}px`)
            .style("width", `${2*r}px`)
        let promptCompareAddButtonDiv = promptCompareDiv.append("div")
            .attr("id", "prompt-compare-add-button")
            .style("height", `${2*r}px`)
            .style("width", `${2*r}px`)
            .on("click", promptCompareClicked);
        promptCompareMinusButtonDiv.append("svg")
            .attr("id", "prompt-compare-minus-button-circle")
            .attr("height", 2*r)
            .attr("width", 2*r)
            .append("circle")
                .attr("cx", r)
                .attr("cy", r)
                .attr("r", r)
                .attr("fill", "#646464")
        promptCompareMinusButtonDiv.append("div")
            .text("-")
            .attr("id", "prompt-compare-minus-button-minus")
            .style("left", `${r*0.55}px`)
            .style("top", `${-r*0.95}px`)
        promptCompareAddButtonDiv.append("svg")
            .attr("id", "prompt-compare-add-button-circle")
            .attr("height", 2*r)
            .attr("width", 2*r)
            .append("circle")
                .attr("cx", r)
                .attr("cy", r)
                .attr("r", r)
                .attr("fill", "#646464")
        promptCompareAddButtonDiv.append("div")
            .text("+")
            .attr("id", "prompt-compare-add-button-plus")
            .style("left", `${r/2}px`)
        promptCompareDiv.append("div")
            .attr("id", "prompt-compare-text")
            .text("Compare with other text prompts")
    });

let controllerDiv = d3.select("#controller")
document.getElementById("controller").timestep = 30;
document.getElementById("controller").playing = true;  // TODO: change to true (auto-play)

let controllerButtonsDiv = controllerDiv.append("div")
    .attr("id", "controller-buttons")
let buttonBackgroundRadius = 19;
let buttonBackgroundColor = "#646464";
let buttonHeight = 24;
controllerButtonsDiv.append("div")
    .attr("id", "controller-button-backward-container")
    .attr("class", "controller-button-container")
    .append("svg")
        .attr("id", "controller-button-backward-background")
        .attr("class", "controller-button-background")
        .append("circle")
            .attr("fill", buttonBackgroundColor)
            .attr("r", buttonBackgroundRadius)
            .attr("cx", buttonBackgroundRadius)
            .attr("cy", buttonBackgroundRadius)
d3.select("#controller-button-backward-container")
    .append("img")
        .attr("class", "controller-button")
        .attr("src", "./icons/backward-step.svg")
        .attr("alt", "Backward Step SVG")
        .attr("height", `${buttonHeight}px`)

controllerButtonsDiv.append("div")
    .attr("id", "controller-button-play-container")
    .attr("class", "controller-button-container")
    .append("svg")
        .attr("id", "controller-button-play-background")
        .attr("class", "controller-button-background")
        .append("circle")
            .attr("fill", buttonBackgroundColor)
            .attr("r", buttonBackgroundRadius*2)
            .attr("cx", buttonBackgroundRadius*2)
            .attr("cy", buttonBackgroundRadius*2)
d3.select("#controller-button-play-container")
    .append("img")
        .attr("class", "controller-button")
        .attr("id", "controller-button-play")
        .attr("src", "./icons/play.svg")
        .attr("alt", "Play SVG")
        .attr("height", `${buttonHeight}px`)
d3.select("#controller-button-play-container")
    .append("img")
        .attr("class", "controller-button")
        .attr("id", "controller-button-pause")
        .attr("src", "./icons/pause.svg")
        .attr("alt", "Pause SVG")
        .attr("height", `${buttonHeight}px`)
    
controllerButtonsDiv.append("div")
    .attr("id", "controller-button-forward-container")
    .attr("class", "controller-button-container")
    .append("svg")
        .attr("id", "controller-button-forward-background")
        .attr("class", "controller-button-background")
        .append("circle")
            .attr("fill", buttonBackgroundColor)
            .attr("r", buttonBackgroundRadius)
            .attr("cx", buttonBackgroundRadius)
            .attr("cy", buttonBackgroundRadius)
d3.select("#controller-button-forward-container")
    .append("img")
        .attr("class", "controller-button")
        .attr("src", "./icons/forward-step.svg")
        .attr("alt", "Forward Step SVG")
        .attr("height", `${buttonHeight}px`)

controllerButtonsDiv.append("div")
    .attr("id", "controller-button-repeat-container")
    .attr("class", "controller-button-container")
    .append("svg")
        .attr("id", "controller-button-forward-background")
        .attr("class", "controller-button-background")
        .append("circle")
            .attr("fill", buttonBackgroundColor)
            .attr("r", buttonBackgroundRadius)
            .attr("cx", buttonBackgroundRadius)
            .attr("cy", buttonBackgroundRadius)
d3.select("#controller-button-repeat-container")
    .append("img")
        .attr("class", "controller-button")
        .attr("src", "./icons/replay.svg")
        .attr("alt", "Replay SVG")
        .attr("height", `${buttonHeight}px`)

d3.selectAll(".controller-button-container")
    .style("height", `${buttonBackgroundRadius*2}px`)
    .style("width", `${buttonBackgroundRadius*2}px`)
    .on("mouseover", controllerButtonHovered)
    .on("mouseout", controllerButtonMouseout)
    .on("click", controllerButtonClicked)
d3.selectAll(".controller-button-background")
    .style("height", `${buttonBackgroundRadius*2}px`)
    .style("width", `${buttonBackgroundRadius*2}px`)
d3.selectAll(".controller-button")
    .style("width", `${buttonBackgroundRadius*2}px`)
d3.select(".controller-button-container#controller-button-play-container")
    .style("height", `${buttonBackgroundRadius*4}px`)
    .style("width", `${buttonBackgroundRadius*4}px`)
d3.select(".controller-button-background#controller-button-play-background")
    .style("height", `${buttonBackgroundRadius*4}px`)
    .style("width", `${buttonBackgroundRadius*4}px`)
d3.select(".controller-button#controller-button-play")
    .style("width", `${buttonBackgroundRadius*4}px`)

let controllerTimestepDiv = controllerDiv.append("div")
    .attr("id", "controller-timestep")
controllerTimestepDiv.append("div")
    .attr("id", "controller-timestep-text")
    .text("Timestep")
controllerTimestepDiv.append("div")
    .attr("id", "controller-timestep-number")
    .text("30")
controllerTimestepDiv.append("div")
    .attr("id", "controller-timestep-slider-container")
    .append("input")
        .attr("type", "range")
        .attr("min", "0")
        .attr("max", "50")
        .attr("value", "30")
        .attr("id", "controller-timestep-slider")
        .on("input", timestepSliderFunction)

// controllerPlayButtonClicked();  // TODO: UNCOMMENT