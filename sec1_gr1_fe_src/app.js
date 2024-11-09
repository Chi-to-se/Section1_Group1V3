const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');

const app = express();
const router = express.Router();

app.use(router);
app.use('/', router);
dotenv.config();

// For post method
router.use(express.json());
router.use(express.urlencoded({ extended : true }));

// Static Middleware
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));


// MySQL Creare Connection
// const connection = mysql.createConnection
//     (
//         {
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASS,
//             database: process.env.DB_NAME
//         }
//     );

// // Connet to MySQL Server
// connection.connect( err =>
//     {
//         if (err) throw err;
//         console.log('Connected to MySQL')
//     }
// )



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

router.get('/navbar', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/navbar.html`));
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

