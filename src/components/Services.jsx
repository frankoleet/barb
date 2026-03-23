import './Services.css'

const servicesData = [
  {
    id: 1,
    icon: '✂️',
    title: 'Мужская стрижка',
    description: 'Классическая или современная стрижка с индивидуальным подбором формы под ваш тип лица и стиль.',
    duration: '45 мин',
    price: '1200₽'
  },
  {
    id: 2,
    icon: '🌊',
    title: 'Биозавивка',
    description: 'Долговременная укладка волос с использованием безопасных биологических составов.',
    duration: '90 мин',
    price: '3500₽'
  },
  {
    id: 3,
    icon: '👶',
    title: 'Детская стрижка',
    description: 'Стрижка для мальчиков до 12 лет в комфортной и дружелюбной атмосфере.',
    duration: '30 мин',
    price: '700₽'
  },
  {
    id: 4,
    icon: '🎨',
    title: 'Камуфляж седины',
    description: 'Профессиональное окрашивание для естественной маскировки седых волос.',
    duration: '40 мин',
    price: '1500₽'
  }
]

function Services({ onBooking }) {
  return (
    <section className="services" id="services">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">
            Мои <span className="neon-text">услуги</span>
          </h2>
          <p className="services-description">
            Каждая стрижка — это индивидуальный подход и внимание к деталям
          </p>
        </div>
        
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div 
              key={service.id} 
              className="service-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-info">
                <span className="service-duration">⏱️ {service.duration}</span>
              </div>
              <div className="service-footer">
                <span className="service-price">{service.price}</span>
                <button 
                  className="btn-book"
                  onClick={() => onBooking(service)}
                >
                  Записаться
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="contact-section" id="contact">
          <div className="contact-card">
            <h3>Свяжитесь со мной</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>г. Москва, ул. Примерная, 123</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕐</span>
                <span>Пн-Вс: 09:00 - 21:00</span>
              </div>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Instagram">📷 Instagram</a>
              <a href="#" aria-label="Telegram">✈️ Telegram</a>
              <a href="#" aria-label="WhatsApp">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
