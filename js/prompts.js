window.prompts = [
    ["a cute and adorable bunny, with huge clear eyes, holding a bunch of flowers, in the style of cute pixar character", "a cute and adorable bunny, with huge clear eyes, holding a bunch of flowers"],
    ["a very very very very very beautiful cityscape", "a beautiful cityscape"],
    ["a vibrant renaissance portrait of an energetic noble woman, holding an iphone", "a muted renaissance portrait of a sad noble woman, holding an iphone"],
    ["a cute panda playing the guitar in a bamboo forest", "a cute panda playing the guitar"],
    ["a pineapple by the water on a beautiful beach", "a baobab tree by the water on a beautiful beach"],
    ["spiderman in space", "winnie the pooh in space"],
    ["a castle by a sea, trending on artstation", "a castle by a sea"],
    ["a cute and lovely 4-year-old baby girl with a magical power, cosmic energy, lovely smile, digital painting, hyperrealistic, highly detailed, sharp, masterpiece", "a cute and lovely 4-year-old baby girl with a magical power, cosmic energy, lovely smile, digital painting, hyperrealistic"],
    ["a water painting of a boy, making a magical potion, highly detailed, fantasy", "a water painting of a boy, making a magical potion, highly detailed"],
    ["a cowboy cyborg riding a robot horse, atompunk", "a cowboy cyborg riding a robot horse"],
    ["calm winter night, Thomas Kinkade", "calm winter night, Van Gogh"],
    ["a cute rabbit knight, big eyes, holding up a carrot, zootopia", "a cute rabbit knight, holding up a carrot, zootopia"],
    ["a cute puppy, in the style of Albert Marquet", "a cute puppy"],
]
window.promptsHtmlCode = [
    ["a cute and adorable bunny, with huge clear eyes, holding a bunch of flowers, <span class='prompt-keyword'>in the style of cute pixar character</span>", "a cute and adorable bunny, with huge clear eyes, holding a bunch of flowers"],
    ["a <span class='prompt-keyword'>very very very very very</span> beautiful cityscape", "a beautiful cityscape"],
    ["a <span class='prompt-keyword'>vibrant</span> renaissance portrait of an <span class='prompt-keyword'>energetic</span> noble woman, holding an iphone", "a <span class='prompt-keyword'>muted</span> renaissance portrait of a <span class='prompt-keyword'>sad</span> noble woman, holding an iphone"],
    ["a cute panda playing the guitar <span class='prompt-keyword'>in a bamboo forest</span>", "a cute panda playing the guitar"],
    ["a <span class='prompt-keyword'>pineapple</span> by the water on a beautiful beach", "a <span class='prompt-keyword'>baobab tree</span> by the water on a beautiful beach"],
    ["<span class='prompt-keyword'>spiderman</span> in space", "<span class='prompt-keyword'>winnie the pooh</span> in space"],
    ["a castle by a sea, <span class='prompt-keyword'>trending on artstation</span>", "a castle by a sea"],
    ["a cute and lovely 4-year-old baby girl with a magical power, cosmic energy, lovely smile, digital painting, hyperrealistic, <span class='prompt-keyword'>highly detailed, sharp, masterpiece</span>", "a cute and lovely 4-year-old baby girl with a magical power, cosmic energy, lovely smile, digital painting, hyperrealistic"],
    ["a water painting of a boy, making a magical potion, highly detailed, <span class='prompt-keyword'>fantasy</span>", "a water painting of a boy, making a magical potion, highly detailed"],
    ["a cowboy cyborg riding a robot horse, <span class='prompt-keyword'>atompunk</span>", "a cowboy cyborg riding a robot horse"],
    ["calm winter night, <span class='prompt-keyword'>Thomas Kinkade</span>", "calm winter night, <span class='prompt-keyword'>Van Gogh</span>"],
    ["a cute rabbit knight, <span class='prompt-keyword'>big eyes</span>, holding up a carrot, zootopia", "a cute rabbit knight, holding up a carrot, zootopia"],
    ["a cute puppy, <span class='prompt-keyword'>in the style of Albert Marquet</span>", "a cute puppy"],
]
window.selectedPromptGroupIdx = 0;
window.selectedPrompt = window.prompts[window.selectedPromptGroupIdx][0];
window.selectedPrompt2 = window.prompts[window.selectedPromptGroupIdx][1];
window.selectedPromptHtmlCode = window.promptsHtmlCode[window.selectedPromptGroupIdx][0];
window.selectedPromptHtmlCode2 = window.promptsHtmlCode[window.selectedPromptGroupIdx][1];
window.seed_list = [1,2,3]
window.seed = 1
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
window.gsDropdownExpanded = false
window.seedDropdownExpanded = false
window.gsControlDisplayed = true
window.seedControlDisplayed = true
window.promptHovered = false;
window.gsHovered = false;
window.seedHovered = false;
window.hoveredPrompt = "";
window.hoveredPrompt2 = "";
window.hoveredGs = -1;
window.hoveredSeed = -1;
window.umapNodeFadeColor = "#F0F0F0";
window.umapNodeHighlightColor1 = "#b2182b";
window.umapNodeHighlightColor2 = "#2166ac";
window.umapNodeHovered = false;
window.compare = false;
window.firstCompare = true;
window.showVisualization = true;
window.textEncoderClicked = false;