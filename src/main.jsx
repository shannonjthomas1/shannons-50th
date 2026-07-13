import React from "react";
import ReactDOM from "react-dom/client";
import Hub from "./Hub.jsx";
import Admin from "./Admin.jsx";
import Wall from "./Wall.jsx";
import Cards from "./Cards.jsx";
import Raffle from "./Raffle.jsx";
import RaffleHost from "./RaffleHost.jsx";
import Bingo from "./Bingo.jsx";
import "./index.css";

const path = window.location.pathname;
const ROUTES = {
  "/shannon": Admin,
  "/wall": Wall,
  "/cards": Cards,
  "/raffle": Raffle,
  "/raffle/host": RaffleHost,
  "/bingo": Bingo,
};
const RootComponent = ROUTES[path] || Hub;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
