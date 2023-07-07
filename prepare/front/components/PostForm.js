import { Form, Input, Button } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPostRequest } from '../slices/postSlice';
import useInput from '../hooks/useInput';

const PostForm = () => {
  const dispatch = useDispatch();
  const { addPostLoading, addPostDone } = useSelector(state => state.post);
  const { imagePaths } = useSelector(state => state.post);
  const [text, onChangeText, setText] = useInput('');
  const imageInput = useRef(); // 실제 돔 접근

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone, setText]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, []);

  const onSubmit = useCallback(() => {
    dispatch(addPostRequest());
    // setText('');
  }, [dispatch]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />
      <div>
        <input type="file" multiple ref={imageInput} style={{ visibility: 'hidden' }} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={addPostLoading}>
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map(img => (
          <div key={img} style={{ display: 'inline-block' }}>
            <img src={img} style={{ width: '200px' }} alt={img} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
