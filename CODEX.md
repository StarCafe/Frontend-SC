# Frontend Integration Contract

Guia de integracion local entre el frontend y el backend de Nova.

## Objetivo

Este archivo sirve como contrato frontend-backend para que Codex o cualquier desarrollador pueda:
- conectar el frontend sin adivinar endpoints
- saber que rol puede usar cada vista
- entender que datos minimos necesita cada pantalla
- respetar las reglas de seguridad y aislamiento multi-cafeteria

## Base URL local

- Backend local: `http://localhost:8081`
- Swagger local: `http://localhost:8081/docs`
- OpenAPI JSON: `http://localhost:8081/openapi.json`
- Health: `http://localhost:8081/health`
- Ready: `http://localhost:8081/ready`

## Reglas generales

- Todas las respuestas exitosas siguen este formato:

```json
{
  "success": true,
  "data": {}
}
```

- En error:

```json
{
  "success": false,
  "message": "Mensaje de error"
}
```

- Para endpoints privados usar:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

- Los tokens JWT incluyen:
  - `userId`
  - `role`
  - `businessId` cuando aplica

## Roles y enums utiles para UI

### Roles

- `SUPER_ADMIN`
- `ADMIN`
- `KITCHEN`

### Estado de pedido

- `PENDING`
- `PREPARING`
- `READY`
- `PAID`
- `CANCELLED`

### Estado de item de pedido

- `PENDING`
- `READY`

### Regla sugerida de visualizacion

- `PENDING`: pendiente por preparar
- `PREPARING`: cocina trabajando
- `READY`: listo para entregar o cobrar
- `PAID`: ya cobrado
- `CANCELLED`: anulado

## Sesion que debe guardar el frontend

Despues del login el frontend deberia persistir como minimo:

```ts
type Session = {
  token: string;
  userId: number;
  role: "SUPER_ADMIN" | "ADMIN" | "KITCHEN";
  businessId: number | null;
  name: string;
  email: string;
};
```

Para flujo cliente QR, ademas:

```ts
type PublicTableSessionState = {
  qrToken: string;
  businessSlug: string;
  businessId: number;
  tableId: number;
  tableNumber: number;
};
```

## Matriz de vistas -> endpoint -> rol

### Vistas `SUPER_ADMIN`

| Vista | Endpoint principal | Metodo | Rol |
|---|---|---|---|
| Login global | `/api/v1/auth/login` | `POST` | publico |
| Lista de cafeterias | `/api/v1/super-admin/businesses` | `GET` | `SUPER_ADMIN` |
| Crear cafeteria | `/api/v1/super-admin/businesses` | `POST` | `SUPER_ADMIN` |
| Registrar usuarios | `/api/v1/auth/register` | `POST` | `SUPER_ADMIN` |

### Vistas `ADMIN`

| Vista | Endpoint principal | Metodo | Rol |
|---|---|---|---|
| Dashboard admin | `/api/v1/admin/orders` | `GET` | `ADMIN` |
| Usuarios | `/api/v1/admin/users` | `GET` | `ADMIN` |
| Crear usuario | `/api/v1/admin/users` | `POST` | `ADMIN` |
| Mesas | `/api/v1/admin/tables` | `GET` | `ADMIN` |
| Crear mesa | `/api/v1/admin/tables` | `POST` | `ADMIN` |
| Categorias | `/api/v1/admin/categories` | `GET` | `ADMIN` |
| Productos | `/api/v1/admin/products` | `GET` | `ADMIN` |
| Addons | `/api/v1/admin/addons` | `GET` | `ADMIN` |
| Caja | `/api/v1/admin/cashier/orders/search` | `GET` | `ADMIN` |
| Cobrar | `/api/v1/admin/cashier/orders/{orderId}/pay` | `POST` | `ADMIN` |
| Branding | `/api/v1/admin/business` | `GET` | `ADMIN` |

