const { Comments } = require('../../models');
const { Users } = require('../../models');

module.exports = async (req, res) => {
  try {
    console.log(req.params, '리뷰 아이디 받아오기');
    /*
  댓글 불러올 때 필요한 것
  

  - 댓글 쓴 나의 닉네임, 댓글 쓴 업데이트 시각
  - 내가 쓴 댓글 정보
  - 좋아요 수
  - //! 부모글 (리뷰 혹은 댓글)의 계정아이디
   parentId가 있다면 부모글의 작성자 닉네임 알아야 함
  */

    const reviewId = Number(req.params.id);
    let comments = await Comments.findAll({
      where: { reviewId },
      include: [
        {
          model: Users,
          attributes: ['nickname', 'defaultPic'],
        },
      ],
      order: [
        ['ref', 'DESC'],
        ['ref_order', 'ASC'],
      ],
    });
    console.group('해당 리뷰아이디의 댓글 불러오기');
    console.log('댓글 수 : ', comments.length);
    console.log(comments);
    console.groupEnd();
    if (comments.length === 0) {
      return res.status(204).send('No content');
    }

    for (let comment of comments) {
      if (comment.dataValues.parent_id) {
        console.log('부모글이 있는 글의 id : ', comment.dataValues.id);
        const parentComment = await Comments.findOne({
          where: { id: comment.parent_id },
          include: [{ model: Users, attributes: ['nickname'] }],
          paranoid: false, //# 부모글이 삭제 되었을 때도 생각해야함
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
