import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import OrderDetailPage from './pages/OrderDetailPage'
import UploadPage from './pages/UploadPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders/*" element={<OrderDetailPage />} />
          <Route path="upload" element={<UploadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
