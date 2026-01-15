import { Injectable } from '@nestjs/common';
import { CustomField } from './custom-field';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomFieldRepository {
  constructor(
    @InjectRepository(CustomField)
    private readonly repository: Repository<CustomField>,
  ) {}

  public async save(customFields: CustomField): Promise<CustomField> {
    return this.repository.save(customFields);
  }
}
