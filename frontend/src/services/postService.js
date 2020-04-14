import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/posts";

export function getPosts() {
  return http.get(apiEndpoint);
}
