// input script --> output: script split semantically with background description, and render time
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const SYSTEM = `split the following input of a video script into sections by punctuation marks (".", "!" and "?"). 
The outputs should be a CSV with a number index, the section of the input script. 
The csv delimiter is a semicolon (";")

example input 1: 
Hey there fellow travelers, today we're going to talk about one of the most debated topics in the world of travel - the single most beautiful city in the world. Now, I know this is a hotly contested topic, and everyone has their own preferences, but hear me out on this one.

example output 1: 
Index,Script
0;Hey there fellow travelers, today we're going to talk about one of the most debated topics in the world of travel - the single most beautiful city in the world. 
1;Now, I know this is a hotly contested topic! 
2;Everyone has their own preferences, but hear me out on this one.


example input 2: 
Hi, My name is Bob! How are you my dear human friend? 
Together, you and I, will build a CSV file.
After work, I like to go for a run in the park, grab a quick bite to eat, and then spend the evening relaxing with a good book.

example output 2: 
Index,Script
0;Hi, My name is Bob!
1;How are you my dear human friend?
2;Together, you and I, will build a CSV file.
3;After work, I like to go for a run in the park, grab a quick bite to eat, and then spend the evening relaxing with a good book.
`

async function splitScript(videoName) {
  console.log("splitScript()")
  readPath = path.join("assets", "script", videoName, `${videoName}.txt`)
  let inputScript = fs.readFileSync(readPath, 'utf8');
  console.log("script read from: " + readPath)
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: inputScript }
    ],
  });
  // console.log(response.data.choices[0].message.content + '\n');
  data = response.data.choices[0].message.content;
  // write to fs
  try {
    if (!fs.existsSync(path.join("assets", "csvs", videoName))) {
      fs.mkdirSync(path.join("assets", "csvs", videoName));
    }
  } catch (err) {
    console.error(err);
  }
  fs.writeFileSync(path.join("assets", "csvs", videoName, `${videoName}.csv`), data);
  console.log('The split script csv has been saved!');

  return data
}

// splitScript("planets");

module.exports = {
  splitScript
};
