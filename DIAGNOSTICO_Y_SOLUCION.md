# 🔴 Diagnóstico: Datos no Visibles en el Frontend

## **Checklist de Verificación**

### ✅ Paso 1: Verificar que PostgreSQL está corriendo
```bash
# En terminal, ejecuta:
sudo systemctl status postgresql

# Si no está corriendo, inicia el servicio:
sudo systemctl start postgresql

# Verifica que la BD existe:
sudo -u postgres psql -l | grep sge_db
```

**Resultado esperado:** Deberías ver `sge_db | sonia123`

---

### ✅ Paso 2: Verificar que el Backend (Java Spring Boot) está corriendo
```bash
cd /home/fabrica2024/Escritorio/SGE-PROYECTO/backend

# Ejecuta el servidor backend:
./mvnw spring-boot:run
```

**Resultado esperado:** Deberías ver en la consola:
```
Tomcat started on port(s): 8080 (http)
```

---

### ✅ Paso 3: Probar la conexión Backend ↔ Base de Datos
Abre otra terminal y ejecuta:
```bash
curl http://localhost:8080/api/eventos
```

**Resultado esperado:** 
- Si hay eventos: `[{"id":1,"nombre":"Evento1",...}]`
- Si está vacía: `[]` (sin errores)
- Si hay error: `Connection refused` o `404`

---

### ✅ Paso 4: Verificar que el Frontend (Angular) está corriendo
```bash
cd /home/fabrica2024/Escritorio/SGE-PROYECTO/frontend

# Ejecuta el servidor frontend:
npm start
```

**Resultado esperado:** 
```
Angular Live Development Server is listening on localhost:4200
```

Luego abre en el navegador: `http://localhost:4200`

---

## **Síntomas y Soluciones**

| Síntoma | Causa | Solución |
|---------|-------|----------|
| **Tabla vacía en Dashboard** | Backend no devuelve datos | Ver Paso 3 arriba |
| **Error en consola del navegador** | Backend no está corriendo | Ver Paso 2 arriba |
| **`Connection refused` en curl** | Puerto 8080 no está abierto | Verificar firewall o proceso en puerto |
| **BD vacía** | No hay eventos cargados | Insertar datos manualmente (ver Paso 5) |

---

### ✅ Paso 5: Insertar datos de prueba en PostgreSQL
Si la tabla está vacía, ejecuta:

```bash
# Conecta a PostgreSQL:
sudo -u postgres psql -d sge_db

# Copia y pega esto en el terminal psql:
INSERT INTO eventos (nombre, fecha_evento, aforo_maximo, tipo_evento, modalidad, estado, creado_at) 
VALUES 
  ('Torneo de Programación', NOW(), 50, 'TORNEO', 'PRESENCIAL', 'ACTIVO', NOW()),
  ('Capacitación Web 2025', NOW() + INTERVAL '5 days', 100, 'CAPACITACION', 'VIRTUAL', 'ACTIVO', NOW()),
  ('Taller JavaScript Avanzado', NOW() + INTERVAL '10 days', 30, 'TALLER', 'PRESENCIAL', 'ACTIVO', NOW());

# Verifica que se insertaron:
SELECT * FROM eventos;

# Salir:
\q
```

---

## **Flujo de Comunicación (Verificación)**

```
Frontend (Angular 4200)
    ↓ GET /api/eventos
Backend (Spring Boot 8080)
    ↓ EventoController.listar()
Backend Service
    ↓ findByEstado(ACTIVO)
PostgreSQL (5432)
    ↓ SELECT * FROM eventos WHERE estado='ACTIVO'
    ↑ Devuelve JSON
Frontend recibe datos
    ↓ this.eventos.set(data)
Dashboard muestra tabla ✅
```

---

## **Logs Importantes**

- **Backend:** Ver en consola donde ejecutas `./mvnw spring-boot:run`
- **Frontend:** Ver en navegador con `F12` → Console
- **Base de Datos:** Ver con `sudo -u postgres psql -d sge_db`

---

## **Si Nada Funciona:**

1. Verifica los puertos:
```bash
lsof -i :5432  # PostgreSQL
lsof -i :8080  # Backend
lsof -i :4200  # Frontend
```

2. Comprueba conectividad a BD desde Java:
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--debug"
```

3. Limpia caché del navegador:
- `Ctrl+Shift+Delete` en Chrome/Firefox
- Selecciona "Todas las cookies y datos del sitio"
- Recarga la página

