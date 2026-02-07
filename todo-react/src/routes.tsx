import { createBrowserRouter } from "react-router";
import { Tasks } from "./pages/tasks";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Tasks></Tasks>,
  },
]);
