'use client'
import DOMPurify from 'dompurify'

interface SanitizeHTMLProps {
  html: string
  className?: string
}

// Wrap each table in a scrollable container instead of forcing the <table>
// itself to display:block — that breaks the native table layout algorithm,
// which is what was making the editor's per-column pixel widths (and the
// "resize a column" feature) get ignored and replaced with a stretched,
// phantom-extra-column mess on the public page.
function wrapTablesForScroll(html: string): string {
  return html.replace(/<table(?![^>]*data-wrapped)[\s\S]*?<\/table>/gi, (table) => {
    // The editor also writes an inline style="width:Npx" on <table> itself
    // (its authored total width). Inline styles beat any stylesheet rule,
    // including our width:100%, so it has to go — the <col> widths inside
    // still drive each column's relative proportion under table-layout:fixed.
    const withoutInlineWidth = table.replace(/^(<table\b[^>]*?)\s+style="[^"]*"([^>]*>)/i, '$1$2');
    return `<div class="table-scroll">${withoutInlineWidth}</div>`;
  })
}

// Every link in rich-text content should open in a new tab, without losing
// any rel values (e.g. nofollow) a link already has.
function addTargetBlankToLinks(html: string): string {
  return html.replace(/<a\s+([^>]*)>/gi, (match, attrs: string) => {
    if (/\btarget\s*=/i.test(attrs)) return match
    const relMatch = attrs.match(/\srel\s*=\s*"([^"]*)"/i)
    const existingRel = relMatch ? relMatch[1].split(/\s+/).filter(Boolean) : []
    const mergedRel = Array.from(new Set([...existingRel, 'noopener', 'noreferrer'])).join(' ')
    const attrsWithoutRel = attrs.replace(/\srel\s*=\s*"[^"]*"/i, '')
    return `<a ${attrsWithoutRel} target="_blank" rel="${mergedRel}">`
  })
}

// Strips whitespace sitting right inside the opening/closing <a> tags —
// pasted-in content (e.g. from other editors) sometimes carries a leading
// space before the linked text, which reads as an odd gap before the link.
function trimAnchorWhitespace(html: string): string {
  return html.replace(/(<a\b[^>]*>)\s+/gi, '$1').replace(/\s+(<\/a>)/gi, '$1')
}

export function SanitizeHTML({ html, className }: SanitizeHTMLProps) {
  const processed = trimAnchorWhitespace(addTargetBlankToLinks(wrapTablesForScroll(html)))
  const cleanHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(processed) : processed
  return <div className={className} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
}
