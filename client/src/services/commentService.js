import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/comments";

export function getComments() {
  return http.get(apiEndpoint);
}

export function getComment(id) {
  return http.get(`${apiEndpoint}/${id}`);
}
