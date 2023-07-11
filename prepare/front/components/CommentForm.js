import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentRequest } from '../slices/postSlice';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);
  const { addCommentLoading, addCommentDone } = useSelector(state => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText, me);
    dispatch(addCommentRequest({ content: commentText, postId: post.id, userId: me.id, User: me }));
  }, [post, commentText, dispatch, me]);

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea
          value={commentText}
          onChange={onChangeCommentText}
          rows={4}
          style={{ resize: 'none' }}
          placeholder="의견을 공유하세요!"
        />
        <Button
          type="primary"
          htmlType="submit"
          style={{
            position: 'absolute',
            right: 0,
            bottom: -40,
          }}
          onClick={onSubmitComment}
          loading={addCommentLoading}
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
