const { getDescriptions } = require("./getDescriptions");
const { getImages } = require("./getImages");
const { getScript } = require("./getScript");
const { getVoices } = require("./getVoices");
const { concatMp4s } = require("./mergeFiles");
const { splitScript } = require("./splitScript");

async function main(videoName, system, topic, script_specs, image_theme) {
    // script = await getScript(videoName, system, topic, script_specs)
    // split script
    // split = await splitScript(videoName)
    // get voices 
    voices = await getVoices(videoName)
    // // // // get descriptions
    // descriptions = await getDescriptions(videoName)
    // // // get images from descriptions
    // imageUrls = await getImages(videoName, descriptions, image_theme)
    // // // concat mp4s
    // await concatMp4s(videoName, descriptions.length)
}

const TITLE = "planets"
const SYSTEM = `a video script dialogue writer specialized on traveling as a digital nomad. 
Write the dialogue script without commas. 
Do not include annotations on structure or characters.`
const TOPIC = 'the single most beautiful city in the world.'
const SCRIPT_SPECS =  'Script written without commas (,)'
const IMAGE_THEME = "drone footage of planet surface"

main(TITLE, SYSTEM, TOPIC, SCRIPT_SPECS, IMAGE_THEME);

// const IMAGE_THEME = "cinematic golden hour lighting of the most beautiful city in the world"