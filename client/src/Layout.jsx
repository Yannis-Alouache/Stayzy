import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify'

export default function Layout() {
  return (
    
    <div className="py-4 px-8 flex flex-col min-h-screen max-w-5xl mx-auto">
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Outlet />
    </div>
  );
}
