import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ManageProducts from "./components/ManageProducts";
import NewOrder from "./components/NewOrder";
import OrderDetails from "./components/OrderDetails";

const App = () => {
  return (
    <div className="bg-mall">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/order-details" element={<OrderDetails />} />
      </Routes>
    </div>
  );
};

export default App;
