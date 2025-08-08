import React, { useState } from "react";
import logo from "../../assets/LogoSemBorda2.png";
import backgroundImage from "../../assets/Fundo.jpg";
import InputField from "../../components/InputField";

export default function LandingPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setIsRegistering(false);
  };

  const switchToRegister = () => {
    setIsRegistering(true);
  };

  const switchToLogin = () => {
    setIsRegistering(false);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white overflow-x-hidden font-sans"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <header className="absolute top-0 w-full flex justify-between items-center py-4 px-6 z-10">
        <img src={logo} alt="Logo IoTurn" className="h-16" />
        <button
          onClick={openSidebar}
          title="Login"
          className="bg-transparent borde-none cursor-pointer mr-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </header>

      <main className="min-h-screen flex items-center justify-end text-right pr-20">
        <div className="max-w-1/2">
          <p className="font-semibold text-2xl text-[#2d86e5]">
            IoTurn: Monitoramento Inteligente para Torneamento de Alta Precisão
          </p>
          <h1 className="text-6xl font-bold">
            Dados em tempo real para otimizar sua produção
          </h1>
          <p className="text-xl mt-2">
            A IoTurn utiliza IoT para monitorar tornos mecânicos em tempo real,
            coletando dados como velocidade, temperatura e eficiência. Aumente a
            produtividade com decisões baseadas em dados.
          </p>
        </div>
      </main>

      <div
        className={`fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300 ease-in-out ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      ></div>

      <aside
        className={`fixed top-0 ${
          isRegistering ? "w-full h-full" : "w-[35%] h-full"
        } bg-white/10 backdrop-blur-md p-6 z-[100] transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "right-0" : "-right-full"
        }`}
      >
        <button
          onClick={closeSidebar}
          className="self-end bg-transparent border-none text-white text-3xl cursor-pointer"
        >
          &times;
        </button>

        <div className="h-4/5 mt-8 text-white">
          <form
            className={`w-full flex flex-col items-center ${
              isRegistering
                ? "overflow-y-auto h-full py-8"
                : "justify-center h-full"
            }`}
          >
            <h2 className="text-2xl border-b border-[#2d86e5] pb-2 mb-8">
              {isRegistering ? "Cadastro" : "Login"}
            </h2>

            {isRegistering ? (
              <>
                <InputField
                  label="Nome da Empresa"
                  type="text"
                  id="nomeEmpresaInput"
                  placeholder="Digite o nome da empresa"
                />
                <InputField
                  label="CNPJ"
                  type="text"
                  id="cnpjInput"
                  placeholder="Digite o CNPJ"
                />
                <InputField
                  label="Telefone"
                  type="text"
                  id="telefoneInput"
                  placeholder="Digite o telefone"
                />
                <InputField
                  label="Endereço"
                  type="text"
                  id="enderecoInput"
                  placeholder="Digite o endereço"
                />
                <InputField
                  label="Email"
                  type="email"
                  id="emailInput"
                  placeholder="Digite o email"
                />
                <InputField
                  label="Data de Contratação"
                  type="date"
                  id="dataContratacaoInput"
                  placeholder="Selecione a data"
                />
                <div className="w-4/5 flex flex-col mb-4">
                  <label
                    htmlFor="statusInput"
                    className="block mb-1 text-sm text-white"
                  >
                    Status
                  </label>
                  <select
                    id="statusInput"
                    className="w-full h-10 bg-transparent border-b border-gray-300 text-white focus:outline-none"
                  >
                    <option value="" className="bg-black text-white">
                      Selecione o status
                    </option>
                    <option value="Ativo" className="bg-black text-white">
                      Ativo
                    </option>
                    <option value="Suspenso" className="bg-black text-white">
                      Suspenso
                    </option>
                    <option value="Cancelado" className="bg-black text-white">
                      Cancelado
                    </option>
                  </select>
                </div>
                <InputField
                  label="Id da Máquina"
                  type="number"
                  id="idMaquinaInput"
                  placeholder="Digite o ID da máquina"
                />
                <InputField
                  label="Id do Usuário"
                  type="number"
                  id="idUsuarioInput"
                  placeholder="Digite o ID do usuário"
                />
                <InputField
                  label="Senha"
                  type="password"
                  id="passwordInput"
                  placeholder="Digite sua senha"
                />
                <InputField
                  label="Confirmar Senha"
                  type="password"
                  id="confirmPasswordInput"
                  placeholder="Confirme sua senha"
                />
              </>
            ) : (
              <>
                <InputField
                  label="Email"
                  type="email"
                  id="emailInput"
                  placeholder="Digite seu email"
                />
                <InputField
                  label="Senha"
                  type="password"
                  id="passwordInput"
                  placeholder="Digite sua senha"
                />
              </>
            )}

            <div className="w-4/5">
              <button
                type="submit"
                className="w-full mt-4 py-2 px-4 bg-[#2d86e5] text-white rounded cursor-pointer text-base transition-colors duration-300 ease-in-out hover:bg-[#1a5bb8]"
              >
                {isRegistering ? "Cadastrar" : "Entrar"}
              </button>

              <p className="cursor-pointer mt-2">
                {isRegistering ? (
                  <>
                    Já tem uma conta?{" "}
                    <span
                      className="text-blue-400 hover:text-blue-300"
                      onClick={switchToLogin}
                    >
                      Entrar
                    </span>
                  </>
                ) : (
                  <>
                    Ainda não tem uma conta?{" "}
                    <span
                      className="text-blue-400 hover:text-blue-300"
                      onClick={switchToRegister}
                    >
                      Cadastre-se
                    </span>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </aside>

      <footer className="absolute bottom-0 w-full text-center py-4">
        <p className="mb-0">© 2025 IoTurn. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
