# Auditoría funcional y técnica — SmartQueue SaaS

Fecha: 2026-03-05  
Repositorio: `SmartQueue`  
Stack detectado: Laravel 12 + Inertia React + Tailwind + Reverb (configurado) + PostgreSQL (driver disponible)

## 1) Resumen ejecutivo

El proyecto **sí tiene una base inicial** para un SaaS de turnos (modelo multi-nivel básico + dashboard + CRUD parcial), pero está aún en **fase MVP temprana**.

- **Existe** estructura inicial de datos para `tenants`, `branches`, `departments`, `staff` y `tickets`.
- **Existe** UI administrativa para empresas/sucursales/departamentos y dashboard básico de turnos.
- **No existe todavía** la operación omnicanal real (QR cliente, WhatsApp bot, kiosko, display público en vivo, terminal staff operativa).
- **No existe todavía** motor de estados avanzado, NPS, analítica operativa ni seguridad multi-tenant estricta a nivel de autorización.

## 2) Qué ya está implementado

### 2.1 Base tecnológica

- Laravel 12 declarado en dependencias.
- React + Inertia + Tailwind para frontend.
- Reverb y Echo instalados a nivel de configuración/dependencias.
- Configuración de PostgreSQL disponible en `config/database.php`.

### 2.2 Modelo de datos inicial (núcleo)

Tablas creadas por migraciones:

- `tenants`
- `branches` (relación con tenant)
- `departments` (relación con branch)
- `staff` (relación con department)
- `tickets` (relación con department + campos básicos de cola)

Campos útiles ya presentes para operación básica:

- `tickets.source`, `tickets.status`, `tickets.customer_phone`, `tickets.call_count`
- `staff.qr_hash` y `staff.status`

### 2.3 UI y módulos funcionales disponibles

- Pantalla de bienvenida + autenticación base (Breeze/Inertia).
- Dashboard con listado de turnos activos (`WAITING`, `CALLING`, `SERVING`) y KPIs básicos.
- Gestión de empresas (crear/listar).
- Gestión de sucursales por empresa (crear/editar/eliminar/listar).
- Gestión de departamentos por sucursal (componente y controlador existen).

## 3) Qué está parcial o inconsistente

### 3.1 Enrutamiento incompleto

- Hay `DepartmentController` y vista `Departments/Index`, pero **las rutas de departamentos no aparecen registradas en `routes/web.php`** (la UI referencia rutas `departments.*` que no están definidas).

### 3.2 Dominio incompleto en modelos

- Varios modelos (`Ticket`, `Department`, `Staff`) no tienen `fillable/casts/scopes` completos ni relaciones de negocio extendidas.
- `Tenant` solo permite `name` en fillable, aunque la migración define más campos relevantes (`whatsapp_phone_id`, `meta_access_token`, `is_active`).

### 3.3 Multi-tenant sin enforcement

- Existe la entidad `tenant`, pero no se observa aislamiento estricto por tenant en middleware/policies/global scopes.
- Los controladores usan queries directas sin una capa de autorización por rol/tenant.

### 3.4 Tiempo real aún “preparado”, no operativo

- Hay configuración de Reverb/Echo, pero no se detectan eventos de dominio (`ticket.created`, `ticket.called`, etc.) ni canales por sucursal/departamento implementados.

## 4) Qué NO está implementado (contra tu especificación)

### 4.1 Omnicanal

- Flujo cliente por QR web/PWA completo (generación y seguimiento de ticket en vivo): **no implementado**.
- Integración WhatsApp Cloud API + webhook + state machine conversacional: **no implementado**.
- Kiosko con UI dedicada + impresión térmica: **no implementado**.

### 4.2 Operación de mostrador (staff butcher-first)

- Terminal staff con zona de escaneo HID y lógica Smart Scan: **no implementado**.
- Reglas de re-llamado / auto no-show por `max_calls` y ventana de gracia: **no implementado**.
- Recuperar/re-encolar con prioridad configurable: **no implementado**.
- Transferencia entre departamentos: **no implementado**.

### 4.3 Display público en tiempo real

