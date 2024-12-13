import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import Category from "./Category";
import QuestionDto from "../dto/question/QuestionDto";
import QuestionLightDto from "../dto/question/QuestionLightDto";
import {Difficulty} from "../enum/Difficulty";

@Entity('questions')
export default class Question {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false, unique: true})
    title!: string;

    @Column({nullable: false})
    question!: string;

    @Column({nullable: false})
    option1!: string;

    @Column({nullable: false})
    option2!: string;

    @Column({nullable: false})
    option3!: string;

    @Column({nullable: false})
    option4!: string;

    @Column({nullable: false})
    answer!: number;

    @ManyToOne(() => Category, {nullable: true, eager: true})
    @JoinColumn()
    category?: Category | null;

    @Column({
        nullable: false,
        type: 'enum',
        enum: Difficulty,
        default: Difficulty.NORMAL,
    })
    difficulty!: Difficulty;

    @ManyToMany(() => Question)
    @JoinTable({name: "related_questions"})
    relatedQuestions!: Question[];

    @CreateDateColumn({nullable: false})
    createdAt!: Date;

    @UpdateDateColumn({nullable: false})
    updatedAt!: Date;

    toDto() {
        const questionDto = new QuestionDto();
        questionDto.id = this.id;
        questionDto.title = this.title;
        questionDto.question = this.question;
        questionDto.option1 = this.option1;
        questionDto.option2 = this.option2;
        questionDto.option3 = this.option3;
        questionDto.option4 = this.option4;
        questionDto.answer = this.answer;
        questionDto.category = this.category?.toDto();
        questionDto.difficulty = this.difficulty;
        questionDto.relatedQuestions = this.relatedQuestions.map((relatedQuestion) => {
            return relatedQuestion.toLightDto();
        })
        return questionDto
    }

    toLightDto() {
        const questionLightDto = new QuestionLightDto()
        questionLightDto.id = this.id;
        questionLightDto.title = this.title;
        return questionLightDto;
    }
}
