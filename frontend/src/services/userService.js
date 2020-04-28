import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/users";

export function register(user) {
  return http.post(`${apiEndpoint}/register`, {
    name: user.username,
    password: user.password,
  });
}
