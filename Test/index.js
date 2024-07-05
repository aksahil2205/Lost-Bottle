const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission and save message
app.post('/save-message', (req, res) => {
    const message = req.body.message;

    // Save message to a .txt file with a unique name
    const fileName = `message_${Date.now()}.txt`;
    const filePath = path.join(__dirname, 'messages', fileName);
    fs.writeFile(filePath, message, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to save message.');
        } else {
            console.log('Message saved successfully.');
            res.send('Message saved successfully.');
        }
    });
});

// Route to handle random message retrieval
app.get('/random-message', (req, res) => {
    const messagesDir = path.join(__dirname, 'messages');

    // Read all files in the 'messages' directory
    fs.readdir(messagesDir, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to read messages directory.');
            return;
        }

        // Filter .txt files only
        const txtFiles = files.filter(file => path.extname(file) === '.txt');

        if (txtFiles.length === 0) {
            res.status(404).send('No message files found.');
            return;
        }

        // Pick a random file from the list
        const randomFile = txtFiles[Math.floor(Math.random() * txtFiles.length)];
        const filePath = path.join(messagesDir, randomFile);

        // Read the content of the random file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Failed to read random message file.');
            } else {
                res.send(data); // Send the content of the random message file
            }
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
