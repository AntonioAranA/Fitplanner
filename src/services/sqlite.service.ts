import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

 async initDB() {
  if (!this.db) {
    this.db = await this.sqlite.createConnection('fitplannerDB', false, 'no-encryption', 1, false);

    await this.db.open();

    // Solo una vez: crear las tablas
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS rutinas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS ejercicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rutina_id INTEGER,
        nombre TEXT,
        repeticiones TEXT,
        imagen TEXT,
        FOREIGN KEY (rutina_id) REFERENCES rutinas(id)
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);



    // Comprobar si ya hay rutinas
    const rutinasActuales = await this.db.query('SELECT * FROM rutinas');
    if ((rutinasActuales.values?.length ?? 0) === 0) {
      console.log('Insertando rutinas por primera vez');
      await this.insertarRutinas();
    } else {
      console.log('Rutinas ya existen en la BD');
    }
  }
}


async insertarRutinas() {
  if (!this.db) throw new Error('DB no inicializada');

  // Rutina 1: Principiante
  let res = await this.db.run(`INSERT INTO rutinas (nombre) VALUES (?)`, ['Principiante']);
  const rutina1Id = res.changes?.lastId;

  await this.db.run(`INSERT INTO ejercicios (rutina_id, nombre, repeticiones, imagen)
    VALUES (?, ?, ?, ?)`, [rutina1Id, 'Sentadillas', '3 series de 15', 'assets/ejercicios/sentadillas.jpg']);

  await this.db.run(`INSERT INTO ejercicios (rutina_id, nombre, repeticiones, imagen)
    VALUES (?, ?, ?, ?)`, [rutina1Id, 'Flexiones', '3 series de 10', 'assets/ejercicios/flexiones.jpg']);

  // Rutina 2: Cardio
  res = await this.db.run(`INSERT INTO rutinas (nombre) VALUES (?)`, ['Cardio']);
  const rutina2Id = res.changes?.lastId;

  await this.db.run(`INSERT INTO ejercicios (rutina_id, nombre, repeticiones, imagen)
    VALUES (?, ?, ?, ?)`, [rutina2Id, 'Jumping Jacks', '3 series de 30 seg', 'assets/ejercicios/jumping.jpg']);

  await this.db.run(`INSERT INTO ejercicios (rutina_id, nombre, repeticiones, imagen)
    VALUES (?, ?, ?, ?)`, [rutina2Id, 'Burpees', '3 series de 10', 'assets/ejercicios/burpees.jpg']);

  // Rutina 3: Fuerza
  res = await this.db.run(`INSERT INTO rutinas (nombre) VALUES (?)`, ['Fuerza']);
  const rutina3Id = res.changes?.lastId;

  await this.db.run(`INSERT INTO ejercicios (rutina_id, nombre, repeticiones, imagen)
    VALUES (?, ?, ?, ?)`, [rutina3Id, 'Plancha', '3 x 30 seg', 'assets/ejercicios/plancha.jpg']);

  await this.db.run(`INSERT INTO ejercicios (rutina_id, nombre, repeticiones, imagen)
    VALUES (?, ?, ?, ?)`, [rutina3Id, 'Zancadas', '3 x 12 por pierna', 'assets/ejercicios/zancadas.webp']);
}


async getRutinasConEjercicios(): Promise<any[]> {
  if (!this.db) {
    throw new Error('Base de datos no inicializada');
  }

  const rutinas = await this.db.query('SELECT * FROM rutinas');
  const resultado: any[] = [];

  for (const rutina of rutinas.values ?? []) {
    const ejercicios = await this.db.query(
      'SELECT * FROM ejercicios WHERE rutina_id = ?',
      [rutina.id]
    );

    resultado.push({
      id: rutina.id,
      nombre: rutina.nombre,
      ejercicios: ejercicios.values ?? []
    });
  }

  return resultado;
}

async registrarUsuario(nombre: string, email: string, password: string): Promise<boolean> {
  if (!this.db) throw new Error('DB no inicializada');

  try {
    await this.db.run(
      `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`,
      [nombre, email, password]
    );
    return true;
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return false;
  }
}


async validarUsuario(email: string, password: string): Promise<any | null> {
  if (!this.db) throw new Error('DB no inicializada');

  try {
    const result = await this.db.query(
      `SELECT * FROM usuarios WHERE email = ? AND password = ?`,
      [email, password]
    );

    if (result.values && result.values.length > 0) {
      return result.values[0]; // Devuelve el usuario si existe
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error validando usuario:', error);
    return null;
  }
}

async existeEmail(email: string): Promise<boolean> {
  if (!this.db) throw new Error('DB no inicializada');

  try {
    const result = await this.db.query(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );

    return (result.values?.length ?? 0) > 0;
  } catch (error) {
    console.error('Error comprobando email:', error);
    return false;
  }
}



}
