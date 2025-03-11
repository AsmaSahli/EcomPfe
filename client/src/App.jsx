import { Navigate, Route, Routes } from "react-router-dom";

import { BrowserRouter } from 'react-router-dom';
import './App.css'
import { Home } from "./Pages/Home";
import Header from "./components/Header";
import SignIn from "./Pages/SignIn";

function App() {
  return (
    <BrowserRouter>
      <Header/>
          <Routes>
          <Route path="/" element={<Navigate to="/homePage" />} />
          <Route path="/homePage" element={< Home/>} />
          <Route path="/login" element={<SignIn/>} />
          </Routes>

    </BrowserRouter>

  );
}

export default App
