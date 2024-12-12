import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import CategoryDto from "../dto/category/CategoryDto";

@Entity('categories')
export default class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false, unique: true})
    title!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    toDto() {
        const categoryDto = new CategoryDto();
        categoryDto.id = this.id;
        categoryDto.title = this.title;
        return categoryDto
    }
}
