import { useMemo } from 'react';

export default function Spreadsheet () {
    const ROWS = 15;
    const COLS = 15;
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function Spreadsheet (rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.formulae = new Map();
        this.isDirty = false;
        this.inputValidator = /^(-?\d+|=([A-O]1[0-5]|[A-O][1-9]))(\+(-?\d+|[A-O]1[0-5]|[A-O][1-9]))*$/;

        this.focusCell = cellNumber => { try { this.getCell(cellNumber).focus() } catch {} };
        this.getCell = cellNumber => document.getElementById(cellNumber);
        this.getCellFormula = cellNumber => this.formulae[cellNumber];
        this.getCellNumber = (row, col) => ALPHABET[col] + (row + 1);
        this.isFormulaCell = cell => cell.value[0] === '=';

        this.onchange = () => this.isDirty = true;

        this.onfocus = e => {
            const cell = e.target;
            const cellNumber = cell.id;
            cell.classList.remove('invalid');
            if (this.formulae.has(cellNumber)) cell.value = this.formulae.get(cellNumber);
        }

        this.onblur = e => {
            const cell = e.target;
            if (!this.isDirty) {
                if (this.isFormulaCell(cell)) this.runFormula(cell.value, cell.id);
                return;
            }
            cell.value = cell.value.trim();
            if (this.isFormulaCell(cell)) cell.value = cell.value.toUpperCase();
            if (!this.inputValidator.test(cell.value)) cell.classList.add('invalid');
            this.updateSpreadsheet(cell);
        }

        this.onkeydown = e => {
            const cell = e.target;
            const cellNumber = cell.id;
            const column = cellNumber.slice(0, 1);
            const row = Number(cellNumber.slice(1));
            switch (e.key) {
                case 'Enter':
                case 'ArrowDown':
                    return this.focusCell(column + (row + 1));
                case 'ArrowUp':
                    return this.focusCell(column + (row - 1));
                case 'ArrowLeft':
                    return e.metaKey ? this.focusCell(ALPHABET[ALPHABET.indexOf(column) - 1] + row) : null;
                case 'ArrowRight':
                    return e.metaKey ? this.focusCell(ALPHABET[ALPHABET.indexOf(column) + 1] + row) : null;
                default: return;
            }
        }

        this.runFormula = (formula, cellNumber) => {
            const cells = formula.slice(1).split('+');
            const values = cells.map(cellNum => this.getCell(cellNum).value);
            const sum = values.reduce((sum, value) => {
                const val = Number(value);
                return Number.isInteger(val) ? sum + val : sum;
            }, 0);
            this.getCell(cellNumber).value = sum;
        }

        this.updateSpreadsheet = cell => {
            this.isFormulaCell(cell) && !cell.classList.contains('invalid')
                ? this.formulae.set(cell.id, cell.value)
                : this.formulae.delete(cell.id);
            this.formulae.forEach(this.runFormula);
            this.formulae.forEach(this.runFormula);
            this.isDirty = false;
        }
    }

    const spreadsheet = useMemo(() => new Spreadsheet(ROWS, COLS), [ROWS, COLS]);

    const thead = useMemo(() => (
        <thead>
            <tr>
                <th/>
                {[...Array(spreadsheet.cols)].map((_, i) => <th key={'Col' + ALPHABET[i]}>{ALPHABET[i]}</th>)}
            </tr>
        </thead>
    ), [spreadsheet.cols]);
    
    const tbody = useMemo(() => (
        <tbody>
            {[...Array(spreadsheet.rows)].map((_, i) => (
                <tr key={'Row' + (i + 1)}>
                    <th>{i + 1}</th>
                    {[...Array(spreadsheet.cols)].map((_, j) => (
                        <td key={'Cell' + spreadsheet.getCellNumber(i,j)}>
                            <input
                                type="text"
                                id={spreadsheet.getCellNumber(i,j)}
                                onChange={spreadsheet.onchange}
                                onBlur={spreadsheet.onblur}
                                onKeyDown={spreadsheet.onkeydown}
                                onFocus={spreadsheet.onfocus}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    ), [spreadsheet]);

    return <table className="SS-table">{thead}{tbody}</table>;
}