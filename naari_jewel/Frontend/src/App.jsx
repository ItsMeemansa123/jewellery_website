import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import ShopAll from "./pages/ShopAll";
import Cart from "./pages/Cart";
import ScrollToHash from "./components/ScrollToHash";

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/shop" element={<ShopAll />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;