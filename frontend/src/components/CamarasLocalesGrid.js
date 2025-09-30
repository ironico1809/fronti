import React, { useState } from 'react';
import CamaraLocal from './CamaraLocal';
import './CamarasLocalesGrid.css';

const CamarasLocalesGrid = ({ cantidad = 2 }) => {
  // Cada cámara seleccionada por su deviceId
  const [seleccionadas, setSeleccionadas] = useState(Array(cantidad).fill(''));

  // Renderiza varios CamaraLocal, cada uno con su propio selector
  return (
    <div className="camaras-locales-grid">
      {Array.from({ length: cantidad }).map((_, idx) => (
        <div className="camaras-locales-grid-item" key={idx}>
          <CamaraLocal
            seleccionada={seleccionadas[idx]}
            onSeleccionar={deviceId => {
              const nuevo = [...seleccionadas];
              nuevo[idx] = deviceId;
              setSeleccionadas(nuevo);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CamarasLocalesGrid;
