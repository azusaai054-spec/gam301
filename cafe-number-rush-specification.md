# Café Number Rush - 完全ゲーム仕様書

## 📋 プロジェクト概要

### ゲームタイトル：Café Number Rush
- **テーマ**: カフェ経営
- **ジャンル**: 数字クリッカーゲーム（Touch the Numbers風）
- **プラットフォーム**: Electron
- **プレイ時間**: 15-20分（体験版）
- **コンセプト**: カフェで注文番号を正確な順序でクリックして処理する、経営×クリッカーの新感覚ゲーム

### ゲームの独創性
Touch the Numbersの数字順序クリック要素を、カフェ経営シミュレーションと融合。注文番号を正確にクリックすることでカフェの売上を伸ばし、バリスタを成長させる革新的なゲームプレイ。

---

## 🎮 ゲームシステム設計

### コアメカニクス
1. **注文処理システム**: 
   - 画面に1-15の注文番号がランダム配置
   - プレイヤーは1から順番に正確にクリック
   - 正確性と速度でスコア算出
   
2. **カフェ成長システム**:
   - 処理した注文数に応じてカフェレベル上昇
   - 新メニュー解放、店舗装飾追加
   - 効率化アイテム（自動処理、時間延長等）

3. **バリスタ育成システム**:
   - キャラクターの外見・能力が5段階で成長
   - スキル習得で処理効率向上
   - 感情表現がプレイヤーのパフォーマンスに連動

### プレイフロー（15-20分）
```
開始 → チュートリアル(2分) → メインゲーム(10-15分) → エンディング(3分)
```

### 難易度バランス
- **初級（Lv1-3）**: 1-5の数字、15秒制限
- **中級（Lv4-6）**: 1-8の数字、12秒制限  
- **上級（Lv7-10）**: 1-12の数字、10秒制限
- **最高級（Lv11+）**: 1-15の数字、8秒制限

---

## 🖥️ 必須4画面UI/UX設計

### 【必須1】タイトル画面
```
┌─────────────────────────────────────────┐
│    ☕ Café Number Rush ☕              │
│                                         │
│     [立ち絵: メインバリスタ エマ]      │
│                                         │
│         🎮 ゲーム開始                   │
│         📖 ストーリー                   │
│         ⚙️ 設定                        │
│         ❓ ヘルプ                       │
│                                         │
│    背景: 温かみのあるカフェ店内         │
│    BGM: アコースティックカフェBGM       │
└─────────────────────────────────────────┘
```

**インタラクティブ要素**:
- ボタンホバー時にエマが反応
- 背景の湯気アニメーション
- メニューボタンのパーティクルエフェクト

