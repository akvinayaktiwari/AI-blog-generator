// pages/api/generate-blog.js



import axios from 'axios';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { AssemblyAI } from 'assemblyai'
import { tmpdir } from 'os';
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)

const genAI = new GoogleGenerativeAI(process.env.API_KEY);



// const mediaPath = path.join(process.cwd(), 'tmp');
// if (!fs.existsSync(mediaPath)) {
//     fs.mkdirSync(mediaPath, { recursive: true });
// }

// async function downloadAudio(link) {
//     const info = await ytdl.getInfo(link);
//     const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
//     // Save the file in the 'media' directory
//     const output = path.join(mediaPath, `${info.videoDetails.videoId}.mp3`);
    
//     return new Promise((resolve, reject) => {
//         const stream = ytdl(link, { format })
//             .pipe(fs.createWriteStream(output));

//         stream.on('finish', () => resolve(output));
//         stream.on('error', error => {
//             console.error('Error downloading audio:', error);
//             reject(error);
//         });
//     });
// }

const mediaPath = '/tmp'; // Use the writable temp directory provided by Vercel

async function downloadAudio(link) {
    const info = await ytdl.getInfo(link);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    // Save the file in the 'media' directory
    const output = path.join(mediaPath, `${info.videoDetails.videoId}.mp3`);
    
    return new Promise((resolve, reject) => {
        const stream = ytdl(link, { format })
            .pipe(fs.createWriteStream(output));

        stream.on('finish', () => {
            console.log(`Download finished: ${output}`);
            resolve(output);
        });
        stream.on('error', error => {
            console.error('Error downloading audio:', error);
            reject(error);
        });
    });
}

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});


export default async function handler(req, res) {
    const { link } = req.body;

    try {
        const FILE_URL = await downloadAudio(link);
        const data = {
        audio_url: FILE_URL
        }
        // console.log('hello',FILE_URL)

        // const run = async () => {
        const transcript = await client.transcripts.create(data);
        // console.log(transcript.text)
        // };

        // run();
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = `Based on the following transcript from a YouTube video, write a comprehensive blog article with suitable title, write it based on the transcript, but don't make it look like a youtube video, make it look like a proper blog article:\n\n${transcript.text}\n\nArticle: {return in markdown format}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
         fs.unlinkSync(FILE_URL);
        res.status(200).json({ content: text });
    } catch (error) {
        console.error('Error processing audio:', error);
        res.status(500).json({ error: "Failed to process your request." });
    }
};


