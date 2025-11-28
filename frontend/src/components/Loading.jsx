export const Loading = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      <span className="ml-3 text-slate-700 font-medium">Cargando...</span>
    </div>
  );
};

export default Loading
