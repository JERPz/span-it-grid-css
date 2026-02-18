# Span-it! 🎯

**Interactive CSS Grid Generator & Merger**

A minimal, beautiful web tool to design and generate CSS Grid layouts with custom cell spans. Click cells to merge them and instantly see the generated CSS and HTML preview.

## Features

✨ **Interactive Grid Design**
- Adjust columns, rows, and gaps in real-time
- Click any cell to set custom `colSpan` and `rowSpan`
- Visual feedback with selected cell highlighting
- Smart grid-auto-flow for automatic cell placement

🎨 **Minimal Dark Theme**
- Clean, distraction-free interface
- Subtle parallax effect on preview hover
- Responsive design for all screen sizes

💻 **Code Generation**
- Live CSS output with grid template and span rules
- HTML preview in embedded iframe
- One-click copy to clipboard for CSS and HTML
- Ready-to-use standalone HTML files

🔧 **Customization**
- Set custom column/row sizes (`1fr`, `200px`, `auto`, etc.)
- Configure gap spacing
- Reset all spans with one button
- Modal editor for precise span values

## Getting Started

### Open Locally
Simply open `index.html` in your browser:
```bash
open index.html
# or
firefox index.html
```

### File Structure
```
grid-tools/
├── index.html      # Main UI
├── style.css       # Minimal dark theme
├── script.js       # Grid logic & generators
└── README.md       # This file
```

## How to Use

1. **Set Grid Size**
   - Input number of columns, rows, and gap (in pixels)
   - Choose column/row sizes (e.g., `1fr`, `200px`)
   - Click "Update Grid"

2. **Merge Cells**
   - Click any cell in the preview
   - Enter desired `colSpan` and `rowSpan` in the modal
   - Click "Apply Merge"

3. **View Results**
   - CSS output appears instantly
   - HTML preview updates in the iframe
   - Copy CSS or HTML to clipboard

4. **Reset**
   - Click "Reset All Spans" to clear all merges

## Example

Create a 4×3 grid with the first cell spanning 2 columns:
1. Set Columns: 4, Rows: 3, Gap: 12px
2. Click cell 1 → Set colSpan: 2 → Apply
3. Copy the generated CSS and use in your project

## Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Modern CSS**: Grid auto-flow with dense packing
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive**: Works on desktop and tablet

## Generated CSS Example

```css
.my-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 12px;
  grid-auto-flow: dense;
}

.my-grid > *:nth-child(1) { grid-column: span 2; }
```

## UI Components

- **Controls**: Grid configuration (columns, rows, gap, sizing)
- **Preview**: Interactive grid with clickable cells and parallax
- **CSS Output**: Read-only textarea with copyable CSS
- **HTML Result**: Live iframe preview of generated markup
- **Modal**: Edit spans with numeric inputs

## Keyboard & Interaction

- **Click Cell**: Open modal to set spans
- **Button Actions**: Update, Copy CSS, Copy HTML, Reset All Spans
- **Parallax**: Move mouse over preview to see subtle parallax layers
- **Copy Feedback**: Button text changes to "Copied!" on success

## Author

Created as an interactive web tool for CSS Grid learning and development.

## License

MIT – Free to use and modify

---

**Try it now!** Open `index.html` in your browser and start designing grids.
