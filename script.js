const $ = id => document.getElementById(id);
const cellSpans = {}; // Stores merge settings by virtual ID

function buildGrid() {
    const cols = Math.max(1, parseInt($('cols').value) || 1);
    const rows = Math.max(1, parseInt($('rows').value) || 1);
    const gap = parseInt($('gap').value) || 0;
    const colSize = $('colSize').value || '1fr';
    const rowSize = $('rowSize').value || 'auto';

    const preview = $('preview');
    preview.style.gridTemplateColumns = `repeat(${cols}, ${colSize})`;
    preview.style.gridTemplateRows = `repeat(${rows}, ${rowSize})`;
    preview.style.gap = gap + 'px';
    preview.style.gridAutoFlow = 'dense';

    preview.innerHTML = '';

    // Logic: Tracking which grid slots are taken
    const occupied = new Set();
    let cellIdCounter = 1;
    let visualLabel = 1;

    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            const slot = `${r}-${c}`;
            if (occupied.has(slot)) continue; // Skip if this area is covered by a previous merge

            const d = document.createElement('div');
            d.className = 'cell';
            d.textContent = visualLabel++;

            const s = cellSpans[cellIdCounter];
            if (s) {
                const sC = Math.min(s.c, cols - c + 1);
                const sR = Math.min(s.r, rows - r + 1);

                if (sC > 1) d.style.gridColumn = `span ${sC}`;
                if (sR > 1) d.style.gridRow = `span ${sR}`;
                d.classList.add('selected');

                // Mark overlapping slots as occupied so they aren't rendered
                for (let i = 0; i < sR; i++) {
                    for (let j = 0; j < sC; j++) {
                        if (i === 0 && j === 0) continue;
                        occupied.add(`${r + i}-${c + j}`);
                    }
                }
            }

            const currentId = cellIdCounter;
            d.onclick = () => openModal(currentId);
            preview.appendChild(d);
            cellIdCounter++;
        }
    }
    updateOutputs(cols, rows, gap, colSize, rowSize, visualLabel - 1);
}

function updateOutputs(cols, rows, gap, colSize, rowSize, totalVisible) {
    let spanCss = "";
    const previewCells = document.querySelectorAll('#preview .cell');

    previewCells.forEach((cell, idx) => {
        if (cell.classList.contains('selected')) {
            let rules = "";
            if (cell.style.gridColumn) rules += `grid-column: ${cell.style.gridColumn}; `;
            if (cell.style.gridRow) rules += `grid-row: ${cell.style.gridRow}; `;
            spanCss += `.my-grid > *:nth-child(${idx + 1}) { ${rules.trim()} }\n`;
        }
    });

    const fullCss = `.my-grid {\n  display: grid;\n  grid-template-columns: repeat(${cols}, ${colSize});\n  grid-template-rows: repeat(${rows}, ${rowSize});\n  gap: ${gap}px;\n  grid-auto-flow: dense;\n}\n\n${spanCss}`;
    $('output').value = fullCss;

    let items = '';
    for (let i = 1; i <= totalVisible; i++) items += `  <div>${i}</div>\n`;

    $('htmlFrame').srcdoc = `<!DOCTYPE html><html><head><style>
        body{margin:0;padding:20px;font-family:sans-serif;background:#fff;}
        .my-grid > *{background:#f1f3f5;border:1px solid #dee2e6;display:flex;align-items:center;justify-content:center;min-height:50px;font-weight:bold;border-radius:4px;}
        ${fullCss}
    </style></head><body><div class="my-grid">${items}</div></body></html>`;
}

let activeId = null;
function openModal(id) {
    activeId = id;
    $('modalCol').value = cellSpans[id]?.c || 1;
    $('modalRow').value = cellSpans[id]?.r || 1;
    $('modal').setAttribute('aria-hidden', 'false');
}

document.addEventListener('DOMContentLoaded', () => {
    ['cols', 'rows', 'gap', 'colSize', 'rowSize'].forEach(id => $(id).oninput = buildGrid);
    $('resetBtn').onclick = () => { Object.keys(cellSpans).forEach(k => delete cellSpans[k]); buildGrid(); };
    $('modalCancel').onclick = () => $('modal').setAttribute('aria-hidden', 'true');
    $('modalForm').onsubmit = (e) => {
        e.preventDefault();
        const c = parseInt($('modalCol').value) || 1, r = parseInt($('modalRow').value) || 1;
        if (c > 1 || r > 1) cellSpans[activeId] = { c, r }; else delete cellSpans[activeId];
        $('modal').setAttribute('aria-hidden', 'true');
        buildGrid();
    };

    buildGrid();
});