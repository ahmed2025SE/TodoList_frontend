import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

export default function App() {
  return (
    <Routes>
     
       
        <Route path="/" element={<Navigate to="/login" />} />


        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}