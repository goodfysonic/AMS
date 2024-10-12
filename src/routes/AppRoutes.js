import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "../components/HomePage";
import Auth from "../components/Auth";
import Header from "../components/commons/Header";
import Footer from "../components/commons/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      <div>{children}</div>
      {!isLoginPage && <Footer />}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
