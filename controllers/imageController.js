var fs = require('fs')
var Image = require('../models/Image')
var sharp = require('sharp')

module.exports = {
  create: async function (req, res) {
    console.log(req.file);
    
    try {
      sharp(`${req.file.destination}/${req.file.filename}`)
        .resize(100, null)
        .toFile(`${req.file.destination}/thumbnail-${req.file.filename}`)
      var image = await Image.create({
        user: req.user.sub,
        path: `uploads/${req.file.filename}`,
        pathThumbnail: `uploads/thumbnail-${req.file.filename}`,
        label: JSON.parse(req.body.label),
        scope: req.body.scope
      })
      if (image) {
        res.json(image)
      }
      else {
        res.status(500).json({ message: 'failed' })
      }
    }
    catch (err) {
      var path = `${req.file.destination}/${req.file.filename}`
      var thumb = `${req.file.destination}/thumbnail-${req.file.filename}` 
      res.status(500).json({
        message: err.message
      })
      if (fs.existsSync(path)) fs.unlinkSync(path)
      if (fs.existsSync(thumb)) fs.unlinkSync(thumb)
    }
  },
  all: async function (req, res) {
    try {
      var images = await Image.find({})
      if (images) return res.json(images)
      else res.status(500).json({message: 'failed'})
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  },
  detail: async function (req, res) {
    try {
      var image = await Image.findById(req.params.id)
      res.json(image)
    } catch (error) {
      res.status(500).json(err.message)
    }
  }
}