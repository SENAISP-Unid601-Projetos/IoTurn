import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const togglePanel = () => setIsSignUp(!isSignUp);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2a3a] to-[#90b6e4] flex items-center justify-center font-sans">
      <div className="relative w-full max-w-4xl h-[500px] flex rounded-2xl shadow-2xl overflow-hidden bg-[#1a2a3a]/80 backdrop-blur-md">
        
        {/* Container Esquerdo (Formulário de Login) */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-left">Entrar</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d86e5]"
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d86e5]"
            />
            <a href="#" className="text-sm text-gray-400 hover:text-[#2d86e5] mb-6">
              Esqueceu sua senha?
            </a>
            <motion.button className="w-full bg-[#2d86e5] text-white py-3 rounded-lg font-semibold transition-colors hover:bg-[#256ab3]">
              ENTRAR
            </motion.button>
          </div>
        </div>

        {/* Container Direito (Formulário de Cadastro) */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-left">Criar Conta</h2>
            <input
              type="text"
              placeholder="Nome"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d86e5]"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d86e5]"
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 mb-4 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d86e5]"
            />
            <motion.button className="w-full bg-[#2d86e5] text-white py-3 rounded-lg font-semibold transition-colors hover:bg-[#256ab3]">
              CADASTRAR
            </motion.button>
          </div>
        </div>

        {/* Painel de Sobreposição Deslizante com Gradiente Sólido */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#1a2a3a] to-[#4471a1] text-white flex items-center justify-center p-12 text-center"
          initial={false}
          animate={{ x: isSignUp ? "100%" : "0%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "toSignIn" : "toSignUp"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col justify-center items-center"
            >
              {isSignUp ? (
                <>
                  <h1 className="text-4xl font-bold mb-4">Bem-vindo de Volta!</h1>
                  <p className="mb-8">Para se manter conectado, faça o login com suas informações.</p>
                  <motion.button
                    onClick={togglePanel}
                    className="border-2 border-white rounded-full py-2 px-8 font-semibold transition-colors hover:bg-white hover:text-[#1a2a3a]"
                  >
                    ENTRAR
                  </motion.button>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-4">Olá, Amigo!</h1>
                  <p className="mb-8">Insira seus dados e comece sua jornada conosco.</p>
                  <motion.button
                    onClick={togglePanel}
                    className="border-2 border-white rounded-full py-2 px-8 font-semibold transition-colors hover:bg-white hover:text-[#1a2a3a]"
                  >
                    CADASTRAR
                  </motion.button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
