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


app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));

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


const port = process.env.port;
app.listen(port, () => 
    {
        console.log(`Server listening on port: ${port}`);
    }
)