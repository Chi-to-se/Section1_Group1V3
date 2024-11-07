const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const multer = require('multer');
const fs = require('fs');

const app = express();
const router = express.Router();

app.use(router);
app.use('/', router);
dotenv.config();

// Set up multer for file handling
const storage = multer.memoryStorage(); // In-memory storage
const upload = multer({ storage: storage });



// For post method
router.use(express.json());
router.use(express.urlencoded({ extended : true }));

// Static Middleware
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Defend05022548',
    database: 'test01'
});

// Connect
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});



// Image upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    const imageName = req.file.originalname;
    const imageData = req.file.buffer;

    const query = 'INSERT INTO images (name, image_data) VALUES (?, ?)';
    connection.query(query, [imageName, imageData], (err, result) => {
        if (err) throw err;
        res.send('Image uploaded successfully');
    });
});

// Fetch and display image by ID
app.get('/image/:id', (req, res) => {
    const imageId = req.params.id;
    const query = 'SELECT name, image_data FROM images WHERE id = ?';

    connection.query(query, [imageId], (err, results) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(404).send('Image not found');
        }

        const image = results[0];

        // Detect the MIME type based on the file extension
        const fileExtension = path.extname(image.name).toLowerCase();
        let mimeType;

        switch (fileExtension) {
            case '.jpg':
            case '.jpeg':
                mimeType = 'image/jpeg';
                break;
            case '.png':
                mimeType = 'image/png';
                break;
            case '.gif':
                mimeType = 'image/gif';
                break;
            default:
                mimeType = 'application/octet-stream';  // Fallback for unknown types
        }

        console.log('Image data length:', image.image_data.length);
        console.log('File extension:', fileExtension);
        console.log('Mime type:', mimeType);

        // Set MIME type and send image data
        res.set('Content-Type', mimeType);
        res.send(image.image_data);  // Send the image data
    });
});





router.get('/', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/index.html`));
    }
)

router.get('/login', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/login.html`));
    }
)

router.get('/navbar', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/navbar.html`));
    }
)

router.get('/htmlsql', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/htmlsql.html`));
    }
)


const port = process.env.port;
app.listen(port, () => 
    {
        console.log(`Server listening on port: ${port}`);
    }
)