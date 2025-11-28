import { Link, NavLink, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const navLinkClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100",
    isActive ? "text-blue-700" : "text-slate-700",
  ].join(" ");

export const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      alert("No se pudo cerrar sesión.");
    }
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={isAuthenticated ? "/home" : "/login"}>
          <span className="text-xl font-bold text-blue-600">
            Task Manager TPI III
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink to="/home" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/tasks" className={navLinkClass}>
                Tasks
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 rounded-md text-sm font-semibold bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
 export default Navbar