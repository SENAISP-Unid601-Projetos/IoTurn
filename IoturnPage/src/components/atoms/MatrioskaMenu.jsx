import { useState } from "react";
import { ChevronRight } from "lucide-react";

function MatrioskaMenu({ buttonText, innerItens, className }) {
    const [isRetracted, setIsRetracted] = useState(true);

    const baseStyle =
        "flex items-center justify-between text-white hover:text-blue-600 p-2 rounded-md w-full text-left hover:bg-slate-800 transition-colors duration-300";

    return (
        <div>
            <button
                type="button"
                className={className ? className : baseStyle}
                onClick={() => setIsRetracted(!isRetracted)}
            >
                <span>{buttonText}</span>
                <ChevronRight strokeWidth={5} size={20}
                    className={`transition-transform duration-300 ${!isRetracted ? "rotate-90" : "rotate-0"}`}
                />
            </button>

            {!isRetracted && (
                <div className="ml-6 mt-1">
                    {innerItens}
                </div>
            )}
        </div>
    );
}

export default MatrioskaMenu;