### Vistas `KITCHEN`

| Vista | Endpoint principal | Metodo | Rol |
|---|---|---|---|
| Cola de cocina | `/api/v1/kitchen/orders` | `GET` | `KITCHEN` |
| Marcar preparando | `/api/v1/kitchen/orders/{orderId}/preparing` | `PATCH` | `KITCHEN` |
| Marcar item listo | `/api/v1/kitchen/order-items/{itemId}/ready` | `PATCH` | `KITCHEN` |
| Marcar pedido listo | `/api/v1/kitchen/orders/{orderId}/ready` | `PATCH` | `KITCHEN` |
| Historial cocina | `/api/v1/kitchen/orders/history` | `GET` | `KITCHEN` |

### Vistas cliente QR

| Vista | Endpoint principal | Metodo | Rol |
|---|---|---|---|
| Entrada por QR | `/api/v1/tables/qr/{qrToken}` | `GET` | publico |
| Sesion de mesa | `/api/v1/public/tables/{qrToken}/session` | `GET` | publico |
| Menu publico | `/api/v1/public/menu?businessSlug=...` | `GET` | publico |
| Crear pedido | `/api/v1/public/tables/{qrToken}/orders` | `POST` | publico |
| Estado pedido | `/api/v1/public/orders/{orderId}/status?qrToken=...` | `GET` | publico |

## Matriz de permisos por rol

| Accion | SUPER_ADMIN | ADMIN | KITCHEN | Cliente QR |
|---|---|---|---|---|
| Login | si | si | si | no |
| Crear cafeteria | si | no | no | no |
| Registrar usuarios globalmente | si | no | no | no |
| Gestionar usuarios de cafeteria | no | si | no | no |
| Gestionar mesas | no | si | no | no |
| Gestionar menu | no | si | no | no |
| Ver pedidos admin | no | si | no | no |
| Cobrar pedido | si, con contexto | si | no | no |
| Ver cola cocina | no | no | si | no |
| Marcar item ready | no | no | si | no |
| Crear pedido | no | no | no | si |
| Ver estado de pedido con qr | no | no | no | si |

## Flujo de autenticacion

### Login

`POST /api/v1/auth/login`

Body:

```json
{
  "email": "admin@star.com",
  "password": "Admin123456!"
}
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "token": "jwt",
    "userId": 2,
    "businessId": 1,
    "role": "ADMIN",
    "name": "Admin Star",
    "email": "admin@star.com"
  }
}
```

Recomendacion frontend:
- guardar `token`
- guardar `role`
- guardar `businessId`
- redirigir segun rol

Redireccion sugerida:
- `SUPER_ADMIN` -> panel global
- `ADMIN` -> panel admin del negocio
- `KITCHEN` -> cola de cocina

### Usuario autenticado

`GET /api/v1/auth/me`

Header:

```http
Authorization: Bearer <token>
```

Sirve para:
- rehidratar sesion
- proteger rutas privadas
- validar si el usuario sigue activo

## Endpoints por flujo

### 1. SUPER_ADMIN

#### Crear cafeteria

`POST /api/v1/super-admin/businesses`

Body:

```json
{
  "name": "Star Cafe",
  "slug": "star-cafe",
  "logoUrl": "",
  "primaryColor": "#A0522D"
}
```

#### Listar cafeterias

`GET /api/v1/super-admin/businesses`

Opcional:
- `?includeInactive=true`

#### Registrar usuarios globalmente

`POST /api/v1/auth/register`

Header:

```http
Authorization: Bearer <token_super_admin>
```

Body:

```json
{
  "name": "Kitchen Cholo",
  "email": "kitchen@cholo.com",
  "password": "Kitchen123456!",
  "role": "KITCHEN",
  "businessId": 2
}
```

Reglas:
- sin token falla
- con `SUPER_ADMIN` funciona
- no es endpoint publico despues del bootstrap inicial

