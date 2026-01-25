import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { BaseExceptionFilter } from '@nestjs/core';
import express from 'express';

@Catch(EntityNotFoundError)
export class TypeormExceptionFilter extends BaseExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<express.Response>();

    response.status(HttpStatus.NOT_FOUND);
    response.send(exception);
  }
}
