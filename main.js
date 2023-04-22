const express = require('express');
const env = require('dotenv').config();
const app = express();
const port = 7000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');

const multer = require('multer');
const mul = multer();
app.use(mul.array());

const runningServer = async () => {
  await app.use(express.static('public'));
  await app.listen(port, () => {
    console.log(`cli-nodejs-api listening at http://localhost:${port}`);
  });

  await app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  });

  // example localhost:7000/sendpesan?nomor=6283***&pesan=hehehe
  await app.post('/download', async (req, res) => {
    // Initialization and Authentication
    const Spotify = require('spotifydl-core').default; // Import the library
    const spotify = new Spotify({
      // Authentication

      clientId: env.parsed.CLIENT_ID_SPOTIFY, // <-- add your own clientId
      clientSecret: env.parsed.CLIENT_SECRET_SPOTIFY, // <-- add your own clientSecret
    });

    // Declaring the respective url in 'links' object
    const links = {
      artist: req.body.artist, // Url of the artist you want to gather info about
      album: req.body.album, // Url of the album you want to gather info about
      song: req.body.song, // Url of the song you want to gather info about or download
    };
    const fs = require('fs-extra');

    // Engine

    let songname = '';
    const resultData = async () => {
      const data = await spotify.getTrack(links.song); // Waiting for the data 🥱
      console.log('Downloading: ', data.name, 'by:', data.artists.join(' ')); // Keep an eye on the progress
      const song = await spotify.downloadTrack(links.song); // Downloading goes brr brr
      fs.writeFileSync('public/result/' + data.name + '.mp3', song); // Let's write the buffer to the woofer (i mean file, hehehe)
      console.log('Berhasil Download: ', data.name);
      songname = 'result/' + data.name + '.mp3';
    };

    await resultData();
    await res.send({ result: songname });
  });
};

runningServer();
