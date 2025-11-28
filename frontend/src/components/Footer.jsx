export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-10 border-t border-slate-300 py-4 text-center text-sm text-slate-600">
      © {year} - Trabajo Práctico Integrador III - Leonel Galban
    </footer>
  );

};

export default Footer
