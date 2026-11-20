import { useState } from 'react'

type IconName = 'grid' | 'trophy' | 'users' | 'calendar' | 'chart' | 'settings' | 'help' | 'search' | 'bell' | 'plus' | 'arrow' | 'chevron' | 'clock' | 'location' | 'more' | 'tennis' | 'menu' | 'close'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const shapes: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.2.1a8 8 0 0 1-1.5.9l-.2.1-.3 1.8h-2.8l-.3-1.8-.2-.1a8 8 0 0 1-1.5-.9l-.2-.1-1.7.7-1.4-2.4 1.4-1.1.1-.2a8 8 0 0 1 0-1.8l-.1-.2-1.4-1.1 1.4-2.4 1.7.7.2-.1a8 8 0 0 1 1.5-.9l.2-.1.3-1.8h2.8l.3 1.8.2.1a8 8 0 0 1 1.5.9l.2.1 1.7-.7 1.4 2.4-1.4 1.1-.1.2a8 8 0 0 1 0 1.8Z"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.6 1.3c-.8 1.1-2.2 1.3-2.2 3M12 17h.01"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    tennis: <><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6c4 1.3 6.1 4.4 6.4 6.4s-1.4 5.1-4 6.6M18.4 5.6c-4 1.3-6.1 4.4-6.4 6.4s1.4 5.1 4 6.6"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  }
  return <svg {...common}>{shapes[name]}</svg>
}

const navMain: { label: string; icon: IconName }[] = [
  { label: 'Resumen', icon: 'grid' }, { label: 'Torneos', icon: 'trophy' },
  { label: 'Jugadores', icon: 'users' }, { label: 'Calendario', icon: 'calendar' },
  { label: 'Rankings', icon: 'chart' },
]

const events = [
  { title: 'Copa Setpoint · Otoño', category: 'PÁDEL · 4 CATEGORÍAS', date: '12 — 14 JUN', venue: 'Club La Esperanza', status: 'En curso', progress: 68, people: '48 / 64', art: 'court-one' },
  { title: 'Open de Palermo', category: 'TENIS · 2 CATEGORÍAS', date: '21 — 23 JUN', venue: 'Club Palermo', status: 'Inscripciones', progress: 42, people: '26 / 48', art: 'court-two' },
  { title: 'Americano Nocturno', category: 'PÁDEL · OPEN', date: '28 JUN', venue: 'Setpoint Arena', status: 'Próximo', progress: 81, people: '32 / 40', art: 'court-three' },
]

const matches = [
  { time: '14:30', court: 'CANCHA 02', a: 'L. Fernández / M. Ruiz', b: 'J. Torres / F. Díaz', score: '6 — 4 · 3 — 2', state: 'En juego', color: 'live' },
  { time: '14:45', court: 'CANCHA 01', a: 'C. López / A. Gil', b: 'R. Vega / P. Ríos', score: '—', state: 'Próximo', color: '' },
  { time: '15:00', court: 'CANCHA 03', a: 'S. Molina / V. Paz', b: 'N. Acosta / I. Luna', score: '—', state: 'Próximo', color: '' },
]

