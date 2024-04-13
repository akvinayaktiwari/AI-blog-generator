// pages/api/transcribe.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const api_key = process.env.ASSEMBLYAI_API_KEY;
      const { data: uploadResponse } = await axios.post('https://api.assemblyai.com/v2/upload', req.body, {
        headers: {
          'authorization': api_key,
          'Transfer-Encoding': 'chunked'
        },
      });

      const { upload_url } = uploadResponse;

      const { data: transcriptResponse } = await axios.post('https://api.assemblyai.com/v2/transcript', {
        audio_url: upload_url,
      }, {
        headers: {
          'authorization': api_key,
          'Content-Type': 'application/json'
        },
      });

      
      const transcriptId = transcriptResponse.id;
      
      // Poll for results
      let transcriptData;
      do {
        await new Promise(resolve => setTimeout(resolve, 5000));  // 5 seconds wait
        const { data: pollingResponse } = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: {
            'authorization': api_key,
          },
        });
        transcriptData = pollingResponse;
      } while (transcriptData.status !== 'completed' && transcriptData.status !== 'failed');

      if (transcriptData.status === 'completed') {
        res.status(200).json({ transcript: transcriptData.text });
      } else {
        res.status(500).json({ error: "Failed to transcribe audio." });
      }
    } catch (error) {
      console.error('Error in transcription:', error);
      res.status(500).json({ error: error.message || "Unknown error occurred." });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
