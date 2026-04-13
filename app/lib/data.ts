import {
  CustomerField,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

// ---------------------------------------------------------------------------
// Static data – replaces the database while you're learning locally
// ---------------------------------------------------------------------------

const revenue: Revenue[] = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

const customers = [
  { id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', name: 'Evil Rabbit',       email: 'evil@rabbit.com',    image_url: '/customers/evil-rabbit.png'       },
  { id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', name: 'Delba de Oliveira', email: 'delba@oliveira.com', image_url: '/customers/delba-de-oliveira.png'  },
  { id: '3958dc9e-742f-4377-85e9-fec4b6a6442a', name: 'Lee Robinson',      email: 'lee@robinson.com',   image_url: '/customers/lee-robinson.png'       },
  { id: '76d65c26-f784-44a2-ac19-586678f7c2f2', name: 'Michael Novotny',   email: 'michael@novotny.com',image_url: '/customers/michael-novotny.png'    },
  { id: 'cc27c14a-0acf-4f4a-a6c9-d45682c144b9', name: 'Amy Burns',         email: 'amy@burns.com',      image_url: '/customers/amy-burns.png'          },
  { id: '13d07535-c59e-4157-a011-f8d2ef4e0cbb', name: 'Balazs Orban',      email: 'balazs@orban.com',   image_url: '/customers/balazs-orban.png'       },
];

// Amounts are in cents (e.g. 15795 = $157.95)
const invoices = [
  { id: 'a1b2c3d4-0001-0001-0001-000000000001', customer_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', amount: 15795, status: 'pending' as const, date: '2022-12-06' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000002', customer_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', amount: 20348, status: 'pending' as const, date: '2022-11-14' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000003', customer_id: 'cc27c14a-0acf-4f4a-a6c9-d45682c144b9', amount:  3040, status: 'paid'    as const, date: '2022-10-29' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000004', customer_id: '76d65c26-f784-44a2-ac19-586678f7c2f2', amount: 44800, status: 'paid'    as const, date: '2023-09-10' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000005', customer_id: '13d07535-c59e-4157-a011-f8d2ef4e0cbb', amount: 34577, status: 'pending' as const, date: '2023-08-05' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000006', customer_id: '3958dc9e-742f-4377-85e9-fec4b6a6442a', amount: 54246, status: 'pending' as const, date: '2023-07-16' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000007', customer_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', amount:   666, status: 'pending' as const, date: '2023-06-27' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000008', customer_id: '76d65c26-f784-44a2-ac19-586678f7c2f2', amount: 32545, status: 'paid'    as const, date: '2023-06-09' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000009', customer_id: 'cc27c14a-0acf-4f4a-a6c9-d45682c144b9', amount:  1250, status: 'paid'    as const, date: '2023-06-17' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000010', customer_id: '13d07535-c59e-4157-a011-f8d2ef4e0cbb', amount:  8546, status: 'paid'    as const, date: '2023-06-07' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000011', customer_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', amount:   500, status: 'paid'    as const, date: '2023-08-19' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000012', customer_id: '13d07535-c59e-4157-a011-f8d2ef4e0cbb', amount:  8945, status: 'paid'    as const, date: '2023-06-03' },
  { id: 'a1b2c3d4-0001-0001-0001-000000000013', customer_id: '3958dc9e-742f-4377-85e9-fec4b6a6442a', amount:  1000, status: 'paid'    as const, date: '2022-06-05' },
];

// ---------------------------------------------------------------------------
// Exported fetch functions
// ---------------------------------------------------------------------------

export async function fetchRevenue(): Promise<Revenue[]> {
  return revenue;
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  return invoices
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5)
    .map((inv) => {
      const c = customers.find((c) => c.id === inv.customer_id)!;
      return {
        id: inv.id,
        name: c.name,
        image_url: c.image_url,
        email: c.email,
        amount: formatCurrency(inv.amount),
      };
    });
}

export async function fetchCardData() {
  return {
    numberOfInvoices: invoices.length,
    numberOfCustomers: customers.length,
    totalPaidInvoices: formatCurrency(
      invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    ),
    totalPendingInvoices: formatCurrency(
      invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
    ),
  };
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  const q = query.toLowerCase();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  return invoices
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter((inv) => {
      const c = customers.find((c) => c.id === inv.customer_id)!;
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        String(inv.amount).includes(q) ||
        inv.date.includes(q) ||
        inv.status.includes(q)
      );
    })
    .slice(offset, offset + ITEMS_PER_PAGE)
    .map((inv) => {
      const c = customers.find((c) => c.id === inv.customer_id)!;
      return {
        id: inv.id,
        customer_id: inv.customer_id,
        name: c.name,
        email: c.email,
        image_url: c.image_url,
        date: inv.date,
        amount: inv.amount,
        status: inv.status,
      };
    });
}

export async function fetchInvoicesPages(query: string): Promise<number> {
  const q = query.toLowerCase();
  const count = invoices.filter((inv) => {
    const c = customers.find((c) => c.id === inv.customer_id)!;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      String(inv.amount).includes(q) ||
      inv.date.includes(q) ||
      inv.status.includes(q)
    );
  }).length;

  return Math.ceil(count / ITEMS_PER_PAGE);
}

export async function fetchInvoiceById(id: string): Promise<InvoiceForm | undefined> {
  const inv = invoices.find((i) => i.id === id);
  if (!inv) return undefined;
  return {
    id: inv.id,
    customer_id: inv.customer_id,
    amount: inv.amount / 100,
    status: inv.status,
  };
}

export async function fetchCustomers(): Promise<CustomerField[]> {
  return customers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, name }) => ({ id, name }));
}

export async function fetchFilteredCustomers(query: string) {
  const q = query.toLowerCase();

  return customers
    .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => {
      const custInvoices = invoices.filter((i) => i.customer_id === c.id);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        image_url: c.image_url,
        total_invoices: custInvoices.length,
        total_pending: formatCurrency(custInvoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0)),
        total_paid:    formatCurrency(custInvoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)),
      };
    });
}