Datos minimos para pantalla:
- lista de cafeterias: `id`, `name`, `slug`, `isActive`, `primaryColor`, `logoUrl`
- alta de usuario: `name`, `email`, `password`, `role`, `businessId`

### 2. ADMIN

#### Usuarios

- `GET /api/v1/admin/users`
- `POST /api/v1/admin/users`
- `PATCH /api/v1/admin/users/{id}/deactivate`

Body ejemplo para crear:

```json
{
  "name": "Kitchen Star",
  "email": "kitchen@star.com",
  "password": "Kitchen123456!",
  "role": "KITCHEN"
}
```

Nota:
- si el usuario autenticado es `ADMIN` de una cafeteria, el backend usa su `businessId`

Datos minimos para UI de usuarios:
- `id`
- `name`
- `email`
- `role`
- `isActive`
- `businessId`

#### Mesas

- `GET /api/v1/admin/tables`
- `POST /api/v1/admin/tables`
- `PATCH /api/v1/admin/tables/{id}/regenerate-qr`
- `PATCH /api/v1/admin/tables/{id}/deactivate`

Body para crear:

```json
{
  "tableNumber": 1
}
```

Datos minimos para UI de mesas:
- `id`
- `tableNumber`
- `qrToken`
- `qrUrl`
- `isActive`
- `businessName`
- `businessSlug`

#### Categorias

- `GET /api/v1/admin/categories`
- `POST /api/v1/admin/categories`

Body:

```json
{
  "name": "Cafe",
  "description": "Bebidas calientes"
}
```

Datos minimos para UI de categorias:
- `id`
- `name`
- `description`
- `isActive`

#### Productos

- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `PATCH /api/v1/admin/products/{id}`
- `PATCH /api/v1/admin/products/{id}/activate`
- `PATCH /api/v1/admin/products/{id}/unavailable`
- `PATCH /api/v1/admin/products/{id}/deactivate`

Body para crear:

```json
{
  "categoryId": 1,
  "name": "Capuccino Star",
  "description": "Cafe con leche",
  "price": 12.5
}
```

Datos minimos para UI de productos:
- `id`
- `categoryId`
- `name`
- `description`
- `price`
- `isAvailable`
- `isActive`
- `addons[]`
- `image.url`

#### Addons

- `GET /api/v1/admin/addons`
- `POST /api/v1/admin/addons`
- `POST /api/v1/admin/products/{productId}/addons/{addonId}`

Body para crear:

```json
{
  "name": "Leche extra",
  "price": 1.5
}
```

Datos minimos para UI de addons:
- `id`
- `name`
- `price`
- `isActive`

#### Imagenes de producto

- `POST /api/v1/admin/products/{productId}/image`
- `PATCH /api/v1/admin/products/{productId}/image`
- `DELETE /api/v1/admin/products/{productId}/image`

Usar `multipart/form-data` con el campo:
- `image`

#### Branding de negocio

- `GET /api/v1/admin/business`
- `PATCH /api/v1/admin/business/theme`
- `PATCH /api/v1/admin/business/logo`

#### Pedidos admin

- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/history`
- `PATCH /api/v1/admin/orders/{orderId}/cancel`

#### Caja

- `GET /api/v1/admin/cashier/orders/search`
- `POST /api/v1/admin/cashier/orders/{orderId}/pay`

Importante para frontend:
- `pay` ya no manda `amount`
- el backend usa siempre el `order.total`
- el frontend solo debe mostrar el total y disparar la confirmacion de cobro

Busqueda ejemplo:

`GET /api/v1/admin/cashier/orders/search?customerName=Lucia&tableNumber=1&status=PENDING`

Cobro:

`POST /api/v1/admin/cashier/orders/3/pay`

Sin body.

Datos minimos para UI de caja:
- `order.id`
- `customerName`
- `tableNumber`
- `status`
- `total`
- `items[].productName`
- `items[].quantity`
- `items[].unitPrice`
- `items[].addons[]`

### 3. KITCHEN

- `GET /api/v1/kitchen/orders`
- `PATCH /api/v1/kitchen/orders/{orderId}/preparing`
- `PATCH /api/v1/kitchen/order-items/{itemId}/ready`
- `PATCH /api/v1/kitchen/orders/{orderId}/ready`
- `GET /api/v1/kitchen/orders/history`

Reglas:
- solo se ven pedidos del `businessId` del token
- no se puede marcar `READY` un item de otra cafeteria

Datos minimos para UI de cocina:
- `id`
- `tableNumber`
- `customerName`
- `status`
- `total`
- `items[].id`
- `items[].productName`
- `items[].quantity`
- `items[].notes`
- `items[].status`

### 4. Cliente por QR

#### Obtener mesa por QR

`GET /api/v1/tables/qr/{qrToken}`

#### Obtener sesion publica de mesa

`GET /api/v1/public/tables/{qrToken}/session`

Sirve para:
- negocio actual
- mesa actual
- cantidad de pedidos activos
- limite restante

Datos utiles que debe guardar el frontend:
- `business.id`
- `business.slug`
- `business.name`
- `table.id`
- `table.tableNumber`
- `table.qrToken`
- `activeOrdersCount`
- `remainingSlots`
- `canCreateMoreOrders`

#### Menu publico

`GET /api/v1/public/menu?businessSlug=star-cafe`

#### Crear pedido publico

`POST /api/v1/public/tables/{qrToken}/orders`

Body:

```json
{
  "customerName": "Lucia",
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "notes": "sin azucar",
      "addonIds": []
    }
  ]
}
```

#### Estado del pedido

`GET /api/v1/public/orders/{orderId}/status?qrToken={qrToken}`

Reglas:
- si no mandas `qrToken`, falla
- si mandas QR de otra mesa, falla
- si mandas QR de otra cafeteria, falla

Esto debe respetarse en frontend:
- guardar `qrToken` de la mesa al entrar
- reutilizar ese `qrToken` al pedir estado del pedido

## Contratos de datos recomendados para frontend

```ts
type AuthResponse = {
  token: string;
  userId: number;
  businessId: number | null;
  role: "SUPER_ADMIN" | "ADMIN" | "KITCHEN";
  name: string;
  email: string;
};
```

```ts
type Business = {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  isActive: boolean;
  createdAt: string;
  themeKey?: string | null;
};
```

```ts
type User = {
  id: number;
  businessId: number | null;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "KITCHEN";
  isActive: boolean;
};
```

```ts
type Table = {
  id: number;
  businessId: number;
  businessName: string;
  businessSlug: string;
  tableNumber: number;
  qrToken: string;
  qrUrl: string;
  isActive: boolean;
};
```

```ts
type Addon = {
  id: number;
  businessId: number;
  name: string;
  price: number;
  isActive: boolean;
};
```

```ts
type ProductImage = {
  id: number;
  file_name: string;
  mime_type: string;
  file_size: number;
  url: string;
};
```

```ts
type Product = {
  id: number;
  businessId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isActive: boolean;
  addons: Addon[];
  image: ProductImage | null;
};
```

```ts
type OrderItemAddon = {
  addonId: number;
  name: string;
  price: number;
};
```

```ts
type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes: string;
  status: "PENDING" | "READY";
  addons?: OrderItemAddon[];
};
```

```ts
type Order = {
  id: number;
  businessId: number;
  tableId: number;
  tableNumber: number;
  customerName: string;
  status: "PENDING" | "PREPARING" | "READY" | "PAID" | "CANCELLED";
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};
```

```ts
type Payment = {
  id: number;
  businessId: number;
  orderId: number;
  amount: number;
  status: "PAID";
  paidAt: string;
};
```

## Endpoints de salud

### Health

`GET /health`

Uso:
- confirmar que el proceso esta vivo

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "nova-backend"
  }
}
```

