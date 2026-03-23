import { useState } from 'react'
import './BookingModal.css'

function BookingModal({ service, onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    comment: ''
  })

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Формируем сообщение для Telegram
    const message = `
🔔 Новая запись!

👤 Клиент: ${formData.name}
📞 Телефон: ${formData.phone}
✂️ Услуга: ${service?.title || 'Не выбрана'}
📅 Дата: ${formData.date}
🕐 Время: ${formData.time}
💰 Цена: ${service?.price || ''}

💬 Комментарий: ${formData.comment || 'Нет'}
    `.trim()

    console.log('Отправка в Telegram:', message)
    
    // TODO: Здесь будет отправка в Telegram API
    alert('Запись успешно создана! Мы свяжемся с вами для подтверждения.')
    onClose()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2 className="modal-title">
          Запись на <span className="neon-text">стрижку</span>
        </h2>

        {service && (
          <div className="selected-service">
            <span className="service-icon-small">{service.icon}</span>
            <div>
              <div className="service-name">{service.title}</div>
              <div className="service-details">
                {service.duration} • {service.price}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Ваше имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Иван Петров"
            />
          </div>

          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div className="form-group">
            <label>Дата</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Время</label>
            <div className="time-slots">
              {timeSlots.map(time => (
                <button
                  key={time}
                  type="button"
                  className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, time })}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Комментарий (необязательно)</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Особые пожелания..."
              rows="3"
            />
          </div>

          <button type="submit" className="btn-submit">
            Подтвердить запись
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
