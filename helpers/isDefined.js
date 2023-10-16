/**
 * Regresa si t, que puede ser T, undefined o null, tiene un valor no nulo
 * y definido
 * @template T
 * @param {T | undefined | null} t 
 * @returns {t is T}
 */
export default function isDefined(t){
    if (typeof(t) === 'undefined') return false
    if (t === null) return false
    return true
}