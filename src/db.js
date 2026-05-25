import { useEffect, useState } from 'react';
import sql from './db.js'; // Tu archivo de conexión a Neon

function App() {
  const [status, setStatus] = useState("Conectando a Neon...");

  useEffect(() => {
    async function comprobarConexion() {
      try {
        // Hacemos una consulta simple del sistema de la base de datos
        const respuesta = await sql`SELECT NOW()`;
        if (respuesta) {
          setStatus("¡Conexión Exitosa! La base de datos en la nube responde correctamente.");
          console.log("Hora del servidor Neon:", respuesta[0].now);
        }
      } catch (error) {
        setStatus("Error de conexión: " + error.message);
        console.error(error);
      }
    }
    comprobarConexion();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Comprobación de Base de Datos</h1>
      <p><strong>Estado:</strong> {status}</p>
    </div>
  );
}

export default App;
