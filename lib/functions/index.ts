
export const randomSubstring = (str: string, len: number) => {

    const index = Math.floor(Math.random() * (str.length - len - 1));

    return str.substring(index, index + len);
    
}


type ValueType = string | boolean | number | Record<string, string | boolean | number>;

export const isCompleted = (obj: ValueType | Record<string, ValueType>) => {
    if (typeof obj === 'string') {
        return obj !== ''
    }

    else return Object.values(obj).every(v => isCompleted(v))
}