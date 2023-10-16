import getElementById from './helpers/getElementById.js'

import './components/MatrixElement.js'

const MODO_PRUEBA = true

const matrixIniciales = getElementById('matrix-iniciales')
const matrixMaximos = getElementById('matrix-maximos')
const matrixEnUso = getElementById('matrix-en-uso')
const matrixNecesarios = getElementById('matrix-necesarios')
const matrixDisponibles = getElementById('matrix-disponibles')
const matrixASolicitar = getElementById('matrix-a-solicitar')

const btnCalcular = getElementById('btn-calcular')

const cmbProceso = getElementById('cmb-proceso')

function renderMatrixes(){
    const recursosIniciales = matrixIniciales.values[0]

    const recursosEnUso = []

    matrixEnUso.values.forEach(row => {
        row.forEach((col, colIndex) => {
            recursosEnUso[colIndex] ??= 0
            recursosEnUso[colIndex] += col
        })
    })

    const recursosDisponibles = recursosEnUso.map((enUso, index) => recursosIniciales[index] - enUso)
    matrixDisponibles.values = [recursosDisponibles]
}

/** @returns {number[][]} */
function getNecesariosDespuesDeSolicitar(){
    const indiceDeProceso = parseInt(cmbProceso.value)
    const recursosASolicitar = matrixASolicitar.values[0]

    const recursosNecesarios = matrixNecesarios.values
    const recursosNecesariosDelProceso = recursosNecesarios[indiceDeProceso]

    const recursosNecesariosDelProcesoDespuesDeSolicitar = recursosNecesariosDelProceso.map((necesario, index) => necesario - recursosASolicitar[index])

    recursosNecesarios[indiceDeProceso] = recursosNecesariosDelProcesoDespuesDeSolicitar

    return recursosNecesarios
}

/** @returns {number[]} */
function getDisponiblesDespuesDeSolicitar(){
    const recursosDisponibles = matrixDisponibles.values[0]
    const recursosASolicitar = matrixASolicitar.values[0]

    const recursosDisponiblesDespuesDeSolicitar = recursosDisponibles.map((disponible, index) => disponible - recursosASolicitar[index])

    return recursosDisponiblesDespuesDeSolicitar
}

/** @returns {boolean} */
function puedeCompletarseSinInterbloqueo(){
    const necesarios = getNecesariosDespuesDeSolicitar()
    const disponibles = getDisponiblesDespuesDeSolicitar()

    return necesarios.some(proceso => puedeCompletarse(proceso, disponibles))

}

/**
 * 
 * @param {number[]} recursosNecesarios 
 * @param {number[]} recursosDisponibles 
 */
function puedeCompletarse(recursosNecesarios, recursosDisponibles){
    for(let i = 0; i < recursosNecesarios.length; i++){
        if(recursosNecesarios[i] > recursosDisponibles[i]) return false
    }

    return true
}

matrixIniciales.addEventListener('change', function(){
    renderMatrixes()
})

matrixEnUso.addEventListener('change', function(){
    renderMatrixes()
})

btnCalcular.addEventListener('click', function(){
    const sePuede = puedeCompletarseSinInterbloqueo()
    Swal.fire({
        title: sePuede ? 'Exito' : 'Error',
        icon: sePuede ? 'success' : 'error',
        text: sePuede ? 'Sí se pueden otorgar los recursos al proceso, no causa un interbloqueo' : 'No se pueden otorgar los recursos al proceso, causaría un interbloqueo'
    })
})

document.addEventListener('DOMContentLoaded', function(){
    if(MODO_PRUEBA){
        matrixIniciales.values = [
            [9, 3, 6]
        ]

        matrixMaximos.values = [
            [3, 2, 2],
            [6, 1, 3],
            [3, 1, 4],
            [4, 2, 2]
        ]

        matrixEnUso.values = [
            [1, 0, 0],
            [5, 1, 1],
            [2, 1, 1],
            [0, 0, 2]
        ]

        matrixNecesarios.values = [
            [2, 2, 2],
            [1, 0, 2],
            [1, 0, 3],
            [4, 2, 0]
        ]

        cmbProceso.value = 1

        matrixASolicitar.values = [
            [1, 0, 1]
        ]

        renderMatrixes()
    }
})