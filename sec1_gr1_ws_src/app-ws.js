const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const router = express.Router();

app.use(cors());
app.use(router);
app.use('/', router);
dotenv.config();

// Setup Multer 
const storage = multer.memoryStorage();
const upload = multer( { storage: storage });

// For post method
router.use(express.json());
router.use(express.urlencoded({ extended : true }));

// Static Middleware
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));


// MySQL Create Connection
const connection = mysql.createConnection
    (
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        }
    );

// Connet to MySQL Server
connection.connect( err =>
    {
        if (err) throw err;
        console.log('Connected to MySQL')
    }
)

// Test upload/search data to MySQL
router.post('/search', upload.single('image'), (req, res) => {
    const productID = req.body.id;
    const productType = req.body.type;
    const productBrand = req.body.brand;
    const productName = req.body.name;
    const productColor = req.body.color;

    console.log(`Request at ${req.originalUrl}`);

    // Start with a base SQL query
    let sql = `SELECT P_ID,P_Name,P_Type,P_Brand,P_Source,P_Color,P_Price FROM PRODUCT WHERE 1=1`;
    const params = [];

    // Dynamically add conditions based on provided values
    if (productID) {
        sql += ` AND P_ID = ?`;
        params.push(productID);
    }
    if (productType) {
        sql += ` AND P_Type = ?`;
        params.push(productType);
    }
    if (productBrand) {
        sql += ` AND P_Brand = ?`;
        params.push(productBrand);
    }
    if (productName) {
        sql += ` AND P_Name = ?`;
        params.push(productName);
    }
    if (productColor) {
        sql += ` AND P_Color = ?`;
        params.push(productColor);
    }

    // Execute the query
    connection.query(sql, params, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// Test download from MySQL
router.get('/image/:id', (req, res) => {
    const imageId = req.params.id;
    console.log(imageId);
    const query = 'SELECT P_Name, P_Img FROM PRODUCT WHERE P_ID = ?';

    connection.query(query, [imageId], (err, results) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(404).send('Image not found');
        }
        
        const { P_Name, P_Img } = results[0];
        console.log("Image record:", { P_Name, P_Img });
        
        // Find type of image/Detect the MIME type based on the file extension
        const fileExtension = path.extname(P_Name).toLowerCase();
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

        console.log('Image data length:', P_Img.length);
        console.log('File extension:', fileExtension);
        console.log('Mime type:', mimeType);

        // Set MIME type and send image data
        res.set('Content-Type', mimeType);
        res.send(P_Img);  // Send the image data
    });
});

// router.post('/upload', upload.single('image'),(req, res) => 
//     {  
//         const imagetype = req.body.type;
//         const imagename = req.file.originalname;
//         const imagedata = req.file.buffer;
//         const imagebrand = req.body.brand;
//         const imagesource = req.body.source;
//         const imagecolor = req.body.color;
//         const imageprice = req.body.price;
//         console.log(`Request at ${req.originalUrl}`);
//         let sql = `INSERT INTO PRODUCT 
//                     (P_Name, P_Img, P_Type, P_Brand, P_Source, P_Color, P_Price)
//                     VALUES (?,?,?,?,?,?,?)`

//         connection.query(sql, 
//             [imagename, imagedata, imagetype, imagebrand, imagesource , imagecolor , imageprice],
//             (err, result) => 
//             {
//                 if (err) throw err;
//                 res.send('Insert succesfully')
//             }
//         )
//     }
// )




const port = process.env.PORT;
app.listen(port, () => 
    {
        console.log(`Server listening on port: ${port}`);
    }
)

