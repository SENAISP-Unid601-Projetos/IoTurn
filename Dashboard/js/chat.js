document.addEventListener('DOMContentLoaded', () => {
  const chatIcon = document.querySelector('#chatIcon');
  const chatWindow = document.querySelector('#chatWindow');
  const chatBody = document.querySelector('#chatBody');
  const chatInput = document.querySelector('#chatInput');
  const sendBtn = document.querySelector('#sendBtn');

  chatIcon.addEventListener('click', () => {
    chatWindow.classList.toggle('d-none');
    if (chatWindow.classList.contains('d-none')) {
      chatInput.focus();
    }
  });

  sendBtn.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (msg !== '') {
      addMessage(msg, 'user');
      chatInput.value = '';
      chatInput.style.height = 'auto';
      botReply(msg);
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    const maxHeight = 100;
    if (chatInput.scrollHeight <= maxHeight) {
      chatInput.style.height = chatInput.scrollHeight + 'px';
    } else {
      chatInput.style.height = maxHeight + 'px';
    }
  });

  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user' : 'bot');
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function botReply(userMessage) {
    setTimeout(() => {
      addMessage('Entendi! Em breve um atendente responderá.', 'bot');
    }, 500);
  }
});
