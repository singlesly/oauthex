import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Hive } from './hive';
import { ListHiveRequestDto } from '../../hive/requests/list-hive-request.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SearchRequestDto } from '../../search/requests/search-request.dto';
import * as ExcelJS from 'exceljs';

export interface BeehivesCountResult {
  apiary_id: string; // или number
  beehives_count: string;
}

export interface BeehivesCountMap {
  [apiaryId: string]: number;
}

@Injectable()
export class HiveRepository {
  public readonly repository: Repository<Hive>;
  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Hive);
  }

  public async save(hive: Hive): Promise<Hive> {
    return this.repository.save(hive);
  }

  async findFiltered(
    query: ListHiveRequestDto,
    pagination: PaginationDto,
  ): Promise<[Hive[], number]> {
    const qb = this.repository
      .createQueryBuilder('hive')
      .leftJoinAndSelect('hive.apiary', 'apiary')
      .leftJoinAndSelect('hive.dictionaries', 'dictionaries')
      .leftJoinAndSelect('hive.attachments', 'attachments')
      .withDeleted();

    if (query.apiaryId) {
      qb.andWhere('apiary.id = :apiaryId', { apiaryId: query.apiaryId });
    }

    // Добавляем пагинацию
    const { take, skip } = pagination.getTakeSkip();
    qb.take(take).skip(skip);

    if (query.hiveNumber !== undefined) {
      qb.andWhere('CAST(hive.number AS TEXT) LIKE :hiveNumber', {
        hiveNumber: `%${query.hiveNumber}%`,
      });
    }

    if (query.framesFrom !== undefined) {
      qb.andWhere('hive.frames >= :framesFrom', {
        framesFrom: query.framesFrom,
      });
    }

    if (query.framesTo !== undefined) {
      qb.andWhere('hive.frames <= :framesTo', { framesTo: query.framesTo });
    }

    if (query.broodFrom !== undefined) {
      qb.andWhere('hive.brood >= :broodFrom', { broodFrom: query.broodFrom });
    }

    if (query.broodTo !== undefined) {
      qb.andWhere('hive.brood <= :broodTo', { broodTo: query.broodTo });
    }

    if (query.strengthFrom !== undefined) {
      qb.andWhere('hive.strength >= :strengthFrom', {
        strengthFrom: query.strengthFrom,
      });
    }

    if (query.strengthTo !== undefined) {
      qb.andWhere('hive.strength <= :strengthTo', {
        strengthTo: query.strengthTo,
      });
    }

    if (query.uterusYear !== undefined) {
      qb.andWhere('hive.uterusYear = :uterusYear', {
        uterusYear: query.uterusYear,
      });
    }

    if (query.uterusMark !== undefined) {
      qb.andWhere('hive.uterusMark = :uterusMark', {
        uterusMark: query.uterusMark,
      });
    }

    // dictionariesIds (many-to-many, массив)
    if (query.dictionariesIds && query.dictionariesIds.length > 0) {
      qb.andWhere('dictionaries.id IN (:...dictionariesIds)', {
        dictionariesIds: query.dictionariesIds,
      });
    }

    if (query.uterusBreed) {
      qb.andWhere('hive.uterusBreed = :uterusBreed', {
        uterusBreed: query.uterusBreed,
      });
    }

    if (query.sort && query.sortBy) {
      qb.orderBy(`hive.${query.sortBy}`, query.sort);
    }

    // Выполняем запрос и получаем данные с подсчетом общего количества
    const [items, count] = await qb.getManyAndCount();

    return [items, count];
  }

  async findByIdOrFail(hiveId: string): Promise<Hive> {
    return this.repository.findOneOrFail({
      where: {
        id: hiveId,
      },
      relations: ['apiary', 'attachments', 'dictionaries'],
      withDeleted: true,
    });
  }

  async softRemove(hive: Hive) {
    await this.repository.softRemove(hive);
  }

  async restore(hive: Hive) {
    await this.repository.restore(hive.id);
  }

  async findOneByApiaryId(apiaryId: string): Promise<Hive> {
    return this.repository.findOneOrFail({
      where: {
        apiary: {
          id: apiaryId,
        },
      },
      relations: ['apiary'],
    });
  }

  async findByNumber(apiaryId: string, number: number) {
    return this.repository.findOne({
      where: {
        apiary: {
          id: apiaryId,
        },
        number,
      },
      relations: ['apiary'],
    });
  }

  async count(apiaryId: string): Promise<number> {
    return this.repository.count({
      where: {
        apiary: {
          id: apiaryId,
        },
      },
      relations: ['apiary'],
    });
  }

  async strengthAndBreedByApiary(apiaryId: string): Promise<{
    totalBrood: number;
    totalStrength: number;
    averageHappiness: number;
    totalDevices: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('h')
      .select('SUM(h.brood)', 'totalBrood')
      .addSelect('SUM(h.strength)', 'totalStrength')
      .addSelect('AVG(h.happiness)', 'averageHappiness')
      .addSelect('SUM(h.devices)', 'totalDevices')
      .andWhere('h.apiary_id = :apiaryId', { apiaryId })
      .withDeleted()
      .getRawOne<{
        totalBrood: number;
        totalStrength: number;
        averageHappiness: number;
        totalDevices: number;
      }>();

    if (!result) {
      return {
        averageHappiness: 0,
        totalBrood: 0,
        totalStrength: 0,
        totalDevices: 0,
      };
    }

    return result;
  }

  public async search(
    query: SearchRequestDto,
  ): Promise<{ items: Hive[]; total: number }> {
    const qb = this.repository
      .createQueryBuilder('hive')
      .leftJoinAndSelect('hive.apiary', 'apiary')
      .leftJoinAndSelect('apiary.owner', 'owner');

    qb.where('owner.id = :ownerId', { ownerId: query.userId });

    if (query.explain !== 'hives') {
      qb.limit(3);
    }

    if (query.search) {
      qb.andWhere('CAST(hive.number as TEXT) ILIKE :searchTerm', {
        searchTerm: `%${query.search}%`,
      });
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  public async exportHives(apiaryId: string) {
    const hives = await this.repository.find({
      where: {
        apiary: {
          id: apiaryId,
        },
      },
      relations: { apiary: true },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Hives');

    sheet.mergeCells('A1', 'Q1');
    sheet.getCell('A1').value = `Apiary: ${apiaryId}`;
    sheet.getRow(1).font = { bold: true };

    sheet.addRow([]);

    const headerRow = sheet.addRow([
      '#',
      'Идентификатор улья',
      'Название пасеки',
      'Номер улья',
      'Умный улей',
      'Рамки',
      'Сила',
      'Расплод',
      'Устройства',
      'Благополучие/Счастье',
      'Год матки',
      'Метка матки',
      'Порода матки',
      'Цвет матки',
      'Создано в',
      'Обновлено в',
    ]);

    headerRow.font = { bold: true };

    hives.forEach((hive, index) => {
      const u = hive.uterus;

      sheet.addRow([
        index + 1,
        hive.id,
        hive.apiary.name,
        hive.number,
        hive.isSmart ? 'Да' : 'Нет',
        hive.frames,
        hive.strength,
        hive.brood,
        hive.devices,
        hive.happiness,
        u?.year ?? '',
        u?.mark ?? '',
        u?.breed ?? '',
        u?.color ?? '',
        hive.createdAt?.toISOString() ?? '',
        hive.updatedAt?.toISOString() ?? '',
      ]);
    });

    sheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell?.((cell: ExcelJS.Cell) => {
        const raw = cell.value;
        const v =
          raw == null
            ? ''
            : typeof raw === 'object'
              ? JSON.stringify(raw)
              : String(raw);
        if (v.length > maxLength) maxLength = v.length;
      });
      column.width = maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  public async getHivesCountByApiaryIds(
    ids: string[],
  ): Promise<BeehivesCountMap> {
    if (ids.length <= 0) {
      return {};
    }
    const result = await this.repository // Прямо к таблице ульев
      .createQueryBuilder('hive')
      .select('hive.apiary_id', 'apiary_id') // Замените 'apiaryId' на имя вашего внешнего ключа
      .addSelect('COUNT(hive.id)', 'beehives_count')
      .where('hive.apiary_id IN (:...ids)', { ids: ids })
      .groupBy('hive.apiary_id')
      .getRawMany<BeehivesCountResult>();

    // Преобразуем результат в нужный формат
    const countMap: BeehivesCountMap = {};
    result.forEach((item) => {
      countMap[item.apiary_id] = parseInt(item.beehives_count, 10);
    });

    // Добавляем пасеки с нулевым количеством ульев
    ids.forEach((id) => {
      if (!countMap[id]) {
        countMap[id] = 0;
      }
    });

    return countMap;
  }

  async findByIds(hiveIds: string[]) {
    if (hiveIds.length <= 0) {
      return [];
    }

    return this.repository.find({
      where: {
        id: In(hiveIds),
      },
    });
  }

  public async findAllIds(): Promise<string[]> {
    const qb = this.repository.createQueryBuilder('h').select('id');
    const result = await qb.getRawMany<{ id: string }>();

    return result.map((x) => x.id);
  }
}
