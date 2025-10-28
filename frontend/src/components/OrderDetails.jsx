import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const OrderDetails = () => {
  const [order, setorder] = useState([
    {
      order_id: 0,
      product_id: 0,
      quantity: 0,
      total_price: 0,
      status: "",
    },
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/getOrderDetails")
      .then((res) => res.json())
      .then((data) => {
        setorder(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

      {/* Order Details */}
      <div
        className="card shadow-sm p-4 container "
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Order Details</h3>
        </div>
        {/* Product Table */}
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {order.length === 0 ? (
              <tr key="no-orders">
                <td colSpan="4" className="text-center text-muted">
                  No products added yet
                </td>
              </tr>
            ) : (
              order.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.product_id}</td>
                  <td>{order.quantity}</td>
                  <td>{order.total_price}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;
