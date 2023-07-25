import { Button, Input } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const PostCardContent = ({ postData, editMode, onCancelPostUpdate, onChangePostContent }) => {
  // split에서는 ()가 포함되어야 한다?
  const [editText, setEditText] = useState(postData);
  const { updatePostLoading } = useSelector(state => state.post);

  const onChangeText = useCallback(e => {
    setEditText(e.target.value);
  }, []);

  return (
    <div>
      {editMode ? (
        <>
          <TextArea
            value={editText}
            onChange={onChangeText}
            style={{ width: '100%', minHeight: 100 }}
            autoSize={false}
          />
          <Button.Group>
            <Button type="primary" loading={updatePostLoading} onClick={onChangePostContent(editText)}>
              수정
            </Button>
            <Button danger onClick={onCancelPostUpdate}>
              취소
            </Button>
          </Button.Group>
        </>
      ) : (
        postData?.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s#]+)/)) {
            return (
              <Link href={`/hashtag/${v.slice(1)}`} key={i} prefetch={false}>
                {v}
              </Link>
            );
          }
          return v;
        })
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onCancelPostUpdate: PropTypes.func.isRequired,
  onChangePostContent: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;
