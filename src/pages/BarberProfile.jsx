import { useState } from 'react'
import React from 'react'
import './BarberProfile.css'

function BarberProfile() {
  const [activeTab, setActiveTab] = useState('services')
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    phone: '',
    comment: ''
  })

  // Генерируем 5 дней начиная с сегодня
  const generateDates = () => {
    const dates = []
    const today = new Date()
    const daysShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        dayShort: daysShort[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        fullDate: date.toISOString().split('T')[0],
        displayDate: `${date.getDate()} ${months[date.getMonth()]}`,
        displayFull: `${date.getDate()} ${months[date.getMonth()]} (${daysShort[date.getDay()]})`
      })
    }
    return dates
  }

  // Генерируем временные слоты с 8:00 до 20:00 с интервалом 30 минут
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 20) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    return slots
  }

  const dates = generateDates()
  const timeSlots = generateTimeSlots()

  const handleServiceClick = (service) => {
    if (selectedService?.name === service.name) {
      setSelectedService(null)
    } else {
      setSelectedService(service)
      setFormData({ name: '', date: '', time: '', phone: '', comment: '' })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (dateValue) => {
    setFormData(prev => ({ ...prev, date: dateValue }))
  }

  const handleTimeSelect = (timeValue) => {
    setFormData(prev => ({ ...prev, time: timeValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.date || !formData.time || !formData.phone) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }
    
    // Здесь будет отправка в Telegram
    console.log('Отправка заявки:', {
      service: selectedService.name,
      ...formData
    })
    
    alert('Заявка отправлена!')
    setSelectedService(null)
    setFormData({ name: '', date: '', time: '', phone: '', comment: '' })
  }

  const services = [
    { 
      name: 'Стрижка + укладка', 
      duration: '45–60 мин', 
      price: 700, 
      emoji: '✂️',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80'
    },
    { 
      name: 'Fade / Skin Fade', 
      duration: '60–75 мин', 
      price: 900, 
      emoji: '💈',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80'
    },
    { 
      name: 'Борода + коррекция', 
      duration: '30 мин', 
      price: 500, 
      emoji: '🪒',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80'
    },
    { 
      name: 'Стрижка + борода', 
      duration: '90 мин', 
      price: 1200, 
      emoji: '⚡',
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80'
    },
    { 
      name: 'Детская стрижка', 
      duration: '30–40 мин', 
      price: 500, 
      emoji: '🌟',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80'
    },
    { 
      name: 'Горячее бритьё', 
      duration: '45 мин', 
      price: 800, 
      emoji: '🔥',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80'
    }
  ]



  return (
    <div className="barber-profile">
      {/* Header */}
      <header className="profile-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-info">
              <h1 className="header-name">Arman Seitkali</h1>
              <p className="header-subtitle">Мастер-барбер · Бишкек</p>
            </div>
          </div>
          
          {/* Анимированные частицы */}
          <div className="particles">
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <div className="tab-nav-content">
          <button 
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Услуги
          </button>
          <button 
            className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Портфолио
          </button>
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            Обо мне
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="services-tab">
            <div className="services-grid">
              {services.map((service, index) => {
                const isSelected = selectedService?.name === service.name
                // Определяем, после какой карточки показывать форму (конец ряда)
                const isEndOfRow = (index + 1) % 3 === 0 || index === services.length - 1
                const showFormAfterThisRow = isSelected && isEndOfRow
                
                // Проверяем, есть ли выбранная карточка в текущем ряду
                const currentRowStart = Math.floor(index / 3) * 3
                const currentRowEnd = Math.min(currentRowStart + 3, services.length)
                const selectedInCurrentRow = selectedService && 
                  services.slice(currentRowStart, currentRowEnd).some(s => s.name === selectedService.name)
                
                const showFormAfterRow = selectedInCurrentRow && isEndOfRow
                
                return (
                  <React.Fragment key={service.name}>
                    <div 
                      className={`service-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleServiceClick(service)}
                      style={{ backgroundImage: `url(${service.image})` }}
                    >
                      <div className="neon-glow-corner"></div>
                      {isSelected && (
                        <div className="checkmark-badge">✓</div>
                      )}
                      <div className="service-content">
                        <div className="service-emoji">{service.emoji}</div>
                        <h3 className="service-name">{service.name}</h3>
                        <p className="service-duration">{service.duration}</p>
                        <div className="service-divider"></div>
                        <div className="service-footer">
                          <span className="service-time">⏱️ {service.duration}</span>
                          <span className="service-price">от {service.price}с</span>
                        </div>
                      </div>
                    </div>

                    {/* Форма заявки на всю ширину после конца ряда */}
                    {showFormAfterRow && (
                      <div className="booking-form-container">
                        <form className="booking-form" onSubmit={handleSubmit}>
                          {/* Информационный блок */}
                          <div className="form-header">
                            <h3 className="form-title">Запись на {selectedService.name}</h3>
                            <p className="form-description">
                              Вы записываетесь на стрижку. Я вам перезвоню для подтверждения и уточнения деталей.
                            </p>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="name">Ваше имя *</label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Например: Анна"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="phone">Номер телефона *</label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+996 555 123 456"
                                required
                              />
                            </div>
                          </div>

                          {/* Выбор даты */}
                          <div className="form-group">
                            <label>Выберите дату *</label>
                            <div className="date-selector-inline">
                              {dates.map(d => (
                                <button
                                  key={d.fullDate}
                                  type="button"
                                  className={`date-btn ${formData.date === d.fullDate ? 'active' : ''}`}
                                  onClick={() => handleDateSelect(d.fullDate)}
                                >
                                  {d.displayFull}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Выбор времени */}
                          <div className="form-group">
                            <label>Выберите время *</label>
                            <div className="time-selector-grid">
                              {timeSlots.map(time => (
                                <button
                                  key={time}
                                  type="button"
                                  className={`time-btn ${formData.time === time ? 'active' : ''}`}
                                  onClick={() => handleTimeSelect(time)}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="comment">Комментарий</label>
                            <textarea
                              id="comment"
                              name="comment"
                              value={formData.comment}
                              onChange={handleInputChange}
                              placeholder="Укажите любые пожелания"
                              rows="3"
                            />
                          </div>

                          <button type="submit" className="submit-btn">
                            ✈️ Отправить заявку
                          </button>
                        </form>
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="portfolio-tab">
            <h2 className="section-title">Портфолио</h2>
            <div className="portfolio-grid">
              <div className="portfolio-item">
                <div className="portfolio-placeholder">📸</div>
                <p>Скоро здесь появятся фото работ</p>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="about-tab">
            <h2 className="section-title">Обо мне</h2>
            <p className="bio-text">
              Профессиональный барбер с более чем 8-летним опытом работы. 
              Специализируюсь на классических и современных мужских стрижках, 
              fade-переходах и уходе за бородой. Каждый клиент для меня уникален.
            </p>

            <h3 className="skills-title">Специализация</h3>
            <div className="skills-tags">
              {['Fade', 'Skin Fade', 'Taper', 'Борода', 'Buzz Cut', 'Pompadour', 'Детские'].map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>

            <div className="social-buttons">
              <a href="#" className="social-btn">
                <span>📷</span> Instagram
              </a>
              <a href="#" className="social-btn">
                <span>💬</span> WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BarberProfile
