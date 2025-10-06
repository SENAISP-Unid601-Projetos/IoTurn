import React, { useEffect, useRef } from "react";
import SidebarButton from "../atoms/SidebarButton";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

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
            setOuterDiv("h-screen w-55 bg-slate-950 p-4 flex flex-col gap-2 md:flex trabsition-all duration-300");
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
        <div ref={sidebarRef} className={outerDiv}>
            <Menu className="text-white hover:text-blue-600" onClick={toggleVisibility} />

            {showBar && (
                <div className={"flex flex-col gap-2 w-40"}>
                    <SidebarButton text={"Home"} onClick={() => navigate("/")} />
                    <SidebarButton text="Dashboard" onClick={() => navigate("/dashboard")} />
                    <SidebarButton text="Chat" onClick={() => navigate("/chatbot")} />
                </div>
            )}
        </div>
    );
}

export default Sidebar;
