import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ListEventsDto } from '../../events/requests/list-events.dto';
import { CreateEventDto } from '../../events/requests/create-event.dto';
import { UpdateEventDto } from '../../events/requests/update-event.dto';
import { Event } from './event';
import { Hive } from '../hives/hive';
import { SearchRequestDto } from '../../search/requests/search-request.dto';

@Injectable()
export class EventsRepository {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,

    @InjectRepository(Hive)
    private readonly hiveRepo: Repository<Hive>,
  ) {}

  async list(dto: ListEventsDto) {
    const skip = (dto.page! - 1) * dto.pageSize!;
    const take = dto.pageSize!;
    const sortDir = dto.sort === 'desc' ? 'DESC' : 'ASC';

    const qb = this.repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.hives', 'h')
      .leftJoinAndSelect('e.diary', 'd')
      .distinct(true)
      .orderBy('e.startAt', sortDir)
      .skip(skip)
      .take(take);

    if (dto.apiaryId) {
      qb.andWhere('e.apiaryId = :apiaryId', { apiaryId: dto.apiaryId });
    }

    if (dto.hiveIds?.length) {
      qb.andWhere('h.id IN (:...hiveIds)', { hiveIds: dto.hiveIds });
    }

    if (dto.from && dto.to) {
      const from = dto.from;
      const to = dto.to;
      if (to <= from)
        throw new BadRequestException('`to` must be greater than `from`');
      qb.andWhere('e.startAt >= :from AND e.endAt <= :to', { from, to });
    } else if (dto.from) {
      qb.andWhere('e.startAt >= :from', { from: dto.from });
    } else if (dto.to) {
      qb.andWhere('e.endAt <= :to', { to: dto.to });
    }

    const [items, total] = await qb.getManyAndCount();

    return { events: items, page: dto.page, pageSize: dto.pageSize, total };
  }

  async get(id: string) {
    const evt = await this.repo.findOne({
      where: { id },
      relations: { diary: true },
    });
    if (!evt) {
      throw new NotFoundException('Event not found');
    }
    return evt;
  }

  async create(dto: CreateEventDto, userId: string) {
    const hives = await this.hiveRepo.findBy({ id: In(dto.hiveIds) });
    if (hives.length !== dto.hiveIds.length) {
      throw new BadRequestException('Some hives not found');
    }

    const start = dto.startAt;
    const end = dto.endAt;

    if (end <= start) {
      throw new BadRequestException('endAt must be after startAt');
    }

    const notify = dto.notifyAt ? dto.notifyAt : null;
    if (notify && notify >= end) {
      throw new BadRequestException('notifyAt must be before endAt');
    }

    const notifyAtRepeat = dto.notifyAtRepeat ? dto.notifyAtRepeat : null;
    if (notifyAtRepeat && notifyAtRepeat >= end) {
      throw new BadRequestException('notifyAtRepeat must be before endAt');
    }

    const event = this.repo.create({
      apiaryId: dto.apiaryId,
      userId,
      startAt: start,
      endAt: end,
      notifyAt: notify ?? null,
      notifyAtRepeat: notifyAtRepeat ?? null,
      description: dto.description ?? null,
      hives,
      diary: dto.diaryId
        ? {
            id: dto.diaryId,
          }
        : null,
    });

    return await this.repo.save(event);
  }

  async update(id: string, dto: UpdateEventDto, hives: Hive[]) {
    const evt = await this.get(id);

    const start = dto.startAt ? dto.startAt : evt.startAt;
    const end = dto.endAt ? dto.endAt : evt.endAt;
    if (end <= start) {
      throw new BadRequestException('endAt must be after startAt');
    }

    if (dto.notifyAt !== undefined) {
      const notify = dto.notifyAt;
      if (notify instanceof Date && notify >= end) {
        throw new BadRequestException('notifyAt must be before endAt');
      }
      evt.notifyAt = notify ?? null;
    }
    if (dto.notifyAtRepeat !== undefined) {
      const notify = dto.notifyAtRepeat;
      if (notify instanceof Date && notify >= end) {
        throw new BadRequestException('notifyAtRepeat must be before endAt');
      }
      evt.notifyAtRepeat = notify ?? null;
    }

    evt.hives = hives;
    evt.startAt = start;
    evt.endAt = end;

    if (dto.description) evt.description = dto.description;

    return await this.repo.save(evt);
  }

  async remove(id: string) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Event not found');
    return { id };
  }

  async search(
    query: SearchRequestDto,
  ): Promise<{ items: Event[]; total: number }> {
    const qb = this.repo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.hives', 'h')
      .leftJoinAndSelect('event.apiary', 'apiary')
      .leftJoinAndSelect('event.diary', 'diary');

    qb.where('user.id = :userId', { userId: query.userId });

    if (query.search) {
      qb.andWhere(
        '(CAST(h.number as TEXT) ILIKE :search OR apiary.name ILIKE :search OR diary.note ILIKE :search OR event.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.explain !== 'events') {
      qb.limit(3);
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }
}
