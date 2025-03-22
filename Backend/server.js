const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const product = require('./controller/product');
const category = require('./controller/categories');

const app = express();
const port = 5000;


app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.use(product);
app.use(category);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
