import React from 'react';

function App() {
  return (
    <div className="App">
      {/* Missing lang attribute in HTML */}
      {/* Color contrast issue */}
      <header
        style={{
          backgroundColor: '#FFD700',
          color: '#FFFF00',
          padding: '20px',
        }}
      >
        {/* Missing heading structure - h1 should come first */}
        <h2>Welcome to our Website</h2>
      </header>

      <main style={{ padding: '20px' }}>
        {/* Image missing alt text */}
        <img src="https://via.placeholder.com/150" />

        {/* Button with no accessible name */}
        <button></button>

        {/* Empty link */}
        <a href="#" style={{ color: '#888888' }}></a>

        {/* Form controls without labels */}
        <form>
          <input type="text" placeholder="Enter name" />
          <select>
            <option>Choose an option</option>
          </select>
        </form>

        {/* Interactive element not keyboard accessible */}
        <div onClick={() => alert('Clicked')} style={{ cursor: 'pointer' }}>
          Click me
        </div>

        {/* Non-semantic list */}
        <div>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </div>
      </main>
    </div>
  );
}

export default App;
