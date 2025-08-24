#!/usr/bin/env node

const LoveConnectDB = require('./api');
const readline = require('readline');

const db = new LoveConnectDB();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎯 LoveConnect Database CLI');
console.log('==========================');

function showMenu() {
  console.log('\n📋 Available commands:');
  console.log('1. stats - Show database statistics');
  console.log('2. users [country] - List all users (optionally filter by country)');
  console.log('3. user <id> - Show user details');
  console.log('4. photos <user_id> - Show user photos');
  console.log('5. matches <user_id> - Show user matches');
  console.log('6. messages <match_id> - Show match messages');
  console.log('7. gifts - Show all available gifts');
  console.log('8. search - Search users with filters');
  console.log('9. add-user - Add new user');
  console.log('10. send-gift <sender_id> <receiver_id> <gift_id> - Send gift');
  console.log('11. like <liker_id> <liked_id> [super] - Add like');
  console.log('12. help - Show this menu');
  console.log('13. exit - Exit CLI');
  console.log('');
}

function handleCommand(input) {
  const [command, ...args] = input.trim().split(' ');

  switch (command.toLowerCase()) {
    case 'stats':
      const stats = db.getStats();
      console.log('📊 Database Statistics:');
      console.log(`👥 Users: ${stats.users}`);
      console.log(`💕 Active Matches: ${stats.matches}`);
      console.log(`💬 Messages: ${stats.messages}`);
      console.log(`🎁 Gifts Sent: ${stats.gifts}`);
      break;

    case 'users':
      const country = args[0];
      const users = db.getAllUsers(country);
      console.log(`👥 Users${country ? ` in ${country.toUpperCase()}` : ''}:`);
      users.forEach(user => {
        console.log(`${user.id}. ${user.name}, ${user.age} (${user.country.toUpperCase()}) ${user.verified ? '✅' : ''} ${user.premium ? '⭐' : ''}`);
      });
      break;

    case 'user':
      const userId = parseInt(args[0]);
      if (!userId) {
        console.log('❌ Please provide user ID');
        break;
      }
      const user = db.getUserById(userId);
      if (user) {
        console.log('👤 User Details:');
        console.log(`Name: ${user.name}`);
        console.log(`Age: ${user.age}`);
        console.log(`Country: ${user.country.toUpperCase()}`);
        console.log(`Bio: ${user.bio || 'No bio'}`);
        console.log(`Verified: ${user.verified ? 'Yes ✅' : 'No'}`);
        console.log(`Premium: ${user.premium ? 'Yes ⭐' : 'No'}`);
        console.log(`Distance: ${user.distance} km`);
      } else {
        console.log('❌ User not found');
      }
      break;

    case 'photos':
      const photoUserId = parseInt(args[0]);
      if (!photoUserId) {
        console.log('❌ Please provide user ID');
        break;
      }
      const photos = db.getUserPhotos(photoUserId);
      console.log(`📸 Photos for user ${photoUserId}:`);
      photos.forEach(photo => {
        console.log(`${photo.order_index + 1}. ${photo.photo_url} ${photo.is_primary ? '(Primary)' : ''}`);
      });
      break;

    case 'matches':
      const matchUserId = parseInt(args[0]);
      if (!matchUserId) {
        console.log('❌ Please provide user ID');
        break;
      }
      const matches = db.getUserMatches(matchUserId);
      console.log(`💕 Matches for user ${matchUserId}:`);
      matches.forEach(match => {
        console.log(`${match.id}. ${match.name}, ${match.age} (${match.country.toUpperCase()})`);
      });
      break;

    case 'messages':
      const matchId = parseInt(args[0]);
      if (!matchId) {
        console.log('❌ Please provide match ID');
        break;
      }
      const messages = db.getMatchMessages(matchId);
      console.log(`💬 Messages for match ${matchId}:`);
      messages.forEach(msg => {
        const time = new Date(msg.sent_at).toLocaleString();
        console.log(`[${time}] ${msg.sender_name}: ${msg.message_text}`);
      });
      break;

    case 'gifts':
      const gifts = db.getAllGifts();
      console.log('🎁 Available Gifts:');
      gifts.forEach(gift => {
        console.log(`${gift.id}. ${gift.icon} ${gift.name} - ${gift.price_czk} Kč / ${gift.price_eur} € / ${gift.price_usd} $ (${gift.category})`);
      });
      break;

    case 'search':
      console.log('🔍 Search filters (press Enter to skip):');
      rl.question('Country: ', (country) => {
        rl.question('Min age: ', (minAge) => {
          rl.question('Max age: ', (maxAge) => {
            rl.question('Max distance: ', (maxDistance) => {
              rl.question('Verified only? (y/n): ', (verified) => {
                rl.question('Premium only? (y/n): ', (premium) => {
                  const filters = {
                    country: country || undefined,
                    minAge: minAge ? parseInt(minAge) : undefined,
                    maxAge: maxAge ? parseInt(maxAge) : undefined,
                    maxDistance: maxDistance ? parseInt(maxDistance) : undefined,
                    verified: verified.toLowerCase() === 'y',
                    premium: premium.toLowerCase() === 'y',
                    limit: 10
                  };
                  
                  const results = db.searchUsers(filters);
                  console.log(`🔍 Search Results (${results.length} found):`);
                  results.forEach(user => {
                    console.log(`${user.id}. ${user.name}, ${user.age} (${user.country.toUpperCase()}) ${user.verified ? '✅' : ''} ${user.premium ? '⭐' : ''}`);
                  });
                  promptCommand();
                });
              });
            });
          });
        });
      });
      return; // Don't call promptCommand() here

    case 'add-user':
      console.log('👤 Add New User:');
      rl.question('Name: ', (name) => {
        rl.question('Age: ', (age) => {
          rl.question('Country (cz/sk/de/etc): ', (country) => {
            rl.question('Bio: ', (bio) => {
              rl.question('Verified? (y/n): ', (verified) => {
                rl.question('Premium? (y/n): ', (premium) => {
                  rl.question('Distance (km): ', (distance) => {
                    const userData = {
                      name,
                      age: parseInt(age),
                      country,
                      bio,
                      verified: verified.toLowerCase() === 'y' ? 1 : 0,
                      premium: premium.toLowerCase() === 'y' ? 1 : 0,
                      distance: parseInt(distance) || 0
                    };
                    
                    const newUser = db.createUser(userData);
                    console.log(`✅ User created with ID: ${newUser.id}`);
                    promptCommand();
                  });
                });
              });
            });
          });
        });
      });
      return;

    case 'send-gift':
      const senderId = parseInt(args[0]);
      const receiverId = parseInt(args[1]);
      const giftId = parseInt(args[2]);
      
      if (!senderId || !receiverId || !giftId) {
        console.log('❌ Usage: send-gift <sender_id> <receiver_id> <gift_id>');
        break;
      }
      
      try {
        db.sendGift(senderId, receiverId, giftId);
        console.log('✅ Gift sent successfully!');
      } catch (error) {
        console.log('❌ Error sending gift:', error.message);
      }
      break;

    case 'like':
      const likerId = parseInt(args[0]);
      const likedId = parseInt(args[1]);
      const isSuper = args[2] === 'super';
      
      if (!likerId || !likedId) {
        console.log('❌ Usage: like <liker_id> <liked_id> [super]');
        break;
      }
      
      try {
        db.addLike(likerId, likedId, isSuper ? 1 : 0);
        console.log(`✅ ${isSuper ? 'Super like' : 'Like'} added!`);
        
        // Check for mutual like
        if (db.checkMutualLike(likerId, likedId)) {
          console.log('🎉 It\'s a mutual like! Creating match...');
          db.createMatch(likerId, likedId);
          console.log('💕 Match created!');
        }
      } catch (error) {
        console.log('❌ Error adding like:', error.message);
      }
      break;

    case 'help':
      showMenu();
      break;

    case 'exit':
      console.log('👋 Goodbye!');
      db.close();
      rl.close();
      return;

    default:
      console.log('❌ Unknown command. Type "help" for available commands.');
      break;
  }

  promptCommand();
}

function promptCommand() {
  rl.question('loveconnect> ', handleCommand);
}

// Start CLI
showMenu();
promptCommand();
