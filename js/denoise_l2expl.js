import {reduceLatentDenoiserL2,expandLatentDenoiserL3} from "./function.js"

document.addEventListener("keydown", (e) => {
    if (window.latentDenoiserL2Expanded && !window.latentDenoiserL3Expanded && e.key == "Escape") reduceLatentDenoiserL2();
})

document.addEventListener("mouseup", (e) => {
    if (window.latentDenoiserL2Expanded && !window.latentDenoiserL3Expanded) {
        let latentDenoiserBox = document.getElementById("latent-denoiser-container").getBoundingClientRect()
        let left = latentDenoiserBox.x
        let right = latentDenoiserBox.x + latentDenoiserBox.width
        let top = latentDenoiserBox.y
        let bottom = latentDenoiserBox.y + latentDenoiserBox.height
        if (e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {}
        else reduceLatentDenoiserL2();
    }
})

// reduce button
d3.select("#architecture-container")
    .append("div")
    .attr("id", "latent-denoiser-l2-expl-container")
        .append("img")
        .attr("id", "denoise-latent-l2-expl-reduce-button")
        .attr("src", "./icons/reduce.svg")
        .attr("alt", "Reduce SVG")
        .attr("height", `20px`)
        .on("click", reduceLatentDenoiserL2)

// TODO: ADD latent images after loading d3.json data
d3.select("#latent-denoiser-l2-expl-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-prev-latent-container")
        .append("div")
            .attr("id", "denoise-latent-l2-expl-prev-latent-image-container")
            .on("mouseover", () => d3.select("#denoise-latent-l2-expl-central-line-timestep-expl-text").style("display", "block"))
            .on("mouseout", () => d3.select("#denoise-latent-l2-expl-central-line-timestep-expl-text").style("display", "none"))
            .append("img")
                .attr("id", "denoise-latent-l2-expl-prev-latent-img")
                .attr("src", `./assets/latent_viz/${window.selectedPrompt}/${window.seed}_${window.gs}_${timestep-1}.jpg`)
d3.select("#denoise-latent-l2-expl-prev-latent-image-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-prev-latent-timestep")
        .text(window.timestep-1)
d3.select("#denoise-latent-l2-expl-prev-latent-container")
        .append("div")
            .attr("id", "denoise-latent-l2-expl-prev-latent-text")
            .text(`Representation of timestep ${window.timestep-1}`)


// latent to UNet arrow
let architectureLineWidth = 2;
let architectureLineColor = "#b0b0b0"
let dy = 24
let dx = 6
let angle = Math.atan(dx/dy);
let r = 10
d3.select("#latent-denoiser-l2-expl-container")
    .append("svg")
        .attr("id", "denoise-latent-l2-expl-latent-unet-arrow-svg")
        .append("g")
        .append("path")
            .attr("id", "denoise-latent-l2-expl-latent-unet-arrow")
            .attr("class", "architecture-arrow-img")
            .attr("marker-end", "url(#architecture-arrow-img-head)")
            .attr("d", `M0 0 l20 0 a ${r} ${r} ${90-angle*180/Math.PI} 0 1 ${r*Math.cos(angle)} ${r-r*Math.sin(angle)} l${dx} ${dy} a ${r} ${r} ${90-angle*180/Math.PI} 0 0 ${r*Math.cos(angle)} ${r-r*Math.sin(angle)} l 3 0`)

// UNet
d3.select("#latent-denoiser-l2-expl-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-unet-container")
        .append("svg")
            .attr("id", "denoise-latent-l2-expl-unet-svg")
            .append("rect")
                .attr("id", "denoise-latent-l2-expl-unet-rect")
                .attr("width", "85")
                .attr("height", "85")
                .attr("rx", "5")
                .attr("ry", "5")
d3.select("#denoise-latent-l2-expl-unet-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-unet-text")
        .attr("class", "architecture-text")
        .text("UNet")
d3.select("#denoise-latent-l2-expl-unet-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-unet-desc-text")
        .text("predicts noise to remove from latent")

// ADD arrow and explanations for guidance scale
let x_=12;
let y_=12;
let arrowHeadL=4;
let arrowHeadAngle=Math.PI/6;
let depth = 4;
let lineAngle = Math.atan(x_/y_)
let dx_=depth*Math.sin(lineAngle)
let dy_=-depth*Math.cos(lineAngle)
d3.select("#latent-denoiser-l2-expl-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-guidance-scale-expl-container")
        .append("svg")
            .attr("id", "denoise-latent-l2-expl-guidance-scale-arrow-svg")
            .append("g")
                .append("path")
                .attr("d", `M0 0 c ${-dx_} ${-dy_}, ${x_-dx_} ${y_-dy_}, ${x_} ${y_} l ${arrowHeadL*Math.sin(arrowHeadAngle-lineAngle)} ${-arrowHeadL*Math.cos(arrowHeadAngle-lineAngle)} m ${-(arrowHeadL+0.5)*Math.sin(arrowHeadAngle-lineAngle)} ${(arrowHeadL+0.5)*Math.cos(arrowHeadAngle-lineAngle)} l ${-(arrowHeadL+1)*Math.sin(arrowHeadAngle+lineAngle+45*Math.PI/180)} ${-(arrowHeadL+1)*Math.cos(arrowHeadAngle+lineAngle+45*Math.PI/180)}`) 
                .attr("fill", "none")
                .attr("stroke", "#909090")
                .attr("stroke-width", "1px")
d3.select("#denoise-latent-l2-expl-guidance-scale-expl-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-guidance-scale-expl-text")
d3.select("#denoise-latent-l2-expl-guidance-scale-expl-text")
    .append("div")
        .text("controls how well the image representation")
d3.select("#denoise-latent-l2-expl-guidance-scale-expl-text")
    .append("div")
        .text("adheres to your text prompt.")
d3.select("#denoise-latent-l2-expl-guidance-scale-expl-text")
    .append("div")
        .text("Higher value means stronger adherence.")
d3.select("#denoise-latent-l2-expl-guidance-scale-expl-text")
    .append("div")
    .attr("id", "denoise-latent-l2-expl-guidance-scale-expl-text-how")
        .text("How?")
        .on("click", expandLatentDenoiserL3)

// ADD noise
dy = 50
dx = 7
angle = Math.atan(dx/dy);
d3.select("#latent-denoiser-l2-expl-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-noise-container")
        .append("svg")
            .attr("id", "denoise-latent-l2-expl-noise-svg")
            .append("g")
            .append("path")
                .attr("id", "denoise-latent-l2-expl-noise-arrow")
                .attr("d", `M0 0 l96 0 a ${r} ${r} ${90-angle*180/Math.PI} 0 0 ${r*Math.cos(angle)} ${-r+r*Math.sin(angle)} l${dx} -${dy} a ${r} ${r} ${90-angle*180/Math.PI} 0 1 ${r*Math.cos(angle)} ${-r+r*Math.sin(angle)} l 3 0`)
                .attr("fill", "none")
                .attr("stroke", "url(#denoise-latent-l2-expl-weaken-arrow-gradient)")
                .attr("stroke-width", architectureLineWidth)
d3.select("#denoise-latent-l2-expl-noise-container")
    .append("img")
        .attr("id", "denoise-latent-l2-expl-noise-img")
        .attr("class", "denoise-latent-l2-expl-noise")
        .attr("src", `./assets/noises/noise_pred_final.jpg`)
d3.select("#denoise-latent-l2-expl-noise-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-noise-text")
        .text("Noise")

// ADD Weaken and Arrow and explanations
x_=-4;
y_=-16;
arrowHeadL=4;
arrowHeadAngle=Math.PI/4;
depth = 4;
lineAngle = Math.atan(x_/y_)
dx_=depth*Math.sin(lineAngle)
dy_=-depth*Math.cos(lineAngle)
d3.select("#denoise-latent-l2-expl-noise-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-weaken-text")
        .text("weaken")
        .on("mouseover", () => {d3.select("#denoise-latent-l2-expl-weaken-expl").style("display", "block")})
        .on("mouseout", () => {d3.select("#denoise-latent-l2-expl-weaken-expl").style("display", "none")})
d3.select("#denoise-latent-l2-expl-noise-container")
    .append("svg")
        .attr("id", "denoise-latent-l2-expl-weaken-arrow-svg")
        .append("g")
        .append("path")
        .attr("d", `M0 0 c ${dx_} ${dy_}, ${x_+dx_} ${y_+dy_}, ${x_} ${y_} l ${-arrowHeadL*Math.sin(arrowHeadAngle-lineAngle)} ${arrowHeadL*Math.cos(arrowHeadAngle-lineAngle)} m ${(arrowHeadL+1)*Math.sin(arrowHeadAngle-lineAngle)} ${-(arrowHeadL+1)*Math.cos(arrowHeadAngle-lineAngle)} l ${(arrowHeadL+1)*Math.sin(arrowHeadAngle+lineAngle+15*Math.PI/180)} ${(arrowHeadL+1)*Math.cos(arrowHeadAngle+lineAngle+15*Math.PI/180)}`)
        .attr("fill", "none")
        .attr("stroke", "#909090")
        .attr("stroke-width", "1px")
d3.select("#denoise-latent-l2-expl-noise-container")
    .select("svg")
        .append("defs")
            .append("linearGradient")
                .attr("id", "denoise-latent-l2-expl-weaken-arrow-gradient")
                .attr("x1", "0%")
                .attr("x2", "100%")
                .attr("y1", "0%")
                .attr("y2", "0%")
                .selectAll("stop")
                .data([["0%", "var(--img2)"], ["30%", "var(--img2)"], ["100%", "#de77ae10"]])
                .enter()
                .append("stop")
                .attr("offset", d => d[0])
                .attr("stop-color", d => d[1])
d3.select("#denoise-latent-l2-expl-noise-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-weaken-expl")
        .text("Multiply by a small number decided by scheduler to gradually denoise over multiple timesteps")

// central branch
let centralLineWidth = 5;
let centralLineColor = "var(--img4)";
d3.select("#latent-denoiser-l2-expl-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-central-line-container")
        .append("svg")
            .attr("id", "denoise-latent-l2-expl-central-line-svg")
            .append("line")
                .attr("x1", "0")
                .attr("y1", "10")
                .attr("x2", "336")
                .attr("y2", "10")
                .attr("stroke-width", `${centralLineWidth}px`)
                .attr("stroke", `${centralLineColor}`)
                .attr("marker-end", "url(#denoise-latent-l2-expl-central-line-arrow-head)")
d3.select("#denoise-latent-l2-expl-central-line-svg")
    .append("circle")
        .attr("r", "10")
        .attr("cx", "300")
        .attr("cy", "10")
        .attr("fill", "white")
        .attr("stroke-width", `${centralLineWidth}px`)
        .attr("stroke", `var(--img1)`)
d3.select("#denoise-latent-l2-expl-central-line-svg")
    .append("text")
    .attr("id", "denoise-latent-l2-expl-central-line-minus-text")
    .text("-")
    .attr("x", "296")
    .attr("y", "16.3")
d3.select("#denoise-latent-l2-expl-central-line-svg")
    .append("defs")
        .append("marker")
            .attr("id", "denoise-latent-l2-expl-central-line-arrow-head")
            .attr("markerWidth", "8.75")
            .attr("markerHeight", "3.5")
            .attr("refX", "0")
            .attr("refY", "1.75")
            .attr("orient", "auto")
            .append("polygon")
                .attr("points", "0 0, 3.5 1.75, 0 3.5")
                .attr("fill", centralLineColor)
d3.select("#denoise-latent-l2-expl-central-line-container")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-central-line-timestep-expl-text")
d3.select("#denoise-latent-l2-expl-central-line-timestep-expl-text")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-central-line-timestep-expl-text-1")
        .text("Timestep is also input to UNet.")
d3.select("#denoise-latent-l2-expl-central-line-timestep-expl-text")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-central-line-timestep-expl-text-2")
        .text("A lower timestep value informs UNet")
d3.select("#denoise-latent-l2-expl-central-line-timestep-expl-text")
    .append("div")
        .attr("id", "denoise-latent-l2-expl-central-line-timestep-expl-text-3")
        .text("that the latent has more noise.")

d3.select("#latent-denoiser-l2-expl-container")
    .append("svg")
        .attr("id", "denoise-latent-l2-expl-text-vectors-arrow-svg")
        .append("use")
            .attr("href", "#text-vector-generator-latent-denoiser-arrow")
            .attr("id", "denoise-latent-l2-expl-text-vectors-arrow-use")

d3.select("#architecture-container")
    .append("div")
    .attr("id", "denoise-latent-l2-right-cover")
d3.select("#architecture-container")
    .append("div")
    .attr("id", "denoise-latent-l2-left-cover")