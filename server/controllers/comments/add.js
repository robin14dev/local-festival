const { Comments, Users } = require('../../models');
const validateToken = require('../token-functions/validateToken');
const { Op } = require('sequelize');
module.exports = async (req, res) => {
  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }
  const { parentComment, content, reviewId } = req.body;
  const userId = Number(accessTokenData.id);

  /*
  리뷰테이블에 댓글 추가 되었다고 날리기
  댓글 테이블에 
  
  */

  try {
    /*
    # 댓글 테이블에 글 추가하기
    1. 부모글이 있는지 없는지 판단
    */
    let reviewId, ref, step, ref_order, child_num, like_num, parent_id;

    if (parentComment) {
      //# 부모글이 있는 경우
      console.log('부모글 있음', parentComment);
      reviewId = parentComment.reviewId;
      ref = parentComment.ref;
      step = parentComment.step + 1;
      child_num = 0;
      like_num = 0;
      parent_id = parentComment.id;
      const isParentStep = await Comments.findOne({
        where: {
          [Op.and]: [
            { reviewId },
            { ref },
            {
              step: {
                [Op.gt]: 0,
                [Op.lt]: step,
              },
            },
          ],
        },
        order: [['ref_order', 'DESC']],
      });

      if (isParentStep) {
        // 부모 스텝이 있는 경우
        console.log('isParentStep이 있는 경우', isParentStep);
        ref_order = isParentStep.ref_order + 1;
      } else {
        // 자신과 같은 스텝이 있는 경우
        const lastSameStep = await Comments.findOne({
          where: {
            [Op.and]: [
              { reviewId },
              { ref },
              {
                step,
              },
            ],
          },
          order: [['ref_order', 'DESC']],
        });
        if (lastSameStep) {
          // 자신과 같은 스텝이 있는 경우
          ref_order = lastSameStep.ref_order + 1;
        } else {
          // 자신과 같은 스텝이 없는 경우
          ref_order = parentComment.ref_order + 1;
        }
      }

      await Comments.update(
        { child_num: parentComment.child_num + 1 },
        { where: { id: parentComment.id } }
      );
      await Comments.create({
        ref,
        step,
        ref_order,
        child_num,
        like_num,
        parent_id,
        content,
        userId,
        reviewId,
      });
    } else {
      //# 부모글이 없는 순수 댓글
      console.log('부모글 없어??');
      reviewId = req.body.reviewId;

      const maxRef = await Comments.max('ref', { where: { reviewId } });
      if (maxRef) {
        ref = maxRef + 1;
      } else {
        ref = 1;
      }
      step = 0;
      ref_order = 0;
      child_num = 0;
      parent_id = 0;
      like = 0;

      await Comments.create({
        ref,
        step,
        ref_order,
        child_num,
        parent_id,
        content,
        userId,
        reviewId,
        like,
      });
    }

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
    if (comments.length === 0) {
      return res.status(204).send('No content');
    }

    for (let comment of comments) {
      if (comment.dataValues.parent_id) {
        const parentComment = await Comments.findOne({
          where: { id: comment.parent_id },
          include: [{ model: Users, attributes: ['nickname'] }],
          paranoid: false,
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
