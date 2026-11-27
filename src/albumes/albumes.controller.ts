import { Controller, Get, Param, ParseIntPipe, Post, Body, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AlbumesService } from './albumes.service.js';
import { CreateAlbumDto } from './dto/create-album.dto.js';
import { UpdateAlbumDto } from './dto/update-album.dto.js';

@Controller('albumes')
export class AlbumesController {
  constructor(private readonly albumesService: AlbumesService) {}

  @Get()
  findAll() {
    return this.albumesService.findAll();
  }

  @Get(':id/fotos')
  findFotos(@Param('id', ParseIntPipe) id: number) {
    return this.albumesService.findFotos(id);
  }


  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumesService.create(createAlbumDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateAlbumDto: UpdateAlbumDto
  ) {
    return this.albumesService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.albumesService.remove(id);
  }
}