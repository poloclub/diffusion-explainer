document.addEventListener("keydown", (e) => {
    if (window.textVectorGeneratorL3Expanded && e.key == "Escape") 
        d3.select("#generate-text-vector-l3-expl-container").style("display", "none")
        window.textVectorGeneratorL3Expanded = false;
})

document.addEventListener("mouseup", (e) => {
    if (window.textVectorGeneratorL2Expanded && window.textVectorGeneratorL3Expanded) {
        let textVectorGeneratorBox = document.getElementById("generate-text-vector-l3-expl-container").getBoundingClientRect()
        let left = textVectorGeneratorBox.x
        let right = textVectorGeneratorBox.x + textVectorGeneratorBox.width
        let top = textVectorGeneratorBox.y
        let bottom = textVectorGeneratorBox.y + textVectorGeneratorBox.height
        let descriptionBox = document.getElementById("description").getBoundingClientRect()
        let mainBox = document.getElementById("main").getBoundingClientRect()
        let mainLeft = mainBox.x
        let mainRight = mainBox.x + mainBox.width
        let mainTop = mainBox.y
        let mainBottom = mainBox.y + mainBox.height
        if (e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {}
        // else if (e.clientY > descriptionBox.y) {}
        else if (e.clientX > mainLeft && e.clientX < mainRight && e.clientY > mainTop && e.clientY < mainBottom) {
            d3.select("#generate-text-vector-l3-expl-container").style("display", "none")
            window.textVectorGeneratorL3Expanded = false;
            // reduceTextVectorGeneratorL2();
        }
        else {
            // d3.select("#generate-text-vector-l3-expl-container").style("display", "none")
            // window.textVectorGeneratorL3Expanded = false;
        }
    }
})


d3.select("#architecture-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-container")

d3.select("#generate-text-vector-l3-expl-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-text-container")
d3.select("#generate-text-vector-l3-expl-text-container")
    .append("div")
        .attr("id", "generate-text-vector-l3-expl-text-1")
        .append("div")
            .attr("id", "generate-text-vector-l3-expl-text-1-1")
            .text("Stable Diffusion uses CLIP's")
d3.select("#generate-text-vector-l3-expl-text-1")
    .append("div")
        .attr("id", "generate-text-vector-l3-expl-text-1-2")
        .text("text encoder")
d3.select("#generate-text-vector-l3-expl-text-1")
    .append("div")
        .attr("id", "generate-text-vector-l3-expl-text-1-3")
        .text("to connect texts with images.")
d3.select("#generate-text-vector-l3-expl-text-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-text-2")
    .text("For an image-caption pair, CLIP's text encoder converts the caption's")
d3.select("#generate-text-vector-l3-expl-text-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-text-3")
    .text("tokens into a vector that is close to the image's vector")
d3.select("#generate-text-vector-l3-expl-text-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-text-4")
    .text("(produced by CLIP's image encoder) in hybrid text-image space.")

d3.select("#generate-text-vector-l3-expl-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-vis-container")
d3.select("#generate-text-vector-l3-expl-vis-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-vis-input-container")
d3.select("#generate-text-vector-l3-expl-vis-input-container")
    .append("img")
    .attr("id", "generate-text-vector-l3-expl-vis-input-img-1")
    .attr("src", "./icons/whitedog.jpg")
d3.select("#generate-text-vector-l3-expl-vis-input-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-vis-input-tokens-1")
        .selectAll("div")
        .data([["34px", "photo"],["12px", "of"],["30px", "white"],["21px", "dog"]])
        .enter()
            .append("div")
                .attr("class", `generate-text-vector-l3-expl-vis-token-1`)
                .attr("id", (d,i) => `generate-text-vector-l3-expl-vis-token-1-${i}`)
                .text(d => d[1])
                .style("width", d => d[0])
d3.select("#generate-text-vector-l3-expl-vis-input-container")
    .append("img")
    .attr("id", "generate-text-vector-l3-expl-vis-input-img-2")
    .attr("src", "./icons/yellowflower.jpg")
d3.select("#generate-text-vector-l3-expl-vis-input-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-vis-input-tokens-2")
        .selectAll("div")
        .data([["43px", "drawing"],["12px", "of"],["35px", "yellow"],["34px", "flower"]])
        .enter()
            .append("div")
                .attr("class", `generate-text-vector-l3-expl-vis-token-2`)
                .attr("id", (d,i) => `generate-text-vector-l3-expl-vis-token-1-${i}`)
                .text(d => d[1])
                .style("width", d => d[0])

// Encoders
d3.select("#generate-text-vector-l3-expl-vis-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-image-encoder-container")
        .append("div")
        .attr("id", "generate-text-vector-l3-expl-image-encoder-text")
            .text("Image Encoder")
d3.select("#generate-text-vector-l3-expl-image-encoder-container")
    .append("div")
        .attr("id", "generate-text-vector-l3-expl-image-encoder-rect")

d3.select("#generate-text-vector-l3-expl-vis-container")
    .append("div")
    .attr("id", "generate-text-vector-l3-expl-text-encoder-container")
        .append("div")
        .attr("id", "generate-text-vector-l3-expl-text-encoder-text")
            .text("Text Encoder")
d3.select("#generate-text-vector-l3-expl-text-encoder-container")
    .append("div")
        .attr("id", "generate-text-vector-l3-expl-text-encoder-rect")

// Hybrid Text-Image Space
d3.select("#generate-text-vector-l3-expl-vis-container")
    .append("div")
        .attr("id", "generate-text-vector-l3-expl-space-container")
        .append("div")
            .attr("id", "generate-text-vector-l3-expl-space-text")
            .text("Hybrid Text-Image Space")
d3.select("#generate-text-vector-l3-expl-space-container")
    .append("div")
        .attr("id", "generate-text-vector-l3-expl-space-vis")
        .append("svg")
            .attr("id", "generate-text-vector-l3-expl-space-vis-svg")
d3.select("#generate-text-vector-l3-expl-space-vis-svg")
    .append("defs")
    .append("linearGradient")
        .attr("id", "generate-text-vector-l3-expl-space-vis-vector-gradient")
        .selectAll("stop")
        .data([["0%","#ffffff00"],["25%","#ffffff00"],["80%","#ffffffff"]])
        .enter()
        .append("stop")
            .attr("offset", d=>d[0])
            .attr("stop-color", d=>d[1])
d3.select("#generate-text-vector-l3-expl-space-vis-svg")
    .append("g")
        .attr("id", "generate-text-vector-l3-expl-space-vis-1-image-vector-g")
        .selectAll("rect")
            .data(["0.0", "0.0","0.0","0.0"])
            .enter()
                .append("rect")
                .attr("height", "20")
                .attr("width", "20")
                .attr("fill", "#c1dea9")
                .attr("x", (d,i) => 22*i)
                .attr("y", 0)
d3.select("#generate-text-vector-l3-expl-space-vis-1-image-vector-g")
    .selectAll("text")
        .data(["0.5", "1.3","-0.1","2.8"])
        .enter()
            .append("text")
            .attr("class", "generate-text-vector-l3-expl-space-vis-1-image-vector-text")
            .text(d => d)
            .attr("x", (d,i) => 22*i+2+0.5*(d>=0))
            .attr("y", 14)
d3.select("#generate-text-vector-l3-expl-space-vis-1-image-vector-g")
    .append("rect")
        .attr("height", "20")
        .attr("width", "20")
        .attr("fill", "url(#generate-text-vector-l3-expl-space-vis-vector-gradient)")
        .attr("x", 66)
        .attr("y", 0)
d3.select("#generate-text-vector-l3-expl-space-vis-svg")
    .append("g")
        .attr("id", "generate-text-vector-l3-expl-space-vis-1-text-vector-g")
        .selectAll("rect")
            .data(["0.0","0.0","0.0","0.0"])
            .enter()
                .append("rect")
                .attr("height", "20")
                .attr("width", "20")
                .style("stroke", "#c1dea9")
                .attr("stroke-width", "2px")
                .attr("fill", "none")
                .attr("x", (d,i) => 22*i)
                .attr("y", 0)
d3.select("#generate-text-vector-l3-expl-space-vis-1-text-vector-g")
    .selectAll("text")
        .data(["0.4", "1.1","0.4","3.0"])
        .enter()
            .append("text")
            .attr("class", "generate-text-vector-l3-expl-space-vis-1-text-vector-text")
            .text(d => d)
            .attr("x", (d,i) => 22*i+2+0.5*(d>=0))
            .attr("y", 14)
d3.select("#generate-text-vector-l3-expl-space-vis-1-text-vector-g")
    .append("rect")
        .attr("height", "22")
        .attr("width", "22")
        .attr("fill", "url(#generate-text-vector-l3-expl-space-vis-vector-gradient)")
        .attr("x", 66)
        .attr("y", 0)
d3.select("#generate-text-vector-l3-expl-space-vis-svg")
    .append("g")
        .attr("id", "generate-text-vector-l3-expl-space-vis-2-image-vector-g")
        .selectAll("rect")
            .data(["0.0","0.0","0.0","0.0"])
            .enter()
                .append("rect")
                .attr("height", "20")
                .attr("width", "20")
                .attr("fill", "#F9BDBD")
                .attr("x", (d,i) => 22*i)
                .attr("y", 0)
d3.select("#generate-text-vector-l3-expl-space-vis-2-image-vector-g")
    .selectAll("text")
        .data(["-4.1", "0.0","1.5","5.4"])
        .enter()
            .append("text")
            .attr("class", "generate-text-vector-l3-expl-space-vis-2-image-vector-text")
            .text(d => d)
            .attr("x", (d,i) => 22*i+2+0.5*(d>=0))
            .attr("y", 14)
d3.select("#generate-text-vector-l3-expl-space-vis-2-image-vector-g")
    .append("rect")
        .attr("height", "20")
        .attr("width", "20")
        .attr("fill", "url(#generate-text-vector-l3-expl-space-vis-vector-gradient)")
        .attr("x", 66)
        .attr("y", 0)
d3.select("#generate-text-vector-l3-expl-space-vis-svg")
    .append("g")
        .attr("id", "generate-text-vector-l3-expl-space-vis-2-text-vector-g")
        .selectAll("rect")
            .data(["0.0","0.0","0.0","0.0"])
            .enter()
                .append("rect")
                .attr("height", "20")
                .attr("width", "20")
                .style("stroke", "#F9BDBD")
                .attr("stroke-width", "2px")
                .attr("fill", "none")
                .attr("x", (d,i) => 22*i)
                .attr("y", 0)
d3.select("#generate-text-vector-l3-expl-space-vis-2-text-vector-g")
    .selectAll("text")
        .data(["-3.8", "0.2","1.1","5.2"])
        .enter()
            .append("text")
            .attr("class", "generate-text-vector-l3-expl-space-vis-2-text-vector-text")
            .text(d => d)
            .attr("x", (d,i) => 22*i+2+0.5*(d>=0))
            .attr("y", 14)
d3.select("#generate-text-vector-l3-expl-space-vis-2-text-vector-g")
    .append("rect")
        .attr("height", "22")
        .attr("width", "22")
        .attr("fill", "url(#generate-text-vector-l3-expl-space-vis-vector-gradient)")
        .attr("x", 66)
        .attr("y", 0)

//  Add line
d3.select("#generate-text-vector-l3-expl-vis-container")
    .append("div")
        .attr("id", "generate-text-vector-l3-expl-vis-lines-container")
        .append("div")
            .attr("id", "generate-text-vector-l3-expl-vis-lines-1-image-container")
            .append("svg")
            .append("g")
                .attr("id", "generate-text-vector-l3-expl-vis-lines-1-image-g")
d3.select("#generate-text-vector-l3-expl-vis-lines-1-image-g")
    .append("line")
        .attr("x1", "0")
        .attr("y1", "0")
        .attr("x2", "190")
        .attr("y2", "0")
        .attr("stroke", "#c1dea9")
        .attr("stroke-width", "5px")
d3.select("#generate-text-vector-l3-expl-vis-lines-1-image-g")
    .append("line")
        .attr("x1", "96")
        .attr("y1", "0")
        .attr("x2", "137")
        .attr("y2", "0")
        .attr("stroke", "white")
        .attr("stroke-width", "5px")
d3.select("#generate-text-vector-l3-expl-vis-lines-1-image-g")
    .append("circle")
    .attr("cx", "49.5")
    .attr("cy", "0")
    .attr("r", "6")
    .attr("fill", "#808080")
    .attr("stroke", "#c1dea9")
    .attr("stroke-width", "4px")
d3.select("#generate-text-vector-l3-expl-vis-lines-container")
        .append("div")
            .attr("id", "generate-text-vector-l3-expl-vis-lines-1-text-container")
            .append("svg")
            .append("g")
                .attr("id", "generate-text-vector-l3-expl-vis-lines-1-text-g")
d3.select("#generate-text-vector-l3-expl-vis-lines-1-text-g")
    .append("line")
        .attr("x1", "3")
        .attr("y1", "0")
        .attr("x2", "98")
        .attr("y2", "0")
        .attr("stroke", "#c1dea9")
        .attr("stroke-width", "5px")
        .style("filter", "drop-shadow(0px 3px 3px #00000050)")
d3.select("#generate-text-vector-l3-expl-vis-lines-1-text-g")
    .append("line")
        .attr("x1", "127")
        .attr("y1", "0")
        .attr("x2", "168")
        .attr("y2", "0")
        .attr("stroke", "#c1dea9")
        .attr("stroke-width", "5px")
        .style("filter", "drop-shadow(0px 3px 3px #00000050)")
d3.select("#generate-text-vector-l3-expl-vis-lines-1-text-g")
    .append("line")
        .attr("x1", "0")
        .attr("y1", "0")
        .attr("x2", "195")
        .attr("y2", "0")
        .attr("stroke", "#c1dea9")
        .attr("stroke-width", "5px")
d3.select("#generate-text-vector-l3-expl-vis-lines-1-text-g")
    .append("circle")
    .attr("cx", "112.5")
    .attr("cy", "0")
    .attr("r", "6")
    .attr("fill", "white")
    .attr("stroke", "#c1dea9")
    .attr("stroke-width", "4px")
d3.select("#generate-text-vector-l3-expl-vis-lines-container")
        .append("div")
            .attr("id", "generate-text-vector-l3-expl-vis-lines-2-image-container")
            .append("svg")
            .append("g")
                .attr("id", "generate-text-vector-l3-expl-vis-lines-2-image-g")
d3.select("#generate-text-vector-l3-expl-vis-lines-2-image-g")
    .append("line")
        .attr("x1", "0")
        .attr("y1", "0")
        .attr("x2", "253")
        .attr("y2", "0")
        .attr("stroke", "#F9BDBD")
        .attr("stroke-width", "5px")
d3.select("#generate-text-vector-l3-expl-vis-lines-2-image-g")
    .append("line")
        .attr("x1", "96")
        .attr("y1", "0")
        .attr("x2", "137")
        .attr("y2", "0")
        .attr("stroke", "white")
        .attr("stroke-width", "5px")
d3.select("#generate-text-vector-l3-expl-vis-lines-2-image-g")
    .append("circle")
    .attr("cx", "49.5")
    .attr("cy", "0")
    .attr("r", "6")
    .attr("fill", "#808080")
    .attr("stroke", "#F9BDBD")
    .attr("stroke-width", "4px")
d3.select("#generate-text-vector-l3-expl-vis-lines-container")
        .append("div")
            .attr("id", "generate-text-vector-l3-expl-vis-lines-2-text-container")
            .append("svg")
            .append("g")
                .attr("id", "generate-text-vector-l3-expl-vis-lines-2-text-g")
d3.select("#generate-text-vector-l3-expl-vis-lines-2-text-g")
    .append("line")
        .attr("x1", "3")
        .attr("y1", "0")
        .attr("x2", "98")
        .attr("y2", "0")
        .attr("stroke", "#F9BDBD")
        .attr("stroke-width", "5px")
        .style("filter", "drop-shadow(0px 3px 3px #00000050)")
d3.select("#generate-text-vector-l3-expl-vis-lines-2-text-g")
    .append("line")
        .attr("x1", "127")
        .attr("y1", "0")
        .attr("x2", "168")
        .attr("y2", "0")
        .attr("stroke", "#F9BDBD")
        .attr("stroke-width", "5px")
        .style("filter", "drop-shadow(0px 3px 3px #00000050)")
d3.select("#generate-text-vector-l3-expl-vis-lines-2-text-g")
    .append("line")
        .attr("x1", "0")
        .attr("y1", "0")
        .attr("x2", "231")
        .attr("y2", "0")
        .attr("stroke", "#F9BDBD")
        .attr("stroke-width", "5px")
d3.select("#generate-text-vector-l3-expl-vis-lines-2-text-g")
    .append("circle")
    .attr("cx", "112.5")
    .attr("cy", "0")
    .attr("r", "6")
    .attr("fill", "white")
    .attr("stroke", "#F9BDBD")
    .attr("stroke-width", "4px")

d3.select("#generate-text-vector-l3-expl-container")
    .append("svg")
        .attr("id", "generate-text-vector-l3-expl-x-svg")
        .on("click", function () {
            d3.select("#generate-text-vector-l3-expl-container").style("display", "none")
            window.textVectorGeneratorL3Expanded = false;
        })
        .append("g")
        .attr("id", "generate-text-vector-l3-expl-x-g")
d3.select("#generate-text-vector-l3-expl-x-g")
    .append("line")
        .attr("x1","0")
        .attr("y1","0")
        .attr("x2","15")
        .attr("y2","15")
        .attr("stroke", "#bdbdbd")
        .attr("stroke-width", "1px")
d3.select("#generate-text-vector-l3-expl-x-g")
    .append("line")
        .attr("x1","0")
        .attr("y1","15")
        .attr("x2","15")
        .attr("y2","0")
        .attr("stroke", "#bdbdbd")
        .attr("stroke-width", "1px")