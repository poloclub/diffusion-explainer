window.prompts = [
    [
        "elmo floating among stars", 
        "pikachu floating among stars", 
    ],
    [
        "a pineapple by the water on a beautiful beach",
        "a baobab tree by the water on a beautiful beach",
    ],
    [
        "a vibrant renaissance portrait of an energetic noble woman, holding an iphone",
        "a muted renaissance portrait of a sad noble woman, holding an iphone",
    ],
    [
        "a Christmas tree in the middle of blue ocean, 4k, realistic", 
        "a Christmas tree in the desert, 4k, realistic", 
    ],
    [
        "a teddy bear sitting at a cafe, drinking a hot chocolate with latte art", 
        "a teddy bear sitting at a cafe, drinking a hot chocolate",
    ],
    [
        "a cute penguin sitting around a campfire in front of an igloo, anthromorphic, detailed",
        "a cute penguin sitting around a campfire in front of an igloo, anthromorphic",
    ],
    [
        "a digital painting of a white dog howling at a full moon, on a mountain, background of a dark bluish sky, fantasy, trending on artstation",
        "a digital painting of a white dog howling at a full moon, on a mountain, background of a dark bluish sky, fantasy",
    ],
    [
        "calm winter night, Thomas Kinkade",
        "calm winter night, Van Gogh",
    ],
    [
        "a painting of a beautiful witch with orange curly hair, riding a dragon, background of Himalayas, by Greg Rutkowski",
        "a painting of a beautiful witch with orange curly hair, riding a dragon, background of Himalayas",
    ],
    [
        "a cute and adorable bunny, with huge clear eyes, holding a bunch of flowers, in the style of cute pixar character",
        "a cute and adorable bunny, with huge clear eyes, holding a bunch of flowers",
    ],
    [
        "a digital painting of a boy, making a magical potion, fantasy",
        "a digital painting of a boy, making a magical potion",
    ],
    [
        "a robot reading a book, octane render",
        "a robot reading a book",
    ]
]
window.selectedPromptGroupIdx = 0;
window.selectedPrompt = window.prompts[window.selectedPromptGroupIdx][0];
window.selectedPrompt2 = window.prompts[window.selectedPromptGroupIdx][1];
window.seed_list = [1,2,3]
window.seed = 1
window.gs_list = ["0.0", "1.0", "7.0", "20.0"]
window.gs = "7.0"
window.timestep = 30
window.totalTimesteps = 50
window.playing = false;  // TODO: change as playing animation as default
window.textVectorGeneratorL2Expanded = false
window.textVectorGeneratorL3Expanded = false
window.latentDenoiserL2Expanded = false
window.latentDenoiserL3Expanded = false
window.promptDropdownExpanded = false
window.gsControlDisplayed = false
window.seedControlDisplayed = false
window.promptHovered = false;
window.hoveredPrompt = "";
window.umapNodeFadeColor = "#F0F0F0";
window.umapNodeHighlightColor1 = "#b2182b";
window.umapNodeHighlightColor2 = "#2166ac";
window.umapNodeHovered = false;
window.compare = false;