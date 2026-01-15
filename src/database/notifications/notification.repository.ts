import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification';
import { ListNotificationRequest } from '../../notifications/requests/list-notification.request';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { NotificationStatusEnum } from './notification-status.enum';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  public async countByStatus(
    dto: ListNotificationRequest,
    status: NotificationStatusEnum,
  ): Promise<number> {
    const qb = this.repository
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.hive', 'h')
      .leftJoinAndSelect('h.apiary', 'a')
      .leftJoinAndSelect('a.owner', 'o')
      .leftJoinAndSelect('a.participants', 'p');

    qb.andWhere('n.status = :status', { status });

    if (dto.apiaryId) {
      qb.andWhere('a.id = :id', { id: dto.apiaryId });
    }

    if (dto.userId) {
      qb.andWhere('(o.id = :ownerId OR p.id = :ownerId)', {
        ownerId: dto.userId,
      });
    }

    if (dto.hiveIds && dto.hiveIds.length > 0) {
      qb.andWhere('h.id IN (:...hiveIds)', { hiveIds: dto.hiveIds });
    }

    if (dto.dateFrom) {
      qb.andWhere('n.createdAt >= :dateFrom', { dateFrom: dto.dateFrom });
    }

    if (dto.dateTo) {
      qb.andWhere('n.createdAt <= :dateTo', { dateTo: dto.dateTo });
    }

    if (dto.hiveNumber) {
      qb.andWhere('h.number = :hiveNumber', { hiveNumber: dto.hiveNumber });
    }

    return qb.getCount();
  }

  public async findFiltered(
    dto: ListNotificationRequest,
    pagination: PaginationDto,
  ): Promise<[Notification[], number]> {
    const qb = this.repository.createQueryBuilder('n');
    qb.leftJoinAndSelect('n.hive', 'h')
      .leftJoinAndSelect('h.apiary', 'a')
      .leftJoinAndSelect('a.owner', 'o')
      .leftJoinAndSelect('a.participants', 'p')
      .leftJoinAndSelect('n.recipient', 'r')
      .take(pagination.getTake())
      .skip(pagination.getSkip());

    if (dto.apiaryId) {
      qb.andWhere('a.id = :id', { id: dto.apiaryId });
    }

    if (dto.userId) {
      qb.andWhere('(o.id = :ownerId OR p.id = :ownerId OR r.id = :ownerId)', {
        ownerId: dto.userId,
      });
    }

    if (dto.status) {
      qb.andWhere('n.status = :status', { status: dto.status });
    }

    if (dto.hiveIds && dto.hiveIds.length > 0) {
      qb.andWhere('h.id IN (:...hiveIds)', { hiveIds: dto.hiveIds });
    }

    if (dto.dateFrom) {
      qb.andWhere('n.createdAt >= :dateFrom', { dateFrom: dto.dateFrom });
    }

    if (dto.dateTo) {
      qb.andWhere('n.createdAt <= :dateTo', { dateTo: dto.dateTo });
    }

    if (dto.hiveNumber) {
      qb.andWhere('h.number = :hiveNumber', { hiveNumber: dto.hiveNumber });
    }

    qb.andWhere('n.project = :project', { project: dto.project });

    qb.orderBy('n.createdAt', 'DESC');

    return qb.getManyAndCount();
  }

  public async findByIdOrFail(id: string): Promise<Notification> {
    return this.repository.findOneOrFail({
      where: {
        id,
      },
      relations: ['hive', 'hive.apiary'],
    });
  }

  public async save(notification: Notification): Promise<void> {
    await this.repository.save(notification);
  }

  async markAllAsReadByHiveId(hiveId: string): Promise<void> {
    const notifications = await this.repository.find({
      where: {
        hive: {
          id: hiveId,
        },
      },
      relations: ['hive'],
    });

    const ids = notifications.map((notification) => notification.id);

    if (ids.length === 0) {
      return;
    }

    await this.repository
      .createQueryBuilder()
      .update(Notification)
      .set({
        status: NotificationStatusEnum.READ,
      })
      .whereInIds(ids)
      .execute();
  }

  async findByMetadataNotifications(
    criteria: Record<string, unknown>,
  ): Promise<Notification[]> {
    return this.repository
      .createQueryBuilder('n')
      .where('n.metadata::jsonb @> :criteria', {
        criteria,
      })
      .getMany();
  }

  async removeById(notificationId: string) {
    const notification = await this.repository.findOneByOrFail({
      id: notificationId,
    });
    await this.repository.remove(notification);
  }

  async remove(...notifications: Notification[]) {
    await this.repository.remove(notifications);
  }
}
