export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    href: "/vendor/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Products",
    href: "/vendor/dashboard/products",
    icon: "ShoppingBag",
  },
  {
    title: "Services",
    href: "/vendor/dashboard/services",
    icon: "Wrench",
  },
  {
    title: "Orders",
    href: "/vendor/dashboard/orders",
    icon: "Package",
  },
  {
    title: "Reviews",
    href: "/vendor/dashboard/reviews",
    icon: "MessageSquare",
  },
  {
    title: "Analytics",
    href: "/vendor/dashboard/analytics",
    icon: "BarChart",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
  },
];

export const MOCK_STORE = {
  id: "store-123",
  name: "Quantum Tech",
  slug: "quantum-tech",
  bio: "Premium electronics and tech services",
  logo: "https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  rating: 4.7,
  totalSales: 128450,
  totalProducts: 56,
  totalServices: 12,
};

export const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "iPhone 15 Pro",
    description: "Latest Apple smartphone with A17 chip",
    price: 999.99,
    stock: 48,
    image:
      "https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    variants: [
      { name: "Color", value: "Space Black", stock: 15 },
      { name: "Color", value: "Silver", stock: 13 },
      { name: "Color", value: "Gold", stock: 20 },
      { name: "Storage", value: "128GB", stock: 24 },
      { name: "Storage", value: "256GB", stock: 16 },
      { name: "Storage", value: "512GB", stock: 8 },
    ],
    sales: 78,
    category: "Smartphones",
    createdAt: "2023-11-15T08:00:00Z",
  },
  {
    id: "prod-2",
    name: "MacBook Air M3",
    description: "Ultralight laptop with powerful M3 chip",
    price: 1299.99,
    stock: 32,
    image:
      "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    variants: [
      { name: "Color", value: "Space Gray", stock: 15 },
      { name: "Color", value: "Silver", stock: 17 },
      { name: "RAM", value: "16GB", stock: 20 },
      { name: "RAM", value: "32GB", stock: 12 },
      { name: "Storage", value: "512GB", stock: 22 },
      { name: "Storage", value: "1TB", stock: 10 },
    ],
    sales: 45,
    category: "Laptops",
    createdAt: "2023-12-05T10:30:00Z",
  },
  {
    id: "prod-3",
    name: "iPad Pro 13",
    description: "Professional tablet for creatives",
    price: 1099.99,
    stock: 27,
    image:
      "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    variants: [
      { name: "Color", value: "Space Gray", stock: 14 },
      { name: "Color", value: "Silver", stock: 13 },
      { name: "Storage", value: "128GB", stock: 11 },
      { name: "Storage", value: "256GB", stock: 9 },
      { name: "Storage", value: "512GB", stock: 7 },
    ],
    sales: 32,
    category: "Tablets",
    createdAt: "2023-12-20T09:45:00Z",
  },
  {
    id: "prod-4",
    name: "Airpods Pro 2",
    description: "Wireless earbuds with noise cancellation",
    price: 249.99,
    stock: 64,
    image:
      "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    variants: [{ name: "Color", value: "White", stock: 64 }],
    sales: 120,
    category: "Audio",
    createdAt: "2024-01-10T14:15:00Z",
  },
];

export const MOCK_SERVICES = [
  {
    id: "svc-1",
    name: "iPhone Screen Repair",
    description: "Replace broken iPhone screens with genuine parts",
    price: 149.99,
    image:
      "https://images.pexels.com/photos/4483608/pexels-photo-4483608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    sales: 43,
    category: "Repair",
    createdAt: "2023-11-25T11:20:00Z",
  },
  {
    id: "svc-2",
    name: "Computer Diagnostics",
    description: "Full hardware and software diagnostic service",
    price: 79.99,
    image:
      "https://images.pexels.com/photos/6182/man-hands-morning-laptop.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    sales: 86,
    category: "Technical Support",
    createdAt: "2023-12-12T08:30:00Z",
  },
  {
    id: "svc-3",
    name: "Data Recovery",
    description: "Recover lost data from damaged storage devices",
    price: 199.99,
    image:
      "https://images.pexels.com/photos/117729/pexels-photo-117729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    sales: 28,
    category: "Data Services",
    createdAt: "2024-01-05T13:45:00Z",
  },
];

export const MOCK_RECENT_ACTIVITY = [
  {
    id: "act-1",
    type: "order",
    title: "New order placed",
    description: "Order #ORD-7892 for iPhone 15 Pro",
    timestamp: "2024-03-25T08:45:20Z",
    amount: 999.99,
  },
  {
    id: "act-2",
    type: "review",
    title: "New review received",
    description: "5★ review on MacBook Air M3",
    timestamp: "2024-03-24T14:32:10Z",
    rating: 5,
  },
  {
    id: "act-3",
    type: "inventory",
    title: "Low stock alert",
    description: "iPad Pro 13 (512GB, Silver) is low on stock",
    timestamp: "2024-03-24T09:15:42Z",
    stock: 2,
  },
  {
    id: "act-4",
    type: "service",
    title: "Service booking",
    description: "iPhone Screen Repair scheduled for tomorrow",
    timestamp: "2024-03-23T16:20:15Z",
    amount: 149.99,
  },
  {
    id: "act-5",
    type: "order",
    title: "Order completed",
    description: "Order #ORD-7880 has been delivered",
    timestamp: "2024-03-23T12:05:30Z",
    amount: 1299.99,
  },
];

export const MOCK_SALES_DATA = [
  { name: "Jan", total: 4800 },
  { name: "Feb", total: 5200 },
  { name: "Mar", total: 6100 },
  { name: "Apr", total: 5800 },
  { name: "May", total: 7200 },
  { name: "Jun", total: 8100 },
  { name: "Jul", total: 7900 },
  { name: "Aug", total: 8500 },
  { name: "Sep", total: 9200 },
  { name: "Oct", total: 9800 },
  { name: "Nov", total: 10500 },
  { name: "Dec", total: 12800 },
];

export const MOCK_POPULAR_CATEGORIES = [
  { name: "Smartphones", value: 40, fill: "var(--color-smartphones)" },
  { name: "Laptops", value: 30, fill: "var(--color-laptops)" },
  { name: "Audio", value: 20, fill: "var(--color-audio)" },
  { name: "Tablets", value: 10, fill: "var(--color-tablets)" },
];
