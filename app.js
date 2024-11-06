const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');


const port = 3030;
const app = express();
const router = express.Router();

app.use(router);
app.use('/', router);
dotenv.config();

// For post method
router.use(express.json());
router.use(express.urlencoded({ extended : true }));


app.use(express.static(path.join(__dirname, 'src')));

router.get('/', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/src/index.html`));
    }
)



app.listen(port, () => 
    {
        console.log(`Server listening on port: ${port}`);
    }
)