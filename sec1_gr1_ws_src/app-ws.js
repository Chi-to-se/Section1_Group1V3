const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { log } = require('console');
const jwt = require('jsonwebtoken');

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

// Connect to MySQL Server
connection.connect( err =>
    {
        if (err) throw err;
        console.log('Connected to MySQL')
    }
)

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    // Check if the user exists in the database 
    let sql = `SELECT * FROM ADMIN WHERE A_Username = ?`;
    connection.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Server error');
        }

        if (result.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = result[0];
        console.log(password, user.A_Password);

        if (err) {
            console.error('Error comparing passwords:', err);
            return res.status(500).send('Server error');
        }
        if (password != user.A_Password) {
            return res.status(401).send(`Invalid username or password`);
        }

        
        // Create a JWT token
        const token = jwt.sign(
            { username: user.A_Username, role: user.A_Role },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );
        res.json({ token });
    });
});







// Search data from MySQL
router.post('/search', upload.single('image'), (req, res) => {
    const productID = req.body.id;
    const productType = req.body.type;
    const productBrand = req.body.brand;
    const productName = req.body.name;
    const productColor = req.body.color;
    const productGender = req.body.gender;
    console.log(productGender);
    

    console.log(`Request at ${req.originalUrl}`);

    // Set query code
    let sql = `SELECT P_ID,P_Name,P_Type,P_Brand,P_Source,P_Color,P_Price,P_Gender FROM PRODUCT WHERE 1=1`;
    const params = [];

    if (productID) {
        sql += ` AND P_ID = ?`;
        params.push(productID);
    }
    if (productType) {
        if (productType === 'none'){}
        else
            {
                sql += ` AND P_Type = ?`;
                params.push(productType);
            }
        
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

    if (productGender) {
        if (productGender === 'none'){}
        else
            {
                sql += ` AND P_Gender = ?`;
                params.push(productGender);
            }
        
    }

    // Execute 
    connection.query(sql, params, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// download IMG from MySQL
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
        
        // Find type of image in the MIME
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

        // Set MIME type 
        res.set('Content-Type', mimeType);
        res.send(P_Img);  // Send the image data
    });
});


// Details
router.get("/details/:id", (req, res) => {
    const query = "SELECT * FROM PRODUCT WHERE P_ID = ?";
    const { id } = req.params;
  
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching item details:", err);
        res.status(500).json({ error: "Database error" });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json(results[0]); // Send the first matching result        
      }
    });
  });





// SELECT ALL(PRODUCT)
router.get('/records',(req,res) => 
    {
        const query = `SELECT P_ID,P_Name,P_Type,P_Brand,P_Source,P_Color,P_Price,P_Gender FROM PRODUCT`;
        connection.query(query, (err, results) => 
            {
                if (err)
                {
                    return res.status(500).send(err);
                }
                res.json(results);
            }
        )
    }
)


// SELECT BY ID(PRODUCT)
router.get('/records/:id',(req,res) => 
    {
        const productID = Number(req.params.id);
        console.log(typeof(productID));
        
        const query = `SELECT P_ID,P_Name,P_Type,P_Brand,P_Source,P_Color,P_Price,P_Gender 
                        FROM PRODUCT
                        WHERE P_ID = ?`;
        connection.query(query, [productID] ,(err, results) => 
            {
                if (err)
                {
                    return res.status(500).send(err);
                }
                res.json(results[0]);
            }
        )
    }
)


