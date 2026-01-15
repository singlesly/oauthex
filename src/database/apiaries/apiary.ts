import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Coordinates } from './coordinates';
import { User } from '../users/user';
import { ApiProperty } from '@nestjs/swagger';

@Entity('apiaries')
export class Apiary {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public readonly id: string = randomUUID();

  @Column('varchar')
  @ApiProperty()
  public name: string;

  @Column('int')
  @ApiProperty()
  public readonly number: number;

  @Column(() => Coordinates)
  @ApiProperty({
    type: Coordinates,
  })
  public coordinates: Coordinates;

  @ManyToOne(() => User)
  @ApiProperty({
    type: User,
  })
  public readonly owner: User;

  @ManyToMany(() => User)
  @ApiProperty({
    type: User,
    isArray: true,
    required: false,
  })
  @JoinTable({ name: 'apiaries_participants' })
  public participants!: User[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  @ApiProperty()
  public readonly createdAt: Date = new Date();

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  @ApiProperty()
  public readonly updatedAt: Date = new Date();

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  @ApiProperty()
  public readonly deletedAt: Date | null = null;

  constructor(
    name: string,
    number: number,
    owner: User,
    coordinates: Coordinates,
  ) {
    this.name = name;
    this.number = number;
    this.owner = owner;
    this.coordinates = coordinates;
  }

  addParticipant(participant: User) {
    if (!Array.isArray(this.participants)) {
      this.participants = [participant];
    }

    const exists = this.participants.find((x) => x.id === participant.id);

    if (exists) {
      return;
    }

    this.participants = [...this.participants, participant];
  }

  removeParticipant(user: User) {
    if (!Array.isArray(this.participants)) {
      return;
    }

    this.participants = this.participants.filter((x) => x.id !== user.id);
  }
}
