const fs = require('fs');
const path = require('path');

const mappings = [
  // Background Colors
  { regex: /bg-\[\#F8FAFC\]|bg-\[\#F7F8FA\]/g, replacement: 'bg-page' },
  { regex: /bg-white(?!\/)|bg-\[\#FFFFFF\]|bg-\[\#FCFCFD\]/g, replacement: 'bg-surface' },
  { regex: /bg-white\/75/g, replacement: 'bg-surface/75' },
  { regex: /bg-white\/95/g, replacement: 'bg-surface/95' },
  { regex: /bg-white\/40/g, replacement: 'bg-surface/40' },
  { regex: /bg-white\/90/g, replacement: 'bg-surface/90' },
  { regex: /bg-slate-50(?!\/)|bg-\[\#F1F5F9\]|bg-\[\#FBFCFD\]|bg-\[\#F4F6F8\]|bg-slate-100(?!\/)/g, replacement: 'bg-surface-alt' },
  { regex: /bg-slate-50\/80/g, replacement: 'bg-surface-alt/80' },
  { regex: /bg-slate-100\/80/g, replacement: 'bg-surface-alt/80' },
  { regex: /hover:bg-slate-50(?!\/)|hover:bg-\[\#F4F6F8\]|hover:bg-slate-100|hover:bg-\[\#F8FAFC\]/g, replacement: 'hover:bg-surface-hover' },
  { regex: /hover:bg-slate-50\/80/g, replacement: 'hover:bg-surface-hover' }, // wait rule says: hover:bg-slate-50/80 -> hover:bg-surface-hover
  { regex: /bg-\[\#EEF4FF\]|bg-\[\#EFF6FF\]|bg-blue-50(?!\/)/g, replacement: 'bg-accent-soft' },
  { regex: /bg-blue-50\/70/g, replacement: 'bg-accent-soft/70' },
  { regex: /bg-\[\#ECFDF3\]|bg-emerald-50(?!\/)/g, replacement: 'bg-positive-soft' },
  { regex: /bg-emerald-50\/70/g, replacement: 'bg-positive-soft/70' },
  { regex: /bg-\[\#FFFAEB\]|bg-amber-50/g, replacement: 'bg-caution-soft' },
  { regex: /bg-\[\#FEF3F2\]|bg-rose-50(?!\/)/g, replacement: 'bg-negative-soft' },
  { regex: /bg-rose-50\/70/g, replacement: 'bg-negative-soft/70' },
  // specific rule for accent with opacity
  { regex: /bg-\[\#2563EB\]\/15/g, replacement: 'bg-accent/15' },
  { regex: /bg-blue-600|bg-\[\#2563EB\]/g, replacement: 'bg-accent' },
  { regex: /bg-slate-950\/40|bg-slate-900\/40/g, replacement: 'bg-overlay' },
  { regex: /bg-slate-950\/50/g, replacement: 'bg-overlay' },
  { regex: /bg-gradient-to-r from-slate-50 via-white to-slate-50/g, replacement: 'bg-surface' },
  { regex: /bg-gradient-to-b from-blue-50\/70 to-slate-50\/70/g, replacement: 'bg-accent-soft/70' },
  
  // Custom case seen in FeaturedIPO
  { regex: /bg-gradient-to-br from-\[\#FFFFFF\] to-\[\#F8FAFC\]/g, replacement: 'bg-surface' },

  // Text Colors
  { regex: /text-\[\#111318\]|text-\[\#111827\]|text-slate-900|text-slate-800/g, replacement: 'text-ink' },
  { regex: /text-\[\#5F6673\]|text-\[\#667085\]|text-slate-600|text-slate-700/g, replacement: 'text-ink-secondary' },
  { regex: /text-\[\#7B8491\]|text-\[\#98A2B3\]|text-slate-500|text-slate-400/g, replacement: 'text-ink-tertiary' },
  { regex: /text-\[\#B8BFCA\]|text-slate-300/g, replacement: 'text-ink-muted' },
  { regex: /text-blue-600|text-\[\#2563EB\]|text-blue-500/g, replacement: 'text-accent' },
  { regex: /text-emerald-600|text-emerald-700|text-\[\#027A48\]|text-\[\#12B76A\]|text-\[\#059669\]/g, replacement: 'text-positive' },
  { regex: /text-amber-600|text-amber-700|text-\[\#D97706\]|text-\[\#B54708\]/g, replacement: 'text-caution' },
  { regex: /text-rose-600|text-rose-700|text-rose-800|text-\[\#F04438\]|text-red-600|text-red-700|text-red-500/g, replacement: 'text-negative' },

  // Border Colors
  { regex: /border-\[\#E2E8F0\]|border-\[\#E4E7EC\]|border-slate-200(?!\/)|border-slate-100/g, replacement: 'border-line' },
  { regex: /border-slate-200\/80/g, replacement: 'border-line/80' },
  { regex: /border-slate-200\/90/g, replacement: 'border-line/90' },
  { regex: /border-slate-300|border-\[\#D0D5DD\]/g, replacement: 'border-line-strong' },
  { regex: /border-blue-200(?!\/)|border-blue-100|border-\[\#BFDBFE\]/g, replacement: 'border-accent/30' },
  { regex: /border-blue-200\/80/g, replacement: 'border-accent/30' }, // Wait, the rule says border-accent/30 for this too? Let's check: "border-blue-200/80 -> border-accent/30" or keep modifiers? Rule: "border-blue-200, border-blue-100, border-blue-200/80 -> border-accent/30". Okay.
  { regex: /border-\[\#A6F4C5\]|border-emerald-200(?!\/)/g, replacement: 'border-positive/30' },
  { regex: /border-emerald-200\/80/g, replacement: 'border-positive/30' },
  { regex: /border-amber-200|border-\[\#FEF0C7\]|border-\[\#FDE68A\]/g, replacement: 'border-caution/30' },
  { regex: /border-rose-200|border-rose-100/g, replacement: 'border-negative/30' },

  // Ring Colors
  { regex: /ring-blue-100|ring-blue-500\/10/g, replacement: 'ring-accent/10' },
  { regex: /ring-blue-500\/20/g, replacement: 'ring-accent/20' },
  { regex: /ring-blue-500\/30/g, replacement: 'ring-accent/30' },

  // Focus Ring
  { regex: /focus:ring-blue-500\/10|focus:ring-blue-500\/20/g, replacement: 'focus:ring-accent/15' },
  { regex: /focus:border-blue-600|focus:border-blue-500/g, replacement: 'focus:border-accent' },

  // Shadow Colors
  { regex: /shadow-slate-100\/30/g, replacement: 'shadow-line/20' },
  
  // Specific exclusions
  // 1. DO NOT change text-white
  // 2. DO NOT change bg-gradient-to-tr from-blue-600 to-indigo-500 (done by specific regexes)
  
  { regex: /placeholder:text-slate-400/g, replacement: 'placeholder:text-ink-muted' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const mapping of mappings) {
    content = content.replace(mapping.regex, (match) => {
      // Add custom rules if needed inside the replacer, e.g. ignoring dark colors in gradients.
      // E.g., if match is part of "from-blue-600", and rule changes it to "from-accent", is that allowed?
      // Wait, my regex `bg-blue-600` doesn't match `from-blue-600`, but `text-blue-600` does.
      return mapping.replacement;
    });
  }

  // Also replace #64748B which seems to be used as text-ink-secondary or text-ink-tertiary
  // Slate 500 is #64748B
  content = content.replace(/text-\[\#64748B\]/g, 'text-ink-secondary');
  // Slate 900 is #0F172A
  content = content.replace(/text-\[\#0F172A\]/g, 'text-ink');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated: " + filePath);
  }
}

const dir1 = "E:\\DESKTOP\\WORKSPACE\\nexo\\components\\dashboard";
const dir2 = "E:\\DESKTOP\\WORKSPACE\\nexo\\components\\ipo-detail";

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      processFile(path.join(dir, file));
    }
  }
}

processDir(dir1);
processDir(dir2);
