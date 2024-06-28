import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles.css';

import BuildYourOwnPC from './BuildYourOwnPC';
import BuyPreBuiltPC from './BuyPreBuiltPC'; // Updated import statement
import BuyGamingPCParts from './BuyGamingPCParts';
import GamingPCAccessories from './GamingPCAccessories';
import Search from './Search';


function App() {
  const handleLinkClick = (path) => (e) => {
    e.preventDefault();
    window.open(window.location.origin + path, '_blank');
  };

  return (
    <div className="App">
      <header>
        <a href="/">
          <img src="123.jpg" alt="Amazon Logo" />
        </a>
        <div className="search-container">
          <div className="search-bar">
            <input type="text" placeholder="Search for Anything" />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.535 4.426l-3.584-3.584a.5.5 0 0 0-.708.708l3.584 3.584a.5.5 0 0 0 .708-.708zM8 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="account-menu">
          <a href="#">Sign In</a>&nbsp;&nbsp;
          <a href="#">Your Lists</a>&nbsp;&nbsp;
          <a href="#">Cart</a>
        </div>
      </header>

      <main className="products-container">
  <section className="products">
    <a href="/build-your-own-pc" onClick={handleLinkClick('/build-your-own-pc')}>
      <img src="build_your_PC.jpg" alt="Build Your Own PC" />
    </a>
    <h2>Build Your Own Custom PC</h2>
    <div className="description-container">
      <p className="description">Select and customize your own gaming PC from scratch.</p>
    </div>
  </section>

  <section className="products">
    <a href="/buy-gaming-pc-parts" onClick={handleLinkClick('/buy-gaming-pc-parts')}>
      <img src="gaming_PC_parts.jpg" alt="Gaming PC Parts" />
    </a>
    <h2>Buy Gaming PC Parts</h2>
    <div className="description-container">
      <p className="description">Choose from a wide range of components to upgrade your gaming rig.</p>
    </div>
  </section>

  {/* New section */}
  <section className="products">
    <a href="/buy-custom-built-pc" onClick={handleLinkClick('/buy-custom-built-pc')}>
      <img src="custom_built_pc.jpg" alt="Custom Built PC" />
    </a>
    <h2>Buy Pre-Built PC</h2>
    <div className="description-container">
      <p className="description">Browse and purchase pre-built gaming PCs tailored to your needs.</p>
    </div>
  </section>

  <section className="products">
    <a href="/gaming-pc-accessories" onClick={handleLinkClick('/gaming-pc-accessories')}>
      <img src="gaming_PC_accessories.jpg" alt="Gaming PC Accessories" />
    </a>
    <h2>Buy Gaming PC Accessories</h2>
    <div className="description-container">
      <p className="description">Explore accessories to enhance your gaming experience.</p>
    </div>
  </section>
</main>

      <footer>
        <p>&copy; 2024 buildyourownpc.ggs, Inc.</p>
      </footer>
    </div>
  );
}

function RootApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/build-your-own-pc" element={<BuildYourOwnPC />} />
        <Route path="/buy-custom-built-pc" element={<BuyPreBuiltPC />} /> {/* Updated JSX element */}
        <Route path="/buy-gaming-pc-parts" element={<BuyGamingPCParts />} />
        <Route path="/gaming-pc-accessories" element={<GamingPCAccessories />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default RootApp;