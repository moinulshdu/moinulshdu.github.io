---
# ============================================================================
#  FUN PROJECT PAGE  —  /fun-projects/musa-math-game/
#  Files for this project live in:  files/projects/musa-math-game/
# ============================================================================

# 1. Name
title: "Musa & Isa's Math Game Kit"
order: 1                        # position on the Fun Projects page (1 = first)

# 2. Brief description and the idea (shown on the card and under the title)
summary: >-
  A handheld learning game I built for Musa and Isa: adaptive addition practice
  for Musa and a talking A-to-Z letters game for Isa, with recorded voice
  messages. Arduino Nano, 2.8" color screen, 4×4 keypad, MP3 player and a
  rechargeable 21700 battery.

# 3. Tags
tags: [Arduino, Kids, Education]

# Card picture on the Fun Projects page (if empty, the first screenshot is used)
thumbnail: /files/projects/musa-math-game/screen.png

# 4a. YouTube video — paste the full link (any YouTube link format works), or leave ""
youtube: ""

# 4b. Screenshots / photos, numbered "Figure 1, 2, …" with your caption
screenshots: []
#  - src: /files/projects/musa-math-game/finished.jpg
#    caption: "The finished game kit: 2.8″ screen, 4×4 keypad and speaker in one case."
#  - src: /files/projects/musa-math-game/menu.jpg
#    caption: "Start menu. **A** starts Musa's addition game, **B** Isa's letters, **D** shows progress."

# 5. How it works  →  written below the second "---" line

# 6. Hardware: parts list and pin connections are read from this Circuit Studio file
circuit_file: /files/projects/musa-math-game/MusaMathGameCircuit2.circuit

# 7. Circuit diagram picture (a screenshot from Circuit Studio)
circuit_image: ""               # e.g. /files/projects/musa-math-game/circuit.png
circuit_caption: ""             # optional; a default caption is used when empty

# 8. Arduino code  →  shown automatically (read-only) from the circuit file above

# 9. What you can modify (each item: what, where, how)
modify:
  - what: "Number of problems in a session"
    where: "config.h → PROBLEMS_PER_SESSION"
    how: "Default 10. Keep EASY_COUNT + MEDIUM_COUNT + HARD_COUNT equal to it."
  - what: "Tries per problem"
    where: "config.h → TRIES_PER_PROBLEM"
    how: "Default 3."
  - what: "Mix of easy, medium and hard problems"
    where: "config.h → EASY_COUNT, MEDIUM_COUNT, HARD_COUNT"
    how: "Default 5 / 3 / 2. EASY_OFFSET and HARD_OFFSET set how far below or above the current level they are."
  - what: "How fast the level goes up or down"
    where: "config.h → CHANGE_FIRST_TRY … CHANGE_NOT_SOLVED"
    how: "Default +1, 0, −1, −2. LEVEL_START, LEVEL_MIN and LEVEL_MAX set the starting level and the limits (1–20)."
  - what: "Range of numbers in the addition game"
    where: "game_addition.ino → ADD_A_MIN/MAX, ADD_B_MIN/MAX"
    how: "Level 20 uses the full range (default 1–50 + 5–60)."
  - what: "When a wrong answer counts as “close”"
    where: "config.h → CLOSE_MIN, CLOSE_PERCENT"
    how: "Default within 2, or within 10 % of the answer."
  - what: "Add a new game (e.g. subtraction)"
    where: "new tab game_subtraction.ino + games.h"
    how: "Copy game_addition.ino and change the answer line, then add two lines to games.h (instructions are in that file). Menu, sounds, levels and saving work automatically."
  - what: "Voice messages"
    where: "SD card folder mp3/ (0001.mp3 …) · config.h → SND_…"
    how: "Record your own MP3s with the same numbers. The list of what each number says is in config.h."
  - what: "Number of extra cheers"
    where: "config.h → EXTRA_PRAISE_COUNT, ISA_CHEER_COUNT"
    how: "Set to how many extra cheer files you recorded (0 = none)."
  - what: "Words shown under the letters"
    where: "game_letters.ino → LETTER_WORDS"
    how: "Match them to your recordings (max 9 letters each)."
  - what: "Speaker volume"
    where: "config.h → SPEAKER_VOLUME"
    how: "0–30; about 20 on battery."
  - what: "Screen sleep time"
    where: "config.h → SCREEN_SLEEP_SECONDS"
    how: "Default 120 seconds without a key press."
  - what: "Hold time to leave the letters game"
    where: "config.h → EXIT_HOLD_MS"
    how: "Default 3000 ms (hold #)."
  - what: "Screen colors"
    where: "config.h → COLOR_…"
    how: "RGB565 values; search “RGB565 color picker”."
  - what: "Battery percentage"
    where: "config.h → BATTERY_FULL_MV, BATTERY_EMPTY_MV, DIVIDER_TOP/BOTTOM"
    how: "The divider values must match the two resistors on pin A6."
  - what: "Pins"
    where: "config.h → PINS section"
    how: "Only if you wire it differently; the pins must match the circuit."
  - what: "Erase the saved levels"
    where: "config.h → RESET_PROGRESS"
    how: "Set to true, upload once, then set back to false and upload again."
  - what: "Screen shows garbage"
    where: "config.h → SPI_SPEED"
    how: "Lower it to 4000000."

# 10. Downloads
downloads:
  - { label: "Circuit Studio file (MusaMathGameCircuit2.circuit)", file: /files/projects/musa-math-game/MusaMathGameCircuit2.circuit, note: "open in Circuit Studio" }
  - { label: "Arduino sketch (MathGameKit, all tabs)", file: /files/projects/musa-math-game/MathGameKit-sketch.zip, note: "unzip and open MathGameKit.ino in the Arduino IDE" }
---
**Two games in one device.** On the menu, **A** starts Musa's addition game and **B** starts Isa's letters game. **D** shows progress.

**Musa's adaptive addition**

- Each session has 10 problems, shuffled: half are easy, some medium and a few hard, relative to his current level (1–20).
- He types the answer on the keypad, presses **#** to check and **\*** to erase. He gets three tries per problem, with "Close!" or "Again!" feedback and a recorded voice message after every try. After the third try the answer is shown.
- The level goes up after a right first try and down after misses. It is saved in the Nano's EEPROM, so progress survives switching off.

**Isa's letters**

- A big colorful letter appears with its word ("G g — Goat"), the recorded sound plays ("G, G for goat"), then a short cheer.
- Any key shows the next letter. All 26 letters come in random order before any letter repeats. Nothing is scored.
- Holding **#** for 3 seconds goes back to the menu.

**Inside**

- **Brain:** an Arduino Nano.
- **Screen:** a 2.8″ ILI9341 color display on SPI. Every signal line goes through a 1 kΩ / 2 kΩ divider that brings the Nano's 5 V down to about 3.3 V for the display.
- **Keypad:** a 4×4 membrane keypad, scanned one column at a time.
- **Sound:** a DFPlayer Mini plays the recorded MP3s from a microSD card through an 8 Ω speaker. The Nano sends it serial commands and watches its BUSY pin to know when a message has finished.
- **Power:** a 21700 Li-ion cell, charged over USB-C by a TP4056 module. A toggle switch turns it on, and a J5019 module boosts it to 5 V.
- **Battery meter:** a resistor divider lets the Nano read the cell voltage and show the charge in the corner of the screen.
- **Saving power:** the screen goes dark after 2 minutes without a key press.
