import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FruitAiPage from "./pages/FruitAiPage";

const App = () => {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
        <Link to="/" style={{ marginRight: 12 }}>
          Home
        </Link>
        <Link to="/fruit-ai">Fruit AI</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fruit-ai" element={<FruitAiPage />} />
      </Routes>
    </div>
  );
};

export default App;
