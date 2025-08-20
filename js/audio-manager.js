// Audio Manager for Café Number Rush
class AudioManager {
    constructor() {
        this.bgmPlayer = document.getElementById('bgm-player');
        this.sePlayer = document.getElementById('se-player');
        this.currentBGM = null;
        this.bgmVolume = 0.5;
        this.seVolume = 0.7;
        this.soundCache = new Map();
        this.gameData = null;
        
        this.initializeAudio();
        this.loadSettings();
    }
    
    initializeAudio() {
        // Set initial volumes
        if (this.bgmPlayer) {
            this.bgmPlayer.volume = this.bgmVolume;
        }
        if (this.sePlayer) {
            this.sePlayer.volume = this.seVolume;
        }
        
        // Handle audio loading errors gracefully
        this.bgmPlayer?.addEventListener('error', (e) => {
            console.warn('BGM loading failed:', e);
        });
        
        this.sePlayer?.addEventListener('error', (e) => {
            console.warn('SE loading failed:', e);
        });
    }
    
    loadSettings() {
        const savedBGMVolume = localStorage.getItem('bgm-volume');
        const savedSEVolume = localStorage.getItem('se-volume');
        
        if (savedBGMVolume) {
            this.setBGMVolume(savedBGMVolume / 100);
        }
        
        if (savedSEVolume) {
            this.setSEVolume(savedSEVolume / 100);
        }
    }
    
    setGameData(data) {
        this.gameData = data;
        this.preloadSounds();
    }
    
    async preloadSounds() {
        if (!this.gameData || !this.gameData.soundEffects) return;
        
        // Preload commonly used sound effects
        const criticalSounds = [
            'click_sound',
            'success_sound',
            'error_sound',
            'level_up_sound'
        ];
        
        for (const soundId of criticalSounds) {
            const soundData = this.gameData.soundEffects.find(s => s.sound_id === soundId);
            if (soundData) {
                await this.preloadSound(soundData.file_name);
            }
        }
    }
    
