import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Apiary } from './apiary';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiaryStatusEnum } from './apiary-status.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

export interface FindFilteredApiariesOptions {
  readonly owners?: string[];
  readonly participants?: string[];
  readonly statuses?: ApiaryStatusEnum[];
}

@Injectable()
export class ApiaryRepository {
  constructor(
    @InjectRepository(Apiary)
    public readonly repository: Repository<Apiary>,
  ) {}

  public async save(apiary: Apiary): Promise<Apiary> {
    return this.repository.save(apiary);
  }

  public async findFilteredOwned(
    options: FindFilteredApiariesOptions,
    pagination: PaginationDto,
  ): Promise<[Apiary[], number]> {
    const qb = this.repository.createQueryBuilder('a');
    qb.take(pagination.getTake());
    qb.skip(pagination.getSkip());
    qb.leftJoinAndSelect('a.owner', 'o');
    qb.leftJoinAndSelect('a.participants', 'p');
    qb.leftJoinAndSelect('o.profile.avatar', 'opa');
    qb.leftJoinAndSelect('p.profile.avatar', 'ppa');

    qb.withDeleted();

    if (options.owners?.length) {
      qb.andWhere('a.owner IN (:...ownerIds)', { ownerIds: options.owners });
    }

    const [items, total] = await qb.getManyAndCount();

    return [items, total];
  }

  public async findFiltered(
    options: FindFilteredApiariesOptions,
    pagination: PaginationDto,
  ): Promise<[Apiary[], number]> {
    const qb = this.repository.createQueryBuilder('a');
    qb.take(pagination.getTake());
    qb.skip(pagination.getSkip());
    qb.leftJoinAndSelect('a.owner', 'o');
    qb.leftJoinAndSelect('a.participants', 'p');
    qb.leftJoinAndSelect('o.profile.avatar', 'opa');
    qb.leftJoinAndSelect('p.profile.avatar', 'ppa');

    qb.withDeleted();

    const participants = [
      ...(options.owners ?? []),
      ...(options.participants ?? []),
    ];

    if (participants.length > 0) {
      qb.orWhere('a.owner IN (:...ownerIds)', { ownerIds: participants });
      qb.orWhere('p.id IN (:...participantIds)', {
        participantIds: participants,
      });
    }

    const [items, total] = await qb.getManyAndCount();

    return [items, total];
  }

  async findByIdOrFail(apiaryId: string): Promise<Apiary> {
    return this.repository.findOneOrFail({
      where: {
        id: apiaryId,
      },
      relations: ['participants'],
      withDeleted: true,
    });
  }

  async findById(apiaryId: string) {
    return this.repository.findOne({
      where: {
        id: apiaryId,
      },
    });
  }

  public async softRemove(apiary: Apiary): Promise<void> {
    await this.repository.softRemove(apiary);
  }

  public async restore(apiaryId: string): Promise<void> {
    await this.repository.restore({
      id: apiaryId,
    });
  }
}
