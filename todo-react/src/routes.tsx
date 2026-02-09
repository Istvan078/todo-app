import { createBrowserRouter } from "react-router";
import { Tasks } from "./pages/tasks";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Tasks></Tasks>,
  },
  {
    path: "/signup",
    element: <Signup></Signup>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);