### Ready

`GET /ready`

Uso:
- confirmar que proceso + DB estan listos

Respuesta esperada con DB conectada:

```json
{
  "success": true,
  "data": {
    "status": "ready",
    "service": "nova-backend",
    "database": "ok"
  }
}
```

Si la DB falla:
- responde `503 Service Unavailable`

## Reglas de implementacion para Codex en el frontend

- no inventar nuevos endpoints si ya existe uno en este archivo
- no mandar `amount` al endpoint de caja
- no asumir que cliente QR tiene token JWT
- usar `qrToken` como parte del estado publico de mesa
- proteger vistas por `role`
- si `businessId` viene en el token, el frontend debe tratarlo como contexto actual de cafeteria
- para `SUPER_ADMIN`, mostrar selector o contexto de cafeteria cuando el endpoint lo requiera
- usar `GET /api/v1/auth/me` para restaurar sesion en refresh
- al recibir `success: false`, mostrar `message` del backend

## Recomendacion de estructura en frontend

- `services/auth.ts`
  - `login`
  - `me`

- `services/superAdmin.ts`
  - `listBusinesses`
  - `createBusiness`
  - `registerUser`

- `services/admin.ts`
  - `users`
  - `tables`
  - `categories`
  - `products`
  - `addons`
  - `orders`
  - `cashier`
  - `branding`

- `services/kitchen.ts`
  - `listOrders`
  - `markPreparing`
  - `markItemReady`
  - `markOrderReady`
  - `history`

- `services/public.ts`
  - `getTableByQr`
  - `getTableSession`
  - `getPublicMenu`
  - `createOrder`
  - `getOrderStatus`

- `services/health.ts`
  - `health`
  - `ready`

## Flujos completos sugeridos

### Flujo `ADMIN`

1. login
2. `GET /api/v1/auth/me`
3. cargar mesas, categorias, productos y pedidos
4. usar caja para buscar pedidos
5. cobrar con `POST /api/v1/admin/cashier/orders/{orderId}/pay`

### Flujo `KITCHEN`

1. login
2. `GET /api/v1/kitchen/orders`
3. marcar `PREPARING`
4. marcar items `READY`
5. marcar pedido `READY`

### Flujo cliente QR

1. entrar con `qrToken`
2. `GET /api/v1/public/tables/{qrToken}/session`
3. `GET /api/v1/public/menu?businessSlug=...`
4. `POST /api/v1/public/tables/{qrToken}/orders`
5. guardar `orderId`
6. consultar `GET /api/v1/public/orders/{orderId}/status?qrToken=...`

## Ejemplos de fetch

### Login

```ts
const res = await fetch("http://localhost:8081/api/v1/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "admin@star.com",
    password: "Admin123456!",
  }),
});
```

### Pedido publico con QR

```ts
const res = await fetch(`http://localhost:8081/api/v1/public/tables/${qrToken}/orders`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    customerName: "Lucia",
    items: [
      {
        productId: 1,
        quantity: 1,
        notes: "sin azucar",
        addonIds: [],
      },
    ],
  }),
});
```

### Cobrar pedido sin amount

```ts
const res = await fetch(`http://localhost:8081/api/v1/admin/cashier/orders/${orderId}/pay`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Consultar estado publico del pedido

```ts
const res = await fetch(
  `http://localhost:8081/api/v1/public/orders/${orderId}/status?qrToken=${qrToken}`
);
```

## Estado actual para integracion local

Con lo probado hasta ahora, el frontend local ya puede conectarse correctamente al backend para:
- login por rol
- gestion de cafeterias por `SUPER_ADMIN`
- gestion admin por cafeteria
- flujo de cocina por cafeteria
- flujo cliente por QR
- flujo de caja sin monto manual
- monitoreo basico con `health` y `ready`
