"use client"
import React from "react";
import styles from "./Navbar.module.scss";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const router = useRouter();

    return (
        <nav className={styles.navbar}>
            <img className={styles.navbar__logo} src="/logo.svg" alt="AirTecFive logo" />
            {/* Reserva, Antes de viajar, Servicios, Promociones, Información */}
            <ul className={styles.navbar__links}>
                <li onClick={() => router.push(`../reservas/`)}>Reserva</li>
                <li>Antes de viajar</li>
                <li>Servicios</li>
                <li>Promociones</li>
                <li>Información</li>
            </ul>
        </nav>
    )
}