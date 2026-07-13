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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", background: "#3D0C4E", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 24, fontFamily: "sans-serif", color: "#FDF0ED", textAlign: "center"
        }}>
          <p style={{ fontSize: 18, marginBottom: 8 }}>Something went wrong loading the app.</p>
          <p style={{ fontSize: 12, color: "#C4869A", marginBottom: 16 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "#D4A84B", color: "#3D0C4E", border: "none", borderRadius: 999, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Tap to retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <RootComponent />
  </ErrorBoundary>
);
