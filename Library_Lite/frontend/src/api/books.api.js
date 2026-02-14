import axios from "axios";

const API = "http://localhost:5000/api/books";

export const getBooks = (search = "") =>
  axios.get(API, { params: { search } });

export const createBook = (data) =>
  axios.post(API, data);

export const updateBook = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteBook = (id) =>
  axios.delete(`${API}/${id}`);
