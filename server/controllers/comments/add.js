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

    if (parentComment) {
      //# 부모글이 있는 경우
      const review_id = parentComment.reviewId;
      const ref = parentComment.ref;
      const step = parentComment.step + 1;
      let ref_order;
      const isParentStep = await Comments.findOne({
        where: {
          [Op.and]: [
            { reviewId: review_id },
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
        // ref_order = isParentStep.ref_order;
        // await Comments.update(
        //   { ref_order: ref_order + 1 },
        //   { where: { id: isParentStep.id } }
        // );
        ref_order = isParentStep.ref_order + 1;

        /*
        부모 스텝이 있는 경우에, 동일 스텝이 있는 경우와 없는 경우

        */
      } else {
        // 자신과 같은 스텝이 있는 경우

        const lastSameStep = await Comments.findOne({
          where: {
            [Op.and]: [
              { reviewId: review_id },
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

      const child_num = 0;
      // model.update({ field: 바꿀값 }, {where: {field: 찾을값}});
      await Comments.update(
        { child_num: parentComment.child_num + 1 },
        { where: { id: parentComment.id } }
      );
      const parent_id = parentComment.id;
      const like_num = 0;

      console.log(reviewId, 'here!!!!');
      let comment = await Comments.create({
        ref,
        step,
        ref_order,
        child_num,
        like_num,
        parent_id,
        content,
        reviewId: parentComment.reviewId,
        userId,
      });

      const userInfo = await Users.findByPk(userId, {
        attributes: ['nickname'],
      });
      const result = Object.assign(comment.dataValues, {
        User: { nickname: userInfo.nickname },
      });
      // console.log(result);
      return res.json(result);
    } else {
      //# 부모글이 없는 순수 댓글
      const review_id = reviewId;
      // let ref = await Comments.findAll({
      //   where: { reviewId },
      //   attributes: ['ref'],
      // });
      let ref;
      const maxRef = await Comments.max('ref', { where: { reviewId } });
      // console.log(maxRef);

      if (maxRef) {
        ref = maxRef + 1;
      } else {
        ref = 1;
      }

      let step = 0;
      let ref_order = 0;
      let child_num = 0;
      let parent_id = 0;
      let like = 0;

      let comment = await Comments.create(
        {
          ref,
          step,
          ref_order,
          child_num,
          parent_id,
          content,
          userId,
          reviewId: review_id,
          like,
        }
        // { raw: true }
      );
      // console.log(comment);
      const userInfo = await Users.findByPk(userId, {
        attributes: ['nickname'],
      });
      const result = Object.assign(comment.dataValues, {
        User: { nickname: userInfo.nickname },
      });
      // console.log(result);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};
