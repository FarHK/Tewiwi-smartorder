import { useEffect, useState } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { theme } from './config/appConfig'
import { readOrders, writeOrders } from './services/demoOrderStorage'
import SmartOrderPage from './pages/customer/SmartOrderPage'
import OrderSuccessPage from './pages/customer/OrderSuccessPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import './App.css'

function App() {
  const [orders, setOrders] = useState(() => {
    try {
      return readOrders()
    } catch (error) {
      console.error('Gagal membaca pesanan tersimpan:', error)
      return []
    }
  })

  useEffect(() => {
    try {
      writeOrders(orders)
    } catch (error) {
      console.error('Gagal menyimpan pesanan:', error)
    }
  }, [orders])

  const updateOrderStatus = (code, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.code === code ? { ...order, status } : order)),
    )
  }

  const createOrder = (order) => {
    setOrders((currentOrders) => [order, ...currentOrders])
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SmartOrderPage orders={orders} onCreateOrder={createOrder} />} />
          <Route path="/sukses/:code" element={<OrderSuccessPage orders={orders} />} />
          <Route path="/admin" element={<AdminDashboard orders={orders} onUpdateStatus={updateOrderStatus} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
