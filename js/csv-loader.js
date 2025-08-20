// CSV Loader with BOM UTF-8 Support
class CSVLoader {
  static async loadCSV(filename) {
    try {
      const response = await fetch(`./data/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let text = await response.text();
      
      // Remove BOM (Byte Order Mark) if present
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      
      // Split by CRLF and filter empty lines
      const lines = text.split(/\r\n|\r|\n/).filter(line => line.trim());
      if (lines.length === 0) {
        return [];
      }
      
      const headers = this.parseCSVLine(lines[0]);
      
      return lines.slice(1).map(line => {
        const values = this.parseCSVLine(line);
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });
    } catch (error) {
      console.error(`CSV読み込みエラー: ${filename}`, error);
      return [];
    }
  }
  
  static parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
  
  // Load all game data
  static async loadAllGameData() {
    const [
      scenes,
      characters,
      dialogues,
      characterLevels,
      endings,
      uiElements,
      uiPanels,
      uiIcons,
      clickAreas,
      uiAnimations,
      uiFonts,
      uiResponsive,
      gameBalance,
      soundEffects,
      progressionRewards
    ] = await Promise.all([
      this.loadCSV('scenes.csv'),
      this.loadCSV('characters.csv'),
      this.loadCSV('dialogues.csv'),
      this.loadCSV('character_levels.csv'),
      this.loadCSV('endings.csv'),
      this.loadCSV('ui_elements.csv'),
      this.loadCSV('ui_panels.csv'),
      this.loadCSV('ui_icons.csv'),
      this.loadCSV('click_areas.csv'),
      this.loadCSV('ui_animations.csv'),
      this.loadCSV('ui_fonts.csv'),
      this.loadCSV('ui_responsive.csv'),
      this.loadCSV('game_balance.csv'),
      this.loadCSV('sound_effects.csv'),
      this.loadCSV('progression_rewards.csv')
    ]);
    
    return {
      scenes,
      characters,
      dialogues,
      characterLevels,
      endings,
      uiElements,
      uiPanels,
      uiIcons,
      clickAreas,
      uiAnimations,
      uiFonts,
      uiResponsive,
      gameBalance,
      soundEffects,
      progressionRewards
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CSVLoader;
}