const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getScript(videoName, system, idea, script_specs) {
  console.log("getScript()")
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: idea + " " + script_specs }
    ],
  });
  // console.log(response.data.choices[0].message.content + '\n');

  script = response.data.choices[0].message.content
  // Write the file to disk
  try {
    if (!fs.existsSync(path.join("script", videoName))) {
      fs.mkdirSync(path.join("script", videoName));
    }
  } catch (err) {
    console.error(err);
  }

  filePath = path.join("script", videoName, `${videoName}.txt`)
  fs.writeFileSync(filePath, script);
  console.log('Script txt file saved at ' + filePath);

  return script
}

// getScript('citiesScript');

module.exports = {
  getScript
};