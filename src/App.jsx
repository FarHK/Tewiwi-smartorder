import { useState } from 'react'
import {
  Alert,
  Button,
  CssBaseline,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

const theme = createTheme({
  palette: {
    primary: { main: '#092f9e' },
    success: { main: '#82e66b' },
    background: { default: '#ffc08e', paper: '#ffead8' },
  },
  typography: {
    fontFamily: '"Trebuchet MS", Arial, sans-serif',
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 18 },
})

const products = [
  { id: 'sourdough', name: 'Sourdough Original', price: 48000, emoji: '🥖' },
  { id: 'whole-wheat', name: 'Roti Gandum Utuh', price: 38000, emoji: '🍞' },
  { id: 'cinnamon', name: 'Cinnamon Roll', price: 22000, emoji: '🌀' },
  { id: 'milk-bun', name: 'Milk Bun', price: 18000, emoji: '🥯' },
]

const rupiah = (amount) =>
  `Rp${new Intl.NumberFormat('id-ID').format(amount)},-`

function getDeliveryOptions() {
  return [2, 6, 9].map((daysFromToday, index) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromToday)

    return {
      id: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-'),
      weekday: new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date),
      date: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
      }).format(date),
      available: index === 0 ? 0 : index === 1 ? 20 : 50,
      capacity: 50,
    }
  })
}

