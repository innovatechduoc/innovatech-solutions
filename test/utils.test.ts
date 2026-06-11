// lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { normalizeStatus, calcularProgreso, getInitials } from "../lib/utils";

describe("Funciones de Utilidad de Innovatech", () => {
  // Prueba 1
  it('1. normalizeStatus debe convertir "Completado" en "Finalizado"', () => {
    const resultado = normalizeStatus("Completado");
    expect(resultado).toBe("Finalizado");
  });

  // Prueba 2
  it('2. normalizeStatus debe devolver "Planificación" para estados desconocidos', () => {
    const resultado = normalizeStatus("EstadoInventado");
    expect(resultado).toBe("Planificación");
  });

  // Prueba 3
  it('3. calcularProgreso debe devolver 100 si el estado es "Finalizado"', () => {
    const resultado = calcularProgreso("Finalizado");
    expect(resultado).toBe(100);
  });

  // Prueba 4
  it("4. getInitials debe extraer las iniciales correctas de un email corporativo", () => {
    const resultado = getInitials("ignacio.perez@innovatech.com");
    // "ignacio.perez" se vuelve "ignacio perez", y saca "IP"
    expect(resultado).toBe("IP");
  });

  // Prueba 5
  it('5. getInitials debe devolver "US" si recibe null o está vacío', () => {
    const resultadoNull = getInitials(null);
    const resultadoVacio = getInitials("");

    expect(resultadoNull).toBe("US");
    expect(resultadoVacio).toBe("US");
  });
});
