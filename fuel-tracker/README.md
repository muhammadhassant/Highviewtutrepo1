# Fuel efficiency tracker

`fuel_tracker.xlsx` logs every fill-up for the Honda Jazz 1.4 (2003) and works out MPG, L/100km and cost per mile.
To rebuild the workbook from scratch, run `python3 build_tracker.py`.

## How to use it
1. Fill up when the fuel light comes on, and do the same every time.
2. Add a new row in **Fuel Log** and type into the yellow cells only: date, car, odometer, price per litre, amount paid and notes.
3. The new row scores the *previous* tank. The fuel you added last time is the fuel you burned getting back to the light.
4. **Summary** shows your running averages, best and worst legs, and the odometer reading where the light should come on next.

## Sources for benchmarks (Settings sheet)
- Tank capacity of 42 L and catalog combined figure of 5.5 L/100km (51.4 mpg UK) for the Jazz Mk1 1.4 (83 hp, 2002–2008): https://mobile.md/en/catalog/honda-122/jazz-1096/honda-jazz-i-3103/14-83-hp-16310
- Real-world figure of 6.57 L/100km (43.0 mpg UK) from an owner's log for a 2003 Jazz 1.4 LS covering about 22,500 km: https://www.spritmonitor.de/en/detail/602999.html?cdetail=1
- Conversions: 1 UK gallon = 4.54609 L and 1 mile = 1.609344 km. UK MPG = 282.481 / (L/100km).
