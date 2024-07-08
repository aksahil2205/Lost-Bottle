const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for write message page
app.get('/write', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'write.html'));
});

// Route for read message page
app.get('/read', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'read.html'));
});

// Route to save a message
app.post('/save-message', (req, res) => {
    const message = req.body.message;
    const fileName = `message_${Date.now()}.txt`;
    const filePath = path.join(__dirname, 'messages', fileName);
    fs.writeFile(filePath, message, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to save message.');
        } else {
            console.log('Message saved successfully.');
            res.redirect('/');
        }
    });
});




// Route to get a random message
app.get('/random-message', (req, res) => {
    const messagesDir = path.join(__dirname, 'messages');
    fs.readdir(messagesDir, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to read messages directory.');
            return;
        }
        const txtFiles = files.filter(file => path.extname(file) === '.txt');
        if (txtFiles.length === 0) {
            res.status(404).send('No message files found.');
            return;
        }
        const randomFile = txtFiles[Math.floor(Math.random() * txtFiles.length)];
        const filePath = path.join(messagesDir, randomFile);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Failed to read random message file.');
            } else {
                res.send(data);
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
