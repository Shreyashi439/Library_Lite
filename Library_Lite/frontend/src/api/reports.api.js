import axios from "axios";

const API = "http://localhost:5000/api/reports";

export const getOverdueReport = () => {
  return axios.get(`${API}/overdue`);
};

export const getTopBooksReport = (limit = 10) => {
  return axios.get(`${API}/top-books`, {
    params: { limit }
  });
};
