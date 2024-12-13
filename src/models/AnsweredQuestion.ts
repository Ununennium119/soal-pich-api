import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import User from './User';
import Question from './Question';
import AnsweredQuestionDto from "../dto/question/AnsweredQuestionDto";

@Entity('answered_questions')
export default class AnsweredQuestion {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Question, { nullable: false })
    @JoinColumn({ name: 'question_id' })
    question!: Question;

    @Column({ nullable: false })
    selectedAnswer!: number;

    @Column({ nullable: false, default: 0 })
    score!: number;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    toDto() {
        const answeredQuestionDto = new AnsweredQuestionDto();
        answeredQuestionDto.id = this.id;
        answeredQuestionDto.userId = this.user.id;
        answeredQuestionDto.questionId = this.question.id;
        answeredQuestionDto.selectedAnswer = this.selectedAnswer;
        answeredQuestionDto.score = this.score;
        return answeredQuestionDto;
    }
}
