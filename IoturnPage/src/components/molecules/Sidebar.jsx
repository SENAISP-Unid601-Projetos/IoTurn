import React, { useEffect, useRef } from "react";
import SidebarButton from "../atoms/SidebarButton";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

// import matryoshka from '../../../matryoshka.png';
import MatrioskaMenu from "../atoms/MatrioskaMenu";

function Sidebar() {
    const [showBar, setShowBar] = React.useState(false);
    const [outerDiv, setOuterDiv] = React.useState("h-screen w-15 bg-slate-950 p-4 flex flex-col gap-2 md:flex hidden");
    const navigate = useNavigate();

    // Cria ref para a div do sidebar
    const sidebarRef = useRef(null);

    const toggleVisibility = () => {
        setShowBar(!showBar);

        if (showBar) {
            setOuterDiv("h-screen w-15 bg-slate-950 p-4 flex flex-col gap-2 md:flex transition-all duration-300");
        } else {
            setOuterDiv("h-screen w-80 bg-slate-950 p-4 flex flex-col gap-2 md:flex trabsition-all duration-300");
        }
    };

    // Detectar clique fora da sidebar
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowBar(false);
                setOuterDiv("h-screen w-15 bg-slate-950 p-4 flex flex-col gap-2 md:flex transition-all duration-300");
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
                <Menu className="text-white hover:text-blue-600" onClick={toggleVisibility} />

                {showBar && (
                    <>
                        <div className={"flex flex-col gap-2 w-40"}>

                            <MatrioskaMenu buttonText={"Monitoramento"} innerItens={
                                <>

                                    <div className="flex flex-col gap-2 w-40">
                                        <SidebarButton text={"Máquinas"} onClick={() => navigate("#/maquinas")} />
                                    </div>
                                </>
                            } />

                            <SidebarButton text={"Hermes AI"} onClick={() => navigate("#/relatorios")} />

                            <MatrioskaMenu buttonText={"Gerenciamento"} innerItens={
                                <>
                                    <SidebarButton text={"Usuários"} onClick={() => navigate("#/usuarios")} />
                                    <SidebarButton text={"Máquinas"} onClick={() => navigate("#/maquinas")} />
                                    <SidebarButton text={"Dispositivos"} onClick={() => navigate("#/dispositivos")} />
                                    <SidebarButton text={"Gateways"} onClick={() => navigate("#/gateways")} />
                                </>
                            } />

                            {/* Matrioshkas */}
                            <div>
                                <MatrioskaMenu buttonText={"Boneca Matrioska"} innerItens={
                                    <>
                                        <img src="/matryoshka.png" alt="Test" className="text-amber-50 invert-100 w-40 h-40" />
                                        <MatrioskaMenu buttonText={"Matrioska"} innerItens={
                                            <>
                                                <img src="/matryoshka.png" alt="Test" className="text-amber-50 invert-100 w-35 h-35" />
                                                <MatrioskaMenu buttonText={"Matrioska"} innerItens={
                                                    <>

                                                        <img src="/matryoshka.png" alt="Test" className="text-amber-50 invert-100 w-30 h-30" />
                                                        <MatrioskaMenu buttonText={"Matrioska"} innerItens={
                                                            <>
                                                                <img src="/matryoshka.png" alt="Test" className="text-amber-50 invert-100 w-20 h-20" />
                                                                <MatrioskaMenu buttonText={"Matrioska"} innerItens={
                                                                    <>
                                                                        <img src="/matryoshka.png" alt="Test" className="text-amber-50 invert-100 w-20 h-20" />

                                                                    </>
                                                                } />
                                                            </>
                                                        } />
                                                    </>
                                                } />
                                            </>
                                        } />
                                    </>
                                } />
                            </div>


                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Sidebar;
