const { Users } = require("../../models");
module.exports = {
  upload: async (req, res) => {
    try {
      const userId = req.userId;
      const defaultPic = req.file.location;
      if (!defaultPic) return;
      await Users.update({ defaultPic }, { where: { id: userId } });

      res.status(201).json({ message: "upload success", url: defaultPic });
    } catch (error) {
      console.log("error", error);
      res.status(500).send("Internal Server Error");
    }
  },
  delete: async (req, res) => {
    try {
      const userId = req.userId;
      await Users.update({ defaultPic: "" }, { where: { id: userId } });
      res.status(204).send("No Content");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
};
