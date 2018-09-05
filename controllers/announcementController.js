var fs = require('fs')
var axios = require('axios')
var Announcement = require('../models/Announcement')

module.exports = {
  create: async function (req, res) {
    var images = req.files.map(file => {
      return file.filename
    })
    try {
      var announcement = await Announcement.create({
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        images: images,
        author: req.user.name,
        scope: req.body.scope
      })
      if (announcement) {
        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic MTA5OGYwZDItNWQyNi00NmRlLTk5YzAtOTQ2YWM4MjExZmQ3"
        };
        var result = await axios({
          url: 'https://onesignal.com/api/v1/notifications',
          method: 'post',
          headers,
          data: {
            app_id: process.env.SIGNALID,
            filters: [{
              field: 'tag',
              key: 'scope',
              relation: '=',
              value: req.body.scope
            }],
            headings: { en: "Pengumuman Baru" },
            contents: { en: req.body.title }
          }
        })
        console.log(result.data);
        res.json(result.data)
      }
      else {
        res.status(500).json({ message: 'failed' })
      }
    }
    catch (err) {
      images.forEach(image => {
        fs.unlink(`public/uploads/${image}`)
      })
      res.status(500).json({
        message: err.message
      })
    }
  },
  all: async function (req, res) {
    try {
      var annc = await Announcement.find({})
      res.json(annc)
    } catch (err) {
      res.status(500).json(err.message)
    }
  },
  detail: async function (req, res) {
    try {
      var annc = await Announcement.findById(req.params.id)
      res.json(annc)
    } catch (error) {
      res.status(500).json(err.message)
    }
  }
}