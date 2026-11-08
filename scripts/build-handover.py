"""Build docs/handover/Zohrae-Handover.docx and .pdf from HANDOVER.md.

Needs pandoc, python-docx and Chromium (Playwright, from node_modules).
    python3 scripts/build-handover.py
"""

import os
import re
import subprocess
import sys
import tempfile

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "HANDOVER.md")
OUT = os.path.join(ROOT, "docs", "handover")
DOCX = os.path.join(OUT, "Zohrae-Handover.docx")
PDF = os.path.join(OUT, "Zohrae-Handover.pdf")
ESPRESSO, GOLD = RGBColor(0x2A, 0x1D, 0x15), RGBColor(0x8F, 0x5C, 0x22)
CHROMIUM = os.environ.get("CHROMIUM", "/opt/pw-browsers/chromium")


def set_font(doc, style, name, size=None, color=None, bold=None):
    # Look styles up by iterating: pandoc's "Heading 2" defeats python-docx's name lookup.
    st = next((x for x in doc.styles if x.name == style), None)
    if st is None:
        return
    st.font.name = name
    rpr = st.element.get_or_add_rPr()
    fonts = rpr.find(qn("w:rFonts"))
    if fonts is None:
        fonts = OxmlElement("w:rFonts")
        rpr.append(fonts)
    for attr in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        fonts.set(qn(attr), name)
    for attr in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):
        fonts.attrib.pop(qn(attr), None)
    if size:
        st.font.size = Pt(size)
    if color is not None:
        st.font.color.rgb = color
        el = rpr.find(qn("w:color"))
        for attr in ("w:themeColor", "w:themeShade", "w:themeTint"):
            el.attrib.pop(qn(attr), None)
    if bold is not None:
        st.font.bold = bold


def build_docx():
    raw = os.path.join(tempfile.mkdtemp(), "raw.docx")
    subprocess.run(
        ["pandoc", SRC, "-f", "gfm", "-t", "docx", "-o", raw],
        check=True,
    )
    doc = Document(raw)
    for style in ("Normal", "Body Text", "First Paragraph", "Compact"):
        set_font(doc, style, "Arial", 10, ESPRESSO)
    set_font(doc, "Title", "Georgia", 28, ESPRESSO)
    set_font(doc, "Subtitle", "Arial", 12, GOLD)
    for level, (size, color) in enumerate([(18, ESPRESSO), (14, GOLD), (12, ESPRESSO), (11, ESPRESSO)], 1):
        set_font(doc, f"Heading {level}", "Georgia", size, color, True)
    for style in ("Source Code", "Verbatim Char"):
        set_font(doc, style, "Consolas", 9)
    for section in doc.sections:
        section.left_margin = section.right_margin = section.top_margin = section.bottom_margin = Cm(2)
    for table in doc.tables:
        borders = OxmlElement("w:tblBorders")
        for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
            el = OxmlElement(f"w:{edge}")
            el.set(qn("w:val"), "single")
            el.set(qn("w:sz"), "4")
            el.set(qn("w:color"), "D9CFC2")
            borders.append(el)
        table._tbl.tblPr.append(borders)
        for r, row in enumerate(table.rows):
            for cell in row.cells:
                if r == 0:
                    shade = OxmlElement("w:shd")
                    shade.set(qn("w:val"), "clear")
                    shade.set(qn("w:fill"), "F3ECE0")
                    cell._tc.get_or_add_tcPr().append(shade)
                for p in cell.paragraphs:
                    for run in p.runs:
                        run.font.size = Pt(8.5)
                        run.font.bold = True if r == 0 else run.font.bold
    doc.save(DOCX)


def build_pdf():
    html = os.path.join(OUT, "_handover.html")
    subprocess.run(
        ["pandoc", SRC, "-f", "gfm", "-t", "html5", "-s", "--metadata", "title=Zohraé — Project Handover",
         "-c", "handover.css", "-o", html],
        check=True,
    )
    with open(html, encoding="utf-8") as f:
        page = f.read()
    page = re.sub(r'<header id="title-block-header">.*?</header>', "", page, flags=re.S)
    prepared = re.search(r"\*\*Prepared:\*\* ([^\n]+)", open(SRC, encoding="utf-8").read())
    cover = (
        '<section class="cover"><div class="mark">ZOHRAÉ</div><div class="sub">Atelier · India</div>'
        '<div class="t">Project Handover</div><div class="m">Website, Shopify, payments, domain and everything '
        "needed to continue the build.<br/>ZEREH VENTURES · GSTIN 33GDZPS4274J1ZK<br/>"
        f"Prepared {prepared.group(1) if prepared else ''} · github.com/prabaharshyam/Zohrae</div></section>"
    )
    page = page.replace("<body>", "<body>" + cover, 1)
    with open(html, "w", encoding="utf-8") as f:
        f.write(page)
    script = f"""
import {{ chromium }} from "{ROOT}/node_modules/playwright/index.mjs";
const b = await chromium.launch({{ executablePath: {CHROMIUM!r}, args: ["--allow-file-access-from-files"] }});
const p = await b.newPage();
await p.goto("file://{html}", {{ waitUntil: "networkidle" }});
await p.evaluate(() => document.fonts.ready);
await p.pdf({{ path: "{PDF}", format: "A4", printBackground: true, displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: '<div style="width:100%;font-size:7pt;color:#8a7a6a;padding:0 15mm;display:flex;justify-content:space-between;font-family:Arial"><span>Zohraé · Project Handover</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  margin: {{ top: "16mm", bottom: "18mm", left: "15mm", right: "15mm" }} }});
await b.close();
"""
    runner = os.path.join(tempfile.mkdtemp(), "pdf.mjs")
    with open(runner, "w", encoding="utf-8") as f:
        f.write(script)
    try:
        subprocess.run(["node", runner], check=True)
    finally:
        os.remove(html)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    build_docx()
    build_pdf()
    print("wrote", os.path.relpath(DOCX, ROOT), "and", os.path.relpath(PDF, ROOT))
    sys.exit(0)
