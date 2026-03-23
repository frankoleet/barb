import './Hero.css'

function Hero({ onBookClick }) {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">Профессиональный барбер</div>
        <h1 className="hero-title">
          Создаю <span className="neon-text">идеальный</span> образ
        </h1>
        <p className="hero-subtitle">
          Индивидуальный подход к каждому клиенту • Более 5 лет опыта
        </p>
        <button className="btn-hero" onClick={onBookClick}>
          Записаться на стрижку
        </button>
        
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Довольных клиентов</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5+</div>
            <div className="stat-label">Лет опыта</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Качество работы</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
