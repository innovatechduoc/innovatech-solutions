// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI_IDENTITY = process.env.MONGODB_URI_IDENTITY!;
const MONGODB_URI_PROJECTS = process.env.MONGODB_URI_PROJECTS!;
const MONGODB_URI_RESOURCES = process.env.MONGODB_URI_RESOURCES!; // Nueva URI

if (!MONGODB_URI_IDENTITY || !MONGODB_URI_PROJECTS || !MONGODB_URI_RESOURCES) {
  throw new Error("Faltan definir las URIs en .env.local");
}

let cached = (global as any).mongooseConnections;

if (!cached) {
  cached = (global as any).mongooseConnections = {
    identity: { conn: null, promise: null },
    projects: { conn: null, promise: null },
    resources: { conn: null, promise: null }, // Nuevo caché para HR
  };
}

// 1. Conexión a Identidad (Usuarios/Login)
export async function connectIdentityDB() {
  if (cached.identity.conn) return cached.identity.conn;
  if (!cached.identity.promise) {
    cached.identity.promise = mongoose
      .createConnection(MONGODB_URI_IDENTITY)
      .asPromise();
  }
  cached.identity.conn = await cached.identity.promise;
  return cached.identity.conn;
}

// 2. Conexión a Proyectos
export async function connectProjectsDB() {
  if (cached.projects.conn) return cached.projects.conn;
  if (!cached.projects.promise) {
    cached.projects.promise = mongoose
      .createConnection(MONGODB_URI_PROJECTS)
      .asPromise();
  }
  cached.projects.conn = await cached.projects.promise;
  return cached.projects.conn;
}

// 3. Conexión a Recursos Humanos (HR)
export async function connectResourcesDB() {
  if (cached.resources.conn) return cached.resources.conn;
  if (!cached.resources.promise) {
    cached.resources.promise = mongoose
      .createConnection(MONGODB_URI_RESOURCES)
      .asPromise();
  }
  cached.resources.conn = await cached.resources.promise;
  return cached.resources.conn;
}
