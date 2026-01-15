import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './request';

@Injectable()
export class RequestRepository {
  constructor(
    @InjectRepository(Request)
    public readonly repository: Repository<Request>,
  ) {}
}
