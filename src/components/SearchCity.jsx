import React, { useState } from 'react';

const SearchCity = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false); // To track if city is not found
  const [newCityName, setNewCityName] = useState(''); // New city name input
  const [selectedOption, setSelectedOption] = useState('suggestion'); // To track the selected option

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setSuggestions([]);  // Clear suggestions if search term is empty
      setCityNotFound(false);
      return;
    }

    setIsLoading(true);
    setCityNotFound(false); // Reset cityNotFound state before searching

    try {
      const response = await fetch(`http://localhost:3000/admin/allCities?=${term}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      const data = await response.json();
      if (data.cities.length === 0) {
        setCityNotFound(true); // No cities found
      }
      setSuggestions(data.cities || []);
    } catch (error) {
      console.error(error.message);
      setCityNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setSearchTerm(city.cityName); // Set the clicked city as the search term
    setSuggestions([]); // Clear the suggestions
  };

  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      alert("Please enter a city name.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/admin/addCity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cityName: newCityName }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSearchTerm(newCityName); // Set the newly added city as the search term
        setCityNotFound(false); // Reset cityNotFound
        setNewCityName(''); // Clear new city name field
        setSuggestions([]); // Clear suggestions
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding city:', error);
      alert('Error adding city');
    }
  };

  return (
    <div className="search-city">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for a city"
        className="search-input"
      />

      {isLoading && <div className="loading">Loading...</div>}

      {cityNotFound && (
        <div>
          {/* Option to let user input their own city name */}
          <div className="custom-city-option">
            <label>
              <input
                type="radio"
                name="city-option"
                value="suggestion"
                checked={selectedOption === 'suggestion'}
                onChange={() => setSelectedOption('suggestion')}
              />
              Select from suggestions
            </label>
            <label>
              <input
                type="radio"
                name="city-option"
                value="custom"
                checked={selectedOption === 'custom'}
                onChange={() => setSelectedOption('custom')}
              />
              Enter your own city
            </label>
          </div>

          {selectedOption === 'custom' && (
            <div>
              <input
                type="text"
                placeholder="Enter city name"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                className="new-city-input"
              />
              <button onClick={handleAddCity}>Submit</button>
            </div>
          )}
        </div>
      )}

      {selectedOption === 'suggestion' && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(city.cityName)}
              className="suggestion-item"
            >
              {city.cityName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchCity;