### 【必須2】会話シーン画面
```
┌─────────────────────────────────────────┐
│  [キャラ立ち絵]     [背景: カフェ内]    │
│                                         │
│   😊 エマ                               │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │「いらっしゃいませ！今日も            │ │
│  │  たくさんのお客様が...」             │ │
│  │                              [▶] │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**機能**:
- タイプライター風テキスト表示
- キャラクター感情表現（😊😅😰😤🥰）
- 背景の状況変化（忙しさに応じて）
- 音声効果との同期

### 【必須3】メインゲーム画面
```
┌─────────────────────────────────────────┐
│ Lv:5 💰:1,250 ⭐:850 ⏰:00:45        │
├─────────────────────────────────────────┤
│  [エマ立ち絵]  │    注文ボード         │
│    😊          │  ┌─────────────────┐   │
│                │  │ 7   3   12   5  │   │
│  「頑張って！」 │  │   9    1    8   │   │
│                │  │ 4   11   2   15 │   │
│                │  │   6    10   14  │   │
│                │  └─────────────────┘   │
├─────────────────────────────────────────┤
│ ☕コーヒー ×12  🥐クロワッサン ×7     │
│ 🍰ケーキ   ×5   🥤ドリンク     ×8     │
└─────────────────────────────────────────┘
```

**UI要素**:
- **HUD**: レベル、所持金、スター（評価）、残り時間
- **注文ボード**: 数字クリックエリア（動的配置）
- **キャラクター**: リアルタイム感情表現
- **商品カウンター**: 売上実績表示
- **コンボメーター**: 連続成功時のボーナス表示

### 【必須4】マルチエンディング画面
```
┌─────────────────────────────────────────┐
│           🏆 カフェマスター               │
│                                         │
│     [専用背景: 満員のカフェ]             │
│                                         │
│        [エマ: 最高レベル衣装]           │
│                                         │
│   「あなたのおかげで、街で一番の         │
│    カフェになりました！」               │
│                                         │
│      最終スコア: 2,450 ⭐              │
│      達成度: S ランク                   │
│                                         │
│       [🔄 もう一度]  [📋 結果]          │
└─────────────────────────────────────────┘
```

**4種類のエンディング**:
1. **カフェマスター** (2000⭐以上): 大成功、満員のカフェ
2. **人気店オーナー** (1200-1999⭐): 成功、賑わうカフェ  
3. **街の憩いの場** (600-1199⭐): 普通、アットホームなカフェ
4. **新人バリスタ** (600⭐未満): 成長の余地、温かい励まし

---

## 👥 キャラクター設定

### メインキャラクター：エマ（バリスタ）
**基本設定**:
- 年齢：20歳、カフェ経営を夢見る新人バリスタ
- 性格：前向き、努力家、客思い
- 夢：最高のカフェを作ること

**5段階成長システム**:

| レベル | 外見 | 衣装 | 感情表現 | 特殊能力 |
|--------|------|------|----------|----------|
| Lv1-2 | 初心者 | 基本エプロン | 😅😰 | なし |
| Lv3-4 | 慣れてきた | カフェ帽追加 | 😊😅 | 時間+2秒 |
| Lv5-6 | 熟練者 | おしゃれエプロン | 😊🥰 | オートヒント |
| Lv7-8 | ベテラン | プロ仕様制服 | 😊😤 | コンボボーナス×1.5 |
| Lv9-10 | マスター | 店長風衣装 | 🥰😊 | 全能力最大化 |

### サブキャラクター

**常連客：田中さん（65歳）**
- 毎日来る優しいおじいさん
- エマを見守る存在
- エンディングで重要な役割

**ライバル店主：リナ（25歳）**  
- 向かいのカフェオーナー
- 競争心旺盛だが根は良い人
- 高スコア時に登場

---

## 🎭 ストーリー・エンディング設計

### プロローグ
```
エマ: 「今日から私が任されることになったこのカフェ...
      お客様に喜んでもらえるよう、精一杯頑張ります！」
```

### 【エンディング1】カフェマスター（2000⭐以上）
- **背景**: 満員で活気あふれるカフェ
- **BGM**: 華やかな成功テーマ
- **演出**: 客の拍手、花束贈呈
- **エマの台詞**: 「夢だったカフェマスターになれました！」

### 【エンディング2】人気店オーナー（1200-1999⭐）
- **背景**: 賑わう地域密着カフェ
- **BGM**: 温かい成功テーマ  
- **演出**: 常連客との交流
- **エマの台詞**: 「みんなの憩いの場所になれて嬉しいです」

### 【エンディング3】街の憩いの場（600-1199⭐）
- **背景**: アットホームな小さなカフェ
- **BGM**: 穏やかな日常テーマ
- **演出**: ゆったりとした時間の流れ
- **エマの台詞**: 「小さくても愛されるカフェを目指します」

### 【エンディング4】新人バリスタ（600⭐未満）
- **背景**: がんばる新人の姿
- **BGM**: 希望に満ちた応援テーマ
- **演出**: 田中さんからの励まし
- **エマの台詞**: 「まだまだですが、諦めません！」

---

## 📊 CSV完全外部化システム（必須15ファイル）

### 🔴 絶対必須：BOM付きUTF-8エンコーディング仕様
```javascript
// 全CSVファイル生成時の絶対ルール
const BOM = '\uFEFF'; // Byte Order Mark
const encoding = 'utf-8'; // BOM付きUTF-8
const lineBreak = '\r\n'; // Windows互換CRLF
const delimiter = ','; // カンマ区切り
const quote = '"'; // ダブルクォートエスケープ

