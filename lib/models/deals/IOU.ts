import { AssetTerms, LoanPartyType, PaymentTerms } from "lib/types";
import { Deal } from "./Deal";

export class IOU extends Deal {

    paymentTerms: PaymentTerms = null;

    assetTerms: AssetTerms = null;

    loanPartyType: LoanPartyType = null;


    constructor(data: any) {
        
        super()

        const keys = Object.keys(this);

        
        for (const key of keys) {

            let val: any = null;

            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (data[key] == null) throw new Error(`Null/undefined in deal constructor ${key}`) 
                else val = data[key]
            }

            // allows DealDrafts

            // else if (this[key] == undefined) continue
            
            // else throw new Error(`Missing Deal prop in constructor ${key}`)
            
            this[key] = val
            
        }
    }
}