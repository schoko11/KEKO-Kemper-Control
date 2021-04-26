# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0-Alpha] - 2021-04-26

### Added
- controls(Main out / Mon Out EQ and Volumes, looper Volume) in Output Sections (instead of showing output levels)
- pedals in output Section (disabled for now, a bug has to be fixed)

### Fixed / changed
- removed not working labels of output section Volumes

## [0.2.2-Alpha] - 2021-04-11

### Added
- another view LIVE, with very minimal elements, see screenshots in readme
- added Tuner button, flashes when active
- added another file "nord-mod.css" should make handling of different styles easier

### Fixed / changed
- Various code cleanups (still a lot to do)
- Text size is now bigger uses space more efficently

## [0.2.1-Alpha] - 2021-04-08

### Added
- Some kind of zebra on the selection fields (uneven)

### Fixed / changed
- Various code cleanups (still a lot to do)
- Adjusted alignment of gui components
- Adjust overall color scheme to more blueish, get rid of too much colors

## [0.2.0-Alpha] - 2021-04-05

### Added
- Added adjustable layout, switchable in SETTINGS (FULL / LIVE)
- Added Button for switching Tuner on / off

### Fixed
- Main Fx Categories, when selecting "all" -> Fx name not displayed / wrong
- When switching between Performance and Browse, when switch the Kemper the wrong Rig was displayed

## [0.1.0-Alpha] - 2021-04-03

### Added
- Main Fx Categories have now colors, roughly made like on the kemper, needs more finetuning
- Added main.js file, the starting point and add a seperate js file for the kemper, now this project can be easily used in bigger OSC projects 


## [0.0.4-Alpha] - 2021-03-28

### Added
- Start with implementation of basic colors for the main FX categories

### Fixed

- Added support/experimental support for all not correct displayed values(not 100% accurate but quite close)
- Removed pre Alphas from Releases


## [0.0.3-Alpha] - 2021-03-21

### Cleanup

- Get rid of unecessary javascript objects and variables(changed var to let).
- Remove theme "nord" -> default theme more blueish.


### Fixed

- Added support for correct value rendering: Knob: Detune, FX: Micro Pitch.
- Added experimental support for correct value rendering: Knob: Rate, FX: Rate(a math formular approach should found).


## [0.0.2-Alpha] - 2021-03-13

### Cleanup

- Get rid of unecessary javascript objects and variables.
- Added better code descriptions(more to be done).

### Fixed

- Fixed not showing VOLUME in AMP Section.

## [0.0.1-Alpha] - 2021-03-08

### Initial Release
