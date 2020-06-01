import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/comments";

export function getComments(query) {
  return http.get(`${apiEndpoint}${query}`);
}

export function getComment(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function postComment(postId, authorId, body) {
  const data = { postId, authorId, body };
  return http.post(`${apiEndpoint}`, data);
}

export function deleteComment(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}

export function toggleVote(commentId, voteType) {
  return http.post(`${apiEndpoint}/${commentId}/toggle-vote`, {
    voteType,
  });
}
