import axios from "axios";

const API = "http://localhost:5000/api";

export const lendBook = (data) =>
  axios.post(`${API}/lend`, data);

export const returnBook = (data) =>
  axios.post(`${API}/return`, data);
