import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Album } from '../../albumes/entities/album.entity.js';
import { Etiqueta } from './etiqueta.entity.js';

@Entity('fotos')
export class Foto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'real', default: 0 })
  calificacion: number;

  @Column({ type: 'varchar' })
  ruta: string;

  @Column({ type: 'text', nullable: true })
  fotografo: string | null;

  @ManyToOne(() => Album, (album) => album.fotos, { nullable: true, onDelete: 'SET NULL' })
  album: Album;

  @ManyToMany(() => Etiqueta)
  @JoinTable({ name: 'fotos_etiquetas' })
  etiquetas: Etiqueta[];

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}