"""Builds fuel_tracker.xlsx: a fill-up log for the Honda Jazz with MPG and cost-per-mile maths."""
from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

FONT = "Arial"
BLUE = Font(name=FONT, color="0000FF")
BLACK = Font(name=FONT)
GREEN = Font(name=FONT, color="008000")
BOLD = Font(name=FONT, bold=True)
HEAD = Font(name=FONT, bold=True, color="FFFFFF")
TITLE = Font(name=FONT, bold=True, size=14)
NOTE = Font(name=FONT, italic=True, color="595959", size=9)
INPUT_FILL = PatternFill("solid", fgColor="FFFF00")
HEAD_FILL = PatternFill("solid", fgColor="1F3864")
CALC_FILL = PatternFill("solid", fgColor="F2F2F2")
THIN = Side(style="thin", color="BFBFBF")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

GBP = '£#,##0.00;(£#,##0.00);-'
PPL = '£0.000'
LIT = '0.00'
MPG = '0.0'
MILES = '#,##0'
DATE = 'dd/mm/yyyy'

FIRST, LAST = 7, 106  # log rows

wb = Workbook()

# ---------------- Settings ----------------
st = wb.active
st.title = "Settings"
st["A1"] = "Settings and benchmarks"; st["A1"].font = TITLE
rows = [
    ("Car", "Honda Jazz 1.4 (2003)", None, "Provided by you"),
    ("Fuel tank capacity (litres)", 42, LIT, "Catalog spec, Jazz Mk1 1.4 (2002–2008). See README sources"),
    ("Litres per UK gallon", 4.54609, '0.00000', "UK imperial gallon definition"),
    ("Km per mile", 1.609344, '0.000000', "Statute mile definition"),
    ("Catalog combined MPG (UK)", "=282.481/5.5", MPG, "Catalog figure 5.5 L/100km converted to UK MPG"),
    ("Real-world benchmark MPG (UK)", "=282.481/6.57", MPG, "Owner log, 2003 Jazz 1.4, 6.57 L/100km over ~22,500 km (Spritmonitor)"),
    ("MPG used for range estimate", "=IF(Summary!B9=\"\",B9,Summary!B9)", MPG,
     "Uses your own average once you have one completed leg, otherwise the real-world benchmark"),
]
st["A3"], st["B3"], st["C3"] = "Item", "Value", "Source / note"
for c in "ABC":
    st[f"{c}3"].font = HEAD; st[f"{c}3"].fill = HEAD_FILL
for i, (label, val, fmt, note) in enumerate(rows, start=4):
    st[f"A{i}"] = label; st[f"A{i}"].font = BLACK
    st[f"B{i}"] = val
    is_input = not (isinstance(val, str) and val.startswith("="))
    st[f"B{i}"].font = BLUE if is_input else BLACK
    if fmt:
        st[f"B{i}"].number_format = fmt
    st[f"C{i}"] = note; st[f"C{i}"].font = NOTE
st.column_dimensions["A"].width = 32
st.column_dimensions["B"].width = 22
st.column_dimensions["C"].width = 80

# ---------------- Fuel Log ----------------
ws = wb.create_sheet("Fuel Log", 0)
ws["A1"] = "Fuel efficiency tracker"; ws["A1"].font = TITLE
ws["A2"] = ("How to use: each time the fuel light comes on, fill up and add a row. "
            "Type only in the yellow cells (date, car, odometer, price per litre, amount paid, notes). "
            "Grey cells calculate themselves.")
ws["A3"] = ("Method: fill when the light comes on, every time. The fuel you put in at one fill is the fuel "
            "you burn before the light comes on again, so each new row scores the PREVIOUS fill.")
ws["A2"].font = NOTE; ws["A3"].font = NOTE
ws["A4"] = "Blue text = your inputs. Black = formulas. Delete or overwrite the example row if you ever restart."
ws["A4"].font = NOTE

