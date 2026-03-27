import "../styles/App.css";
import Header from "../shared/components/Header";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <>
      <main>
        <Header />
        <AppRoutes />
      </main>
    </>
  );
}

export default App;
