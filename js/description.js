d3.select("#description")
    .append("h1")
        .text("What is Stable Diffusion?")
d3.select("#description")
    .append("p")
        .html('Stable Diffusion is a text-to-image model that transforms a text prompt into a high-resolution image. For example, if you type in <span style="color: var(--text2);">elmo floating among stars</span>, Stable Diffusion generates high-resolution images of exactly that - <span style="color: var(--text2);">elmo floating among stars</span> - in a few seconds! This powerful tool provides a quick and easy way to visualize your ideas.')

// How does Stable Diffusion work?
d3.select("#description")
    .append("h1")
        .text("How does Stable Diffusion work?")
d3.select("#description")
    .append("p")
        .text('Stable Diffusion first generates a vector representation of an image described in the text prompt. This image representation is then upscaled into a high-resolution image.')
d3.select("#description")
    .append("p")
        .html('You may wonder why Stable Diffusion introduces image representation instead of directly generating high-resolution images. The reason is <span style="font-style: italic;">efficient computational cost</span>. Doing most computations on representation, which summarizes an image in a compact form, significantly reduces the computational cost while maintaining high image quality.')
d3.select("#description")
    .append("p")
        .html('The image representation starts as a random noise and is refined over multiple timesteps to reach the image representation for your text prompt. The number of refining timesteps is a hyperparameter determined before refining and typically set to 50.')
d3.select("#description")
    .append("p")
        .html('We break down the image generation process of Stable Diffusion into three main steps:')
        .append("ol")
        .attr("id", "description-generation-main-steps-ol")
d3.select("#description-generation-main-steps-ol")
    .append("li")
        .html('<span style="font-weight: 500">Text Representation Generation</span>: Stable Diffusion converts a text prompt into a text representation (vector) to guide the image generation.')
d3.select("#description-generation-main-steps-ol")
    .append("li")
        .html('<span style="font-weight: 500">Image Representation Refining</span>: Starting with a random noise, Stable Diffusion refines the image representation little by little, with the guidance of the text representation. Stable Diffusion repeats the refining over multiple timesteps (50 in our Diffusion Explainer).')
d3.select("#description-generation-main-steps-ol")
    .append("li")
        .html('<span style="font-weight: 500">Image Upscaling</span>: Stable Diffusion upscales the image representation into a high-resolution image.')
d3.select("#description")
    .append("p")
        .text("Now, let's look closer into each process.")

// Text Representation Generation
d3.select("#description")
    .append("h2")
        .text("Text Representation Generation")
d3.select("#description")
    .append("p")
        .text("Text representation generation consists of tokenizing and text encoding.")
// Tokenizing
d3.select("#description")
    .append("div")
        .attr("id", "description-generation-tokenizing")
d3.select("#description-generation-tokenizing")
    .append("div")
        .attr("class", "description-subsec-title")
        .html('1. Tokenizing')
d3.select("#description-generation-tokenizing")
    .append("p")
        .html("Tokenizing is a common way to handle text input to standardize the format of the input and enable the text input to be processed by neural networks.")
d3.select("#description-generation-tokenizing")
    .append("div")
        .attr("class", "description-paragraph")
        .html(`Stable Diffusion tokenizes a text prompt into a sequence of tokens. 
        For example, it splits the text prompt <span style="color: var(--text2);">elmo floating among stars</span> 
        into the tokens “elmo,” “floating,” “among,” and “stars.”
        Also, to mark the beginning and end of the prompt, 
        Stable Diffusion adds <start> and <end> tokens at the beginning and the end of the tokens. 
        The resulting token sequence for the above example would be 
        "<"start">", "elmo," "floating," "among," “stars," and "<"end">".`)
d3.select("#description-generation-tokenizing")
    .append("p")
        .html("To ensure that all token sequences have the same length for easier computation, Stable Diffusion pads or truncates the token sequences to exactly 77 tokens. If the input prompt has fewer than 77 tokens, <end> tokens are added to the end of the sequence until it reaches 77 tokens. If the input prompt has more than 77 tokens, the last 77 tokens are retained and the rest are truncated. The choice 77 tokens was made to balance performance and computational efficiency.")
// Text encoding
d3.select("#description")
    .append("div")
        .attr("id", "description-generation-text-encoding")
d3.select("#description-generation-text-encoding")
    .append("div")
        .attr("class", "description-subsec-title")
        .html('2. Text encoding')
d3.select("#description-generation-text-encoding")
    .append("p")
        .html("Stable Diffusion converts the token sequence into a text representation (vector) that contains image-related information. This is done by using the text encoder of a neural network called CLIP. ")
d3.select("#description-generation-text-encoding")
    .append("p")
        .html("CLIP consists of an image encoder and text encoder, which encode an image and its caption into an image and text representation that are close to each other. Therefore, the text representation for a text prompt computed by CLIP’s text encoder is likely to contain information about the images described in the text prompt.")

