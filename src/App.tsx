import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import MyLists from "./pages/MyLists";
import ListDetails from "./pages/ListDetails";

export default function App() {
  return (
    <Routes>
     
       
        <Route path="/" element={<Navigate to="/login" />} />


        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
      <Route path="/mylists" element={<MyLists />} />
      <Route path="/lists/:id" element={<ListDetails />} />
    </Routes>
  );
}