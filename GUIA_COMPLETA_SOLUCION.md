sudo -u postgres psql -d sge_dbsudo -u postgres psql -d sge_db# 🚀 GUÍA COMPLETA: Mostrar Datos de BD en el Frontend

## **El Problema**
Tu frontend (Angular) está intentando mostrar eventos desde `http://localhost:8080/api/eventos`, pero:
- La tabla aparece vacía
- No hay errores evidentes en la consola

## **Las Causas Más Comunes**

### 1️⃣ **Base de Datos Vacía** (Causa #1)
La tabla `eventos` en PostgreSQL no tiene registros.

### 2️⃣ **Backend No Está Conectado a la BD** (Causa #2)
Problemas de conexión entre Spring Boot y PostgreSQL.

### 3️⃣ **CORS Bloqueando las Solicitudes** (Causa #3)
El frontend no puede comunicarse con el backend.

---

## **SOLUCIÓN PASO A PASO**

### ✅ **PASO 1: Verificar que PostgreSQL Está Activo**

Abre una terminal y ejecuta:
```bash
sudo systemctl status postgresql
```

Si ves **active (running)**, está bien. Si no, ejecuta:
```bash
sudo systemctl start postgresql
```

---

### ✅ **PASO 2: Insertar Datos de Prueba en la BD**

Ejecuta esto en una terminal:

```bash
sudo -u postgres psql
```

Luego copia y pega esto dentro de psql:

```sql
-- Conectarse a la BD
\c sge_db

-- Ver si la tabla existe
\dt eventos

-- Insertar eventos de prueba
INSERT INTO eventos (nombre, fecha_evento, aforo_maximo, tipo_evento, modalidad, estado, creado_at) 
VALUES 
  ('🏆 Torneo de Programación 2025', NOW() + INTERVAL '5 days', 50, 'TORNEO', 'PRESENCIAL', 'ACTIVO', NOW()),
  ('📚 Capacitación Web con Angular', NOW() + INTERVAL '10 days', 100, 'CAPACITACION', 'VIRTUAL', 'ACTIVO', NOW()),
  ('💻 Taller JavaScript Avanzado', NOW() + INTERVAL '15 days', 30, 'TALLER', 'PRESENCIAL', 'ACTIVO', NOW()),
  ('🎓 Masterclass DevOps', NOW() + INTERVAL '20 days', 40, 'CAPACITACION', 'VIRTUAL', 'ACTIVO', NOW());

-- Verificar que se insertaron
SELECT * FROM eventos;

-- Salir
\q
```

**Resultado esperado:** Deberías ver 4 eventos listados.

---

### ✅ **PASO 3: Reiniciar el Backend**

Si el backend estaba corriendo **antes** de insertar los datos, debes reiniciarlo:

```bash
# Ve a la carpeta del backend
cd /home/fabrica2024/Escritorio/SGE-PROYECTO/backend

# Detén el servidor (si está corriendo en IntelliJ, haz clic en STOP)
# Luego reinicia:
./mvnw clean spring-boot:run
```

Espera a ver:
```
Tomcat started on port(s): 8080 (http)
```

---

### ✅ **PASO 4: Verificar que el Backend Devuelve Datos**

Abre otra terminal y ejecuta:

```bash
curl http://localhost:8080/api/eventos
```

**Resultado esperado:** Deberías ver algo como:
```json
[
  {"id":1,"nombre":"🏆 Torneo de Programación 2025","fechaEvento":"2025-04-28T...","aforoMaximo":50,"tipoEvento":"TORNEO","modalidad":"PRESENCIAL","estado":"ACTIVO",...},
  {"id":2,"nombre":"📚 Capacitación Web con Angular",...},
  ...
]
```

Si ves `[]` vacío = **los datos no se insertaron correctamente**.
Si ves error de conexión = **el backend no está corriendo**.

---

### ✅ **PASO 5: Recargar el Frontend**

1. Abre `http://localhost:4200` en tu navegador
2. Presiona `F5` para recargar (o `Ctrl+Shift+R` para limpiar caché)
3. Deberías ver la tabla con los eventos ✅

---

## **Si Aún No Aparecen los Datos**

### 🔍 **Verificación Avanzada**

**1. Abre la consola del navegador (F12)**

Ve a la pestaña **Console** y busca errores como:
- `CORS error` → El backend no permite solicitudes desde el frontend
- `404 Not Found` → La ruta del API no existe
- `Connection refused` → El backend no está corriendo

**2. Abre la pestaña Network (F12)**

- Haz clic en el Dashboard
- Busca una solicitud GET a `http://localhost:8080/api/eventos`
- Si ves **Status: 200** pero datos vacíos `[]` → La BD está vacía
- Si ves **Status: 0** → Problema de CORS

**3. Verifica los logs del Backend**

En IntelliJ, busca en la consola (parte inferior) líneas como:
```
SELECT ... FROM eventos
Hibernate: select ...
```

Si no ves nada = **la consulta nunca se ejecutó**.

---

## **Configuración CORS (Si Es Necesario)**

Si ves errores CORS, abre el archivo:
`/home/fabrica2024/Escritorio/SGE-PROYECTO/backend/src/main/java/com/sge/backend/config/SecurityConfig.java`

Y asegúrate que tenga algo como:

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
                config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
                config.setAllowedHeaders(Arrays.asList("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/eventos/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

---

## **Checklist Final**

- [ ] PostgreSQL está corriendo
- [ ] Los eventos están en la tabla `eventos`
- [ ] El backend está corriendo en puerto 8080
- [ ] Curl devuelve los eventos (No está vacío `[]`)
- [ ] El frontend está corriendo en puerto 4200
- [ ] La página se recargó (F5)
- [ ] Los datos aparecen en la tabla del Dashboard ✅

---

## **Comandos Útiles de Depuración**

```bash
# Ver si PostgreSQL está escuchando
sudo -u postgres psql -c "SELECT version();"

# Ver si el backend está corriendo
curl -v http://localhost:8080/actuator/health

# Ver si Angular está compilado
curl http://localhost:4200

# Ver los procesos activos
ps aux | grep -E "postgres|java|node"
```

---

## **Si Nada Funciona: Reinicio Total**

```bash
# 1. Detén todo
sudo systemctl restart postgresql
pkill -f "spring-boot"
cd /home/fabrica2024/Escritorio/SGE-PROYECTO/frontend
# Ctrl+C en la terminal del frontend

# 2. Limpia caché
cd /home/fabrica2024/Escritorio/SGE-PROYECTO/backend
./mvnw clean

# 3. Reinicia el backend
./mvnw spring-boot:run &

# 4. Espera 10 segundos, luego reinicia el frontend
cd ../frontend
npm start

# 5. Abre http://localhost:4200
```

¡Ahora debería funcionar! 🎉

