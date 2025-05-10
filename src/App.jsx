// App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [editData, setEditData] = useState({}); // New state for editing
  const [isEditing, setIsEditing] = useState(null);

  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Buy Product
  const buyProduct = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/buy/${id}`, {
        quantity: quantity,
      });

      if (response.data.message === "Product sold out and removed.") {
        alert("Product is sold out and has been removed from the list.");
      } else {
        alert("Product purchased successfully!");
      }

      // Refresh the list
      fetchProducts();
    } catch (error) {
      console.error("Error buying product:", error);
    }
  };

  // Create a New Product
  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      alert("Product created successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Update Product
  const updateProduct = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, editData);
      alert("Product updated successfully!");
      setIsEditing(null); // Hide the form
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Set Editable Data
  const startEditing = (product) => {
    setIsEditing(product._id);
    setEditData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  // Handle Form Changes
  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="App">
      <h1>Tech Marketplace</h1>

      {/* Product Form */}
      <form onSubmit={createProduct}>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <input
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
        <input
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        />
        <button type="submit">Create Product</button>
      </form>

      <div className="product-list">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <h3>{p.name}</h3>
            <p>
              <strong>Price:</strong> ${p.price}
            </p>
            <p>
              <strong>Category:</strong> {p.category}
            </p>
            <p>
              <strong>Stock:</strong> {p.stock}
            </p>
            <p>
              <strong>Description:</strong> {p.description}
            </p>

            {/* Buy Now */}
            <input
              type="number"
              min="1"
              max={p.stock}
              placeholder="Quantity"
              style={{ width: "100px", marginBottom: "5px" }}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
              className="buy-button"
              onClick={() => buyProduct(p._id)}
              disabled={p.stock === 0}
            >
              Buy Now
            </button>

            <button
              className="delete-button"
              onClick={() => deleteProduct(p._id)}
            >
              Delete
            </button>

            {/* Edit Section */}
            {isEditing === p._id ? (
              <div className="update-form">
                <input
                  name="price"
                  value={editData.price}
                  onChange={handleEditChange}
                />
                <input
                  name="stock"
                  value={editData.stock}
                  onChange={handleEditChange}
                />
                <button
                  className="update-button"
                  onClick={() => updateProduct(p._id)}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button className="update-button" onClick={() => startEditing(p)}>
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
