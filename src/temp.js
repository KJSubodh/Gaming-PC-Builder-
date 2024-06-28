import React, { useState } from 'react';
import './BuildYourOwnPC.css';
import './user-details.css';
import buildYourOwnPCImage from './build-your-own-PC.jpg';
import { generateInvoiceHTML } from './invoice';
import PaymentSelection from './paymentselection';


import cpuData from './cpu.json';
import gpuData from './gpu.json';
import ramData from './ram.json';
import psuData from './psu.json';
import casesData from './cases.json';
import coolingData from './cooling.json';
import storageData from './storage.json';
import mbData from './mb.json';

const BuildYourOwnPC = () => {
  const [selectedCPU, setSelectedCPU] = useState('');
  const [selectedGPU, setSelectedGPU] = useState('');
  const [selectedRAM, setSelectedRAM] = useState('');
  const [selectedPSU, setSelectedPSU] = useState('');
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedCooling, setSelectedCooling] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedSecondaryStorage, setSelectedSecondaryStorage] = useState('');
  const [selectedMotherboard, setSelectedMotherboard] = useState('');
  const [rgbChecked, setRgbChecked] = useState(false);
  const [selectedSecondaryItem, setSelectedSecondaryItem] = useState('');
  const [cart, setCart] = useState([]);
  const [isBuilt, setIsBuilt] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');

  const handleSecondaryItemChange = (event) => {
    setSelectedSecondaryItem(event.target.value);
  };

  const handleCPUChange = (event) => {
    setSelectedCPU(event.target.value);
  };

  const handleGPUChange = (event) => {
    setSelectedGPU(event.target.value);
  };

  const handleRAMChange = (event) => {
    setSelectedRAM(event.target.value);
  };

  const handlePSUChange = (event) => {
    setSelectedPSU(event.target.value);
  };

  const handleCaseChange = (event) => {
    setSelectedCase(event.target.value);
  };

  const handleCoolingChange = (event) => {
    setSelectedCooling(event.target.value);
  };

  const handleStorageChange = (event) => {
    setSelectedStorage(event.target.value);
  };

  const handleSecondaryStorageChange = (event) => {
    setSelectedSecondaryStorage(event.target.value);
    setSelectedSecondaryItem('');
  };

  const handleMotherboardChange = (event) => {
    setSelectedMotherboard(event.target.value);
  };

  const handleRGBChange = (event) => {
    setRgbChecked(event.target.checked);
  };

  const invoiceHTML = generateInvoiceHTML(cart, userName, userPhoneNumber, userAddress);

  const handleBuildPC = () => {
    const newCart = [];
  
    if (selectedMotherboard) {
      const motherboard = mbData.find(mb => mb.name === selectedMotherboard);
      if (motherboard) {
        newCart.push({ type: 'Motherboard', name: motherboard.name, price: parseFloat(motherboard['pricing (INR)']) });
      }
    }
  
    if (selectedCPU) {
      const cpu = cpuData.gaming_cpus.find(cpu => cpu.name === selectedCPU);
      if (cpu) {
        newCart.push({ type: 'CPU', name: cpu.name, price: parseFloat(cpu.price) });
      }
    }
  
    if (selectedGPU) {
      const gpu = gpuData.find(gpu => gpu.name === selectedGPU);
      if (gpu) {
        newCart.push({ type: 'GPU', name: gpu.name, price: parseFloat(gpu['pricing (INR)']) });
      }
    }
  
    if (selectedRAM) {
      const ram = ramData.find(ram => ram.name === selectedRAM);
      if (ram) {
        newCart.push({ type: 'RAM', name: ram.name, price: parseFloat(ram['pricing (INR)']) });
      }
    }
  
  
    if (selectedCase) {
      const caseItem = Object.values(casesData['Gaming PC Cases']).flat().find(caseItem => caseItem.Name === selectedCase);
      if (caseItem) {
        newCart.push({ type: 'Case', name: caseItem.Name, price: parseFloat(caseItem.Price) });
      }
    }

    if (selectedPSU) {
      const psu = psuData.find(psu => psu.name === selectedPSU);
      if (psu) {
        const price = parseFloat(psu['pricing (INR)'].replace(/[^\d.]/g, '')); // Remove non-numeric characters
        console.log("PSU Price: ", price); // Check PSU price
        newCart.push({ type: 'PSU', name: psu.name, price: price });
      }
    }
  
    if (selectedCooling) {
      const cooling = Object.values(coolingData['Cooling Solutions']).flat().find(cooling => cooling.Name === selectedCooling);
      if (cooling) {
        newCart.push({ type: 'Cooling', name: cooling.Name, price: parseFloat(cooling.Price) });
      }
    }
  
    // Primary Storage
if (selectedStorage && storageData["NVMe PCIe M.2 (Primary Storage)"]) {
  console.log("Selected Primary Storage:", selectedStorage);
  const storage = storageData["NVMe PCIe M.2 (Primary Storage)"].find(storage => storage.Name === selectedStorage);
  console.log("Retrieved Primary Storage:", storage);
  if (storage) {
    const price = parseFloat(storage['Price (INR)'].replace(/[^\d.]/g, '')); // Remove non-numeric characters
    console.log("Primary Storage Price:", price);
    newCart.push({ type: 'Primary Storage', name: storage.Name, price: price });
  }
}

// Secondary Storage
if (selectedSecondaryStorage && selectedSecondaryItem && storageData[`${selectedSecondaryStorage} (Secondary Storage)`]) {
  const secondaryStorage = storageData[`${selectedSecondaryStorage} (Secondary Storage)`].find(item => item.Name === selectedSecondaryItem);
  if (secondaryStorage) {
    const price = parseFloat(secondaryStorage['Price (INR)'].replace(/[^\d.]/g, ''));
    newCart.push({ type: 'Secondary Storage', name: secondaryStorage.Name, price: price });
  }
}

    if (rgbChecked) {
      newCart.push({ type: 'RGB Lighting', name: 'RGB Lighting', price: 1000 });
    }

    const totalPrice = newCart.reduce((acc, item) => acc + parseFloat(item.price), 0);
    setCart(newCart);
    setIsBuilt(true);
  };
  
  const handleProceedToCheckout = () => {
    const invoiceHTML = generateInvoiceHTML(cart, userName, userPhoneNumber, userAddress);
    const newWindow = window.open();
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();
  };
  
  return (
    <div className="pc-image" style={{ backgroundImage: `url(${buildYourOwnPCImage})` }}>
      <div className="build-pc-container">
        <h1>Build Your Own Gaming PC</h1>
        <p>Select and customize your own gaming PC from scratch.</p>
        {!isBuilt ? (
          <>
            <div className="component">
            <h2>Select Your Motherboard</h2>
            <select value={selectedMotherboard} onChange={handleMotherboardChange}>
              <option value="">Select Motherboard</option>
              {mbData.map((mb, index) => (
                <option key={index} value={mb.name}>
                  {mb.name} - ₹{mb['pricing (INR)']}
                </option>
              ))}
            </select>
            {selectedMotherboard && (
              <div>
                {mbData.find((mb) => mb.name === selectedMotherboard)?.urls?.map((url, index) => (
                  <img
                    key={index}
                    src={url || 'blank_image_url'}
                    alt={`Motherboard ${index + 1}`}
                    className="motherboard-image"
                  />
                ))}
              </div>
            )}
          </div>

              <div className="component">
              <h2>Select Your CPU</h2>
              <select value={selectedCPU} onChange={handleCPUChange}>
                <option value="">Select CPU</option>
                {cpuData.gaming_cpus.map((cpu, index) => (
                  <option key={index} value={cpu.name}>
                    {cpu.name} - {cpu.cores_threads} - {cpu.clock_speed} - ₹{cpu.price}
                  </option>
                ))}
              </select>
              {selectedCPU && (
                <div>
                  {cpuData.gaming_cpus.find((cpu) => cpu.name === selectedCPU)?.urls?.map((url, index) => (
                    <img
                      key={index}
                      src={url || 'blank_image_url'}
                      alt={`CPU ${index + 1}`}
                      className="cpu-image"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="component">
            <h2>Select Your GPU</h2>
            <select value={selectedGPU} onChange={handleGPUChange}>
              <option value="">Select GPU</option>
              {gpuData.map((gpu, index) => (
                <option key={index} value={gpu.name}>
                  {gpu.name} - ₹{gpu['pricing (INR)']}
                </option>
              ))}
            </select>
            {selectedGPU && (
              <div className="gpu-images">
                {gpuData.find((gpu) => gpu.name === selectedGPU)?.urls?.map((url, index) => (
                  <img
                    key={index}
                    src={url || 'blank_image_url'}
                    alt="GPU"
                    className="gpu-image"
                  />
                ))}
              </div>
            )}
          </div>

              <div className="component">
              <h2>Select Your RAM</h2>
              <select value={selectedRAM} onChange={handleRAMChange}>
                <option value="">Select RAM</option>
                {ramData.map((ram, index) => (
                  <option key={index} value={ram.name}>
                    {ram.name} - ₹{ram['pricing (INR)']}
                  </option>
                ))}
              </select>
              {selectedRAM && (
                <div>
                  {ramData.find((ram) => ram.name === selectedRAM)?.urls?.map((url, index) => (
                    <img
                      key={index}
                      src={url || 'blank_image_url'}
                      alt={`RAM ${index + 1}`}
                      className="ram-image"
                    />
                  ))}
                </div>
              )}
            </div>

              <div className="component">
              <h2>Select Your PSU</h2>
              <select value={selectedPSU} onChange={handlePSUChange}>
                <option value="">Select PSU</option>
                {psuData.map((psu, index) => (
                  <option key={index} value={psu.name}>
                    {psu.name} - {psu['pricing (INR)']}
                  </option>
                ))}
              </select>
              {selectedPSU && (
                <div>
                  {psuData.find((psu) => psu.name === selectedPSU)?.urls?.map((url, index) => (
                    <img
                      key={index}
                      src={url || 'blank_image_url'}
                      alt={`PSU ${index + 1}`}
                      className="psu-image"
                    />
                  ))}
                </div>
              )}
            </div>


            <div className="component">
              <h2>Select Your Case</h2>
              <select value={selectedCase} onChange={handleCaseChange}>
                <option value="">Select Case</option>
                {Object.entries(casesData['Gaming PC Cases']).map(([category, cases], categoryIndex) => (
                  <optgroup key={categoryIndex} label={category}>
                    {cases.map((caseItem, index) => (
                      <option key={index} value={caseItem.Name}>
                        {caseItem.Name} - ₹{caseItem.Price}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {selectedCase && (
                <div>
                  {Object.entries(casesData['Gaming PC Cases']).flatMap(([category, cases]) => cases)
                    .find((caseItem) => caseItem.Name === selectedCase)?.urls?.map((url, index) => (
                      <img
                        key={index}
                        src={url || 'blank_image_url'}
                        alt={`Case ${index + 1}`}
                        className="case-image"
                      />
                    ))}
                </div>
              )}
            </div>

              <div className="component">
              <h2>Select Your Cooling</h2>
              <select value={selectedCooling} onChange={handleCoolingChange}>
                <option value="">Select Cooling</option>
                {Object.values(coolingData['Cooling Solutions']).flat().map((cooling, index) => (
                  <option key={index} value={cooling.Name}>
                    {cooling.Name} - ₹{cooling.Price}
                  </option>
                ))}
              </select>
              {selectedCooling && (
                <div>
                  {Object.values(coolingData['Cooling Solutions']).flatMap(cooling => cooling)
                    .find(coolingItem => coolingItem.Name === selectedCooling)?.urls?.map((url, index) => (
                      <img
                        key={index}
                        src={url || 'blank_image_url'}
                        alt={`Cooling ${index + 1}`}
                        className="cooling-image"
                      />
                    ))}
                </div>
              )}
            </div>

              <div className="component">
              <h2>Select Your Primary Storage</h2>
              <select value={selectedStorage} onChange={handleStorageChange}>
                <option value="">Select Primary Storage</option>
                {storageData["NVMe PCIe M.2 (Primary Storage)"]?.map((storage, index) => (
                  <option key={index} value={storage.Name}>
                    {storage.Name} - {storage['Price (INR)']}
                  </option>
                ))}
              </select>
              {selectedStorage && (
                <div>
                  {storageData["NVMe PCIe M.2 (Primary Storage)"]
                    ?.find(storage => storage.Name === selectedStorage)?.urls?.map((url, index) => (
                      <img
                        key={index}
                        src={url || 'blank_image_url'}
                        alt="Primary Storage"
                        className="storage-image"
                      />
                    ))}
                </div>
              )}
            </div>

            <div className="component">
              <h2>Select Your Secondary Storage</h2>
              <select value={selectedSecondaryStorage} onChange={handleSecondaryStorageChange}>
                <option value="">Select Secondary Storage Type</option>
                {Object.keys(storageData).filter(key => key.includes('(Secondary Storage)')).map((storageType, index) => (
                  <option key={index} value={storageType.replace(' (Secondary Storage)', '')}>
                    {storageType.replace(' (Secondary Storage)', '')}
                  </option>
                ))}
              </select>
              {selectedSecondaryStorage && (
                <div>
                  <select value={selectedSecondaryItem} onChange={handleSecondaryItemChange}>
                    <option value="">Select {selectedSecondaryStorage} Storage</option>
                    {storageData[`${selectedSecondaryStorage} (Secondary Storage)`]?.map((item, index) => (
                      <option key={index} value={item.Name}>
                        {item.Name} - {item['Price (INR)']}
                      </option>
                    ))}
                  </select>
                  {selectedSecondaryItem && (
                    <div>
                      {storageData[`${selectedSecondaryStorage} (Secondary Storage)`]
                        ?.find(item => item.Name === selectedSecondaryItem)?.urls?.map((url, index) => (
                          <img
                            key={index}
                            src={url || 'blank_image_url'}
                            alt="Secondary Storage"
                            className="storage-image"
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="component">
              <label>
                <input type="checkbox" checked={rgbChecked} onChange={handleRGBChange} />
                Add RGB Lighting (+ ₹1000)
              </label>
            </div>

            <button onClick={handleBuildPC}>Build My PC</button>
          </>
        ) : (
          <>
            <div className="cart">
              <h2>Your PC Build</h2>
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>{item.type}: {item.name} - ₹{item.price.toFixed(2)}</li>
                ))}
              </ul>
              <button onClick={() => setIsBuilt(false)}>Edit Build</button>
              <PaymentSelection onSelect={setSelectedPaymentMode} />
            </div>
            <div className="user-details">
              <h2>Enter Your Details</h2>
              <input
                type="text"
                placeholder="Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={userPhoneNumber}
                onChange={(e) => setUserPhoneNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
              />
            </div>
            <button className="prebuilt-pc-button prebuilt-proceed-pc-button" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default BuildYourOwnPC;
