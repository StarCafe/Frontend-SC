export type DemoStatus = "PENDING" | "PREPARING" | "READY" | "PAID" | "CANCELLED" | "ACTIVE" | "INACTIVE";

export interface DemoProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  accent: string;
  subtitle: string;
  available: boolean;
  featured?: boolean;
}

export interface DemoTable {
  id: number;
  tableNumber: number;
  seats: number;
  qrToken: string;
  qrUrl: string;
  active: boolean;
  occupancyLabel: string;
  minutesLabel: string;
}

export interface DemoOrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  notes?: string;
  status: DemoStatus;
}

export interface DemoOrder {
  id: number;
  table: string;
  customerName: string;
  createdAt: string;
  total: number;
  status: DemoStatus;
  shortStatus: string;
  items: DemoOrderItem[];
}

export const demoPalette = [
  { name: "Verde principal", hex: "#006241" },
  { name: "Verde oscuro", hex: "#13251F" },
  { name: "Crema", hex: "#F7F3ED" },
  { name: "Caramelo", hex: "#C89A58" },
  { name: "Carbón", hex: "#1E1E1E" },
  { name: "Verde suave", hex: "#E3E9E1" },
];

export const demoAdminUser = {
  name: "Admin",
  roleLabel: "Administrador",
  avatar: "A",
};

export const demoKitchenUser = {
  name: "Camila",
  roleLabel: "Kitchen lead",
  avatar: "C",
};

export const demoStats = [
  { label: "Ventas Totales", value: "$1,248.50", change: "+12.5% vs ayer" },
  { label: "Pedidos", value: "48", change: "+8.3% vs ayer" },
  { label: "Clientes", value: "76", change: "+5.2% vs ayer" },
  { label: "Mesas Activas", value: "8", change: "de 20 mesas" },
];

export const demoProducts: DemoProduct[] = [
  {
    id: 1,
    name: "Frappé Chocolate",
    description: "Helado, cremoso y con un swirl oscuro de cacao.",
    price: 17,
    category: "Frappuccino",
    accent: "from-[#5B371E] via-[#8C5B34] to-[#F2E2C6]",
    subtitle: "32 unidades",
    available: true,
    featured: true,
  },
  {
    id: 2,
    name: "Cold Brew",
    description: "Café frío intenso, limpio y muy refrescante.",
    price: 12,
    category: "Frío",
    accent: "from-[#241A15] via-[#432C1F] to-[#8C5A2E]",
    subtitle: "28 unidades",
    available: true,
  },
  {
    id: 3,
    name: "Caffè Misto",
    description: "Espresso balanceado con leche cremosa vaporizada.",
    price: 14,
    category: "Caliente",
    accent: "from-[#A36A3F] via-[#C99565] to-[#F6E7CF]",
    subtitle: "26 unidades",
    available: true,
  },
  {
    id: 4,
    name: "Dragonfruit Refresher",
    description: "Notas cítricas y frutales con acabado vibrante.",
    price: 15,
    category: "Refresco",
    accent: "from-[#B2265D] via-[#E54C7F] to-[#F9CBD8]",
    subtitle: "18 unidades",
    available: true,
  },
  {
    id: 5,
    name: "Caramel Frappe",
    description: "Caramelo tostado con textura ligera y dulce.",
    price: 16,
    category: "Frappuccino",
    accent: "from-[#8F5A22] via-[#C48C4A] to-[#F5DFC2]",
    subtitle: "24 unidades",
    available: true,
  },
  {
    id: 6,
    name: "Cheesecake",
    description: "Postre suave con frutos rojos y base crocante.",
    price: 13,
    category: "Postres",
    accent: "from-[#7C2F38] via-[#D06A78] to-[#F7D7DC]",
    subtitle: "14 unidades",
    available: false,
  },
];

export const demoTables: DemoTable[] = [
  { id: 1, tableNumber: 1, seats: 4, qrToken: "mesa-1-demo", qrUrl: "https://starcafe.app/mesa/mesa-1-demo", active: true, occupancyLabel: "4 asientos", minutesLabel: "18 min" },
  { id: 2, tableNumber: 2, seats: 2, qrToken: "mesa-2-demo", qrUrl: "https://starcafe.app/mesa/mesa-2-demo", active: true, occupancyLabel: "2 asientos", minutesLabel: "Disponible" },
  { id: 3, tableNumber: 3, seats: 4, qrToken: "mesa-3-demo", qrUrl: "https://starcafe.app/mesa/mesa-3-demo", active: true, occupancyLabel: "4 asientos", minutesLabel: "22 min" },
  { id: 4, tableNumber: 4, seats: 2, qrToken: "mesa-4-demo", qrUrl: "https://starcafe.app/mesa/mesa-4-demo", active: false, occupancyLabel: "2 asientos", minutesLabel: "Disponible" },
  { id: 5, tableNumber: 5, seats: 6, qrToken: "mesa-5-demo", qrUrl: "https://starcafe.app/mesa/mesa-5-demo", active: true, occupancyLabel: "6 asientos", minutesLabel: "35 min" },
  { id: 6, tableNumber: 6, seats: 4, qrToken: "mesa-6-demo", qrUrl: "https://starcafe.app/mesa/mesa-6-demo", active: true, occupancyLabel: "4 asientos", minutesLabel: "Disponible" },
];

