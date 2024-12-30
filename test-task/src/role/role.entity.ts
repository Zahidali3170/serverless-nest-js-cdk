import { Permission } from 'src/permission/permission.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  roleId: string;

  @Column()
  name: string;

  @Column('text', { array: true, default: [] })
  resourceTypes: string[];
  
  @Column({ type: 'text', nullable: true })
  permissionDescription?: string;

  @Column({ default: false })
  readPermission: boolean;

  @Column({ default: false })
  createPermission: boolean;

  @Column({ default: false })
  deletePermission: boolean;

  @Column({ default: false })
  updatePermission: boolean;

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];
  admins: any;
}
