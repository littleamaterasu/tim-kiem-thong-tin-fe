import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebBar from './components/WebBar/WebBar';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import AboutUs from './components/AboutUs/AboutUs';  // Import component mới

function App() {
  return (
    <Router>
      <div className="App">
        {/* WebBar component */}
        <WebBar />

        {/* Routes configuration */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* AboutUs component */}
        <AboutUs />
      </div>
    </Router>
  );
}

export default App;
