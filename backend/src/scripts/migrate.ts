import { pool } from '../config/database';

const createTables = async () => {
  try {
    console.log('🔄 Creating database tables...');

    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Blog posts table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image LONGTEXT,
        is_published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP NULL,
        author_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Blog posts table created');

    await pool.execute(`
      ALTER TABLE blog_posts
      MODIFY COLUMN cover_image LONGTEXT NULL
    `);
    console.log('✅ Blog posts.cover_image column updated');

    // Courses table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        subtitle VARCHAR(500),
        description TEXT,
        category VARCHAR(100),
        language VARCHAR(50) DEFAULT 'English',
        level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
        price DECIMAL(10,2) DEFAULT 0.00,
        thumbnail VARCHAR(500),
        duration VARCHAR(50),
        lessons INT DEFAULT 0,
        learning_objectives TEXT,
        requirements TEXT,
        total_duration VARCHAR(50),
        is_published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Courses table created');

    // Course purchases table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS course_purchases (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        course_id VARCHAR(36) NOT NULL,
        purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        amount DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE KEY unique_purchase (user_id, course_id)
      )
    `);
    console.log('✅ Course purchases table created');

    const adminEmail = 'admin@codewitheugene.com';
    const [existingAdminUser] = await pool.execute(
      'SELECT id, role FROM users WHERE email = ? LIMIT 1',
      [adminEmail]
    );

    if ((existingAdminUser as any[]).length > 0) {
      const adminUser = (existingAdminUser as any[])[0];
      if (adminUser.role !== 'admin') {
        await pool.execute(
          'UPDATE users SET role = ? WHERE id = ?',
          ['admin', adminUser.id]
        );
        console.log(`✅ Promoted existing ${adminEmail} account to admin`);
      }
    } else {
      const adminId = 'admin-' + Date.now();
      const bcrypt = await import('bcrypt');
      const passwordHash = await bcrypt.default.hash('admin123', 10);

      await pool.execute(
        'INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [adminId, adminEmail, passwordHash, 'Admin User', 'admin']
      );
      console.log('✅ Admin user created (email: admin@codewitheugene.com, password: admin123)');
    }

    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

createTables();
