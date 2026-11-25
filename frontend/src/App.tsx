import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Encabezado from './componentes/Encabezado';
import Pie from './componentes/Pie';

const App: React.FC = () => {
  return (
    <Router>

      <Encabezado />

      <main className="bg-navy min-h-screen
        flex items-center justify-center">

        <h1 className="text-4xl font-bold text-cream">
          Taruma Arquitectos
        </h1>

      </main>

      <section className="bg-cream min-h-screen
        flex items-center justify-center">

        <h2 className="text-3xl font-bold text-navy">
          Prueba de navegación
        </h2>

      </section>

      <Pie/>

    </Router>
  );
};

export default App;