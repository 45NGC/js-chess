# 🌍 Language / Idioma

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/45NGC/js-chess/blob/main/README_en.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/45NGC/js-chess/blob/main/README_es.md)

---

# 🧠 Chess with JavaScript ♟️

This JavaScript chess project implements almost all the official rules of the game, allowing local matches between two players on the same device.

**Implemented mechanics:**

- Legal move validation  
- Turn-based play  
- Check and checkmate  
- Castling (kingside and queenside)  
- Pawn promotion  
- En passant captures  
- Stalemate  
- Game timer

**Mechanics yet to be implemented to fully comply with official chess rules:**

- Draw by threefold repetition  
- Draw by insufficient material  
- Draw by perpetual check  
- Draw by the 50-move rule  
- Draw by mutual agreement

---

## 🚀 How does it work?

The project is built with plain JavaScript and runs directly in the browser. No external libraries are required.

An interactive chessboard is rendered using HTML and CSS. When a piece is selected, its legal moves are highlighted. The rule engine validates each move and updates the game state accordingly.

The timer tracks each player’s remaining time, switching automatically after every turn and stopping when the game ends or when a player runs out of time.

---

## 📁 Project Structure

- `index.html`: Contains the chessboard and main UI elements  
- `main.js`: Handles button actions (start game, restart, rotate board...)  
- `game.js`: Manages the core game logic (board state, turns, user interactions...)  
- `pieces.js`: Defines the pieces and their legal movements

---

## 🧪 Project Status

✅ **Implemented mechanics:**
- [x] Piece movement  
- [x] Check and checkmate  
- [x] Castling  
- [x] En passant  
- [x] Pawn promotion  
- [x] Stalemate  
- [x] Legal move validation  
- [x] Automatic turns  
- [x] Interactive visual interface  
- [x] **Game timer**

🚧 **Future implementations:**
- [ ] Remaining official rules mentioned above  
- [ ] Multiplayer mode  
- [ ] AI to play against the computer  

---

## 🛠️ Technologies used

- JavaScript (no frameworks)  
- HTML5  
- CSS3
