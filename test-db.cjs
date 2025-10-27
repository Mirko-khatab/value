const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin',
      password: 'gM7-3$F<1&4^!',
      database: 'dashboard'
    });
    
    console.log('✅ Database connection successful');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    console.log('✅ Projects count:', rows[0].count);
    
    const [projects] = await connection.execute('SELECT * FROM projects LIMIT 1');
    console.log('✅ Sample project:', projects[0]);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

testConnection();
