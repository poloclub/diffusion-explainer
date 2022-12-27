function promptCompareClicked() {
    alert("function.js: promptcompareclicked() not implemented");
}

function timestepSliderFunction(){
    d3.select("#controller-timestep-number").text(this.value);
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
    console.log("function.js: should implement the actions for each button")
}

export {promptCompareClicked, timestepSliderFunction, controllerButtonHovered, controllerButtonMouseout, controllerButtonClicked};