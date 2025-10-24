import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL; //Posso usar "||" para fallback

class ApiService {
  // Método GET
  static async getRequest(APIendpoint) {
    const fullUrl = `${API_BASE_URL}${APIendpoint}`;
    try {
      const response = await axios.get(fullUrl);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao enviar requisição GET para ${fullUrl}: `,
        error
      );
      throw error;
    }
  }

  // Método POST
  static async postRequest(APIendpoint, data) {
    const fullUrl = `${API_BASE_URL}${APIendpoint}`;
    try {
      const response = await axios.post(fullUrl, data);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao enviar a requisição POST para ${fullUrl}:`,
        error
      );
      throw error;
    }
  }
}

export default ApiService;