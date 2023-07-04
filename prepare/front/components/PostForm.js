import { Form, Input, Button } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../slices/postSlice';

const PostForm = () => {
  const dispatch = useDispatch();
  const { imagePaths } = useSelector(state => state.post);
  const [text, setText] = useState('');
  const imageInput = useRef(); // 실제 돔 접근

  const onChangeText = useCallback(e => {
    setText(e.target.value);
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, []);

  const onSubmit = useCallback(() => {
    dispatch(addPost());
    setText('');
  }, [dispatch]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />
      <div>
        <input type="file" multiple ref={imageInput} style={{ visibility: 'hidden' }} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">
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
