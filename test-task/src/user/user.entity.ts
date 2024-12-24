// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SuperRole } from './enum/role.enum';
import { IsString } from 'class-validator';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: SuperRole,
    default: SuperRole.SUPER_ADMIN,
  })
  role: SuperRole;
  superAdmin: any;
  admins: any;

  
}

