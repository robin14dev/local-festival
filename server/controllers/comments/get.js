const { Comments } = require('../../models');
const { Users } = require('../../models');
module.exports = async (req, res) => {
  console.log(
    req.params,
    'req.params!!!, getComments--------------------------'
  );
  const reviewId = Number(req.params.id);

  try {
    /*
    댓글 불러올 때 필요한 것
    

    - 댓글 쓴 나의 닉네임, 댓글 쓴 업데이트 시각
    - 내가 쓴 댓글 정보
    - 좋아요 수
    - //! 부모글 (리뷰 혹은 댓글)의 계정아이디
     parentId가 있다면 부모글의 작성자 닉네임 알아야 함
    */
    let comments = await Comments.findAll({
      where: { reviewId },
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      order: [
        ['ref', 'ASC'],
        ['ref_order', 'ASC'],
      ],
    });
    if (comments.length === 0) {
      console.log(`${reviewId}글 의 댓글????????`);
      return res.status(204).send('No content');
    }

    for (let comment of comments) {
      if (comment.dataValues.parent_id) {
        const parentComment = await Comments.findOne({
          where: { id: comment.parent_id },
          include: [{ model: Users, attributes: ['nickname'] }],
        });

        comment.dataValues = Object.assign(comment.dataValues, {
          parent_nickname: parentComment.User.nickname,
        });
      }
    }

    return res.json(comments);
  } catch (error) {
    console.log(error);
  }
};
