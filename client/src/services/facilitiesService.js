import axios from "axios";

const API_URL = "http://localhost:5000/api/facilities/";
const AUTH_API_URL = "http://localhost:5000/api/auth/";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getClassroomAvailability = async (date) => {
  const res = await axios.get(API_URL + "classrooms/availability", {
    params: { date },
    headers: getAuthHeader(),
  });

  return res.data;
};

export const getAllClassrooms = async () => {
  const res = await axios.get(API_URL + "classrooms", {
    headers: getAuthHeader(),
  });

  return res.data;
};

export const getAllReservations = async () => {
  const res = await axios.get(API_URL + "reservations", {
    headers: getAuthHeader(),
  });

  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get(AUTH_API_URL + "users", {
    headers: getAuthHeader(),
  });

  return res.data;
};

export const getDatabaseStats = async () => {
  const res = await axios.get(API_URL + "stats", {
    headers: getAuthHeader(),
  });

  return res.data;
};
