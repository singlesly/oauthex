import { Column } from 'typeorm';

export class Name {
  @Column()
  public readonly last!: string;

  @Column()
  public readonly first!: string;

  @Column()
  public readonly patronymic!: string;

  constructor(first: string = '', last: string = '', patronymic: string = '') {
    this.first = first;
    this.last = last;
    this.patronymic = patronymic;
  }

  public get fullName(): string {
    return `${this.last} ${this.first} ${this.patronymic}`;
  }
}
