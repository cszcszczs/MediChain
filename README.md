# MediChain

Aplicación móvil para gestionar información y permisos relacionados con la atención clínica. Permite registrar pacientes y profesionales, crear historiales clínicos y administrar autorizaciones de acceso desde una interfaz móvil.

> **Alcance:** este repositorio contiene el cliente móvil. La API, la base de datos y cualquier infraestructura de almacenamiento o blockchain deben ejecutarse y documentarse por separado. La aplicación se comunica con un backend HTTP; el nombre del proyecto no significa que la lógica de blockchain esté implementada en este repositorio.

## Funcionalidades

- Inicio y cierre de sesión contra el backend.
- Registro de pacientes y profesionales de salud.
- Creación de historiales clínicos con signos vitales, síntomas, diagnóstico, tratamiento, medicamentos, exámenes, notas y archivos adjuntos.
- Consulta y gestión de autorizaciones de acceso: creación, aceptación, revocación, búsqueda y filtrado por estado.
- Interfaz en español para Android, iOS y web.

## Tecnologías

- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) y React Native 0.88.
- React 19 y TypeScript en modo estricto.
- React Navigation 7 (navegación nativa de pila y pestañas).
- Expo SecureStore para guardar credenciales en dispositivos nativos.
- Expo Document Picker para seleccionar adjuntos.

## Requisitos

- Node.js compatible con Expo SDK 58.
- npm (el repositorio incluye `package-lock.json`).
- Backend MediChain activo y accesible desde el dispositivo o emulador.
- Para ejecutar en un dispositivo físico, teléfono y equipo de desarrollo deben poder comunicarse por la red.

## Puesta en marcha

1. Instala las dependencias:

   ```bash
   npm ci
   ```

2. Crea la configuración local a partir de la plantilla:

   ```bash
   cp .env.example .env.local
   ```

   En Windows PowerShell, puedes usar:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Edita `.env.local` y define `EXPO_PUBLIC_API_URL` con la URL base de la API, incluyendo el prefijo de versión que utilice el backend. La plantilla usa `http://192.168.1.10:3000/v1` como ejemplo; reemplázala por una dirección disponible en tu entorno.

   - En un dispositivo físico, usa una dirección IP o un nombre de host alcanzable desde el teléfono. `localhost` apunta al propio teléfono, no al equipo donde se ejecuta el backend.
   - En simuladores/emuladores, usa la dirección que corresponda a su configuración de red.
   - Para entornos desplegados, usa HTTPS y no guardes credenciales ni secretos en el cliente.

4. Inicia Expo:

   ```bash
   npx expo start
   ```

   También están disponibles estos scripts:

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

   Abre el proyecto con Expo Go o con un emulador/simulador compatible. El flujo de compilación nativa de producción se configura mediante EAS.

## Comandos útiles

```bash
npm run lint
npx tsc --noEmit
```

Para compilar con los perfiles definidos en `eas.json`:

```bash
npx eas-cli@latest build --profile preview --platform android
npx eas-cli@latest build --profile production --platform android
```

Los perfiles `development`, `preview` y `production` están configurados para distribución interna, cliente de desarrollo y producción, respectivamente. Configura las credenciales de firma y el proyecto EAS antes de iniciar una compilación. Cambia `--platform android` por `ios` cuando corresponda.

## Estructura del proyecto

```text
.
├── App.tsx                    # Proveedores globales y punto de entrada de la UI
├── index.ts                   # Registro del componente raíz en Expo
├── app.json                   # Configuración de Expo y plugins nativos
├── eas.json                   # Perfiles de compilación y envío EAS
├── assets/                    # Iconos y recursos de la aplicación
└── src/
    ├── components/            # Componentes reutilizables y secciones de formularios
    ├── contexts/              # Estado compartido, como la sesión
    ├── hooks/                 # Estado y operaciones de formularios/datos
    ├── navigation/            # Navegadores de pila y pestañas
    ├── screens/               # Pantallas principales
    ├── services/              # Cliente HTTP, autenticación y operaciones de API
    ├── styles/                # Estilos compartidos por componentes y pantallas
    ├── types/                 # Tipos de navegación
    └── utils/                 # Validación, transformación y formato de datos
```

### Cómo se organiza y funciona

