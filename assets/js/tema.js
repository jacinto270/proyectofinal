/*
 * tema.js — Modo oscuro, menú móvil y año del pie (común a todas las páginas)
 *
 * Se carga en el <head> para aplicar el tema guardado ANTES de pintar la
 * página (así no hay parpadeo). El resto se conecta al cargar el HTML.
 */
(function () {
  const raiz = document.documentElement;
  const CLAVE = 'club:tema';

  // 1. Aplicar el tema guardado (si el usuario eligió uno)
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === 'oscuro' || guardado === 'claro') raiz.dataset.tema = guardado;
  } catch {
    // localStorage no disponible: se usa el tema del sistema
  }

  /** Devuelve "oscuro" o "claro" según lo elegido o, si no, según el sistema. */
  function temaActual() {
    if (raiz.dataset.tema) return raiz.dataset.tema;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  }

  /** Cambia el icono y la etiqueta del botón según el tema activo. */
  function actualizarBoton(boton) {
    const oscuro = temaActual() === 'oscuro';
    boton.innerHTML = oscuro
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    boton.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
    boton.setAttribute('aria-pressed', String(oscuro));
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 2. Botón de modo oscuro
    const botonTema = document.querySelector('#boton-tema');
    if (botonTema) {
      actualizarBoton(botonTema);
      botonTema.addEventListener('click', () => {
        const nuevo = temaActual() === 'oscuro' ? 'claro' : 'oscuro';
        raiz.dataset.tema = nuevo;
        try { localStorage.setItem(CLAVE, nuevo); } catch { /* sin guardar */ }
        actualizarBoton(botonTema);
      });
    }

    // 3. Menú hamburguesa en móvil
    const botonMenu = document.querySelector('#boton-menu');
    const menu = document.querySelector('#menu');
    if (botonMenu && menu) {
      botonMenu.addEventListener('click', () => {
        const abierto = menu.classList.toggle('abierto');
        botonMenu.setAttribute('aria-expanded', String(abierto));
        botonMenu.innerHTML = abierto
          ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
          : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      });
      // Cerrar al elegir un enlace
      menu.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', () => {
          menu.classList.remove('abierto');
          botonMenu.setAttribute('aria-expanded', 'false');
          botonMenu.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        });
      });
    }

    // 4. Año actual en el pie
    const anio = document.querySelector('#anio');
    if (anio) anio.textContent = new Date().getFullYear();
  });
})();
