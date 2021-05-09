# KEKO-Kemper-Control
Control your Kemper by MIDI via Touchscreen
KEKO is based on and made with Open Stage Control (https://openstagecontrol.ammd.net)
OSC (in short for openstagecontrol) is a Server Client Application.

**View "FULL" (Browse Mode):**
![KEKO_View_Full_Browse_0_3_0_alpha](https://user-images.githubusercontent.com/41967358/114307917-2fca3700-9ae2-11eb-870d-0021ff9b6773.JPG)

**View "MIDI" (Browse Mode):**
![KEKO_View_Midi_Browse_0_3_0_alpha](https://user-images.githubusercontent.com/41967358/114307945-4bcdd880-9ae2-11eb-812c-f3a03894081e.JPG)

**View "LIVE" (for tablet usage, Performance Mode):**
![KEKO_View_live_Performance_0_3_0_alpha](https://user-images.githubusercontent.com/41967358/114307948-525c5000-9ae2-11eb-9080-f693ced9229a.JPG)



>This Project is made and designed on a 24" Touchscreen and allows you to control a lot of the Parameters the Kemper has to offer.
>Nevertheless the GUI is setup by percentages of screensize, meaning the ratio between the object is the same on every viewing Device.

**To use KEKO you need a really good midi connection and Touchscreen or a connection to the Network where the Server is running.**

To control your Kemper you normally need to use the Rigmanager(or Kemper Remote), so you are mainly forced to use Windows or you run Rigmanager in a virtual machine.


>One goal is to use this application on a raspberry pi with a usb midi connection. 
>and control (or Monitor) the Kemper from a mobile device.
>This is especially usefull when thinking of using it live.
>(Until now this is not tested, this is a future todo).


**What has to be done to give it a try?**
- OSC (the programm directory) should be placed in a folder with full permissions (KEKO is reading and writing files in the install dir, maybe needs to be changed in the future).
- load the *.config file when you first start OSC.
- Point "load" to the *.JSON file and "custom-module" to the *.JS file.
- setup midi correct by "[custom Name]:[input port], [output port] sysex" -> choose the ports after viewing them with "list midi devices" from the server menu.
- On the Kemper itself in the System settings on page 15, you have to activate "UI to MIDI".
- If you want rigs to be direct selectable you have to assign a MIDI Program Change to your rigs (System page 13).
- Start with 1 and leave no gap!
- This Version uses OS 8.0.6 this must match with your Profiler.
- When you start the server by pressing the play button you see the ip where you can start the client(means your Browser), you just have to be in the same network.



>When the app is started it defaults to browse mode, so the mode on the Kemper and in the application has to match, this has to be done by you!
>When startet you see in main window just one rig to choose from -> "rignames". 
>This is the default when no scan has been made with this installation of OSC.
>But don't worry, there is a scanner -> press settings, there you can see the scan button.
>If you have assigned program changes to your rigs these will be called via program changes one by one (max 128).
>When pressing scan you have to wait until it is finished (when the progress bar disappears).

>**The same has to be done in performance mode:**
>- switch the Kemper to performance mode.
>- switch the application to performance mode.
>- go to settings and press scan (note that this takes > 10 min, so be patient).
> - now there is a gap of 750ms between theses steps, it maybe could be lowered, or changed by user input in a future version.


Scanning is just a recursive function, which switches the Kemper forward, 
waits a bit and then asks for the rignames 
(scanning in performance mode asks for the performance an the corresponding rignames). 
Please note, that it would be possible to lower the scanning time, but if you have 
unwanted delay in the request of the kemper, something might go wrong. 
To use KEKO a really good midi connection and Network connection is a must 
(especially if using via tablet or phone).

 
**This is the initial Version considered alpha state don't use it in a productive environment**


**Known limitations / drawbacks / bugs**
- At some points a little waiting of 300ms has been added after changing the rig, so that the values are updated for the current rig and not the rig before (maybe adding a user changeable value in the future)
- OSC Version 1.9.1 must be used and Kemper OS Version 8.06 (new fuzz fx etc. are not tested) for Version 0.3.0

**TODO:**

- [ ] Fix Pedals in output section
- [x] Think about a setting to choose from different layouts -> fewer objects and less midi and network traffic (with 0.2.0)
- [ ] Nicer GUI
- [ ] Use SVG symbols on AMP, CAB
- [x] Color the FX like the colors on the Kemper (with 0.1.0)
- [ ] Some SYSTEM controls are not implemented (Monitor out / Main out / input source / pure cabinet ...) -> partly done (with 0.3.0)
- [x] How to handle not renderable non-linear values listed above (partly approach found)?
- [x] Make modules to simplify handling in bigger projects
- [ ] Various Code cleanups, maybe splitting definitions in a seperate module file
- [ ] Investigate in realization with a Raspberry Pi and a ESI MATE EX Midi USB Interface
- [ ] Investigate into an guided installer with electron, as some peeps seems to have a problem setting it up (basically download the newest OSC Version und copy the corresponding files to the correct location, maybe even a guided midi setup could be possible)
- [ ] In LIVE view rig and performance is mixed up
- [ ] As it is not possible by midi to store a rig or performance, think about something like a snapshot to preserve / load the current settings
- [ ] When some SETTINGS are choosen the SETTINGS page should be closed automatically
- [ ] Would it be fun to use some kind of USB HID Device as control (https://github.com/node-hid/node-hid/issues) ?
 
