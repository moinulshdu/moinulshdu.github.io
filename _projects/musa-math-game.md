---
title: "Musa & Isa's Math Game Kit"
order: 1
summary: >-
  A handheld learning game I built for Musa and Isa: adaptive addition practice for
  Musa and a talking A-to-Z letters game for Isa, with recorded voice messages.
  Arduino Nano, 2.8" color screen, 4×4 keypad, MP3 player and a rechargeable
  21700 battery.
tags: [Arduino, Kids, Education]
thumbnail: /files/projects/musa-math-game/screen.png    # picture on the Fun Projects card
circuit_image: ""          # add a picture of the circuit, e.g. /files/projects/musa-math-game/circuit.png
how_to_play: >-
  Press Power on. On the menu press A for Musa's addition game or B for Isa's letters.
  In the math game type the answer, press # to check and * to erase. In the letters
  game any key shows the next letter; hold # for 3 seconds to return to the menu.
  D shows the progress.

# ---- simulator settings (only change these if the wiring or file names change) ----
sim:
  hex: /files/projects/musa-math-game/firmware.hex
  circuit: /files/projects/musa-math-game/MusaMathGameCircuit2.circuit
  display: { type: ili9341, cs: D10, dc: D9, led: D6 }
  keypad:
    rows: [D2, D3, D4, D5]
    cols: [A0, A1, A2, A3]
    keys: ["123A", "456B", "789C", "*0#D"]
  dfplayer:
    tx: A4
    busy: A7
    folder: /files/projects/musa-math-game/mp3/
    captions: /files/projects/musa-math-game/captions.json
  battery: { pin: A6, divider: 2, full_mv: 4150, empty_mv: 3400 }

downloads:
  - { label: "Circuit Studio file (MusaMathGameCircuit2.circuit)", file: /files/projects/musa-math-game/MusaMathGameCircuit2.circuit, note: "open it in Circuit Studio" }
  - { label: "Arduino sketch (MathGameKit, all tabs)", file: /files/projects/musa-math-game/MathGameKit-sketch.zip, note: "open MathGameKit.ino in the Arduino IDE" }
  - { label: "Compiled program (firmware.hex)", file: /files/projects/musa-math-game/firmware.hex }
---
## The idea

Musa was practicing addition and Isa was learning letters. I wanted one small gadget that adapts to each of them and cheers them on in a familiar voice.

## How it works

- **Adaptive math.** Each session has 10 problems: half easy, some medium, a few hard, shuffled. The level goes up after a right first try and down after misses, and it is saved in the Nano's EEPROM so it survives power-off.
- **Three tries per problem**, with "close!" and "try again" feedback and the answer shown at the end.
- **Isa's letters.** A big colorful letter, its sound ("G, G for goat") and a cheer; all 26 letters appear in random order before any repeats. Nothing is scored.
- **Battery aware.** A 100 k + 100 k divider lets the Nano read the cell voltage and show the charge in the corner. The screen sleeps after 2 minutes without a key press.

## Hardware

- Arduino Nano (ATmega328P)
- 2.8" ILI9341 SPI color screen, with 1 kΩ / 2 kΩ dividers to bring the 5 V signals down to about 3.3 V
- 4×4 membrane keypad
- DFPlayer Mini MP3 module with a microSD card and an 8 Ω speaker
- 21700 Li-ion cell, TP4056 USB-C charger, toggle switch and J5019 5 V boost module

## Adding a new game

The code is organized so a new game is one new tab plus two lines in `games.h`; the menu, sounds, tries, levels and saving work automatically. See the comments in the code below.
