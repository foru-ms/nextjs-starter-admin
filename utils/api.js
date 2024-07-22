// utils/api.js
import axios from 'axios';

export const fetchData = async (model, page = 1) => {
  const response = await axios.get(`/api/${model}`, {
    params: { page },
  });
  return response.data[`${model}s`];
};

export const createData = async (model, body) => {
  const response = await axios.post(`/api/${model}`, body);
  return response.data;
};

export const fetchDataById = async (model, id) => {
  const response = await axios.get(`/api/${model}/${id}`);
  return response.data;
};

export const updateData = async (model, id, body) => {
  const response = await axios.put(`/api/${model}`, { id, ...body });
  return response.data;
};

export const deleteData = async (model, id) => {
  const response = await axios.delete(`/api/${model}`, {
    data: { id },
  });
  return response.data;
};
