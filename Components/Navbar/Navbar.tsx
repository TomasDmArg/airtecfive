"use client"
import React from "react";
import styles from "./Navbar.module.scss";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";
import { IconMenu2 } from "@tabler/icons-react";
import { AnimatePresence, motion     } from "framer-motion";

export const Navbar = () => {
    const router = useRouter();
    const [mobile, setMobile] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        if(isMobile) setMobile(true);
    }, []);

    return (
        <nav className={styles.navbar}>
            <img onClick={()=>router.push("/")} className={styles.navbar__logo} src="/logo.svg" alt="AirTecFive logo" />
            {/* Reserva, Antes de viajar, Servicios, Promociones, Información */}
            {
                !mobile ? (<ul className={styles.navbar__links}>
                    <li onClick={() => router.push(`../reservas/`)}>Reserva</li>
                    <li>Antes de viajar</li>
                    <li>Servicios</li>
                    <li>Promociones</li>
                    <li>Información</li>
                </ul>) : null
            }
            {
                mobile ? <IconMenu2
                    className={styles.navbar__menuIcon}
                    onClick={() => setOpen(!open)}
                /> : null
            }
            <AnimatePresence>
                {
                    open ? (
                        <motion.ul
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className={styles.navbar__links + " " + styles.navbar__links__mobile}
                        >
                            <li onClick={() => router.push(`../reservas/`)}>Reserva</li>
                            <li>Antes de viajar</li>
                            <li>Servicios</li>
                            <li>Promociones</li>
                            <li>Información</li>
                        </motion.ul>
                    ) : null
                }
            </AnimatePresence>
            
        </nav>
    )
}