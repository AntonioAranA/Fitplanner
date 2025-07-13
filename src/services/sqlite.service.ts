import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
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
  private isWeb: boolean;

  constructor(private platform: Platform) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.isWeb = !this.platform.is('capacitor'); // Detectamos si estamos en navegador
  }

  async initDB() {
    if (this.isWeb) {
      // En modo web no hacemos nada con SQLite
      console.log('Modo web: no inicializa SQLite');
      return;
    }

    if (!this.db) {
      this.db = await this.sqlite.createConnection('fitplannerDB', false, 'no-encryption', 1, false);
      await this.db.open();

      // Crear tablas si no existen
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

      // Verificar si ya hay rutinas, si no insertar
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
    if (this.isWeb) {
      // Mock para entorno web / navegador
      return [
        {
          id: 1,
          nombre: 'Principiante',
          ejercicios: [
            { nombre: 'Sentadillas', repeticiones: '3x15', imagen: 'assets/ejercicios/sentadillas.jpg' },
            { nombre: 'Flexiones', repeticiones: '3x10', imagen: 'assets/ejercicios/flexiones.jpg' },
          ]
        },
        {
          id: 2,
          nombre: 'Cardio',
          ejercicios: [
            { nombre: 'Jumping Jacks', repeticiones: '3x30 seg', imagen: 'assets/ejercicios/jumping.jpg' },
            { nombre: 'Burpees', repeticiones: '3x10', imagen: 'assets/ejercicios/burpees.jpg' },
          ]
        },
        {
          id: 3,
          nombre: 'Fuerza',
          ejercicios: [
            { nombre: 'Plancha', repeticiones: '3x30 seg', imagen: 'assets/ejercicios/plancha.jpg' },
            { nombre: 'Zancadas', repeticiones: '3x12 por pierna', imagen: 'assets/ejercicios/zancadas.webp' },
          ]
        }
      ];
    }

    if (!this.db) throw new Error('Base de datos no inicializada');

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
    if (this.isWeb) {
      console.log('Mock: usuario registrado en modo navegador');
      return true;
    }

    if (!this.db) throw new Error('DB no inicializada');

    try {
      const emailExiste = await this.existeEmail(email);
      if (emailExiste) {
        // El correo ya está registrado, no intentar insertar
        return false;
      }

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
    if (this.isWeb) {
      // Mock usuario para entorno web / navegador
      if (email === 'usuario@correo.com' && password === '123456') {
        return { id: 1, nombre: 'usuario', email };
      }
      return null;
    }

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
    if (this.isWeb) {
      // En modo mock asumimos que el email no existe
      return false;
    }

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
