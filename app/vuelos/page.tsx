'use client'
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import styles from "./Page.module.scss";
import { Button } from "@/Components/Button/Button";

export default function Page () {
    type Flight = {
        num_vuelo: number;
        origen: string;
        destino: string;
        hora_salida: string;
        hora_llegada: string;
        precio: number;
    }

    const [params, setParams] = useState({
        origen: "",
        destino: "",
        fechaInicio: "",
        fechaFin: "",
    });

    const [outboundFlights, setOutboundFlights] = useState<Flight[]>([]);
    const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
    const [selected, setSelected] = useState<(Flight | null)[]>([]); // [outbound, return]
    const [section, setSection] = useState<"outbound" | "return">("outbound");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const origen = params.get("origen");
        const destino = params.get("destino");
        const fechaInicio = params.get("start");
        const fechaFin = params.get("end");
        setParams({
            origen: origen || "",
            destino: destino || "",
            fechaInicio: fechaInicio || "",
            fechaFin: fechaFin || "",
        });
    }, []);


    const handleSearch = async () => {
        const outbound = supabase
            .from("vuelos")
            .select("*")
            .match({ origen: params.origen, destino: params.destino })
            
            const returnFlight = supabase
            .from("vuelos")
            .select("*")
            .match({ origen: params.destino, destino: params.origen })

        const { data: outboundData, error: outboundError } = await outbound;
        const { data: returnData, error: returnError } = await returnFlight;

        console.log(outboundData, returnData, params.destino, params.fechaInicio, params.fechaFin)
        if (outboundError || returnError || !outboundData || !returnData) {
            console.error(outboundError || returnError);
            return;
        }
        setOutboundFlights(outboundData as Flight[]);
        setReturnFlights(returnData as Flight[]);
        setLoading(false);
    };

    useEffect(() => {
        if(params.destino && params.fechaInicio && params.fechaFin) {
            handleSearch();
        }
    }, [params]);

    return (
        <main>
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.title}
            >
                {section === "outbound" ? "Paso 1: Vuelos de ida" : "Paso 2: Vuelos de vuelta"}
            </motion.h1>
            <section>
                <section>
                    {
                        section === "outbound" ?
                        <section className={styles.flightCardContainer}>
                            {
                                outboundFlights.length > 0 ? outboundFlights.map((flight, index) => (
                                    <div className={styles.flightCard} key={index}>
                                        <h2>{flight.origen} - {flight.destino}</h2>
                                        <p>Salida: {flight.hora_salida.replace("T", " ")} - Llegada: {flight.hora_llegada.replace("T", " ")}</p>
                                        <h3>${flight.precio}</h3>
                                        <Button type="main" onClick={() => {
                                            setSection("return")
                                            setSelected([flight, null])
                                        }}>Seleccionar</Button>
                                    </div>
                                )) : <p>{loading ? "Buscando los mejores vuelos..." : "No hay vuelos de ida"}</p>
                            }
                        </section>
                        :
                        <section className={styles.flightCardContainer}>
                            {
                                returnFlights.length > 0 ? returnFlights.map((flight, index) => (
                                    <div className={styles.flightCard} key={index}>
                                        <h2>{flight.origen} - {flight.destino}</h2>
                                        <p>Salida: {flight.hora_salida} - Llegada: {flight.hora_llegada}</p>
                                        <h3>${flight.precio}</h3>
                                        <Button type="main" onClick={() => {
                                            setSelected([selected[0], flight])
                                        }}>Seleccionar</Button>
                                    </div>
                                )) : <p>{loading ? "Buscando los mejores vuelos..." : "No hay vuelos de vuelta"}</p>
                            }
                        </section>
                    }
                </section>
                <section className={styles.flightCardTotal}>
                    <h3>Total: ${(selected[0]?.precio ?? 0) + (selected[1]?.precio ?? 0)} ARS</h3>
                    <Button type="main" onClick={() => {
                        if(selected[0] && selected[1]) {
                            window.location.href = `/reserva?idIda=${selected[0].num_vuelo}&idVuelta=${selected[1].num_vuelo}`
                        }
                    }}>Hacer reserva</Button>
                </section>
            </section>
        </main>
    )
}