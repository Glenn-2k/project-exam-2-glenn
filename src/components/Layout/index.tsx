import Header from "../Header";
// import Footer from "../Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="bg-gray-200 flex-grow pt-16">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