- Vista TV con turno actual, historial, audio/voz y anuncios: **no implementado**.
- Manejo explícito de pérdida de señal en display: **no implementado**.

### 4.4 Máquina de estados robusta

- Estados opcionales/operativos (`CANCELLED`, `TRANSFERRED`, `EXPIRED`) y transiciones auditables: **no implementado**.
- Timestamps de proceso (`called_at`, `served_at`, `serving_started_at`, etc.): **no implementado**.
- Asignación de atención explícita estándar (`assigned_staff_id`) no modelada como tal en `tickets` (hay `called_by` solamente): **parcial**.

### 4.5 NPS y calidad

- Disparo de encuesta al finalizar turno: **no implementado**.
- Persistencia de respuestas NPS y clasificación promotor/pasivo/detractor: **no implementado**.
- Alertas por detractores severos y dashboard NPS por niveles: **no implementado**.

### 4.6 Analítica operativa/KPIs vendibles

- Métricas de espera/atención por empleado/departamento/sucursal en backend: **no implementado**.
- Alertas de fila crítica y umbrales configurables: **no implementado**.
- Reportería consolidada avanzada por empresa/sucursal: **no implementado**.

### 4.7 Seguridad y gobierno SaaS

- Roles y permisos por nivel (super admin, admin empresa, gerente sucursal, supervisor, staff, viewer): **parcial** (solo indicio en `user.role` de layout, sin sistema de autorización robusto).
- Auditoría de acciones operativas (quién saltó/re-encoló/finalizó): **no implementado**.
- Rate limiting por canal (kiosko/web/whatsapp): **no implementado**.

### 4.8 Resiliencia híbrida/offline

- Modo LAN/edge local con sincronización diferida a nube: **no implementado**.

## 5) Riesgos actuales para salida a producción

1. **Riesgo funcional alto**: el producto aún no cubre el flujo core del negocio en tienda (llamado, atención completa, no-show, recuperación, omnicanal).
2. **Riesgo de autorización/multi-tenant**: falta aislamiento robusto por tenant y políticas por rol.
3. **Riesgo operacional**: sin eventos en tiempo real de dominio, no hay sincronización consistente entre vistas.
4. **Riesgo de trazabilidad**: no existe bitácora de acciones clave ni estados auditables completos.

## 6) Estado por bloques (semáforo)

- Arquitectura base Laravel 12 + React: 🟢
- Modelo inicial de entidades principales: 🟡
- CRUD administrativo básico: 🟡
- Omnicanal real (QR/WhatsApp/Kiosko): 🔴
- Staff terminal operativa (escáner/acciones): 🔴
- Display público en vivo: 🔴
- Máquina de estados robusta: 🔴
- NPS integrado: 🔴
- Analítica/KPIs avanzados: 🔴
- Seguridad multi-tenant por roles/policies: 🔴
- Resiliencia offline/edge: 🔴

## 7) Siguiente corte recomendado (prioridad)

### Fase 1 — Cerrar “core operativo”

1. Completar rutas/casos de uso de departamentos y tickets.
2. Implementar motor de estados de tickets + transiciones válidas + timestamps.
3. Construir terminal staff mínima (llamar, re-llamar, no-show, servir).
4. Emitir/broadcast eventos de dominio por sucursal/departamento.

### Fase 2 — Omnicanal y experiencia cliente

1. Flujo QR cliente + ticket digital en vivo.
2. WhatsApp inbound/outbound con state machine y plantillas.
3. Display público en vivo con audio de llamado.

### Fase 3 — Calidad y escalado SaaS

1. NPS end-to-end (captura, clasificación, alertas, dashboard).
2. RBAC completo + policies + auditoría de acciones.
3. KPIs operativos consolidados por nivel.
4. Preparación de modo híbrido/offline (enterprise).

---

## Nota de verificación técnica

No fue posible ejecutar pruebas de Laravel (`artisan`) en este entorno porque el repositorio no contiene carpeta `vendor` (dependencias de Composer no instaladas), por lo que la auditoría se realizó por inspección estática de código.
