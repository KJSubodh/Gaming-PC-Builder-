import React, { useState, useEffect } from 'react';
import './product-styles.css'; // Import shared CSS file
import gamingAccessoriesData from './gaming_accessories.json'; // Import gaming_accessories.json

const GamingAccessories = () => {
  const [accessoryData, setAccessoryData] = useState(null);

  useEffect(() => {
    const fetchJSON = async (fileName) => {
      try {
        const response = await fetch(`data/${fileName}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Error fetching ${fileName}:`, error);
        throw error; // Re-throw the error to be caught by Promise.all
      }
    };

    const loadAccessories = async () => {
      try {
        const promises = Object.values(gamingAccessoriesData).map(fetchJSON);
        const accessoryDetails = await Promise.all(promises);
        const accessoryDataObject = Object.fromEntries(
          Object.keys(gamingAccessoriesData).map((key, index) => [
            key,
            accessoryDetails[index],
          ])
        );
        setAccessoryData(accessoryDataObject);
      } catch (error) {
        console.error('Error loading gaming accessories:', error);
      }
    };

    loadAccessories();
  }, []);

  return (
    <div className="product-container">
      <h1>Gaming PC Accessories</h1>
      <p>Explore accessories to enhance your gaming experience.</p>
      {accessoryData && (
        <div>
          {Object.entries(accessoryData).map(([accessoryName, accessoryDetails]) => (
            <div key={accessoryName}>
              <h2>{accessoryName}</h2>
              {Object.entries(accessoryDetails).map(([key, value]) => (
                <div key={key}>
                  <label htmlFor={`${accessoryName}-${key}`}>{key}</label>
                  <input
                    type="text"
                    id={`${accessoryName}-${key}`}
                    value={value}
                    onChange={(e) => {
                      // Handle input changes here if needed
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamingAccessories;