1. `index.ts` registra la aplicación y carga `App.tsx`.
2. `App.tsx` monta `SafeAreaProvider`, `AuthProvider` y `AppNavigator`.
3. `AppNavigator` define una pantalla de inicio de sesión y, después de autenticarse, la navegación principal con cuatro pestañas: **Pacientes**, **Profesional**, **Historial** y **Permisos**.
4. Cada pantalla usa hooks para mantener estado, validar/subir formularios y presentar errores o resultados. Los componentes de `components/` descomponen formularios y listas por sección.
5. Los hooks delegan las llamadas remotas a `services/`. `services/api.ts` aplica la URL base, añade el token cuando la operación requiere autenticación, interpreta errores HTTP y valida las respuestas mediante analizadores tipados.
6. `utils/` transforma los valores de formularios en los DTO que espera la API, además de aplicar validaciones de entrada. `types/` contiene tipos compartidos de navegación.

## Pantallas y módulos principales

| Pantalla | Función |
| --- | --- |
| Inicio de sesión | Envía correo y contraseña a `auth/login`; al completarse, muestra la navegación principal. |
| Pacientes | Registra información personal, de contacto y credenciales de un paciente. |
| Profesional | Registra datos personales, especialidad, institución, licencia y credenciales de un profesional. |
| Historial | Selecciona un paciente y registra la consulta, signos vitales, diagnóstico, tratamiento, medicamentos, exámenes, notas y adjuntos. |
| Permisos | Lista autorizaciones, filtra por estado o nombre y permite crear, aceptar o revocar permisos según las acciones disponibles para el usuario. |

Los hooks `usePatientRegistration`, `useProfessionalRegistration` y `useHistoryForm` gestionan los formularios correspondientes. `usePatients`, `useProfessionals` y `useAccessGrants` obtienen y actualizan los datos remotos. `useAuth` expone el contexto de autenticación.

## Integración con el backend

La URL configurada en `EXPO_PUBLIC_API_URL` es la base. El cliente agrega estas rutas relativas:

| Método | Ruta | Uso |
| --- | --- | --- |
| `POST` | `auth/login` | Iniciar sesión. |
| `GET`, `POST` | `patient` | Listar y registrar pacientes. |
| `GET`, `POST` | `professional` | Listar y registrar profesionales. |
| `POST` | `history` | Crear un historial clínico. |
| `GET`, `POST` | `access-grants` | Listar y crear autorizaciones de acceso. |
| `PATCH` | `access-grants/{id}/accept` | Aceptar una autorización. |
| `PATCH` | `access-grants/{id}/revoke` | Revocar una autorización. |

Las operaciones están implementadas en `src/services/`. Salvo el inicio de sesión, las solicitudes usan el token de acceso como credencial Bearer. Las respuestas se validan en el cliente; el backend sigue siendo responsable de validar los datos, autenticar al usuario y hacer cumplir las reglas de autorización.

La creación de un historial usa `multipart/form-data`: un campo `data` con el JSON del historial y campos `attachments` para los archivos. La interfaz limita los adjuntos a cinco archivos PDF, JPEG o PNG de hasta 10 MB cada uno.

## Configuración y datos sensibles

- `EXPO_PUBLIC_API_URL` es una variable pública incluida en el bundle de Expo; úsala solo para la dirección de la API, nunca para secretos.
- `.env.local` está excluido de Git por `.gitignore`. No publiques tokens, contraseñas ni datos clínicos reales.
- En iOS y Android, el token y el perfil local se gestionan con Expo SecureStore. En web, se conservan únicamente en memoria y se pierden al recargar la página.
- La validación y las restricciones visuales del cliente mejoran la experiencia, pero no sustituyen la autorización del servidor. Protege los endpoints y los datos clínicos en el backend.
- Para uso real, configura TLS/HTTPS, controles de acceso, políticas de privacidad, registros y retención de datos en los servicios que correspondan.

## Configuración Expo y compilaciones

`app.json` define el nombre, iconos, orientación, plugins y el identificador Android. `eas.json` configura los perfiles de compilación. Los directorios nativos `ios/` y `android/` no se versionan; Expo los genera cuando son necesarios. Los ajustes nativos deben hacerse en `app.json` o mediante plugins compatibles con Expo.

## Estado del proyecto

Este repositorio contiene la aplicación cliente y no incluye el código del backend ni una especificación OpenAPI. Para ejecutar los flujos que dependen de datos, primero configura un backend que implemente las rutas y formatos esperados arriba. No se define actualmente un script de pruebas automatizadas en `package.json`; usa lint y TypeScript como comprobaciones locales.
