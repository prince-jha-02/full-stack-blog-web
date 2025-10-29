import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getcurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({userData} ));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-400">
        <h1 className="text-2xl font-semibold text-white">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-400">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet /> {/* ✅ This is where your Login, Signup, Home, etc. appear */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
