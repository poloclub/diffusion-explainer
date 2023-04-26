window.prompts = [
    ["spiderman in space", "winnie the pooh in space"],
    ["a pineapple by the water on a beautiful beach", "a baobab tree by the water on a beautiful beach"],
    ["a vibrant renaissance portrait of an energetic noble woman, holding an iphone", "a muted renaissance portrait of a sad noble woman, holding an iphone"],
    ["a castle by a sea, trending on artstation", "a castle by a sea"],
    ["a cute and lovely 4-year-old baby girl with a magical power, cosmic energy, lovely smile, digital painting, hyperrealistic, highly detailed, sharp, masterpiece", "a cute and lovely 4-year-old baby girl with a magical power, cosmic energy, lovely smile, digital painting, hyperrealistic"],
    ["a cute and adorable bunny, with huge clear eyes, holding a bunch of flowers, in the style of cute pixar character", "a cute and adorable bunny, with huge clear eyes, holding a bunch of flowers"],
    ["a water painting of a boy, making a magical potion, highly detailed, fantasy", "a water painting of a boy, making a magical potion, highly detailed"],
    ["a cowboy cyborg riding a robot horse, atompunk", "a cowboy cyborg riding a robot horse"],
    ["a painting of a beautiful witch with orange curly hair, riding a dragon, background of Himalayas, by Greg Rutkowski", "a painting of a beautiful witch with orange curly hair, riding a dragon, background of Himalayas"],
    ["calm winter night, Thomas Kinkade", "calm winter night, Van Gogh"],
    ["a cute rabbit knight, big eyes, holding up a carrot, zootopia", "a cute rabbit knight, holding up a carrot, zootopia"],
    ["a cute panda playing the guitar in a bamboo forest", "a cute panda playing the guitar"],
    ["a very very very very very beautiful cityscape", "a beautiful cityscape"],
]
window.keywordLoc = [
    [[0,1],]
]
window.selectedPromptGroupIdx = 0;
window.selectedPrompt = window.prompts[window.selectedPromptGroupIdx][0];
window.selectedPrompt2 = window.prompts[window.selectedPromptGroupIdx][1];
window.seed_list = [1,2,3]
window.seed = 2
window.gs_list = ["0.0", "1.0", "7.0", "20.0"]
window.gs = "7.0"
window.timestep = 30
window.totalTimesteps = 50
window.playing = true;  
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
window.firstCompare = true;