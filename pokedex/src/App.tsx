import Pokedex from './components/Pokedex';
import {
  BrowserRouter as Router, Route, Routes
} from 'react-router-dom'
import PokemonDetail from './components/Pokemon-Detail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:pokemonName" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;