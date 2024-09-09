const express = require('express')
const path = require('path');

const port = 3000;
const app = express();

/**
 * Just serve the index.html file, everything else will be handled in browser
 */
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})