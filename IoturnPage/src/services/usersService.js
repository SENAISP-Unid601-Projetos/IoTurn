const API_URL = "http://10.110.12.24:3000/users/getAll/1";

export const fetchAllUserData = async () => {
  console.log("Buscando dados da nova API...");
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Falha ao buscar os dados da nova API");
  }
  const rawData = await response.json();
  console.log(rawData);

  return rawData;
};
