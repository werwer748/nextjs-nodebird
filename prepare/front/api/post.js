import axios from 'axios';

export function addPostAPI(data) {
  console.log('addPostAPI data ===', data);
  return axios.post('/post', { content: data });
}

export function loadPostsAPI() {
  return axios.get('/posts');
}
export function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content });
}

export function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

export function unLikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}

export function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}
