import { Routes, Route } from 'react-router-dom';
import InputPage from './pages/InputPage';
import ResultPage from './pages/ResultPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <span className="header-eyebrow">RANDOM SUBWAY TRIP</span>
        <h1 className="header-title">어디로<br /><span>떠날까</span></h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </main>
    </div>
  );
}
