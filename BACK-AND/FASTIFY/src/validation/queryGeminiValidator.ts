export const queryGeminiValidator = {
    isSafeQuery:(query: string): boolean =>{
        //Tira todos os espaços em branco e joga para caixa baixa
        const trimmed = query.trim().toLowerCase();
        //Verifica se "trimmed" começa com um "select"
        if(!trimmed.startsWith("select")) return false;
        //Lista de palavras proibidas
        const forbidden = ["insert", "update", "delete", "drop", "alter", "truncate", "--"];
        //Verifica se existe ou não uma palavra proibida incluida em "trimmed"
        return !forbidden.some(keyword =>trimmed.includes(keyword));
    }
}