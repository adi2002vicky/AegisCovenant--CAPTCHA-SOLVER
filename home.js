const express = require('express');
// Multer is a node. js middleware for handling multipart/form-data , which is primarily used for uploading files
const multer = require('multer')
// tesseract can be used directly, or (for programmers) using an API to extract printed text from images
const tesseract = require("node-tesseract-ocr");
// path module that allows you to interact with file paths easily
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname + '/Fileupload')))
//EJS (Embedded JavaScript Templating) is one of the most popular template engines for JavaScript.
app.set('view engine', "ejs")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Fileupload");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({storage:storage})

app.get('/', (req, res) => {
    res.render('home',{data:''})
})

app.post('/captchasolver', upload.single('file'), (req, res) => {
    console.log(req.file.path) 
  
    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
    };

    tesseract
      .recognize(req.file.path, config)
      .then((text) => {
          console.log("Result:", text);
          
          res.render('home',{data:text})
      })
      .catch((error) => {
        console.log(error.message);
      });
})

// run on port localhost:5000
app.listen(5000, () => {
    console.log("App os listening on port 5000")
})