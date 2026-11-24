---
title: "Nanocrystal Builder"
order: 2
tagline: "Atomistic .xyz models of nanocrystals of any shape, size and truncation — straight from CIF files."
icon: /images/apps/nanocrystal-builder.svg
repo: "NanocrystalBuilder"            # GitHub repository name (github.com/moinulshdu/<repo>)
status: coming-soon          # released  or  coming-soon
web_app: ""  # optional link to a browser / phone version
platforms: [Windows, macOS, Linux]
tags: [Crystallography, Modelling, PDF analysis]
# Screenshots: put images in images/apps/nanocrystal-builder/ and list them here, e.g.
#   - { src: /images/apps/nanocrystal-builder/main-window.png, caption: "Main window" }
screenshots: []
---
## Overview

Nanocrystal Builder generates atom-by-atom models (.xyz files) of nanocrystals from a crystal structure (.cif). I built it for pair distribution function (PDF) analysis, where every plausible structure of one nanocrystal has to be built and tested against the data. It replaced three separate scripts I used to make, rotate and draw models.

## Key features

- **Reads CIF files** with a built-in reader; CdSe, CdS and ZnS zinc-blende and wurtzite structures are included as defaults.
- **Exact zinc-blende tetrahedra** with equal or per-corner truncation, edge truncation, and Cd- or Se-terminated surfaces.
- **Cut shapes:** sphere, cube, octahedron, cuboctahedron, rod and custom facets.
- **Series mode:** writes whole families of models at once, with a summary table (CSV) of sizes and compositions.
- **3D viewer** in the style of VESTA/CrystalMaker: five drawing styles, distance measuring, pair-distance check and transparent PNG export.
- **Verified:** reproduces the models of my original scripts atom for atom.

## Who it is for

Anyone modelling nanocrystal structures for PDF, scattering or simulation work who wants reproducible models without writing code.
