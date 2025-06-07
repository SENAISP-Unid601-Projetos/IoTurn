document.addEventListener("DOMContentLoaded", initChat);

function initChat() {
  const chatContainer = document.getElementById("chat-container");
  const chatForm = document.getElementById("chat-form");
  const textarea = document.getElementById("chat-input");
  const API_BASE_URL = 'http://10.110.12.59:3000';

  /**
   * Adiciona uma mensagem à interface do chat.
   * @param {string} text - O texto da mensagem.
   * @param {string} sender - 'user' ou 'bot'.
   * @param {string|null} messageId - O ID único da mensagem, vindo do backend.
   */
  function addMessage(text, sender = "bot", messageId = null) {
    const messageRow = document.createElement("div");
    messageRow.classList.add("message-row", sender);
    // Se for um bot, e tivermos um ID, removemos o indicador de "digitando"
    if (sender === 'bot' && messageId) {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    avatar.innerHTML =
      sender === "user"
        ? '<i class="fa-solid fa-user"></i>'
        : '<i class="fa-solid fa-robot"></i>';

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    
    // Adiciona o data-id à div que contém a mensagem e os botões
    if (messageId) {
        messageContent.dataset.id = messageId;
    }

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message", sender);
    messageBubble.textContent = text;
    messageContent.appendChild(messageBubble);

    // Adiciona botões de feedback apenas para mensagens reais do bot (com ID)
    if (sender === "bot" && messageId) {
      console.log('salve');
      
      const feedbackContainer = document.createElement("div");
      feedbackContainer.classList.add("feedback-icons");

      const likeBtn = document.createElement("button");
      likeBtn.innerHTML = '<i class="fa-solid fa-thumbs-up"></i>';
      likeBtn.onclick = () => handleFeedback(true, feedbackContainer, messageId, text);

      const dislikeBtn = document.createElement("button");
      dislikeBtn.innerHTML = '<i class="fa-solid fa-thumbs-down"></i>';
      dislikeBtn.onclick = () => handleFeedback(false, feedbackContainer, messageId, text);

      feedbackContainer.appendChild(likeBtn);
      feedbackContainer.appendChild(dislikeBtn);
      messageContent.appendChild(feedbackContainer);
    }

    messageRow.appendChild(avatar);
    messageRow.appendChild(messageContent);
    chatContainer.appendChild(messageRow);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  
  function showTypingIndicator() {
    // Verifica se o indicador já existe para não duplicar
    if (document.getElementById('typing-indicator')) return;
  
    const messageRow = document.createElement("div");
    messageRow.id = 'typing-indicator';
    messageRow.classList.add("message-row", 'bot');
    
    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';
  
    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message", 'bot');
    messageBubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    messageRow.appendChild(avatar);
    messageRow.appendChild(messageBubble);
    chatContainer.appendChild(messageRow);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }


  async function handleFeedback(isLike, container, messageId, messageText) {
    if (container.classList.contains("rated")) return;
    container.classList.add("rated");

    const feedbackValue = isLike ? 1 : 0;
    
    const likeBtn = container.children[0];
    const dislikeBtn = container.children[1];

    if (isLike) {
      likeBtn.classList.add("selected");
    } else {
      dislikeBtn.classList.add("selected", "dislike");
    }

    try {
      console.log("Enviando feedback:", { messageId, feedbackValue });
      const response = await fetch(`${API_BASE_URL}/feedbackGemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyReturned: messageId,
          feedback: feedbackValue,
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na rede: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Feedback recebido pelo servidor:", result);

    } catch (error) {
      console.error("Falha ao enviar feedback:", error);
      // Opcional: Adicionar uma pequena mensagem de erro na UI
      container.insertAdjacentHTML('afterend', '<p style="font-size: 0.8em; color: #e53d3d;">Erro ao registrar avaliação.</p>');
    }
  }

  
  async function enviarMensagem(text) {
    addMessage(text, "user");
    textarea.value = "";
    textarea.style.height = "42px";
    
    showTypingIndicator();

    try {
      const response = await fetch(`${API_BASE_URL}/askGemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      }); 

      if (!response.ok) {
        throw new Error(`Erro na rede: ${response.statusText}`);
      }
      
      const data = await response.json();

      // ==================================================================
      // ALTERAÇÃO DE DIAGNÓSTICO ABAIXO
      // ==================================================================

      // Primeiro, verificamos se a resposta do backend tem as chaves que esperamos.
      const responseText = data.data;
      const responseId = data.cacheId; // Esta é a chave crucial.

      if (responseText && responseId) {
        console.log('entrei');
        
        // Se temos texto E ID, tudo está correto. Chamamos a função como antes.
        addMessage(responseText, 'bot', responseId);
      } else {
        const errorMessage = `[DEBUG: Botões não gerados. A resposta da API não contém 'cacheId'. Resposta recebida: ${JSON.stringify(data)}]`;
        
        addMessage(responseText || "(Resposta vazia)", 'bot');
        
        addMessage(errorMessage, 'bot'); 
      }
      
    } catch (error) {
      console.error("Falha ao comunicar com o /askgemini:", error);
      addMessage("⚠️ Desculpe, não consegui processar sua solicitação. Tente novamente mais tarde.", 'bot', 'error-' + Date.now());
    }
  }

  function ajustarAltura() {
    textarea.style.height = "42px";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
  }
  
  function configurarEventos() {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = textarea.value.trim();
      if (!text) return;
      enviarMensagem(text);
    });

    textarea.addEventListener("input", ajustarAltura);

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  }

  setTimeout(() => {
    addMessage("Olá! Sou o assistente virtual da IoTurn. Como posso ajudar?", 'bot', 'welcome-' + Date.now());
  }, 500);

  configurarEventos();
}