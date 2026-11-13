import { Injectable, NotFoundException } from '@nestjs/common';
import type { Foto } from './entities/foto.entity.ts';

@Injectable()
export class FotosService {
    private fotos: Foto[] = [
        {
            id: 1, titulo: 'Atardecer', calificacion: 4.5 },
        {
            id: 2, titulo: 'Malecon', calificacion: 4.0 },
    ];

    findAll(): Foto[] {
        return this.fotos;
    }

    findOne(id: number): Foto {
        const foto = this.fotos.find((f) => f.id === id);
        if (!foto) {
            throw new NotFoundException('Foto no encontrada');
        }
        return foto;
    }

    create(datos: Omit<Foto, 'id'>): Foto {
        const nueva = { id: this.fotos.length + 1, ...datos };
        this.fotos.push(nueva);
        return nueva;
    }
}