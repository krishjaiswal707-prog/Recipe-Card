/**
 * Gourmet Chocolate Lava Cake Recipe - Interactive Interactivity JS
 * Vanilla JavaScript (No frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // DOM REFERENCES
  // ==========================================================================
  
  // Collapsible elements
  const toggleIngredientsBtn = document.getElementById('toggle-ingredients-btn');
  const ingredientsContent = document.getElementById('ingredients-content');
  const chevronIcon = document.getElementById('ingredients-chevron');
  const checkedCountBadge = document.getElementById('ingredients-checked-count');
  
  // Cooking wizard elements
  const startCookingBtn = document.getElementById('start-cooking-btn');
  const prevStepBtn = document.getElementById('prev-step-btn');
  const nextStepBtn = document.getElementById('next-step-btn');
  const exitCookingBtn = document.getElementById('exit-cooking-btn');
  const wizardControls = document.getElementById('wizard-controls');
  const congratsOverlay = document.getElementById('congrats-overlay');
  const congratsCloseBtn = document.getElementById('congrats-close-btn');
  
  // Progress & Stepper elements
  const progressBar = document.getElementById('cooking-progress-bar');
  const progressText = document.getElementById('progress-text');
  const progressPercentText = document.getElementById('progress-percent-text');
  
  // Servings Stepper elements
  const decServingsBtn = document.getElementById('servings-dec');
  const incServingsBtn = document.getElementById('servings-inc');
  const servingsCountEl = document.getElementById('servings-count');
  
  // Timer Widget elements
  const timerTimeDisplay = document.getElementById('timer-time');
  const timerPlayPauseBtn = document.getElementById('timer-play-pause-btn');
  const timerResetBtn = document.getElementById('timer-reset-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  
  // Collections
  const checkboxes = document.querySelectorAll('.ingredient-checkbox');
  const qtyElements = document.querySelectorAll('.qty');
  const stepCards = document.querySelectorAll('.step-item');
  
  // Global Actions
  const themeToggle = document.getElementById('theme-toggle');
  const printBtn = document.getElementById('print-btn');
  const htmlElement = document.documentElement;

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let currentStepIndex = 0; // 0 means cooking has not started; steps are 1 to 6
  const totalSteps = stepCards.length;
  
  // Servings Stepper
  let currentServings = 4;
  const baseServings = 4;
  
  // Countdown Timer State (15 mins prep time = 900 seconds)
  let timerInterval = null;
  const timerDurationSeconds = 900;
  let timerRemainingSeconds = 900;
  let isTimerRunning = false;

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  updateProgressBar();
  updateChecklistCount();
  
  // Set default theme from localStorage or default to light warm bakery style
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-theme', savedTheme);
  createParticles(); // Initialize background bokeh particles
  setup3DTilt();     // Initialize 3D hover effect

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================
  
  // Global actions
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    createParticles(); // Re-trigger colored particles matching the theme
  });
  
  printBtn.addEventListener('click', () => {
    window.print();
  });
  
  // Ingredients checklist toggle
  toggleIngredientsBtn.addEventListener('click', toggleIngredients);
  
  // Checklist item changes
  checkboxes.forEach(box => {
    box.addEventListener('change', (e) => {
      const labelText = e.target.closest('.ingredient-checkbox-label');
      if (e.target.checked) {
        labelText.classList.add('checked');
      } else {
        labelText.classList.remove('checked');
      }
      updateChecklistCount();
    });
  });
  
  // Servings controls
  decServingsBtn.addEventListener('click', () => {
    if (currentServings > 1) {
      updateServings(currentServings - 1);
    }
  });
  
  incServingsBtn.addEventListener('click', () => {
    if (currentServings < 24) {
      updateServings(currentServings + 1);
    }
  });

  // Cooking stepper controls
  startCookingBtn.addEventListener('click', startCooking);
  prevStepBtn.addEventListener('click', prevStep);
  nextStepBtn.addEventListener('click', nextStep);
  exitCookingBtn.addEventListener('click', stopCooking);
  
  // Congrats modal controls
  congratsCloseBtn.addEventListener('click', () => {
    congratsOverlay.classList.add('hidden');
    stopCooking();
  });
  
  // Timer buttons
  timerPlayPauseBtn.addEventListener('click', () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });
  
  timerResetBtn.addEventListener('click', resetTimer);

  // ==========================================================================
  // FUNCTIONS
  // ==========================================================================
  
  /**
   * Toggles the collapsed/expanded state of the ingredients panel
   */
  function toggleIngredients() {
    const isExpanded = toggleIngredientsBtn.getAttribute('aria-expanded') === 'true';
    toggleIngredientsBtn.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
      ingredientsContent.classList.remove('expanded');
      toggleIngredientsBtn.querySelector('.btn-text').textContent = 'Show Ingredients';
      chevronIcon.style.transform = 'rotate(0deg)';
    } else {
      ingredientsContent.classList.add('expanded');
      toggleIngredientsBtn.querySelector('.btn-text').textContent = 'Hide Ingredients';
      chevronIcon.style.transform = 'rotate(180deg)';
    }
  }

  /**
   * Updates checked items counter text
   */
  function updateChecklistCount() {
    const checkedCount = document.querySelectorAll('.ingredient-checkbox:checked').length;
    checkedCountBadge.textContent = `${checkedCount} / ${checkboxes.length} gathered`;
  }
  
  /**
   * Scales ingredient quantities relative to Servings size
   */
  function updateServings(newServings) {
    currentServings = newServings;
    servingsCountEl.textContent = currentServings;
    
    const factor = currentServings / baseServings;
    
    qtyElements.forEach(el => {
      const baseVal = parseFloat(el.getAttribute('data-base'));
      if (!isNaN(baseVal)) {
        el.textContent = formatQuantity(baseVal * factor);
      }
    });
  }
  
  /**
   * Formats numbers nicely as fractions or single-decimal values
   */
  function formatQuantity(val) {
    if (val <= 0) return '0';
    if (Math.abs(val - 0.125) < 0.001) return '1/8';
    if (Math.abs(val - 0.25) < 0.001) return '1/4';
    if (Math.abs(val - 0.375) < 0.001) return '3/8';
    if (Math.abs(val - 0.5) < 0.001) return '1/2';
    if (Math.abs(val - 0.625) < 0.001) return '5/8';
    if (Math.abs(val - 0.75) < 0.001) return '3/4';
    if (Math.abs(val - 0.875) < 0.001) return '7/8';
    
    const intPart = Math.floor(val);
    const decPart = val - intPart;
    if (decPart === 0) return intPart.toString();
    
    if (Math.abs(decPart - 0.125) < 0.01) return (intPart > 0 ? intPart + ' ' : '') + '1/8';
    if (Math.abs(decPart - 0.25) < 0.01) return (intPart > 0 ? intPart + ' ' : '') + '1/4';
    if (Math.abs(decPart - 0.375) < 0.01) return (intPart > 0 ? intPart + ' ' : '') + '3/8';
    if (Math.abs(decPart - 0.5) < 0.01) return (intPart > 0 ? intPart + ' ' : '') + '1/2';
    if (Math.abs(decPart - 0.625) < 0.01) return (intPart > 0 ? intPart + ' ' : '') + '5/8';
    if (Math.abs(decPart - 0.75) < 0.01) return (intPart > 0 ? intPart + ' ' : '') + '3/4';
    if (Math.abs(decPart - 0.875) < 0.01) return (intPart > 0 ? intPart + ' ' : '') + '7/8';
    
    return val.toFixed(1);
  }

  /**
   * Starts the cooking guide workflow
   */
  function startCooking() {
    currentStepIndex = 1;
    document.body.classList.add('cooking-active');
    
    // Hide Start button, reveal stepper navigation controls
    startCookingBtn.classList.add('hidden');
    wizardControls.classList.remove('hidden');
    exitCookingBtn.classList.remove('hidden');
    
    // Ensure instructions details panel is fully expanded
    const instructionsContent = document.getElementById('instructions-content');
    if (!instructionsContent.classList.contains('expanded')) {
      instructionsContent.classList.add('expanded');
    }
    
    // Update stepper styling and active step
    updateStepHighlight();
    updateProgressBar();
    
    // Trigger and auto-play prep timer
    startTimer();
    
    // Scroll active cooking widget panel into view
    document.getElementById('cooking-wizard-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Exits active cooking stepper flow
   */
  function stopCooking() {
    currentStepIndex = 0;
    document.body.classList.remove('cooking-active');
    
    startCookingBtn.classList.remove('hidden');
    wizardControls.classList.add('hidden');
    exitCookingBtn.classList.add('hidden');
    
    stepCards.forEach(card => {
      card.classList.remove('active');
      card.classList.remove('completed');
    });
    
    updateProgressBar();
    pauseTimer();
    resetTimer();
    
    document.querySelector('.hero-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Progresses forward one step
   */
  function nextStep() {
    if (currentStepIndex < totalSteps) {
      currentStepIndex++;
      updateStepHighlight();
      updateProgressBar();
    } else {
      // Completed last step! Trigger congrats modal overlay
      congratsOverlay.classList.remove('hidden');
      congratsCloseBtn.focus();
    }
  }

  /**
   * Navigates backward one step
   */
  function prevStep() {
    if (currentStepIndex > 1) {
      currentStepIndex--;
      updateStepHighlight();
      updateProgressBar();
    }
  }

  /**
   * Refreshes progress bar percentage and fills width
   */
  function updateProgressBar() {
    if (currentStepIndex === 0) {
      progressBar.style.width = '0%';
      progressPercentText.textContent = '0%';
      progressText.textContent = 'Cooking wizard inactive';
      return;
    }
    
    const percentage = Math.round((currentStepIndex / totalSteps) * 100);
    progressBar.style.width = `${percentage}%`;
    progressPercentText.textContent = `${percentage}%`;
    progressText.textContent = `Step ${currentStepIndex} of ${totalSteps}`;
  }

  /**
   * Highlights current active instruction step card and dims others
   */
  function updateStepHighlight() {
    stepCards.forEach((card, index) => {
      const stepNum = index + 1;
      card.classList.remove('active');
      card.classList.remove('completed');
      
      if (stepNum < currentStepIndex) {
        card.classList.add('completed');
      } else if (stepNum === currentStepIndex) {
        card.classList.add('active');
        // Auto scroll step into center of viewport
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    // Set button labels based on index limits
    prevStepBtn.disabled = currentStepIndex === 1;
    
    if (currentStepIndex === totalSteps) {
      nextStepBtn.innerHTML = `Finish
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
      nextStepBtn.innerHTML = `Next Step
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    }
  }

  // ==========================================================================
  // COOKING TIMER COUNTDOWN LOOP
  // ==========================================================================
  
  /**
   * Ticks down the countdown timer interval
   */
  function startTimer() {
    if (isTimerRunning) return;
    
    isTimerRunning = true;
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    
    timerInterval = setInterval(() => {
      if (timerRemainingSeconds > 0) {
        timerRemainingSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        handleTimerExpiry();
      }
    }, 1000);
  }

  /**
   * Pauses the active timer interval
   */
  function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  }

  /**
   * Resets timer back to full prep length (15:00)
   */
  function resetTimer() {
    pauseTimer();
    timerRemainingSeconds = timerDurationSeconds;
    updateTimerDisplay();
    document.querySelector('.timer-wrapper').classList.remove('expired');
  }

  /**
   * Standardizes remaining seconds to MM:SS format
   */
  function updateTimerDisplay() {
    const minutes = Math.floor(timerRemainingSeconds / 60);
    const seconds = timerRemainingSeconds % 60;
    
    const displayMins = String(minutes).padStart(2, '0');
    const displaySecs = String(seconds).padStart(2, '0');
    
    timerTimeDisplay.textContent = `${displayMins}:${displaySecs}`;
  }

  /**
   * Action trigger when timer hits 0
   */
  function handleTimerExpiry() {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    
    // Play alert sound if audio node exists
    const alertSound = document.getElementById('timer-alert');
    if (alertSound) {
      alertSound.play().catch(e => console.log('Audio playback blocked by browser', e));
    }
    
    // Visual alert state (add pulsing outline)
    const timerWidget = document.querySelector('.timer-wrapper');
    timerWidget.classList.add('expired');
  }

  /**
   * Generates floating background bokeh particles matching current theme colors
   */
  function createParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const colors = {
      light: ['#c6941a', '#e8cfa6', '#ebd4bc', '#b38b7e'],
      dark: ['#d4af37', '#801c27', '#8c6a25', '#4a0d15']
    };
    
    const themeColors = colors[currentTheme] || colors.light;
    const particleCount = 18;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.floor(Math.random() * 45) + 15;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}vw`;
      
      const delay = Math.random() * 20;
      const duration = Math.random() * 15 + 15;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      const randomColor = themeColors[Math.floor(Math.random() * themeColors.length)];
      particle.style.setProperty('--particle-color', randomColor);
      
      const opacity = Math.random() * 0.12 + 0.05;
      particle.style.setProperty('--particle-opacity', opacity);
      
      container.appendChild(particle);
    }
  }

  /**
   * Initializes 3D hover mouse move tilt effect
   */
  function setup3DTilt() {
    const card = document.querySelector('.recipe-card-container');
    if (!card) return;
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation degree (max 3 degrees)
      const rotateX = -(y - centerY) / 38;
      const rotateY = (x - centerX) / 38;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

});
