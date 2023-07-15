import { Form, Input, Button } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPostRequest, removeImage, uploadImagesRequest } from '../slices/postSlice';
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
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    imagePaths.forEach(p => {
      formData.append('image', p);
    });
    formData.append('content', text);
    return dispatch(addPostRequest(formData));
    // setText('');
  }, [dispatch, text, imagePaths]);

  /*
   * 유사배열 관련 정리..
   * array = [1, 2, 3] <= 배열
   * nodes = document.querySelectorAll('div'): NodeList [ div, div...] <= 유사배열
   *
   * Array.isArray(array): true
   * Array.isArray(nodes): false
   *
   * array instanceof Array: true
   * nodes instanceof Array: false
   *
   * array는 직접 [] 리터럴을 사용하여 선언했기 때문에 배열이다.
   * nodes는 document.querySelectorAll() 메서드가 반환한 객체이므로 유사배열이다.
   * ex) var heights = {
   *  0: '172',
   *  1: '162',
   *  2: '182',
   * } <= 유사배열임 Array관련 메서드를 사용할 수 없음 (forEach, map, filter, reduce 등)
   * 따라서 forEach등을 사용할 경우 에러가 뜸
   * 이 때 forEach의 call 메서드를 사용하면 유사배열을 배열로 변환할 수 있음
   */
  const onChangeImages = useCallback(e => {
    console.log('images', e.target.files); // 이미지 정보들
    const imageFormData = new FormData(); // multipart 형식으로 보내야 함
    // e.target.files는 유사배열이므로 배열로 만들어줘야 함
    [].forEach.call(e.target.files, file => {
      imageFormData.append('image', file); // image라는 키로 파일들을 넣어줌
    });
    dispatch(uploadImagesRequest(imageFormData));
  }, []);

  const onRemoveImage = useCallback(
    idx => () => {
      dispatch(removeImage(idx));
    },
    [],
  );

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />
      <div>
        <input
          type="file"
          name="image"
          multiple
          ref={imageInput}
          style={{ visibility: 'hidden' }}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={addPostLoading}>
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((img, i) => (
          <div key={img} style={{ display: 'inline-block' }}>
            <img src={`http://localhost:3065/${img}`} style={{ width: '200px' }} alt={img} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
