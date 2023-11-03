"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import styles from "./Page.module.scss";
import { Button } from "@/Components/Button/Button";
import "./Page.css";

export default function Page() {
  type Flight = {
    num_vuelo: number;
    origen: string;
    destino: string;
    hora_salida: string;
    hora_llegada: string;
    precio: number;
  };

  type Passenger = {
    num_vuelo: number;
    origen: string;
    destino: string;
    hora_salida: string;
    hora_llegada: string;
    fecha_nacimiento: string;
    num_asientoIda: number;
    num_asientoVuelta: number;
  };

  const [params, setParams] = useState({
    idIda: "",
    idVuelta: "",
  });

  const [selected, setSelected] = useState<(Flight | null)[]>([]); // [outbound, return]
  const [loading, setLoading] = useState<boolean>(true);
  const [reservationData, setReservationData] = useState<{
    nombre: string;
    apellido: string;
    dni: string;
    categoria: string;
    edad: number;
    num_asientoIda: number;
    num_asientoVuelta: number;
  }>({
    nombre: "",
    apellido: "",
    dni: "",
    categoria: "",
    edad: 0,
    num_asientoIda: 0,
    num_asientoVuelta: 0,

  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const idIda = params.get("idIda");
    const idVuelta = params.get("idVuelta");
    setParams({
      idIda: idIda ?? "",
      idVuelta: idVuelta ?? "",
    });
  }, []);

  const getDescuento = (precio: number): number => {
    let res = precio;

    if (reservationData.categoria === "JUBILADOS") {
      res = res * 0.6;
    }
    if (reservationData.categoria === "ESTUDIANTES") {
      res = res * 0.85;
    }
    if (reservationData.categoria === "CORPORATIVOS") {
      res = res * 0.8;
    }

    return res;
  };

  const handleSearch = async () => {
    const outbound = supabase
      .from("vuelos")
      .select("*")
      .match({ num_vuelo: params.idIda });

    const returnFlight = supabase
      .from("vuelos")
      .select("*")
      .match({ num_vuelo: params.idVuelta });

    const { data: outboundData, error: outboundError } = await outbound;
    const { data: returnData, error: returnError } = await returnFlight;

    if (outboundError || returnError) {
      console.error(outboundError || returnError);
      return;
    }
    setLoading(false);
    setSelected([outboundData[0] ?? null, returnData[0] ?? null]);
  };

  useEffect(() => {
    if (params.idIda || params.idVuelta) {
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
        Checkout
      </motion.h1>
      <section>
        <section>
          {
            <section className={styles.flightCardContainer}>
              {selected.length > 0 ? (
                selected.map((flight, index) =>
                  flight ? (
                    <div className={styles.flightCard} key={index}>
                      <h2>
                        {flight.origen} - {flight.destino}
                      </h2>
                      <p>
                        Salida: {flight.hora_salida.replace("T", " ")} -
                        Llegada: {flight.hora_llegada.replace("T", " ")}
                      </p>
                      <h3>${flight.precio}</h3>
                    </div>
                  ) : (
                    <></>
                  )
                )
              ) : (
                <p>{loading ? "Cargando..." : "No hay vuelos de ida"}</p>
              )}
            </section>
          }
        </section>
        <h2 className={styles.title}>Datos para la reserva</h2>
        <section className={styles.form}>
          <input
            className={styles.form__input}
            type="text"
            autoComplete="do-not-refill"
            placeholder="Nombre"
            value={reservationData?.nombre ?? ""}
            onChange={(e) => {
              setReservationData({
                ...reservationData,
                nombre: e.target.value,
              });
            }}
          />
          <input
            className={styles.form__input}
            type="text"
            autoComplete="do-not-refill"
            placeholder="Apellido"
            value={reservationData?.apellido ?? ""}
            onChange={(e) => {
              setReservationData({
                ...reservationData,
                apellido: e.target.value,
              });
            }}
          />
          <input
            className={styles.form__input}
            type="text"
            autoComplete="do-not-refill"
            placeholder="DNI"
            value={reservationData?.dni ?? ""}
            onChange={(e) => {
              setReservationData({
                ...reservationData,
                dni: e.target.value,
              });
            }}
          />
          <input
            className={styles.form__input}
            type="number"
            autoComplete="do-not-refill"
            placeholder="Numero de asiento ida"
            onChange={(e) => {
              setReservationData({
                ...reservationData,
                num_asientoIda: parseInt(e.target.value),
              });
            }}
          />
           <input
            className={styles.form__input}
            type="number"
            autoComplete="do-not-refill"
            placeholder="Numero de asiento vuelta"
            onChange={(e) => {
              setReservationData({
                ...reservationData,
                num_asientoVuelta: parseInt(e.target.value),
              });
            }}
          />
          <select
            className={styles.form__input}
            placeholder="Categoria"
            value={reservationData?.categoria ?? ""}
            onChange={(e) => {
              setReservationData({
                ...reservationData,
                categoria: e.target.value,
              });
            }}
          >
            <option value="ESTÁNDAR">ESTÁNDAR</option>
            <option value="JUBILADOS">JUBILADOS</option>
            <option value="ESTUDIANTES">ESTUDIANTES</option>
            <option value="CORPORATIVOS">CORPORATIVOS</option>
          </select>
          <h3 className={styles.detail}>
            Impuestos: $
            {(
              0.8 *
              ((selected[0]?.precio ?? 0) + (selected[1]?.precio ?? 0))
            ).toFixed(2)}
            ARS
          </h3>
          <h3 className={styles.detail}>
            Descuento: $
            {getDescuento(
              (selected[0]?.precio ?? 0) + (selected[1]?.precio ?? 0)
            ).toFixed(2)}
            ARS
          </h3>
        </section>

        <section className={styles.flightCardTotal}>
          <h3>
            Total: $
            {getDescuento(
              (selected[0]?.precio ?? 0) + (selected[1]?.precio ?? 0) * 1.8
            ).toFixed(2)}{" "}
            ARS
          </h3>
          <Button
            type="main"
            onClick={async () => {
              if (selected[0] && selected[1]) {
                // Buscar al pasajero por DNI
                const { data: pasajeros, error: errorPasajero } = await supabase
                  .from("pasajeros")
                  .select("id")
                  .eq("dni", reservationData.dni);

                if (errorPasajero || pasajeros.length === 0) {
                  console.error("Error al buscar al pasajero:", errorPasajero);
                  return;
                }

                // Crear las reservas con la ID del pasajero
                const reservas = [
                  { vuelo: selected[0].num_vuelo, pasajero: pasajeros[0].id, n_asiento: reservationData.num_asientoIda},
                  { vuelo: selected[1].num_vuelo, pasajero: pasajeros[0].id, n_asiento: reservationData.num_asientoVuelta},

                ];

                const { data, error } = await supabase
                  .from("reservas")
                  .insert(reservas);

                if (error) {
                  console.error("Error al hacer la reserva:", error);
                  return;
                }
                console.log(data);
              }
            }}
          >
            Hacer reserva
          </Button>
        </section>
      </section>
    </main>
  );
}
