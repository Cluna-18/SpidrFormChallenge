import { useState } from 'react'
import spidrLogo from './assets/final-spidr-logo.png'
import './App.css'

export default function SpidrFormChallenge() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  })
  const [rawGuess, setRawGuess] = useState('')
  const [rawPin, setRawPin]     = useState('')   
  const [error, setError]       = useState('')

  // ——— Helpers ———

  // Phone: ###-###-####
  const formatPhone = (value) => {
    const d = value.replace(/\D/g, '').slice(0,10)
    const parts = []
    if (d.length > 0) parts.push(d.slice(0,3))
    if (d.length > 3) parts.push(d.slice(3,6))
    if (d.length > 6) parts.push(d.slice(6,10))
    return parts.join('-')
  }

  // Guess: format as $X,XXX
  const formatGuess = (digits) => {
    const d = digits.replace(/\D/g, '')
    if (!d) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number(d))
  }

  // PIN: ####-####-####-####
  const maskPinDisplay = (digits) => {
    const d = digits.slice(0,16)
    const groups = [
      d.slice(0,4),
      d.slice(4,8),
      d.slice(8,12),
      d.slice(12,16)
    ]
    return groups
      .map(g => '#'.repeat(g.length))
      .filter((g,i) => g.length > 0 || i === 0)
      .join('-')
  }

  // ——— Handlers ———

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'firstName' || name === 'lastName') {
      // letters only
      const lettersOnly = value.replace(/[^A-Za-z]/g, '')
      setFormData(fd => ({ ...fd, [name]: lettersOnly }))
    }
    else if (name === 'phoneNumber') {
      setFormData(fd => ({ ...fd, phoneNumber: formatPhone(value) }))
    }
    else if (name === 'email') {
      setFormData(fd => ({ ...fd, email: value }))
    }
    else if (name === 'guess') {
      const digits = value.replace(/\D/g, '')
      setRawGuess(digits)
    }
  }

  // PIN: capture digits & backspace
  const handlePinKeyDown = (e) => {
    const { key } = e
    if (key === 'Backspace') {
      e.preventDefault()
      setRawPin(prev => prev.slice(0, -1))
    } else if (/^[0-9]$/.test(key) && rawPin.length < 16) {
      e.preventDefault()
      setRawPin(prev => prev + key)
    }
  }

  const handleSubmit = () => {
    const { firstName, lastName, phoneNumber, email } = formData
    const phoneDigits = phoneNumber.replace(/\D/g, '')

    // Validate that inputs are correct
    if (
      firstName.length < 2 ||
      lastName.length  < 2 ||
      phoneDigits.length !== 10 ||
      !email.includes('@') ||
      rawGuess.length === 0 ||
      rawPin.length !== 16
    ) {
      setError(
        'Please make sure all fields are filled out correctly.'
      )
      return
    }

    setError('')
    // print all form data
    console.log({
      firstName,
      lastName,
      phoneNumber,
      email,
      guess: formatGuess(rawGuess),
      pin: rawPin
    })
  }

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <img src={spidrLogo} alt="Spidr Logo" className="form-header-logo" />
          <h1 className="form-title">Air Fryer Order Form</h1>
        </div>

        <div className="form-inner">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              placeholder="123-456-7890"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Guess */}
          <div className="form-group">
            <label htmlFor="guess">Guess the Air Fryer’s Cost</label>
            <input
              id="guess"
              name="guess"
              type="text"
              placeholder="$0"
              value={formatGuess(rawGuess)}
              onChange={handleChange}
            />
          </div>

          {/* PIN */}
          <div className="form-group">
            <label htmlFor="pin">Spidr PIN</label>
            <input
              id="pin"
              name="pin"
              type="text"
              placeholder="####-####-####-####"
              value={maskPinDisplay(rawPin)}
              onKeyDown={handlePinKeyDown}
            />
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <button className="btn-submit" type="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  )
}
