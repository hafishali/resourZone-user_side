import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Hrm from './Pages/Hrm';
import Career from './Pages/Career';
import Header from './components/Header';
import Footer from './components/Footer';
import Footerbottom from './components/Footerbottom';
import Enquiry from './Pages/Enquiry';
import Application from './Pages/Application';
import Privacy from './Pages/Privacy';
import Terms from './Pages/Terms';
import { Commet } from 'react-loading-indicators';
import { useState, useEffect } from 'react';

function App() {
  const location = useLocation();
  const isNoHeaderFooterPage = location.pathname === '/' || location.pathname === '/enquiry' || location.pathname === '/application';
  const [loading, setLoading] = useState(location.pathname !== '/');

  useEffect(() => {
    if (location.pathname !== '/') {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className="App">
      {loading ? (
        <div className="loader-container">
          <Commet color="#22CC9D" size="medium" text="" textColor="" />
        </div>
      ) : (
        <>
          {!isNoHeaderFooterPage && <Header />}
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hrm" element={<Hrm />} />
              <Route path="/career" element={<Career />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/application" element={<Application />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </div>
          {!isNoHeaderFooterPage && <Footer />}
          {!isNoHeaderFooterPage && <Footerbottom />}
        </>
      )}
    </div>
  );
}

export default App;
