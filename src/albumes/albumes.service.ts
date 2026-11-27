import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity.js';
import { CreateAlbumDto } from './dto/create-album.dto.js';
import { UpdateAlbumDto } from './dto/update-album.dto.js';

@Injectable()
export class AlbumesService {
  constructor(
    @InjectRepository(Album)
    private readonly albumesRepo: Repository<Album>,
  ) {}

  findAll() {
    return this.albumesRepo.find({ order: { id: 'ASC' } });
  }

  async findFotos(id: number) {
    const album = await this.albumesRepo.findOne({
      where: { id },
      relations: { fotos: true },
    });

    if (!album) throw new NotFoundException(`Álbum ${id} no encontrado`);

    return album;
  }


  async create(createAlbumDto: CreateAlbumDto) {
    const album = this.albumesRepo.create(createAlbumDto);
    return await this.albumesRepo.save(album);
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.albumesRepo.findOneBy({ id });
    if (!album) throw new NotFoundException(`Álbum ${id} no encontrado`);

    Object.assign(album, updateAlbumDto);
    
    return await this.albumesRepo.save(album);
  }

  async remove(id: number) {
    const album = await this.albumesRepo.findOneBy({ id });
    if (!album) throw new NotFoundException(`Álbum ${id} no encontrado`);

    await this.albumesRepo.remove(album);
    
    return { message: `Álbum ${id} eliminado correctamente` };
  }
}