// Excel直接開き対応で日本語文字化け完全防止
```

### CSV一覧（15ファイル必須）

#### 1. scenes.csv（シーン管理）
```csv
scene_id,scene_name,background_image,bgm_file,duration
title,タイトル画面,bg_cafe_exterior.jpg,bgm_cafe_theme.mp3,0
tutorial,チュートリアル,bg_cafe_interior.jpg,bgm_tutorial.mp3,120
main_game,メインゲーム,bg_game_board.jpg,bgm_gameplay.mp3,900
ending_master,カフェマスター,bg_cafe_full.jpg,bgm_ending_master.mp3,30
```

#### 2. characters.csv（キャラクター設定）
```csv
character_id,name,age,role,personality,dream
emma,エマ,20,メインバリスタ,前向き・努力家・客思い,最高のカフェを作る
tanaka,田中さん,65,常連客,優しい・見守る,エマの成長を応援
lina,リナ,25,ライバル店主,競争心旺盛・根は良い,街一番のカフェ
```

#### 3. dialogues.csv（会話データ）
```csv
dialogue_id,character_id,text,emotion,voice_file,timing
intro_001,emma,いらっしゃいませ！今日もたくさんのお客様が...,happy,voice_emma_001.mp3,0
tutorial_001,emma,注文番号を1から順番にクリックしてくださいね,normal,voice_emma_002.mp3,2
ending_master_001,emma,あなたのおかげで、街で一番のカフェになりました！,joy,voice_emma_050.mp3,0
```

#### 4. character_levels.csv（レベル別外見）
```csv
character_id,level_min,level_max,sprite_file,costume,emotion_set,special_ability
emma,1,2,emma_novice.png,基本エプロン,nervous;worried,none
emma,3,4,emma_learning.png,カフェ帽追加,happy;nervous,time_bonus_2
emma,5,6,emma_skilled.png,おしゃれエプロン,happy;love,auto_hint
emma,7,8,emma_veteran.png,プロ仕様制服,happy;determined,combo_bonus_1_5
emma,9,10,emma_master.png,店長風衣装,love;happy,all_max
```

#### 5. endings.csv（エンディング分岐）
```csv
ending_id,name,score_min,score_max,background,bgm,special_effects
master,カフェマスター,2000,9999,bg_cafe_full.jpg,bgm_ending_master.mp3,applause;flowers
popular,人気店オーナー,1200,1999,bg_cafe_popular.jpg,bgm_ending_popular.mp3,customer_chat
cozy,街の憩いの場,600,1199,bg_cafe_cozy.jpg,bgm_ending_cozy.mp3,peaceful_ambiance
newbie,新人バリスタ,0,599,bg_cafe_learning.jpg,bgm_ending_newbie.mp3,encouragement
```

#### 6. ui_elements.csv（UI要素）
```csv
element_id,type,image_file,x,y,width,height,z_index,tooltip
start_button,button,btn_start.png,400,300,200,50,10,ゲームを開始します
settings_button,button,btn_settings.png,400,360,200,50,10,設定画面を開きます
number_1,clickable,num_01.png,100,100,60,60,5,注文番号1
number_2,clickable,num_02.png,180,100,60,60,5,注文番号2
```

#### 7. ui_panels.csv（パネル配置）
```csv
panel_id,panel_type,x,y,width,height,background_color,opacity,border_radius,z_index
hud_panel,info,0,0,800,80,#2C1810,0.9,0,8
game_board,main,50,100,700,500,#F5E6D3,0.95,10,5
character_panel,side,650,150,140,300,#FFFFFF,0.85,15,6
```

#### 8. ui_icons.csv（アイコン設定）
```csv
icon_id,image_file,size,tooltip_text,animation_type
level_icon,icon_level.png,24,現在のレベル,none
money_icon,icon_money.png,24,所持金,coin_spin
star_icon,icon_star.png,24,評価スコア,sparkle
time_icon,icon_clock.png,24,残り時間,tick
```

#### 9. click_areas.csv（クリック可能エリア）
```csv
area_id,x,y,width,height,click_effect,sound_effect,animation
number_click,0,0,60,60,number_process,click_sound.mp3,button_press
menu_hover,0,0,200,50,highlight,hover_sound.mp3,glow_effect
character_interact,650,150,140,300,character_reaction,interaction.mp3,bounce
```

#### 10. ui_animations.csv（アニメーション設定）
```csv
animation_id,target_element,animation_type,duration,easing,loop,trigger_event
button_hover,button,scale,0.2,ease-out,false,mouseover
number_click,number,bounce,0.3,ease-in-out,false,click
level_up,character,celebration,1.0,ease-out,false,level_change
combo_effect,game_board,particle,0.5,linear,false,combo_trigger
```

#### 11. ui_fonts.csv（フォント設定）
```csv
font_id,font_family,size,weight,color,shadow_color,shadow_offset_x,shadow_offset_y
title_font,Noto Sans JP,48,bold,#2C1810,#FFFFFF,2,2
dialogue_font,Noto Sans JP,18,normal,#2C1810,none,0,0
hud_font,Noto Sans JP,16,bold,#FFFFFF,#000000,1,1
score_font,Noto Sans JP,24,bold,#FFD700,#8B4513,1,1
```

#### 12. ui_responsive.csv（画面サイズ対応）
```csv
screen_size,min_width,max_width,scale_factor,layout_type,font_size_multiplier
mobile,320,768,0.8,vertical,0.9
tablet,769,1024,0.9,compact,0.95
desktop,1025,1920,1.0,standard,1.0
large,1921,9999,1.1,extended,1.05
```

#### 13. game_balance.csv（ゲームバランス）
```csv
level,numbers_max,time_limit,score_multiplier,unlock_requirement,new_features
1,5,15,1.0,0,基本操作
2,5,14,1.1,100,コンボシステム
3,6,13,1.2,250,新メニュー：カプチーノ
4,7,12,1.3,450,時間ボーナス
5,8,11,1.4,700,自動ヒント機能
```

#### 14. sound_effects.csv（音響効果）
```csv
sound_id,file_name,volume,loop,category,trigger_condition
click_sound,click.mp3,0.7,false,effect,number_click
success_sound,success.mp3,0.8,false,effect,correct_sequence
level_up_sound,levelup.mp3,0.9,false,effect,level_increase
bgm_title,cafe_theme.mp3,0.5,true,bgm,scene_title
bgm_game,gameplay.mp3,0.4,true,bgm,scene_main_game
```

#### 15. progression_rewards.csv（進行報酬）
```csv
level,reward_type,reward_value,unlock_content,description
1,none,0,tutorial,基本操作を覚えましょう
2,time_bonus,2,combo_system,連続成功でボーナス！
3,menu_item,cappuccino,new_drink,カプチーノが追加されました
4,efficiency,auto_hint,hint_system,数字の順番をヒント表示
5,decoration,plant_pot,cafe_decoration,観葉植物で店内を装飾
```

---

## 🎨 UI画像・アニメーション仕様

### 必須画像ファイル構成

#### ボタン画像（3状態必須）
```
/assets/ui/buttons/
├── btn_start_normal.png (200×50px)
├── btn_start_hover.png  (200×50px) 
├── btn_start_pressed.png (200×50px)
├── btn_settings_normal.png (200×50px)
├── btn_settings_hover.png (200×50px)
├── btn_settings_pressed.png (200×50px)
```

#### キャラクター画像
```
/assets/characters/emma/
├── emma_lv1_normal.png (140×300px)
├── emma_lv1_happy.png (140×300px)
├── emma_lv1_nervous.png (140×300px)
├── emma_lv2_normal.png (140×300px)
├── emma_lv2_happy.png (140×300px)
[...レベル5まで、各感情表現]
```

#### 背景画像
```
/assets/backgrounds/
├── bg_cafe_exterior.jpg (800×600px) // タイトル
├── bg_cafe_interior.jpg (800×600px) // ゲーム中
├── bg_cafe_full.jpg (800×600px)     // マスターエンディング
├── bg_cafe_popular.jpg (800×600px) // 人気店エンディング
├── bg_cafe_cozy.jpg (800×600px)    // 憩いの場エンディング
├── bg_cafe_learning.jpg (800×600px) // 新人エンディング
```

#### ゲーム要素画像
```
/assets/game/
├── numbers/
│   ├── num_01.png (60×60px)
│   ├── num_02.png (60×60px)
│   └── [...15まで]
├── icons/
│   ├── icon_level.png (24×24px)
│   ├── icon_money.png (24×24px)
│   ├── icon_star.png (24×24px)
│   └── icon_clock.png (24×24px)
└── effects/
    ├── particle_success.png (32×32px)
    ├── combo_effect.png (128×128px)
    └── level_up_burst.png (256×256px)