headers = [
    ("Date", 12), ("Car", 22), ("Odometer (miles)", 14), ("Price per litre (£)", 13),
    ("Amount paid (£)", 12), ("Litres added", 11), ("UK gallons added", 11),
    ("Miles since last fill", 12), ("MPG (UK) on last tank", 12), ("L/100km on last tank", 12),
    ("Cost per mile (£)", 11), ("Est. range of this fill (miles)", 14),
    ("Light expected at odometer", 14), ("Notes", 36),
]
H = 6
for col, (name, width) in enumerate(headers, start=1):
    cell = ws.cell(row=H, column=col, value=name)
    cell.font = HEAD; cell.fill = HEAD_FILL; cell.border = BOX
    cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    ws.column_dimensions[cell.column_letter].width = width
ws.row_dimensions[H].height = 45

for r in range(FIRST, LAST + 1):
    p = r - 1
    has = f'$C{r}<>""'
    prev_ok = f'AND($C{r}<>"",ROW()>{FIRST},$C{p}<>"",$C{r}>$C{p})'
    f = {
        "F": f'=IF(AND(E{r}<>"",D{r}>0),E{r}/D{r},"")',
        "G": f'=IF(F{r}="","",F{r}/Settings!$B$6)',
        "H": f'=IF({prev_ok},C{r}-C{p},"")' if r > FIRST else '=""',
        "I": f'=IF(AND(H{r}<>"",N(G{p})>0),H{r}/G{p},"")' if r > FIRST else '=""',
        "J": f'=IF(AND(H{r}<>"",N(F{p})>0),F{p}/(H{r}*Settings!$B$7)*100,"")' if r > FIRST else '=""',
        "K": f'=IF(AND(H{r}<>"",N(E{p})>0),E{p}/H{r},"")' if r > FIRST else '=""',
        "L": f'=IF(G{r}="","",G{r}*Settings!$B$10)',
        "M": f'=IF(OR(L{r}="",C{r}=""),"",C{r}+L{r})',
    }
    for col, formula in f.items():
        c = ws[f"{col}{r}"]; c.value = formula; c.font = BLACK; c.fill = CALC_FILL; c.border = BOX
    for col in "ABCDEN":
        c = ws[f"{col}{r}"]; c.font = BLUE; c.fill = INPUT_FILL; c.border = BOX
    ws[f"A{r}"].number_format = DATE
    ws[f"C{r}"].number_format = MILES
    ws[f"D{r}"].number_format = PPL
    ws[f"E{r}"].number_format = GBP
    ws[f"F{r}"].number_format = LIT
    ws[f"G{r}"].number_format = '0.000'
    ws[f"H{r}"].number_format = MILES
    ws[f"I{r}"].number_format = MPG
    ws[f"J{r}"].number_format = '0.00'
    ws[f"K{r}"].number_format = '£0.000'
    ws[f"L{r}"].number_format = MILES
    ws[f"M{r}"].number_format = MILES
    ws[f"B{r}"].value = None

# First entry, provided by the user
from datetime import date
ws[f"A{FIRST}"] = date(2026, 10, 27)
ws[f"B{FIRST}"] = "Honda Jazz 1.4 (2003)"
ws[f"C{FIRST}"] = 125872
ws[f"D{FIRST}"] = 1.72
ws[f"E{FIRST}"] = 20
ws[f"N{FIRST}"] = "Fuel light on. Refuelled £20 at £1.72/L. Starting point."
ws[f"C{FIRST}"].comment = Comment("Provided by you: odometer at the 27/10/2026 fill.", "Tracker")
ws[f"L{FIRST}"].comment = Comment(
    "Estimate only: gallons added x the MPG on Settings!B10 "
    "(real-world benchmark until your first leg is logged).", "Tracker")

