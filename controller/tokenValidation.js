import axios from "axios";
import { LocalStorage } from "node-localstorage";
import dotenv from "dotenv";

dotenv.config();

const appId = process.env.appId;
const hashToken = process.env.hashToken;

const localStorage = new LocalStorage("./scratch");

// const authURL = `https://api.iq.inrix.com/auth/v1/appToken?appId=${appId}&hashToken=${hashToken}`;

async function refreshToken() {
  await axios
    .get("https://api.iq.inrix.com/auth/v1/appToken", {
      params: {
        appId: appId,
        hashToken: hashToken,
      },
    })
    .then(function (response) {
      localStorage.setItem("token", response.data.result.token);
      localStorage.setItem("expiry", response.data.result.expiry);
      return response.data.result.token;
    })
    .catch(function (error) {
      console.log(error.response.data);
      return error.response.data;
    });
}

function isTokenExpired(token) {
  if (!token) {
    return true;
  }
  const expiry = localStorage.getItem("expiry");
  const now = new Date();
  const expiryDate = new Date(expiry);
  if (now > expiryDate) {
    return true;
  } else {
    return false;
  }
}

async function getToken() {
  const token = localStorage.getItem("token");
  if (isTokenExpired(token)) {
    const newToken = await refreshToken();
    return newToken;
  } else {
    return token;
  }
}

export default { getToken };
