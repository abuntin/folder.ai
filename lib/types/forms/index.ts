import { ValueOf } from "next/dist/shared/lib/constants";
import { ContractType } from "../deals";

export interface FormOptionType {
    value: keyof ContractType | string,
    label: ValueOf<ContractType> | string,
    description: string
}

export interface FormQuestionType {
    key: string,
    variant: 'text' | 'radio' | 'select', 
    options: FormOptionType[],
    prompt: string,
    info: string,
}

export interface FormType {
    title: string,
    description: string, 
    info: string,
    questions: FormQuestionType[],
    body?: React.ReactElement,
}

export type FormValueType = FormOptionType | string | Record<string, string>