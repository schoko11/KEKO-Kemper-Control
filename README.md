# KEKO-Kemper-Control
Control your Kemper by MIDI via Touchscreen
KEKO is based on and made with Open Stage Control (https://openstagecontrol.ammd.net)
OSC (in short for openstagecontrol) is a Server Client Application. 


This Project is made and designed on a 24" Touchscreen and allows you to control a lot of the Parameters the Kemper has to offer.

**To use KEKO you need a really good midi connection and Touchscreen or a connection to the Network where the Server is running.**

To control your Kemper you normally need to use the rigmanager(or Kemper Remote), so you are mainly forced to use Windows or you run Rigmanager in a virtual machine.


One goal is to use this application on a raspberry pi with a usb midi connection and control (or Monitor) the Kemper from a mobile device.
This is especially usefull when thinking of using it live.
(Until now this is not tested, this is a future todo).


**What has to be done to give it a try?**
- OSC (the programm directory) should be placed in a folder with full permissions (KEKO is reading and writing file in the install dir, maybe needs to be change in the future)
- load the *.config file when you first start OSC
- Point "load" to the *.JSON file and "custom-module" to the *.JS file
- setup midi correct by "[custom Name]:[input port], [output port] sysex" -> choose the ports after viewing them with "list midi devices" from the server menu
- On the Kemper itself in the System settings on page 15, you have to activate "UI to MIDI"
- If you want rigs to be direct selectable you have to assign a MIDI Program Change to your rigs (System page 13)
- Start with 1 and leave no gap!

When the app is started it defaults to browse mode, so the mode on the kemper and in the application has to match, this has to be done by you!
When startet you see in main window just one rig to choose from "rignames" this is the default when no scan has been made with this installation of OSC.

But don't worry, there is a scanner -> press settings, there you can see the scan button.
If you have assigned program changes to your rigs these will be called via program changes one by one (max 128)
When pressing scan you have to wait until it is finished (when the progress bar disappears).

**The same has to be done in performance mode:**
-switch the kemper to performance mode
-switch the application to performance mode
-go to settings and press scan (note that this takes > 10 min, so be patient)

Scanning is just a recursive function, which switches the kemper forward, waits a bit and then asks for the rignames (scanning in performance mode asks for the performance an the corresponding rignames). Please note, that it would be possible to lower the scanning time, but if you have unwanted delay in the request of the kemper, something might go wrong. To use KEKO a really good midi connection and Network connection is a must (if using via tablet or phone).
 
