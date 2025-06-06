const WS_URL = "ws://localhost:3000";

document.addEventListener("DOMContentLoaded", initChat);

function initChat() {
  const chatContainer = document.getElementById("chat-container");
  const chatForm = document.getElementById("chat-form");
  const textarea = document.getElementById("chat-input");
  const socket = new WebSocket(WS_URL);

  function addMessage(text, sender = "bot") {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    div.textContent = text;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function ajustarAltura() {
    textarea.style.height = "38px";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  function configurarWebSocket() {
    socket.addEventListener("open", () => {
      console.log("✅ Conectado ao WebSocket");
      addMessage("Olá! Como posso ajudar hoje?");
    });

    socket.addEventListener("message", (event) => {
      addMessage(event.data, "bot");
    });

    socket.addEventListener("error", (err) => {
      console.error("Erro no WebSocket:", err);
      addMessage("⚠️ Erro de conexão. Tente novamente mais tarde.", "bot");
    });
  }

  function enviarMensagem(text) {
    addMessage(text, "user");

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(text);
    } else {
      addMessage("⚠️ Conexão perdida. Mensagem não enviada.", "bot");
    }

    textarea.value = "";
    textarea.style.height = "38px";
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
        chatForm.requestSubmit();
      }
    });
  }

  configurarWebSocket();
  configurarEventos();
}
