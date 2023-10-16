import { LitElement, html, css } from 'lit'
import range from '../helpers/range.js'

export default class MatrixElement extends LitElement {
    static properties = {
        rows: { type: Number },
        cols: { type: Number },
        colTitles: { type: String },
        rowTitles: { type: String },
        disabled: { type: Boolean },
        title: { type: String }
    }

    static get styles(){
        return css`
            * {
                margin: 0;
                padding: 0;
            }

            :host {
                display: inline-block;
            }

            .matrix {
                display: grid;
                gap: 0.5rem;
            }

            .row {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
            }

            .col {
                text-align: center;
            }

            .input {
                max-width: 5ch;
                padding: 0.1rem;
                
            }

            .h3 {
                display: inline-block;
                margin-bottom: 0.75rem;
            }
        `
    }

    #handleOnInput(){
        const event = new CustomEvent('change', {
            detail: {
                values: this.values
            }
        })

        this.dispatchEvent(event)
    }

    /**
     * @param {number} rowIndex 
     */
    #getRow(rowIndex){
        return html`
            ${
                this.rowTitles && html`
                    <div class="col">
                        ${this.rowTitles.split(',')[rowIndex]}
                    </div>
                `
            }
            ${

                range(this.cols).map(colIndex => html`
                    <div class="col">
                        <input 
                            class="input" 
                            type="number"
                            min="0"
                            value="0"
                            ?disabled="${this.disabled}"
                            @input="${this.#handleOnInput}"

                            data-pos="${rowIndex},${colIndex}"
                        />
                    </div>
                `)
            }
        `
    }

    get #topRow(){
        return html`
            ${
                this.colTitles && html`
                    ${this.rowTitles && html`<div class="col"></div>`}
                    ${
                        this.colTitles.split(',').map(colTitle => html`
                            <div class="col">
                                ${colTitle}
                            </div>
                        `)
                    }
                `
            }
        `
    }

    get #inputs(){
        return html`
            ${this.#topRow}
            ${range(this.rows).map(rowIndex => this.#getRow(rowIndex))}
        `
    }

    get #templateColumns(){
        return this.rowTitles ? this.cols + 1 : this.cols
    }

    render(){
        return html`
            ${
                this.title && html`<h3 class="h3">${this.title}</h3>`
            }
            <div class="matrix" style="grid-template-columns: ${"1fr ".repeat(this.#templateColumns)}">
                ${this.#inputs}
            </div>
        `
    }

    /** @type {[number, number]} */
    get size(){ return [this.rows, this.cols] }

    set size(newSize) {
        const [rows, cols] = newSize
        this.rows = rows
        this.cols = cols
    }

    /** @type {number[][]} */
    get values(){
        const innerValues = []

        this.renderRoot.querySelectorAll('input').forEach(input => {
            const [rowIndexStr, colIndexStr] = input.dataset.pos.split(',')
            const [rowIndex, colIndex] = [parseInt(rowIndexStr), parseInt(colIndexStr)]
            
            innerValues[rowIndex] ??= []
            innerValues[rowIndex][colIndex] = parseInt(input.value)
        })

        return innerValues
    }

    set values(newValues){
        this.renderRoot.querySelectorAll('input').forEach(input => {
            const [rowIndexStr, colIndexStr] = input.dataset.pos.split(',')
            const [rowIndex, colIndex] = [parseInt(rowIndexStr), parseInt(colIndexStr)]

            input.value = newValues[rowIndex][colIndex]
        })
    }
}

customElements.define('jeb-matrix', MatrixElement)
