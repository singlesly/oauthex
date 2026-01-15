import { Column } from 'typeorm';

export class Address {
  @Column()
  public readonly city!: string;

  constructor(city: string = '') {
    this.city = city;
  }
}
