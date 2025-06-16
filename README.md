# Task Management Front

Este proyecto está desplegado en [task-managment-front.vercel.app](https://task-managment-front.vercel.app). Es la interfaz gráfica de usuario para un sistema de gestión de tareas. Fue de

##  Objetivo

Desarrollar una SPA (Single Page Application) moderna con React y Next.js que consuma una API RESTful para la gestión de tareas, incluyendo autenticación, estados y control total del flujo CRUD.

---

##  Tecnologías utilizadas

- **Next.js 15 (App Router)**
- **React 19**
- **TypeScript**
- **Redux Toolkit** – Manejo de estado global
- **Tailwind CSS** – Estilos responsivos
- **Zod + React Hook Form** – Validación de formularios
- **Axios** – Cliente HTTP
- **Lucide-react** – Íconos
- **React-hot-toast** – Notificaciones
- **Date-fns** – Manejo de fechas

---

##  Arquitectura utilizada

Se utilizó una arquitectura **Modular basada en dominio funcional**, estructurada sobre el sistema de rutas del **App Router** de Next.js.

###  Características clave:

- **Módulos separados por dominio** (`tasks`, `states`, `auth`, `dashboard`)
- **Layouts jerárquicos** definidos por ruta
- **Capa de UI desacoplada** con componentes reutilizables (`components/ui`)
- **Estado global** con Redux Toolkit (`store/slices`)
- **Tipos centralizados** en `/types`
- **Helpers y lógica de red** separados en `/lib`

>  Esta arquitectura permite escalar la aplicación fácilmente, seguir buenas prácticas como separación de responsabilidades y mantener un código limpio, mantenible y testeable.

---

## Estructura de carpetas principal

```bash
app/
├─ (auth)/login/
├─ (auth)/register/
├─ (dashboard)/dashboard/
├─ states/
├─ tasks/
components/
├─ layout/
├─ ui/
lib/
store/
├─ slices/
types/
```

## Instalación y ejecución local

1. Clonar el repositorio
```bash
git clone 
```
2. Navegar a la carpeta del proyecto
```bash
cd task-management-front
```
3. Crear archivo en .env
```bash
mkadir .env
```
4. Copiar las variables de entornos enviadas tal como puenstra en .env.example

5. Intalar dependecias 
```bash
npm install
```
6. Correr en local
```bash
npm run dev
```


## 💻 Funcionalidades implementadas

- Login y registro con validación
- Gestión completa de tareas (crear, editar, eliminar)
- Gestión de estados (CRUD completo)
- Listado de tareas con filtros
- Skeleton loaders y toasts de feedback
- Manejo de errores de la API
- Autenticación con JWT (persistencia de token)

---

##  Decisiones técnicas

- **Next.js App Router**: mejor control del layout, segmentación de rutas, manejo de loaders y soporte para SSR.
- **Redux Toolkit**: gestión de estado centralizada, simple y escalable.
- **React Hook Form + Zod**: validación declarativa con tipado estricto y manejo eficiente de formularios.
- **Tailwind CSS**: desarrollo rápido y flexible de UI moderna y responsiva.
- **Arquitectura modular por dominio**: facilita la escalabilidad y la colaboración en equipos grandes.

---

## Buenas prácticas aplicadas

- Tipado estricto con TypeScript
- Separación clara entre presentación, dominio y datos
- Componentes reutilizables
- Código modular y desacoplado
- Manejo global de errores y notificaciones
- Accesibilidad y diseño responsive

---

## Backend del proyecto
**Repositorio del backend**: privado 

---
