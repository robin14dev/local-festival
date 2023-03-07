import React, { useState, useRef } from 'react';

type Props = {};

export default function CommentEdit({}: Props) {
  const [editContent, setEditContent] = useState(content);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const handleEditContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);

    setEditContent(e.target.value);
  };

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  };

  const submitEditContent = async () => {
    try {
      /*
      댓글 아이디, 
      */
      const commentId = id;
      setIsLoading((prev) => ({ ...prev, update: true }));
      const result = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/comments`,
        { id, content: editContent },
        {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        }
      );
      /*
      
      */
      console.log(result);

      const { content, is_edit } = result.data;
      setEditContent('');
      setComments((prevComments) => {
        return prevComments.map((comment) =>
          comment.id === id ? { ...comment, content, is_edit } : comment
        );
      });
      setIsEdit(false);
      setIsDrop(false);
      // console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, update: false }));
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      console.log('rerer');

      textareaRef.current.style.height =
        textareaRef.current?.scrollHeight + 'px';
    }
  }, []);

  return (
    <div className="edit">
      <span>
        {authState.defaultPic ? (
          <img src={authState.defaultPic} alt="프로필사진" />
        ) : (
          <img src={profileImg} alt="프로필사진" />
        )}
      </span>
      <section>
        <textarea
          style={{ height: `${textareaRef.current?.scrollHeight}px` }}
          onChange={(e) => {
            handleResizeHeight();
            handleEditContent(e);
          }}
          ref={textareaRef}
          spellCheck="false"
          // rows={textareaRef.current?.scrollHeight}
          value={editContent}
        />
        <div className="controller">
          <button
            onClick={() => {
              setIsEdit(false);
            }}
          >
            취소
          </button>
          <button
            onClick={submitEditContent}
            id="submit"
            disabled={editContent.length === 0 || editContent === content}
          >
            저장
          </button>
        </div>
      </section>
    </div>
  );
}
