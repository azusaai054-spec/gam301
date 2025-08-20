# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Café Number Rush

**Genre**: カフェ経営 × 数字クリッカーゲーム  
**Platform**: Electron  
**Specification**: cafe-number-rush-specification.md

## CSV Data Management (Critical)

**All CSV files MUST use BOM-encoded UTF-8:**
```javascript
const BOM = '\uFEFF'; // Byte Order Mark - Required for Japanese text
const encoding = 'utf-8'; // BOM付きUTF-8
const lineBreak = '\r\n'; // Windows compatible CRLF
```

**Required CSV Files (15 minimum):**
- scenes.csv, characters.csv, dialogues.csv
- character_levels.csv, endings.csv
- ui_elements.csv, ui_panels.csv, ui_icons.csv
- click_areas.csv, ui_animations.csv, ui_fonts.csv
- ui_responsive.csv, game_balance.csv, sound_effects.csv
- progression_rewards.csv

## Development Commands

```bash
# Electron development
npm install
npm start

# CSV validation
npm run validate-csv

# Build for distribution
npm run build
```

## Required 4 Screens (Must Implement)

1. **Title Screen**: Character portraits, 4 menu options, interactive elements
2. **Dialogue Scene**: Typewriter text effect, character emotions, background changes  
3. **Main Game Screen**: Number clicking game board, HUD, character growth visualization
4. **Multi-Ending Screen**: 4 different endings based on score (600/1200/2000+ thresholds)

## Core Game Mechanics

- **Number Click System**: Touch the Numbers style - click numbers 1-15 in correct sequence
- **Café Management**: Level progression unlocks new menu items and decorations
- **Character Growth**: 5-stage Emma (barista) evolution with visual changes
- **Scoring System**: Time bonus + accuracy + combo multipliers

## Architecture Notes

- **CSV-Driven Design**: All game data externalized for easy modification
- **Responsive UI**: Support mobile/tablet/desktop screen sizes
- **Auto-Save**: LocalStorage every 5 seconds
- **Asset Organization**: Separate folders for backgrounds, characters, UI, audio, effects

## File Structure

```
├── data/ (15+ CSV files)
├── assets/ (images, audio)
├── css/ (responsive, animations)
└── js/ (modular game systems)
```