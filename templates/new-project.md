---
# ============================================================================
#  NEW FUN PROJECT
#  1) Copy this whole file into the _projects folder and name it after the
#     project, e.g.  _projects/weather-station.md   (lowercase, hyphens).
#     That name becomes the web address:  /fun-projects/weather-station/
#  2) Upload the project's files (photos, .circuit, sketch zip) to
#     files/projects/weather-station/
#  3) Fill in the fields below. Text after a # is a note and is ignored.
#     Delete or leave empty ("" or []) anything you don't need — empty
#     sections are hidden automatically.
# ============================================================================

published: false                # false = not on the website yet · true = live

# 1. Name
title: "Weather Station"
order: 2                        # position on the Fun Projects page (1 = first)

# 2. Brief description and the idea (card + top of the page; 2–4 sentences)
summary: >-
  What it is, who it is for and the idea behind it.

# 3. Tags
tags: [Arduino, Home]

# Card picture (if empty, the first screenshot is used)
thumbnail: ""

# 4a. YouTube video: paste the full link (Unlisted videos work), or leave ""
youtube: ""

# 4b. Screenshots / photos — shown as "Figure 1, 2, …" with your caption.
#     **bold** and *italic* work in captions.
screenshots:
  - src: /files/projects/weather-station/finished.jpg
    caption: "The finished station on the balcony."
  - src: /files/projects/weather-station/inside.jpg
    caption: "Inside: **Arduino Nano**, sensor board and battery."

# 5. How it works  →  write it below the second "---" line at the bottom

# 6. Hardware — choose ONE:
#    a) circuit project: the parts list, pin connections and code are read
#       from your Circuit Studio file
circuit_file: /files/projects/weather-station/weather-station.circuit
#    b) no circuit file: type the parts yourself (delete circuit_file above)
# parts:
#   - { qty: 1, name: "Raspberry Pi 4", details: "4 GB" }
#   - { qty: 2, name: "Servo motor", details: "SG90" }

# 7. Circuit diagram picture (screenshot from Circuit Studio)
circuit_image: /files/projects/weather-station/circuit.png
circuit_caption: ""             # optional; a default caption is used when empty

# 8. Arduino code  →  shown automatically, read-only, from circuit_file

# 9. What you can modify
modify:
  - what: "How often it measures"
    where: "config.h → MEASURE_SECONDS"
    how: "Default 60 seconds."

# 10. Downloads
downloads:
  - { label: "Circuit Studio file", file: /files/projects/weather-station/weather-station.circuit, note: "open in Circuit Studio" }
  - { label: "Arduino sketch (.zip)", file: /files/projects/weather-station/sketch.zip }
---
Explain **how it works** here, in Markdown: short paragraphs, **bold** for key terms, and lists like this:

- first point
- second point
