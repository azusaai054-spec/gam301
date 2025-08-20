// UI Manager for Café Number Rush
class UIManager {
    constructor() {
        this.currentScreen = 'loading';
        this.screens = {};
        this.gameData = null;
        this.typewriterSpeed = 50; // ms per character
        this.currentDialogue = null;
        this.typewriterTimer = null;
        this.currentMessage = null;
        this.messageTimer = null;
        this.resizeObserver = null;
        
        this.initializeScreens();
        this.setupEventListeners();
        this.setupResponsiveHandlers();
    }
    
    initializeScreens() {
        this.screens = {
            loading: document.getElementById('loading-screen'),
            title: document.getElementById('title-screen'),
            dialogue: document.getElementById('dialogue-screen'),
            game: document.getElementById('game-screen'),
            ending: document.getElementById('ending-screen'),
            settings: document.getElementById('settings-screen')
        };
    }
    
    setupEventListeners() {
        // Title screen buttons
        document.getElementById('start-game')?.addEventListener('click', () => {
            this.showDialogue('intro_001');
        });
        
        document.getElementById('story-mode')?.addEventListener('click', () => {
            this.showScreen('dialogue');
        });
        
        document.getElementById('settings')?.addEventListener('click', () => {
            this.showScreen('settings');
        });
        
        document.getElementById('help')?.addEventListener('click', () => {
            this.showHelpDialog();
        });
        
        // Dialogue controls
        document.getElementById('next-dialogue')?.addEventListener('click', () => {
            this.nextDialogue();
        });
        
        document.getElementById('skip-dialogue')?.addEventListener('click', () => {
            this.skipDialogue();
        });
        
        // Settings controls
        document.getElementById('close-settings')?.addEventListener('click', () => {
            this.showScreen('title');
        });
        
        document.getElementById('reset-save')?.addEventListener('click', () => {
            this.resetSaveData();
        });
        
        // Volume controls
        document.getElementById('bgm-volume')?.addEventListener('input', (e) => {
            this.updateBGMVolume(e.target.value);
        });
        
        document.getElementById('se-volume')?.addEventListener('input', (e) => {
            this.updateSEVolume(e.target.value);
        });
        
        // Ending screen controls
        document.getElementById('play-again')?.addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('view-results')?.addEventListener('click', () => {
            this.showDetailedResults();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    setupResponsiveHandlers() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle orientation change for mobile devices
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
                this.adjustForOrientation();
            }, 100);
        });
        
        // Setup ResizeObserver for game board if supported
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.target.classList.contains('game-board')) {
                        this.adjustGameBoard(entry.target);
                    } else if (entry.target.classList.contains('ending-content')) {
                        this.adjustEndingContent(entry.target);
                    }
                });
            });
        }
        
        // Initial resize handling
        this.handleResize();
    }
    
    handleResize() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.innerWidth / window.innerHeight
        };
        
        // Update CSS custom properties for responsive calculations
        document.documentElement.style.setProperty('--viewport-width', `${viewport.width}px`);
        document.documentElement.style.setProperty('--viewport-height', `${viewport.height}px`);
        document.documentElement.style.setProperty('--viewport-ratio', viewport.ratio.toString());
        
        // Adjust for different screen sizes
        this.adjustForScreenSize(viewport);
        
        // Screen-specific adjustments
        if (this.currentScreen === 'game') {
            this.adjustGameScreen(viewport);
        } else if (this.currentScreen === 'ending') {
            this.adjustEndingScreen(viewport);
        }
    }
    
    adjustForScreenSize(viewport) {
        // Determine screen size category
        let sizeCategory = 'desktop';
        if (viewport.width <= 575) {
            sizeCategory = 'mobile';
        } else if (viewport.width <= 767) {
            sizeCategory = 'tablet';
        } else if (viewport.width <= 991) {
            sizeCategory = 'medium';
        }
        
        // Add size class to body
        document.body.className = document.body.className.replace(/screen-\w+/g, '');
        document.body.classList.add(`screen-${sizeCategory}`);
        
        // Adjust font scaling for very small screens
        if (viewport.width < 350 || viewport.height < 500) {
            document.documentElement.style.setProperty('--font-scale', '0.85');
        } else if (viewport.width < 400) {
            document.documentElement.style.setProperty('--font-scale', '0.9');
        } else {
            document.documentElement.style.setProperty('--font-scale', '1');
        }
    }
    
    adjustForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobile = window.innerWidth <= 767;
        
        if (isMobile && isLandscape) {
            document.body.classList.add('landscape-mobile');
            
            // Adjust for mobile landscape specifically
            if (this.currentScreen === 'game') {
                this.optimizeGameForMobileLandscape();
            }
        } else {
            document.body.classList.remove('landscape-mobile');
        }
    }
    
    adjustGameScreen(viewport) {
        const gameBoard = document.querySelector('.game-board');
        const numberGrid = document.querySelector('.number-grid');
        
        if (!gameBoard || !numberGrid) return;
        
        // Start observing if ResizeObserver is available
        if (this.resizeObserver) {
            this.resizeObserver.observe(gameBoard);
        }
        
        this.adjustGameBoard(gameBoard);
    }
    
    adjustGameBoard(gameBoard) {
        const numberGrid = gameBoard.querySelector('.number-grid');
        if (!numberGrid) return;
        
        const containerRect = gameBoard.getBoundingClientRect();
        const availableWidth = containerRect.width - 32; // Account for padding
        const availableHeight = containerRect.height - 100; // Account for instructions and padding
        
        // Get current grid dimensions
        const computedStyle = window.getComputedStyle(numberGrid);
        const gridColumns = parseInt(computedStyle.getPropertyValue('grid-template-columns').split(' ').length) || 4;
        
        // Calculate optimal button size
        const gap = 8; // Gap between buttons
        const buttonWidth = (availableWidth - (gap * (gridColumns - 1))) / gridColumns;
        const maxButtonHeight = availableHeight / Math.ceil(15 / gridColumns) - gap;
        
        // Ensure buttons are not too small or too large
        const minButtonSize = Math.max(35, Math.min(window.innerWidth, window.innerHeight) * 0.08);
        const maxButtonSize = Math.min(80, Math.min(window.innerWidth, window.innerHeight) * 0.15);
        
        const buttonSize = Math.max(minButtonSize, Math.min(buttonWidth, maxButtonHeight, maxButtonSize));
        
        // Apply the calculated size
        numberGrid.style.setProperty('--button-size', `${buttonSize}px`);
        
        // Adjust font size based on button size
        const fontSize = Math.max(12, Math.min(24, buttonSize * 0.35));
        numberGrid.style.setProperty('--button-font-size', `${fontSize}px`);
        
        // Update all number buttons
        const numberButtons = numberGrid.querySelectorAll('.number-button');
        numberButtons.forEach(button => {
            button.style.minHeight = `${buttonSize}px`;
            button.style.fontSize = `${fontSize}px`;
        });
    }
    
    adjustEndingScreen(viewport) {
        const endingContent = document.querySelector('.ending-content');
        if (!endingContent) return;
        
        if (this.resizeObserver) {
            this.resizeObserver.observe(endingContent);
        }
        
        this.adjustEndingContent(endingContent);
    }
    
    adjustEndingContent(endingContent) {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        const maxWidth = Math.min(viewport.width * 0.9, 600);
        const maxHeight = viewport.height * 0.85;
        
        endingContent.style.maxWidth = `${maxWidth}px`;
        endingContent.style.maxHeight = `${maxHeight}px`;
        
        // Check if content overflows and enable scrolling
        if (endingContent.scrollHeight > endingContent.clientHeight) {
            endingContent.style.overflowY = 'auto';
        }
    }
    
    optimizeGameForMobileLandscape() {
        // Specific optimizations for mobile landscape mode
        const gameContent = document.querySelector('.game-content');
        const characterPanel = document.querySelector('.character-panel');
        
        if (gameContent) {
            gameContent.style.flexDirection = 'row';
        }
        
        if (characterPanel) {
            characterPanel.style.width = '100px';
            characterPanel.style.minWidth = '100px';
        }
    }
    
    setGameData(data) {
        this.gameData = data;
    }
    
    setGameController(gameController) {
        this.gameController = gameController;
    }
    
    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }
    
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
            
            // Screen-specific setup
            this.onScreenShow(screenName);
        }
    }
    
    onScreenShow(screenName) {
        switch (screenName) {
            case 'title':
                this.setupTitleScreen();
                break;
            case 'dialogue':
                this.setupDialogueScreen();
                break;
            case 'game':
                this.setupGameScreen();
                break;
            case 'ending':
                this.setupEndingScreen();
                break;
            case 'settings':
                this.setupSettingsScreen();
                break;
        }
    }
    
    setupTitleScreen() {
        // Animate title elements
        const title = document.querySelector('.game-title');
        const portrait = document.querySelector('.emma-portrait');
        const buttons = document.querySelectorAll('.menu-button');
        
        if (title) title.classList.add('fade-in');
        if (portrait) portrait.classList.add('bounce-animation');
        
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.classList.add('slide-in-bottom');
            }, index * 200);
        });
    }
    
    setupDialogueScreen() {
        // Reset dialogue state
        this.clearTypewriter();
        
        // Set default character
        this.updateCharacterDisplay('emma', 'happy');
    }
    
    setupGameScreen() {
        // Initialize game HUD
        this.updateHUD({
            level: 1,
            money: 0,
            score: 0,
            time: 15
        });
        
        // Reset product counters
        this.updateProductCounters({
            coffee: 0,
            croissant: 0,
            cake: 0,
            drink: 0
        });
        
        // Update character display
        this.updateGameCharacter(1);
    }
    
    setupEndingScreen() {
        // Will be called by game controller with specific ending data
    }
    
    setupSettingsScreen() {
        // Load current settings
        const bgmVolume = localStorage.getItem('bgm-volume') || '50';
        const seVolume = localStorage.getItem('se-volume') || '70';
        const autoSave = localStorage.getItem('auto-save') !== 'false';
        
        const bgmSlider = document.getElementById('bgm-volume');
        const seSlider = document.getElementById('se-volume');
        const autoSaveCheckbox = document.getElementById('auto-save');
        
        if (bgmSlider) {
            bgmSlider.value = bgmVolume;
            document.getElementById('bgm-volume-value').textContent = bgmVolume + '%';
        }
        
        if (seSlider) {
            seSlider.value = seVolume;
            document.getElementById('se-volume-value').textContent = seVolume + '%';
        }
        
        if (autoSaveCheckbox) {
            autoSaveCheckbox.checked = autoSave;
        }
    }
    
    // Dialogue System
    showDialogue(dialogueId) {
        if (!this.gameData || !this.gameData.dialogues) {
            console.warn('No dialogue data available, skipping to game');
            if (this.gameController) {
                this.gameController.startGame();
            }
            return;
        }
        
        const dialogue = this.gameData.dialogues.find(d => d.dialogue_id === dialogueId);
        if (!dialogue) {
            console.warn(`Dialogue ${dialogueId} not found, using fallback`);
            this.currentDialogue = {
                dialogue_id: dialogueId,
                character_id: 'emma',
                text: 'ゲームを開始しましょう！',
                emotion: 'happy',
                voice_file: '',
                timing: '0'
            };
        } else {
            this.currentDialogue = dialogue;
        }
        
        this.showScreen('dialogue');
        
        // Update character display
        this.updateCharacterDisplay(this.currentDialogue.character_id, this.currentDialogue.emotion);
        
        // Start typewriter effect
        this.startTypewriter(this.currentDialogue.text);
    }
    
    updateCharacterDisplay(characterId, emotion) {
        const nameElement = document.getElementById('character-name');
        const emotionElement = document.getElementById('character-emotion');
        const spriteElement = document.getElementById('dialogue-character');
        
        if (!this.gameData || !this.gameData.characters) return;
        
        const character = this.gameData.characters.find(c => c.character_id === characterId);
        if (!character) return;
        
        if (nameElement) nameElement.textContent = character.name;
        if (emotionElement) emotionElement.textContent = this.getEmotionEmoji(emotion);
        
        // Update sprite (placeholder for now)
        if (spriteElement) {
            spriteElement.className = `character-sprite character-${emotion}`;
        }
    }
    
    getEmotionEmoji(emotion) {
        const emotions = {
            happy: '😊',
            excited: '😆',
            cheerful: '😄',
            focused: '😤',
            amazed: '😲',
            encouraging: '🥰',
            worried: '😰',
            supportive: '🤗',
            joy: '😍',
            grateful: '🙏',
            satisfied: '😌',
            warm: '😊',
            determined: '😤',
            hopeful: '✨',
            brave: '💪',
            motivated: '🔥',
            normal: '😊'
        };
        
        return emotions[emotion] || '😊';
    }
    
    startTypewriter(text) {
        const textElement = document.getElementById('text-content');
        if (!textElement) return;
        
        this.clearTypewriter();
        textElement.textContent = '';
        
        let index = 0;
        this.typewriterTimer = setInterval(() => {
            if (index < text.length) {
                textElement.textContent += text[index];
                index++;
                
                // Play typing sound
                if (this.audioManager) {
                    this.audioManager.playRandomTypingSound();
                }
            } else {
                this.clearTypewriter();
            }
        }, this.typewriterSpeed);
    }
    
    clearTypewriter() {
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
            this.typewriterTimer = null;
        }
    }
    
    nextDialogue() {
        // Skip current typewriter if still running
        if (this.typewriterTimer) {
            this.clearTypewriter();
            const textElement = document.getElementById('text-content');
            if (textElement && this.currentDialogue) {
                textElement.textContent = this.currentDialogue.text;
            }
            return;
        }
        
        // Move to game or next dialogue
        if (this.currentDialogue && this.currentDialogue.dialogue_id === 'intro_002') {
            // Start game after intro
            if (this.gameController) {
                this.gameController.startGame();
            }
        }
    }
    
    skipDialogue() {
        this.clearTypewriter();
        if (this.gameController) {
            this.gameController.startGame();
        }
    }
    
    // Game HUD Updates
    updateHUD(data) {
        const elements = {
            'level-display': `Lv: ${data.level}`,
            'money-display': `¥${data.money.toLocaleString()}`,
            'score-display': data.score.toLocaleString(),
            'time-display': `${data.time}s`
        };
        
        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
                
                // Add score increase animation
                if (id === 'score-display' && data.scoreIncrease) {
                    element.classList.add('score-increase');
                    element.setAttribute('data-points', data.scoreIncrease);
                    setTimeout(() => {
                        element.classList.remove('score-increase');
                        element.removeAttribute('data-points');
                    }, 1000);
                }
            }
        });
    }
    
    updateProductCounters(counts) {
        const elements = {
            'coffee-count': `×${counts.coffee}`,
            'croissant-count': `×${counts.croissant}`,
            'cake-count': `×${counts.cake}`,
            'drink-count': `×${counts.drink}`
        };
        
        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = text;
        });
    }
    
    updateGameCharacter(level) {
        const characterElement = document.getElementById('game-character');
        const dialogueElement = document.getElementById('character-dialogue');
        
        if (!this.gameData || !this.gameData.characterLevels) return;
        
        const levelData = this.gameData.characterLevels.find(
            cl => cl.character_id === 'emma' && 
                  level >= parseInt(cl.level_min) && 
                  level <= parseInt(cl.level_max)
        );
        
        if (levelData && characterElement) {
            characterElement.className = `character-sprite level-${level}`;
        }
        
        // Update dialogue based on game state
        if (dialogueElement) {
            const messages = [
                '頑張って！',
                'いい調子です！',
                '素晴らしい！',
                '完璧ですね！',
                'あなたって天才！'
            ];
            
            const messageIndex = Math.min(Math.floor(level / 2), messages.length - 1);
            dialogueElement.textContent = messages[messageIndex];
        }
    }
    
    updateComboDisplay(combo) {
        const comboElement = document.getElementById('combo-display');
        if (comboElement) {
            comboElement.textContent = combo;
            
            if (combo > 0) {
                comboElement.classList.add('combo-sparkle');
                setTimeout(() => {
                    comboElement.classList.remove('combo-sparkle');
                }, 500);
            }
        }
    }
    
    // Ending Screen
    showEnding(endingData, finalScore) {
        this.showScreen('ending');
        
        const titleElement = document.getElementById('ending-title');
        const characterElement = document.getElementById('ending-character');
        const dialogueElement = document.getElementById('ending-dialogue-text');
        const scoreElement = document.getElementById('final-score');
        const rankElement = document.getElementById('rank-display');
        const backgroundElement = document.getElementById('ending-background');
        
        if (titleElement) titleElement.textContent = endingData.name;
        if (scoreElement) scoreElement.textContent = finalScore.toLocaleString();
        
        // Set rank based on score
        const rank = this.getScoreRank(finalScore);
        if (rankElement) rankElement.textContent = rank;
        
        // Set background
        if (backgroundElement) {
            backgroundElement.style.backgroundImage = `url('./assets/backgrounds/${endingData.background}')`;
        }
        
        // Show ending dialogue
        if (dialogueElement && this.gameData && this.gameData.dialogues) {
            const endingDialogue = this.gameData.dialogues.find(
                d => d.dialogue_id === `ending_${endingData.ending_id}_001`
            );
            
            if (endingDialogue) {
                this.startTypewriter(endingDialogue.text);
            }
        }
        
        // Play ending BGM
        if (this.audioManager) {
            this.audioManager.playBGM(endingData.bgm);
        }
    }
    
    getScoreRank(score) {
        if (score >= 2500) return 'S+';
        if (score >= 2000) return 'S';
        if (score >= 1500) return 'A';
        if (score >= 1200) return 'B';
        if (score >= 800) return 'C';
        if (score >= 600) return 'D';
        return 'E';
    }
    
    // Utility functions
    showHelpDialog() {
        const helpText = `
        【ゲームの遊び方】
        
        1. 画面に表示される数字を1から順番にクリック
        2. 制限時間内に全ての数字をクリック
        3. 正確に完了するとレベルアップ
        4. レベルが上がると数字が増えて難易度アップ
        5. コンボを狙って高スコアを目指そう！
        
        【操作方法】
        - マウス/タッチでクリック
        - スペースキー: 次へ進む
        - Escキー: 設定画面
        `;
        
        alert(helpText);
    }
    
    resetSaveData() {
        if (confirm('セーブデータをリセットしますか？\nこの操作は取り消せません。')) {
            localStorage.removeItem('cafe_number_rush_save');
            localStorage.removeItem('cafe_number_rush_autosave');
            alert('セーブデータをリセットしました。');
        }
    }
    
    restartGame() {
        if (this.gameController) {
            this.gameController.resetGame();
            this.showScreen('title');
        }
    }
    
    showDetailedResults() {
        // Show detailed statistics (placeholder)
        alert('詳細な結果画面は今後の更新で追加予定です。');
    }
    
    updateBGMVolume(value) {
        document.getElementById('bgm-volume-value').textContent = value + '%';
        localStorage.setItem('bgm-volume', value);
        
        if (this.audioManager) {
            this.audioManager.setBGMVolume(value / 100);
        }
    }
    
    updateSEVolume(value) {
        document.getElementById('se-volume-value').textContent = value + '%';
        localStorage.setItem('se-volume', value);
        
        if (this.audioManager) {
            this.audioManager.setSEVolume(value / 100);
        }
    }
    
    handleKeyboard(event) {
        switch (event.code) {
            case 'Space':
                if (this.currentScreen === 'dialogue') {
                    event.preventDefault();
                    this.nextDialogue();
                }
                break;
            case 'Escape':
                if (this.currentScreen !== 'settings') {
                    this.showScreen('settings');
                } else {
                    this.showScreen('title');
                }
                break;
            case 'Enter':
                if (this.currentScreen === 'title') {
                    document.getElementById('start-game')?.click();
                }
                break;
        }
    }
    
    // Progress bar animation
    updateProgressBar(percentage) {
        const progressBar = document.getElementById('progress-fill');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    // Show temporary message
    showMessage(message, duration = 1000, allowTouchDismiss = true) {
        // Remove any existing messages first
        this.clearAllMessages();
        
        const messageElement = document.createElement('div');
        messageElement.className = 'temporary-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(44, 24, 16, 0.95);
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: bold;
            z-index: 10000;
            animation: fadeIn 0.2s ease-in;
            pointer-events: ${allowTouchDismiss ? 'auto' : 'none'};
            cursor: ${allowTouchDismiss ? 'pointer' : 'default'};
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        `;
        
        // Store reference for easy removal
        this.currentMessage = messageElement;
        
        // Add touch/click to dismiss functionality
        if (allowTouchDismiss) {
            const dismissMessage = () => {
                this.hideMessage(messageElement);
            };
            
            messageElement.addEventListener('click', dismissMessage);
            messageElement.addEventListener('touchstart', dismissMessage, { passive: true });
        }
        
        document.body.appendChild(messageElement);
        
        // Auto-hide after duration
        this.messageTimer = setTimeout(() => {
            this.hideMessage(messageElement);
        }, duration);
    }
    
    hideMessage(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
                if (this.currentMessage === messageElement) {
                    this.currentMessage = null;
                }
            }, 200);
        }
        
        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
            this.messageTimer = null;
        }
    }
    
    clearAllMessages() {
        // Clear any existing message timer
        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
            this.messageTimer = null;
        }
        
        // Remove current message if exists
        if (this.currentMessage) {
            this.hideMessage(this.currentMessage);
        }
        
        // Remove any leftover temporary messages
        const existingMessages = document.querySelectorAll('.temporary-message');
        existingMessages.forEach(msg => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}