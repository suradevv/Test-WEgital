import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, Index
} from 'typeorm';
import { User } from './user.entity';

@Entity('todos')
@Index(['userId', 'createdAt'])
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  detail?: string | null;

  @Column({ default: false })
  done!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
