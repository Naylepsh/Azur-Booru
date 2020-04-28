import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/users";

export function login(user) {
  return http.post(`${apiEndpoint}/login`, {
    name: user.username,
    password: user.password,
  });
}
