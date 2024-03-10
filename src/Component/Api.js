
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Api() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchPokemonList();
  }, [currentPage]); // Fetch Pokemon list whenever currentPage changes

  const fetchPokemonList = () => {
    if (currentPage === 1) {
      fetch('https://pokeapi.co/api/v2/pokemon')
        .then((resp) => resp.json())
        .then((data) => setPokemonList(data.results));
    } else {
      const currentOffset = (currentPage - 1) * limit;
      fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${currentOffset}`)
        .then((resp) => resp.json())
        .then((data) => setPokemonList(data.results));
    }
  };

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
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredData = pokemonList.filter((val) =>
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
                {selectedPokemon === pokemon.name ? 'Show More  details' : 'Show More  details'}
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

                  <p>Stats:-</p>
                  {pokemonDetails.stats && pokemonDetails.stats.map((stat, index) => (
                    <p key={index}>{stat.stat.name}: {stat.base_stat}</p>
                  ))}
                  <p>Abilities:-</p>
                  {pokemonDetails.abilities && pokemonDetails.abilities.length > 0 ? (
                    <p>Ability: {pokemonDetails.abilities[0].ability.name}</p>
                  ) : (
                    <p>No abilities found</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className='fs-4 shown' style={{ fontSize: '30px' }}>
            Sorry, Pokemon name not found!
          </div>
        )}
      </div>
      <div className="pagination justify-content-center align-items-center" style={{ height: '100vh' }}>
        <button className="btn btn-primary " onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span className="page-number mx-4">Page {currentPage}</span>
        <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === 3}>Next</button>
      </div>
    </div>
  );
}

export default Api;


