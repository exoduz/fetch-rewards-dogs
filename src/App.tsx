import React from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Search from "./pages/Search";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full h-screen">
      {isAuthenticated ? <Search /> : <Login />}
    </div>
  );
};

export default App;
