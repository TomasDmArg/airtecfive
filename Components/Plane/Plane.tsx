'use client';
import {motion} from "framer-motion";
import styles from "@/app/Page.module.scss";
import { cubicBezier } from "framer-motion/dom";

export const Plane = ()=>{
    return (
        <motion.img
            initial={{ right: "-100%", top: "100%", opacity: 0, filter: "blur(10px)" }}
            animate={{ right: "-10%", top: "50%", opacity: 1, filter: "blur(0px)" }}
            transition={{
                duration: 2,
                ease: cubicBezier(.28,.58,.3,1)
            }}
            src="/airplane.png" 
            className={styles.plane} 
            alt="Airplane" 
        />
    )
}