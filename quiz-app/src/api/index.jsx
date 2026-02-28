import axios from "axios";

export const BASE_URL = "http://localhost:5050/";

export const ENDPOINTS = {
  participant: "participant",
  question: "question",
  getAnswers: "question/GetAnswer",
};

export const createApiEndpoint = (endpoint) => {
  const url = BASE_URL + "api/" + endpoint + "/";

  return {
    fetch: () => axios.get(url),
    fetchById: (id) => axios.get(url + id),
    post: (data) => axios.post(url, data),
    put: (id, data) => axios.put(url + id, data),
    delete: (id) => axios.delete(url + id),
  };
};
