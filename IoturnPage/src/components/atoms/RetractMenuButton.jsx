import { useState } from "react";

function RetractMenuButton({ buttonText, innerItens, className }) {
    const [isRetracted, setIsRetracted] = useState(true);

    return (
        <>
            <div className={className} onClick={() => setIsRetracted(!isRetracted)}> {buttonText}
                {isRetracted &&
                    <div>
                        {innerItens}
                    </div>
                }
            </div>
        </>
    )
}

export default RetractMenuButton;