import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/users";

export function login(name, password) {
  return http.post(`${apiEndpoint}/login`, {
    name,
    password,
  });
}

export function logout() {
  return http.get(`${apiEndpoint}/logout`);
}
