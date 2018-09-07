var express = require('express');
var multer = require('multer');
var router = express.Router();
var imageController = require('../controllers/imageController')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9 .:]/g, ' ').replace(/ +/g, '-'))
  }
})
var upload = multer({ storage })

router.post('/create', upload.single('image'), imageController.create)
router.get('/', imageController.all)
router.get('/:id', imageController.detail)
// router.get('/:id', imageController.detail)

module.exports = router;