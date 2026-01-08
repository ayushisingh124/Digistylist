# 👔 Digidrobe

**AI-Powered Digital Wardrobe & Outfit Recommendation System**

Turn your closet into a smart wardrobe. Digidrobe uses computer vision to catalog your clothes and generates personalized daily outfit recommendations based on color harmony, style compatibility, and weather.

![React Native](https://img.shields.io/badge/React_Native-Expo-blue?logo=expo)
![Python](https://img.shields.io/badge/Python-Flask-green?logo=python)
![AI](https://img.shields.io/badge/AI-CPU_Only-orange)

---

## 🧠 AI Features

### 1. Automatic Clothing Recognition
When you photograph a clothing item, Digidrobe's AI pipeline:

```
📷 Image → Background Removal → Category Detection → Color Extraction → Attribute Tagging
```

| Stage | Technology | What it does |
|-------|------------|--------------|
| **Background Removal** | `rembg` (U2Net) | Isolates clothing from background |
| **Category Detection** | `MobileNetV2` | Classifies: tops, bottoms, layers, shoes, accessories |
| **Color Extraction** | `OpenCV + K-Means` | Extracts dominant colors (primary + secondary) |
| **Style Detection** | Rule-based | Determines casual/formal/sporty based on attributes |

### 2. Smart Outfit Generation

The outfit engine uses a **scoring algorithm** that considers:

```python
score = (
    color_harmony_score(item1, item2) * 0.4 +
    style_compatibility(item1, item2) * 0.3 +
    variety_bonus(last_worn_days) * 0.2 +
    season_match(current_weather) * 0.1
)
```

#### Color Harmony Rules
- **Complementary pairs**: Navy + White, Black + Cream, Olive + Tan
- **Neutral anchoring**: Neutrals (black, white, gray, navy, beige) pair with everything
- **Monochromatic**: Same color family with different shades

#### Style Compatibility Matrix
| Style | Compatible With |
|-------|----------------|
| Casual | Casual, Sporty |
| Formal | Formal, Smart |
| Smart | Smart, Formal, Casual |
| Sporty | Sporty, Casual |

### 3. Variety Enforcement
- Tracks `wearCount` per item to prioritize unworn clothes
- Prevents outfit repetition within 7 days
- Boosts score for items not worn recently

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| **Today** | Daily outfit recommendation with like/save/remix |
| **Closet** | Wardrobe gallery with category filters |
| **Add Item** | Camera/gallery upload with AI tagging |
| **Profile** | Vibe selector (Chill/Clean/Smart) + preferences |
| **History** | Past outfits with feedback |
| **Onboarding** | 3-screen intro flow |

---

## 🏗️ Architecture

```
┌─────────────────┐       ┌─────────────────┐
│  React Native   │──────▶│   Flask API     │
│  Expo App       │       │   (Python)      │
└─────────────────┘       └────────┬────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Image Processor │    │  Outfit Engine  │    │    SQLite DB    │
│   (rembg, CV)   │    │   (Rules-based) │    │   (Wardrobe)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Expo Go app (iOS/Android)

### 1. Clone & Install

```bash
git clone https://github.com/rishabhpatre/digidrobe.git
cd digidrobe

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Mobile
cd ../mobile
npm install
```

### 2. Run

```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate && python app.py
# → http://localhost:5001

# Terminal 2: Mobile
cd mobile && npx expo start
# → Scan QR with Expo Go
```

### 3. Configure for Phone Testing
Update `mobile/constants/Colors.ts`:
```typescript
export const API_BASE_URL = 'http://YOUR_MAC_IP:5001/api';
```

---

## 📁 Project Structure

```
digidrobe/
├── mobile/                 # React Native Expo
│   ├── app/
│   │   ├── (tabs)/        # Main screens (Today, Closet, Profile)
│   │   ├── (onboarding)/  # Onboarding flow
│   │   ├── add-item.tsx   # Camera upload
│   │   └── history.tsx    # Outfit history
│   ├── services/          # API client + hooks
│   └── constants/         # Design system
│
├── backend/
│   ├── app.py             # Flask API + SQLAlchemy models
│   └── services/
│       ├── image_processor.py  # AI pipeline
│       └── outfit_engine.py    # Recommendation logic
│
└── Design/                # Original mockups
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/wardrobe` | List all items |
| POST | `/api/wardrobe` | Add item |
| POST | `/api/process-image` | AI image analysis |
| GET | `/api/outfit/today` | Get daily outfit |
| POST | `/api/outfit/generate` | Generate new outfit |
| POST | `/api/outfit/:id/feedback` | Like/save outfit |

---

## 🛠️ Tech Stack

**Mobile**: React Native, Expo, TypeScript, Expo Router

**Backend**: Python, Flask, SQLAlchemy, SQLite

**AI/ML** (CPU-only):
- `rembg` - Background removal (U2Net)
- `MobileNetV2` - Image classification
- `OpenCV` - Image processing
- `scikit-learn` - K-Means clustering

---

## 📄 License

MIT

---

Built with ☕ by [@rishabhpatre](https://github.com/rishabhpatre)
