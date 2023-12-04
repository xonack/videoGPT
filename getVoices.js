//input script --> get voice
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const dotenv = require('dotenv');

dotenv.config();
const voice_id = 'TxGEqnHWrfWFTfGW9XjX';
const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;

async function getVoices(videoName) {
    console.log("getVoices()")
    // read in splitScript csv
    csvPath = path.join("assets", "csvs", videoName, `${videoName}.csv`)
    const csvString = fs.readFileSync(csvPath, 'utf-8');
    const records = parse.parse(csvString, { columns: true, delimiter: ';', relax_quotes: true });
    voices = []
    try {
        if (!fs.existsSync(path.join("assets", "mp3", videoName))) {
          fs.mkdirSync(path.join("assets", "mp3", videoName));
        }
      } catch (err) {
        console.error(err);
      }
    for (const [i, record] of records.entries()) {
        voice = await getVoice(record.Script, i, videoName)
        voices.push(voice)
    }
    return voices
}



async function getVoice(message, index, fileName) {
    try {
        const response = await fetch(url,
        {
            method: "POST",
            headers: {
                "accept": 'mp3/mpeg',
                "Content-Type": 'application/json',
                "xi-api-key": process.env.ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
                text: message,
                voice_settings: {
                    stability: 0,
                    similarity_boost: 0,
                }
            })
        })

        if (!response.ok) {
            console.log("something went wrong!")
            console.log(JSON.stringify(response))
            return
        }
    
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFile(path.join("assets", "mp3", fileName, `${index}.mp3`), buffer, (err) => {
            if (err) throw err;
            console.log('Voice mp3 file saved!');
        });
    
    } catch (error) {
        console.log(JSON.stringify({ error: error.message}))
    }
}

// getVoices("planets")

module.exports = {
    getVoices
  };