```

### アニメーション仕様

#### 1. ボタンアニメーション
```css
.button-hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(44, 24, 16, 0.3);
  transition: all 0.2s ease-out;
}

.button-pressed {
  transform: scale(0.95);
  transition: all 0.1s ease-in;
}
```

#### 2. 数字クリックエフェクト
```css
.number-click {
  animation: numberBounce 0.3s ease-in-out;
}

@keyframes numberBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
```

#### 3. レベルアップエフェクト
```css
.level-up {
  animation: levelUpCelebration 1s ease-out;
}

@keyframes levelUpCelebration {
  0% { transform: scale(1); opacity: 1; }
  25% { transform: scale(1.1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}
```

#### 4. コンボエフェクト
```css
.combo-effect {
  animation: comboSparkle 0.5s linear;
  position: absolute;
  pointer-events: none;
}

@keyframes comboSparkle {
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.5); }
}
```

### 音響効果タイミング
- **クリック音**: 数字クリック時即座再生
- **成功音**: 正解時0.1秒遅延
- **レベルアップ音**: アニメーション開始と同時
- **BGM遷移**: 0.5秒フェードイン/アウト

---

## 💻 実装サンプルコード

### CSVローダー（BOM付きUTF-8対応）
```javascript
class CSVLoader {
  static async loadCSV(filename) {
    try {
      const response = await fetch(`./data/${filename}`);
      let text = await response.text();
      
      // BOM (Byte Order Mark) を削除
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      
      // CRLF区切りでパース
      const lines = text.split('\r\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      
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
      if (char === '"') {
        inQuotes = !inQuotes;
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
}

// 使用例
const characters = await CSVLoader.loadCSV('characters.csv');
const dialogues = await CSVLoader.loadCSV('dialogues.csv');
```

### ゲームコントローラー
```javascript
class CafeNumberRush {
  constructor() {
    this.gameData = {};
    this.currentLevel = 1;
    this.score = 0;
    this.timeRemaining = 15;
    this.currentSequence = [];
    this.targetSequence = [];
    this.gameState = 'title'; // title, playing, ended
  }
  
  async initialize() {
    // 全CSVデータ読み込み
    this.gameData.characters = await CSVLoader.loadCSV('characters.csv');
    this.gameData.dialogues = await CSVLoader.loadCSV('dialogues.csv');
    this.gameData.balance = await CSVLoader.loadCSV('game_balance.csv');
    this.gameData.ui = await CSVLoader.loadCSV('ui_elements.csv');
    this.gameData.endings = await CSVLoader.loadCSV('endings.csv');
    
    this.setupUI();
    this.loadSoundEffects();
  }
  
  generateNumbers() {
    const levelData = this.gameData.balance.find(b => b.level == this.currentLevel);
    const maxNumbers = parseInt(levelData.numbers_max);
    
    // 1からmaxNumbersまでの数字をランダム配置
    this.targetSequence = Array.from({length: maxNumbers}, (_, i) => i + 1);
    this.shuffleNumbers();
    this.displayNumbers();
    
    this.timeRemaining = parseInt(levelData.time_limit);
    this.startTimer();
  }
  
  shuffleNumbers() {
    const container = document.getElementById('game-board');
    const positions = this.generateRandomPositions();
    
    this.targetSequence.forEach((num, index) => {
      const button = document.createElement('button');
      button.textContent = num;
      button.className = 'number-button';
      button.style.left = positions[index].x + 'px';
      button.style.top = positions[index].y + 'px';
      button.onclick = () => this.clickNumber(num);
      container.appendChild(button);
    });
  }
  
  clickNumber(number) {
    const expectedNumber = this.currentSequence.length + 1;
    
    if (number === expectedNumber) {
      this.currentSequence.push(number);
      this.playSound('success_sound');
      this.animateSuccess(number);
      
      if (this.currentSequence.length === this.targetSequence.length) {
        this.levelComplete();
      }
    } else {
      this.playSound('error_sound');
      this.animateError(number);
      this.resetSequence();
    }
  }
  
  levelComplete() {
    const levelData = this.gameData.balance.find(b => b.level == this.currentLevel);
    const timeBonus = this.timeRemaining * 10;
    const levelScore = parseInt(levelData.score_multiplier * 100) + timeBonus;
    
    this.score += levelScore;
    this.currentLevel++;
    
    this.playSound('level_up_sound');
    this.animateLevelUp();
    this.updateCharacterLevel();
    
    if (this.currentLevel <= 10) {
      setTimeout(() => this.generateNumbers(), 2000);
    } else {
      this.endGame();
    }
  }
  
  updateCharacterLevel() {
    const characterLevel = this.gameData.character_levels.find(
      cl => cl.character_id === 'emma' && 
           this.currentLevel >= cl.level_min && 
           this.currentLevel <= cl.level_max
    );
    
    if (characterLevel) {
      const img = document.getElementById('character-image');
      img.src = `./assets/characters/${characterLevel.sprite_file}`;
      
      // 特殊能力適用
      if (characterLevel.special_ability !== 'none') {
        this.applySpecialAbility(characterLevel.special_ability);
      }
    }
  }
  
  endGame() {
    this.gameState = 'ended';
    const ending = this.gameData.endings.find(e => 
      this.score >= e.score_min && this.score <= e.score_max
    );
    
    this.showEnding(ending);
  }
  
  showEnding(ending) {
    const endingScreen = document.getElementById('ending-screen');
    
    // 背景とBGM変更
    document.body.style.backgroundImage = `url(./assets/backgrounds/${ending.background})`;
    this.playBGM(ending.bgm);
    
    // エンディングテキスト表示
    const endingText = this.gameData.dialogues.filter(
      d => d.dialogue_id.startsWith(`ending_${ending.ending_id}`)
    );
    
    this.displayEndingDialogue(endingText);
    endingScreen.style.display = 'block';
  }
  
  async saveProgress() {
    const saveData = {
      level: this.currentLevel,
      score: this.score,
      character_level: Math.floor(this.currentLevel / 2) + 1,
      timestamp: Date.now()
    };
    
    localStorage.setItem('cafe_number_rush_save', JSON.stringify(saveData));
  }
}

// ゲーム初期化
const game = new CafeNumberRush();
game.initialize();
```

### レスポンシブUI管理
```css
/* レスポンシブ対応 */
@media (max-width: 768px) {
  .game-container {
    transform: scale(0.8);
    transform-origin: top left;
  }
  
  .number-button {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
  
  .character-panel {
    width: 120px;
    height: 250px;
  }
}

@media (min-width: 1921px) {
  .game-container {
    transform: scale(1.1);
    transform-origin: center;
  }
  
  .number-button {
    width: 72px;
    height: 72px;
    font-size: 28px;
  }
}

/* アクセシビリティ対応 */
.number-button:focus {
  outline: 3px solid #FFD700;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .number-button, .character-image {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 🎯 想定プレイフロー（時系列）

### 導入フェーズ（2分）
```
0:00-0:30  タイトル画面、雰囲気に浸る
0:30-1:00  ストーリー導入、エマとの出会い
1:00-2:00  チュートリアル、基本操作習得
```

### メインゲームフェーズ（13分）
```
2:00-4:00  レベル1-2：基本操作の習得
4:00-7:00  レベル3-5：コンボシステム理解
7:00-11:00 レベル6-8：効率化アイテム活用
11:00-15:00 レベル9-10：最高難易度挑戦
```

### エンディングフェーズ（3分）
```
15:00-16:00 結果集計、エンディング分岐
16:00-18:00 選択されたエンディング再生
18:00-18:30 リプレイ促進、最終スコア表示
```

### プレイヤー体験設計
1. **満足感**: 数字を正確にクリックする達成感
2. **成長感**: キャラクターとカフェの視覚的成長
3. **発見感**: 新メニュー・新能力の段階的解放
4. **再挑戦欲**: より高いエンディングを目指したくなる

---

## 🔧 技術実装仕様

### ファイル構成
```
cafe-number-rush/
├── index.html
├── css/
│   ├── main.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── main.js
│   ├── csv-loader.js
│   ├── game-controller.js
│   ├── ui-manager.js
│   └── audio-manager.js
├── data/ (15個のCSVファイル)
│   ├── scenes.csv
│   ├── characters.csv
│   ├── dialogues.csv
│   ├── character_levels.csv
│   ├── endings.csv
│   ├── ui_elements.csv
│   ├── ui_panels.csv
│   ├── ui_icons.csv
│   ├── click_areas.csv
│   ├── ui_animations.csv
│   ├── ui_fonts.csv
│   ├── ui_responsive.csv
│   ├── game_balance.csv
│   ├── sound_effects.csv
│   └── progression_rewards.csv
├── assets/
│   ├── backgrounds/
│   ├── characters/
│   ├── ui/
│   ├── audio/
│   └── effects/
└── package.json (Electron設定)
```

### CSV生成コード例
```javascript
// BOM付きUTF-8でCSV生成
function generateCSVWithBOM(data, filename) {
  const BOM = '\uFEFF';
  const csvContent = data.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\r\n');
  
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// 使用例
const charactersData = [
  ['character_id', 'name', 'age', 'role'],
  ['emma', 'エマ', '20', 'メインバリスタ'],
  ['tanaka', '田中さん', '65', '常連客']
];

generateCSVWithBOM(charactersData, 'characters.csv');
```

### LocalStorage自動セーブ
```javascript
class AutoSave {
  constructor(interval = 5000) {
    this.interval = interval;
    this.startAutoSave();
  }
  
  startAutoSave() {
    setInterval(() => {
      const gameState = {
        level: game.currentLevel,
        score: game.score,
        character_progress: game.characterLevel,
        settings: game.settings,
        timestamp: Date.now()
      };
      
      localStorage.setItem('cafe_number_rush_autosave', 
        JSON.stringify(gameState));
    }, this.interval);
  }
  
  loadAutoSave() {
    const saved = localStorage.getItem('cafe_number_rush_autosave');
    return saved ? JSON.parse(saved) : null;
  }
}
```

---

## 📈 成功指標と品質保証

### 必須達成項目チェックリスト
- ✅ **必須4画面実装**: タイトル・会話・メインゲーム・マルチエンディング
- ✅ **15個以上のCSVファイル**: 全ゲーム設定の外部化
- ✅ **BOM付きUTF-8エンコーディング**: 日本語文字化け完全防止
- ✅ **4種類エンディング**: スコア別分岐システム
- ✅ **キャラクター5段階成長**: 視覚的フィードバック
- ✅ **音響システム**: BGM・効果音の完全実装
- ✅ **レスポンシブ対応**: 複数画面サイズサポート
- ✅ **自動セーブ機能**: 進行状況保持

### 品質基準
- **操作応答性**: クリック応答時間 < 100ms
- **CSV読み込み**: 全データ読み込み時間 < 2秒
- **アニメーション**: 60fps維持
- **音声遅延**: < 50ms
- **メモリ使用量**: < 256MB

### 拡張可能性
- CSV編集による容易なバランス調整
- 新キャラクター・新レベルの追加
- 多言語対応（CSV内テキスト変更のみ）
- 新エンディング追加
- カスタムテーマ対応

---

## 🎮 Claude Code実装指示

この仕様書をもとに、以下の優先順位で実装してください：

### フェーズ1：基盤システム
1. CSVローダー（BOM付きUTF-8対応）実装
2. 15個のCSVファイル生成
3. 基本的なゲームエンジン構築

### フェーズ2：必須4画面
1. タイトル画面（立ち絵・メニュー）
2. メインゲーム画面（数字クリッカー）
3. 会話シーン（タイプライター効果）
4. マルチエンディング画面（4種類分岐）

### フェーズ3：ゲームシステム
1. 数字クリック判定・スコアリング
2. レベル進行・キャラクター成長
3. 自動セーブ機能
4. 音響システム

### フェーズ4：最終調整
1. アニメーション・エフェクト
2. レスポンシブ対応
3. バランス調整
4. バグ修正・最適化

**重要**: 必ずBOM付きUTF-8形式でCSVファイルを生成し、Excelで直接開いても日本語が文字化けしないことを確認してください。

この仕様書に従って、完全なElectronゲーム「Café Number Rush」を実装してください。