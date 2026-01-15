import { Injectable } from '@nestjs/common';
import { Brackets, LessThan, Repository } from 'typeorm';
import { Diary } from './diary';
import { InjectRepository } from '@nestjs/typeorm';
import { ListDiaryRequestDto } from '../../diary/requests/list-diary-request.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SearchRequestDto } from '../../search/requests/search-request.dto';
import { IntervalEnum } from '../../analytics/enums/interval.enum';

export interface ChartItem {
  timestamp: Date;
  value: string;
}

export interface GetChartOptions {
  from: Date;
  to: Date;
  hiveId: string;
  interval: IntervalEnum;
  field: 'strength' | 'brood';
}

@Injectable()
export class DiaryRepository {
  constructor(
    @InjectRepository(Diary)
    private readonly repository: Repository<Diary>,
  ) {}

  public async findByLastByHiveId(hiveId: string): Promise<Diary | undefined> {
    const diary = await this.repository.findOne({
      where: {
        hive: {
          id: hiveId,
        },
      },
      order: {
        inspectedAt: 'DESC',
      },
      relations: {
        hive: true,
      },
    });

    return diary ?? undefined;
  }

  public async findByIdOrFail(id: string): Promise<Diary> {
    return this.repository.findOneOrFail({
      where: {
        id,
      },
      relations: [
        'hive',
        'hive.apiary',
        'attachments',
        'dictionaries',
        'author',
        'author.profile.avatar',
        'events',
      ],
    });
  }

  public async findPrevByDiary(diary: Diary): Promise<Diary | undefined> {
    const result = await this.repository.findOne({
      where: {
        inspectedAt: LessThan(diary.inspectedAt),
        hive: {
          id: diary.hive.id,
        },
      },
      cache: {
        id: diary.id,
        milliseconds: 2 * 60 * 1_000,
      },
      relations: ['hive'],
    });

    return result ?? undefined;
  }

  public async save(entity: Diary): Promise<void> {
    await this.repository.save(entity);
  }

  public async findFiltered(
    query: ListDiaryRequestDto,
    pagination: PaginationDto,
  ): Promise<[Diary[], number]> {
    const qb = this.repository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.hive', 'hive')
      .leftJoinAndSelect('hive.apiary', 'apiary')
      .leftJoinAndSelect('diary.attachments', 'attachments')
      .leftJoinAndSelect('diary.dictionaries', 'dictionaries')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.events', 'events')
      .leftJoinAndSelect('author.profile.avatar', 'profile');

    qb.take(pagination.getTake()).skip(pagination.getSkip());

    // framesFrom и framesTo
    if (query.framesFrom !== undefined) {
      qb.andWhere('diary.frames >= :framesFrom', {
        framesFrom: query.framesFrom,
      });
    }
    if (query.framesTo !== undefined) {
      qb.andWhere('diary.frames <= :framesTo', { framesTo: query.framesTo });
    }

    // broodFrom и broodTo
    if (query.broodFrom !== undefined) {
      qb.andWhere('diary.brood >= :broodFrom', { broodFrom: query.broodFrom });
    }
    if (query.broodTo !== undefined) {
      qb.andWhere('diary.brood <= :broodTo', { broodTo: query.broodTo });
    }

    // strengthFrom и strengthTo
    if (query.strengthFrom !== undefined) {
      qb.andWhere('diary.strength >= :strengthFrom', {
        strengthFrom: query.strengthFrom,
      });
    }
    if (query.strengthTo !== undefined) {
      qb.andWhere('diary.strength <= :strengthTo', {
        strengthTo: query.strengthTo,
      });
    }

    // authorIds (массив)
    if (query.authorIds && query.authorIds.length > 0) {
      qb.andWhere('author.id IN (:...authorIds)', {
        authorIds: query.authorIds,
      });
    }

    // dictionariesIds (many-to-many, массив)
    if (query.dictionariesIds && query.dictionariesIds.length > 0) {
      qb.andWhere('dictionaries.id IN (:...dictionariesIds)', {
        dictionariesIds: query.dictionariesIds,
      });
    }

    // inspectedAtFrom и inspectedAtTo (даты)
    if (query.inspectedAtFrom) {
      qb.andWhere('diary.inspectedAt >= :inspectedAtFrom', {
        inspectedAtFrom: query.inspectedAtFrom,
      });
    }
    if (query.inspectedAtTo) {
      qb.andWhere('diary.inspectedAt <= :inspectedAtTo', {
        inspectedAtTo: query.inspectedAtTo,
      });
    }

    // hiveIds (массив)
    if (query.hiveIds && query.hiveIds.length > 0) {
      qb.andWhere('hive.id IN (:...hiveIds)', { hiveIds: query.hiveIds });
    }

    // hasAttachments (boolean)
    if (query.hasAttachments !== undefined) {
      if (query.hasAttachments) {
        qb.andWhere('attachments.id IS NOT NULL');
      } else {
        qb.andWhere('attachments.id IS NULL');
      }
    }

    // commentKeywords (массив строк, поиск по комментарию, например, LIKE)
    if (query.commentKeywords && query.commentKeywords.length > 0) {
      qb.andWhere(
        new Brackets((qb1) => {
          (query.commentKeywords ?? []).forEach((keyword, index) => {
            const paramName = `keyword${index}`;
            if (index === 0) {
              qb1.where(`diary.note ILIKE :${paramName}`, {
                [paramName]: `%${keyword}%`,
              });
            } else {
              qb1.orWhere(`diary.note ILIKE :${paramName}`, {
                [paramName]: `%${keyword}%`,
              });
            }
          });
        }),
      );
    }

    if (query.sortBy && query.sort && query.sortBy === 'author') {
      qb.addOrderBy('author.name.last', query.sort);
    } else if (query.sortBy && query.sort && query.sortBy === 'hive') {
      qb.addOrderBy('hive.number', query.sort);
    } else if (query.sortBy && query.sort) {
      qb.addOrderBy(`diary.${query.sortBy}`, query.sort);
    } else {
      qb.addOrderBy('diary.createdAt', 'DESC');
    }

    if (query.apiaryId) {
      qb.andWhere('apiary.id = :apiaryId', { apiaryId: query.apiaryId });
    }

    return qb.getManyAndCount();
  }

  public async softRemove(diary: Diary): Promise<void> {
    await this.repository.softRemove(diary);
  }

  async search(
    query: SearchRequestDto,
  ): Promise<{ items: Diary[]; total: number }> {
    const qb = this.repository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.hive', 'hive')
      .leftJoinAndSelect('hive.apiary', 'apiary');

    qb.where('author.id = :authorId', { authorId: query.userId });

    if (query.search) {
      qb.andWhere('diary.note ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.explain !== 'diaries') {
      qb.limit(3);
    }
    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  async getChart(options: GetChartOptions): Promise<ChartItem[]> {
    const { from, to, interval, field, hiveId } = options;

    const qb = this.repository.createQueryBuilder('sd');

    return qb
      .select(`date_trunc('${interval.toLowerCase()}', sd.createdAt)`, 'time')
      .addSelect(`AVG(CAST(sd.${field} AS float))`, 'value')
      .where('sd.createdAt BETWEEN :from AND :to', {
        from: from,
        to: to,
      })
      .andWhere('sd.hive_id = :hiveId', { hiveId })
      .groupBy('time')
      .orderBy('time', 'ASC')
      .getRawMany<ChartItem>();
  }
}
