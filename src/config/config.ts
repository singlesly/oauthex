import { validateSync } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export abstract class Config {
  fromProcessEnv(env: NodeJS.Process['env']): this {
    return plainToInstance(this.constructor as ClassConstructor<this>, env, {
      excludeExtraneousValues: true,
    });
  }

  setProperty<K extends keyof this, V extends this[K]>(
    propName: K,
    value: V,
  ): this {
    this[propName] = value;

    return this;
  }

  validate(): this {
    const v = validateSync(this);

    if (v.length) {
      console.error(v);
      throw new Error('validation error');
    }

    return this;
  }
}
