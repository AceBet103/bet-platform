import axios from "axios";

const API = axios.create({
  baseURL: "https://bet-platform-api.onrender.com/api"
});

export const getEvents = () => API.get("/events");
export const placeBet = (data) => API.post("/bets", data);
export const getRanking = () => API.get("/users/ranking");
export const getUserBets = (userId) => API.get(`/user/${userId}/bets`);
