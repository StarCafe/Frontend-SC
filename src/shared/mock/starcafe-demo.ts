import { env } from "@/shared/lib/env";

export type DemoStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "PAID"
  | "CANCELLED"
  | "ACTIVE"
  | "INACTIVE";

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
  qrToken: string;
  qrUrl: string;
  active: boolean;
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

export interface DemoPublicTableSession {
  table: DemoTable;
  activeOrdersCount: number;
  remainingSlots: number;
  canCreateMoreOrders: boolean;
  activeOrders: DemoOrder[];
}

function buildMesaQrUrl(qrToken: string) {
  return `${env.appBaseUrl}/mesa/${qrToken}`;
}

export const demoPalette = [
  { name: "Verde principal", hex: "#006241" },
  { name: "Crema", hex: "#F7F3ED" },
  { name: "Carbón", hex: "#1E1E1E" },
  { name: "Caramelo", hex: "#C89A58" },
  { name: "Verde suave", hex: "#E3E9E1" },
];

export const demoAdminUser = {
  name: "Admin Principal",
  roleLabel: "ADMIN",
  avatar: "A",
};

export const demoKitchenUser = {
  name: "Cocina 1",
  roleLabel: "KITCHEN",
  avatar: "K",
};

export const demoStats = [
  { label: "Mesas activas", value: "2", change: "1 fuera de servicio" },
  { label: "Pedidos activos", value: "3", change: "2 en mesa 1, 1 en mesa 2" },
  { label: "Productos", value: "6", change: "1 no disponible" },
  { label: "Usuarios", value: "4", change: "1 cocina inactiva" },
];

export const demoProducts: DemoProduct[] = [
  {
    id: 1,
    name: "Capuccino",
    description: "Café con leche espumada.",
    price: 12.5,
    category: "Cafes",
    accent: "from-[#7A5438] via-[#B78B67] to-[#F1DFC9]",
    subtitle: "Disponible",
    available: true,
    featured: true,
  },
  {
    id: 2,
    name: "Frappe de Oreo",
    description: "Bebida fría con galleta oreo.",
    price: 14,
    category: "Frappes",
    accent: "from-[#2E211E] via-[#5B433D] to-[#D8C2B4]",
    subtitle: "Disponible",
    available: true,
  },
  {
    id: 3,
    name: "Desayuno Clasico",
    description: "Café, jugo, huevos revueltos y tostadas.",
    price: 20,
    category: "Desayunos",
    accent: "from-[#7D5723] via-[#C1934C] to-[#F4E2BE]",
    subtitle: "Disponible",
    available: true,
  },
  {
    id: 4,
    name: "Sandwich con pollo crispy",
    description: "Pan artesanal con pollo crispy y salsa de la casa.",
    price: 12,
    category: "Sandwiches",
    accent: "from-[#6A4A2D] via-[#A57852] to-[#EED8C2]",
    subtitle: "Disponible",
    available: true,
  },
  {
    id: 5,
    name: "Cafe Americano",
    description: "Café americano de origen.",
    price: 6,
    category: "Cafes",
    accent: "from-[#231A15] via-[#4A3529] to-[#BDA18A]",
    subtitle: "No disponible",
    available: false,
  },
  {
    id: 6,
    name: "Cafe Mocaccino",
    description: "Café con chocolate y leche.",
    price: 8,
    category: "Cafes",
    accent: "from-[#4A2F28] via-[#85574A] to-[#D8B8A7]",
    subtitle: "Inactivo",
    available: false,
  },
];

export const demoTables: DemoTable[] = [
  {
    id: 1,
    tableNumber: 1,
    qrToken: "3f9b67aa-852d-4c05-b24e-6ac181d14428",
    qrUrl: buildMesaQrUrl("3f9b67aa-852d-4c05-b24e-6ac181d14428"),
    active: true,
  },
  {
    id: 2,
    tableNumber: 2,
    qrToken: "0e6cfdb3-5e88-4b8a-bd4d-2a787db16a10",
    qrUrl: buildMesaQrUrl("0e6cfdb3-5e88-4b8a-bd4d-2a787db16a10"),
    active: true,
  },
  {
    id: 3,
    tableNumber: 3,
    qrToken: "9a5dd9dd-6e6f-4dfb-b2ef-6a5dc0f8a2d1",
    qrUrl: buildMesaQrUrl("9a5dd9dd-6e6f-4dfb-b2ef-6a5dc0f8a2d1"),
    active: false,
  },
];

export const demoOrders: DemoOrder[] = [
  {
    id: 5,
    table: "Mesa 1",
    customerName: "Luis",
    createdAt: "2026-06-26T10:15:00Z",
    total: 26,
    status: "PREPARING",
    shortStatus: "Preparando",
    items: [
      {
        id: 101,
        productName: "Capuccino",
        quantity: 1,
        price: 12.5,
        notes: "Sin azucar",
        status: "READY",
      },
      {
        id: 102,
        productName: "Frappe de Oreo",
        quantity: 1,
        price: 14,
        status: "PREPARING",
      },
    ],
  },
  {
    id: 6,
    table: "Mesa 2",
    customerName: "Maria",
    createdAt: "2026-06-26T10:20:00Z",
    total: 20,
    status: "PENDING",
    shortStatus: "Pendiente",
    items: [
      {
        id: 103,
        productName: "Desayuno Clasico",
        quantity: 1,
        price: 20,
        notes: "Sin mermelada",
        status: "PENDING",
      },
    ],
  },
  {
    id: 7,
    table: "Mesa 1",
    customerName: "Lucia",
    createdAt: "2026-06-26T10:05:00Z",
    total: 12.5,
    status: "READY",
    shortStatus: "Listo",
    items: [
      {
        id: 104,
        productName: "Capuccino",
        quantity: 1,
        price: 12.5,
        status: "READY",
      },
    ],
  },
];

