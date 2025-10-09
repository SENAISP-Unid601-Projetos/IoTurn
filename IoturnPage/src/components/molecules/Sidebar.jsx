import React, { useEffect, useRef } from "react";
import SidebarButton from "../atoms/SidebarButton";
import { useNavigate } from "react-router-dom";
import { Menu, User, Bot, List, Cpu, WifiCog, Eye, Settings } from "lucide-react";

// import matryoshka from '../../../matryoshka.png';
import MatrioskaMenu from "../atoms/MatrioskaMenu";

function Sidebar() {
  const [showBar, setShowBar] = React.useState(false);
  const [outerDiv, setOuterDiv] = React.useState(
    "h-screen w-15 bg-slate-950 p-4 flex flex-col gap-2 md:flex hidden"
  );
  const navigate = useNavigate();

  // Cria ref para a div do sidebar
  const sidebarRef = useRef(null);
  const toggleVisibility = () => {
    setShowBar(!showBar);

    if (showBar) {
      setOuterDiv(
        "h-screen w-15 bg-slate-950 p-4 flex flex-col gap-2 md:flex transition-all duration-300"
      );
    } else {
      setOuterDiv(
        "h-screen w-50 bg-slate-950 p-4 flex flex-col gap-2 md:flex trabsition-all duration-300"
      );
    }
  };

  // Detectar clique fora da sidebar
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowBar(false);
        setOuterDiv(
          "h-screen w-15 bg-slate-950 p-4 flex flex-col gap-2 md:flex transition-all duration-300"
        );
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={sidebarRef} className={outerDiv}>
        <Menu
          className="text-white hover:text-blue-600"
          onClick={toggleVisibility}
        />

        {showBar && (
          <>
              <div className="flex flex-col gap-2 w-40">
                <SidebarButton
                  text={
                    <>
                      <div className="flex">
                        <Eye className="pr-2" />
                        Máquinas
                      </div>
                    </>
                  }
                  onClick={() => navigate("#/maquinas")}
                />

              <SidebarButton
                text={
                  <div className="flex">
                    {" "}
                    <Bot className="pr-2" /> Hermes AI
                  </div>
                }
                onClick={() => navigate("#/relatorios")}
              />

              <MatrioskaMenu
                buttonText={<><div className="flex"><Settings className="pr-2"/>Gerenciamento </div></>}
                innerItens={
                  <>
                    <SidebarButton
                      text={
                        <>
                          <div className="flex">
                            <User className="pr-2" /> Usuários
                          </div>{" "}
                        </>
                      }
                      onClick={() => navigate("#/usuarios")}
                    />
                    <SidebarButton
                      text={
                        <>
                          <div className="flex">
                            <List className="pr-2" /> Máquinas
                          </div>{" "}
                        </>
                      }
                      onClick={() => navigate("#/maquinas")}
                    />
                    <SidebarButton
                      text={
                        <>
                          <div className="flex">
                            <Cpu className="pr-2" /> Dispositivos
                          </div>{" "}
                        </>
                      }
                      onClick={() => navigate("#/dispositivos")}
                    />
                    <SidebarButton
                      text={
                        <div className="flex">
                          <WifiCog className="pr-2" /> Gateways
                        </div>
                      }
                      onClick={() => navigate("#/gateways")}
                    />
                  </>
                }
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Sidebar;
