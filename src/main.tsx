import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import Layout from "./layout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout";
import LoginPage from "pages/client/auth/login";
import RegisterPage from "pages/client/auth/register";
import "styles/global.scss";
import BookPage from "pages/client/book";
import AboutPage from "pages/client/about";
import HomePage from "pages/client/home";
import { App } from "antd";
import { AppProvider } from "components/context/app.context";
import ProtectedRoute from "@/components/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // If URL path is not mapping to any children path then it will call to HomePage
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <div>Checkout Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: <div>Admin Page</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>
);