// UPDATE AND INSERT(UPSERT) PRODUCT
router.post('/updateproduct', upload.single('img'), (req, res) => {
    console.log(req.body);
    console.log(req.file);

    const productID = Number(req.body.id);
    const productType = req.body.type;
    const productBrand = req.body.brand;
    const productName = req.body.name;
    const productColor = req.body.color;
    const productGender = req.body.gender;
    const productPrice = req.body.price;
    const productSource = req.body.source;

    // Use the new image if uploaded or use null
    let productImg = req.file ? req.file.buffer : null;

    if (!productImg) 
        {
        // If no image is uploaded, fetch the current image from the database
        connection.query('SELECT P_Img FROM PRODUCT WHERE P_ID = ?', [productID], (err, results) => 
            {
            if (err) return res.status(500).send('Database error');
            if (results.length > 0) 
                {
                    productImg = results[0].P_Img; 
                } 
            else 
                {
                    return res.status(404).send('Product not found');
                }

            // Update the product with the old or new image
            updateProduct();
            }
            );
        } 
    else 
        {
        // Update the product with the new image
            updateProduct();
        }

    function updateProduct() 
    {
        // Query code
        const upsertQuery = `
            INSERT INTO PRODUCT (P_ID, P_Name, P_Img, P_Type, P_Brand, P_Source, P_Color, P_Price, P_Gender)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                P_Name = VALUES(P_Name),
                P_Img = VALUES(P_Img),
                P_Type = VALUES(P_Type),
                P_Brand = VALUES(P_Brand),
                P_Source = VALUES(P_Source),
                P_Color = VALUES(P_Color),
                P_Price = VALUES(P_Price),
                P_Gender = VALUES(P_Gender)
        `;

        connection.query(upsertQuery, [productID, productName, productImg, productType, productBrand, productSource, productColor, productPrice, productGender], (err, results) => {
            if (err) 
                {
                    console.error(err);
                    return res.status(500).send('Failed to save product data');
                }
            res.redirect('http://localhost:3040/productmanage');
        });
    }
});




// DELETE BY ID(PRODUCT)
router.delete('/deleteproduct/:id',(req,res) => 
    {
        const adminID = Number(req.params.id);
        console.log(adminID);
        
        const query = `DELETE FROM PRODUCT WHERE P_ID = ?`;
        connection.query(query, [adminID] , (err, results) => 
            {
                if (err)
                {
                    return res.status(500).send(err);
                }
                res.send("Delete succesfully");
            }
        )
    }
)







// SELECT ALL(ADMIN)
router.get('/admins',(req,res) => 
    {
        const query = `SELECT * FROM ADMIN`;
        connection.query(query, (err, results) => 
            {
                if (err)
                {
                    return res.status(500).send(err);
                }
                res.json(results);
            }
        )
    }
)



// SELECT BY ID(ADMIN)
router.get('/admins/:id',(req,res) => 
    {
        const adminID = Number(req.params.id);
        console.log(adminID);
        console.log(typeof(adminID));
        
        const query = `SELECT * FROM ADMIN WHERE A_ID = ?`;
        connection.query(query, [adminID] ,(err, results) => 
            {
                if (err)
                {
                    return res.status(500).send(err);
                }
                res.json(results[0]);
            }
        )
    }
)

// UPDATE AND INSERT(UPSERT) ADMIN
router.post('/updateadmin', (req, res) => {
    console.log(req.body);
    const adminID = Number(req.body.id);
    const adminUser = req.body.username;
    const adminPass = req.body.password;
    const adminFirstname = req.body.firstname;
    const adminLastname = req.body.lastname;
    const adminBirthdate = req.body.birthdate;
    const adminAddress = req.body.address;

    const upsertQuery = `
        INSERT INTO ADMIN (A_ID, A_Username, A_Password, A_Firstname, A_Lastname, A_BirthDate, A_Address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        A_Username = VALUES(A_Username),
        A_Password = VALUES(A_Password),
        A_Firstname = VALUES(A_Firstname),
        A_Lastname = VALUES(A_Lastname),
        A_BirthDate = VALUES(A_BirthDate),
        A_Address = VALUES(A_Address);
    `;

    connection.query(upsertQuery, [adminID, adminUser, adminPass, adminFirstname, adminLastname, adminBirthdate, adminAddress], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to save admin data');
        }
        res.redirect('http://localhost:3040/usermanage')
    });
});



// DELETE BY ID(ADMIN)
router.delete('/deleteadmin/:id',(req,res) => 
    {
        const adminID = Number(req.params.id);
        console.log(adminID);
        
        const query = `DELETE FROM ADMIN WHERE A_ID = ?`;
        connection.query(query, [adminID] , (err, results) => 
            {
                if (err)
                {
                    return res.status(500).send(err);
                }
                res.send("Delete succesfully");
            }
        )
    }
)




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

