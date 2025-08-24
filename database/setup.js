const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'loveconnect.db');
const db = new Database(dbPath);

console.log('🗄️ Setting up LoveConnect database...');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      password TEXT,
      age INTEGER NOT NULL,
      country TEXT NOT NULL,
      bio TEXT,
      verified INTEGER DEFAULT 0,
      premium INTEGER DEFAULT 0,
      distance INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Photos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      photo_url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Matches table
  db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user1_id INTEGER NOT NULL,
      user2_id INTEGER NOT NULL,
      is_active INTEGER DEFAULT 1,
      matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      message_text TEXT NOT NULL,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Likes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      liker_id INTEGER NOT NULL,
      liked_id INTEGER NOT NULL,
      is_super_like INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (liker_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (liked_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(liker_id, liked_id)
    )
  `);

  // Gifts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS gifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      price_czk INTEGER NOT NULL,
      price_eur REAL NOT NULL,
      category TEXT NOT NULL
    )
  `);

  // Gift transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS gift_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      gift_id INTEGER NOT NULL,
      message TEXT,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (gift_id) REFERENCES gifts(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Tables created successfully');
};

// Insert sample data
const insertSampleData = () => {
  console.log('📝 Inserting sample data...');

  // Sample users
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, age, country, bio, verified, premium, distance)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    ['Tereza', 24, 'cz', 'Miluji cestování a dobrou kávu ☕', 1, 0, 5],
    ['Klára', 26, 'cz', 'Fotografka a milovnice přírody 📸', 1, 1, 12],
    ['Anička', 23, 'cz', 'Studentka medicíny 👩‍⚕️', 1, 0, 8],
    ['Veronika', 27, 'cz', 'Učitelka na základní škole 👩‍🏫', 0, 0, 18],
    ['Nikola', 25, 'cz', 'Grafická designérka 🎨', 1, 1, 22]
  ];

  users.forEach(user => insertUser.run(...user));

  // Sample gifts
  const insertGift = db.prepare(`
    INSERT OR IGNORE INTO gifts (name, icon, price_czk, price_eur, category)
    VALUES (?, ?, ?, ?, ?)
  `);

  const gifts = [
    ['Růže', '🌹', 10, 0.5, 'romantic'],
    ['Čtyřlístek', '🍀', 15, 0.6, 'lucky'],
    ['Srdce', '💖', 30, 1.2, 'romantic'],
    ['Šampáňo', '🥂', 50, 2.0, 'luxury'],
    ['Čokoláda', '🍫', 25, 1.0, 'sweet'],
    ['Diamant', '💎', 200, 8, 'luxury']
  ];

  gifts.forEach(gift => insertGift.run(...gift));

  console.log('✅ Sample data inserted successfully');
};

// Create indexes
const createIndexes = () => {
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
    CREATE INDEX IF NOT EXISTS idx_users_age ON users(age);
    CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user1_id, user2_id);
    CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
    CREATE INDEX IF NOT EXISTS idx_likes_users ON likes(liker_id, liked_id);
  `);
  console.log('✅ Indexes created successfully');
};

// Run setup
try {
  createTables();
  insertSampleData();
  createIndexes();
  
  console.log('🎉 Database setup completed successfully!');
  console.log(`📍 Database location: ${dbPath}`);
  
  // Show stats
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const giftCount = db.prepare('SELECT COUNT(*) as count FROM gifts').get();
  
  console.log(`👥 Users: ${userCount.count}`);
  console.log(`🎁 Gifts: ${giftCount.count}`);
  
} catch (error) {
  console.error('❌ Database setup failed:', error);
} finally {
  db.close();
}