import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import Layout from "./layout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/book",
        element: <div>Book Page</div>,
      },
      {
        path: "/about",
        element: <div>About Page</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <div>Login Page</div>,
  },
  {
    path: "/register",
    element: <div>Register Page</div>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Layout /> */}
    <RouterProvider router={router} />
  </StrictMode>
);
