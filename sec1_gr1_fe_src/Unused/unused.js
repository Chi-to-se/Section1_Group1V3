router.get('/detail', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/detail.html`));
    }
)

router.get('/searchoutput', (req,res) => 
    {
        console.log(`Request at ${req.originalUrl}`);
        res.sendFile(path.join(`${__dirname}/public/searchoutput.html`));
    }
)


