const { Configuration, OpenAIApi } = require("openai");
const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getImages(videoName, descriptions, style) {
  console.log("getImages()")
    urls = []
    try {
      if (!fs.existsSync(path.join("imgs", videoName))) {
        fs.mkdirSync(path.join("imgs", videoName));
      }
    } catch (err) {
      console.error(err);
    }
    for(const [i, description] of descriptions.entries()) {
        imageUrl = await getImageUrl(description.description, style)
        //save image to imgs/{number}.png
        const fileName = `${i}.png`;
        const file = fs.createWriteStream(path.join("imgs", videoName, `${fileName}`));
        urls.push(imageUrl)
        https.get(imageUrl, function(response) {
            response.pipe(file);
        });
    }
    return urls
}

async function getImageUrl(prompt, style) {
  try {
    const response = await openai.createImage({
      prompt: prompt + ", " + style,
      n: 1,
      size: "512x512",
    });
    imageUrl = response.data.data[0].url;
    // console.log(imageUrl)
    return imageUrl
  } catch (error) {
    console.log("Error: " + error.message)
    console.log(error)
    return "https://w7.pngwing.com/pngs/262/252/png-transparent-bright-starry-sky-starry-sky-stars-universe-thumbnail.png"
  }
}

// getImageUrl("mountains, waterfalls, sunset", "beautiful cinematic lighting, city")

// const descs =   [{
//     sentence: 'From the famous Christ the Redeemer statue overlooking the city to the stunning beaches of Copacabana and Ipanema this Brazilian city is a feast for the eyes.',
//     description: 'statue, beaches, Brazilian'
//   },
//   {
//     sentence: 'Each city has its own unique charm and offers plenty of breathtaking sights and experiences for any traveler.',
//     description: 'city, charm, sights'
//   }]

// getImages(descs, "beautiful cinematic sun lighting, city")

module.exports = {
  getImages
};
