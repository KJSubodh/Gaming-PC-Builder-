import React, { useState, useEffect } from 'react';
import './product-styles.css'; // Import shared CSS file

// Import JSON data
import cpuData from './cpu.json';
import gpuData from './gpu.json';
import ramData from './ram.json';
import psuData from './psu.json';
import casesData from './cases.json';
import coolingData from './cooling.json';
import storageData from './storage.json';
import mbData from './mb.json';
import mouseData from './mice.json';
import keyboardData from './keyboards.json';
import monitorData from './monitor.json';
import headphoneData from './headphones.json';
import microphoneData from './microphone.json';
import webcamData from './webcam.json';

const Search = ({ input }) => {
  const [selectedTab, setSelectedTab] = useState('CPU');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const tabs = [
    { label: 'CPU', data: cpuData },
    { label: 'GPU', data: gpuData },
    { label: 'RAM', data: ramData },
    { label: 'PSU', data: psuData },
    { label: 'Cases', data: casesData },
    { label: 'Cooling', data: coolingData },
    { label: 'Storage', data: storageData },
    { label: 'Motherboard', data: mbData },
    { label: 'Mouse', data: mouseData },
    { label: 'Keyboard', data: keyboardData },
    { label: 'Monitor', data: monitorData },
    { label: 'Headphones', data: headphoneData },
    { label: 'Microphone', data: microphoneData },
    { label: 'Webcam', data: webcamData },
  ];

  // Filter function
  const filterItems = (query, data) => {
    return data.filter(
      item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    const filteredData = filterItems(searchQuery, tabs.find(tab => tab.label === selectedTab)?.data || []);
    console.log("Filtered Data:", filteredData); // Log filtered data
    setFilteredItems(filteredData);
  }, [searchQuery, selectedTab, tabs]);
  

  const handleSearchChange = e => {
    const query = e.target.value;
    setSearchQuery(query);
    console.log("Search query:", query); // Adding console.log for search query
  };

  const handleSearchButtonClick = () => {
    console.log("Search button clicked");
    // Add any additional functionality here
  };

  return (
    <div className="product-tabs">
      <div className="tab-list">
        {tabs.map(tab => (
          <button
            key={tab.label}
            onClick={() => setSelectedTab(tab.label)}
            className={selectedTab === tab.label ? 'active' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for Anything"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="product-list">
        {filteredItems.map(item => (
          <div key={item.id} className="product-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
