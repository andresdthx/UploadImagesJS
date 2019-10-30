const express = require('express')
const path = require('path')
const morgan = require('morgan')
//guarda la imagen dentro del proyecto
const multer = require('multer')
//nombre aleatoreo para la imagen
const uuid = require('uuid/v4')
//cambiar forma de ver las fechas
const {format} = require('timeago.js');
const app = express();
require('./database');

//Middlewares

app.use(morgan('dev'));
//interpetrar los datos de los formularios
app.use(express.urlencoded({extended: false}));

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename)=>{
        cb(null,uuid()+ path.extname(file.originalname));
    }
})
app.use(multer({ storage: storage }).single('image'));

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

//Global variables
app.use((req,res,next)=>{
   app.locals.format = format;
   next();
})

//Routes
app.use(require('./routes/index'));
//Static files
//hacer accesible la carpeta public desde el navegador
app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'))
})
