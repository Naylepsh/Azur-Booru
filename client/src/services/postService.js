import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/posts";

export function getPosts(query) {
  return http.get(`${apiEndpoint}?${query}`);
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
  return http.delete(`${apiEndpoint}/${id}`);
}

export function toggleVote(id, voteType) {
  return http.post(`${apiEndpoint}/${id}/toggle-vote`, { voteType });
}
