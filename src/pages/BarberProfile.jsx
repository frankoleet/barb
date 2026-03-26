import { useEffect, useRef, useState } from 'react'
import './BarberProfile.css'

const WHATSAPP_URL = 'http://wa.me/996553707423'
const INSTAGRAM_URL = 'https://www.instagram.com/nrrbarber/'
const TELEGRAM_BOOKING_API_URL = '/api/telegram-booking'

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
    image: '/a.png'
  },
  {
    title: 'Clean classic',
    image: '/c.JPG'
  },
  {
    title: 'Premium detail',
    image: '/d.png'
  }
]

function BarberProfile() {
  const [selectedService, setSelectedService] = useState(null)
  const [showComment, setShowComment] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'))

    if (!revealNodes.length) {
      return
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotionQuery.matches) {
      revealNodes.forEach((node) => node.setAttribute('data-reveal-state', 'visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.setAttribute('data-reveal-state', 'visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
      }
    )

    revealNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  const handleServiceSelect = (service) => {
    const nextService = selectedService?.name === service.name ? null : service

    setSelectedService(nextService)
    setFormError('')
    setIsSubmitted(false)
    setIsSubmitting(false)

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

  const handleSubmit = async (event) => {
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

    const selectedDate = dates.find((date) => date.fullDate === formData.date)
    const payload = {
      serviceName: selectedService.name,
      serviceLabel: selectedService.label,
      price: selectedService.price,
      duration: selectedService.duration,
      name: formData.name,
      phone: formData.phone,
      date: formData.date,
      dateLabel: selectedDate?.displayFull ?? formData.date,
      time: formData.time,
      comment: formData.comment.trim()
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      setIsSubmitted(false)

      const response = await fetch(TELEGRAM_BOOKING_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('telegram_send_failed')
      }

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
    } catch {
      setIsSubmitted(false)
      setFormError('submit_failed')
    } finally {
      setIsSubmitting(false)
    }

    return
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
            <span className="card-caption">Запись</span>
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
              placeholder="Например, Бека"
            />
          </label>

          <label className="form-field compact-field">
            <span>Телефон</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+996 777 123 456"
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
            disabled={isSubmitting}
            onClick={() => setShowComment((prev) => !prev)}
          >
            {showComment ? 'Скрыть комментарий' : 'Добавить комментарий'}
          </button>

          <button type="submit" className="submit-btn compact-submit" disabled={isSubmitting}>
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

        {formError === 'submit_failed' && (
          <div className="form-feedback error">
            <p>Заявка не отправлена, напишите напрямую мне.</p>
            <a href={WHATSAPP_URL} className="form-feedback-link" target="_blank" rel="noreferrer">
              Написать в WhatsApp
            </a>
          </div>
        )}
        {formError && formError !== 'submit_failed' && <div className="form-feedback error">{formError}</div>}
        {isSubmitted && (
          <div className="form-feedback success">
            Заявка отправлена, с вами свяжемся в ближайшее время, чтобы подтвердить запись.
          </div>
        )}
        {false && isSubmitted && (
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
          <div className="hero-aurora" aria-hidden="true">
            <div className="aurora-blob aurora-blob-1"></div>
            <div className="aurora-blob aurora-blob-2"></div>
            <div className="aurora-blob aurora-blob-3"></div>
          </div>
          <div className="hero-lines" aria-hidden="true"></div>
          <div className="hero-overlay" aria-hidden="true"></div>

          <div className="hero-media hero-media-enter delay-2">
            <div className="hero-media-frame">
              <img src="/b.png" alt="Барбер за работой" />
            </div>
            <div className="hero-monogram" aria-hidden="true">
              N
            </div>
          </div>

          <div className="hero-copy">
            <div className="hero-copy-main">
              <p className="hero-floating-label fade-up delay-1">BARBER • BISHKEK</p>

              <h1 className="hero-title fade-up delay-3">
                <span>Nur</span>
                <span>Barber</span>
              </h1>

              <div className="hero-divider fade-up delay-4" aria-hidden="true"></div>

              <p className="hero-subtitle fade-up delay-4">
                Парикмахер-стилист с вниманием к форме, текстуре и деталям.
              </p>
            </div>

            <div className="hero-service-line fade-up delay-4" aria-label="Skills">
              <span className="hero-service-line-segment" aria-hidden="true"></span>
              <div className="hero-service-buttons">
                <span className="hero-service-line-chip">Fade</span>
                <span className="hero-service-line-chip">Crop</span>
                <span className="hero-service-line-chip">Texture</span>
                <span className="hero-service-line-chip">Styling</span>
              </div>
              <span className="hero-service-line-segment" aria-hidden="true"></span>
            </div>

            <div className="hero-bottom fade-up delay-5">
              <div className="hero-footer">
                <div className="hero-meta">
                  <span className="hero-location">Бишкек, Кыргызстан</span>
                  <span className="hero-status-badge">
                    <span className="hero-status-dot"></span>
                    Открыта запись
                  </span>
                </div>
              </div>

              <div className="hero-actions">
                <div className="hero-socials">
                  <a href={WHATSAPP_URL} className="hero-social-btn" aria-label="WhatsApp" target="_blank" rel="noreferrer">
                    <span>WhatsApp</span>
                  </a>
                  <a href={INSTAGRAM_URL} className="hero-social-btn" aria-label="Instagram" target="_blank" rel="noreferrer">
                    <span>Instagram</span>
                  </a>
                </div>

                <a className="hero-cta" href="#services">
                  Записаться
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="content-shell">
        <section className="section-block services-section" id="services">
          <div className="section-heading services-heading" data-reveal style={{ '--reveal-order': 0 }}>
            <p className="section-kicker">Услуги</p>
            <h2 className="services-title">Записать на услуги можно здесь</h2>
            <p className="section-note services-note">
              Нажми на услуги и отправь заявку на запись
            </p>
          </div>

          <div className="services-grid">
            {serviceRows.map((row, rowIndex) => {
              const rowHasSelected = row.some((service) => service.name === selectedService?.name)

              return (
                <div key={`services-row-${rowIndex}`} className="services-row-block">
                  <div className="services-row">
                    {row.map((service, index) => {
                      const isSelected = selectedService?.name === service.name

                      return (
                        <div key={service.name} className={`service-item ${isSelected ? 'selected' : ''}`}>
                          <article
                            className={`service-card ${isSelected ? 'selected' : ''}`}
                            data-reveal
                            style={{
                              '--service-image': `url(${service.image})`,
                              '--reveal-order': rowIndex * 2 + index + 1
                            }}
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
          <div className="section-heading portfolio-heading" data-reveal style={{ '--reveal-order': 0 }}>
            <p className="section-kicker">Портфолио</p>
            <h2>Мои работы можно посмотреть здесь</h2>
          </div>

          <div className="portfolio-grid">
            {portfolioItems.map((item, index) => (
              <article
                key={item.title}
                className="portfolio-card"
                data-reveal
                style={{ '--reveal-order': index + 1 }}
              >
                <img src={item.image} alt={item.title} />
                <div className="portfolio-caption">
                  <span>{item.title}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-shell">
          <div className="footer-brand">
            <span className="footer-brand-name">
              <span>Nur</span>
              <span>Barber</span>
            </span>
          </div>

          <div className="footer-actions">
            <a href={WHATSAPP_URL} className="hero-social-btn footer-social-btn" aria-label="WhatsApp" target="_blank" rel="noreferrer">
              <span>WhatsApp</span>
            </a>
            <a href={INSTAGRAM_URL} className="hero-social-btn footer-social-btn" aria-label="Instagram" target="_blank" rel="noreferrer">
              <span>Instagram</span>
            </a>
            <a className="hero-cta footer-cta" href="#services">
              Записаться
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BarberProfile
