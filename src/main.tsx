document.getElementById("root")!.innerHTML = "<h1 style='color:blue;text-align:center;padding-top:50px;'>✅ TEST RÉUSSI - React va être chargé</h1>";

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
