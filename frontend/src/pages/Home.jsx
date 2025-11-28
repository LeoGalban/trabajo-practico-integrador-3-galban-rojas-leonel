import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { Loading } from "../components/Loading";
import { Link } from "react-router-dom";

export const Home = () => {
  const [user, setUser] = useState(null);
  const [tasksStats, setTasksStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, tasks] = await Promise.all([
          apiFetch("/api/profile"),
          apiFetch("/api/tasks-by-user"),
        ]);

        setUser(profile.user);

        const total = tasks.length;
        const completed = tasks.filter((t) => t.is_completed).length;
        const pending = total - completed;

        setTasksStats({ total, completed, pending });
      } catch (error) {
        console.error("Error al cargar Home:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">
          ¡Bienvenido, {user?.name || "usuario"}!
        </h2>
        <p className="text-slate-700">
          Esta es tu página de inicio. Desde acá podés ver un resumen de tus
          tareas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm text-slate-600">Total de tareas</p>
          <p className="text-3xl font-bold text-blue-700">{tasksStats.total}</p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <p className="text-sm text-slate-600">Completadas</p>
          <p className="text-3xl font-bold text-green-700">
            {tasksStats.completed}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <p className="text-sm text-slate-600">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-700">
            {tasksStats.pending}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
        <p className="text-slate-700">
          Gestioná tus tareas desde la sección dedicada.
        </p>
        <Link
          to="/tasks"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
        >
          Ir a tareas
        </Link>
      </div>
    </section>
  );
};
 export default Home