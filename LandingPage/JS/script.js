let popupAtivo = null;

document.addEventListener('DOMContentLoaded', () => {
  const acionarSaibaMais = document.querySelector('#btn-action');
  const saibaMais = document.querySelector('.saibaMais');

  // Adiciona botão de fechar ao popup (se não existir)
  if (!saibaMais.querySelector('.btn-close')) {
    const botaoFechar = document.createElement('button');
    botaoFechar.className = 'btn-close position-absolute top-0 end-0 m-3';
    botaoFechar.setAttribute('aria-label', 'Fechar');
    botaoFechar.addEventListener('click', () => {
      fecharPopup();
      fadeInElement();
    });
    saibaMais.appendChild(botaoFechar);
  }

  acionarSaibaMais.addEventListener('click', e => {
    e.stopPropagation();
    abrirPopup(saibaMais);
    fadeOutElement();
  });

  // Fecha popup ao clicar fora
  document.addEventListener('click', event => {
    if (popupAtivo && !popupAtivo.contains(event.target)) {
      fecharPopup();
      fadeInElement();
    }
  });

  // Fecha com tecla ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popupAtivo) {
      fecharPopup();
      fadeInElement();
    }
  });
});

function abrirPopup(element) {
  fecharPopup();

  popupAtivo = element;
  element.classList.add('active');

  // Acessibilidade
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  element.setAttribute('tabindex', '-1');
  element.focus();

  // Impede scroll do fundo
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // Garante que o clique interno não feche o popup
  element.onclick = e => e.stopPropagation();
}

function fecharPopup() {
  if (popupAtivo) {
    popupAtivo.classList.remove('active');

    // Remove blur se existir
    const conteudo = document.getElementById('conteudo-blur');
    if (conteudo) {
      conteudo.classList.remove('blur-ativo');
    }

    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    popupAtivo = null;
  }
}

function fadeOutElement() {
  const el = document.querySelectorAll('.main');
  setTimeout(() => {
    el.forEach(element => {
      if (element) {
        element.classList.remove('fadeIn');
        element.classList.add('fadeOut');
      }
    });
  }, 100);
}

function fadeInElement() {
  const el = document.querySelectorAll('.main');
  setTimeout(() => {
    el.forEach(element => {
      if (element) {
        element.style.display = 'block';
        element.classList.remove('fadeOut');
        element.classList.add('fadeIn');
      }
    });
  }, 100);
}
