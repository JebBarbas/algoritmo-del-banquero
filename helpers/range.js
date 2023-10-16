//@ts-check

import isDefined from "./isDefined.js";

/**
 * Copia de la función 'range' de Python, regresa un array
 * @param {number} min 
 * @param {number} [max] 
 * @param {number} [step] 
 */
export default function range(min, max, step){
    const innerMin = isDefined(max) ? min : 0
    const innerMax = isDefined(max) ? max : min
    const innerStep = isDefined(step) ? step : 1

    const list = []

    for(let i = innerMin; i < innerMax; i += innerStep){
        list.push(i)
    }

    return list
}