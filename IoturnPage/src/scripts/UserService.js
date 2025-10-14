// const user_url = 'http://seu-backend.com/api/user/1';

// Dados mock que simulam a resposta da API
const mockUser = {
    name: 'João Lindo',
    company: 'Empresa Sexy',
    status: 'online',
};

// Esta é a nossa função de serviço
export const fetchUserData = async () => {
  console.log("Buscando dados do usuário (simulação)...");

  // SIMULAÇÃO DE CHAMADA DE REDE:
  // Retornamos uma Promise que resolve após 1.5 segundos.
  // Isso imita o tempo de espera de uma chamada de API real.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Dados do usuário recebidos (simulação).");
      resolve(mockUser);
    }, 1500); // 1.5 segundos de delay
  });
};

// QUANDO A API REAL EXISTIR, VOCÊ VAI APAGAR O CÓDIGO ACIMA E USAR ESTE:
/*
export const fetchUserData = async () => {
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
};
*/
