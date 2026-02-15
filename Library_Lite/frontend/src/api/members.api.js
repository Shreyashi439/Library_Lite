import axios from "axios";

const API = "http://localhost:5000/api/members";

export const getMembers = () =>
  axios.get(API);

export const createMember = (data) =>
  axios.post(API, data);

export const updateMember = (id, data) =>
  axios.put(`${API}/${id}`, data);


export const deleteMember = (id) =>
  axios.delete(`${API}/${id}`);
