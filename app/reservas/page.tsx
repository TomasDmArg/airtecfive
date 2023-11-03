"use client";
import { Button } from "@/Components/Button/Button";
import { IconUser } from "@tabler/icons-react";

import "./Page.scss";
import { GeistSans } from "geist/font";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flight } from "../vuelos/page";
import { AnimatePresence, motion } from "framer-motion";

export default function Reservas() {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passengerName, setPassengerName] = useState<string>("Mis vuelos");
  const [vuelos, setVuelos] = useState<Flight[]>([]);
  const container = useRef(null);
  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pasajeros')
      .select('id,nombre')
      .eq('dni', dni)
      .single()
    
    setPassengerName(data?.nombre);

    if(!data) return;

    const { data: data2, error: error2 } = await supabase
      .from('reservas')
      .select('vuelo')
      .eq('pasajero', data.id)

    if(!data2) return;

    const promises = data2.map((reserva) => {
      return supabase
        .from("vuelos")
        .select("*")
        .eq("num_vuelo", reserva.vuelo)
        .single()
    });

    Promise.all(promises).then((results) => {
      const vuelos = results.map((result) => result.data).filter((vuelo) => vuelo !== null);
      setLoading(false);
      setVuelos(vuelos);
    });

    if (error) {
      console.error(error);
      return;
    }
  }

  const formatDate = (date: string): string => date.replace("T", " ").slice(0, -3);

  return (
    <main className={"reservas"}>
      <section className="container">
        <section className="nav">
          <h1 className="title">Encontra tu reserva</h1>
        </section>
        <p>
          Podes elegir ASIENTOS, hacer el CHECK-IN o consultar los datos de tu
          reserva. Si no podés gestionar tu cambio, podés estar tranquilo, te
          garantizamos flexibilidad en  tus vuelos aún si no lograste cambiar tu
          itinerario.
        </p>
        
        <section className="formWrapper">
          <h3>Ingrese su dni</h3>

          <div className="login-form">
            <div className="inputs">
              <div className="iconUser">
                <IconUser></IconUser>
              </div>
              <input className="input" type="number" placeholder="DNI" onChange={e => setDni(e.target.value)} />
            </div>
          </div>
          <Button 
            onClick={handleSearch}
            type="main"
          >Buscar</Button>
        </section>
      </section>
      {
        vuelos.length > 0 ? (
          <section className="vuelosIndividuales">
            <h2 className="vuelosIndividuales__title">{passengerName}</h2>
            {
              vuelos.map((vuelo) => (
                <section className="vuelosIndividuales__item" key={vuelo.num_vuelo}>
                  <h3>{vuelo.origen} - {vuelo.destino}</h3>
                  <p>Salida: {formatDate(vuelo.hora_salida)} - Llegada: {formatDate(vuelo.hora_llegada)}</p>
                </section>
              ))
            }
          </section>
        ) : null
      }
      <AnimatePresence>
        {
          loading ? (
            <motion.section 
              className="vuelosIndividuales" 
              ref={container}
              initial={{ height: 0}}
              animate={{ height: "auto"}}
              exit={{ height: "auto"}}
            >
              <motion.h2 
                className="vuelosIndividuales__title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              >Buscando tus vuelos...</motion.h2>
            </motion.section>
          ) : null
        }
      </AnimatePresence>
    </main>
  );
}
