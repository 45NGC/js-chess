# 🌍 Language / Idioma

- [English](README_en.md)
- [Español](README_es.md)

---

# 🧠 Ajedrez con JavaScript ♟️

Este proyecto de ajedrez en JavaScript implementa casi todas las reglas oficiales del juego, permitiendo partidas locales entre dos jugadores en el mismo dispositivo.

**Mecánicas implementadas:**

- Validación de movimientos legales  
- Juego por turnos  
- Jaque y jaque mate  
- Enroque (de rey y de reina)  
- Promoción de peones  
- Capturas en passant  
- Ahogado  
- Temporizador de juego

**Mecánicas que aún no se han implementado para cumplir completamente con las reglas oficiales del ajedrez:**

- Empate por repetición de movimientos 
- Empate por material insuficiente  
- Empate por jaque perpetuo  
- Empate por la regla de los 50 movimientos  
- Empate por acuerdo mutuo

---

## 🚀 ¿Cómo funciona?

El proyecto está construido con JavaScript puro y se ejecuta directamente en el navegador. No se requieren bibliotecas externas.

Se renderiza un tablero de ajedrez interactivo utilizando HTML y CSS. Cuando se selecciona una pieza, sus movimientos legales se resaltan. El motor de reglas valida cada movimiento y actualiza el estado del juego en consecuencia.

El temporizador realiza un seguimiento del tiempo restante de cada jugador, cambiando automáticamente después de cada turno y deteniéndose cuando el juego termina o cuando un jugador se queda sin tiempo.

---

## 📁 Estructura del proyecto

- `index.html`: Contiene el tablero de ajedrez y los elementos principales de la interfaz de usuario  
- `main.js`: Maneja las acciones de los botones (empezar juego, reiniciar, rotar tablero...)  
- `game.js`: Gestiona la lógica central del juego (estado del tablero, turnos, interacciones del usuario...)  
- `pieces.js`: Define las piezas y sus movimientos legales

---

## 🧪 Estado del proyecto

✅ **Mecánicas implementadas:**
- [x] Movimiento de piezas  
- [x] Jaque y jaque mate  
- [x] Enroque  
- [x] Capturas en passant  
- [x] Promoción de peones  
- [x] Ahogado  
- [x] Validación de movimientos legales  
- [x] Turnos automáticos  
- [x] Interfaz visual interactiva  
- [x] Temporizador de juego

🚧 **Implementaciones futuras:**
- [ ] Reglas oficiales restantes mencionadas arriba  
- [ ] Modo multijugador  
- [ ] IA para jugar contra la computadora  

---

## 🛠️ Tecnologías utilizadas

- JavaScript (sin frameworks)  
- HTML5  
- CSS3
