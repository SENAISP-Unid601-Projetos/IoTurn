import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL; //Posso usar "||" para fallback

class ApiService {
  // Método GET
  static async getRequest(APIendpoint) {
    const userId = JSON.parse(localStorage.getItem("login_info"));
    const fullUrl = `${API_BASE_URL}${APIendpoint}/${userId.id}`;

    try {
      const response = await axios.get(fullUrl);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(`Erro ao enviar requisição GET para ${fullUrl}: `, error);
      throw error;
    }
  }

  // Método POST
  static async postRequest(APIendpoint, data) {
    console.log(API_BASE_URL);
    console.log(APIendpoint);

    const fullUrl = `${API_BASE_URL}${APIendpoint}`;
    try {
      const response = await axios.post(fullUrl, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao enviar a requisição POST para ${fullUrl}:`, error);
      throw error;
    }
  }

  // Método PUT
  static async putRequest(APIendpoint, data,){

    const fullUrl = `${API_BASE_URL}${APIendpoint}`; 
    
      try{
        const response = await axios.put(fullUrl, data,{
          withCredentials: true,
        });
        return response.data;
      } catch(error) {
        console.error(`Erro ao enivar a requisição PUT para ${fullUrl}.`,error);
        throw error;
      }
  }
}

export default ApiService;
