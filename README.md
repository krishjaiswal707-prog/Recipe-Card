# 🍰 Gourmet Molten Chocolate Lava Cake - Interactive Recipe Card

A premium, highly interactive, and fully responsive recipe card for a gourmet **Molten Chocolate Lava Cake**, built from scratch using vanilla **HTML5**, **CSS3**, and **JavaScript** (no external libraries or frameworks). 

This project was designed with modern web aesthetics in mind, incorporating glassmorphism, fluid animations, custom typography, and dynamic interactive cooking utilities.

---

## ✨ Features

### 1. 📱 Fully Responsive Layout
- Designed mobile-first and optimized for **Desktop**, **Tablet**, and **Mobile** viewports.
- Responsive breakpoints stack elements vertically on smaller displays and convert action bar buttons into icon-only modes to prevent menu wrapping.

### 2. 🍯 Interactive Ingredients Checklist
- Users can check off ingredients as they gather them.
- Checking off an item triggers a custom SVG-like line-draw animation striking through the text and dimming its opacity, accompanied by real-time text status badges (e.g., `3 / 8 gathered`).

### 3. 👥 Servings Stepper Calculator
- Includes an interactive `-` and `+` servings adjuster.
- Dynamically scales ingredient quantities in real-time.
- Features a custom fractional formatting utility that renders scaled quantities as clean fractions (like `1/8`, `1/4`, `1/2`, `3/4`) instead of raw decimals.

### 4. 🍳 Step-by-Step Cooking Wizard
- Clicking "Start Cooking" triggers an interactive cooking guide.
- Highlights the current active card with a warm caramel glow, dims other steps, and automatically scrolls the active step card into the center of the viewport.
- Displays a horizontal progress bar that fills dynamically with a smooth ease transition.
- Unlocking the final step changes the navigation control to "Finish," which launches a celebratory congrats modal when clicked.

### 5. ⏱️ Integrated Countdown Timer
- Starts a 15-minute countdown clock (matching the recipe's total prep time) when the user begins cooking.
- Features play, pause, and reset actions.
- Triggers an audio warning chime and pulses red when the timer reaches zero.

### 6. 🎨 Fluid Mesh Gradient Background
- Features a fascinating backdrop utilizing slow, organic floating gradient blobs (`floatBlob1` and `floatBlob2` keyframes) that drift behind the card, creating a modern glassmorphic look.
- Supports theme-switching: defaults to a warm bakery cream palette, and shifts to a rich chocolate-raspberry dark mode.

### 7. 🖨️ Ink-Saving Print Stylesheet
- Built with a print media query (`@media print`) that automatically formats the recipe card for paper printing.
- Hides interactive buttons, active timers, step wizards, and background colors.
- Renders ingredients and instructions in crisp high-contrast black text on a clean white background.

---

## 📂 File Structure

```
Recipe-Card/
├── assets/
│   └── lava-cake.png    # High-quality premium dish photography
├── index.html           # Semantic HTML5 layout structure
├── style.css            # Responsive grids, transitions, and keyframe animations
├── script.js            # Core interactive logic (timer, stepper, calculator)
└── README.md            # Project documentation
```

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags (`<main>`, `<header>`, `<section>`, `<footer>`, `<time>`) and ARIA accessibility properties.
- **CSS3**: CSS Custom Variables, Flexbox, CSS Grid, `@keyframes` animations, transitions, and print media rules.
- **JavaScript (ES6)**: Vanilla DOM querying, event listeners, state tracking, and countdown intervals.

---

## 🚀 How to Run Locally

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/krishjaiswal707-prog/Recipe-Card.git
   ```
2. Navigate into the project folder:
   ```bash
   cd Recipe-Card
   ```
3. Open `index.html` directly in your default web browser, or serve it using a lightweight local server:
   - **Python**: `python -m http.server 8080` (then navigate to `http://localhost:8080`)
   - **NodeJS/npx**: `npx http-server -p 8080`
