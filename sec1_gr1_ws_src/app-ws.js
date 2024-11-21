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


const port = process.env.PORT;
app.listen(port, () => 
    {
        console.log(`Server listening on port: ${port}`);
    }
)

