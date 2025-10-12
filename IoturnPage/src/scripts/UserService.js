// const user_url = 'http://seu-backend.com/api/user/1';

// Dados mock que simulam a resposta da API
const mockUser = {
    name: 'João Silva',
    company: 'Empresa Demo',
    status: 'online',
};


export const fetchUserData = async () => {
  console.log("Buscando dados do usuário (simulação)...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Dados do usuário recebidos (simulação).");
      resolve(mockUser);
    }, 1500); 
  });

  /*
  // código real para chamada de API
  try {
    const response = await fetch(user_url);
    if (!response.ok) {
      throw new Error('Falha ao buscar dados do usuário');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro no serviço de usuário:", error);
    throw error; // Re-lança o erro para o componente tratar
  }
  */
};