export const demoOrders: DemoOrder[] = [
  {
    id: 56789,
    table: "Mesa 1",
    customerName: "Andrea",
    createdAt: "2026-06-26T10:05:00.000Z",
    total: 35.5,
    status: "PREPARING",
    shortStatus: "Preparando",
    items: [
      { id: 1, productName: "Frappé Chocolate", quantity: 2, price: 17, notes: "Sin crema", status: "PREPARING" },
      { id: 2, productName: "Cold Brew", quantity: 1, price: 12, status: "PENDING" },
    ],
  },
  {
    id: 56788,
    table: "Mesa 3",
    customerName: "Luis",
    createdAt: "2026-06-26T09:58:00.000Z",
    total: 24,
    status: "PENDING",
    shortStatus: "Pendiente",
    items: [
      { id: 3, productName: "Cold Brew", quantity: 1, price: 12, status: "PENDING" },
      { id: 4, productName: "Americano", quantity: 1, price: 12, notes: "Muy caliente", status: "PENDING" },
    ],
  },
  {
    id: 56787,
    table: "Mesa 5",
    customerName: "María",
    createdAt: "2026-06-26T09:53:00.000Z",
    total: 42,
    status: "READY",
    shortStatus: "Listo",
    items: [
      { id: 5, productName: "Caffè Misto", quantity: 3, price: 14, status: "READY" },
    ],
  },
];

export const demoHistoryOrders: DemoOrder[] = [
  {
    id: 55217,
    table: "Mesa 2",
    customerName: "Juan",
    createdAt: "2026-06-25T21:15:00.000Z",
    total: 29,
    status: "PAID",
    shortStatus: "Pagado",
    items: [
      { id: 6, productName: "Caramel Frappe", quantity: 1, price: 16, status: "READY" },
      { id: 7, productName: "Cheesecake", quantity: 1, price: 13, status: "READY" },
    ],
  },
  {
    id: 55216,
    table: "Mesa 6",
    customerName: "Teresa",
    createdAt: "2026-06-25T20:48:00.000Z",
    total: 19,
    status: "CANCELLED",
    shortStatus: "Cancelado",
    items: [{ id: 8, productName: "Cold Brew", quantity: 1, price: 12, status: "CANCELLED" }],
  },
];

export const demoCategories = [
  { id: 1, name: "Calientes", description: "Espresso, cappuccino y mezclas cremosas", products: 8, status: "ACTIVE" as const },
  { id: 2, name: "Fríos", description: "Cold brew y bebidas heladas", products: 6, status: "ACTIVE" as const },
  { id: 3, name: "Postres", description: "Cheesecakes, brownies y bakery", products: 4, status: "ACTIVE" as const },
];

export const demoAddons = [
  { id: 1, name: "Shot extra", price: 3, appliesTo: "Bebidas calientes", status: "ACTIVE" as const },
  { id: 2, name: "Leche vegetal", price: 2.5, appliesTo: "Toda la carta", status: "ACTIVE" as const },
  { id: 3, name: "Jarabe vainilla", price: 2, appliesTo: "Frappes y lattes", status: "INACTIVE" as const },
];

export const demoUsers = [
  { id: 1, name: "Admin Principal", email: "admin@starcafe.com", role: "ADMIN", status: "ACTIVE" as const },
  { id: 2, name: "Camila Rojas", email: "kitchen@starcafe.com", role: "KITCHEN", status: "ACTIVE" as const },
  { id: 3, name: "Carlos Vega", email: "cashier@starcafe.com", role: "ADMIN", status: "INACTIVE" as const },
];

export const demoCashierResults = [
  { id: 56789, table: "Mesa 1", customer: "Andrea", status: "READY" as const, total: "$38.50" },
  { id: 56787, table: "Mesa 5", customer: "María", status: "PAID" as const, total: "$42.00" },
];

export const demoMenuTabs = ["Todos", "Calientes", "Fríos", "Refrescos", "Frappuccino", "Postres"];

export const demoCategoryBreakdown = [
  { label: "Bebidas", value: "62%", color: "#006241" },
  { label: "Alimentos", value: "28%", color: "#C89A58" },
  { label: "Postres", value: "10%", color: "#A9BEAE" },
];

export const demoExperiencePillars = [
  "Diseño moderno y premium",
  "100% responsivo",
  "Experiencia intuitiva",
  "Estados claros",
  "Sistema completo",
];
