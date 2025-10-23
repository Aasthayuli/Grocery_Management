import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const [msg, saveMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const units = { 1: "Pieces", 2: "Kg", 3: "Litre" };
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    name: "", //product_name
    unit: "", //uom_id
    price: "", //price_per_unit
    stock: "",
    is_active: 1,
  });

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/getProducts")
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((p) => ({
          id: p.product_id,
          name: p.product_name,
          unit: p.uom_id,
          price: p.price_per_unit,
          stock: p.stock,
          is_active: p.is_active,
        }));
        // .filter((p) => p.is_active === 1);
        setProducts(normalized);
      })
      .catch((err) => console.log(err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "price" ? parseInt(value) : value,
    }));
  };

  // Save product
  const handleSave = () => {
    if (!formData.name || !formData.unit || !formData.price) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.id === 0) {
      fetch("http://localhost:5000/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts([...products, { ...formData, id: data.product_id }]);
          setFormData({ id: 0, name: "", unit: "", price: "" });
          setShowModal(false);
          saveMsg(data.msg);
        })
        .catch((err) => console.log(err));
    } else {
      fetch(`http://localhost:5000/updateProduct/${formData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts(
            products.map((p) => (p.id === formData.id ? formData : p))
          );
          setShowModal(false);
          saveMsg(data.msg);
          setShowMsg(true);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/deleteProduct/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        saveMsg(data.msg);
        setShowMsg(true);
        setProducts(products.filter((p) => p.id !== id));
      });
  };

  const handleEdit = (product) => {
    setFormData(product);
    setShowModal(true);
  };

  return (
    <div className="pb-2 ">
      {/* Header Navigation */}
      <div className="d-flex justify-content-start mb-4 gap-2 shadow px-3 bg-white">
        <Link to="/" className="text-danger fs-3">
          <i className="zmdi zmdi-home zmdi-hc-fw"></i>
        </Link>
        <Link to="/new-order" className="text-success fs-3">
          <i className="zmdi zmdi-assignment zmdi-hc-fw"></i>
        </Link>
      </div>

      {/* Manage Products Section */}
      <div className="card shadow-sm p-4 container ">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Manage Products</h3>
          {showMsg && (
            <div className="alert alert-success m-2 d-flex gap-2">
              <div>{msg}</div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowMsg(false)}
              ></button>
            </div>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            Add New Product
          </button>
        </div>

        {/* Product Table */}
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Price Per Unit</th>
              <th>Stock</th>
              <th>Unit</th>
              <th style={{ width: "150px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No products added yet
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{units[product.unit]}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {formData.id === 0 ? "Add New Product" : "Edit Product"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Product name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Unit</label>
                    <select
                      name="unit"
                      className="form-select"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="">Select Unit</option>
                      <option value="1">Pieces</option>
                      <option value="2">Kg</option>
                      <option value="3">Litre</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price Per Unit</label>
                    <input
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      type="number"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">In Stock</label>
                    <input
                      className="form-control"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Enter Quantity"
                      type="number"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      handleSave(), setShowMsg(true);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          ></div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;
