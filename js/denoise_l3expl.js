import {reduceLatentDenoiserL2, reduceLatentDenoiserL3, hyperparamChanged} from "./function.js"

document.addEventListener("keydown", (e) => {
    if (window.latentDenoiserL3Expanded && e.key == "Escape") reduceLatentDenoiserL3();
})

document.addEventListener("mouseup", (e) => {
    if (window.latentDenoiserL2Expanded && window.latentDenoiserL3Expanded) {
        let latentDenoiserBox = document.getElementById("latent-denoiser-container").getBoundingClientRect()
        let left = latentDenoiserBox.x
        let right = latentDenoiserBox.x + latentDenoiserBox.width
        let top = latentDenoiserBox.y
        let bottom = latentDenoiserBox.y + latentDenoiserBox.height
        let descriptionBox = document.getElementById("description").getBoundingClientRect()
        if (e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {}
        else if (document.querySelector(".controller-button-circle:hover") != null) {}
        else if (document.querySelector("#controller-timestep-slider-container:hover") != null) {}
        else if (e.clientY > descriptionBox.y) {}
        else {reduceLatentDenoiserL3(); reduceLatentDenoiserL2();}
    }
})
let sliderWidth = 250;
let sliderHeight = 0;
let tickLength = 15;
let partitions = [0,0.1,0.4,1.]

d3.select("#architecture-container")
    .append("div")
        .attr("id", "latent-denoiser-l3-expl-container")
d3.select("#latent-denoiser-l3-expl-container")
    .append("svg")
        .attr("id","latent-denoiser-l3-expl-vis-svg")
        .append("g")
            .attr("id","latent-denoiser-l3-expl-vis-slider-g")
            .append("line")
                .attr("fill", "none")
                .attr("stroke", "url(#latent-denoiser-l3-expl-vis-slider-gradient)")
                .attr("stroke-width", "4px")
                .attr("x1", "0")
                .attr("y1", sliderHeight)
                .attr("x2", sliderWidth)
                .attr("y2", "0")
d3.select("#latent-denoiser-l3-expl-vis-slider-g")
    .append("line")
        .attr("stroke", "url(#latent-denoiser-l3-expl-vis-slider-end-gradient)")
        .attr("stroke-width", "4px")
        .attr("x1", sliderWidth)
        .attr("y1", "0")
        .attr("x2", sliderWidth*(1+0.1))
        .attr("y2", -sliderHeight*0.1)
d3.select("#latent-denoiser-l3-expl-vis-svg")
    .append("defs")
    .append("linearGradient")
        .attr("id", "latent-denoiser-l3-expl-vis-slider-gradient")
        .attr("x1", "0")
        .attr("y1", "0%")
        .attr("x2", "250")
        .attr("y2", "0%")
        .attr("gradientUnits", "userSpaceOnUse")
        .selectAll("stop")
        .data([["#b0b0b0", "0%"],["var(--text1)", "10%"],["var(--text2)","40%"],["var(--text3)","100%"]])
        .enter()
            .append("stop")
            .attr("offset", d=>d[1])
            .style("stop-color", d=>d[0])
d3.select("#latent-denoiser-l3-expl-vis-svg")
    .append("defs")
    .append("linearGradient")
        .attr("id", "latent-denoiser-l3-expl-vis-slider-end-gradient")
        .attr("x1", "250")
        .attr("y1", "0%")
        .attr("x2", "275")
        .attr("y2", "0%")
        .attr("gradientUnits", "userSpaceOnUse")
        .selectAll("stop")
        .data([["#4d9221ff","0%"],["#4d922100","100%"]])
        .enter()
            .append("stop")
            .attr("offset", d=>d[1])
            .style("stop-color", d=>d[0])

d3.select("#latent-denoiser-l3-expl-vis-svg")
    .append("g")
    .attr("id", "latent-denoiser-l3-expl-vis-tick-g")
    .selectAll("line")
        .data([[0,"#a0a0a0"],[1,"var(--text1)"],[7,"var(--text2)"],[20,"var(--text3)"]])
        .enter()
        .append("circle")
            .attr("cx", (d,i) => partitions[i]*sliderWidth)
            .attr("cy", sliderHeight)
            .attr("r", "5")
            .attr("fill", "#ffffff")
            .attr("stroke", d => d[1])
            .attr("stroke-width", "3px")
            .on("click", function (e) {
                let gs = d3.select(this).data()[0][0]
                moveThumb(gs); // put circle and line on 0
                hyperparamChanged(e, window.seed, `${gs}.0`);
                document.getElementById("guidance-scale-control-dropdown-select").selectedIndex = (gs<=1)?gs:((gs==7)?2:3)
            })

// Drag Functions
// Define points location, colors, and connecting line path
let points = {
    0: [partitions[0]*sliderWidth, (1-partitions[0])*sliderHeight],
    1: [partitions[1]*sliderWidth, (1-partitions[1])*sliderHeight],
    7: [partitions[2]*sliderWidth, (1-partitions[2])*sliderHeight],
    20: [partitions[3]*sliderWidth, (1-partitions[3])*sliderHeight],
}
let colors = {0: "#a0a0a0", 1: "var(--text1)", 7: "var(--text2)", 20: "var(--text3)"}
let path = {
    0: "M0 0 l 0 -10 a10 10, 0 0 1, 10 -10 L142 -20 a10 10, 0 0 0, 10 -10 L152 -54", 
    1: "M20 0 l 0 -10 a10 10, 0 0 1, 10 -10 L142 -20 a10 10, 0 0 0, 10 -10 L152 -54", 
    7: "M100 0 l 0 -10 a10 10, 0 0 1, 10 -10 L142 -20 a10 10, 0 0 0, 10 -10 L152 -54", 
    20: "M250 0 l 0 -10 a10 10, 0 0 0, -10 -10 L162 -20 a10 10, 0 0 1, -10 -10 L152 -54", 
}
function moveThumb(gs) {
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
function dragStarted() {}
function dragged(e) {
    // should move Noise, change border color as well!
    if ((e.x-points[0][0])**2+(e.y-points[0][1])**2 < (e.x-points[1][0])**2+(e.y-points[1][1])**2) {
        moveThumb(0); // put circle and line on 0
        hyperparamChanged(e, window.seed, "0.0");  
        document.getElementById("guidance-scale-control-dropdown-select").selectedIndex = 0
    }
    else if ((e.x-points[1][0])**2+(e.y-points[1][1])**2 < (e.x-points[7][0])**2+(e.y-points[7][1])**2) {
        // put circle and line on 1
        moveThumb(1);
        hyperparamChanged(e, window.seed, "1.0");
        document.getElementById("guidance-scale-control-dropdown-select").selectedIndex = 1
    }
    else if ((e.x-points[20][0])**2+(e.y-points[20][1])**2 < (e.x-points[7][0])**2+(e.y-points[7][1])**2) {
        // put circle and line on 20
        moveThumb(20);
        hyperparamChanged(e, window.seed, "20.0");
        document.getElementById("guidance-scale-control-dropdown-select").selectedIndex = 3
    }
    else {
        // put circle and line on 7
        moveThumb(7);
        hyperparamChanged(e, window.seed, "7.0");
        document.getElementById("guidance-scale-control-dropdown-select").selectedIndex = 2
    }
}
function dragEnded(e) {
    if ((e.x-points[0][0])**2+(e.y-points[0][1])**2 < (e.x-points[1][0])**2+(e.y-points[1][1])**2) {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", colors[0])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle").attr("fill", colors[0])
    }
    else if ((e.x-points[1][0])**2+(e.y-points[1][1])**2 < (e.x-points[7][0])**2+(e.y-points[7][1])**2) {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", colors[1])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle").attr("fill", colors[1])
    }
    else if ((e.x-points[20][0])**2+(e.y-points[20][1])**2 < (e.x-points[7][0])**2+(e.y-points[7][1])**2) {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", colors[20])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle").attr("fill", colors[20])
    }
    else {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", colors[7])
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle").attr("fill", colors[7])
    }
}
let drag = d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded)
d3.select("#latent-denoiser-l3-expl-vis-svg")
    .append("g")
        .attr("id", "latent-denoiser-l3-expl-vis-slider-thumb-g")
        .append("path")
            .attr("id", "latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("d", path[7])
            .attr("fill", "none")
            .attr("stroke", "var(--text2)")
            .attr("stroke-width", "2px")
            .call(drag)
d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-g")
    .append("circle")
        .attr("id", "latent-denoiser-l3-expl-vis-slider-thumb-circle")
        .attr("cx", sliderWidth*partitions[2])
        .attr("cy", sliderHeight*(1-partitions[2]))
        .attr("r", "5.5")
        .attr("fill", "var(--text2)")
        .attr("stroke", "white")
        .attr("stroke-width", "2.5px")
        .style("cursor", "pointer")
        .call(drag)
d3.select("#latent-denoiser-l3-expl-vis-svg")
    .append("g")
        .attr("id", "latent-denoiser-l3-expl-vis-tick-label-g")
        .selectAll("text")
        .data([[0,"#a0a0a0"],[1,"var(--text1)"],[7,"var(--text2)"],[20,"var(--text3)"]])
        .enter()
        .append("text")
            .text(d=>d[0])
            .attr("x", (d,i)=>d[0]==20?partitions[i]*sliderWidth-12:partitions[i]*sliderWidth-6)
            .attr("y", (d,i)=>(1-partitions[i])*sliderHeight+27)
            .attr("fill", d=>d[1])
            .style("font-weight", "500")
            .style("font-size", "20px")
            .style("cursor", "pointer")
            .on("click", function (e) {
                let gs = d3.select(this).data()[0][0]
                moveThumb(gs); // put circle and line on 0
                hyperparamChanged(e, window.seed, `${gs}.0`);
                document.getElementById("guidance-scale-control-dropdown-select").selectedIndex = (gs<=1)?gs:((gs==7)?2:3)
            })

d3.select("#latent-denoiser-l3-expl-container")
    .append("div")
        .attr("id", "latent-denoiser-l3-expl-text-container")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
        .text("UNet predicts two noises:")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
        .text("(1) generic noise conditioned on an empty prompt")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
        .text("(2) prompt-specific noise conditioned on your text prompt.")
        .style("padding-bottom", "8px")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
        .html('To generate images strongly adhering to your text prompt, Stable Diffusion computes the weighted sum of the two noises with the weights controlled by the <span style="font-weight:500">guidance scale</span>. The larger the guidance scale, the stronger adherence to the text prompt.')
        .style("display","inline-block")

d3.select("#latent-denoiser-l3-expl-container")
    .append("img")
        .attr("id", "latent-denoiser-l3-expl-vis-leave-img")
        .on("click", reduceLatentDenoiserL3)
        .attr("src", "./icons/leave.svg")
        .attr("height", `25px`)