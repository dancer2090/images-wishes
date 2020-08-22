
const express = require('express')
const { handlerGenerateList } = require('./handlers/images-generate-list');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors')

const upload = multer();

const app = express()
const port = 5001


app.use(express.static(__dirname + '/public'));
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//cors
app.use(cors()); 
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.html');
})
app.get('/get-list', handlerGenerateList)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
