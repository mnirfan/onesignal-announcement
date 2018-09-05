var fs = require('fs')
var axios = require('axios')
var Anouncement = require('../models/Announcement')

module.exports = {
  create: function (req, res) {
    var images = req.files.map(file => {
      return file.filename
    })
    Anouncement.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      images: images,
      author: req.user.name,
      scope: req.body.scope
    })
    .then(annc => {
      if (annc) {
        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic MTA5OGYwZDItNWQyNi00NmRlLTk5YzAtOTQ2YWM4MjExZmQ3"
        };
        axios({
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
        .then(data => {
          console.log(data);
          res.json(annc)
        })
        .catch(err => {
          console.log(err.response);
          
          res.json(err.response.statusText)
          return
        })
      }
      else {
        res.status(500).json({ message: 'failed' })
      }
    })
    .catch(err => {
      images.forEach(image => {
        fs.unlink(`public/uploads/${image}`)
      })
      res.status(500).json({
        message: err.message
      })
    })
  }
}