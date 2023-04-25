const ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');

async function mergePngAndMp3(videoName, index) {
    console.log("mergeFiles: ", videoName, index)
    const mp3FilePath = path.join("audio", videoName, `${index}.mp3`)
    const pngFilePath = path.join("imgs", videoName, `${index}.png`);
    const outputFile = path.join("mp4", videoName, `${index}.mp4`);
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
        inputFiles.push(path.join("mp4", videoName, `${i}.mp4`));
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
    const outputFile = path.join("final", videoName, `${videoName}-concat.mp4`);
    const inputFiles = [];
    for (let i = 0; i < componentCount; i++) {
        inputFiles.push(path.join("mp4", videoName, `${i}.mp4`));
    }

    var listFileName = 'list.txt', fileNames = '';

    // ffmpeg -f concat -i mylist.txt -c copy output
    inputFiles.forEach(function(fileName, index){
        fileNames = fileNames + 'file ' + '' + fileName + '\n';
    });

    fs.writeFileSync(listFileName, fileNames);

    const command = ffmpeg();

    command.input(listFileName)
    .inputOptions(['-f concat', '-safe 0'])
    .outputOptions('-c copy') 
    .save(outputFile);

}

function mergeMp3s(videoName, componentCount) {
    const outputFile = path.join("final", videoName, `${videoName}.mp3`);
    const inputFiles = [];
    for (let i = 0; i < componentCount; i++) {
        inputFiles.push(path.join("audio", videoName, `${i}.mp3`));
    }

    const command = ffmpeg();

    // Add each input file to the command
    inputFiles.forEach(file => {
        command.addInput(file);
    });

    // Concatenate the input files together
    command
    .mergeToFile(outputFile,'./temp', { audioCodec: 'copy' })
    // .audioCodec('copy')
    .on('error', function(err) {
        console.log('Error ' + err.message);
    })
    .on('end', function() {
        console.log('Finished!');
    });
}

//no audio
function mergeVideoAndAudio(videoInput, audioInput, outputFile) {
    ffmpeg({ source: videoInput})
        .addInput(audioInput)
        .saveToFile(outputFile)
        // .outputOptions('-c:a copy')
        // .run();
}


const videoName = "planets";
const count = 23;
mp3s = [];
pngs = [];

// concatMp4s(videoName, count);

module.exports = {
    concatMp4s
};
