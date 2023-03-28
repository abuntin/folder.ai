import { DealMetadata, DealType, Party } from "lib/types";

export class Deal {

    id: string = null;

    type: DealType = null;

    primaryParty: Party = null;

    secondaryParty: Party  = null;

    cosigner?: Party[] = undefined;

    metadata: DealMetadata  = null;

    specialClause?: string = null;


    constructor() {
        if (this.constructor == Deal) {
            throw new Error('Deal is an abstract class. Please use one of the DealType constructors')
        }

    }
    
}