// Image Representation Refining
d3.select("#description")
    .append("h2")
        .text("Image Representation Refining")
d3.select("#description")
    .append("p")
        .text("Stable Diffusion generates an image representation that adheres to the text prompt by refining a randomly initialized noise over multiple timesteps. Each refinement step involves iteratively predicting and removing noise to gradually improve the quality of the image representation.")
// Noise Prediction
d3.select("#description")
    .append("div")
        .attr("id", "description-generation-noise-prediction")
d3.select("#description-generation-noise-prediction")
    .append("div")
        .attr("class", "description-subsec-title")
        .html('1. Noise Prediction')
d3.select("#description-generation-noise-prediction")
    .append("p")
        .html("At each timestep, a neural network UNet predicts noise in the image representation of the current timestep. UNet takes three inputs:")
// TODO: ordered list
d3.select("#description-generation-noise-prediction")
    .append("p")
        .html("In other words, UNet predicts a prompt-specific noise in the current image representation under the guidance of the text representation of the text prompt and timestep.")
d3.select("#description-generation-noise-prediction")
    .append("p")
        .html(`However, even though we condition the noise prediction with the text prompt, 
        the generated image representation may not adhere strongly enough to the text prompt. 
        To improve the adherence, 
        Stable Diffusion additionally predicts <span style="color: #a0a0a0;">generic noise conditioned on an empty prompt ("")</span> 
        as well as <span style="color: var(--text2)">prompt-specific noise conditioned on the given text prompt</span>. 
        The final noise prediction is a weighted sum of these two noises, 
        with the weights controlled by the hyperparameter <span style="font-weight: 500;">guidance scale</span>:`)
d3.select("#description-generation-noise-prediction")
    .append("p")
    .attr("class", "description-equation")
    .html(`guidance scale x prompt-specific noise + (1-guidance scale) x generic noise`)
d3.select("#description-generation-noise-prediction")
    .append("p")
    .html(`A guidance scale of 0 means no adherence to the text prompt, while a guidance scale of 1 means using only the prompt-specific noise without introducing generic noise. Larger guidance scales result in stronger adherence to the text prompt. To see how the introduction of generic noise and guidance scale enhances image quality, you can check out our Diffusion Explainer by setting the guidance scale to 1 or 7.`)
// Noise Removal
d3.select("#description")
    .append("div")
        .attr("id", "description-generation-noise-removal")
d3.select("#description-generation-noise-removal")
    .append("div")
        .attr("class", "description-subsec-title")
        .html('2. Noise Removal')
d3.select("#description-generation-noise-removal")
    .append("p")
        .html("After predicting the noise, Stable Diffusion removes the noise from the image representation of the current timestep. To refeine the image representation gradually, Stable Diffusion scales down the predicted noise so that only a small amount of noise is removed from the image representation at each timestep.")
d3.select("#description-generation-noise-removal")
    .append("p")
        .html("The amount of noise to be removed at each timestep is determined by a scheduler, which provides a small number to be multiplied by the noise for downscaling. The scheduler takes into account the total number of timesteps to determine the scaling factor. The downscaled noise is then subtracted from the image representation of the current timestep to obtain the refined representation, which becomes the image representation of the next timestep:")
d3.select("#description-generation-noise-prediction")
    .append("p")
    .attr("class", "description-equation")
    .html(`image representation of timestep t+1 (refined) = image representation of timestep t - downscaled noise`)

// Image Upscaling
d3.select("#description")
    .append("h2")
        .text("Image Upscaling")
d3.select("#description")
    .append("p")
        .text("Stable Diffusion uses a neural network called Decoder to upscale an image representation into a high-resolution image. Since the refined image representation has been denoised with the guidance of the text prompt, the resulting high-resolution image is expected to adhere to the text prompt.")

// What can we change
d3.select("#description")
    .append("h1")
        .text("What can we change?")
d3.select("#description")
    .append("p")
        .text("You have control over text prompt and hyperparameters in our Diffusion Explainer to change the generated images:")
// TODO: unordered list
d3.select("#description")
    .append("p")
        .text("Additionally, there are other hyperparameters that are not included in the Diffusion Explainer, such as the total number of timesteps, image size, and the type of scheduler.")

// How implemented?
d3.select("#description")
    .append("h1")
        .text("How is Diffusion Explainer implemented?")
d3.select("#description")
    .append("p")
        .text("We implement the interactive visualizations for Diffusion Explainer using Javascript and D3.js.")

// How implemented?
d3.select("#description")
    .append("h1")
        .text("Who developed the Diffusion Explainer?")
d3.select("#description")
    .append("p")
        .html(`Diffusion Explainer was developed by 
        Seongmin Lee, 
        Ben Hoover, 
        Hendrik Strobelt, 
        Jay Wang, 
        Anthony Peng, 
        Austin Wright, 
        Kevin Li, 
        Haekyu Park, 
        Alex Yang, 
        and Polo Chau.`)