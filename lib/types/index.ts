import { ContractType } from './deals';

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

type ContractTypeProperty<key extends keyof ContractType> = PropType<Partial<ContractType>, key>

export * from './deals'

export * from './forms'