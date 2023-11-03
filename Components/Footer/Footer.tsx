import React from "react";
import styles from "./Footer.module.scss";
import { IconAt, IconBrandFacebook, IconBrandInstagram, IconBrandX, IconMail, IconPhone } from "@tabler/icons-react";
interface FooterProps{

    className?: string;
}
export const Footer = ({className}: FooterProps) => {

    return (
        <footer className={className + " " + styles.footer }>
            <img className={styles.navbar__logo} src="/logo.svg" alt="AirTecFive logo" />
            <section>
                <div><IconPhone /> 1234567890</div>
                <div><IconMail /> correo@airtecfive.com</div>
                <IconBrandFacebook />
                <IconBrandX />
                <IconBrandInstagram />
            </section>
        </footer>
    )
}

