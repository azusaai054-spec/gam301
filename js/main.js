// Main Application Entry Point for Café Number Rush
class CafeNumberRush {
    constructor() {
        this.gameData = null;
        this.uiManager = null;
        this.audioManager = null;
        this.gameController = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize managers
            this.uiManager = new UIManager();
            this.audioManager = new AudioManager();
            this.gameController = new GameController();
            
            // Make managers globally accessible
            window.uiManager = this.uiManager;
            window.audioManager = this.audioManager;
            window.gameController = this.gameController;
            
            // Load game data from CSV files
            await this.loadGameData();
            
            // Configure managers with data
            this.configureManagers();
            
            // Setup cross-manager references
            this.setupManagerReferences();
            
            // Initialize audio
            await this.initializeAudio();
            
            // Hide loading screen and show title
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('Café Number Rush initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showErrorScreen(error);
        }
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
        }
        
        // Show title screen
        this.uiManager?.showScreen('title');
    }
    
    async loadGameData() {
        try {
            // Load all CSV data with fallback
            this.gameData = await this.loadGameDataWithFallback();
            
            // Validate critical data
            this.validateGameData();
            
            console.log('Game data loaded:', this.gameData);
            
        } catch (error) {
            console.error('Failed to load game data:', error);
            // Use fallback data instead of failing completely
            this.gameData = this.createFallbackGameData();
            console.warn('Using fallback game data');
        }
    }
    
    async loadGameDataWithFallback() {
        try {
            return await CSVLoader.loadAllGameData();
        } catch (error) {
            console.warn('CSV loading failed, trying individual files:', error);
            
            // Try loading individual files
            const gameData = {};
            const csvFiles = [
                'scenes', 'characters', 'dialogues', 'characterLevels', 
                'endings', 'uiElements', 'uiPanels', 'uiIcons',
                'clickAreas', 'uiAnimations', 'uiFonts', 'uiResponsive',
                'gameBalance', 'soundEffects', 'progressionRewards'
            ];
            
            for (const dataType of csvFiles) {
                try {
                    const filename = this.getCSVFilename(dataType);
                    gameData[dataType] = await CSVLoader.loadCSV(filename);
                    console.log(`Loaded ${dataType}:`, gameData[dataType].length, 'items');
                } catch (fileError) {
                    console.warn(`Failed to load ${dataType}:`, fileError);
                    gameData[dataType] = [];
                }
            }
            
            return gameData;
        }
    }
    
    getCSVFilename(dataType) {
        const filenameMap = {
            scenes: 'scenes.csv',
            characters: 'characters.csv',
            dialogues: 'dialogues.csv',
            characterLevels: 'character_levels.csv',
            endings: 'endings.csv',
            uiElements: 'ui_elements.csv',
            uiPanels: 'ui_panels.csv',
            uiIcons: 'ui_icons.csv',
            clickAreas: 'click_areas.csv',
            uiAnimations: 'ui_animations.csv',
            uiFonts: 'ui_fonts.csv',
            uiResponsive: 'ui_responsive.csv',
            gameBalance: 'game_balance.csv',
            soundEffects: 'sound_effects.csv',
            progressionRewards: 'progression_rewards.csv'
        };
        
        return filenameMap[dataType] || `${dataType}.csv`;
    }
    
    createFallbackGameData() {
        // Create minimal fallback data to ensure game can run
        return {
            scenes: [
                { scene_id: 'title', scene_name: 'タイトル画面', background_image: '', bgm_file: '', duration: '0' },
                { scene_id: 'main_game', scene_name: 'メインゲーム', background_image: '', bgm_file: '', duration: '900' }
            ],
            characters: [
                { character_id: 'emma', name: 'エマ', age: '20', role: 'メインバリスタ', personality: '前向き', dream: '最高のカフェを作る' }
            ],
            dialogues: [
                { dialogue_id: 'intro_001', character_id: 'emma', text: 'いらっしゃいませ！', emotion: 'happy', voice_file: '', timing: '0' },
                { dialogue_id: 'intro_002', character_id: 'emma', text: '注文番号を1から順番にクリックしてくださいね', emotion: 'normal', voice_file: '', timing: '2' }
            ],
            characterLevels: [
                { character_id: 'emma', level_min: '1', level_max: '2', sprite_file: 'emma_novice.png', costume: '基本エプロン', emotion_set: 'nervous;worried', special_ability: 'none' },
                { character_id: 'emma', level_min: '3', level_max: '4', sprite_file: 'emma_learning.png', costume: 'カフェ帽追加', emotion_set: 'happy;nervous', special_ability: 'time_bonus_2' },
                { character_id: 'emma', level_min: '5', level_max: '10', sprite_file: 'emma_master.png', costume: '店長風衣装', emotion_set: 'love;happy', special_ability: 'all_max' }
            ],
            endings: [
                { ending_id: 'master', name: 'カフェマスター', score_min: '2000', score_max: '9999', background: '', bgm: '', special_effects: 'applause' },
                { ending_id: 'popular', name: '人気店オーナー', score_min: '1200', score_max: '1999', background: '', bgm: '', special_effects: 'customer_chat' },
                { ending_id: 'cozy', name: '街の憩いの場', score_min: '600', score_max: '1199', background: '', bgm: '', special_effects: 'peaceful_ambiance' },
                { ending_id: 'newbie', name: '新人バリスタ', score_min: '0', score_max: '599', background: '', bgm: '', special_effects: 'encouragement' }
            ],
            gameBalance: [
                { level: '1', numbers_max: '5', time_limit: '15', score_multiplier: '1.0', unlock_requirement: '0', new_features: '基本操作' },
                { level: '2', numbers_max: '5', time_limit: '14', score_multiplier: '1.1', unlock_requirement: '100', new_features: 'コンボシステム' },
                { level: '3', numbers_max: '6', time_limit: '13', score_multiplier: '1.2', unlock_requirement: '250', new_features: '新メニュー：カプチーノ' },
                { level: '4', numbers_max: '7', time_limit: '12', score_multiplier: '1.3', unlock_requirement: '450', new_features: '時間ボーナス' },
                { level: '5', numbers_max: '8', time_limit: '11', score_multiplier: '1.4', unlock_requirement: '700', new_features: '自動ヒント機能' },
                { level: '6', numbers_max: '9', time_limit: '10', score_multiplier: '1.5', unlock_requirement: '1000', new_features: '新メニュー：ケーキ' },
                { level: '7', numbers_max: '10', time_limit: '9', score_multiplier: '1.6', unlock_requirement: '1350', new_features: '効率化アイテム' },
                { level: '8', numbers_max: '12', time_limit: '8', score_multiplier: '1.7', unlock_requirement: '1750', new_features: 'プレミアムメニュー' },
                { level: '9', numbers_max: '13', time_limit: '8', score_multiplier: '1.8', unlock_requirement: '2200', new_features: 'マスタースキル' },
                { level: '10', numbers_max: '15', time_limit: '8', score_multiplier: '2.0', unlock_requirement: '2700', new_features: '完全制覇' }
            ],
            soundEffects: [
                { sound_id: 'click_sound', file_name: 'click.mp3', volume: '0.7', loop: 'false', category: 'effect', trigger_condition: 'number_click' },
                { sound_id: 'success_sound', file_name: 'success.mp3', volume: '0.8', loop: 'false', category: 'effect', trigger_condition: 'correct_sequence' },
                { sound_id: 'error_sound', file_name: 'error.mp3', volume: '0.6', loop: 'false', category: 'effect', trigger_condition: 'wrong_click' },
                { sound_id: 'level_up_sound', file_name: 'levelup.mp3', volume: '0.9', loop: 'false', category: 'effect', trigger_condition: 'level_increase' }
            ],
            uiElements: [],
            uiPanels: [],
            uiIcons: [],
            clickAreas: [],
            uiAnimations: [],
            uiFonts: [],
            uiResponsive: [],
            progressionRewards: []
        };
    }
    
    validateGameData() {
        const requiredData = [
            'scenes', 'characters', 'dialogues', 'characterLevels', 
            'endings', 'gameBalance', 'soundEffects'
        ];
        
        for (const dataType of requiredData) {
            if (!this.gameData[dataType]) {
                console.warn(`Missing data: ${dataType}, initializing empty array`);
                this.gameData[dataType] = [];
            } else if (this.gameData[dataType].length === 0) {
                console.warn(`Empty data: ${dataType}`);
            }
        }
        
        // Ensure minimum required data exists
        if (!this.gameData.gameBalance || this.gameData.gameBalance.length === 0) {
            console.warn('No game balance data found, using fallback');
            this.gameData.gameBalance = this.createFallbackGameData().gameBalance;
        }
        
        if (!this.gameData.characters || this.gameData.characters.length === 0) {
            console.warn('No character data found, using fallback');
            this.gameData.characters = this.createFallbackGameData().characters;
        }
        
        if (!this.gameData.endings || this.gameData.endings.length === 0) {
            console.warn('No ending data found, using fallback');
            this.gameData.endings = this.createFallbackGameData().endings;
        }
        
        console.log('Game data validation completed');
    }
    
    configureManagers() {
        // Configure UI Manager
        this.uiManager.setGameData(this.gameData);
        
        // Configure Audio Manager
        this.audioManager.setGameData(this.gameData);
        
        // Configure Game Controller
        this.gameController.setGameData(this.gameData);
    }
    
    setupManagerReferences() {
        // Cross-reference managers
        this.gameController.setUIManager(this.uiManager);
        this.gameController.setAudioManager(this.audioManager);
        this.uiManager.setGameController(this.gameController);
        this.uiManager.setAudioManager(this.audioManager);
        
        // Make sure global references are set after initialization
        window.uiManager = this.uiManager;
        window.audioManager = this.audioManager;
        window.gameController = this.gameController;
    }
    
    async initializeAudio() {
        try {
            // Initialize Web Audio API
            this.audioManager.initWebAudio();
            
            // Load critical sounds
            await this.audioManager.preloadSounds();
            
            // Start title screen BGM
            this.audioManager.playSceneAudio('title');
            
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            // Continue without audio
        }
    }
    
    showErrorScreen(error) {
        const errorHTML = `
            <div class="error-screen" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                color: white;
                text-align: center;
                font-family: 'Noto Sans JP', sans-serif;
            ">
                <div style="
                    background: rgba(0, 0, 0, 0.8);
                    padding: 3rem;
                    border-radius: 20px;
                    max-width: 500px;
                ">
                    <h1 style="margin-bottom: 2rem; color: #FFD700;">⚠️ エラー</h1>
                    <p style="margin-bottom: 2rem; font-size: 1.2rem;">
                        ゲームの初期化に失敗しました
                    </p>
                    <p style="margin-bottom: 2rem; font-size: 1rem; opacity: 0.8;">
                        ${error.message || '不明なエラーが発生しました'}
                    </p>
                    <button onclick="location.reload()" style="
                        background: #D2691E;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        font-size: 1.1rem;
                        border-radius: 10px;
                        cursor: pointer;
                        font-family: inherit;
                    ">
                        🔄 リロード
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }
    
    // Public API methods
    startGame() {
        if (!this.isInitialized) {
            console.warn('Game not initialized yet');
            return;
        }
        
        this.gameController?.startGame();
    }
    
    pauseGame() {
        this.gameController?.pauseGame();
    }
    
    resumeGame() {
        this.gameController?.resumeGame();
    }
    
    resetGame() {
        this.gameController?.resetGame();
    }
    
    // Debug methods
    getGameData() {
        return this.gameData;
    }
    
    getManagers() {
        return {
            ui: this.uiManager,
            audio: this.audioManager,
            game: this.gameController
        };
    }
    
    // Performance monitoring
    getPerformanceInfo() {
        return {
            initialized: this.isInitialized,
            dataLoaded: !!this.gameData,
            managersReady: !!(this.uiManager && this.audioManager && this.gameController),
            gameState: this.gameController?.gameState,
            audioEnabled: !!(this.audioManager?.audioContext),
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB'
            } : 'N/A'
        };
    }
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Try to show error in UI if possible
    if (window.uiManager) {
        window.uiManager.showMessage('エラーが発生しました', 3000);
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent console spam
});

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cafeNumberRush = new CafeNumberRush();
    });
} else {
    // DOM already loaded
    window.cafeNumberRush = new CafeNumberRush();
}

// Hot reload support for development
if (module && module.hot) {
    module.hot.accept();
}

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CafeNumberRush;
}

// Console welcome message
console.log(`
🎮 Café Number Rush
-------------------
Welcome to the development console!

Available commands:
- cafeNumberRush.getPerformanceInfo() - Show performance info
- cafeNumberRush.getGameData() - View loaded game data
- cafeNumberRush.getManagers() - Access game managers
- uiManager.showScreen(name) - Switch screens
- gameController.startGame() - Start game directly
- audioManager.muteAll() - Mute all audio

Debug mode: ${location.search.includes('debug')}
`);