ws[f"A{FIRST+1}"] = date(2026, 11, 2)
ws[f"B{FIRST+1}"] = "Honda Jazz 1.4 (2003)"
ws[f"C{FIRST+1}"] = 125967
ws[f"N{FIRST+1}"] = "Fuel light on again (dashboard photo). Add price per litre and amount paid once refuelled."

dv = DataValidation(type="decimal", operator="greaterThan", formula1=0, allow_blank=True)
ws.add_data_validation(dv); dv.add(f"C{FIRST}:E{LAST}")
dvd = DataValidation(type="date", operator="greaterThan", formula1="DATE(2000,1,1)", allow_blank=True)
ws.add_data_validation(dvd); dvd.add(f"A{FIRST}:A{LAST}")
ws.freeze_panes = ws[f"C{FIRST}"]

# ---------------- Summary ----------------
sm = wb.create_sheet("Summary", 1)
sm["A1"] = "Summary"; sm["A1"].font = TITLE
L = f"'Fuel Log'!"
rng = lambda c: f"{L}${c}${FIRST}:${c}${LAST}"
items = [
    ("Fill-ups logged", f"=COUNT({rng('C')})", '0'),                                   # B3
    ("Completed legs (light to light)", f"=COUNT({rng('I')})", '0'),                   # B4
    ("Total spent (£)", f"=SUM({rng('E')})", GBP),                                     # B5
    ("Total litres bought", f"=SUM({rng('F')})", LIT),                                 # B6
    ("Miles over completed legs", f"=SUM({rng('H')})", MILES),                         # B7
    # fuel burned over completed legs = everything bought except the latest fill, still in the tank
    ("Litres burned over completed legs", f'=IF(B3<2,"",B6-N(INDEX({rng("F")},B3)))', LIT),  # B8
    ("Average MPG (UK)", f'=IF(OR(B4=0,N(B8)=0),"",B7/(B8/Settings!$B$6))', MPG),      # B9
    ("Average cost per mile (£)", f'=IF(B4=0,"",(B5-N(INDEX({rng("E")},B3)))/B7)', '£0.000'),  # B10
    ("Best leg MPG", f'=IF(B4=0,"",MAX({rng("I")}))', MPG),                            # B11
    ("Worst leg MPG", f'=IF(B4=0,"",MIN({rng("I")}))', MPG),                           # B12
    ("Latest odometer", f'=IF(B3=0,"",INDEX({rng("C")},B3))', MILES),                  # B13
    ("Fuel light expected at about (odometer)", f'=IF(B3=0,"",INDEX({rng("M")},B3))', MILES),  # B14
    ("Your MPG vs catalog figure", f'=IF(B9="","",B9/Settings!$B$8-1)', '0.0%;-0.0%;-'),   # B15
    ("Your MPG vs real-world benchmark", f'=IF(B9="","",B9/Settings!$B$9-1)', '0.0%;-0.0%;-'),  # B16
]
sm["A2"], sm["B2"] = "Metric", "Value"
for c in "AB":
    sm[f"{c}2"].font = HEAD; sm[f"{c}2"].fill = HEAD_FILL
for i, (label, formula, fmt) in enumerate(items, start=3):
    sm[f"A{i}"] = label; sm[f"A{i}"].font = BLACK; sm[f"A{i}"].border = BOX
    sm[f"B{i}"] = formula; sm[f"B{i}"].font = GREEN; sm[f"B{i}"].number_format = fmt
    sm[f"B{i}"].border = BOX; sm[f"B{i}"].fill = CALC_FILL
for r in (9, 10):
    sm[f"A{r}"].font = BOLD
sm["A18"] = ("Averages are fuel-weighted (total miles / total fuel burned), so a short leg does not skew them. "
             "Rows in the log must be filled in order with no gaps.")
sm["A18"].font = NOTE
sm.column_dimensions["A"].width = 42
sm.column_dimensions["B"].width = 16

wb.save("fuel_tracker.xlsx")
print("saved")
