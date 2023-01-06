import {updateStep, controllerPauseButtonClicked, drawUmap} from "./function.js";

d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "latent-umap-title")
        .text("Latents over all timesteps")
        
d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "latent-umap-subtitle")
        .text("Latent is vector summarization of image")

let umapSvg = d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "umap-container")
        .append("svg")
            .attr("id", "umap-svg");

d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "latent-umap-reduced")
        .text("Reduced to 2D by UMAP")

d3.select("#latent-umap-container")
    .append("div")
        .attr("id", "latent-umap-expl")
        .text("Since the final generated image can be of high resolution, directly operating in that high-resolution space can be slow (e.g., 512 pixels by 512 pixels). So, instead, Stable Diffusion operates in the “latent” space, where a “latent” is the summarized representation of the image, and is much smaller (at 4 x 64 x 64).")

d3.json("./assets/json/data.json").then(data => drawUmap(data));
