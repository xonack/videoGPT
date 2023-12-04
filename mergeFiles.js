const ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');

async function mergePngAndMp3(videoName, index) {
    try {
        if (!fs.existsSync(path.join("assets", "mp4", videoName))) {
          fs.mkdirSync(path.join("assets", "mp4", videoName));
        }
    } catch (err) {
        console.error(err);
    }
    console.log("mergeFiles: ", videoName, index)
    const mp3FilePath = path.join("assets", "mp3", videoName, `${index}.mp3`)
    const pngFilePath = path.join("assets", "imgs", videoName, `${index}.png`);
    const outputFile = path.join("assets", "mp4", videoName, `${index}.mp4`);
    console.log("outputFile: ", outputFile);
    ffmpeg()
        .input(mp3FilePath)
        .input(pngFilePath)
        // .complexFilter([
        //     '[1:v]scale=1280:720[bg];[0:a][bg]overlay=(W-w)/2:(H-h)/2'
        // ])
        .output(outputFile)
        .outputOptions('-c:a copy')
        .run();
}

async function mergeMp4s(videoName, componentCount) {
    const outputFile = path.join("final", videoName, `${videoName}-merge.mp4`);
    // const outputFile = path.resolve(__dirname, 'final', videoName, `${videoName}.mp4`);
    console.log("outputFile: ", outputFile);
    const inputFiles = [];
    for (let i = 0; i < componentCount; i++) {
        inputFiles.push(path.join("assets", "mp4", videoName, `${i}.mp4`));
    }

    // console.log(outputFile)
    const command = ffmpeg();

    // Add each input file to the command
    inputFiles.forEach(file => {
        command.mergeAdd(file);
    });

    // Concatenate the input files together
    command
    .mergeToFile(outputFile,'./temp')
    .on('error', function(err) {
        console.log('Error ' + err.message);
    })
    .on('end', function() {
        console.log('Finished!');
    });
}

function concatMp4s(videoName, componentCount) {
    console.log("concatMp4s()")
    try {
        if (!fs.existsSync(path.join("final", videoName))) {
          fs.mkdirSync(path.join("final", videoName));
        }
    } catch (err) {
        console.error(err);
    }
    const outputFile = path.join("final", videoName, `${videoName}-concat.mp4`);
    const inputFiles = [];
    for (let i = 0; i < componentCount; i++) {
        inputFiles.push(path.join("assets", "mp4", videoName, `${i}.mp4`));
    }

    var listFileName = 'list.txt', fileNames = '';

    // ffmpeg -f concat -i mylist.txt -c copy output
    inputFiles.forEach(function(fileName, index){
        fileNames = fileNames + 'file ' + '' + fileName + '\n';
    });

    fs.writeFileSync(listFileName, fileNames);

    try {
        const command = ffmpeg();

        command.input(listFileName)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions('-c copy') 
        .save(outputFile);
    } catch (error) {
        console.log("Error: ", error)
    }
    

}

function mergeMp3s(videoName, componentCount) {
    const outputFile = path.join("final", videoName, `${videoName}.mp3`);
    const inputFiles = [];
    for (let i = 0; i < componentCount; i++) {
        inputFiles.push(path.join("assets", "mp3", videoName, `${i}.mp3`));
    }

    const command = ffmpeg();

    // Add each input file to the command
    inputFiles.forEach(file => {
        command.addInput(file);
    });

    // Concatenate the input files together
    command
    .mergeToFile(outputFile,'./temp', { mp3Codec: 'copy' })
    // .mp3Codec('copy')
    .on('error', function(err) {
        console.log('Error ' + err.message);
    })
    .on('end', function() {
        console.log('Finished!');
    });
}

//no mp3
function mergeVideoAndmp3(videoInput, mp3Input, outputFile) {
    ffmpeg({ source: videoInput})
        .addInput(mp3Input)
        .saveToFile(outputFile)
        // .outputOptions('-c:a copy')
        // .run();
}

// concatMp4s(videoName, count);

module.exports = {
    mergePngAndMp3,
    concatMp4s
};
