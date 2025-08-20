# Assets Directory

This directory contains all game assets for Café Number Rush.

## Expected Assets Structure

```
assets/
├── backgrounds/
│   ├── bg_cafe_exterior.jpg     # Title screen background
│   ├── bg_cafe_interior.jpg     # Dialogue/game background
│   ├── bg_cafe_full.jpg         # Master ending background
│   ├── bg_cafe_popular.jpg      # Popular ending background
│   ├── bg_cafe_cozy.jpg         # Cozy ending background
│   └── bg_cafe_learning.jpg     # Newbie ending background
├── characters/
│   ├── emma_novice.png          # Emma Level 1-2
│   ├── emma_learning.png        # Emma Level 3-4
│   ├── emma_skilled.png         # Emma Level 5-6
│   ├── emma_veteran.png         # Emma Level 7-8
│   └── emma_master.png          # Emma Level 9-10
├── ui/
│   ├── buttons/
│   │   ├── btn_start.png        # Start button
│   │   ├── btn_settings.png     # Settings button
│   │   └── btn_help.png         # Help button
│   ├── numbers/
│   │   ├── num_01.png           # Number buttons 1-15
│   │   └── ...
│   └── icons/
│       ├── icon_level.png       # Level icon
│       ├── icon_money.png       # Money icon
│       ├── icon_star.png        # Score icon
│       └── icon_clock.png       # Time icon
├── audio/
│   ├── bgm/
│   │   ├── cafe_theme.mp3       # Title BGM
│   │   ├── gameplay.mp3         # Game BGM
│   │   └── ending_*.mp3         # Ending BGMs
│   └── se/
│       ├── click.mp3            # Click sound
│       ├── success.mp3          # Success sound
│       ├── error.mp3            # Error sound
│       └── levelup.mp3          # Level up sound
└── effects/
    ├── particle_success.png     # Success particle
    ├── combo_effect.png         # Combo effect
    └── level_up_burst.png       # Level up effect
```

## Asset Requirements

### Images
- **Format**: PNG for UI elements, JPG for backgrounds
- **Size**: Consistent with CSV specifications
- **Style**: Warm café theme with brown/orange color palette

### Audio
- **Format**: MP3, OGG recommended for web compatibility
- **Quality**: 44.1kHz, 128kbps minimum
- **Volume**: Normalized to prevent clipping

### Placeholder Assets

The game is designed to work with placeholder assets. CSS generates visual elements using:
- Gradients for backgrounds
- Emoji for character representations
- CSS shapes for UI elements
- Web Audio API for sound effects

## Notes

- All asset paths are referenced in CSV files
- Missing assets will fallback to CSS-generated alternatives
- BOM UTF-8 CSV files ensure proper Japanese text display
- Assets can be added incrementally without code changes