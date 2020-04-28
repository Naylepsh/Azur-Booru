import http from "./httpService";

const apiEndpoint = "http://localhost:3001/api/v1/users";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(name, password) {
  const { data } = await http.post(`${apiEndpoint}/login`, {
    name,
    password,
  });
  loginWithJwt(data.jwt);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export async function logout() {
  localStorage.removeItem(tokenKey);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getJwt,
};
