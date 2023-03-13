const validateToken = require('../token-functions/validateToken');
const { Comments } = require('../../models');
module.exports = async (req, res) => {
  console.log('hrerer');
  try {
    const accessTokenData = validateToken(req);

    if (!accessTokenData) {
      return res
        .status(404)
        .json({ data: null, message: 'User not logged in' });
    }

    const { id, content } = req.body;

    await Comments.update({ content, is_edit: true }, { where: { id } });

    const updatedComment = await Comments.findOne({ where: { id } });
    console.log(updatedComment);
    res.status(200).json(updatedComment);
    console.log(req.body); // { id: 30, content: '부모글1fff' }
  } catch (error) {
    console.log(error);
  }
};
