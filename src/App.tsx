import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FruitAiPage from "./pages/FruitAiPage";
import Tokenizer from "./pages/Tokenizer";
import TokenizerBpe from "./pages/TokenizerBpe";

const App = () => {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
        <Link to="/" style={{ marginRight: 12 }}>
          Home
        </Link>
        <Link style={{ marginRight: 12 }} to="/fruit-ai">
          Fruit AI
        </Link>
        <Link style={{ marginRight: 12 }} to="/tokenizer">
          Tokenizer
        </Link>
        <Link style={{ marginRight: 12 }} to="/tokenizer-bpe">
          Tokenizer ver.BPE
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fruit-ai" element={<FruitAiPage />} />
        <Route path="/tokenizer" element={<Tokenizer />} />
        <Route path="/tokenizer-bpe" element={<TokenizerBpe />} />
      </Routes>
    </div>
  );
};

export default App;
