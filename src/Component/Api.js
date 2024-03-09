import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Api() {
  const [datas, setDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(10); 
  const maxOffset = 30; 

  useEffect(() => {
    fetchPokemonList();
  }, [offset]);

  const fetchPokemonList = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${offset}`)
      .then((resp) => resp.json())
      .then((data) => setDatas(data.results));
  };

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon')
      .then((resp) => resp.json())
      .then((data) => setDatas(data.results));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchPokemonDetails = (url) => {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => setPokemonDetails(data));
  };

  const toggleDetails = (pokemon) => {
    if (selectedPokemon === pokemon.name) {
      setSelectedPokemon(null);
    } else {
      setSelectedPokemon(pokemon.name);
      fetchPokemonDetails(pokemon.url);
    }
  };

  const handleNextPage = () => {
    if (offset < maxOffset) {
      setOffset(offset + 10);
    }
  };

  const handlePrevPage = () => {
    if (offset > 10) {
      setOffset(offset - 10);
    }
  };

  const filteredData = datas.filter((val) =>
    val.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className='App'>
      <input
        type="search"
        placeholder='Search Pokemon name'
        className='search mb-5 justify-content-center rounded-pill w-5 text-center mt-3'
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className='parent mt-4 text-center'>
        {filteredData.length > 0 ? (
          filteredData.map((pokemon, i) => (
            <div className='child' key={i}>
              <div>{pokemon.name}</div>
              <br />
              <button
                className='btn btn-primary mt-3 d-flex justify-content-center'
                onClick={() => toggleDetails(pokemon)}
              >
                {selectedPokemon === pokemon.name ? 'Show more details' : 'Show more details'}
              </button>

              {/* Render details for each Pokémon */}
              {selectedPokemon === pokemon.name && (
                <div className='details '>
                  {/* Display relevant details */}
                  <p>Name: {pokemonDetails.name}</p>
                  <p>Height: {pokemonDetails.height}</p>
                  <p>Weight: {pokemonDetails.weight}</p>
                  <p>Base Experience: {pokemonDetails.base_experience}</p>
                  <p>Types: {pokemonDetails.types && pokemonDetails.types.map((type, index) => (
                    <span key={index}>{type.type.name} </span>
                  ))}</p>

                  <p>States:-</p>
                  {pokemonDetails.stats && pokemonDetails.stats.map((stat, index) => (
                    <p key={index}>{stat.stat.name}: {stat.base_stat}</p>
                  ))}
                  <p>Abilities:-</p>
                  {pokemonDetails.abilities && pokemonDetails.abilities.map((ability, index) => (
                    <p key={index}>{ability.ability.name}</p>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className='fs-4 shown' style={{ fontSize: '30px' }}>
            Sorry,  Pokemon name not found  !
          </div>
        )}
      </div>
      <div className="pagination justify-content-center align-items-center" style={{ height: '100vh' }}>
        <button className="btn btn-primary " onClick={handlePrevPage} disabled={offset === 10}>Previous</button>
        <span className="page-number mx-4">Page {Math.floor(offset / 10) + 0}</span>
        <button className="btn btn-primary" onClick={handleNextPage} disabled={offset + 10 > maxOffset}>Next</button>
      </div>
    </div>
  );
}

export default Api;
