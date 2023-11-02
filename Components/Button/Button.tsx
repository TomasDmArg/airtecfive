import React from "react";
import styles from "./Button.module.scss";
interface ButtonProps{
    onClick?: ()=>void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    type?: "main" | "secondary";
}
export const Button = ({onClick, children, className, disabled, type}: ButtonProps) => {
    const classNames = {
        "main": styles.buttonMain,
        "secondary": styles.buttonSecondary,
    }
    return (
        <button className={className + " " + classNames[type ?? "main"]} onClick={onClick} disabled={disabled} >
            {children}
        </button>
    )
}