    async preloadSound(filename) {
        if (this.soundCache.has(filename)) return;
        
        try {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = `./assets/audio/${filename}`;
            
            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve);
                audio.addEventListener('error', reject);
                audio.load();
            });
            
            this.soundCache.set(filename, audio);
        } catch (error) {
            console.warn(`Failed to preload sound: ${filename}`, error);
            // Create silent audio object as fallback
            this.soundCache.set(filename, new Audio());
        }
    }
    
    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmPlayer) {
            this.bgmPlayer.volume = this.bgmVolume;
        }
    }
    
    setSEVolume(volume) {
        this.seVolume = Math.max(0, Math.min(1, volume));
        if (this.sePlayer) {
            this.sePlayer.volume = this.seVolume;
        }
    }
    
    async playBGM(filename) {
        if (!filename || !this.bgmPlayer) return;
        
        // Don't restart if same BGM is already playing
        if (this.currentBGM === filename && !this.bgmPlayer.paused) {
            return;
        }
        
        try {
            this.bgmPlayer.src = `./assets/audio/${filename}`;
            this.bgmPlayer.loop = true;
            this.currentBGM = filename;
            
            await this.bgmPlayer.play();
        } catch (error) {
            console.warn(`Failed to play BGM: ${filename}`, error);
        }
    }
    
    stopBGM() {
        if (this.bgmPlayer) {
            this.bgmPlayer.pause();
            this.bgmPlayer.currentTime = 0;
            this.currentBGM = null;
        }
    }
    
    async playSE(soundId) {
        if (!this.gameData || !this.gameData.soundEffects) return;
        
        const soundData = this.gameData.soundEffects.find(s => s.sound_id === soundId);
        if (!soundData) return;
        
        await this.playSEFile(soundData.file_name, parseFloat(soundData.volume) || 1.0);
    }
    
    async playSEFile(filename, volume = 1.0) {
        try {
            let audio;
            
            // Use cached audio if available
            if (this.soundCache.has(filename)) {
                audio = this.soundCache.get(filename).cloneNode();
            } else {
                audio = new Audio(`./assets/audio/${filename}`);
                // Cache for future use
                await this.preloadSound(filename);
            }
            
            audio.volume = this.seVolume * volume;
            await audio.play();
        } catch (error) {
            console.warn(`Failed to play SE: ${filename}`, error);
        }
    }
    
    // Specific game sound effects
    async playClickSound() {
        await this.playSE('click_sound');
    }
    
    async playSuccessSound() {
        await this.playSE('success_sound');
    }
    
    async playErrorSound() {
        await this.playSE('error_sound');
    }
    
    async playLevelUpSound() {
        await this.playSE('level_up_sound');
    }
    
    async playComboSound() {
        await this.playSE('combo_sound');
    }
    
    // Typewriter sound effect
    async playRandomTypingSound() {
        // Create subtle typing sound
        const frequency = 800 + Math.random() * 400; // 800-1200 Hz
        const duration = 0.05; // 50ms
        
        if (this.audioContext) {
            this.playBeep(frequency, duration, 0.1);
        }
    }
    
    // Web Audio API for generated sounds
    initWebAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported');
        }
    }
    
    playBeep(frequency, duration, volume = 0.3) {
        if (!this.audioContext) {
            this.initWebAudio();
        }
        
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * this.seVolume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // Scene-specific audio management
    playSceneAudio(sceneId) {
        if (!this.gameData || !this.gameData.scenes) return;
        
        const scene = this.gameData.scenes.find(s => s.scene_id === sceneId);
        if (scene && scene.bgm_file) {
            this.playBGM(scene.bgm_file);
        }
    }
    
    // Combo sound effects
    playComboEffect(comboCount) {
        // Play increasingly higher pitched sounds for combos
        if (comboCount <= 1) return;
        
        const baseFreq = 600;
        const frequency = baseFreq + (comboCount - 2) * 100;
        const volume = Math.min(0.5, 0.2 + comboCount * 0.05);
        
        this.playBeep(frequency, 0.3, volume);
    }
    
    // Perfect click sound
    playPerfectSound() {
        // Play a special sound for perfect timing
        this.playBeep(1200, 0.2, 0.4);
        setTimeout(() => this.playBeep(1600, 0.15, 0.3), 100);
    }
    
    // Level progression audio
    playLevelProgressSound(level) {
        // Play different sounds based on level milestones
        if (level % 5 === 0) {
            // Major milestone
            this.playLevelUpSound();
            setTimeout(() => this.playComboEffect(5), 200);
        } else {
            // Regular level up
            this.playSuccessSound();
        }
    }
    
    // Time warning audio
    playTimeWarning() {
        // Play urgent sound when time is running low
        this.playBeep(400, 0.1, 0.3);
        setTimeout(() => this.playBeep(400, 0.1, 0.3), 150);
    }
    
    // Ending audio
    playEndingAudio(endingType) {
        const bgmMap = {
            'master': 'bgm_ending_master.mp3',
            'popular': 'bgm_ending_popular.mp3',
            'cozy': 'bgm_ending_cozy.mp3',
            'newbie': 'bgm_ending_newbie.mp3'
        };
        
        const bgmFile = bgmMap[endingType];
        if (bgmFile) {
            this.playBGM(bgmFile);
        }
        
        // Play ending-specific sound effects
        switch (endingType) {
            case 'master':
                // Celebration sounds
                setTimeout(() => this.playBeep(800, 0.3, 0.4), 0);
                setTimeout(() => this.playBeep(1000, 0.3, 0.4), 200);
                setTimeout(() => this.playBeep(1200, 0.5, 0.5), 400);
                break;
            case 'popular':
                // Success sounds
                this.playSuccessSound();
                setTimeout(() => this.playComboEffect(3), 300);
                break;
            case 'cozy':
                // Gentle success
                this.playBeep(600, 0.4, 0.3);
                break;
            case 'newbie':
                // Encouraging sound
                this.playBeep(500, 0.3, 0.2);
                setTimeout(() => this.playBeep(700, 0.3, 0.3), 200);
                break;
        }
    }
    
    // Fade out BGM
    async fadeBGM(duration = 1000) {
        if (!this.bgmPlayer || this.bgmPlayer.paused) return;
        
        const startVolume = this.bgmPlayer.volume;
        const startTime = Date.now();
        
        const fadeStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                this.bgmPlayer.volume = 0;
                this.stopBGM();
                this.bgmPlayer.volume = startVolume;
            } else {
                this.bgmPlayer.volume = startVolume * (1 - progress);
                requestAnimationFrame(fadeStep);
            }
        };
        
        fadeStep();
    }
    
    // Emergency mute (for debugging or accessibility)
    muteAll() {
        if (this.bgmPlayer) this.bgmPlayer.muted = true;
        if (this.sePlayer) this.sePlayer.muted = true;
    }
    
    unmuteAll() {
        if (this.bgmPlayer) this.bgmPlayer.muted = false;
        if (this.sePlayer) this.sePlayer.muted = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}