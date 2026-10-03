---
title: 'Hunt for Andromeda'
date: 2026-09-14
permalink: /posts/2026/09/hunt-for-andromeda/
tags:
  - Astrophotography
  - Andromeda
  - Astronomy
  - Space
  - Photography
---


## Find a dark spot
Go to [www.lightpollutionmap.info](https://www.lightpollutionmap.info/) to locate a suitable dark spot for astrophotography. 

Go to [zoom.earth/maps/satellite/](https://zoom.earth/maps/satellite/) to check the current satellite view of the clouds in your chosen location.

Go to [DeepSkyStacker](http://deepskystacker.free.fr/) to stack your astrophotography images for better results.
For download to their [GitHub Link](https://github.com/deepskystacker/DSS/releases#release-6.2.3-Beta2). Download the latest version. Go to Assets and find your suitable installation file for your suitable operating system. 

Organize captured photos into 
- biases - Cap On, high sutter speed
- darks - Same ISO, same focus - just lens cap ON
- flats - 
- lights - Photos of Andromeda

Open picture files > go to light frames folder > choose all the light frames (cntrl+A) > Open > Check all > you should see the number of light frames

click dark files > go to dark frames folder > choose all the dark frames (cntrl+A) > Open > you should see the number of dark frames

click flat files > go to dark flats folder > choose all the flat frames (cntrl+A) > Open > you should see the number of dark frames

click offset/bias files > go to bias flats folder > choose all the bias frames (cntrl+A) > Open > you should see the number of bias frames

click: Register checked pictures > Advanced > Compute the number of detected stars > lower the "Star detection threshold (%)" and "Compute the number of detected stars" until more than 100 stars gets detected 

In the same Register checked pictures > Actions > make sure to check 
  - Automatic detection of hot pixels
  - Stack after registering (select the best 95% pictures and stack them)

Before hitting OK in this window: go to "Stack parameters"
tab: light: check "Kappa-Sigma clipping" [Kappa: 2.00 ; Number of iteration: 5]

OK --- take many hours

Saving: 
Processing tab > Save picture to file > [Tiff Image (16 or 32 bit/ch)] , Compression: none, options: check "Embed adjustments in the saved image but do not apply them"


