import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import Layout from "./layout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout";
import LoginPage from "pages/client/auth/login";
import RegisterPage from "pages/client/auth/register";
import "./styles/global.scss";
import BookPage from "pages/client/book";
import AboutPage from "pages/client/about";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Layout /> */}
    <RouterProvider router={router} />
  </StrictMode>
);
