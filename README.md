# 💕 LoveConnect - Modern Dating App

Moderní dating aplikace s glassmorphism designem, pokročilými animacemi a mobilními optimalizacemi.

## ✨ Funkce

- 🎨 **Glassmorphism Design** - Moderní transparentní UI s blur efekty
- 💖 **Love-themed Colors** - Růžovo-korálové gradienty
- 📱 **Mobile Optimized** - Touch gestures, pull-to-refresh, haptic feedback
- 🔐 **Autentifikace** - JWT-based login/register systém
- 💬 **Chat Systém** - Real-time messaging
- 🎁 **Gift Shop** - Virtuální dárky pro uživatele
- 💳 **Platby** - Stripe integrace
- 🗄️ **SQLite Database** - Lokální databáze s API

## 🚀 Rychlé spuštění

### Předpoklady
- Node.js (v16 nebo vyšší)
- npm nebo yarn

### Instalace

1. **Klonování repozitáře**
```bash
git clone https://github.com/KOVY/modern-dating-app.git
cd modern-dating-app
```

2. **Instalace závislostí**
```bash
npm install
```

3. **Nastavení databáze**
```bash
npm run db:setup
```

4. **Spuštění aplikace**
```bash
# Spustí server i frontend současně
npm run dev

# Nebo samostatně:
npm run server  # Backend server (port 5000)
npm start       # Frontend React app (port 3000)
```

5. **Otevření v prohlížeči**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📁 Struktura projektu

```
modern-dating-app/
├── src/                    # React frontend
│   ├── components/         # React komponenty
│   ├── contexts/          # React contexts
│   ├── App.tsx            # Hlavní aplikace
│   └── App.css           # Styly s glassmorphism
├── server/                # Express.js backend
│   └── server.js         # API server
├── database/             # SQLite databáze
│   ├── api.js           # Database API
│   ├── setup.js         # Database setup
│   └── cli.js           # Database CLI
└── package.json         # Dependencies a scripts
```

## 🎯 Dostupné skripty

- `npm start` - Spustí React development server
- `npm run server` - Spustí Express.js API server
- `npm run dev` - Spustí server i frontend současně
- `npm run build` - Vytvoří production build
- `npm run db:setup` - Nastaví databázi s ukázkovými daty
- `npm run db:stats` - Zobrazí statistiky databáze

## 🔧 Konfigurace

Upravte `.env` soubor pro vlastní nastavení:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
DB_PATH=./database/loveconnect.db
CORS_ORIGIN=http://localhost:3000
```

## 🎨 Design Features

- **Glassmorphism UI** - Průhledné karty s blur efekty
- **Gradient Backgrounds** - Růžovo-korálové love-themed gradienty
- **Floating Animations** - Plovoucí srdíčka a animace
- **Swipe Gestures** - Touch-friendly swipe animace
- **Pulse Effects** - Match pulse animace
- **Aurora Backgrounds** - Dynamické pozadí

## 📱 Mobile Features

- Touch gestures pro swipe
- Pull-to-refresh funkcionalita
- Haptic feedback simulace
- Responsive design pro všechny zařízení
- Optimalizované pro touch interakce

## 🛠️ Technologie

- **Frontend**: React 19, TypeScript, CSS3
- **Backend**: Node.js, Express.js
- **Database**: SQLite3 s better-sqlite3
- **Auth**: JWT, bcryptjs
- **Payments**: Stripe
- **Styling**: CSS3 s glassmorphism efekty

## 🤝 Přispívání

1. Fork repozitář
2. Vytvoř feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit změny (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otevři Pull Request

## 📄 Licence

Tento projekt je licencován pod MIT licencí.

## 👨‍💻 Autor

**KOVY** - [GitHub](https://github.com/KOVY)

---

💕 Vytvořeno s láskou pro moderní dating experience!