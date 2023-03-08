window.prompts = [
    [
        "elmo floating among stars", 
        "pikachu floating among stars", 
    ],
    [
        "a teddy bear sitting at a cafe, drinking a hot chocolate with beautiful latte art",
        "a teddy bear sitting at a cafe, drinking a hot chocolate with beautiful latte art, trending on artstation",
    ],
    [
        "a pineapple tree on a beach",
        "a pineapple tree on a beach, trending on artstation"
    ],
    [
        "a cute penguin sitting around a campfire in front of an igloo, anthromorphic, detailed",
        "a cute penguin sitting around a campfire in front of an igloo, anthromorphic"
    ],
    [
        "a white Bichon howling at a moon on a mountain, background of a dark bluish sky with a full moon",  
        "a white Bichon howling at a moon on a mountain, background of a dark bluish sky with a full moon, fantasy", 
    ],
    [
        "a cat reading a book on a bench in a park",  
        "a cat reading a book on a bench in a park, anthromorphic",
    ],
    [
        "a Christmas tree in the middle of blue ocean, 4k, realistic", 
        "a Christmas tree in the desert, 4k, realistic", 
    ],
    [
        "calm winter night, Thomas Kinkade", 
        "calm winter night, Van Gogh", 
    ],
]
window.selectedPromptGroupIdx = 0;
window.selectedPrompt = window.prompts[window.selectedPromptGroupIdx][0];
window.seed = 1
window.gs = "7.0"
window.timestep = 30
window.playing = false;  // TODO: change as playing animation as default
window.textVectorGeneratorL2Expanded = false
window.textVectorGeneratorL3Expanded = false
window.latentDenoiserL2Expanded = false
window.latentDenoiserL3Expanded = false
window.promptDropdownExpanded = false
window.gsControlDisplayed = false
window.seedControlDisplayed = false