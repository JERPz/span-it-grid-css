const $ = id => document.getElementById(id);
const cellSpans = {};

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

    const occupied = new Set();
    let cellIdCounter = 1;
    let visualCellCount = 0;

    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            const posKey = `${r}-${c}`;
            if (occupied.has(posKey)) continue;

            visualCellCount++;
            const d = document.createElement('div');
            d.className = 'cell';
            d.textContent = visualCellCount;

            // Check if this ID has merge settings
            const s = cellSpans[cellIdCounter];
            if (s) {
                const spanC = Math.min(s.c, cols - c + 1);
                const spanR = Math.min(s.r, rows - r + 1);

                if (spanC > 1) d.style.gridColumn = `span ${spanC}`;
                if (spanR > 1) d.style.gridRow = `span ${spanR}`;
                d.classList.add('selected');

                // Mark slots as occupied
                for (let i = 0; i < spanR; i++) {
                    for (let j = 0; j < spanC; j++) {
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
    updateOutputs(cols, rows, gap, colSize, rowSize, visualCellCount);
}

function updateOutputs(cols, rows, gap, colSize, rowSize, total) {
    let spanCss = "";
    // Re-calculating CSS for nth-child based on the actual visible cells
    const previewCells = $('preview').querySelectorAll('.cell');
    previewCells.forEach((cell, idx) => {
        if (cell.classList.contains('selected')) {
            const gc = cell.style.gridColumn;
            const gr = cell.style.gridRow;
            spanCss += `.my-grid > *:nth-child(${idx + 1}) { ${gc ? 'grid-column: ' + gc + '; ' : ''}${gr ? 'grid-row: ' + gr + '; ' : ''}}\n`;
        }
    });

    const fullCss = `.my-grid {\n  display: grid;\n  grid-template-columns: repeat(${cols}, ${colSize});\n  grid-template-rows: repeat(${rows}, ${rowSize});\n  gap: ${gap}px;\n  grid-auto-flow: dense;\n}\n\n${spanCss}`;
    $('output').value = fullCss;

    // Sync HTML Result
    let items = '';
    for (let i = 1; i <= total; i++) items += `  <div>${i}</div>\n`;
    $('htmlFrame').srcdoc = `<html><style>
        body{margin:0;padding:20px;font-family:sans-serif;background:#fff;}
        .my-grid > *{background:#f1f3f5;border:1px solid #dee2e6;display:flex;align-items:center;justify-content:center;min-height:50px;font-weight:bold;border-radius:4px;}
        ${fullCss}</style><div class="my-grid">${items}</div></html>`;
}

let activeIdx = null;
function openModal(i) {
    activeIdx = i;
    $('modalCol').value = cellSpans[i]?.c || 1;
    $('modalRow').value = cellSpans[i]?.r || 1;
    $('modal').setAttribute('aria-hidden', 'false');
}

document.addEventListener('DOMContentLoaded', () => {
    ['cols', 'rows', 'gap', 'colSize', 'rowSize'].forEach(id => $(id).oninput = buildGrid);
    $('generate').onclick = buildGrid;
    $('resetBtn').onclick = () => { Object.keys(cellSpans).forEach(k => delete cellSpans[k]); buildGrid(); };
    $('modalCancel').onclick = () => $('modal').setAttribute('aria-hidden', 'true');
    $('modalForm').onsubmit = (e) => {
        e.preventDefault();
        const c = parseInt($('modalCol').value) || 1, r = parseInt($('modalRow').value) || 1;
        if (c > 1 || r > 1) cellSpans[activeIdx] = { c, r }; else delete cellSpans[activeIdx];
        $('modal').setAttribute('aria-hidden', 'true');
        buildGrid();
    };

    const pb = $('parallaxBox');
    pb.addEventListener('mousemove', (e) => {
        const r = pb.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        document.querySelector('.layer-1').style.transform = `translate(${x * 15}px, ${y * 15}px)`;
        document.querySelector('.layer-2').style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    });

    buildGrid();
});