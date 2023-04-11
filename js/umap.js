import {drawUmap} from "./function.js";

d3.select("#umap-container")
    .append("div")
        .attr("id", "global-umap-container")
        .append("div")
            .attr("id", "global-umap-title")
            .text("Image Representations")
    
d3.select("#global-umap-container")
    .append("div")
    .attr("id", "global-umap-svg-container")
    .append("svg")
        .attr("id", "global-umap-svg");

d3.select("#global-umap-container")
    .append("div")
        .attr("id", "global-umap-expl")
        .text("Reduced to 2D by UMAP")

d3.select("#global-umap-container")
    .append("div")
    .attr("id", "global-umap-controller-container")

d3.select("#global-umap-controller-container")
    .append("div")
        .attr("id", "global-umap-controller-zoom-container")

d3.select("#global-umap-controller-zoom-container")
    .append("div")
        .attr("id", "global-umap-controller-zoom-in")
        .attr("class", "global-umap-controller-zoom-button")
        .text("+")
        .on("click", function() {
            let fixedPoint = {"x":135,"y":135};
            let origScale = +(d3.select("#global-umap-svg").style("scale"))
            let newScale = origScale * 1.25
            svgScale(fixedPoint, origScale, newScale);
        })

d3.select("#global-umap-controller-zoom-container")
    .append("div")
        .attr("id", "global-umap-controller-zoom-out")
        .attr("class", "global-umap-controller-zoom-button")
        .text("-")
        .on("click", function() {
            let fixedPoint = {"x":135,"y":135};
            let origScale = +(d3.select("#global-umap-svg").style("scale"))
            let newScale = origScale / 1.25
            svgScale(fixedPoint, origScale, newScale);
        })
        

d3.json("./assets/umap/global_umap_0.1_15_0.json").then(data => drawUmap(data));
