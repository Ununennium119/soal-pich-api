import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {UserRole} from "../enum/UserRole";


@Entity('questions')
export default class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    title!: string;

    @Column()
    question!: string;

    @Column()
    option1!: string;

    @Column()
    option2!: string;

    @Column()
    option3!: string;

    @Column()
    option4!: string;

    @Column()
    answer!: number;

    @Column({
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
