import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/posts";

export function getPosts() {
  return http.get(apiEndpoint);
}

export function getPost(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function uploadPost(post) {
  const body = { ...post };
  delete body._id;
  const data = new FormData();
  for (const key in body) {
    data.append(key, body[key]);
  }
  return http.post(apiEndpoint, data, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
}
