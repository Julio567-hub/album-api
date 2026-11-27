import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module.js';
import { Foto } from './fotos/entities/foto.entity.js';
import { Album } from './albumes/entities/album.entity.js';
import { Etiqueta } from './fotos/entities/etiqueta.entity.js';

const app = await NestFactory.createApplicationContext(AppModule);
const ds = app.get(DataSource);

await ds.query('TRUNCATE fotos_etiquetas, fotos, etiquetas, albumes RESTART IDENTITY CASCADE');

const albums = await ds.getRepository(Album).save(
  ['Viajes', 'Guayaquil', 'Naturaleza'].map((nombre) => ({ nombre })),
);

const etiquetas = await ds.getRepository(Etiqueta).save(
  ['playa', 'ciudad', 'noche', 'cielo', 'montaña', 'rio'].map((nombre) => ({ nombre })),
);

const azar = <T>(lista: T[]) => lista[Math.floor(Math.random() * lista.length)];

for (let i = 1; i <= 20; i++) {
  await ds.getRepository(Foto).save({
    titulo: `Foto ${i}`,
    descripcion: `Descripción de la foto ${i}`,
    calificacion: Math.round(Math.random() * 50) / 10,
    ruta: `https://picsum.photos/id/${i * 10}/600/400`,
    album: azar(albums),
    etiquetas: [...new Set([azar(etiquetas), azar(etiquetas)])],
  });
}

console.log('✔ 20 fotos, 3 álbumes y 6 etiquetas insertadas');
await app.close();