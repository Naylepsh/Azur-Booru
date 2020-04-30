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

  if (post._id) {
    delete body.file;
    return http.put(`${apiEndpoint}/${post._id}`, body);
  } else {
    const data = new FormData();
    for (const key in body) {
      data.append(key, body[key]);
    }
    return http.post(`${apiEndpoint}`, data);
  }
}

export function deletePost(id) {
  if (id) {
    return http.delete(`${apiEndpoint}/${id}`);
  }
}
