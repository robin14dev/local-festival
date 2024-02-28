const { Reviews, Users } = require("../../models");
const validateToken = require("../token-functions/validateToken");

module.exports = async (req, res) => {
  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: "User not logged in" });
  }

  console.log(req.body, "update review!!!");
  /* //#req.body

{
  id: { review: 130, festival: 2588321, user: 12 },
  content: 'hkhkbububk수정수정',
  rating: 4
}
 */

  const { festival, user, review } = req.body.id;
  const { content, rating } = req.body;

  try {
    await Reviews.update(
      { content, rating },
      { where: { festivalId: festival, userId: user, id: review } },
    );
    let updatedReview = await Reviews.findAndCountAll({
      include: [
        {
          model: Users,
          attributes: ["nickname", "defaultPic"],
        },
      ],
      where: { festivalId: festival, userId: user, id: review },
    });
    // console.log(updatedReview.rows);
    res.status(200).json(updatedReview.rows);
  } catch (error) {
    console.log(error);
  }
};
