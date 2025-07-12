import { Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard"
import Auth from "./pages/Auth"
import Layout from "./components/layout/Layout"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
    </Routes>
  )
}
