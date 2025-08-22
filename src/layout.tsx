import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useEffect } from "react";
import { fetchAccountAPI } from "services/api";
import { userCurrentApp } from "./components/context/app.context";
import PacmanLoader from "react-spinners/PacmanLoader";

function Layout() {
  const { setUser, isAppLoading, setIsAppLoading, setIsAuthenticated } = userCurrentApp();

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      setIsAppLoading(false);
    }

    fetchAccount();
  }, [])
  return (
    <>
      {isAppLoading ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <PacmanLoader
            size={30}
            color="#36d6b4"
          />
        </div> :
        <div>
          <AppHeader />
          <Outlet />
        </div>
      }



    </>
  );
}

export default Layout;
