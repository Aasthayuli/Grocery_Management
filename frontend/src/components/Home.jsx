import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const Home = () => {
  const [order, setorder] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/getOrders")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setorder(data);
      });
  }, []);
  return (
    <div className="">
      {/* Header Navigation */}
      <div className="d-flex justify-content-start mb-4 gap-2 shadow px-3 bg-white">
        <Link to="/manage-products" className="text-danger fs-3">
          <i className="zmdi zmdi-assignment zmdi-hc-fw"></i>
        </Link>
        <Link to="/new-order" className="text-success fs-3">
          <i className="zmdi zmdi-assignment zmdi-hc-fw"></i>
        </Link>
        <button
          type="button"
          className="btn ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#userProfileModal"
        >
          View Profile
        </button>
      </div>

      {/* Main Content */}
      <div className="container right content-page bg-white rounded p-3">
        <div className="body content rows scroll-y">
          <form className="form-horizontal" action="">
            <div className="box-info full" id="taskFormContainer">
              <h2>Grocery Store Management</h2>

              <div className="row mb-4">
                <div className="d-flex gap-2">
                  <Link
                    to="/new-order"
                    className="btn btn-sm btn-primary pull-right ml-3"
                  >
                    New Order
                  </Link>
                  <Link
                    to="/manage-products"
                    className="btn btn-sm btn-primary pull-right"
                  >
                    Manage Products
                  </Link>
                  <Link
                    to="/order-details"
                    className="btn btn-sm btn-primary pull-right"
                  >
                    Order Details
                  </Link>
                </div>

                <table className="table table-bordered mt-3">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order Number</th>
                      <th>Customer Name</th>
                      <th>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.length === 0 ? (
                      <tr key="no-order">
                        <td colSpan="4" className="text-center text-muted">
                          No products added yet
                        </td>
                      </tr>
                    ) : (
                      order.map((order) => (
                        <tr key={order.order_id}>
                          <td>{order.datetime}</td>
                          <td>ORD-{order.order_id}</td>
                          <td>{order.customer_name}</td>
                          <td>{order.total}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </form>

          {/* User Profile Modal */}
          <div
            className="modal fade"
            id="userProfileModal"
            tabIndex="-1"
            aria-labelledby="userProfileModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="userProfileModalLabel">
                    User Profile
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="Profile"
                    width="80"
                    className="rounded-circle mb-3"
                  />
                  <h5>Aastha</h5>
                  <p>Grocery Store Manager</p>
                  <p>Email: aastha@example.com</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner Modal */}
      <div
        className="modal fade-scale"
        id="myModal"
        role="dialog"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img
                src="http://demo.test.cloint.com/assets/images/spinner.gif"
                width="40"
                style={{ margin: "60px auto" }}
                alt="Loading..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
