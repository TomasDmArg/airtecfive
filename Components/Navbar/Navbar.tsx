import React from "react";
import styles from "./Navbar.module.scss";
export const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <img className={styles.navbar__logo} src="/logo.svg" alt="AirTecFive logo" />
            {/* Reserva, Antes de viajar, Servicios, Promociones, Información */}
            <ul className={styles.navbar__links}>
                <li>Reserva</li>
                <li>Antes de viajar</li>
                <li>Servicios</li>
                <li>Promociones</li>
                <li>Información</li>
            </ul>
        </nav>
    )
}