import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "", category: "", style: "", price: "", image: "", stock: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [user]);

  async function fetchProducts() {
    const res = await axios.get(`${API_BASE_URL}/api/products`);
    setProducts(res.data);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/products`,
        { ...formData, price: Number(formData.price), stock: Number(formData.stock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ name: "", category: "", style: "", price: "", image: "", stock: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#14213D] px-6 py-16">
      <h2 className="text-3xl font-serif text-center text-[#FAF6EF] mb-10">
        Admin Dashboard
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[#fbfff1ea] rounded-2xl p-6 max-w-xl mx-auto mb-14 space-y-4"
      >
        <h3 className="text-lg font-serif text-[#162e61] mb-2">Add New Product</h3>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        <input name="category" placeholder="Category (e.g. Necklace)" value={formData.category} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        <input name="style" placeholder="Style (e.g. Boho)" value={formData.style} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />

        <button type="submit" disabled={loading} className="w-full bg-[#14213D] text-[#fbfff1ea] py-2 rounded-full font-medium hover:bg-[#0b265e] hover:text-white transition disabled:opacity-50">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="bg-[#fbfff1ea] rounded-xl p-4">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            <p className="font-serif text-[#162e61]">{p.name}</p>
            <p className="text-sm text-gray-500">₹{p.price} · {p.style}</p>
            <button
              onClick={() => handleDelete(p._id)}
              className="mt-3 text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;