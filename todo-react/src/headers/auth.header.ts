type Token = {
  token: string;
  tokenExp: number;
};

export function setHeaders() {
  const commonHeaders = new Headers();
  const token = localStorage.getItem("token");
  if (!token) return;
  if (token) {
    const parsedToken: Token = JSON.parse(token);
    if (parsedToken.tokenExp < new Date().getTime()) {
      localStorage.removeItem("token");
      console.log("Token expired, please login again");
    } else {
      commonHeaders.append("Content-Type", "application/json");
      commonHeaders.append("Authorization", `Bearer ${parsedToken.token}`);
    }
  }
  return commonHeaders;
}
