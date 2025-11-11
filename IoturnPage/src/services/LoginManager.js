class LoginManager {

    // Por ser meio redundante talvez seja melhor utilizar no código isso:
    // const token = JSON.parse(localStorage.getItem("login_info"))
    static data = {};
    static token = null;

    static getItens() {
        this.token = localStorage.getItem("login_info");
        return this.token ? JSON.parse(this.token) : null;
    }
}

export default LoginManager;
