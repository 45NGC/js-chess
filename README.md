# 🧠 Ajedrez con JavaScript ♟️

Este proyecto de ajedrez en JavaScript implementa casi todas las reglas oficiales del juego, permitiendo partidas locales entre dos jugadores en un mismo dispositivo.

Mecánicas implementadas :

- Validación de movimientos legales
- Control de turnos
- Jaques y jaque mate
- Enroque (corto y largo)
- Promoción de peones
- Captura al paso
- Empate por ahogamiento

Mecánicas que faltaria implementar para que el proyecto cumpliese con todas las normativas oficiales :

- Empate por repetición de movimientos
- Empate por falta de material
- Empate por jaque perpetuo
- Empate por regla de los 50
- Empate por acuerdo de los jugadores


## 🚀 ¿Cómo funciona?

El proyecto está hecho en JavaScript puro y se ejecuta directamente en el navegador. No requiere librerías externas para su funcionamiento.

Se renderiza un tablero de ajedrez interactivo en HTML/CSS. Al seleccionar una pieza, se destacan sus movimientos legales. El motor de reglas valida cada jugada y actualiza el estado del juego en consecuencia.

## 📁 Estructura del Proyecto

- `index.html`: Contiene el tablero y los elementos principales de la interfaz.
- `main.js`: Contiene los metodos de los botones (empezar partida, reiniciar, rotar tablero...)
- `game.js`: Gestiona la lógica principal de la partida (el estado del tablero, los turnos, las interacciones del usuario...)
- `pieces.js`: Definición de las piezas y sus movimientos legales.


## 🧪 Estado del proyecto

✅ Mecánicas implementadas:
- [x] Movimiento de piezas
- [x] Jaque y jaque mate
- [x] Enroque
- [x] Captura al paso
- [x] Promoción de peón
- [x] Empate por ahogamiento
- [x] Validación de jugadas legales
- [x] Turnos automáticos
- [x] Interfaz visual interactiva

🚧 Futuras implementaciones:
- [ ] Las reglas oficiales que faltan mencionadas anteriormente
- [ ] Modo multijugador
- [ ] Temporizador de partidas
- [ ] IA para jugar contra la máquina

## 🛠️ Tecnologías usadas

- JavaScript (sin frameworks)
- HTML5
- CSS3

