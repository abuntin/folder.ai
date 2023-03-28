import { Deal } from "lib/models";

export const randomSubstring = (str: string, len: number) => {

    const index = Math.floor(Math.random() * (str.length - len - 1));

    return str.substring(index, index + len);
    
}


type ValueType = string | boolean | number | Record<string, string | boolean | number>;

export const isCompleted = (obj: ValueType | Record<string, ValueType>) => {

    try {
        let vals = Object.values(obj)
        return vals.every(v => isCompleted(v))
    } catch {

        return obj !== ''
    }
}


export const dealProgress = (deal: Deal) => {

    let total = Object.keys(deal).length;

    let count = 0;

    for (let val of Object.values(deal)) if (isCompleted(val)) count++


    return (count / total) * 100
}

export const updateObject = (oldObject: object, updatedProperties: object) => {
    return {
      ...oldObject,
      ...updatedProperties
    };
};


export const capitalise = (str: string) => {
    if (str.length < 2) return str

    else return str.charAt(0).toLocaleUpperCase() + str.slice(1)
}

export const repaymentRange = (amount, rate, lookahead?) => {

    return [amount * (1 + (rate * 0.01)), amount * Math.pow(1 + (rate * 0.01), lookahead ?? 10)]
}