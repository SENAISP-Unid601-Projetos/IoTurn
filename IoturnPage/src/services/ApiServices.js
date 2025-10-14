import axios from "axios";

class ApiService {
  // Método GET - envia uma requisição e retorna o JSON
  static async getRequest(APIendpoint) {
    try {
      const response = await axios.get(APIendpoint);
      return response.data; // Axios retorna os dados diretamente em 'response.data'
    } catch (error) {
      console.error(
        "Retorno null por conta de erro ao enviar requisição GET: ",
        error
      );
      return null; // Retorna null ou outro valor adequado
    }
  }

  // Método POST - envia uma requisição com um objeto JavaScript como JSON
  static async postRequest(APIendpoint, data) {
    try {
      const response = await axios.post(APIendpoint, data);
      return response.data; // Axios retorna os dados diretamente em 'response.data'
    } catch (error) {
      console.error(
        "Retorno null por conta de erro ao enviar a requisição POST:",
        error
      );
      return null; // Retorna null ou outro valor adequado
    }
  }
}

export default ApiService;
