import axios from 'axios';

export function addPostAPI(data) {
  console.log('addPostAPI data ===', data);
  return axios.post('/post', data);
}

export function loadPostsAPI(data) {
  // console.log('loadPostsAPI data ===', data);
  return axios.get(`/posts?lastId=${data || 0}`);
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

export function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
}

export function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}
