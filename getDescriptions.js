// for each row in CSV file, get an image
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const dotenv = require('dotenv');

dotenv.config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const SYSTEM = ` you are an AI that or a sentence input returns a 3 word description of an image that would serve as backgroud for a video. You are NOT expressing opinions, but describing the scene. 
Each description is composed of 3 keywords should be separated by commas.

example input 1: 
"Hey there fellow travelers, today we're going to talk about one of the most debated topics in the world of travel - the single most beautiful city in the world. Now, I know this is a hotly contested topic, and everyone has their own preferences, but hear me out on this one."

example output 1: 
wave, smile, splitting path


example input 2: 
"From the stunning Eiffel Tower to the picturesque neighborhoods, there's something for everyone in this beautiful city."

example output 2: 
beauty, louvre, architecture


example input 3: 
"And who can resist the delicious food and wine that Italy is famous for?"

example output 3: 
italy, wine, food


example input 4: 
"Where would you like to ride your red bike to visit next?"

example output 4: 
bike, red, question mark
`

async function getDescriptions(videoName) {
console.log("getDescriptions()")
// read in splitScript csv
csvPath = path.join("csvs", videoName, `${videoName}.csv`)
const csvString = fs.readFileSync(csvPath, 'utf-8');
console.log("read csv from: " + csvPath)
const records = parse.parse(csvString, { columns: true, delimiter: ';' });
// for split script csv, get descriptions
descriptions = []

for(const record of records) {
    description = await getDescription(record.Script)
    mapping = {
        sentence: record.Script,
        description: description
    }
    descriptions.push(mapping)
}

console.log(descriptions)
return descriptions

}

async function getDescription(sentence) {
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: sentence }
        ],
    });
    // console.log(response.data.choices[0].message.content + '\n');
    return response.data.choices[0].message.content
}

// getDescriptions("mainScript")

module.exports = {
    getDescriptions
  };