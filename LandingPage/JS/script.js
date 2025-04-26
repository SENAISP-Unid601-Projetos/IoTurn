let popupAtivo = null;

window.onload = () => {
  const acionarSaibaMais = document.querySelectorAll('.btn-action');
  const acionarContato = document.querySelectorAll('.btn-action-contato');
  const saibaMais = document.querySelector('.saibaMais');
  const contato = document.querySelector('.contato');

  acionarSaibaMais.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirPopup(saibaMais);
    });
  });

  acionarContato.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirPopup(contato);
    });
  });

  document.addEventListener('click', (event) => {
    if (popupAtivo && !popupAtivo.contains(event.target)) {
      fecharPopup();
    }
  });
};

function abrirPopup(element) {
  fecharPopup();

  popupAtivo = element;

  element.style.transform = 'translate(-50%, -50%) scale(1)';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  document.addEventListener('touchmove', prevenirScroll, { passive: false });

  element.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

function fecharPopup() {
  if (popupAtivo) {
    popupAtivo.style.transform = 'translate(-50%, -50%) scale(0)';
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.removeEventListener('touchmove', prevenirScroll);
    popupAtivo = null;
  }
}

function prevenirScroll(e) {
  e.preventDefault();
}
