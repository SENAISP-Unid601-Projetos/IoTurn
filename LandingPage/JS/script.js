let popupAtivo = null;

document.addEventListener('DOMContentLoaded', () => {
  // Seletores dos botões
  const acionarSaibaMais = document.querySelector('#btn-action');

  // Seletores dos popups
  const saibaMais = document.querySelector('.saibaMais');

  acionarSaibaMais.addEventListener('click', e => {
    e.stopPropagation();
    abrirPopup(saibaMais);
    fadeOutElement();
  });

  // Fecha popup ao clicar fora dele
  document.addEventListener('click', event => {
    if (popupAtivo && !popupAtivo.contains(event.target)) {
      fecharPopup();
      fadeInElement();
    }
  });

  // Fecha popup ao pressionar ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popupAtivo) {
      fecharPopup();
    }
  });
});

function abrirPopup(element) {
  fecharPopup();

  popupAtivo = element;
  element.classList.add('active');

  // Previne scroll do fundo da página
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // Impede que clique dentro do popup feche ele
  element.addEventListener('click', e => e.stopPropagation());
}

function fecharPopup() {
  if (popupAtivo) {
    popupAtivo.classList.remove('active');

    // Remove o blur do conteúdo
    const conteudo = document.getElementById('conteudo-blur');
    if (conteudo) {
      conteudo.classList.remove('blur-ativo');
    }

    // Libera o scroll da página
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
    })
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
