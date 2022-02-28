
const forbiddenWords = ['fuck', 'nigga', 'bitch'];

export const filterComment = (data:string): boolean => {

    let result: boolean[]

    result = forbiddenWords.map((word)=> {

       return data.split(' ').includes(word)
    })

   return result.includes(true);
}