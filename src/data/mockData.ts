// Mock data simulating MongoDB backend responses

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  logo: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  destinationUrl: string;
  active: boolean;
  createdAt: string;
}

export interface NfcCard {
  id: string;
  cardId: string;
  businessId: string;
  label: string;
  location: string;
  active: boolean;
  destinationUrl: string;
  totalScans: number;
  createdAt: string;
}

export interface ScanEvent {
  id: string;
  cardId: string;
  businessId: string;
  timestamp: string;
  device: 'mobile' | 'desktop' | 'tablet';
  os: string;
  browser: string;
  country: string;
  city: string;
  isUnique: boolean;
}

export interface Order {
  id: string;
  userId: string;
  businessId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: { name: string; street: string; city: string; zip: string; country: string };
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'business' | 'admin';
  businessId?: string;
}

export const mockUser: User = {
  id: 'user_1',
  email: 'owner@abcrestaurant.com',
  name: 'Marco Rossi',
  role: 'business',
  businessId: 'biz_1'
};

export const mockAdmin: User = {
  id: 'admin_1',
  email: 'admin@tapreview.com',
  name: 'Admin',
  role: 'admin'
};

export const mockBusiness: Business = {
  id: 'biz_1',
  name: 'ABC Restaurant',
  slug: 'abc-restaurant',
  category: 'restaurant',
  logo: '🍽️',
  description: 'Authentic Italian cuisine in the heart of downtown',
  address: '123 Main Street, Downtown',
  phone: '+1 (555) 123-4567',
  website: 'https://abcrestaurant.com',
  destinationUrl: 'https://g.page/r/abc-restaurant-review',
  active: true,
  createdAt: '2024-01-15'
};

export const mockCards: NfcCard[] = [
  {
    id: 'card_1',
    cardId: 'card_8F72K',
    businessId: 'biz_1',
    label: 'Main Counter',
    location: 'Front desk',
    active: true,
    destinationUrl: 'https://g.page/r/abc-restaurant-review',
    totalScans: 5420,
    createdAt: '2024-01-20'
  },
  {
    id: 'card_2',
    cardId: 'card_3M91P',
    businessId: 'biz_1',
    label: 'Table 1',
    location: 'Dining area',
    active: true,
    destinationUrl: 'https://g.page/r/abc-restaurant-review',
    totalScans: 1240,
    createdAt: '2024-02-01'
  },
  {
    id: 'card_3',
    cardId: 'card_7K42N',
    businessId: 'biz_1',
    label: 'Table 2',
    location: 'Dining area',
    active: true,
    destinationUrl: 'https://g.page/r/abc-restaurant-review',
    totalScans: 921,
    createdAt: '2024-02-01'
  },
  {
    id: 'card_4',
    cardId: 'card_5R83T',
    businessId: 'biz_1',
    label: 'Takeaway Counter',
    location: 'Exit',
    active: true,
    destinationUrl: 'https://g.page/r/abc-restaurant-review',
    totalScans: 2103,
    createdAt: '2024-03-10'
  }
];

// Generate scan events for analytics
function generateScanEvents(): ScanEvent[] {
  const events: ScanEvent[] = [];
  const devices = ['mobile', 'mobile', 'mobile', 'tablet', 'desktop'] as const;
  const oses = ['iOS', 'Android', 'iOS', 'Android', 'Windows', 'macOS'];
  const browsers = ['Safari', 'Chrome', 'Chrome', 'Safari', 'Firefox'];
  const countries = ['US', 'US', 'US', 'UK', 'CA', 'DE', 'FR'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'London', 'Toronto', 'Berlin', 'Paris'];

  const now = new Date();
  for (let i = 0; i < 340; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);

    const countryIdx = Math.floor(Math.random() * countries.length);
    events.push({
      id: `scan_${i}`,
      cardId: mockCards[Math.floor(Math.random() * mockCards.length)].cardId,
      businessId: 'biz_1',
      timestamp: date.toISOString(),
      device: devices[Math.floor(Math.random() * devices.length)],
      os: oses[Math.floor(Math.random() * oses.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      country: countries[countryIdx],
      city: cities[countryIdx],
      isUnique: Math.random() > 0.3
    });
  }
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const mockScans: ScanEvent[] = generateScanEvents();

export const mockOrders: Order[] = [
  {
    id: 'order_1',
    userId: 'user_1',
    businessId: 'biz_1',
    items: [{ productId: 'prod_1', quantity: 4, price: 29.99 }],
    total: 119.96,
    status: 'delivered',
    shippingAddress: { name: 'ABC Restaurant', street: '123 Main St', city: 'New York', zip: '10001', country: 'US' },
    createdAt: '2024-01-10'
  },
  {
    id: 'order_2',
    userId: 'user_1',
    businessId: 'biz_1',
    items: [{ productId: 'prod_2', quantity: 2, price: 49.99 }],
    total: 99.98,
    status: 'shipped',
    shippingAddress: { name: 'ABC Restaurant', street: '123 Main St', city: 'New York', zip: '10001', country: 'US' },
    createdAt: '2024-03-05'
  }
];

export const products = [
  { id: 'prod_1', name: 'Starter Pack', description: '4 NFC Review Cards', price: 29.99, cards: 4 },
  { id: 'prod_2', name: 'Business Pack', description: '10 NFC Review Cards', price: 49.99, cards: 10 },
  { id: 'prod_3', name: 'Premium Pack', description: '25 NFC Review Cards + Analytics Pro', price: 99.99, cards: 25 },
  { id: 'prod_4', name: 'Enterprise', description: '50 NFC Review Cards + Custom Branding', price: 199.99, cards: 50 }
];

// Admin mock data
export const allBusinesses: Business[] = [
  mockBusiness,
  { id: 'biz_2', name: 'Luxe Salon', slug: 'luxe-salon', category: 'salon', logo: '💇', description: 'Premium hair salon', address: '456 Oak Ave', phone: '+1 555-9876', website: '', destinationUrl: 'https://g.page/r/luxe-salon', active: true, createdAt: '2024-02-01' },
  { id: 'biz_3', name: 'Urban Gym', slug: 'urban-gym', category: 'gym', logo: '🏋️', description: '24/7 fitness center', address: '789 Pine Rd', phone: '+1 555-4321', website: '', destinationUrl: 'https://g.page/r/urban-gym', active: true, createdAt: '2024-02-15' },
  { id: 'biz_4', name: 'Bella Café', slug: 'bella-cafe', category: 'cafe', logo: '☕', description: 'Artisan coffee & pastries', address: '321 Elm St', phone: '+1 555-7777', website: '', destinationUrl: 'https://g.page/r/bella-cafe', active: true, createdAt: '2024-03-01' },
  { id: 'biz_5', name: 'Dr. Smith Clinic', slug: 'dr-smith-clinic', category: 'clinic', logo: '🏥', description: 'Family medicine', address: '555 Health Blvd', phone: '+1 555-2222', website: '', destinationUrl: 'https://g.page/r/dr-smith', active: false, createdAt: '2024-03-20' },
];

export const adminStats = {
  totalBusinesses: 147,
  totalCards: 892,
  totalOrders: 341,
  totalRevenue: 28450.67,
  totalScans: 124820,
  activeSubscriptions: 89,
  newSignupsThisWeek: 12,
  churnRate: 2.1
};
