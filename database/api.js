const Database = require('better-sqlite3');
const path = require('path');

class LoveConnectDB {
  constructor() {
    const dbPath = path.join(__dirname, 'loveconnect.db');
    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');
  }

  // Users
  getAllUsers(country = null) {
    let query = 'SELECT * FROM users';
    if (country) {
      query += ' WHERE country = ?';
      return this.db.prepare(query).all(country);
    }
    return this.db.prepare(query).all();
  }

  getUserById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  createUser(userData) {
    const { name, age, country, bio, verified = 0, premium = 0, distance = 0 } = userData;
    const result = this.db.prepare(`
      INSERT INTO users (name, age, country, bio, verified, premium, distance)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, age, country, bio, verified, premium, distance);
    
    return this.getUserById(result.lastInsertRowid);
  }

  updateUser(id, userData) {
    const fields = Object.keys(userData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(userData);
    values.push(id);
    
    this.db.prepare(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(...values);
    
    return this.getUserById(id);
  }

  deleteUser(id) {
    return this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  // Photos
  getUserPhotos(userId) {
    return this.db.prepare(`
      SELECT * FROM photos 
      WHERE user_id = ? 
      ORDER BY order_index ASC
    `).all(userId);
  }

  addUserPhoto(userId, photoUrl, isPrimary = 0, orderIndex = 0) {
    return this.db.prepare(`
      INSERT INTO photos (user_id, photo_url, is_primary, order_index)
      VALUES (?, ?, ?, ?)
    `).run(userId, photoUrl, isPrimary, orderIndex);
  }

  // Statistics
  getStats() {
    const users = this.db.prepare('SELECT COUNT(*) as count FROM users').get();
    const matches = this.db.prepare('SELECT COUNT(*) as count FROM matches WHERE is_active = 1').get();
    const messages = this.db.prepare('SELECT COUNT(*) as count FROM messages').get();
    const gifts = this.db.prepare('SELECT COUNT(*) as count FROM gift_transactions').get();
    
    return {
      users: users.count,
      matches: matches.count,
      messages: messages.count,
      gifts: gifts.count
    };
  }

  close() {
    this.db.close();
  }
}

module.exports = LoveConnectDB;