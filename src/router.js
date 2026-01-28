class Router {
  constructor() {
    this.routes = {
      home: document.getElementById('home'),
      text: document.getElementById('text'),
      light: document.getElementById('light'),
      shadows: document.getElementById('shadows'),
      house: document.getElementById('house'),
      particles: document.getElementById('particles'),
      galaxy: document.getElementById('galaxy'),
      physics: document.getElementById('physics'),
      raycaster: document.getElementById('raycaster')
    }
    this.navLinks = document.querySelectorAll('.nav-link')
    this.currentRoute = null
    this.init()
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute())
    window.addEventListener('load', () => this.handleRoute())
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home'
    this.navigate(hash)
  }

  navigate(route) {
    if (!this.routes[route]) {
      route = 'home'
    }
    this.currentRoute = route

    Object.keys(this.routes).forEach((key) => {
      const page = this.routes[key]
      if (key === route) {
        page.classList.add('active')
      } else {
        page.classList.remove('active')
      }
    })

    this.updateNavLinks(route)
    window.location.hash = route
  }

  updateNavLinks(route) {
    this.navLinks.forEach((link) => {
      const linkRoute = link.getAttribute('data-route')
      if (linkRoute === route) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  }

  getCurrentRoute() {
    return this.currentRoute
  }
}

export default Router
