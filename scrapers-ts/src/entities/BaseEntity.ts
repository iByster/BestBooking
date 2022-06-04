import {
  BaseEntity as BaseBaseEntityXD,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class BaseEntity extends BaseBaseEntityXD {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}