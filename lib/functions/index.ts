
export const randomSubstring = (str: string, len: number) => {

    const index = Math.floor(Math.random() * (str.length - len - 1));

    return str.substring(index, index + len);
    
}
