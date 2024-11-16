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

// Test upload data to MySQL


router.post('/upload', upload.single('image'),(req, res) => 
    {  
        const imagetype = req.body.type;
        const imagename = req.file.originalname;
        const imagedata = req.file.buffer;
        const imagebrand = req.body.brand;
        const imagesource = req.body.source;
        const imagecolor = req.body.color;
        const imageprice = req.body.price;
        console.log(`Request at ${req.originalUrl}`);
        let sql = `INSERT INTO PRODUCT 
                    (P_Name, P_Img, P_Type, P_Brand, P_Source, P_Color, P_Price)
                    VALUES (?,?,?,?,?,?,?)`

        connection.query(sql, 
            [imagename, imagedata, imagetype, imagebrand, imagesource , imagecolor , imageprice],
            (err, result) => 
            {
                if (err) throw err;
                res.send('Insert succesfully')
            }
        )
    }
)

router.get('/uploadtest', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/uploadtest.html`));
    }
)

router.get('/', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/home.html`));
    }
)

router.get('/login', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/login.html`));
    }
)



router.get('/detail', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/detail.html`));
    }
)

router.get('/productmanage', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/productmanage.html`));
    }
)

router.get('/productedit', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/productedit.html`));
    }
)


router.get('/search', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/search.html`));
    }
)

router.get('/searchoutput', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/searchoutput.html`));
    }
)

router.get('/teampage', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/teampage.html`));
    }
)

router.get('/usermanage', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/usermanage.html`));
    }
)




const port = process.env.port;
app.listen(port, () => 
    {
        console.log(`Server listening on port: ${port}`);
    }
)

