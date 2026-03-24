import { useEffect, useRef, useState } from 'react'
import './BarberProfile.css'

const services = [
  {
    name: 'Мужская стрижка',
    duration: '45-60 мин',
    price: 1400,
    label: 'Signature cut',
    summary: 'Точная форма, чистые линии и укладка под ваш тип волос и стиль.',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200&q=80',
    includes: ['консультация', 'мытье головы', 'укладка']
  },
  {
    name: 'Биозавивка',
    duration: '60-75 мин',
    price: 3400,
    label: 'Texture service',
    summary: 'Мягкая текстура и естественный объем для более выразительной формы.',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=80',
    includes: ['подбор формы', 'безопасный состав', 'рекомендации по уходу']
  },
  {
    name: 'Детская стрижка',
    duration: '30-40 мин',
    price: 1100,
    label: 'Junior cut',
    summary: 'Спокойная аккуратная работа в комфортном темпе без лишней спешки.',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&q=80',
    includes: ['бережный подход', 'аккуратная форма', 'чистый финиш']
  },
  {
    name: 'Камуфляж седины',
    duration: '45 мин',
    price: 800,
    label: 'Grey blend',
    summary: 'Натуральный результат без резкого контраста и эффекта окрашивания.',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80',
    includes: ['естественный тон', 'ровный переход', 'деликатный результат']
  }
]

const portfolioItems = [
  {
    title: 'Fade / texture',
    image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=1200&q=80'
  },
  {
    title: 'Clean classic',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80'
  },
  {
    title: 'Premium detail',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80'
  }
]

