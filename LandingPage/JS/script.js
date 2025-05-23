let popupAtivo = null;

window.onload = () => {
  // Seletores dos botões
  const acionarSaibaMais = document.querySelectorAll('.btn-action');
  const acionarContato = document.querySelectorAll('.btn-action-contato');

  // Seletores dos popups
  const saibaMais = document.querySelector('.saibaMais');
  const contato = document.querySelector('.contato');

  // Adiciona evento ao botão "Saiba Mais"
  acionarSaibaMais.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      abrirPopup(saibaMais);
    });
  });

  // Adiciona evento ao botão "Contato"
  acionarContato.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      abrirPopup(contato);
    });
  });

  // Fecha popup ao clicar fora dele
  document.addEventListener('click', event => {
    if (popupAtivo && !popupAtivo.contains(event.target)) {
      fecharPopup();
    }
  });

  // Fecha popup ao pressionar ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popupAtivo) {
      fecharPopup();
    }
  });
};

function abrirPopup(element) {
  fecharPopup(); // Garante que só um popup fique aberto

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

    // Libera o scroll da página
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    popupAtivo = null;
  }
}
