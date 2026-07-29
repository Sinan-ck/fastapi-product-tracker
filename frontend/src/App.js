import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: '', name: '', description: '', price: '', quantity: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ id: '', name: '', description: '', price: '', quantity: '' });
    setEditingId(null);
  };

  const handleAddOrUpdate = async () => {
    try {
      const payload = {
        id: parseInt(form.id),
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity)
      };

      if (editingId) {
        // PUT expects id as a query param: /products?id=5
        await axios.put(`${API_URL}/products?id=${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/products`, payload);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      // DELETE expects id as a query param: /products?id=5
      await axios.delete(`${API_URL}/products?id=${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>My Product Tracker</h1>
      <p>Total: {products.length}</p>

      <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
      <input name="id" placeholder="ID" value={form.id} onChange={handleChange} disabled={!!editingId} />
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
      <button className="add-btn" onClick={handleAddOrUpdate}>
        {editingId ? 'Update' : 'Add'}
      </button>
      {editingId && (
        <button onClick={resetForm} style={{ marginLeft: '0.5rem' }}>Cancel</button>
      )}

      <h2>Products</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Quantity</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;