export const demoHistoryOrders: DemoOrder[] = [
  {
    id: 3,
    table: "Mesa 1",
    customerName: "Luis",
    createdAt: "2026-06-26T09:00:00Z",
    total: 18,
    status: "CANCELLED",
    shortStatus: "Cancelado",
    items: [],
  },
  {
    id: 4,
    table: "Mesa 2",
    customerName: "Ana",
    createdAt: "2026-06-26T08:30:00Z",
    total: 24.5,
    status: "PAID",
    shortStatus: "Pagado",
    items: [],
  },
];

export const demoCategories = [
  { id: 1, name: "Cafes", description: "Bebidas calientes", products: 3, status: "ACTIVE" as const },
  { id: 2, name: "Frappes", description: "Bebidas frias con hielo", products: 1, status: "ACTIVE" as const },
  { id: 3, name: "Desayunos", description: "Opciones para empezar el dia", products: 1, status: "ACTIVE" as const },
  { id: 4, name: "Sandwiches", description: "Opciones saladas", products: 1, status: "ACTIVE" as const },
];

export const demoAddons = [
  { id: 1, name: "Leche deslactosada", price: 1.5, appliesTo: "Cafes", status: "ACTIVE" as const },
  { id: 2, name: "Shot extra de espresso", price: 2, appliesTo: "Cafes", status: "ACTIVE" as const },
  { id: 3, name: "Crema batida", price: 1, appliesTo: "Frappes", status: "ACTIVE" as const },
  { id: 4, name: "Queso extra", price: 2.5, appliesTo: "Sandwiches", status: "ACTIVE" as const },
];

export const demoUsers = [
  { id: 1, name: "Admin Principal", email: "admin@starcafe.com", role: "ADMIN", status: "ACTIVE" as const },
  { id: 2, name: "Cocina 1", email: "kitchen@starcafe.com", role: "KITCHEN", status: "ACTIVE" as const },
  { id: 3, name: "Admin Secundario", email: "admin2@starcafe.com", role: "ADMIN", status: "ACTIVE" as const },
  { id: 4, name: "Cocina 2", email: "kitchen2@starcafe.com", role: "KITCHEN", status: "INACTIVE" as const },
];

export const demoCashierResults = [
  { id: 5, table: "Mesa 1", customer: "Luis", status: "PREPARING" as const, total: "S/ 26.00" },
  { id: 6, table: "Mesa 2", customer: "Maria", status: "PENDING" as const, total: "S/ 20.00" },
  { id: 4, table: "Mesa 2", customer: "Ana", status: "PAID" as const, total: "S/ 24.50" },
];

export const demoMenuTabs = ["Todos", "Cafes", "Frappes", "Desayunos", "Sandwiches"];

export const demoCategoryBreakdown = [
  { label: "Cafes", value: "50%", color: "#006241" },
  { label: "Frappes", value: "17%", color: "#C89A58" },
  { label: "Desayunos", value: "17%", color: "#A9BEAE" },
  { label: "Sandwiches", value: "16%", color: "#6E8B74" },
];

export const demoExperiencePillars = [
  "Admin operativo",
  "Kitchen rapido",
  "Cliente mobile-first",
  "Estados claros",
  "Deploy visual",
];

export const demoPublicTableSession: DemoPublicTableSession = {
  table: demoTables[0],
  activeOrdersCount: 2,
  remainingSlots: 1,
  canCreateMoreOrders: true,
  activeOrders: [demoOrders[0], demoOrders[2]],
};

export const demoPublicTableSessionFull: DemoPublicTableSession = {
  table: demoTables[1],
  activeOrdersCount: 3,
  remainingSlots: 0,
  canCreateMoreOrders: false,
  activeOrders: [
    {
      id: 8,
      table: "Mesa 2",
      customerName: "Carlos",
      createdAt: "2026-06-26T10:25:00Z",
      total: 12,
      status: "PENDING",
      shortStatus: "Pendiente",
      items: [],
    },
    {
      id: 9,
      table: "Mesa 2",
      customerName: "Rosa",
      createdAt: "2026-06-26T10:10:00Z",
      total: 14,
      status: "PREPARING",
      shortStatus: "Preparando",
      items: [],
    },
    {
      id: 10,
      table: "Mesa 2",
      customerName: "Diego",
      createdAt: "2026-06-26T09:55:00Z",
      total: 20,
      status: "READY",
      shortStatus: "Listo",
      items: [],
    },
  ],
};

export const demoPublicTableSessionEmpty: DemoPublicTableSession = {
  table: {
    id: 4,
    tableNumber: 4,
    qrToken: "demo-qr-token",
    qrUrl: buildMesaQrUrl("demo-qr-token"),
    active: true,
  },
  activeOrdersCount: 0,
  remainingSlots: 3,
  canCreateMoreOrders: true,
  activeOrders: [],
};
