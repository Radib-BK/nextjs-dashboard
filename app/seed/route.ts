import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = neon(process.env.POSTGRES_URL!);

async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const insertedUser = await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
      ON CONFLICT (id) DO NOTHING;
    `;
    insertedUsers.push(insertedUser);
  }

  return insertedUsers;
}

async function seedInvoices() {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = [];
  for (const invoice of invoices) {
    const invoiceId = randomUUID();
    const insertedInvoice = await sql`
      INSERT INTO invoices (id, customer_id, amount, status, date)
      VALUES (${invoiceId}, ${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
      ON CONFLICT (id) DO NOTHING;
    `;
    insertedInvoices.push(insertedInvoice);
  }

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = [];
  for (const customer of customers) {
    const insertedCustomer = await sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
      ON CONFLICT (id) DO NOTHING;
    `;
    insertedCustomers.push(insertedCustomer);
  }

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = [];
  for (const rev of revenue) {
    const insertedRev = await sql`
      INSERT INTO revenue (month, revenue)
      VALUES (${rev.month}, ${rev.revenue})
      ON CONFLICT (month) DO NOTHING;
    `;
    insertedRevenue.push(insertedRev);
  }

  return insertedRevenue;
}

export async function GET() {
  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed Error:', error);
    return Response.json(
      {
        error: {
          code: (error as { code?: string })?.code,
          message: (error as Error)?.message,
        },
      },
      { status: 500 },
    );
  }
}
