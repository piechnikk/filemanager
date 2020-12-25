var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;

var path = require("path")

var hbs = require('express-handlebars')

var formidable = require('formidable')
const { type } = require("os")

var filesTab = []
var id = 1
const extTab = ["doc", "docx", "exe", "gif", "html", "iso", "jpeg", "jpg", "mp3", "mp4", 'mpeg', "msi", "pdf", 'png', "ppt", 'rar', 'raw', "sql", 'svg', 'tiff', "txt", "wav", "xls", "zip"]

app.get("/", function (req, res) {
    res.redirect("/upload")
})

app.get("/upload", function (req, res) {
    res.render('upload.hbs')
})

app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', { filesTab })
})

app.get("/info", function (req, res) {
    res.render('info.hbs', filesTab[filesTab.findIndex(({ id }) => id == req.query.id)])
})

app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm()
    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
    form.multiples = true
    form.parse(req, function (err, fields, files) {
        if (files.imagetoupload.length > 1) {
            for (let i = 0; i < files.imagetoupload.length; i++) {
                var path = ""
                var extension = "undefined"
                for (let j = 0; j < extTab.length; j++) {
                    if (files.imagetoupload[i].path.split(".")[1].toLowerCase() == extTab[j]) extension = extTab[j].toUpperCase()
                }
                for (let j = files.imagetoupload[i].path.split("/").length - 2; j < files.imagetoupload[i].path.split("/").length; j++) path += "/" + files.imagetoupload[i].path.split("/")[j]
                filesTab.push({ id: id, name: files.imagetoupload[i].name, path: files.imagetoupload[i].path, size: files.imagetoupload[i].size, type: files.imagetoupload[i].type, savedate: new Date().getTime(), download: path, extension: extension })
                id++
            }
        } else {
            var extension = "undefined"
            for (let j = 0; j < extTab.length; j++) {
                if (files.imagetoupload.path.split(".")[1].toLowerCase() == extTab[j]) extension = extTab[j].toUpperCase()
            }
            var path = ""
            for (let j = files.imagetoupload.path.split("/").length - 2; j < files.imagetoupload.path.split("/").length; j++) path += "/" + files.imagetoupload.path.split("/")[j]
            filesTab.push({ id: id, name: files.imagetoupload.name, path: files.imagetoupload.path, size: files.imagetoupload.size, type: files.imagetoupload.type, savedate: new Date().getTime(), download: path, extension: extension })
            id++
        }
        console.log(filesTab);
        res.redirect("/filemanager")
    })
})

app.get("/del", function (req, res) {
    filesTab.splice(filesTab.findIndex(({ id }) => id == req.query.id), 1)
    res.redirect("/filemanager")
})

app.get("/delAll", function (req, res) {
    filesTab = []
    id = 1
    res.redirect("/filemanager")
})

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "views/partials"
}))
app.set('view engine', 'hbs')
app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})