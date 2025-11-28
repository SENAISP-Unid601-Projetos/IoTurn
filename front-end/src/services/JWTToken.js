// Esse código serve para gerenciar requisições envolvendo cookies.
// Serve principalmente para que o back-end receba Token JWT armazenado durante o login. Com esse token será possível o back-end saber que tipo de autorização o usuário possuí.

class JWTToken {
  //   Retorna cookie com nome especificado
  static async getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // Função de criação de cookie
  //   cname = Nome do cookie
  //   cValue = Valor do cookit
  //   exDays = Validade do cookie
  static async setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
}

export default JWTToken;