function SmartOrderPage() {
  const deliveryOptions = getDeliveryOptions()
  const [deliveryId, setDeliveryId] = useState(deliveryOptions[1].id)
  const [quantities, setQuantities] = useState({})
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [formError, setFormError] = useState('')
  const [orderMessage, setOrderMessage] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const selectedDelivery =
    deliveryOptions.find((option) => option.id === deliveryId) ?? deliveryOptions[1]
  const totalItems = Object.values(quantities).reduce(
    (total, quantity) => total + quantity,
    0,
  )
  const totalPrice = products.reduce(
    (total, product) => total + product.price * (quantities[product.id] ?? 0),
    0,
  )

  const changeQuantity = (productId, amount) => {
    if (amount > 0 && totalItems >= selectedDelivery.available) {
      setFormError(`Kuota untuk tanggal ini maksimal ${selectedDelivery.available} roti.`)
      return
    }

    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(0, (current[productId] ?? 0) + amount),
    }))
    setFormError('')
    setOrderMessage('')
  }

  const submitOrder = (event) => {
    event.preventDefault()
    setFormError('')
    setOrderMessage('')
    setNameError('')

    if (!name.trim()) {
      setNameError('Nama pemesan wajib diisi.')
      return
    }
    if (totalItems === 0) {
      setFormError('Pilih minimal 1 roti sebelum mengirim pesanan.')
      return
    }
    if (totalItems > selectedDelivery.available) {
      setFormError(`Kuota untuk tanggal ini hanya ${selectedDelivery.available} roti.`)
      return
    }

    const normalizedPhone = phone.replace(/\D/g, '')
    if (normalizedPhone.length < 9 || normalizedPhone.length > 15) {
      setPhoneError('Masukkan nomor WhatsApp yang valid (9–15 angka).')
      return
    }

    setPhoneError('')
    const orderLines = products
      .filter((product) => quantities[product.id])
      .map(
        (product) =>
          `- ${product.name} x${quantities[product.id]} — ${rupiah(product.price * quantities[product.id])}`,
      )
      .join('\n')
    const message = [
      'Halo Tewiwi House! Saya ingin memesan:',
      orderLines,
      '',
      `Tanggal pengiriman: ${selectedDelivery.weekday}, ${selectedDelivery.date}`,
      `Nama: ${name.trim()}`,
      `No. WhatsApp: ${phone.trim()}`,
      `Total: ${rupiah(totalPrice)} (${totalItems} roti)`,
    ].join('\n')

    setWhatsappUrl(`https://wa.me/?text=${encodeURIComponent(message)}`)
    setOrderMessage('Pesanan siap dikirim. Lanjutkan melalui WhatsApp untuk konfirmasi.')
  }

  return (
    <main className="order-page">
      <header className="brand-bar">
        <Typography component="h1" className="brand-name">
          Tewiwi House
        </Typography>
      </header>

      <div className="order-content">
        <section aria-labelledby="delivery-heading">
          <Paper className="order-card delivery-card" elevation={0}>
            <Typography id="delivery-heading" component="h2" className="section-title">
              1. Kapan mau dikirim?
            </Typography>
            <div className="delivery-options">
              {deliveryOptions.map((option) => {
                const isFull = option.available === 0
                const isSelected = option.id === deliveryId

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`delivery-option${isFull ? ' is-full' : ''}${isSelected ? ' is-selected' : ''}`}
                    disabled={isFull}
                    aria-pressed={isSelected}
                    onClick={() => {
                      if (totalItems > option.available) {
                        setFormError(
                          `Kurangi jumlah roti menjadi maksimal ${option.available} sebelum memilih tanggal ini.`,
                        )
                        return
                      }
                      setDeliveryId(option.id)
                      setFormError('')
                      setOrderMessage('')
                    }}
                  >
                    <span className="delivery-date">
                      {option.weekday},
                      <br />
                      {option.date}
                    </span>
                    <span className="delivery-capacity">
                      {isFull
                        ? 'Penuh'
                        : `Sisa ${option.available} dari ${option.capacity} roti`}
                    </span>
                  </button>
                )
              })}
            </div>
          </Paper>
          <Alert severity="info" icon={false} className="delivery-note">
            {deliveryOptions[0].weekday}, {deliveryOptions[0].date} sudah penuh, jadi kamu
            diarahkan ke {selectedDelivery.weekday}, {selectedDelivery.date}.
          </Alert>
        </section>

        <section aria-labelledby="products-heading">
          <Paper className="order-card products-card" elevation={0}>
            <Typography id="products-heading" component="h2" className="section-title">
              2. Mau pesan roti apa?
            </Typography>
            <div className="product-list">
              {products.map((product) => {
                const quantity = quantities[product.id] ?? 0

                return (
                  <article className="product-row" key={product.id}>
                    <div className="product-image" aria-hidden="true">
                      {product.emoji}
                    </div>
                    <div className="product-details">
                      <Typography component="h3" className="product-name">
                        {product.name}
                      </Typography>
                      <Typography className="product-price">
                        {rupiah(product.price)}
                      </Typography>
                    </div>
                    <div className="quantity-control" aria-label={`Jumlah ${product.name}`}>
                      <button
                        type="button"
                        aria-label={`Kurangi ${product.name}`}
                        onClick={() => changeQuantity(product.id, -1)}
                      >
                        −
                      </button>
                      <output aria-live="polite">{quantity}</output>
                      <button
                        type="button"
                        aria-label={`Tambah ${product.name}`}
                        onClick={() => changeQuantity(product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </Paper>
        </section>

        <section aria-labelledby="customer-heading">
          <Paper className="order-card customer-card" elevation={0}>
            <Typography id="customer-heading" component="h2" className="section-title">
              3. Data pemesan
            </Typography>
            <form onSubmit={submitOrder} noValidate>
              <TextField
                label="Nama"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setNameError('')
                }}
                required
                fullWidth
                size="small"
                autoComplete="name"
                error={Boolean(nameError)}
                helperText={nameError}
              />
              <TextField
                label="No. Whatsapp"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value)
                  setPhoneError('')
                }}
                required
                fullWidth
                size="small"
                type="tel"
                autoComplete="tel"
                error={Boolean(phoneError)}
                helperText={phoneError}
              />
              {formError && <Alert severity="error">{formError}</Alert>}
              <div className="submit-row">
                <Button type="submit" variant="contained" color="success">
                  Kirim pesanan - {totalItems} roti - {rupiah(totalPrice)}
                </Button>
              </div>
              {orderMessage && (
                <Alert severity="success" className="order-success">
                  {orderMessage}
                  <Button
                    component="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-link"
                  >
                    Buka WhatsApp
                  </Button>
                </Alert>
              )}
            </form>
          </Paper>
        </section>
      </div>
    </main>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SmartOrderPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
