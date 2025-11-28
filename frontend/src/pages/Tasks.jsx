import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useForm } from "../hooks/useForm";
import { Loading } from "../components/Loading";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const { formValues, handleInputChange, resetForm } = useForm({
    title: "",
    description: "",
    is_completed: false,
  });

  const loadTasks = async () => {
    setLoadingList(true);
    setErrorMsg("");
    try {
      const data = await apiFetch("/api/tasks-by-user");
      setTasks(data);
    } catch (error) {
      setErrorMsg(error.message || "Error al cargar tareas.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.title || !formValues.description) {
      setErrorMsg("Título y descripción son obligatorios.");
      return;
    }

    setLoadingAction(true);
    setErrorMsg("");

    try {
      if (editingTaskId) {
        await apiFetch(`/api/tasks/${editingTaskId}`, {
          method: "PUT",
          body: formValues,
        });
      } else {
        await apiFetch("/api/tasks", {
          method: "POST",
          body: formValues,
        });
      }

      resetForm({
        title: "",
        description: "",
        is_completed: false,
      });
      setEditingTaskId(null);
      await loadTasks();
      alert("Operación realizada con éxito.");
    } catch (error) {
      setErrorMsg(error.message || "Error en la operación.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    resetForm({
      title: task.title,
      description: task.description,
      is_completed: !!task.is_completed,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que querés eliminar la tarea?");
    if (!confirmDelete) return;

    setLoadingAction(true);
    setErrorMsg("");

    try {
      await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      await loadTasks();
      alert("Tarea eliminada.");
    } catch (error) {
      setErrorMsg(error.message || "Error al eliminar tarea.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleToggleCompleted = async (task) => {
    setLoadingAction(true);
    setErrorMsg("");

    try {
      await apiFetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: {
          title: task.title,
          description: task.description,
          is_completed: !task.is_completed,
        },
      });
      await loadTasks();
    } catch (error) {
      setErrorMsg(error.message || "Error al actualizar tarea.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          {editingTaskId ? "Editar tarea" : "Crear nueva tarea"}
        </h2>

        {loadingAction && <Loading />}

        {errorMsg && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <label className="inline-flex items-center text-sm">
            <input
              type="checkbox"
              name="is_completed"
              checked={formValues.is_completed}
              onChange={handleInputChange}
              className="mr-2"
            />
            Marcar como completada
          </label>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={loadingAction}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:bg-blue-300"
            >
              {editingTaskId ? "Guardar cambios" : "Crear tarea"}
            </button>

            {editingTaskId && (
              <button
                type="button"
                onClick={() => {
                  setEditingTaskId(null);
                  resetForm({
                    title: "",
                    description: "",
                    is_completed: false,
                  });
                }}
                className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Mis tareas</h3>

        {loadingList ? (
          <Loading />
        ) : tasks.length === 0 ? (
          <p className="text-sm text-slate-600">
            No tenés tareas cargadas todavía.
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`border rounded-lg p-4 flex justify-between items-start ${
                  task.is_completed
                    ? "bg-green-50 border-green-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h4
                    className={`font-semibold ${
                      task.is_completed ? "line-through text-slate-500" : ""
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      task.is_completed ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {task.description}
                  </p>
                  {task.createdAt && (
                    <p className="text-xs text-slate-500 mt-1">
                      Fecha:{" "}
                      {new Date(task.createdAt).toLocaleString("es-AR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleToggleCompleted(task)}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {task.is_completed ? "Marcar pendiente" : "Marcar completa"}
                  </button>
                  <button
                    onClick={() => handleEdit(task)}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-yellow-400 hover:bg-yellow-500 text-slate-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-red-500 hover:bg-red-600 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

 export default Tasks