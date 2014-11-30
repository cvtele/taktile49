// generic Midi Keyboard Script with IN and OUT
// Modified from the original by Thomas Helzle

load("midi.js");
loadAPI(1);

host.defineController("Korg", "Taktile-49", "1.0", "644942b0-3ab2-11e4-916c-0800200c9a66");
host.addDeviceNameBasedDiscoveryPair(["TR taktile-49 1 KEYBOARD/CTRL"], ["TR taktile-49 1 DAW IN"]); 
host.defineMidiPorts(1, 1);

var LOWEST_CC = 1;
var HIGHEST_CC = 119;
var _down     = 22;
var _up       = 23;
var _ff       = 24;
var _stop     = 25;
var _play     = 26;
var _loop     = 27;
var _record   = 28;
var _b1       = 29;
var _b2       = 30;
var _b3       = 3;
var _b4       = 4;

var _knob1    = 16;
var _knob2    = 17;
var _knob3    = 18;
var _knob4    = 19;
var _knob5    = 20;
var _knob6    = 21;
var _knob7    = 22;
var _knob8    = 23;
var _mastervolume = 118;

function init()
{
    println("Taktile called init");
    host.getMidiInPort(0).setMidiCallback(onMidi);
    generic = host.getMidiInPort(0).createNoteInput("", "??????");
    generic.setShouldConsumeEvents(false);

    transport = host.createTransport();
    cursorTrack = host.createCursorTrack(0,0);
    primaryDevice = cursorTrack.getPrimaryDevice();
    masterTrack = host.createMasterTrack(0);
    application = host.createApplication();
    for (var i = 0; i < 8; i++) {
        primaryDevice.getMacro(i).getAmount().setIndication(true);
        primaryDevice.getParameter(i).setIndication(true);
    }

    //
    //// Make CCs 2-119 freely mappable
    //userControls = host.createUserControlsSection(HIGHEST_CC - LOWEST_CC + 1);
    //
    //for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
    //{
    //   userControls.getControl(i - LOWEST_CC).setLabel("CC" + i);
    //}
}

function exit()
{
    println("Taktile called exit");
}

function onMidi(status, data1, data2)
{
    if (status != 248) {
           printMidi(status, data1, data2)

    }
    if (isChannelController(status))
    {
        switch (data1)
        {

            case _stop:
                transport.stop();
                break;

            case _play:
                transport.play();
                break;

            case _record:
                transport.record();
                break;
            case _loop:
                transport.toggleLoop();
                break;
            case _up:
                cursorTrack.selectNext();
                break;
            case _down:
                cursorTrack.selectPrevious();
                break;
            case _mastervolume:
                masterTrack.getVolume().set(data2, 128);
                masterTrack.getVolume().setIndication(true);
                break;
            case _b1:
                application.toggleNoteEditor();
                break;
            case _b2:
                application.toggleAutomationEditor();
                break;
            case _b3:
                application.toggleMixer();
                break;
            case _b4:
                application.toggleDevices();
                break;
            case _ff:
                cursorTrack.returnToArrangement();
                break;

            case _knob1:
                println("knob 1 " + data2);
                primaryDevice.getParameter(0).set(data2, 128);
                //primaryDevice.getMacro(0).getAmount().set(data2, 128);
                break;
            case _knob2:
                primaryDevice.getMacro(1).getAmount().set(data2, 128);
                break;
            case _knob3:
                primaryDevice.getMacro(2).getAmount().set(data2, 128);
                break;
            case _knob4:
                primaryDevice.getMacro(3).getAmount().set(data2, 128);
                break;
            case _knob5:
                primaryDevice.getMacro(4).getAmount().set(data2, 128);
                break;
            case _knob6:
                primaryDevice.getMacro(5).getAmount().set(data2, 128);
                break;
            case _knob7:
                primaryDevice.getMacro(6).getAmount().set(data2, 128);
                break;
            case _knob8:
                primaryDevice.getMacro(7).getAmount().set(data2, 128);
                break;
        }
        //if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC)
        //{
        //    var index = data1 - LOWEST_CC + ((HIGHEST_CC-LOWEST_CC+1) * MIDIChannel(status));
        //    userControls.getControl(index).set(data2, 128);
        //}

    }

}