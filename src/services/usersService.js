import ApiService from "./ApiServices";

const API_URL = "/users/getAll";

export const fetchAllUserData = async () => {
  const rawData = await ApiService.getRequest(API_URL);
  return rawData;
};
