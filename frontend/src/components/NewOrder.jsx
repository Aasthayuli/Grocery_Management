import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NewOrder = () => {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
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
        setProducts(normalized);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAddMore = () => {
    setItems([
      ...items,
      { id: Date.now(), productId: "", price: 0, qty: 1, total: 0 },
    ]);
  };

  const handleProductChange = (index, productId) => {
    const product = products.find((p) => p.id === parseInt(productId));
    const updatedItems = [...items];
    updatedItems[index].productId = productId;
    updatedItems[index].price = product ? product.price : 0;
    updatedItems[index].total =
      updatedItems[index].price * updatedItems[index].qty;
    setItems(updatedItems);
  };

  const handleQtyChange = (index, qty) => {
    const updatedItems = [...items];
    updatedItems[index].qty = parseInt(qty) || 1;
    updatedItems[index].total =
      updatedItems[index].price * updatedItems[index].qty;
    setItems(updatedItems);
  };

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleSaveOrder = () => {
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one product");
      return;
    }

    fetch("http://localhost:5000/saveOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: customerName,
        items,
        total: grandTotal,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetch("http://localhost:5000/saveOrderDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: data.order_id,
            product_id: items.map((item) => item.productId),
            quantity: items.map((item) => item.qty),
            total_price: grandTotal,
          }),
        })
          .then((res) => res.json())
          .then((data2) => {
            console.log(data2);
          })
          .catch((err2) => console.log(err2));
      })
      .catch((err) => console.log(err));

    setCustomerName("");
    setItems([]);
  };

  return (
    <div className="pb-3">
      {/* Header Navigation */}
      <div className="d-flex align-items-center mb-4 gap-2 bg-white shadow-sm px-3">
        <Link to="/" className="text-danger fs-3">
          <i className="zmdi zmdi-home zmdi-hc-fw"></i>
        </Link>
        <Link to="/manage-products" className="text-success fs-3">
          <i className="zmdi zmdi-assignment zmdi-hc-fw"></i>
        </Link>
      </div>

      {/* New Order Section */}
      <div className="card shadow-sm p-4 container ">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">New Order</h4>
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Table Header */}
        <div className="d-flex fw-bold border-bottom pb-2 mb-2">
          <div className="flex-grow-1">Product</div>
          <div style={{ width: "120px" }}>Price</div>
          <div style={{ width: "100px" }}>Qty</div>
          <div style={{ width: "150px" }}>Total</div>
          <button
            type="button"
            className="btn btn-sm btn-primary ms-3"
            onClick={handleAddMore}
          >
            Add
          </button>
        </div>

        {/* Product Rows */}
        {items.length === 0 ? (
          <p className="text-center text-muted">No products added yet.</p>
        ) : (
          items.map((item, index) => (
            <div className="d-flex align-items-center mb-2" key={item.id}>
              <select
                className="form-select flex-grow-1 me-2"
                value={item.productId}
                onChange={(e) => handleProductChange(index, e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control me-2"
                style={{ width: "120px" }}
                value={item.price}
                readOnly
              />

              <input
                type="number"
                min="1"
                className="form-control me-2"
                style={{ width: "100px" }}
                value={item.qty}
                onChange={(e) => handleQtyChange(index, e.target.value)}
              />

              <input
                type="text"
                className="form-control me-2"
                style={{ width: "150px" }}
                value={item.total.toFixed(2)}
                readOnly
              />

              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}

        {/* Total Section */}
        <div className="text-end border-top pt-3 mt-3">
          <h5>
            Total: ₹{grandTotal.toFixed(2)}
            <button
              className="btn btn-primary btn-sm ms-3"
              onClick={handleSaveOrder}
            >
              Save Order
            </button>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
