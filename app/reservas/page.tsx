"use client";
import { Button } from "@/Components/Button/Button";
import { IconUser } from "@tabler/icons-react";

import "./Page.scss";
import { GeistSans } from "geist/font";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Reservas() {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState('');

  const handleSearch = async () => {
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
      .single()

      if(!data2) return;

      const {data: data3, error: error3} = await supabase
        .from("vuelos")
        .select("*")
        .eq("num_vuelo", data2.vuelo)
        .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data3.length === 0) {
      console.log('No rows returned');
      return;
    }
    
    console.log(data3);
    

  }

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
    </main>
  );
}
