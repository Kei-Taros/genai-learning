import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>ホーム</h1>
      <ul>
        <li>
          <Link to="/fruit-ai">果物の色を答える ミニ生成AI</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
