import CategoryDto from "../category/CategoryDto";
import QuestionLightDto from "./QuestionLightDto";
import {Difficulty} from "../../enum/Difficulty";

export default class QuestionDto {
    id!: number;
    title!: string;
    question!: string;
    option1!: string;
    option2!: string;
    option3!: string;
    option4!: string;
    answer!: number;
    category?: CategoryDto | null;
    difficulty!: Difficulty;
    relatedQuestions!: QuestionLightDto[];
}
