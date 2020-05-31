import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/comments";

export function getComments(query) {
  return http.get(`${apiEndpoint}${query}`);
}

export function getComment(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function postComment(postId, userId, body) {
  const data = { postId, userId, body };
  return http.post(`${apiEndpoint}`, data);
}
