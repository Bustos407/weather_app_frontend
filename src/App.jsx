import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"; 
import ProtectedRoute from "./components/ProtectedRoute";
import TableView from "./components/TableView"; 
import "./styles.css"; 

function App() {
  return (
    <Routes>

     
      <Route path="/" element={<Navigate to="/login" replace />} />

    
      <Route path="/login" element={<Login />} />

      
      <Route element={<ProtectedRoute />}>
      
        <Route path="/home" element={<Home />} />
        <Route path="/table/:type" element={<TableView />} />
      </Route>

      
    </Routes>
  );
}

export default App;
