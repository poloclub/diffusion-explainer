import {reduceTextVectorGeneratorL2, drawTokens, drawTextVectors} from "./function.js"

document.addEventListener("keydown", (e) => {
    if (window.textVectorGeneratorL2Expanded && !window.textVectorGeneratorL3Expanded && e.key == "Escape") reduceTextVectorGeneratorL2();
})

document.addEventListener("mouseup", (e) => {
    if (window.textVectorGeneratorL2Expanded && !window.textVectorGeneratorL3Expanded) {
        let textVectorGeneratorBox = document.getElementById("text-vector-generator-container").getBoundingClientRect()
        let left = textVectorGeneratorBox.x
        let right = textVectorGeneratorBox.x + textVectorGeneratorBox.width
        let top = textVectorGeneratorBox.y
        let bottom = textVectorGeneratorBox.y + textVectorGeneratorBox.height
        let descriptionBox = document.getElementById("description").getBoundingClientRect()
        if (e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {}
        else if (e.clientY > descriptionBox.y) {}
        else {reduceTextVectorGeneratorL2();}
    }
})

let textGeneratorL2ExplDiv = d3.select("#architecture-container")
    .append("div")
    .attr("id", "text-vector-generator-l2-expl-container")

// leave button
textGeneratorL2ExplDiv
    .append("img") 
        .attr("id", "text-vector-generator-l2-expl-reduce-button")
        .attr("src", "./icons/reduce.svg")
        .attr("alt", "Reduce SVG")
        .attr("height", `20px`)
        .on("click", reduceTextVectorGeneratorL2)

// tokenizer
textGeneratorL2ExplDiv.append("div")
    .attr("id", "text-vector-generator-l2-tokenizer-container")
    .text("Tokenizer")

textGeneratorL2ExplDiv
    .append("div")
        .attr("id", "text-vector-generator-l2-tokenizer-text-encoder-arrow-container")
        .append("svg")
            .attr("id", "text-vector-generator-l2-tokenizer-text-encoder-arrow-svg")
            .append("g")
            .append("line")
                .attr("id", "text-vector-generator-l2-tokenizer-text-encoder-arrow")
                .attr("class", "architecture-arrow-text")
                .attr("x1", "0")
                .attr("x2", "128")
                .attr("y1", "10")
                .attr("y2", "10")
                .attr("marker-end", "url(#architecture-arrow-text-head)")
textGeneratorL2ExplDiv
    .append("div")
        .attr("id", "text-vector-generator-l2-tokenizer-out-expl-text")
        .text("77 tokens")

// Arrow and explain truncate/padding
textGeneratorL2ExplDiv
    .append("div")
        .attr("id", "text-vector-generator-l2-tokenizer-out-detailed-expl-container")
        .append("svg")
            .attr("id", "text-vector-generator-l2-tokenizer-out-detailed-expl-arrow")
            .append("g")
            .append("path")
                .attr("d", "M 15 10 C 20 17, 35 17, 40 10")
                .attr("stroke", "#bdbdbd")
                .attr("fill", "transparent")
d3.select("#text-vector-generator-l2-tokenizer-out-detailed-expl-arrow g")
    .append("path")
    .attr("d", "M 40 10 l -3.5 1")
    .attr("stroke", "#bdbdbd")
    .attr("fill", "transparent")
d3.select("#text-vector-generator-l2-tokenizer-out-detailed-expl-arrow g")
    .append("path")
    .attr("d", "M 40 10 l -1 4")
    .attr("stroke", "#bdbdbd")
    .attr("fill", "transparent")
d3.select("#text-vector-generator-l2-tokenizer-out-detailed-expl-container")
    .append("div")
        .attr("id", "text-vector-generator-l2-tokenizer-out-detailed-expl-text")
        .text("Truncate if prompt consists of more than 77 tokens Pad with <end> if less than 77 tokens")

// Add tokens (implement this at function and import)
textGeneratorL2ExplDiv
    .append("div")
    .attr("id", "text-vector-generator-l2-tokens-container")
drawTokens()

// Text Encoder
textGeneratorL2ExplDiv.append("div")
    .attr("id", "text-vector-generator-l2-text-encoder-container")
    .text("Text Encoder")
    .on("mouseover", () => {
        d3.select(`#text-vector-generator-l2-text-encoder-container`).style("background-color", "var(--text1)")
    })
    .on("mouseout", () => {
        d3.select(`#text-vector-generator-l2-text-encoder-container`).style("background-color", "var(--text0)")
    })
    .on("click", (e) => {
        window.textVectorGeneratorL3Expanded = true;
        console.log(e)
        d3.select("#generate-text-vector-l3-expl-container")
            .style("display", "block")
            .style("left", `403px`)
            .style("top", `26px`)
    })
textGeneratorL2ExplDiv
    .append("div")
        .attr("id", "text-vector-generator-l2-text-encoder-expl-text")
        .text("768D vector for each token")
textGeneratorL2ExplDiv
    .append("div")
        .attr("id", "text-vector-generator-l2-vectors-container")
drawTextVectors()

// covers
d3.select("#architecture-wrapper").append("div").attr("id", "text-vector-generator-l2-left-cover")
d3.select("#architecture-wrapper").append("div").attr("id", "text-vector-generator-l2-right-cover")

