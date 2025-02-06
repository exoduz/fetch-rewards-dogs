import React from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Search from "./pages/Search";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Search /> : <Login />;
};

export default App;