function BarberProfile() {
  const [selectedService, setSelectedService] = useState(null)
  const [showComment, setShowComment] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const bookingFormRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    phone: '',
    comment: ''
  })
  const [formError, setFormError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const dates = Array.from({ length: 5 }, (_, index) => {
    const today = new Date()
    const daysShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    const date = new Date(today)

    date.setDate(today.getDate() + index)

    return {
      fullDate: date.toISOString().split('T')[0],
      displayFull: `${date.getDate()} ${months[date.getMonth()]} (${daysShort[date.getDay()]})`
    }
  })

  const timeSlots = Array.from({ length: 21 }, (_, index) => {
    const hour = 10 + Math.floor(index / 2)
    const minute = index % 2 === 0 ? '00' : '30'

    return `${hour.toString().padStart(2, '0')}:${minute}`
  }).filter((time) => time <= '20:00')

  const serviceRows = services.reduce((rows, service, index) => {
    if (index % 2 === 0) {
      rows.push([service])
    } else {
      rows[rows.length - 1].push(service)
    }

    return rows
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 840px)')
    const applyMatch = (event) => {
      setIsMobile(event.matches)
    }

    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', applyMatch)

    return () => mediaQuery.removeEventListener('change', applyMatch)
  }, [])

  useEffect(() => {
    if (!selectedService || !bookingFormRef.current) {
      return
    }

    const timerId = window.setTimeout(() => {
      bookingFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: isMobile ? 'start' : 'nearest'
      })
    }, 120)

    return () => window.clearTimeout(timerId)
  }, [isMobile, selectedService])

  const handleServiceSelect = (service) => {
    const nextService = selectedService?.name === service.name ? null : service

    setSelectedService(nextService)
    setFormError('')
    setIsSubmitted(false)

    if (!nextService || nextService.name !== selectedService?.name) {
      setShowComment(false)
      setFormData((prev) => ({
        ...prev,
        date: '',
        time: '',
        comment: ''
      }))
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError('')
    setIsSubmitted(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!selectedService) {
      setFormError('Сначала выберите услугу, чтобы открыть форму записи.')
      setIsSubmitted(false)
      return
    }

    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      setFormError('Заполните имя, телефон, дату и время, чтобы отправить заявку.')
      setIsSubmitted(false)
      return
    }

    console.log('Отправка заявки:', {
      service: selectedService.name,
      ...formData
    })

    setFormError('')
    setIsSubmitted(true)
    setShowComment(false)
    setFormData({
      name: '',
      date: '',
      time: '',
      phone: '',
      comment: ''
    })
  }

  const renderBookingForm = () => {
    if (!selectedService) {
      return null
    }

    return (
      <form
        ref={bookingFormRef}
        className="booking-form inline-booking-form services-accordion-form"
        onSubmit={handleSubmit}
      >
        <div className="inline-booking-top">
          <div className="inline-booking-copy">
            <span className="card-caption">Быстрая запись</span>
            <h3>Записаться на {selectedService.name.toLowerCase()}</h3>
          </div>

          <div className="inline-booking-meta">
            <span>{selectedService.duration}</span>
            <span>{selectedService.price} c</span>
          </div>
        </div>

        <div className="inline-booking-grid">
          <label className="form-field compact-field">
            <span>Ваше имя</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Например, Азамат"
            />
          </label>

          <label className="form-field compact-field">
            <span>Телефон</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+996 555 123 456"
            />
          </label>

          <label className="form-field compact-field">
            <span>Дата</span>
            <select
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`form-select ${formData.date ? 'has-value' : ''}`}
            >
              <option value="">Выберите дату</option>
              {dates.map((date) => (
                <option key={date.fullDate} value={date.fullDate}>
                  {date.displayFull}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field compact-field">
            <span>Время</span>
            <select
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className={`form-select ${formData.time ? 'has-value' : ''}`}
            >
              <option value="">Выберите время</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="inline-booking-bottom">
          <button
            type="button"
            className={`comment-toggle ${showComment ? 'active' : ''}`}
            onClick={() => setShowComment((prev) => !prev)}
          >
            {showComment ? 'Скрыть комментарий' : 'Добавить комментарий'}
          </button>

          <button type="submit" className="submit-btn compact-submit">
            Отправить заявку
          </button>
        </div>

        {showComment && (
          <label className="form-field compact-field comment-field">
            <span>Комментарий</span>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Можно указать пожелания по длине, форме или укладке"
              rows="3"
            />
          </label>
        )}

        {formError && <div className="form-feedback error">{formError}</div>}
        {isSubmitted && (
          <div className="form-feedback success">
            Заявка сохранена. Следующим шагом можно подключить реальную отправку в Telegram, WhatsApp или CRM.
          </div>
        )}
      </form>
    )
  }

  return (
    <div className="barber-profile">
      <section className="hero-section">
        <div className="hero-shell">
          <p className="hero-floating-label fade-up delay-1">Premium Dark Barber Profile</p>

          <div className="hero-aurora" aria-hidden="true">
            <div className="aurora-blob aurora-blob-1"></div>
            <div className="aurora-blob aurora-blob-2"></div>
            <div className="aurora-blob aurora-blob-3"></div>
          </div>
          <div className="hero-lines" aria-hidden="true"></div>
          <div className="hero-overlay" aria-hidden="true"></div>

          <div className="hero-side-panel fade-up delay-5">
            <div className="hero-socials">
              <a href="#" className="hero-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
                  <circle cx="12" cy="12" r="4.2"></circle>
                  <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"></circle>
                </svg>
                <span>Instagram</span>
              </a>
              <a href="#" className="hero-social-btn" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3.8a8.18 8.18 0 0 0-6.96 12.48l-.8 3.92 4-.76A8.2 8.2 0 1 0 12 3.8Z"></path>
                  <path d="M9.14 8.84c-.19-.42-.39-.43-.57-.43h-.48c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.69 2.72 4.18 3.7 2.07.81 2.49.65 2.94.61.45-.04 1.46-.6 1.66-1.17.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.45-.28-.24-.12-1.4-.69-1.62-.76-.22-.08-.38-.12-.54.12-.16.24-.62.76-.76.92-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.19-.7-.62-1.17-1.38-1.31-1.62-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.33-.75-1.81Z" fill="currentColor" stroke="none"></path>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>

            <a className="hero-cta" href="#services">
              Записаться
            </a>
          </div>

          <div className="hero-avatar-wrap">
            <div className="hero-avatar">
              <img
                src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=900&q=80"
                alt="Портрет барбера"
              />
            </div>
          </div>

          <div className="hero-copy">
            <div className="hero-copy-main">
              <h1 className="hero-title fade-up delay-2">Arman Seitkali</h1>

              <div className="hero-mobile-actions fade-up delay-3">
                <div className="hero-socials hero-socials-mobile">
                  <a href="#" className="hero-social-btn" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
                      <circle cx="12" cy="12" r="4.2"></circle>
                      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"></circle>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="hero-social-btn" aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3.8a8.18 8.18 0 0 0-6.96 12.48l-.8 3.92 4-.76A8.2 8.2 0 1 0 12 3.8Z"></path>
                      <path d="M9.14 8.84c-.19-.42-.39-.43-.57-.43h-.48c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.69 2.72 4.18 3.7 2.07.81 2.49.65 2.94.61.45-.04 1.46-.6 1.66-1.17.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.45-.28-.24-.12-1.4-.69-1.62-.76-.22-.08-.38-.12-.54.12-.16.24-.62.76-.76.92-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.19-.7-.62-1.17-1.38-1.31-1.62-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.33-.75-1.81Z" fill="currentColor" stroke="none"></path>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>

                <a className="hero-cta hero-cta-mobile" href="#services">
                  Записаться
                </a>
              </div>

              <p className="hero-subtitle fade-up delay-4">
                Мужские стрижки, текстура и аккуратный сервис в спокойной премиальной подаче.
              </p>
            </div>

            <div className="hero-footer fade-up delay-5">
              <div className="hero-meta">
                <span className="hero-location">Бишкек, Кыргызстан</span>
                <span className="hero-status-badge">
                  <span className="hero-status-dot"></span>
                  Принимаю запись
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="content-shell">
        <section className="section-block services-section" id="services">
          <div className="section-heading services-heading">
            <p className="section-kicker">Услуги</p>
            <h2 className="services-title">Понятные офферы вместо перегруженных карточек</h2>
            <p className="section-note services-note">
              Выберите карточку, и аккуратная mini-форма откроется сразу под тем блоком, который вы нажали.
            </p>
          </div>

          <div className="services-grid">
            {serviceRows.map((row, rowIndex) => {
              const rowHasSelected = row.some((service) => service.name === selectedService?.name)

              return (
                <div key={`services-row-${rowIndex}`} className="services-row-block">
                  <div className="services-row">
                    {row.map((service) => {
                      const isSelected = selectedService?.name === service.name

                      return (
                        <div key={service.name} className={`service-item ${isSelected ? 'selected' : ''}`}>
                          <article
                            className={`service-card ${isSelected ? 'selected' : ''}`}
                            style={{ backgroundImage: `url(${service.image})` }}
                            onClick={() => handleServiceSelect(service)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                handleServiceSelect(service)
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-expanded={isSelected}
                          >
                            <div className="service-card-top">
                              <span className="service-tag">{service.label}</span>
                              <span className="service-duration">{service.duration}</span>
                            </div>

                            <div className="service-body">
                              <h3>{service.name}</h3>
                              <p>{service.summary}</p>
                              <ul className="service-includes">
                                {service.includes.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="service-footer">
                              <strong className="service-price">{service.price} c</strong>

                              <button
                                type="button"
                                className={`service-select ${isSelected ? 'active' : ''}`}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleServiceSelect(service)
                                }}
                              >
                                {isSelected ? 'Свернуть' : 'Выбрать'}
                              </button>
                            </div>
                          </article>

                          {isMobile && isSelected && renderBookingForm()}
                        </div>
                      )
                    })}
                  </div>

                  {!isMobile && rowHasSelected && renderBookingForm()}
                </div>
              )
            })}
          </div>
        </section>

        <section className="section-block section-grid portfolio-section" id="portfolio">
          <div className="section-heading portfolio-heading">
            <p className="section-kicker">Портфолио</p>
            <h2>Визуальный блок, который продает доверие</h2>
          </div>

          <div className="portfolio-grid">
            {portfolioItems.map((item) => (
              <article key={item.title} className="portfolio-card">
                <img src={item.image} alt={item.title} />
                <div className="portfolio-caption">
                  <span>{item.title}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default BarberProfile
