import React, { useEffect } from 'react';
import './styles.css'; // Import your CSS file

function App() {
  useEffect(() => {
    // Add event listener to open page in a new tab when section is clicked
    const handleClick = (event) => {
      const section = event.currentTarget;
      const pageUrl = section.getAttribute('data-page');
      window.open(pageUrl, '_blank');
    };

    const sections = document.querySelectorAll('.products');
    sections.forEach(section => {
      section.addEventListener('click', handleClick);
      return () => section.removeEventListener('click', handleClick);
    });

    return () => {
      sections.forEach(section => {
        section.removeEventListener('click', handleClick);
      });
    };
  }, []); // Empty dependency array ensures the effect runs only once after the component mounts

  return (
    <div className="App">
      <header>
        <a href="#">
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

      <main>
        <section className="products" data-page="build-pc-page.html">
          <a href="build_your_PC.jpg">
            <img src="build_your_PC.jpg" alt="Build Your Own PC" />
          </a>
          <h2>Build Your Own PC</h2>
          <div className="description-container">
            <p className="description">Select and customize your own gaming PC from scratch.</p>
          </div>
        </section>

        <section className="products" data-page="pc-parts-page.html">
          <a href="gaming_PC_parts.jpg">
            <img src="gaming_PC_parts.jpg" alt="Gaming PC Parts" />
          </a>
          <h2>Gaming PC Parts</h2>
          <div className="description-container">
            <p className="description">Choose from a wide range of components to upgrade your gaming rig.</p>
          </div>
        </section>

        <section className="products" data-page="pc-accessories-page.html">
          <a href="gaming_PC_accessories.jpg">
            <img src="gaming_PC_accessories.jpg" alt="Gaming PC Accessories" />
          </a>
          <h2>Gaming PC Accessories</h2>
          <div className="description-container">
            <p className="description">Explore accessories to enhance your gaming experience.</p>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 BuildYourOwnPC.ggs, Inc.</p>
      </footer>
    </div>
  );
}

export default App;
