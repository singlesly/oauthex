import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Attachment } from './attachment';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttachmentRepository {
  constructor(
    @InjectRepository(Attachment)
    private readonly repository: Repository<Attachment>,
  ) {}

  public async save(attachment: Attachment): Promise<Attachment> {
    return this.repository.save(attachment);
  }

  public async findByIdOrFail(id: string): Promise<Attachment> {
    return this.repository.findOneByOrFail({
      id,
    });
  }

  public async findByIds(ids: string[]): Promise<Attachment[]> {
    if (ids.length <= 0) {
      return [];
    }

    return this.repository.findBy({
      id: In(ids),
    });
  }
}
