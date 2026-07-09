import dotenv from 'dotenv';
import { pool } from '../config/database';

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error('Usage: npm run db:promote-admin -- <email>');
  process.exit(1);
}

const promoteAdmin = async () => {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if ((users as any[]).length === 0) {
      console.error(`User not found for email: ${email}`);
      process.exit(1);
    }

    const user = (users as any[])[0];

    if (user.role === 'admin') {
      console.log(`${email} is already an admin`);
      process.exit(0);
    }

    await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', user.id]
    );

    console.log(`✅ Promoted ${email} to admin`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to promote admin:', error);
    process.exit(1);
  }
};

void promoteAdmin();
