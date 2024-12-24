import { Role } from 'src/role/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  permissionId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  actionType: string;

  @Column()
  resourceType: string;

  @ManyToOne(() => Role, (role) => role.permissions)
  role: Role;
}
