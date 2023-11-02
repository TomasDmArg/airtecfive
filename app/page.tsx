"use client";
import { Button } from "@/Components/Button/Button";
import styles from "./Page.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "@/Components/Plane/Plane";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker"; 
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Home() {
  const router = useRouter();

  const [origen, setOrigen] = useState<string>("");
  const [destino, setDestino] = useState<string>("");
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  const aeropuertos = [
    "Buenos Aires (EZE)",
    "Bariloche (BRC)",
    "Córdoba (COR)",
    "Puerto Iguazú (IGR)",
  ];

  const [value, setValue] = useState({ 
    startDate: null, 
    endDate: null 
  }); 
    
  const handleValueChange = (newValue: any) => {
    console.log("newValue:", newValue); 
    setValue(newValue); 
  } 

  return (
    <main className={styles.main}>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Encontrá tu vuelo ideal
      </motion.h1>
      <section className={styles.form}>
        <input
          list="aeropuertos"
          className={styles.form__input}
          type="text"
          autoComplete="do-not-refill"
          placeholder="Origen"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        />
        <datalist id="aeropuertos">
          {aeropuertos.map((aeropuerto, index) => (
            <option key={index} value={aeropuerto} />
          ))}
        </datalist>

        <input
          list="aeropuertos"
          className={styles.form__input}
          type="text"
          autoComplete="do-not-refill"
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <datalist id="aeropuertos">
          {aeropuertos.map((aeropuerto, index) => (
            <option key={index} value={aeropuerto} />
          ))}
        </datalist>
        <Datepicker
          classNames={{
            container: () => ("datepicker-cont"),
            input: () => ("datepicker-input")
          }} 
          minDate={new Date()}
          value={value} 
          onChange={handleValueChange} 
          showShortcuts={true} 
        /> 
      </section>
      <Button 
        type="main"
        onClick={() => router.push(`/vuelos?origen=${origen}&destino=${destino}&start=${value.startDate}&end=${value.endDate}`)}
      >Buscar</Button>
      <Plane />
    </main>
  );
}
