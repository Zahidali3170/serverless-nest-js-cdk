import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('Customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true})
  updatedAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  image: string | null; 

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date|null;
}
