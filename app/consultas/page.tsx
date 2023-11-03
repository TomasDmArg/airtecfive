"use client";
import { Button } from "@/Components/Button/Button";
import { IconUser } from "@tabler/icons-react";

import "./Page.scss";
import { GeistSans } from "geist/font";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flight } from "../vuelos/page";
import { AnimatePresence, motion } from "framer-motion";

export default function Reservas() {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pasajeros, setPasajeros] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<number>(-1)
  const [vuelos, setVuelos] = useState<Flight[]>([]);
  const container = useRef(null);
  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pasajeros')
      .select('id')
      .eq('dni', dni)
      .single()

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

  const getAllFlights = async () => {
    const { data, error } = await supabase
      .from("vuelos")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    return data;
  }

  const formatDate = (date: string): string => date.replace("T", " ").slice(0, -3);

  const handleFlightSelection = async (vuelo: Flight) => {
    setPasajeros([]);
    setSelectedFlight(vuelo.num_vuelo);
    const { data: reservas, error: reservasError } = await supabase
      .from("reservas")
      .select("*")
      .match({ vuelo: vuelo.num_vuelo });
    if (reservasError) {
      console.error(reservasError);
      return;
    }

    let uniquePassengers = new Map(); 
    reservas?.forEach((reserva) => {
      uniquePassengers.set(reserva.pasajero, reserva);
    });
    const uniqueReservas = Array.from(uniquePassengers.values());

    const promises = uniqueReservas?.map((reserva) =>
      supabase.from("pasajeros").select("*").match({ id: reserva?.pasajero })
    );
    const results = await Promise.all(promises);
    const pasajerosData = results
      .filter((result) => result?.data?.length !== undefined && result?.data?.length > 0)
      .map((result) => result?.data)
      .flat();
    
    setPasajeros(pasajerosData);
  };

  useEffect(() => {
    getAllFlights().then((data) => {
      if (!data) return;
      setVuelos(data as Flight[]);
    });
  }, []);
  
  return (
    <main className={"reservas"}>
      <h1 className="title">Consultas</h1>
      {
        vuelos.length > 0 ? (
          <section className="vuelosIndividuales">
            <h2 className="vuelosIndividuales__title">Todos los vuelos</h2>
            {
              vuelos.map((vuelo) => (
                <section className="vuelosIndividuales__item" key={vuelo.num_vuelo}>
                  <h3>{vuelo.origen} - {vuelo.destino}</h3>
                  <p>Salida: {formatDate(vuelo.hora_salida)} - Llegada: {formatDate(vuelo.hora_llegada)}</p>
                  <button className="vuelosIndividuales__button" onClick={() => handleFlightSelection(vuelo)}>
                    <IconUser /> Ver pasajeros 
                  </button>
                  {
                    pasajeros.length > 0 && selectedFlight === vuelo.num_vuelo ? (
                      <section className="vuelosIndividuales__pasajeros">
                        {
                          pasajeros.map((pasajero) => (
                            <section className="vuelosIndividuales__pasajeros__item" key={pasajero.dni}>
                              <h4>{pasajero.nombre} {pasajero.apellido}</h4>
                              <p>DNI: {pasajero.dni}</p>
                            </section>
                          ))
                        }
                      </section>
                    ) : null
                  }
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
