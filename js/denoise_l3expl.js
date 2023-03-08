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
        if (e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {}
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

// Drag Functions
function dragStarted() {
    // d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", "#a0a0a0")
}
function dragged(e) {
    // should move Noise, change border color as well!
    let points = {
        0: [partitions[0]*sliderWidth, (1-partitions[0])*sliderHeight],
        1: [partitions[1]*sliderWidth, (1-partitions[1])*sliderHeight],
        7: [partitions[2]*sliderWidth, (1-partitions[2])*sliderHeight],
        20: [partitions[3]*sliderWidth, (1-partitions[3])*sliderHeight],
    }
    if ((e.x-points[0][0])**2+(e.y-points[0][1])**2 < (e.x-points[1][0])**2+(e.y-points[1][1])**2) {
        // put circle and line on 0
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("x1", points[0][0])
            .attr("y1", points[0][1])
            .attr("x2", points[0][0])
            .attr("stroke", "#a0a0a0")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle")
            .attr("cx", points[0][0])
            .attr("cy", points[0][1])
            .attr("fill", "#a0a0a0")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("d", "M0 0 l 0 -15 C 0 -30, 15.2 -31, 30.4 -32 L121.6 -38 C 136.8 -39, 152 -40, 152 -55 L152 -70")
        // TODO: Implement when gs=0
        hyperparamChanged(e, window.seed, "0.0");  
        document.getElementById("unet-guidance-scale-control-dropdown-select").selectedIndex = 0
    }
    else if ((e.x-points[1][0])**2+(e.y-points[1][1])**2 < (e.x-points[7][0])**2+(e.y-points[7][1])**2) {
        // put circle and line on 1
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("x1", points[1][0])
            .attr("y1", points[1][1])
            .attr("x2", points[1][0])
            .attr("stroke", "var(--text1)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle")
            .attr("cx", points[1][0])
            .attr("cy", points[1][1])
            .attr("fill", "var(--text1)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("d", "M25 0 l 0 -15 C 25 -30, 40.2 -31, 55.4 -32 L121.6 -38 C 136.8 -39, 152 -40, 152 -55 L152 -70")
        hyperparamChanged(e, window.seed, "1.0");
        document.getElementById("unet-guidance-scale-control-dropdown-select").selectedIndex = 0
    }
    else if ((e.x-points[20][0])**2+(e.y-points[20][1])**2 < (e.x-points[7][0])**2+(e.y-points[7][1])**2) {
        // put circle and line on 20
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("x1", points[20][0])
            .attr("y1", points[20][1])
            .attr("x2", points[20][0])
            .attr("stroke", "var(--text3)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle")
            .attr("cx", points[20][0])
            .attr("cy", points[20][1])
            .attr("fill", "var(--text3)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("d", "M250 0 l 0 -20 C 250 -25, 242.2 -31.5, 237 -32.5 L165 -37.5 C 159.8 -38.5, 152 -40, 152 -45 L152 -70")
        hyperparamChanged(e, window.seed, "20.0");
        document.getElementById("unet-guidance-scale-control-dropdown-select").selectedIndex = 2
    }
    else {
        // put circle and line on 7
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("x1", points[7][0])
            .attr("y1", points[7][1])
            .attr("x2", points[7][0])
            .attr("stroke", "var(--text2)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle")
            .attr("cx", points[7][0])
            .attr("cy", points[7][1])
            .attr("fill", "var(--text2)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line")
            .attr("d", "M100 0 l 0 -20 C 100 -25, 107.8 -31.5, 113 -32.5 L139 -37.5 C 144.2 -38.5, 152 -40, 152 -45 L152 -70")
        hyperparamChanged(e, window.seed, "7.0");
        document.getElementById("unet-guidance-scale-control-dropdown-select").selectedIndex = 1
    }
}
function dragEnded() {
    let points = {
        0: [partitions[0]*sliderWidth, (1-partitions[0])*sliderHeight],
        1: [partitions[1]*sliderWidth, (1-partitions[1])*sliderHeight],
        7: [partitions[2]*sliderWidth, (1-partitions[2])*sliderHeight],
        20: [partitions[3]*sliderWidth, (1-partitions[3])*sliderHeight],
    }
    if ((e.x-points[0][0])**2+(e.y-points[0][1])**2 < (e.x-points[1][0])**2+(e.y-points[1][1])**2) {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", "#a0a0a0")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle").attr("fill", "#a0a0a0")
    }
    else if ((e.x-points[1][0])**2+(e.y-points[1][1])**2 < (e.x-points[7][0])**2+(e.y-points[7][1])**2) {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", "#var(--text1)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle").attr("fill", "var(--text1)")
    }
    else if ((e.x-points[20][0])**2+(e.y-points[20][1])**2 < (e.x-points[7][0])**2+(e.y-points[7][1])**2) {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", "#var(--text3)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle").attr("fill", "var(--text3)")
    }
    else {
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-line").attr("stroke", "var(--text2)")
        d3.select("#latent-denoiser-l3-expl-vis-slider-thumb-circle").attr("fill", "var(--text2)")
    }
}
let drag = d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded)
let r = 5
let x0 = partitions[2]*sliderWidth;
let destX = 152
let destY = -70
d3.select("#latent-denoiser-l3-expl-vis-svg")
    .append("g")
        .attr("id", "latent-denoiser-l3-expl-vis-slider-thumb-g")
        .append("path")
            .attr("id", "latent-denoiser-l3-expl-vis-slider-thumb-line")
            // .attr("d", `M${x0} 0 l 0 -${30-r*2} c 0 -${r}, ${(destX-x0)*0.15} -31.5, ${(destX-x0)/4} -32.5 L 139 -37.5  L152 -40 L${destX} ${destY}`)
            .attr("d", "M100 0 l 0 -20 C 100 -25, 107.8 -31.5, 113 -32.5 L139 -37.5 C 144.2 -38.5, 152 -40, 152 -45 L152 -70")
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

d3.select("#latent-denoiser-l3-expl-container")
    .append("div")
        .attr("id", "latent-denoiser-l3-expl-text-container")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
    .text("UNet predicts noise in latent considering your text prompt.")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
    .text("UNet also predicts noise with an empty prompt as a reference point.")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
    .text("The difference between the two noises is the guidance made by your prompt.")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
    .text("Moving away from the reference point in the direction of the difference")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
    .text("increases guidance of your prompt.")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
    .text("Guidance scale is multiplied to the noise difference to control guidance.")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
    .text("For example, the guidance scale of 7 multiplies the noise difference by 7 ")
d3.select("#latent-denoiser-l3-expl-text-container")
    .append("div")
    .text("and adds it to the reference point to increase the guidance by sevenfold.")

d3.select("#latent-denoiser-l3-expl-container")
    .append("img")
        .attr("id", "latent-denoiser-l3-expl-vis-leave-img")
        .on("click", reduceLatentDenoiserL3)
        .attr("src", "./icons/leave.svg")
        .attr("height", `25px`)