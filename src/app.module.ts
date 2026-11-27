import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotosModule } from './fotos/fotos.module.js';
import { AlbumesModule } from './albumes/albumes.module.js';
import { Foto } from './fotos/entities/foto.entity.js';
import { Etiqueta } from './fotos/entities/etiqueta.entity.js';
import { Album } from './albumes/entities/album.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        username: config.get('DB_USER'),
        database: config.get('DB_NAME'),
        port: config.get<number>('DB_PORT'),
        password: config.get('DB_PASSWORD'),
        entities: [Foto, Etiqueta, Album],
        synchronize: true,
      }),
    }),
    FotosModule,
    AlbumesModule,
  ],
})
export class AppModule {}