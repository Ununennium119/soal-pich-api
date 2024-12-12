import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {UserRole} from "../enum/UserRole";


@Entity('users')
export default class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false, unique: true})
    username!: string;

    @Column({nullable: false})
    password!: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: UserRole,
        default: UserRole.PLAYER,
    })
    role!: UserRole;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
