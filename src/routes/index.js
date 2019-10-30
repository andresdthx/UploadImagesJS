const {Router} = require('express');
const router = Router();

const path = require('path');
const {unlink} = require('fs-extra');

const Image = require('../models/Image');

//const ControllerImage = require('../controllers/ImageController');

router.get('/', async (req, res)=>{
    // ObjImage = new ControllerImage();
    // await res.send(ObjImage.myData());

    const images = await Image.find();
    res.render('index', {images});
    res.send('Index page');
})
router.get('/upload', (req, res)=>{
    res.render('upload');
})
router.post('/upload', async (req, res)=>{

    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    await image.save();

    console.log(image);
    res.redirect('/');
})
router.get('/image/:id', async (req,res)=>{
    const image = await Image.findById(req.params.id)
    res.render("image/index", {image});
})
router.get('/image/:id/delete', async (req, res)=>{
    const {id} = req.params;
    const image = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public/'+ image.path));
    res.redirect('/')
})
module.exports = router;