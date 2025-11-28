import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { apiFetch } from "../../api";
import { Loading } from "../../components/Loading";

export const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { formValues, handleInputChange } = useForm({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.username || !formValues.password) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await apiFetch("/api/login", {
        method: "POST",
        body: {
          username: formValues.username,
          password: formValues.password,
        },
      });

      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      setErrorMsg(error.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

      {loading && <Loading />}

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Usuario
          </label>
          <input
            id="username"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="******"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-md"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Registrate acá
        </Link>
      </p>
    </section>
  );
};

export default Login
