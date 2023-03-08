import {timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked} from "./function.js";

let controllerDiv = d3.select("#controller")
let controllerButtonsDiv = controllerDiv.append("div").attr("id", "controller-buttons")

let buttonBackgroundRadius = 12;
let buttonBackgroundColor = "#d0d0d0";
let buttonHeight = 16;

controllerButtonsDiv.append("div")
    .attr("id", "controller-button-backward-container")
    .attr("class", "controller-button-container")
    .append("svg")
        .attr("id", "controller-button-backward-background")
        .attr("class", "controller-button-background")
        .append("circle")
            .attr("id", "controller-button-backward-circle")
            .attr("class", "controller-button-circle")
            .attr("fill", buttonBackgroundColor)
            .attr("r", buttonBackgroundRadius)
            .attr("cx", buttonBackgroundRadius)
            .attr("cy", buttonBackgroundRadius)
            .on("mouseover", controllerButtonHovered)
            .on("mouseout", controllerButtonMouseout)
            .on("click", controllerButtonClicked)
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
        .style("left", `4.5px`)
        .style("top", `4.5px`)
        .append("circle")
            .attr("id", "controller-button-play-circle")
            .attr("class", "controller-button-circle")
            .attr("fill", buttonBackgroundColor)
            .attr("r", buttonBackgroundRadius*1.5)
            .attr("cx", buttonBackgroundRadius*1.5)
            .attr("cy", buttonBackgroundRadius*1.5)
            .on("mouseover", controllerButtonHovered)
            .on("mouseout", controllerButtonMouseout)
            .on("click", controllerButtonClicked)
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
            .attr("id", "controller-button-forward-circle")
            .attr("class", "controller-button-circle")
            .attr("fill", buttonBackgroundColor)
            .attr("r", buttonBackgroundRadius)
            .attr("cx", buttonBackgroundRadius)
            .attr("cy", buttonBackgroundRadius)
            .on("mouseover", controllerButtonHovered)
            .on("mouseout", controllerButtonMouseout)
            .on("click", controllerButtonClicked)
d3.select("#controller-button-forward-container")
    .append("img")
        .attr("class", "controller-button")
        .attr("src", "./icons/forward-step.svg")
        .attr("alt", "Forward Step SVG")
        .attr("height", `${buttonHeight}px`)

d3.selectAll(".controller-button-container")
    .style("height", `${buttonBackgroundRadius*2}px`)
    .style("width", `${buttonBackgroundRadius*2}px`)
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
        .attr("min", "1")
        .attr("max", "50")
        .attr("value", "30")
        .attr("id", "controller-timestep-slider")
        .on("input", timestepSliderFunction)
// controllerPlayButtonClicked();  // TODO: UNCOMMENT