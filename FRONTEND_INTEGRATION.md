# Frontend Integration Guide

Guia de integracion local entre el frontend y el backend de Nova.

## Base URL local

- Backend local: `http://localhost:8081`
- Swagger local: `http://localhost:8081/docs`
- OpenAPI JSON: `http://localhost:8081/openapi.json`
- Health: `http://localhost:8081/health`
- Ready: `http://localhost:8081/ready`

## Reglas generales

- Todas las respuestas siguen este formato:
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

- Para endpoints privados usa:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

- Los tokens JWT incluyen:
  - `userId`
  - `role`
  - `businessId` cuando aplica

## Roles y vistas del frontend

### `SUPER_ADMIN`

Uso esperado:
- login global
- crear cafeterias
- registrar usuarios de cualquier cafeteria
- consultar entidades globales usando `businessId` cuando corresponda

Importante:
- `POST /api/v1/auth/register` ya no es publico en operacion normal
- despues del bootstrap inicial, solo `SUPER_ADMIN` autenticado puede usarlo

### `ADMIN`

Uso esperado:
- gestionar usuarios de su cafeteria
- gestionar mesas
- gestionar categorias, productos, addons
- ver pedidos
- cobrar pedidos
- branding del negocio

Importante:
- si el token tiene `businessId`, el frontend no necesita mandar `businessId` en body para casi todas las operaciones del dia a dia

### `KITCHEN`

Uso esperado:
- ver pedidos activos de su cafeteria
- mover pedidos a `PREPARING`
- marcar items `READY`
- marcar pedidos `READY`

Importante:
- `KITCHEN` solo ve pedidos de su propio `businessId`

### Cliente por QR

Uso esperado:
- entrar por QR de mesa
- ver menu publico
- crear pedido
- consultar solo pedidos ligados a su mesa

Importante:
- para ver el estado de un pedido publico ahora se necesita `orderId` + `qrToken`

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

Regla validada:
- sin token falla
- con `SUPER_ADMIN` funciona

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

### 3. KITCHEN

- `GET /api/v1/kitchen/orders`
- `PATCH /api/v1/kitchen/orders/{orderId}/preparing`
- `PATCH /api/v1/kitchen/order-items/{itemId}/ready`
- `PATCH /api/v1/kitchen/orders/{orderId}/ready`
- `GET /api/v1/kitchen/orders/history`

Reglas validadas:
- solo se ven pedidos del `businessId` del token
- no se puede marcar `READY` un item de otra cafeteria

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

Regla importante:
- si no mandas `qrToken`, falla
- si mandas QR de otra mesa, falla
- si mandas QR de otra cafeteria, falla

Esto debe respetarse tambien en frontend:
- guardar `qrToken` de la mesa al entrar
- reutilizar ese `qrToken` al pedir estado del pedido

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

## Reglas importantes ya validadas

- `register` no es publico despues del bootstrap inicial
- `SUPER_ADMIN` autenticado si puede registrar usuarios
- `ADMIN` y `KITCHEN` quedan aislados por `businessId`
- el estado publico del pedido exige `qrToken`
- un QR de otra mesa o de otra cafeteria no puede consultar pedidos ajenos
- caja no envia monto manual

## Lo que debe tener en cuenta tu frontend local

- usar `http://localhost:8081` como base del backend
- guardar `token`, `role` y `businessId` tras login
- proteger rutas privadas por rol
- para cliente QR, guardar `qrToken` y `businessSlug`
- para caja, no enviar `amount`
- para imagenes, usar `multipart/form-data`
- asumir que el backend aplica el aislamiento por cafeteria usando el `businessId` del token

## Recomendacion de estructura en frontend

- `services/auth.ts`
  - login
  - me

- `services/admin.ts`
  - users
  - tables
  - categories
  - products
  - addons
  - cashier

- `services/kitchen.ts`
  - list orders
  - preparing
  - item ready
  - order ready

- `services/public.ts`
  - table session
  - public menu
  - create order
  - order status

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
