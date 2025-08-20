// Game Controller for Café Number Rush
class GameController {
    constructor() {
        this.gameState = 'menu'; // menu, playing, paused, ended
        this.gameData = null;
        this.currentLevel = 1;
        this.score = 0;
        this.money = 0;
        this.timeRemaining = 15;
        this.currentSequence = [];
        this.targetSequence = [];
        this.nextExpectedNumber = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.gameTimer = null;
        this.totalClicks = 0;
        this.correctClicks = 0;
        this.startTime = null;
        this.autoSaveTimer = null;
        this.characterLevel = 1;
        this.productCounts = {
            coffee: 0,
            croissant: 0,
            cake: 0,
            drink: 0
        };
        
        this.setupEventListeners();
        this.loadSaveData();
    }
    
    setupEventListeners() {
        // Enhanced touch/click event handling
        document.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('number-button')) {
                const number = parseInt(e.target.textContent);
                this.clickNumber(number, e.target);
            }
        });
        
        // Touch events for mobile support
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('number-button')) {
                e.preventDefault();
                e.target.classList.add('touching');
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('number-button')) {
                e.preventDefault();
                e.target.classList.remove('touching');
                const number = parseInt(e.target.textContent);
                this.clickNumber(number, e.target);
            }
        }, { passive: false });
        
        document.addEventListener('touchcancel', (e) => {
            if (e.target.classList.contains('number-button')) {
                e.target.classList.remove('touching');
            }
        });
        
        // Prevent default touch behaviors on game area
        document.addEventListener('touchmove', (e) => {
            if (this.gameState === 'playing') {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Keyboard controls for game
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                // Number keys 1-9, 0
                const key = e.key;
                if (key >= '1' && key <= '9') {
                    const number = parseInt(key);
                    this.clickNumberByKey(number);
                } else if (key === '0') {
                    this.clickNumberByKey(10);
                }
            }
        });
    }
    
    setGameData(data) {
        this.gameData = data;
    }
    
    setUIManager(uiManager) {
        this.uiManager = uiManager;
    }
    
    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }
    
    startGame() {
        this.gameState = 'playing';
        this.currentLevel = 1;
        this.score = 0;
        this.money = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.totalClicks = 0;
        this.correctClicks = 0;
        this.characterLevel = 1;
        this.productCounts = { coffee: 0, croissant: 0, cake: 0, drink: 0 };
        this.startTime = Date.now();
        
        this.uiManager?.showScreen('game');
        this.audioManager?.playSceneAudio('main_game');
        
        this.startLevel();
        this.startAutoSave();
    }
    
    startLevel() {
        if (!this.gameData || !this.gameData.gameBalance) return;
        
        const levelData = this.gameData.gameBalance.find(
            b => parseInt(b.level) === this.currentLevel
        );
        
        if (!levelData) {
            this.endGame();
            return;
        }
        
        // Reset level state
        this.currentSequence = [];
        this.nextExpectedNumber = 1;
        this.timeRemaining = parseInt(levelData.time_limit);
        
        // Generate target sequence
        const maxNumbers = parseInt(levelData.numbers_max);
        this.targetSequence = Array.from({length: maxNumbers}, (_, i) => i + 1);
        
        // Update UI
        this.updateHUD();
        this.uiManager?.updateGameCharacter(this.characterLevel);
        this.uiManager?.updateComboDisplay(this.combo);
        
        // Generate and display numbers
        this.generateNumberGrid();
        
        // Start timer
        this.startTimer();
        
        // Show level start message (shorter, dismissible)
        this.uiManager?.showMessage(`レベル ${this.currentLevel} スタート！`, 800, true);
    }
    
    generateNumberGrid() {
        const gridElement = document.getElementById('number-grid');
        if (!gridElement) {
            console.error('Grid element not found!');
            return;
        }
        
        // Clear existing numbers
        gridElement.innerHTML = '';
        
        // Calculate grid size based on number count
        const numberCount = this.targetSequence.length;
        const gridSize = Math.ceil(Math.sqrt(numberCount));
        
        console.log(`Generating grid for ${numberCount} numbers in ${gridSize}x${gridSize} grid`);
        
        // Set CSS custom properties for grid layout
        gridElement.style.setProperty('--grid-columns', gridSize);
        gridElement.style.setProperty('--grid-rows', gridSize);
        
        // Apply grid layout directly
        gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gridElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        
        // Create positions array for n×n matrix
        const positions = [];
        for (let row = 1; row <= gridSize; row++) {
            for (let col = 1; col <= gridSize; col++) {
                if (positions.length < numberCount) {
                    positions.push({ row, col });
                }
            }
        }
        
        // Shuffle positions for random placement
        this.shuffleArray(positions);
        
        // Create number buttons with matrix positioning
        this.targetSequence.forEach((number, index) => {
            const button = document.createElement('button');
            button.className = 'number-button';
            button.textContent = number;
            button.setAttribute('data-number', number);
            
            // Enhanced touch support attributes
            button.setAttribute('touch-action', 'manipulation');
            button.style.webkitTapHighlightColor = 'transparent';
            button.style.webkitUserSelect = 'none';
            button.style.userSelect = 'none';
            
            // Set matrix position explicitly
            if (positions[index]) {
                button.style.gridColumn = positions[index].col.toString();
                button.style.gridRow = positions[index].row.toString();
                console.log(`Button ${number} placed at column ${positions[index].col}, row ${positions[index].row}`);
            } else {
                // Fallback positioning
                button.style.gridColumn = 'auto';
                button.style.gridRow = 'auto';
                console.warn(`No position found for button ${number}`);
            }
            
            // Ensure button is visible
            button.style.display = 'flex';
            button.style.visibility = 'visible';
            button.style.opacity = '1';
            
            // Add tile entrance animation with staggered delay
            button.classList.add('tile-entrance');
            button.style.animationDelay = `${index * 0.05}s`;
            
            gridElement.appendChild(button);
        });
        
        console.log(`Generated ${this.targetSequence.length} buttons in grid`);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            this.timeRemaining--;
            this.updateHUD();
            
            // Time warning (very short, auto-dismiss)
            if (this.timeRemaining <= 3 && this.timeRemaining > 0) {
                this.audioManager?.playTimeWarning();
                this.uiManager?.showMessage(`${this.timeRemaining}秒！`, 600, false);
            }
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    clickNumber(number, buttonElement) {
        if (this.gameState !== 'playing') return;
        
        this.totalClicks++;
        
        // Check if this is the expected number
        if (number === this.nextExpectedNumber) {
            this.correctClick(number, buttonElement);
        } else {
            this.incorrectClick(number, buttonElement);
        }
    }
    
    clickNumberByKey(number) {
        const button = document.querySelector(`[data-number="${number}"]`);
        if (button && !button.classList.contains('clicked')) {
            this.clickNumber(number, button);
        }
    }
    
    correctClick(number, buttonElement) {
        this.correctClicks++;
        this.currentSequence.push(number);
        this.nextExpectedNumber++;
        this.combo++;
        
        // Update button appearance
        buttonElement.classList.add('clicked');
        buttonElement.classList.add('success-pulse');
        buttonElement.disabled = true;
        
        // Play sound
        this.audioManager?.playSuccessSound();
        
        // Calculate score
        const levelData = this.gameData?.gameBalance?.find(b => parseInt(b.level) === this.currentLevel);
        const baseScore = 10;
        const timeBonus = Math.max(0, this.timeRemaining);
        const comboMultiplier = 1 + (this.combo - 1) * 0.1;
        const levelMultiplier = parseFloat(levelData?.score_multiplier || 1);
        
        const points = Math.floor(baseScore * timeBonus * comboMultiplier * levelMultiplier);
        this.score += points;
        
        // Update combo display
        this.uiManager?.updateComboDisplay(this.combo);
        
        // Show score increase
        this.showScoreIncrease(points, buttonElement);
        
        // Combo effects
        if (this.combo >= 3) {
            this.audioManager?.playComboEffect(this.combo);
            this.createComboEffect(buttonElement);
            
            // Add cascade effect to nearby tiles
            this.addCascadeEffect(buttonElement);
        }
        
        // Perfect timing bonus
        if (this.timeRemaining > this.targetSequence.length * 0.8) {
            this.audioManager?.playPerfectSound();
            buttonElement.classList.add('perfect-click');
            buttonElement.classList.add('tile-glow');
            
            // Remove glow effect after animation
            setTimeout(() => {
                buttonElement.classList.remove('tile-glow');
            }, 2000);
        }
        
        // Check level completion
        if (this.currentSequence.length === this.targetSequence.length) {
            this.levelComplete();
        }
        
        // Update progress bar
        const progress = (this.currentSequence.length / this.targetSequence.length) * 100;
        this.uiManager?.updateProgressBar(progress);
        
        this.updateHUD();
    }
    
    incorrectClick(number, buttonElement) {
        this.combo = 0;
        
        // Update button appearance
        buttonElement.classList.add('error-shake');
        
        // Play error sound
        this.audioManager?.playErrorSound();
        
        // Show error message (short, dismissible)
        this.uiManager?.showMessage('順番が違います！', 800, true);
        this.uiManager?.updateComboDisplay(0);
        
        // Penalty (small score reduction)
        this.score = Math.max(0, this.score - 5);
        this.updateHUD();
        
        // Remove animation class after animation
        setTimeout(() => {
            buttonElement.classList.remove('error-shake');
        }, 500);
    }
    
    levelComplete() {
        this.stopTimer();
        
        // Level completion bonus
        const levelData = this.gameData?.gameBalance?.find(b => parseInt(b.level) === this.currentLevel);
        const completionBonus = 50 * parseFloat(levelData?.score_multiplier || 1);
        const timeBonus = this.timeRemaining * 5;
        this.score += completionBonus + timeBonus;
        
        // Update money and products
        this.money += Math.floor(this.score * 0.1);
        this.updateProductCounts();
        
        // Track max combo
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        
        // Level up character
        this.updateCharacterLevel();
        
        // Play level up sound
        this.audioManager?.playLevelProgressSound(this.currentLevel);
        
        // Show completion message (shorter duration, dismissible)
        const reward = this.gameData?.progressionRewards?.find(r => parseInt(r.level) === this.currentLevel);
        const message = reward ? `レベル ${this.currentLevel} クリア！\n${reward.description}` : `レベル ${this.currentLevel} クリア！`;
        this.uiManager?.showMessage(message, 1200, true);
        
        // Check if game should end or continue (shorter delay)
        if (this.currentLevel >= 10) {
            setTimeout(() => this.endGame(), 1500);
        } else {
            this.currentLevel++;
            setTimeout(() => {
                // Clear any remaining messages before starting new level
                this.uiManager?.clearAllMessages();
                this.startLevel();
            }, 1500);
        }
        
        this.updateHUD();
        this.saveProgress();
    }
    
    timeUp() {
        this.stopTimer();
        
        if (this.currentSequence.length === 0) {
            // No progress made, game over
            this.uiManager?.showMessage('時間切れ！ゲームオーバー', 1500, true);
            setTimeout(() => this.endGame(), 1500);
        } else {
            // Partial completion, reduced score and continue
            this.score = Math.floor(this.score * 0.7);
            this.uiManager?.showMessage('時間切れ！スコア減少', 1200, true);
            
            if (this.currentLevel >= 10) {
                setTimeout(() => this.endGame(), 1200);
            } else {
                this.currentLevel++;
                setTimeout(() => {
                    this.uiManager?.clearAllMessages();
                    this.startLevel();
                }, 1200);
            }
        }
        
        this.updateHUD();
    }
    
    updateProductCounts() {
        const products = ['coffee', 'croissant', 'cake', 'drink'];
        const levelBonus = Math.floor(this.currentLevel / 2);
        
        products.forEach(product => {
            this.productCounts[product] += 1 + levelBonus;
        });
        
        this.uiManager?.updateProductCounters(this.productCounts);
    }
    
    updateCharacterLevel() {
        const newCharacterLevel = Math.min(5, Math.floor((this.currentLevel - 1) / 2) + 1);
        
        if (newCharacterLevel > this.characterLevel) {
            this.characterLevel = newCharacterLevel;
            this.uiManager?.updateGameCharacter(this.characterLevel);
            
            // Character level up bonus
            this.score += this.characterLevel * 100;
            this.uiManager?.showMessage(`エマがレベルアップ！`, 1000, true);
        }
    }
    
    endGame() {
        this.gameState = 'ended';
        this.stopTimer();
        this.stopAutoSave();
        
        // Calculate final stats
        const playTime = Math.floor((Date.now() - this.startTime) / 1000);
        const accuracy = this.totalClicks > 0 ? (this.correctClicks / this.totalClicks * 100) : 0;
        
        // Determine ending
        const ending = this.determineEnding();
        
        // Save final progress
        this.saveFinalStats({
            finalScore: this.score,
            finalLevel: this.currentLevel,
            playTime: playTime,
            accuracy: accuracy,
            maxCombo: this.maxCombo,
            ending: ending.ending_id
        });
        
        // Show ending
        this.uiManager?.showEnding(ending, this.score);
        this.audioManager?.playEndingAudio(ending.ending_id);
    }
    
    determineEnding() {
        if (!this.gameData || !this.gameData.endings) {
            return { ending_id: 'newbie', name: '新人バリスタ' };
        }
        
        // Find appropriate ending based on score
        const sortedEndings = this.gameData.endings.sort((a, b) => 
            parseInt(a.score_min) - parseInt(b.score_min)
        );
        
        for (let i = sortedEndings.length - 1; i >= 0; i--) {
            const ending = sortedEndings[i];
            if (this.score >= parseInt(ending.score_min)) {
                return ending;
            }
        }
        
        return sortedEndings[0]; // Default to lowest ending
    }
    
    updateHUD() {
        const hudData = {
            level: this.currentLevel,
            money: this.money,
            score: this.score,
            time: this.timeRemaining
        };
        
        this.uiManager?.updateHUD(hudData);
    }
    
    showScoreIncrease(points, element) {
        const scoreElement = document.createElement('div');
        scoreElement.textContent = `+${points}`;
        scoreElement.style.cssText = `
            position: absolute;
            color: #32CD32;
            font-weight: bold;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 1000;
            animation: scorePopup 1s ease-out forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        scoreElement.style.left = rect.left + rect.width / 2 + 'px';
        scoreElement.style.top = rect.top - 20 + 'px';
        
        document.body.appendChild(scoreElement);
        
        setTimeout(() => {
            document.body.removeChild(scoreElement);
        }, 1000);
    }
    
    createComboEffect(element) {
        const effect = document.createElement('div');
        effect.textContent = `COMBO x${this.combo}!`;
        effect.className = 'combo-effect';
        
        const rect = element.getBoundingClientRect();
        effect.style.left = rect.left + rect.width / 2 + 'px';
        effect.style.top = rect.top + rect.height / 2 + 'px';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
    }
    
    addCascadeEffect(clickedElement) {
        const allButtons = document.querySelectorAll('.number-button:not(.clicked)');
        const clickedRect = clickedElement.getBoundingClientRect();
        
        allButtons.forEach((button, index) => {
            const buttonRect = button.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(clickedRect.left - buttonRect.left, 2) + 
                Math.pow(clickedRect.top - buttonRect.top, 2)
            );
            
            // Add cascade effect to nearby tiles
            if (distance < 200) {
                setTimeout(() => {
                    button.classList.add('tile-cascade');
                    setTimeout(() => {
                        button.classList.remove('tile-cascade');
                    }, 1000);
                }, index * 50);
            }
        });
    }
    
    // Save/Load System
    saveProgress() {
        const saveData = {
            level: this.currentLevel,
            score: this.score,
            money: this.money,
            characterLevel: this.characterLevel,
            productCounts: this.productCounts,
            maxCombo: this.maxCombo,
            totalClicks: this.totalClicks,
            correctClicks: this.correctClicks,
            timestamp: Date.now()
        };
        
        localStorage.setItem('cafe_number_rush_save', JSON.stringify(saveData));
    }
    
    loadSaveData() {
        const saved = localStorage.getItem('cafe_number_rush_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Only load if save is recent (within 24 hours)
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    this.currentLevel = data.level || 1;
                    this.score = data.score || 0;
                    this.money = data.money || 0;
                    this.characterLevel = data.characterLevel || 1;
                    this.productCounts = data.productCounts || { coffee: 0, croissant: 0, cake: 0, drink: 0 };
                    this.maxCombo = data.maxCombo || 0;
                    this.totalClicks = data.totalClicks || 0;
                    this.correctClicks = data.correctClicks || 0;
                }
            } catch (error) {
                console.warn('Failed to load save data:', error);
            }
        }
    }
    
    saveFinalStats(stats) {
        const allStats = JSON.parse(localStorage.getItem('cafe_number_rush_stats') || '[]');
        allStats.push({
            ...stats,
            date: new Date().toISOString()
        });
        
        // Keep only last 10 games
        if (allStats.length > 10) {
            allStats.splice(0, allStats.length - 10);
        }
        
        localStorage.setItem('cafe_number_rush_stats', JSON.stringify(allStats));
    }
    
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            if (this.gameState === 'playing') {
                this.saveProgress();
            }
        }, 5000); // Save every 5 seconds
    }
    
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.stopTimer();
        this.stopAutoSave();
        
        // Reset all game state
        this.currentLevel = 1;
        this.score = 0;
        this.money = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.totalClicks = 0;
        this.correctClicks = 0;
        this.characterLevel = 1;
        this.productCounts = { coffee: 0, croissant: 0, cake: 0, drink: 0 };
        this.currentSequence = [];
        this.targetSequence = [];
        this.nextExpectedNumber = 1;
        
        // Clear save data
        localStorage.removeItem('cafe_number_rush_save');
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.stopTimer();
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startTimer();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}