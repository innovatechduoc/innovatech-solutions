# Innovatech Solutions 🚀

[cite_start]**Plataforma Inteligente para la gestión integral de proyectos tecnológicos**[cite: 3].

[cite_start]Este proyecto es una solución desarrollada para la asignatura **DESARROLLO FULLSTACK III (DSY1106)**. [cite_start]El sistema está diseñado para resolver la falta de visibilidad en tiempo real, la dificultad en la asignación de recursos y el monitoreo del desempeño laboral en entornos de desarrollo de software[cite: 13].

## 📖 Descripción del Proyecto

[cite_start]Innovatech Solutions es una empresa de desarrollo de software a medida y consultoría (retail, fintech, sector público y privado) con más de 120 empleados[cite: 5, 6]. [cite_start]Debido a su crecimiento acelerado [cite: 7][cite_start], se ha construido esta plataforma tecnológica integrada basada en arquitectura de microservicios para centralizar la gestión de proyectos y mejorar la colaboración[cite: 8, 14].

### 🧩 Módulos Principales
[cite_start]La solución contempla tres áreas principales[cite: 15]:

1. [cite_start]**Gestión de Proyectos:** Permite la planificación, ejecución y seguimiento de proyectos, incluyendo la definición de tareas, asignación de responsables y control de estados de avance[cite: 16].
2. [cite_start]**Gestión de Recursos y Colaboración:** Facilita la asignación de profesionales (capacity) a los proyectos, gestionando la disponibilidad del recurso humano de la empresa[cite: 17, 31].
3. [cite_start]**Monitoreo y Analítica (Dashboard):** Panel interactivo con indicadores clave de desempeño (KPI) y métricas de avance para la toma de decisiones[cite: 18].

---

## 🛠️ Arquitectura y Tecnologías

[cite_start]El proyecto implementa un patrón **Backend For Frontend (BFF)** [cite: 38] [cite_start]integrado en el framework Next.js, conectándose a bases de datos independientes para garantizar la separación de responsabilidades y la escalabilidad[cite: 22].

* **Frontend:** React / Next.js (App Router), Tailwind CSS. [cite_start]Interfaz responsiva e intuitiva[cite: 31, 35].
* [cite_start]**Backend (API):** Next.js Serverless Functions actuando como API Gateway y manejador de microservicios[cite: 23].
* **Base de Datos:** MongoDB.
* **ORM / ODM:** Mongoose (Arquitectura de múltiples conexiones simultáneas).
* **Despliegue:** Vercel (Producción) y MongoDB Atlas (Cloud Database).

### 🗄️ Ecosistema de Bases de Datos (Microservicios)
[cite_start]Para asegurar que los servicios sean escalables y desacoplados[cite: 25], el sistema utiliza tres tuberías de conexión independientes:
* `innovatech_identity`: Gestión de usuarios, autenticación (bcrypt) y roles.
* `innovatech_projects`: Gestión de proyectos, tareas y notificaciones del sistema.
* `innovatech_hr`: Base de datos de recursos humanos y capacidad de empleados.

---

## ⚙️ Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### 1. Clonar el repositorio
[cite_start]Garantizando el versionamiento de código colaborativo[cite: 42]:
```bash
git clone [https://github.com/TU-USUARIO/innovatech-solutions.git](https://github.com/TU-USUARIO/innovatech-solutions.git)
cd innovatech-solutions
