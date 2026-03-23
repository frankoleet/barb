import './Header.css'

function Header({ onBookClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon">✂️</span>
          <span className="logo-text">Ваш <span className="neon-text">Барбер</span></span>
        </div>
        
        <nav className="nav">
          <a href="#services">Мои услуги</a>
          <a href="#about">Обо мне</a>
          <a href="#contact">Контакты</a>
        </nav>
        
        <button className="btn-primary" onClick={onBookClick}>
          Записаться ко мне
        </button>
      </div>
    </header>
  )
}

export default Header
