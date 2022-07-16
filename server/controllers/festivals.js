const {Festivals} = require("../models/")
console.log("what is this",typeof Festivals);
module.exports = {
  get : (req, res) => {
    Festivals.findAll()
    .then(response => {
      res.json(response)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Internal Server Error")
    })

  }
}