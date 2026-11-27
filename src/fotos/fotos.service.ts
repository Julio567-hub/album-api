import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, In, Repository } from 'typeorm';
import { CreateFotoDto } from './dto/create-foto.dto.js';
import { UpdateFotoDto } from './dto/update-foto.dto.js';
import { QueryFotosDto } from './dto/query-fotos.dto.js';
import { Foto } from './entities/foto.entity.js';
import { Etiqueta } from './entities/etiqueta.entity.js';

@Injectable()
export class FotosService {
  constructor(
    @InjectRepository(Foto)
    private readonly fotosRepository: Repository<Foto>,
    @InjectRepository(Etiqueta)
    private readonly etiquetasRepository: Repository<Etiqueta>,
  ) {}

  async create({ albumId, etiquetas, ...datos }: CreateFotoDto): Promise<Foto> {
    const foto = this.fotosRepository.create({
      ...datos,
      album: albumId ? ({ id: albumId } as any) : null,
      etiquetas: await this.buscarOCrearEtiquetas(etiquetas),
    });
    const guardada = await this.fotosRepository.save(foto as any);
    return this.findOne(guardada.id);
  }

  private async buscarOCrearEtiquetas(textos: string[] = []) {
    const limpios = [...new Set(textos.map((t) => t.trim().toLowerCase()))];
    if (limpios.length === 0) return [];

    const existentes = await this.etiquetasRepository.findBy({ nombre: In(limpios) } as any);
    const nuevas = limpios
      .filter((t) => !existentes.some((e: any) => (e.nombre || e.texto) === t))
      .map((texto) => this.etiquetasRepository.create({ nombre: texto } as any));
      
    return [...existentes, ...(await this.etiquetasRepository.save(nuevas as any))] as any;
  }

  async findAll(filtro: QueryFotosDto) {
    const { min, max, q, page, limit } = filtro;
    const where: any = { calificacion: Between(min, max) };
    if (q) where.titulo = ILike(`%${q}%`);
    
    const [data, total] = await this.fotosRepository.findAndCount({
      where,
      relations: { etiquetas: true, album: true },
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Foto> {
    const foto = await this.fotosRepository.findOne({
      where: { id },
      relations: { etiquetas: true, album: true },
    });
    if (!foto) {
      throw new NotFoundException(`La foto con ID ${id} no existe`);
    }
    return foto;
  }

  async update(id: number, { albumId, etiquetas, ...datos }: UpdateFotoDto): Promise<Foto> {
    const foto = await this.findOne(id);
    
    Object.assign(foto, datos);
    if (albumId != undefined) foto.album = { id: albumId } as Foto['album'];
    if (etiquetas) foto.etiquetas = await this.buscarOCrearEtiquetas(etiquetas);
    
    await this.fotosRepository.save(foto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const foto = await this.findOne(id);
    await this.fotosRepository.remove(foto);
  }
}