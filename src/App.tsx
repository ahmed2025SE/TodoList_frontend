import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import MyLists from "./pages/MyLists";
import ListDetails from "./pages/ListDetails";
import Home from "./pages/Home";
import Completed from "./pages/Completed";
import Upcoming from "./pages/Upcoming";

export default function App() {
  return (
    <Routes>
     
       
        <Route path="/" element={<Navigate to="/login" />} />


        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
      <Route path="/mylists" element={<MyLists />} />
      <Route path="/lists/:id" element={<ListDetails />} />

       <Route path="/home" element={<Home />} />
    
      <Route path="/completed" element={<Completed />} />
      <Route path="/upcoming" element={<Upcoming />} />
    </Routes>
  );
}