window.onload = () => {
    const saibaMais = document.querySelector('.saibaMais');
    const btnAction = document.querySelectorAll('.btn-action');
    console.log(btnAction);

    btnAction.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            saibaMais.style.transform = 'translate(-50%, -50%) scale(1)';


    });
})