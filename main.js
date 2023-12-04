const fs = require('fs');
const path = require('path');
const { getDescriptions } = require("./getDescriptions");
const { getImages } = require("./getImages");
const { getScript } = require("./getScript");
const { getVoices } = require("./getVoices");
const { concatMp4s, mergePngAndMp3 } = require("./mergeFiles");
const { splitScript } = require("./splitScript");

async function main(videoName, system, topic, script_specs, image_theme) {
    // script = await getScript(videoName, system, topic, script_specs)
    // // // split script
    // split = await splitScript(videoName)
    // get voices 
    // voices = await getVoices(videoName)
    // get descriptions
    // descriptions = await getDescriptions(videoName)
    // // // // get images from descriptions
    imageUrls = await getImages(videoName, topic, image_theme)
    
    // const componentCount = 7
    components = JSON.parse(fs.readFileSync(path.join("assets", "descriptions", videoName, `${videoName}.json`), 'utf8'));
    const componentCount = components.length
    for(let i = 0; i < componentCount; i++) {
        await mergePngAndMp3(videoName, i)
    }
    // // // concat mp4s
    // // //timeout 500 ms
    await setTimeout(() => {
        console.log("waiting 500 ms")
        concatMp4s(videoName, componentCount)
    }, 500);
    // await concatMp4s(videoName, componentCount)
}

const TITLE = "Alexander"
const SYSTEM = `a professional 7 sentence video script writer specialized on presenting inspirational heroic historcal figures. 
Do not include annotations on structure or characters.

example input 1:
Alexander the Great

example output 1:
Hey there, fellow travelers! Today we are going to talk about the single most beautiful city in the world. And the winner is... drumroll please... Venice! Yes, Venice, Italy. There's something truly magical about this city that's built on water. The canals, the gondolas, the maze-like streets, the stunning architecture... it all adds up to create a truly unique and unforgettable experience.  So hop on a plane or train and go see it for yourself. 
`
const TOPIC = 'Alexander the Great'
const SCRIPT_SPECS =  ''
const IMAGE_THEME = "Alexander the Great, Glory, Warrior, heroic, cinematic lighting"

main(TITLE, SYSTEM, TOPIC, SCRIPT_SPECS, IMAGE_THEME);

// const IMAGE_THEME = "cinematic golden hour lighting of the most beautiful city in the world"