function App() {
  const [active, setActive] = useState('Resumen')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const nav = (items: typeof navMain) => items.map((item) => <button key={item.label} className={`nav-item ${active === item.label ? 'selected' : ''}`} onClick={() => { setActive(item.label); setMobileMenu(false); if (item.label !== 'Resumen') setNotice(`${item.label}: módulo en preparación`) }}><Icon name={item.icon} /><span>{item.label}</span>{item.label === 'Torneos' && <span className="nav-count">3</span>}</button>)
  return <div className="app-shell">
    {mobileMenu && <button className="scrim" aria-label="Cerrar menú" onClick={() => setMobileMenu(false)} />}
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><span /><span /><span /></div><span className="brand-word">SETPOINT<span className="brand-dot">.</span></span></div>
      <button className="workspace"><span className="workspace-logo">LE</span><span className="workspace-text"><strong>La Esperanza</strong><small>Plan profesional</small></span><span className="workspace-chevron">⌄</span></button>
      <div className="nav-label">MENÚ PRINCIPAL</div><nav className="nav-list">{nav(navMain)}</nav>
      <div className="nav-label tools-label">ORGANIZACIÓN</div><nav className="nav-list">{nav([{ label: 'Configuración', icon: 'settings' }])}</nav>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-glow"/><div className="upgrade-icon"><Icon name="tennis" size={17}/></div><strong>El juego sigue.</strong><p>Todo listo para tu próximo torneo.</p><button onClick={() => setNotice('Centro de ayuda: próximamente')}>Explorar funciones <Icon name="arrow" size={14}/></button></div><button className="nav-item help-link" onClick={() => setNotice('Centro de ayuda: próximamente')}><Icon name="help"/><span>Centro de ayuda</span><Icon name="arrow" size={14}/></button><button className="profile"><span className="avatar">MG</span><span className="profile-text"><strong>Martín García</strong><small>Administrador</small></span><Icon name="more" size={18}/></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu-button" aria-label="Abrir menú" onClick={() => setMobileMenu(true)}><Icon name="menu"/></button><span className="breadcrumb-muted">La Esperanza</span><Icon name="chevron" size={14}/><span>Resumen</span></div><div className="topbar-actions"><button className="icon-button search-button" aria-label="Buscar" onClick={() => setNotice('Búsqueda: próximamente')}><Icon name="search"/></button><button className="icon-button notification-button" aria-label="Notificaciones" onClick={() => setNotice('No tenés notificaciones nuevas')}><Icon name="bell"/><i/></button><span className="top-divider"/><span className="today">Jueves, 12 de junio</span><span className="avatar small-avatar">MG</span></div></header>
      <div className="page-content">
        {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Cerrar"><Icon name="close" size={16}/></button></div>}
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> JUEVES, 12 DE JUNIO DE 2025</div><h1>El juego está <em>bajo control.</em></h1><p className="welcome-subtitle">Esto es lo que pasa hoy en La Esperanza.</p></div><button className="primary-button" onClick={() => setNotice('Creación de torneo: disponible en la siguiente etapa')}><Icon name="plus" size={19}/> Crear torneo</button></section>
        <section className="stat-grid" aria-label="Resumen de actividad">
          <article className="stat-card"><div className="stat-top"><span>TORNEOS ACTIVOS</span><span className="stat-icon lime"><Icon name="trophy" size={17}/></span></div><div className="stat-value">03 <span className="stat-trend">+1 este mes</span></div><div className="stat-foot"><span className="status-dot"/> 1 en juego <span className="foot-separator">·</span> 2 próximos</div><div className="stat-spark spark-a"><i/><i/><i/><i/><i/><i/><i/></div></article>
          <article className="stat-card"><div className="stat-top"><span>JUGADORES</span><span className="stat-icon blue"><Icon name="users" size={17}/></span></div><div className="stat-value">248 <span className="stat-trend positive">↗ 12%</span></div><div className="stat-foot">En todos tus torneos</div><div className="stat-spark spark-b"><i/><i/><i/><i/><i/><i/><i/></div></article>
          <article className="stat-card"><div className="stat-top"><span>PARTIDOS HOY</span><span className="stat-icon orange"><Icon name="calendar" size={17}/></span></div><div className="stat-value">12 <span className="stat-subvalue">/ 18</span></div><div className="stat-foot"><span className="mini-progress"><i/></span> 6 partidos pendientes</div><div className="stat-spark spark-c"><i/><i/><i/><i/><i/><i/><i/></div></article>
          <article className="stat-card"><div className="stat-top"><span>INSCRIPCIONES</span><span className="stat-icon violet"><Icon name="chart" size={17}/></span></div><div className="stat-value">24 <span className="stat-subvalue">nuevas</span></div><div className="stat-foot">En los últimos 7 días <span className="stat-trend positive">↗ 8%</span></div><div className="stat-spark spark-d"><i/><i/><i/><i/><i/><i/><i/></div></article>
        </section>
        <div className="content-grid"><section className="tournaments-section"><div className="section-heading"><div><div className="section-kicker">EN TU CLUB</div><h2>Tus torneos</h2></div><button className="text-button" onClick={() => { setActive('Torneos'); setNotice('Todos los torneos: módulo en preparación') }}>Ver todos <Icon name="arrow" size={15}/></button></div><div className="tournament-list">{events.map((event) => <article className="tournament-card" key={event.title}><div className={`event-art ${event.art}`}><span className="art-ring ring-one"/><span className="art-ring ring-two"/><span className="art-court"/><span className="art-event-mark"><Icon name="tennis" size={18}/></span><span className={`event-status ${event.status === 'En curso' ? 'on' : event.status === 'Inscripciones' ? 'open' : ''}`}><i/>{event.status}</span></div><div className="event-info"><div className="event-meta">{event.category}</div><h3>{event.title}</h3><div className="event-details"><span><Icon name="calendar" size={14}/>{event.date}</span><span><Icon name="location" size={14}/>{event.venue}</span></div><div className="event-progress-row"><div className="progress-track"><i style={{ width: `${event.progress}%` }}/></div><span>{event.people}</span></div><div className="event-bottom"><span className="event-label">INSCRIPTOS</span><button className="round-arrow" aria-label={`Ver ${event.title}`} onClick={() => setNotice(`${event.title}: detalle del torneo próximamente`)}><Icon name="arrow" size={16}/></button></div></div></article>)}</div></section>
          <aside className="right-column"><section className="live-panel"><div className="live-header"><div><div className="section-kicker"><span className="live-pulse"/> EN DIRECTO</div><h2>Hoy en cancha</h2></div><button className="icon-button subtle-button" aria-label="Más opciones" onClick={() => setNotice('Opciones de jornada: próximamente')}><Icon name="more"/></button></div><div className="live-subhead"><span>JORNADA 03</span><span>12 JUN · 2025</span></div><div className="court-list">{matches.map((match) => <article className="match-row" key={match.court}><div className="match-time">{match.time}<span>{match.court}</span></div><div className="match-teams"><strong>{match.a}</strong><span>{match.b}</span></div><div className="match-score"><strong>{match.score}</strong><span className={match.color}>{match.state}</span></div></article>)}</div><button className="command-link" onClick={() => setNotice('Centro de comando: disponible en la siguiente etapa')}>Abrir centro de comando <Icon name="arrow" size={15}/></button></section>
            <section className="attention-panel"><div className="attention-icon"><Icon name="clock" size={18}/></div><div className="attention-copy"><strong>2 partidos por confirmar</strong><span>Faltan resultados de la jornada anterior</span></div><button aria-label="Ver pendientes" onClick={() => setNotice('Resultados pendientes: módulo en preparación')}><Icon name="chevron" size={16}/></button></section>
            <section className="quick-panel"><div className="section-kicker">ACCESO RÁPIDO</div><div className="quick-links"><button onClick={() => setNotice('Carga de resultados: próximamente')}><span className="quick-icon lime"><Icon name="tennis" size={17}/></span><span>Cargar resultado</span><Icon name="chevron" size={15}/></button><button onClick={() => setNotice('Importación de jugadores: próximamente')}><span className="quick-icon blue"><Icon name="users" size={17}/></span><span>Importar jugadores</span><Icon name="chevron" size={15}/></button><button onClick={() => setNotice('Calendario: próximamente')}><span className="quick-icon orange"><Icon name="calendar" size={17}/></span><span>Ver calendario</span><Icon name="chevron" size={15}/></button></div></section></aside></div>
        <footer className="page-footer"><span>SETPOINT <b>·</b> Cada partido, bajo control.</span><span>Versión de inicio <b>0.1</b></span></footer>
      </div>
    </main>
  </div>
}

export default App
