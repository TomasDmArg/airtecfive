import React from "react";
import styles from "./Footer.module.scss";
interface FooterProps{

    className?: string;
}
export const Footer = ({className}: FooterProps) => {

    return (
        <footer className={className + " " + styles.footer }>

        <p>Contáctanos para obtener más información:</p>
        <ul>
            <li><strong>Teléfono:</strong> 1234567890</li>
            <li><strong>Correo Electrónico:</strong> <a href="mailto:correo@airtecfive.com">correo@airtecfive.com</a></li>
            <li><strong>Redes Sociales:</strong> Síguenos en Redes Sociales</li>
        </ul>
        
        <p>Estamos aquí las 24 horas del día, los 7 días de la semana para ayudarte en lo que necesites.</p>
        
        </footer>
    )
}

