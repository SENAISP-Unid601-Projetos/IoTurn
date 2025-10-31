import ApiService from "./ApiServices";

const API_URL = "/users";

export const fetchAllUserData = async () => {
  console.log("Buscando dados da nova API...");

  const rawData = await ApiService.getRequest(API_URL);
  return rawData;
};
