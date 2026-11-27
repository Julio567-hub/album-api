import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Foto } from '../../fotos/entities/foto.entity.js';

@Entity('albumes')
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  // EL RETO: Agregamos unique: true
  @Column({ type: 'varchar', unique: true })
  nombre: string;

  @OneToMany(() => Foto, (foto) => foto.album)
  fotos: Foto[];
}