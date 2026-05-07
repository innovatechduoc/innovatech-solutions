# Innovatech Solutions 🚀

**Plataforma Inteligente para la gestión integral de proyectos tecnológicos**
Este proyecto es una solución desarrollada para la asignatura **DESARROLLO FULLSTACK III (DSY1106)**. El sistema está diseñado para resolver la falta de visibilidad en tiempo real, la dificultad en la asignación de recursos y el monitoreo del desempeño laboral en entornos de desarrollo de software.

## 📖 Descripción del Proyecto

Innovatech Solutions es una empresa de desarrollo de software a medida y consultoría (retail, fintech, sector público y privado) con más de 120 empleados. Debido a su crecimiento acelerado, se ha construido esta plataforma tecnológica integrada basada en arquitectura de microservicios para centralizar la gestión de proyectos y mejorar la colaboración.

### 🧩 Módulos Principales
La solución contempla tres áreas principales:

1. **Gestión de Proyectos:** Permite la planificación, ejecución y seguimiento de proyectos, incluyendo la definición de tareas, asignación de responsables y control de estados de avance.
2. **Gestión de Recursos y Colaboración:** Facilita la asignación de profesionales (capacity) a los proyectos, gestionando la disponibilidad del recurso humano de la empresa.
3. **Monitoreo y Analítica (Dashboard):** Panel interactivo con indicadores clave de desempeño (KPI) y métricas de avance para la toma de decisiones.

---

## 🛠️ Arquitectura y Tecnologías

El proyecto implementa un patrón **Backend For Frontend (BFF)** integrado en el framework Next.js, conectándose a bases de datos independientes para garantizar la separación de responsabilidades y la escalabilidad.

* **Frontend:** React / Next.js (App Router), Tailwind CSS. Interfaz responsiva e intuitiva.
* **Backend (API):** Next.js Serverless Functions actuando como API Gateway y manejador de microservicios.
* **Base de Datos:** MongoDB.
* **ORM / ODM:** Mongoose (Arquitectura de múltiples conexiones simultáneas).
* **Despliegue:** Vercel (Producción) y MongoDB Atlas (Cloud Database).

### 🗄️ Ecosistema de Bases de Datos (Microservicios)
Para asegurar que los servicios sean escalables y desacoplados, el sistema utiliza tres tuberías de conexión independientes:
* `innovatech_identity`: Gestión de usuarios, autenticación (bcrypt) y roles.
* `innovatech_projects`: Gestión de proyectos, tareas y notificaciones del sistema.
* `innovatech_hr`: Base de datos de recursos humanos y capacidad de empleados.

---

## ⚙️ Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### 1. Clonar el repositorio
Garantizando el versionamiento de código colaborativo:
```bash
git clone [https://github.com/innovatechduoc/innovatech-solutions.git](https://github.com/innovatechduoc/innovatech-solutions.git)
cd innovatech-solutions
