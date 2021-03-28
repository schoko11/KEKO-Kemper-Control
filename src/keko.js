//variable and object definitions		
let stompArgs = ['A',' 32 ',17,'B',' 33 ', 18,'C',' 34 ',19,'D', ' 35 ',20, 'X', ' 38 ',22,'M', ' 3a ',24, 'E', ' 3c ',26, 'R', ' 3d ',28  ];  //stomp update in osc outfilter

const fs = nativeRequire('fs');
//const path = nativeRequire('path');
//let Buffer = nativeRequire('buffer').Buffer;  //needed for nodejs buffer , parse strings as hexstrings

let maxFxControls = 36;

let stompTemp,stompIdent,curFxId,fxKnobFinalValue,stompFxIdent; 
let i,j,knobVal,updateId,textSplitSysex;
let tempobj;	
i = 0;
j = 0;
let countRigs = 0;
let defNrSimShownRigsOrPerfs = 18;
let programChangeSelOffset = 0;
let initRigs = -1;
let lastScannedRigs = "";
let browseMode = true;
let tempTimeout = 0;
let bankNr = 1;
let perfIndex;
let rigsAndPerfsListTemp = {};
let currPerfName ='';
let perfList = {
	"P1" : ["","","","",""]
}	

let perfHelper,tempPerfHex;
		
let pgOffsetPerf = [0,2,4,1,2];  //offsets for banks -> bank 1 offset 0 bank 2 offset 2 -> program change 2 with bank 2 ist the first slot in performance number 26...

let tempStr = '';   //perf and rigsnames while scanning in perf. mode

//these 3 const variables according to the server configuration
let midiDeviceName;   //midi: "UCX1:0,1 sysex"  
let sendIp;// = '127.0.0.1';      //send: 127.0.0.1:8000 
let serverPort;// = '9000';       //port: 9000 

//the hex identifier for the stompFxId just below
const stompFxKEYS = ["00 00","00 01","00 02","00 03","00 04","00 06","00 07","00 08","00 09","00 0a","00 0c","00 21","00 22","00 23","00 24","00 25","00 2a","00 26","00 27","00 20",
                     "00 71","00 72","00 73","00 74","00 11","00 12","00 13","00 14","00 15","00 61","00 62","00 63","00 64","00 65","00 66","00 67","00 31","00 32","00 39","00 3a", 
					 "00 41","00 42","00 43","00 47","00 44","00 45","00 46","00 51","00 52","00 53","00 59","00 5b","01 01","00 0b","00 0d","01 02","01 03","01 04","01 12","01 13","01 14","01 15",
					 "01 21","01 24","01 11","01 16","01 17","01 18","01 09","01 0a","01 0b","01 0c","01 22","01 23","01 25","01 26","01 41","01 32","01 33","01 34","01 35","01 36","01 37",
					 "00 40","01 31","00 79","00 7a","00 7b"];

let stompFxIdTemp = {};	
const stompFxId = {        //the name of the fx in the correct order, the hex identifier as value from above
 	"off": stompFxKEYS[0],
  	"Wah Wah #WAH": stompFxKEYS[1],
  	"Wah Low Pass #WAH": stompFxKEYS[2],
  	"Wah High Pass #WAH": stompFxKEYS[3],
  	"Wah Vowel Filter #WAH": stompFxKEYS[4],
  	"Wah Phaser #WAH": stompFxKEYS[5],
  	"Wah Flanger #WAH": stompFxKEYS[6],
  	"Wah Rate Reducer #WAH": stompFxKEYS[7],
  	"Wah Ring Modulator #WAH": stompFxKEYS[8],
  	"Wah Freq Shifter #WAH": stompFxKEYS[9],
  	"Wah Formant Shift #WAH": stompFxKEYS[10],
  	"Green Scream #DIST": stompFxKEYS[11],
  	"Plus DS #DIST": stompFxKEYS[12],
  	"One DS #DIST": stompFxKEYS[13],
  	"Muffin #DIST": stompFxKEYS[14],
  	"Mouse #DIST": stompFxKEYS[15],
  	"Full OC #DIST": stompFxKEYS[16],
  	"Fuzz DS #DIST": stompFxKEYS[17],
  	"Metal DS #DIST": stompFxKEYS[18],
  	"Kemper Drive #DIST": stompFxKEYS[19],
  	"Treble Booster #BOO": stompFxKEYS[20],
  	"Lead Booster #BOO": stompFxKEYS[21],
  	"Pure Booster #BOO": stompFxKEYS[22],
  	"Wah Pedal Booster #BOO": stompFxKEYS[23],
  	"Bit Shaper #SHAP": stompFxKEYS[24],
  	"Recti Shaper #SHAP": stompFxKEYS[25],
  	"Soft Shaper #SHAP": stompFxKEYS[26],
  	"Hard Shaper #SHAP": stompFxKEYS[27],
  	"Wave Shaper #SHAP": stompFxKEYS[28],
  	"Graphic Equalizer #EQ": stompFxKEYS[29],
  	"Studio Equalizer #EQ": stompFxKEYS[30],
  	"Metal Equalizer #EQ": stompFxKEYS[31],
  	"Acoustic Simulator #EQ": stompFxKEYS[32],
  	"Stereo Widener #EQ": stompFxKEYS[33],
  	"Phase Widener #EQ": stompFxKEYS[34],
  	"Delay Widener #EQ": stompFxKEYS[35],
  	"Compressor #COMP": stompFxKEYS[36],
  	"Auto Swell #COMP": stompFxKEYS[37],
  	"Noise Gate 2:1 #NOIS": stompFxKEYS[38],
  	"Noise Gate 4:1 #NOIS": stompFxKEYS[39],
  	"Vintage Chorus #CHOR": stompFxKEYS[40],
  	"Hyper Chorus #CHOR": stompFxKEYS[41],
  	"Air Chorus #CHOR": stompFxKEYS[42],
  	"Micro Pitch #CHOR": stompFxKEYS[43],
  	"Vibrato #CHOR": stompFxKEYS[44],
  	"Rotary Speaker #CHOR": stompFxKEYS[45],
  	"Tremolo #CHOR": stompFxKEYS[46],
  	"Phaser #PHAS": stompFxKEYS[47],
  	"Phaser Vibe #PHAS": stompFxKEYS[48],
  	"Phaser Oneway #PHAS": stompFxKEYS[49],
  	"Flanger #FLAN": stompFxKEYS[50],
  	"Flanger Oneway #FLAN": stompFxKEYS[51],
  	"Transpose #PISH": stompFxKEYS[52],
  	"Pedal Pitch #PISH": stompFxKEYS[53],
  	"Pedal Vinyl Stop #PISH": stompFxKEYS[54],
  	"Chromatic Pitch #PISH": stompFxKEYS[55],
  	"Harmonic Pitch #PISH": stompFxKEYS[56],
  	"Analog Octaver #PISH": stompFxKEYS[57],
  	"Single Delay #DEL": stompFxKEYS[58],
  	"Dual Delay #DEL": stompFxKEYS[59],
  	"TwoTap Delay #DEL": stompFxKEYS[60],
  	"Serial TwoTap Delay #DEL": stompFxKEYS[61],
  	"Rhythm Delay #DEL": stompFxKEYS[62],
  	"Quad Delay #DEL": stompFxKEYS[63],
  	"Legacy Delay #DEL": stompFxKEYS[64],
  	"Christal Delay #DEL": stompFxKEYS[65],
  	"Loop pitch Delay #DEL": stompFxKEYS[66],
  	"Freq Shifter Delay #DEL": stompFxKEYS[67],
  	"Dual Chromatic #DEL": stompFxKEYS[68],
  	"Dual Harmonic #DEL": stompFxKEYS[69],
  	"Dual Crystal #DEL": stompFxKEYS[70],
  	"Dual Loop Pitch #DEL": stompFxKEYS[71],
  	"Melody Chromatic #DEL": stompFxKEYS[72],
  	"Melody Harmonic #DEL": stompFxKEYS[73],
  	"Quad Chromatic #DEL": stompFxKEYS[74],
  	"Quad Harmonic #DEL": stompFxKEYS[75],
  	"Spring Reverb #REV": stompFxKEYS[76],
  	"Natural Reverb #REV": stompFxKEYS[77],
  	"Easy Reverb #REV": stompFxKEYS[78],
  	"Echo Reverb #REV": stompFxKEYS[79],
  	"Cirrus Reverb #REV": stompFxKEYS[80],
  	"Formant Reverb #REV": stompFxKEYS[81],
  	"Ionosphere Reverb #REV": stompFxKEYS[82],
  	"Space #REV": stompFxKEYS[83],
  	"Legacy Reverb #REV": stompFxKEYS[84],
  	"Loop Mono #FXLO": stompFxKEYS[85],
  	"Loop Stereo #FXLO": stompFxKEYS[86],
  	"Loop Distortion #FXLO": stompFxKEYS[87]
}
					 

const adrIdToKemp = {				 //labeled kemp means a global control always visible 
	"04 01": "/kempRigVol",	 
    "0a 04": "/kempGainVol",
    "0b 04": "/kempBassVol",	
	"0b 05": "/kempMidVol",	
    "0b 06": "/kempTrebVol",	
    "0b 07": "/kempPresVol",	
    "09 03": "/kempNoiseGate",
	"09 04": "/kempCleanSense",
	"09 05": "/kempDistortionSense",
	"00 01": "/kempRigname",
	"00 02": "/kempAuthname",
	"00 04": "/kempProfile",
	"00 10": "/kempAmpname",
	"7f 00": "/kempMainOutVol",
	"7f 01": "/kempHeadVol",    //output section view only
	"7f 02": "/kempMonOutVol",
	"7f 03": "/kempDirOutVol",
	"7f 04": "/kempSpdifVol",
	"04 40": "/rigSection1",  //Stomps  -> rigSection is needed to switch on/off of fx or the whole Section "Stomps, Stack, Effects"
	"32 03": "/rigSection1A", //StompFx A
	"33 03": "/rigSection1B", //StompFx B
	"34 03": "/rigSection1C", //StompFx C
	"35 03": "/rigSection1D", //StompFx D
	"04 41": "/rigSection2",  //Stacks
	"0a 02": "/rigSection2P",  //amplifier
	"0b 02": "/rigSection2Q",  //EQ
	"0c 02": "/rigSection2F", //Cabinet
	"04 42": "/rigSection3",  //Effects
	"38 03": "/rigSection1X",
	"3a 03": "/rigSection1M",
	"3c 03": "/rigSection1E",
	"3d 03": "/rigSection1R"
	

} || {};	


//hex identifer per fx to update the kemper
const fxIdentHex = {
  	[stompFxKEYS[0]]: ["",""],
   	[stompFxKEYS[1]]: ["08","09","0a","34","0c","04","35","06",
					  "Manual", "Peak", "Pedal Range", "Peak Range","Pedal Mode", "Mix", "Ducking", "Volume"],							//"Wah Wah"
   	[stompFxKEYS[2]]: ["08","09","0a","34","0c","04","35","0d","0e","0f","06",
					  "Manual", "Peak", "Pedal Range", "Peak Range","Pedal Mode" , "Mix", "Ducking","Touch Attack","Touch Release","Touch Boost", "Volume"] ,			//"Wah Low Pass"
   	[stompFxKEYS[3]]: ["08","09","0a","34","0c","04","35","06",
					  "Manual", "Peak", "Pedal Range", "Peak Range","Pedal Mode", "Mix", "Ducking", "Volume"],							//...
   	[stompFxKEYS[4]]: ["08","09","0a","34","0c","04","35","06",
					  "Manual", "Peak", "Pedal Range", "Peak Range","Pedal Mode", "Mix", "Ducking", "Volume"],
   	[stompFxKEYS[5]]: ["08","09","0a","34","0c","1a","1b","04","35","06",
					  "Manual", "Peak", "Pedal Range", "Peak Range","Pedal Mode","Spread", "Stages", "Mix", "Ducking", "Volume"	],
   	[stompFxKEYS[6]]: ["08","09","0a","34","0c","04","35","06",
					  "Manual", "Peak", "Pedal Range","Peak Range","Pedal Mode", "Mix", "Ducking", "Volume"],
   	[stompFxKEYS[7]]: ["08","09","0a","34","0c","04","35","06",
					  "Manual", "Peak", "Pedal Range", "Peak Range", "Pedal Mode", "Mix", "Ducking", "Volume"],
   	[stompFxKEYS[8]]: ["08","0a","0c","04","35","06",
					  "Manual", "Pedal Range","Pedal Mode","Mix","Ducking","Volume"],
   	[stompFxKEYS[9]]: ["08","0a","0c","04","35","06",
					  "Manual", "Pedal Range", "Pedal Mode", "Mix", "Ducking","Volume"],
   	[stompFxKEYS[10]]: ["08","0a","39","0c","04","35","0d","0e","0f","06",
					   "Manual", "Pedal Range","Pitch Shift", "Pedal Mode", "Mix","Ducking","Touch Attack","Touch Release","Touch Boost", "Volume"],
   	[stompFxKEYS[11]]: ["10","11","04","06",
					   "Drive", "Tone", "Mix","Volume"],
   	[stompFxKEYS[12]]: ["10","04","06",
					   "Drive","Mix","Volume"],
   	[stompFxKEYS[13]]: ["10","11","04","06",
					   "Drive", "Tone", "Mix","Volume"],
   	[stompFxKEYS[14]]: ["10","11","04","06",
					   "Drive", "Tone", "Mix", "Volume"],
   	[stompFxKEYS[15]]: ["10","11","04","06",
					   "Drive", "Tone", "Mix", "Volume"],
  	[stompFxKEYS[16]]: ["10","11","04","06",
					  "Drive", "Tone", "Mix", "Volume"],
   	[stompFxKEYS[17]]: ["10","04","06",
					   "Drive","Mix","Volume"],
  	[stompFxKEYS[18]]: ["10","04","06",
					  "Drive", "Mix", "Volume"],
   	[stompFxKEYS[19]]: ["10","11","15","17","04","06",
					   "Drive","Tone","Definition","Slim Down","Mix","Volume"],
   	[stompFxKEYS[20]]: ["11","04","35","06",
					   "Tone","Mix","Ducking","Volume"],
   	[stompFxKEYS[21]]: ["11","04","35","06",
					   "Tone","Mix","Ducking","Volume"],
   	[stompFxKEYS[22]]: ["06",
					   "Volume"],
   	[stompFxKEYS[23]]: ["0a","06",
					   "Pedal Range","Volume"],
   	[stompFxKEYS[24]]: ["10","11","06",
					   "Drive", "Tone", "Volume"],
   	[stompFxKEYS[25]]: ["10","35","06",
					   "Drive", "Ducking", "Volume"],
   	[stompFxKEYS[26]]: ["10","06",
					   "Drive","Volume"],
   	[stompFxKEYS[27]]: ["10","06",
					   "Drive","Volume"],
  	[stompFxKEYS[28]]: ["10","06",
					  "Drive","Volume"],
  	[stompFxKEYS[29]]: ["22","23","24","25","26","27","28","29","43","44","06","04","35",
					  "80 Hz", "160 Hz", "320 Hz", "640Hz", "1250 Hz", "2500 Hz", "5000 Hz", "10 000 Hz", "Low Cut", "High Cut", "Volume", "Mix", "Ducking"],
  	[stompFxKEYS[30]]: ["2a","2b","2c","2d","2e","2f","30","31","32","33","43","44","06","04","35",
					  "Low Gain", "Low Freq", "High Gain", "High Freq", "Mid1 Gain", "Mid1 Freq", "Mid1 Q-Factor", "Mid2 Gain", "Mid2 Freq", "Mid2 Q-Factor", "Low Cut", "high Cut", "Volume", "Mix", "Ducking"],
   	[stompFxKEYS[31]]: ["2a","2e","2f","2c","43","44","06","04","35",
					   "Low", "Middle", "Mid Frequency", "High", "Low Cut", "High Cut", "Volume", "Mix", "Ducking"], 
 	[stompFxKEYS[32]]: ["31","2a","2e","2c",
					 "Pickup", "Body", "Bronze", "Sparkle"],
   	[stompFxKEYS[33]]: ["15","14","35",
					   "Intensity", "Tune", "Ducking"],
  	[stompFxKEYS[34]]: ["15",
					  "Intensity"], 
  	[stompFxKEYS[35]]: ["15",
					  "Intensity"], 
  	[stompFxKEYS[36]]: ["12","13","21","04","06",
					  "Intensity", "Attack", "Squash", "Mix", "Volume"], 
   	[stompFxKEYS[37]]: ["14","12",
					   "Swell", "Compressor"],
 	[stompFxKEYS[38]]: ["12",
					 "Compressor"],
  	[stompFxKEYS[39]]: ["12",
					  "Compressor"],
   	[stompFxKEYS[40]]: ["14","15","17","04","35","06",
					   "Rate", "Depth","Crossover", "Mix","Ducking", "Volume"],
  	[stompFxKEYS[41]]: ["15","18","17","04","35","06",
					  "Depth", "Amount","Crossover","Mix","Ducking","Volume"],
   	[stompFxKEYS[42]]: ["15","17","06",
					   "Depth", "Crossover", "Volume"],
   	[stompFxKEYS[43]]: ["15","17","04","35","06",
					   "Detune", "Crossover", "Mix", "Ducking", "Volume"],
    [stompFxKEYS[44]]: ["14","15","17","35","06",
						"Rate", "Depth", "Crossover", "Ducking", "Volume"],
   	[stompFxKEYS[45]]: ["1f","20","04","35","06",
					   "Distance", "Low-High-Bal.", "Mix", "Ducking", "Volume"],
    [stompFxKEYS[46]]: ["14","15","17","35","06",
						"Rate", "Depth", "Crossover", "Ducking", "Volume"],
    [stompFxKEYS[47]]: ["14","15","19","16","1a","1b","04","35","06",
						"Rate", "Depth", "Manual", "Feedback", "Peak Spread", "Stages", "Mix", "Ducking", "Volume"],
    [stompFxKEYS[48]]: ["14","15","19","16","1a","1b","04","35","06",
						"Rate", "Depth", "Manual", "Feedback", "Peak Spread", "Stages", "Mix", "Ducking", "Volume"],
   	[stompFxKEYS[49]]: ["49","15","19","16","1a","1b","04","35","06",
					    "Rate", "Depth", "Manual", "Feedback", "Peak Spread", "Stages", "Mix", "Ducking", "Volume"],
   	[stompFxKEYS[50]]: ["14","15","19","16","04","35","06",
					   "Rate", "Depth", "Manual", "Feedback",  "Mix", "Ducking", "Volume"],
   	[stompFxKEYS[51]]: ["49","15","19","16","04","35","06",
					   "Rate", "Depth", "Manual", "Feedback",  "Mix", "Ducking", "Volume"],
    [stompFxKEYS[52]]: ["38",
						"Pitch"],
   	[stompFxKEYS[53]]: ["39","38","04","35","06",
					   "Heel Pitch","Toe Pitch","Mix","Ducking","Volume"],
    [stompFxKEYS[54]]: ["04","06",
						"Mix","Volume"],
    [stompFxKEYS[55]]: ["38","39","3a","42","37","36","35","06",
						"Voice1 Pitch", "Voice2 Pitch", "Detune", "Formant Shift", "Voice Balance", "Mix", "Ducking", "Volume"],
    [stompFxKEYS[56]]: ["3e","3f","40","42","37","36","35","06",
						"Voice1 Interval", "Voice2 Interval", "key", "Formant Shift", "Voice Balance", "Mix", "Ducking", "Volume"],
   	[stompFxKEYS[57]]: ["37","36","17","35","06",
					   "Voice Balance", "Mix", "Low Cut", "Ducking", "Volume"],
   	[stompFxKEYS[58]]: ["45","4c","5d","6a","62","63","66","65","67","68","69","35",
					   "Mix", "Note Value", "Feedback", "Reverse Mix", "Low Cut", "High Cut", "Chorus", "Modulation", "Flutter Intensity", "Flutter Rate", "Grit", "Ducking"],
    [stompFxKEYS[59]]: ["45","4c","4d","37","5d","60","62","63","6a","66","0f","65","67","68","69","6b","6c","35",
						"Mix", "Note Value 1", "Note Value 2", "Delay Balance", "Feedback 1", "Feedback 2", "Low Cut", "High Cut", "Reverse Mix", "Chorus", "Cross Feedback", "Modulation", "Flutter Intensity", "Flutter Rate", "Grit", "Input Swell", "Smear", "Ducking"],   
    [stompFxKEYS[60]]: ["45","4c","4d","5d","62","63","6a","65","67","68","69","6b","6c","66","35",
						"Mix", "Note Value 1", "Note Value 2", "Feedback", "Low Cut", "High Cut", "Reverse Mix", "Modulation", "Flutter Intensity", "Flutter Rate", "Grit", "Input Swell", "Smear", "Chorus", "Ducking"],  
   	[stompFxKEYS[61]]: ["45","4c","4d","5d","36","4e","60","62","63","6a","65","67","68","69","6b","6c","66","35",
					   "Mix", "Note Value 1", "Note Value 2", "Feedback", "Mix Serial", "Note Val. Serial", "Feedback Serial", "Low Cut", "High Cut", "Reverse Mix", "Modulation", "Flutter Intensity","Flutter Rate","Grit","Input Swell","Smear","Chorus", "Ducking"	], 
    [stompFxKEYS[62]]: ["45","5d","62","63","4f","4e","4d","4c","54","53","52","51","58","57","56","55","65","67","68","35",
						"Mix", "Feedback", "Low Cut", "High Cut", "Note Value 1", "Note Value 2", "Note Value 3", "Note Value 4", "Volume 1", "Volume 2", "Volume 3", "Volume 4", "Panorama 1", "Panorama 2", "Panorama 3", "Panorama 4", "Modulation", "Flutter Intensity", "Flutter Rate"],   
    [stompFxKEYS[63]]: ["45","5d","62","63","4f","4e","4d","4c","54","53","52","51","58","57","56","55","65","0f","67","68","35",
						"Mix", "Feedback", "Low Cut", "High Cut", "Note Value 1", "Note Value 2", "Note Value 3", "Note Value 4", "Volume 1", "Volume 2", "Volume 3", "Volume 4", "Panorama 1", "Panorama 2", "Panorama 3", "Panorama 4", "Modulation", "Cross Feedback","Flutter Intensity","Flutter Rate","Ducking" 	],      
   	[stompFxKEYS[64]]: ["45","4c","4d","5d","13","21","65","35",
					   "Mix", "Note Value 1", "Note Value 2", "Feedback", "Bandwith", "Frequency", "Modulation", "Ducking"],      
   	[stompFxKEYS[65]]: ["45","4c","4d","5d","36","59","3a","62","63","6a","65","67","68","69","6b","6c","66","35",
					   "Mix", "Note Value 1", "Note Value 2", "Feedback", "Crystal Mix", "Crystal Pitch", "Pitch Detune", "Low Cut", "High Cut", "Reverse Mix", "Modulation", "Flutter Intensity", "Flutter Rate", "Grit", "Input Swell", "Smear", "Chorus", "Ducking"],    
    [stompFxKEYS[66]]: ["45","4c","4d","5d","36","59","3a","62","63","6a","65","67","68","69","6b","6c","66","35",
					    "Mix", "Note Value 1", "Note Value 2", "Feedback", "Pitch Mix", "Pitch", "Pitch Detune", "Low Cut", "High Cut", "Reverse Mix", "Modulation", "Flutter Intensity", "Flutter Rate", "Grit", "Input Swell", "Smear", "Chorus", "Ducking"],    
    [stompFxKEYS[67]]: ["45","4c","4d","5d","04","08","62","63","6a","65","67","68","69","6b","6c","66","35",
						"Mix", "Note Value 1", "Note Value 2", "Feedback", "Frequency Mix", "Pitch", "Low Cut", "High Cut", "Reverse Mix", "Modulation", "Flutter Intensity", "Flutter Rate", "Grit", "Input Swell", "Smear", "Chorus","Ducking"],    
    [stompFxKEYS[68]]: ["45","4c","4d","37","5d","60","62","63","38","39","3a","42","6a","66","0f","65","67","68","6b","6c","35",
						"Mix", "Note Value 1", "Note Value 2", "Delay Balance", "Feedback 1", "Feedback 2", "Low Cut", "High Cut", "Delay1 Pitch", "Delay2 Pitch", "Pitch Detune","Formant Shift", "Reverse Mix", "Chorus", "Cross Feedback", "Modulation", "Flutter Intensity", "Flutter Rate", "Input Swell", "Smear", "Ducking"],    
   	[stompFxKEYS[69]]: ["45","4c","4d","37","5d","60","62","63","3e","3f","40","42","6a","66","0f","65","67","68","6b","6c","35",
					   "Mix", "Note Value 1", "Note Value 2", "Delay Balance", "Feedback 1", "Feedback 2", "Low Cut", "High Cut", "Delay1 Interval", "Delay2 Interval", "Key", "Formant Shift", "Reverse Mix", "Chorus", "Cross Feedback", "Modulation", "Flutter Intensity", "Flutter Rate", "Input Swell", "Smear", "Ducking" ],   
    [stompFxKEYS[70]]: ["45","4c","4d","37","5d","60","62","63","36","38","39","3a","6a","66","0f","65","67","68","6b","6c","35",
						"Mix", "Note Value 1", "Note Value 2", "Delay Balance", "Feedback 1", "Feedback 2", "Low Cut", "High Cut", "Crystal Mix" ,"Crystal1 Pitch","Crystal2 Pitch","Pitch Detune","Reverse Mix","Chorus","Cross Feedback","Modulation","Flutter Intensity","Flutter Rate","Input Swell","Smear","Ducking"],   
    [stompFxKEYS[71]]: ["45","4c","4d","37","5d","60","62","63","36","38","39","3a","6a","66","0f","65","67","68","6b","6c","35",
						"Mix", "Note Value 1", "Note Value 2", "Delay Balance", "Feedback 1", "Feedback 2", "Low Cut", "High Cut", "Pitch Mix", "Delay1 Pitch", "Delay2 Pitch", "Pitch Detune", "Reverse Mix", "Chorus", "Cross Feedback", "Modulation", "Flutter Intensity", "Flutter Rate", "Input Swell", "Smear", "Ducking"],      
    [stompFxKEYS[72]]: ["45","5d","62","63","4f","4e","4d","4c","5a","59","39","38","54","53","52","51","58","57","56","55","65","3a","42","67","68","35",
						 "Mix", "Feedback", "Low Cut", "High Cut", "Note Value 1", "Note Value 2", "Note Value 3", "Note Value 4", "Pitch 1", "Pitch 2", "Pitch 3", "Pitch 4", "Volume 1", "Volume 2", "Volume 3", "Volume 4", "Panorama 1", "Panorama 2", "Panorama 3", "Panorama 4", "Modulation", "Pitch Detune", "Formant Shift", "Flutter Intensity", "Flutter Rate", "Ducking"],      
    [stompFxKEYS[73]]: ["45","5d","62","63","4f","4e","4d","4c","5c","5b","3f","3e","54","53","52","51","58","57","56","55","65","40","42","67","68","35",
						"Mix", "Feedback", "Low Cut", "High Cut", "Note Value 1", "Note Value 2", "Note Value 3", "Note Value 4", "Interval 1", "Interval 2", "Interval 3", "Interval 4", "Volume 1", "Volume 2", "Volume 3", "Volume 4", "Panorama 1", "Panorama 2", "Panorama 3", "Panorama 4", "Modulation", "Key", "Formant Shift", "Flutter Intensity", "Flutter Rate", "Ducking"  ],      
    [stompFxKEYS[74]]: ["45","5d","62","63","4f","4e","4d","4c","5a","59","39","38","54","53","52","51","58","57","56","55","65","3a","42","0f","67","68","35",
						"Mix", "Feedback", "Low Cut", "High Cut", "Note Value 1", "Note Value 2", "Note Value 3", "Note Value 4", "Pitch 1", "Pitch 2", "Pitch 3", "Pitch 4", "Volume 1", "Volume 2", "Volume 3", "Volume 4","Panorama 1","Panorama 2","Parnorama 3","Panorama 4","Modulation","Pitch Detune","Formant Shift","Cross Feedback","Flutter Intensity","Flutter Rate","Ducking"],
    [stompFxKEYS[75]]: ["45","5d","62","63","4f","4e","4d","4c","5c","5b","3f","3e","54","53","52","51","58","57","56","55","65","40","42","0f","67","68","35",
						 "Mix", "Feedback", "Low Cut", "High Cut", "Note Value 1", "Note Value 2", "Note Value 3", "Note Value 4", "Interval 1", "Interval 2", "Interval 3", "Interval 4", "Volume 1", "Volume 2", "Volume 3", "Volume 4", "Panorama 1", "Panorama 2", "Panorama 3", "Panorama 4", "Modulation", "Key", "Formant Shift", "Cross Feedback","Flutter Intensity", "Flutter Rate", "Ducking"],      
    [stompFxKEYS[76]]: ["45","5d","68","69","62","63","44","19","47","35",
						"Mix", "Decay Time", "Dripstone", "Distortion(Dwell)", "Low Decay", "High Decay", "High Cut(Tone)", "Spectral Balance", "Spring Size", "Ducking"],
    [stompFxKEYS[77]]: ["45","5d","47","4d","62","63","44","11","67","68","6b","35",
						"Mix", "Decay Time", "Room Size", "Predelay", "Low Decay", "High Decay", "High Cut", "Mid Frequency", "Modulation", "Early Diffusion", "Input Swell", "Ducking"],
    [stompFxKEYS[78]]: ["45","5d","67","62","63","44",
						"Mix", "Decay Time", "Modulation", "Low Decay", "High Decay", "High Cut"],
   	[stompFxKEYS[79]]: ["45","5d","4d","60","62","63","44","35",
					   "Mix", "Decay Time", "Predelay Time", "Feedback", "Low Decay", "High Decay", "High Cut", "Ducking"	],
   	[stompFxKEYS[80]]: ["45","47","5d","65","62","63","44","11","6b","35",
					   "Mix", "Attack Time", "Decay Time", "Modulation", "Low Decay", "High Decay", "High Cut", "Mid Frequency", "Input Swell", "Ducking"],
    [stompFxKEYS[81]]: ["45","47","5d","65","10","16","19","1a","62","63","44","6b","35",
						"Mix", "Attack Time", "Decay Time", "Modulation", "Formant Mix", "Formant Vowel", "Formant Offset", "Formant Peak", "Low Decay", "High Decay", "High Cut", "Input Swell", "Ducking"],
    [stompFxKEYS[82]]: ["45","47","5d","65","36","38","39","60","10","16","19","1a","62","63","44","69","6b","35",
						"Mix", "Attack Time", "Decay Time", "Modulation", "Pitch Mix", "Pitch 1", "Pitch 2", "Pitch Buildup", "Formant Mix", "Formant Vowel", "Formant Offset", "Formant Peak", "Low Decay", "High Decay", "High Cut", "Brass", "Input Swell", "Ducking"],
    [stompFxKEYS[83]]: ["36",
						"Intensity"],
    [stompFxKEYS[84]]: ["45","5d","1b","48","63","13","21","35",
						"Mix", "Decay time", "Room size", "Predelay", "High damp", "Bandwith", "Mid frequency", "Ducking"],
    [stompFxKEYS[85]]: ["04","35","06",
						"Mix", "Ducking", "Volume" ],
    [stompFxKEYS[86]]: ["04","35","06",
						"Mix", "Ducking", "Volume" ],
    [stompFxKEYS[87]]: ["06",
						"Volume"],              
   
   	"0c 04": ["04","05","06","07",
			 "High Shift","Low Shift","Character","Pure Cabinet"],										//cab fx hex identifier
   	"0a 06": ["06","08","09","0a","07","0b","0c","0f","03",
   			 "Definition","Power Sagging","Pick","Compressor","Clarity","Tube Shape","Tube Bias","Direct Mix","Volume"	],				//amp fx hex identifier
   
   	"04 40": ["36"],
   	"09 00" : ["03","04","05",
	   		   "Noise Gate","Clean Sense","Distortion Sense"],					//input labels not used, just for completeness 
   	"0b 00" : ["04","05","06","07",
			  "Bass Volume","Mid Volume","Treb Volume","Pres Volume"]			//EQ Section, labels not used, just for completeness
   
  //  "0c 05": ["High Shift","Low Shift","Character","Pure Cabinet"],		//CAB FX
  //"0c 06": ["High Shift","Low Shift","Character","Pure Cabinet"],		//CAB FX
  //"0c 07": ["High Shift","Low Shift","Character","Pure Cabinet"],		//CAB FX
  //"04 40": ["Intensity"]
      
} || {};


// hex id + id from stompFxKEYS where a extended string req should be sent. e.g. 47 01 36 -> attack time of formant reverb, 5d 01 36 decay time of formant reverb
const reqStrValue = {
	"0c 00 01": [4],           //pedal mode , value is the value knobs id    
  	"0c 00 02": [4],
  	"0c 00 03": [4],
  	"0c 00 04": [4],
  	"0c 00 06": [4],
  	"0c 00 07": [4],
  	"0c 00 08": [4],
  	"0c 00 09": [2],
  	"0c 00 0a": [2],
  	"0c 00 0c": [3],
  	"43 00 61": [8],
  	"44 00 61": [9],
  	"0c 00 0c": [3],
  	"2b 00 62": [1],
  	"2d 00 62": [3],
  	"2f 00 62": [5],
  	"30 00 62": [6],
  	"32 00 62": [8],
  	"33 00 62": [9],
  	"43 00 62": [10],
  	"44 00 62": [11],
  	"2f 00 63": [2],
  	"43 00 63": [4],
  	"44 00 63": [5],
  	"17 00 41": [2],
  	"17 00 42": [2],
  	"17 00 43": [1],
  	/*"15 00 43":[0],*/
  	/*"15 00 47": [0],*/    //micro pitch detune as extended str. request 
  	"17 00 47": [1],
  	/*"15 00 44": [1],*/    //vibrato depth
  	"17 00 44": [2],
  	"1f 00 45": [0],
  	/*"14 00 46": [0],*/  	//tremolo rate	
  	"15 00 46": [1],   //tremolo depth 
  	"17 00 46": [2],
  	/*"14 00 51": [0],*/    //phaser rate
  	/*"14 00 52": [0],*/    //phaser vibe rate
  	/*"14 00 59": [0],*/ //flanger rate
  	/*"3a 01 02": [2],*/ //chromatic pitch detune
  	"3e 01 03": [0],
  	"3f 01 03": [1],
  	"40 01 03": [2],
  	"45 01 12": [0],
  	"4c 01 12": [1],
  	"62 01 12": [4],
  	"63 01 12": [5],
  	"45 01 13": [0],
  	"4c 01 13": [1],
  	"4d 01 13": [2],
  	"62 01 13": [6],
  	"63 01 13": [7],
  	"45 01 14": [0],
  	"4c 01 14": [1],
  	"4d 01 14": [2],
  	"62 01 14": [4],
  	"63 01 14": [5],
  	"45 01 15": [0],
  	"4c 01 15": [1],
  	"4d 01 15": [2],
  	"4e 01 15": [5],
  	"62 01 15": [7],
  	"63 01 15": [8],
  	"45 01 21": [0],
  	"62 01 21": [2],
  	"63 01 21": [3],
  	"4f 01 21": [4],
  	"4e 01 21": [5],
  	"4d 01 21": [6],
  	"45 01 24": [0],
  	"62 01 24": [2],
  	"63 01 24": [3],
  	"4f 01 24": [4],
  	"4e 01 24": [5],
  	"4d 01 24": [6],
  	"4c 01 24": [7],
  	"45 01 11": [0],
  	"4c 01 11": [1],
  	"4d 01 11": [2],
  	"45 01 16": [0],
  	"4c 01 16": [1],
  	"4d 01 16": [2],
  /*	"3a 01 16": [6],*/ //crystal delay pitch detune
  	"62 01 16": [7],
  	"63 01 16": [8],
  	"45 01 17": [0],
  	"4c 01 17": [1],
  	"4d 01 17": [2],
  /*	"3a 01 17": [6],*/ //loop pitch delay pitch detune
  	"62 01 17": [7],
  	"63 01 17": [8],
  	"45 01 18": [0],
  	"4c 01 18": [1],
  	"4d 01 18": [2],
  	"62 01 18": [6],
  	"63 01 18": [7],
  	"45 01 09": [0],
  	"4c 01 09": [1],
  	"4d 01 09": [2],
  	"62 01 09": [6],
  	"63 01 09": [7],
  	"3a 01 09": [10],
  	"45 01 0a": [0],
  	"4c 01 0a": [1],
  	"4d 01 0a": [2],
  	"62 01 0a": [6],
  	"63 01 0a": [7],
  	"3e 01 0a": [8],
  	"3f 01 0a": [9],
  	"40 01 0a": [10],
  	"45 01 0b": [0],
  	"4c 01 0b": [1],
  	"4d 01 0b": [2],
  	"62 01 0b": [6],
  	"63 01 0b": [7],
  /*	"3a 01 0b": [11],*/ //dual crystal pitch detune
  	"45 01 0c": [0],
  	"4c 01 0c": [1],
  	"4d 01 0c": [2],
  	"62 01 0c": [6],
  	"63 01 0c": [7],
  	/*"3a 01 0c": [11],*/ //dual loop pitch pitch detune
  	"45 01 22": [0],
  	"62 01 22": [2],
  	"63 01 22": [3],
  	"4f 01 22": [4],
  	"4e 01 22": [5],
  	"4d 01 22": [6],
  	"4c 01 22": [7],
  	"45 01 23": [0],
  	"62 01 23": [2],
  	"63 01 23": [3],
  	"4f 01 23": [4],
  	"4e 01 23": [5],
  	"4d 01 23": [6],
  	"4c 01 23": [7],
  	"5c 01 23": [8],
  	"5b 01 23": [9],
  	"3f 01 23": [10],
  	"3e 01 23": [11], 
  	"40 01 23": [21],
  	"45 01 25": [0],
  	"62 01 25": [2],
  	"63 01 25": [3],
  	"4f 01 25": [4],
  	"4e 01 25": [5],
  	"4d 01 25": [6],
  	"4c 01 25": [7],
  /*	"3a 01 25": [21],*/ // quad chromatic pitch detune
  	"45 01 26": [0],
  	"62 01 26": [2],
  	"63 01 26": [3],
  	"4f 01 26": [4],
  	"4e 01 26": [5],
  	"4d 01 26": [6],
  	"4c 01 26": [7],
  	"5c 01 26": [8],
  	"5b 01 26": [9],
  	"3f 01 26": [10],
  	"3e 01 26": [11],  
  	"40 01 26": [21],
  	"45 01 41": [0],
  	/*"5d 01 41": [1],*/		//spring reverb decay time
  	"44 01 41": [6],
  	"45 01 32": [0],
  	/*"5d 01 32": [1],*/		//natural reverb decay time
  	"4d 01 32": [3],
  	"44 01 32": [6],
  	"45 01 33": [0],
  	/*"5d 01 33": [1],*/		//easy reverb decay time
  	"44 01 33": [5],
  	"45 01 34": [0],
  	/*"5d 01 34": [1],*/		//echo reverb decay time
  	"4d 01 34": [2],
  	"44 01 34": [6],
  	"45 01 35": [0],
  	/*"47 01 35": [1],*/
  	/*"5d 01 35": [2],*/		//cirrus reverb decay time
  	"45 01 36": [0],
 	/* "47 01 36": [1],
  	"5d 01 36": [2],*/
  	/*"44 01 36": [10],*/		//formant reverb high cut
  	"45 01 37": [0],
  	/*"47 01 37": [1],*/
  	/*"5d 01 37": [2],*/		//ionosphere reverb decay time
  	/*"44 01 37": [14],*/		//ionosphere reverb high cut
  	"45 01 31": [0],
  	/*"5d 01 31": [1],*/		//legacy reverb decay time
  	"1b 01 31": [2]  
};	

const fxStompIdent = {  //fx differ just per stomp, all stomps are equal
   	"32" : "A",	
   	"33" : "B",
   	"34" : "C",
   	"35" : "D",
   	"38" : "X",
   	"3a" : "M",
   	"3c" : "E", 
   	"3d" : "R",
   	"0c" : "F",
   	"0a" : "P",
   	"0b" : "Q",
   	"7f" : "O"
}	


//3 controls per fx, first value is the number of steps of the knob, then starting value, end value for the decimal value
//first row -> number of steps, min value, max value of the gui knobs
//second row-> number of steps, resulting min value , resulting max value for the label -> convert via scalevalue
//e.g. 128 steps, min 0, max 16383 (14 bit hex to number value)
//   -> 128 steps on the gui, min -5, max 5 
const fxControlsKnobSetup = {
  	[stompFxKEYS[0]]: [0],
  	[stompFxKEYS[1]]: [128,0,16383,128,0,16383,128,0, 16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
					   128,0,10, 128,0,10, 128,-100,100,128,-100,100,6,0,5,128,0,100,128,-5,5,128,-5,5] ,
  	[stompFxKEYS[2]]: [128,0,16383,128,0,16383,128,0, 16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
				       128,0,10,128,0,10,128,-100,100,128,-100,100,6,0,5,128,0,100,128,-5,5,128,0,10,128,0,10,128,0,10,128,-5,5],
  	[stompFxKEYS[3]]: [128,0,16383,128,0,16383,128,0, 16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
					   128,0,10,128,0,10,128,-100,100,128,-100,100,6,0,5,128,0,100,128,-5,5,128,-5,5],
  	[stompFxKEYS[4]]: [128,0,16383,128,0,16383,128,0, 16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
					   128,0,10,128,0,10,128,-100,100,128,-100,100,6,0,5,128,0,100,128,-5,5,128,-5,5],
 	[stompFxKEYS[5]]: [128,0,16383,128,0,16383,128,0, 16383,128,0,16383,6,0,5,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
					   128,0,10,128,0,10,128,-100,100,128,-100,100,6,0,5,128,-5,5,6,2,12,128,0,100,128,-5,5,128,-5,5],
 	[stompFxKEYS[6]]: [128,0,16383,128,0,16383,128,0, 16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
					   128,0,10,128,0,10,128,-100,100,128,-100,100,6,0,5,128,0,100,128,-5,5,128,-5,5],
	[stompFxKEYS[7]]: [128,0,16383,128,0,16383,128,0, 16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
					   128,0,10,128,0,10,128,-100,100,128,-100,100,6,0,5,128,0,100,128,-5,5,128,-5,5],
  	[stompFxKEYS[8]]: [128,0,16383, 128,0,16383, 6,0,5, 128,0,16383, 128,0,16383, 128,0,16383,
					   128,-5,5,128,-100,100,6,0,5,128,0,100,128,-5,5,128,-5,5],
  	[stompFxKEYS[9]]: [128,0,16383, 128,0,16383, 6,0,5, 128,0,16383, 128,0,16383, 128,0,16383,
					   128,-5,5,128,-100,100,6,0,5,128,0,100,128,-5,5,128,-5,5],
  	[stompFxKEYS[10]]: [128,0,16383, 128,0,16383,73,28,100 , 6,0,5, 128,0,16383, 128,0,16383,128,0,16383,128,0,16383,128,0,16383, 128,0,16383,
					  	128,-5,5,128,-100,100,73,-36,36,6,0,5,128,0,100,128,-5,5,128,0,10,128,0,10,128,0,10,128,-5,5 ],
  	[stompFxKEYS[11]]: [128,0,16383, 128,0,16383,128,0,16383, 128,0,16383,
					  	128,0,10,128,0,10,128,0,100,128,-5,5],
 	[stompFxKEYS[12]]: [128,0,16383, 128,0,16383,128,0,16383,
					  	128,0,10,128,0,100,128,-5,5],
  	[stompFxKEYS[13]]: [128,0,16383, 128,0,16383,128,0,16383, 128,0,16383,
					  	128,0,10,128,0,10,128,0,100,128,-5,5],
	[stompFxKEYS[14]]: [128,0,16383, 128,0,16383,128,0,16383, 128,0,16383,
					 	128,0,10,128,0,10,128,0,100,128,-5,5],
 	[stompFxKEYS[15]]: [128,0,16383, 128,0,16383,128,0,16383, 128,0,16383,
					 	128,0,10,128,0,10,128,0,100,128,-5,5],
 	[stompFxKEYS[16]]: [128,0,16383, 128,0,16383,128,0,16383, 128,0,16383,
					 	128,0,10,128,0,10,128,0,100,128,-5,5],
  	[stompFxKEYS[17]]: [128,0,16383, 128,0,16383,128,0,16383,
					  	128,0,10,128,0,100,128,-5,5],
  	[stompFxKEYS[18]]: [128,0,16383, 128,0,16383,128,0,16383,
					  	128,0,10,128,0,100,128,-5,5],
  	[stompFxKEYS[19]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
					  	128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,-5,5],
  	[stompFxKEYS[20]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,
					  	128,0,10,128,0,100,128,-5,5,128,-5,5],
  	[stompFxKEYS[21]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,
					  	128,0,10,128,0,100,128,-5,5,128,-5,5],
  	[stompFxKEYS[22]]: [128,0,16383,
					  	128,-5,5],
  	[stompFxKEYS[23]]: [128,0,16383,128,0,16383,
					  	128,-100,100,128,-5,5 ],
 	[stompFxKEYS[24]]: [128,0,16383,128,0,16383,128,0,16383,
					 	128,0,10,128,0,10,128,-5,5],
  	[stompFxKEYS[25]]: [128,0,16383,128,0,16383,128,0,16383,
					    128,0,10,128,-5,5,128,-5,5 ],
 	[stompFxKEYS[26]]: [128,0,16383,128,0,16383,
					  	128,0,10,128,-5,5	],
  	[stompFxKEYS[27]]: [128,0,16383,128,0,16383,
					  	128,0,10,128,-5,5 ],
  	[stompFxKEYS[28]]: [128,0,16383,128,0,16383,
					  	128,0,10,128,-5,5],
  	[stompFxKEYS[29]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,
					  	128,-12,12,128,-12,12,128,-12,12,128,-12,12,128,-12,12,128,-12,12,128,-12,12,128,-12,12,256,20.6,33488,256,20.6,33488,128,-5,5,128,0,100,128,-5,5 ],  
  	[stompFxKEYS[30]]: [128,0,16383,256,0,16383,128,0,16383,256,0,16383,128,0,16383,256,0,16383,256,0,16383,128,0,16383,256,0,16383,256,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,
					  	128,-12,12,256,20.6,33488,128,-12,12,256,20.6,33488,128,-12,12,256,20.6,33488,256,0.1,5,128,-12,12,256,20.6,33488,256,0.1,5,256,20.6,33488,256,20.6,33488,128,-5,5,128,0,100,128,-5,5 ],
  	[stompFxKEYS[31]]: [128,0,16383,128,0,16383,256,0,16383,128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,
					  	128,-12,12,128,-12,12,256,20.6,33488,128,-12,12, 256,20.6,33488, 256,20.6,33488,128,-5,5,128,0,100,128,-5,5	 ],
 	[stompFxKEYS[32]]: [ 128,0,16383,128,0,16383,128,0,16383,128,0,16383,
					  	128,0,10,128,-5,5,128,-5,5,128,-5,5 ],
 	[stompFxKEYS[33]]: [128,0,16383,128,0,16383,128,0,16383,
					 	128,0,10,128,0,10,128,-5,5 ],
 	[stompFxKEYS[34]]: [128,0,16383,
					 	128,0,10],
  	[stompFxKEYS[35]]: [128,0,16383,
					  	128,0,60],
 	[stompFxKEYS[36]]: [128,0,16383, 128,0,16383, 128,0,16383, 128,0,16383, 128,0,16383,
					 	128,0,10,128,0,10,128,-5,5,128,0,100,128,-5,5 ],
 	[stompFxKEYS[37]]: [128,0,16383, 128,0,16383,
					 	128,0,10,128,0,10],
	[stompFxKEYS[38]]: [128,0,16383,
						128,0,10],
	[stompFxKEYS[39]]: [128,0,16383,
						128,0,10],
	[stompFxKEYS[40]]: [128,0,16383,128,0,16383,256,0,16383, 128,0,16383, 128,0,16383, 128,0,16383,
					    128,0,10,128,0,10,256,20.6,33488,128,0,100,128,-5,5,128,-5,5],
  	[stompFxKEYS[41]]: [128,0,16383,128,0,16383,256,0,16383, 128,0,16383, 128,0,16383, 128,0,16383,
						128,0,10,128,2,6,256,20.6,33488,128,0,100,128,-5,5,128,-5,5 ],
  	[stompFxKEYS[42]]: [128,0,16383,256,0,16383,128,0,16383,
						128,0,10,256,20.6,33488,128,-5,5 ],
  	[stompFxKEYS[43]]: [128,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,50,256,20.6,33488,128,0,100,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[44]]: [128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,
						128,0,10,256,0,50, 256,20.6,33488,128,-5,5,128,-5,5 ],
  	[stompFxKEYS[45]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,4,50,128,-100,100,128,0,100,128,-5,5,128,-5,5 ],
  	[stompFxKEYS[46]]: [128,0,16383,128,0,16383,256,0,16383,128,0,16383,128,0,16383,
						128,0,16256,128,0,10,256,20.6,33488,128,-5,5,128,-5,5  ],
  	[stompFxKEYS[47]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
						128,0,127,128,0,10,128,0,10,128,0,100,128,-5,5,6,2,12,128,0,100,128,-5,5,128,-5,5 ],
  	[stompFxKEYS[48]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
						128,0,127,128,0,10,128,0,10,128,0,100,128,-5,5,6,2,12,128,0,100,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[49]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,
						128,0,10,128,0,10,128,-5,5,128,0,100,128,-5,5,6,2,12,128,0,100,128,-5,5,128,-5,5 ],
  	[stompFxKEYS[50]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,127,128,0,10,128,0,10,128,0,100,128,0,100,128,-5,5,128,-5,5  ],
  	[stompFxKEYS[51]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,10,128,0,10,128,-5,5,128,0,100,128,0, 100,128,-5,5,128,-5,5 ],
  	[stompFxKEYS[52]]: [73,28,100,
						73,-36,36 ],
  	[stompFxKEYS[53]]: [73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,
						73,-36,36,73,-36,36,128,0,100,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[54]]: [128,0,16383,128,0,16383,
						128,0,100,128,-5,5],
   	[stompFxKEYS[55]]: [73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						73,-36,36,73,-36,36,128,-50,50,128,-5,5,128,-50,50,128,-50,50,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[56]]: [54,42,95,54,42,95,12,0,11,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						54,0,53,54,0,53,12,0,11,128,-5,5,128,-50,50,128,-50,50,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[57]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,-50,50,128,-50,50,128,0,10,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[58]]: [128,0,16383,21,0,20,128,0,16383,128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,-5,5],
 	[stompFxKEYS[59]]: [128,0,16383,21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,-50,50,128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,-5,5 ],
  	[stompFxKEYS[60]]: [128,0,16383,21,0,20,21,0,20,128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,0,100,256,20.6,33488,256,20.6,33488,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,0,10,128,-5,5 ],
  	[stompFxKEYS[61]]: [128,0,16383,21,0,20,21,0,20,128,0,16383,128,0,16383,21,0,20,128,0,16383, 256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,0,100,128,0,100,21,0,20,128,0,100, 256,20.6,33488,256,20.6,33488,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,0,10,128,-5,5 ],
   	[stompFxKEYS[62]]: [128,0,16383,128,0,16383,256,0,16383,256,0,16383,21,0,20,21,0,20,21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,21,0,20,21,0,20,21,0,20,21,0,20,128,0,10,128,0,10,128,0,10,128,0,10,128,-100,100,128,-100,100,128,-100,100,128,-100,100,128,0,10,128,0,10,128,0,10,128,-5,5 ],
   	[stompFxKEYS[63]]: [128,0,16383,128,0,16383,256,0,16383,256,0,16383,21,0,20,21,0,20,21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,21,0,20,21,0,20,21,0,20,21,0,20,128,0,10,128,0,10,128,0,10,128,0,10,128,-100,100,128,-100,100,128,-100,100,128,-100,100,128,0,10,128,0,10,128,0,10,128,0,10,128,-5,5 ],
   	[stompFxKEYS[64]]: [128,0,16383,21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,0,100,128,0,10,128,-5,5,128,0,10,128,-5,5 ],
  	[stompFxKEYS[65]]: [128,0,16383, 21,0,20,21,0,20,128,0,16383,128,0,16383,73,28,100,128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,0,100,128,0,100,73,-36,36,128,-50,50,256,20.6,33488,256,20.6,33488,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,0,10,128,-5,5],
  	[stompFxKEYS[66]]: [128,0,16383, 21,0,20,21,0,20,128,0,16383,128,0,16383,73,28,100,128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,0,100,128,0,100,73,-36,36,128,-50,50,256,20.6,33488,256,20.6,33488,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,0,10,128,-5,5  ],
   	[stompFxKEYS[67]]: [128,0,16383, 21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,256,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,0,100,128,0,100,128,-5,5,256,20.6,33488,256,20.6,33488,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,0,10,128,-5,5  ],
   	[stompFxKEYS[68]]: [128,0,16383,21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,256,0,16383,256,0,16383,73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,-50,50,128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,73,-36,36,73,-36,36,128,-50,50,128,-5,5,128,0,100, 128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,-5,5 ],
   	[stompFxKEYS[69]]: [128,0,16383,21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,256,0,16383,256,0,16383,53,42,95,53,42,95,12,0,11,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,-50,50,128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,53,42,95,53,42,95,12,0,11,128,-5,5,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,-5,5],
   	[stompFxKEYS[70]]: [128,0,16383,21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,256,0,16383,256,0,16383,128,0,16383,73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,-50,50,128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,128,0,100,73,-36,36,73,-36,36,128,-50,50,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,-5,5],
   	[stompFxKEYS[71]]: [128,0,16383,21,0,20,21,0,20,128,0,16383,128,0,16383,128,0,16383,256,0,16383,256,0,16383,128,0,16383,73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,21,0,20,21,0,20,128,-50,50,128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,128,0,100,73,-36,36,73,-36,36,128,-50,50,128,0,100,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,-5,5 ],
   	[stompFxKEYS[72]]: [128,0,16383,128,0,16383,256,0,16383,256,0,16383,21,0,20,21,0,20,21,0,20,21,0,20,73,28,100,73,28,100,73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,21,0,20,21,0,20,21,0,20,21,0,20,73,-36,36,73,-36,36,73,-36,36,73,-36,36,128,0,10,128,0,10,128,0,10,128,0,10,128,0,100,128,0,100,128,0,100,128,0,100,128,0,10,128,-50,50,128,-5,5,128,0,10,128,0,10,128,-5,5],
   	[stompFxKEYS[73]]: [128,0,16383,128,0,16383,256,0,16383,256,0,16383,21,0,20,21,0,20,21,0,20,21,0,20,73,28,100,73,28,100,73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,12,0,11,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,21,0,20,21,0,20,21,0,20,21,0,20,73,0,72,73,0,72,73,0,72,73,0,72,128,0,10,128,0,10,128,0,10,128,0,10,128,-100,100,128,-100,100,128,-100,100,128,-100,100,128,0,10,12,0,11,128,-5,5,128,0,10,128,0,10,128,-5,5 ],
   	[stompFxKEYS[74]]: [128,0,16383,128,0,16383,256,0,16383,256,0,16383,21,0,20,21,0,20,21,0,20,21,0,20,73,28,100,73,28,100,73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,21,0,20,21,0,20,21,0,20,21,0,20,73,-36,36,73,-36,36,73,-36,36,73,-36,36,128,0,10,128,0,10,128,0,10,128,0,10,128,-100,100,128,-100,100,128,-100,100,128,-100,100,128,0,10,128,-50,50,128,-5,5,128,0,10,128,0,10,128,0,10,128,-5,5],
   	[stompFxKEYS[75]]: [128,0,16383,128,0,16383,256,0,16383,256,0,16383,21,0,20,21,0,20,21,0,20,21,0,20,73,28,100,73,28,100,73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,12,0,11,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0,100,256,20.6,33488,256,20.6,33488,21,0,20,21,0,20,21,0,20,21,0,20,73,0,72,73,0,72,73,0,72,73,0,72,128,0,10,128,0,10,128,0,10,128,0,10,128,-100,100,128,-100,100,128,-100,100,128,-100,100,128,0,10,12,0,11,128,-5,5,128,0,10,128,0,10,128,0,10,128,-5,5 ],
   	[stompFxKEYS[76]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0.2,100,128,-5,5,128,0,10,128,0,10,128,10,0,256,329,33488,128,0,10,128,0,10,128,-5,5 ],
   	[stompFxKEYS[77]]: [128,0,16383,128,0,16383,128,0,16383,21,0,20,128,0,16383,128,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0.2,100,128,0,10,21,0,20,128,0,10,128,0,10,256,329,33488,128,-5,5,128,0,10,128,0,10,128,0,100,128,-5,5],
  	[stompFxKEYS[78]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,256,0,16383,
						128,0,100,128,0.2,100,128,0,10,128,0,10,128,10,0,256,329.6,33488 ],
   	[stompFxKEYS[79]]: [128,0,16383,128,0,16383,21,0,20,128,0,16383,128,0,16383,128,0,16383,256,0,16383,128,0,16383,
						128,0,100,128,0.1,50,21,0,20,128,0,100,128,0,10,128,10,0,256,329.6,33488,128,-5,5 ],
  	[stompFxKEYS[80]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,256,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0.12,4,128,0.4,199,128,0,10,128,0,10,128,10,0,256,329,33488,128,-5,5,128,0,100,128,-5,5 ],
   	[stompFxKEYS[81]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,120,4000,128,400,4000,128,0,10,128,0,10,128,0,100,128,-5,5,128,-5,5,128,0,10,128,0,10,128,0,16383,128,0,100,128,-5,5 ],
   	[stompFxKEYS[82]]: [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,73,28,100,73,28,100,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0.12,4,128,0.4,199,128,0,10,128,0,100,73,-36,36,73,-36,36,128,0,100,128,0,10,128,0,100,128,-5,5,128,-5,5,128,0,10,128,10,0,128,0,16383,128,0,10,128,0,100,128,-5,5],
   	[stompFxKEYS[83]]: [128,0,16383,
						128,0,10 ],
   	[stompFxKEYS[84]]: [128,0,16383,128,0,16383,6,0,5,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,0.4,99,6,0,5,128,0,320,128,10,0,128,0,10,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[85]]: [128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[86]]: [128,0,16383,128,0,16383,128,0,16383,
						128,0,100,128,-5,5,128,-5,5 ],
   	[stompFxKEYS[87]]: [128,0,16383,
						128,-5,5],
  
 	"3c 03": [128,0,10,128,0,10,128,-5,5,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,-12,12,					//to check
  		      128,0,10,128,0,10,128,-5,5,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,-12,12 ],	
  	"3d 03": [128,0,10,128,0,10,128,-5,5,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,-12,12,					//to check
			  128,0,10,128,0,10,128,-5,5,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,-12,12 ], 
	"0a 03": [128,0,16383,			//AMP Volume
	      	  128,-12,12],
	"0a 04": [128,0,16383,			//AMP GAIN VOL
	          128,0,10],
	"0a 06": [128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,128,0,16383,		 //AMP all controls
			  128,0,10,128,0,10,128,-5,5,128,0,10,128,0,10,128,0,10,128,0,10,128,0,10,128,-12,12], 
	//"0a 06": [128,0,16383,			//AMP POWER SAGGING
	//			128,0,10],
	"0a 07": [128,0,16383,			//AMP CLARITY
			  128,0,10],
	"0a 08": [128,0,16383,			//AMP PICK
			  128,0,10],
	"0a 09": [128,0,16383,			//AMP COMPRESSOR
			  128,-5,5],
	"0a 0a": [128,0,16383,			
			  128,0,10],
	  
	"0a 0b": [128,0,16383,			//AMP TUBE SHAPE
			  128,0,10],
	"0a 0c": [128,0,16383,			//AMP TUBE BIAS
			  128,0,10],
	"0a 0f": [128,0,16383,			//AMP DIRECT MIX
			  128,0,10],
	"0b 00": [128,0,16383,128,0,16383,128,0,16383,128,0,16383, 
			  128,-5,5,128,-5,5,128,-5,5,128,-5,5], 	
	"0b 04": [128,0,16383,
			  128,-5,5],				//EQ BASS VOL
  	"0b 05": [128,0,16383,
			  128,-5,5],				//EQ MID VOL
  	"0b 06": [128,0,16383,
			  128,-5,5],				//EQ TREB VOL
  	"0b 07": [128,0,16383,
			  128,-5,5],				//EQ PRES VOL
   
  	"0c 04": [128,0,16383,128,0,16383,128,0,16383,128,0,16383,		//CAB HIGH SHIFT
			  128,-5,5,128,-5,5,128,-5,5,128,0,10],		
  	"0c 05": [128,0,16383,											//CAB LOW SHIFT
			  128,0,10],
  	"0c 06": [128,0,16383,											//CAB CHARACTER
			  128,0,10],
  	"0c 07": [128,0,16383,											//CAB PURE CABINET
			  128,0,10],
	"04 01": [128,0,16383,
			  128,-5,5],
	"04 40": [128,0,16383,
			  128,0,10] , 		 	 
	"7f 00": [128,0,16383,128,0,16383,0,128,0,16383,128,0,16383,
			  128,-100,0,128,-100,0,128,-100,0,2,0,1,128,-5,5,128,-5,5,128,-5,5,128,-5,5,128,-5,5,128,-5,5,128,-5,5,128,-5,5,128,-6,6,2,0,1],
	"7f 01": [128,0,16383,
			  128,-100,0],
	"7f 02": [128,0,16383,
			  128,-100,0],
	"7f 03": [128,0,16383,
			  128,-100,0],
	"7f 04": [128,0,16383,
			  128,-100,0],			
 	"09 03": [128,0,16383,
			  128,0,10],
  	"09 04": [128,0,16383,
			  128,-12,12],
  	"09 05": [128,0,16383,
			  128,-12,12],
  	"09 00": [128,0,16383,128,0,16383,128,0,16383,
			  128,0,10,128,-12,12,128,-12,12], 
 
};	
//depending wheter the values are strings or numbers work with it differently -> when numbers interpolate when in between, ortherwise not
const parsedStr = {
	"15 00 47": [0.0,0.0,0.1,0.1,0.2,0.2,0.3,0.3,0.4,0.4,0.5,0.5,0.6,0.6,0.7,0.7,0.8,0.8,0.9,0.9,1.0,1.0,1.1,1.1,1.2,   //25
		1.2,1.3,1.3,1.4,1.4,1.5,1.5,1.6,1.7,1.8,1.8,1.9,2.0,2.0,2.1,2.2,2.2,2.3,2.4,2.5,2.6,2.7,2.8,2.9,2.9,     //25
		3.0,3.1,3.2,3.3,3.5,3.6,3.7,3.8,4.0,4.1,4.3,4.4,4.6,4.8,4.9,5.1,5.3,5.5,5.7,5.9,6.1,6.3,6.6,6.8,7.1,     //25
		7.3,7.6,7.9,8.2,8.4,8.7,9.0,9.4,9.8,10.1,10.5,10.9,11.2,11.6,12.0,12.5,13.0,13.5,14.0,14.4,14.9,15.4,16.0,16.6,17.3,  //25
		17.9,18.5,19.2,19.9,20.5,21.2,22.1,23.0,23.9,24.7,25.6,26.5,27.4,28.2,29.4,30.5,31.7,32.9,34.1,35.2,36.4,37.5,39.1,40.7,42.2, //
		43.9,45.3,46.4,48.4,50.0],
	"3a 01 02": [-50.0,-46.9,-43.8,-40.7,-37.6,-35.2,-32.9,-30.6,-28.3,-26.5,-24.7,-23.0,-21.2,-19.9,-18.6,-17.3,-16.0,-15.0,-14.0,
			-13.0,-12.0,-11.2,-10.5,-9.8,-9.0,-8.4,-7.9,-7.3,-6.8,-6.3,-5.9,-5.5,-5.1,-4.8,-4.5,-4.2,-3.8,-3.6,-3.3,-3.1,
			-2.9,-2.7,-2.5,-2.3,-2.2,-2.0,-1.9,-1.8,-1.6,-1.5,-1.4,-1.3,-1.2,-1.1,-1.0,-0.9,-0.8,-0.7,-0.6,-0.5,-0.4,-0.3,
			-0.2,-0.2,-0.1,0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.8,1.9,2.0,2.2,2.3,2.5,2.7,
			2.9,3.1,3.3,3.6,3.8,4.1,4.4,4.8,5.1,5.5,5.9,6.3,6.8,7.3,7.9,8.4,9.0,9.8,10.5,11.2,12.0,13.0,14.0,14.9,16.0,17.3,
			18.6,19.9,21.2,23.0,24.7,26.5,28.2,30.6,32.9,35.2,37.6,40.7,43.8,46.9,50.0],
	"14 00 46": ["(1/2) _ _","(1/2) _ _ _","1/2 (_) _ _","1/2 (_) _ _","1/2 _ (_) _ _","1/2 _ (_) _ _","_ _ (_) _ 1/4dot","_ _ (_) _ 1/4dot","_ _ (_) 1/4dot _","_ _ (_) 1/4dot _",
				"_ _ (1/4dot) _ 1/2trip","_ _ (1/4dot) _ 1/2trip","_ 1/4dot (_) 1/2trip _","_ 1/4dot (_) 1/2trip _","1/4dot _ (1/2trip) _ _","1/4dot _ (1/2trip) _ _","_ 1/2trip (_) _ _","_ 1/2trip (_) _ _",
				"1/2trip _ (_) _ _","1/2trip _ (_) _ _","_ _ (_) _ 1/4","_ _ (_) _ 1/4","_ _ (_) 1/4 _","_ _ (_) 1/4 _","_ _(1/4) _ _","_ _(1/4) _ _","_ 1/4 (_) _ _","_ 1/4 (_) _ _","1/4 _ (_) _ _","1/4 _ (_) _ _",
				"_ _ (_) _ 1/8dot","_ _ (_) _ 1/8dot","_ _ (_) 1/8dot _","_ _ (_) 1/8dot _","_ _ (1/8dot) _ 1/4trip","_ _ (1/8dot) _ 1/4trip","_ 1/8dot (_) 1/4trip _","_ 1/8dot (_) 1/4trip _",
				"1/8dot _ (1/4trip) _ _","1/8dot _ (1/4trip) _ _","_ 1/4trip (_) _ _","_ 1/4trip (_) _ _","1/4trip _ (_) _ _","1/4trip _ (_) _ _","_ _ (_) _ 1/8","_ _ (_) _ 1/8","_ _ (_) 1/8 _","_ _ (_) 1/8 _",
				"_ _ (1/8) _ _","_ _ (1/8) _ _","_ 1/8 (_) _ _","_ 1/8 (_) _ _","1/8 _ (_) _ _","1/8 _ (_) _ _","_ _ (_) _ 1/16dot","_ _ (_) _ 1/16dot","_ _ (_) 1/16dot _ ","_ _ (_) 1/16dot _ ","_ _ (1/16dot) _ 1/8trip","_ _ (1/16dot) _ 1/8trip",
				"_ 1/16dot (_) 1/8trip _","_ 1/16dot (_) 1/8trip _","1/16dot _ (1/8trip) _ _","1/16dot _ (1/8trip) _ _",
				"_ 1/8trip (_) _ _","_ 1/8trip (_) _ _","1/8trip _ (_) _ _","1/8trip _ (_) _ _","_ _ (_) _ 1/16","_ _ (_) _ 1/16","_ _ (_) 1/16 _","_ _ (_) 1/16 _","_ _ (1/16) _ _","_ _ (1/16) _ _","_ 1/16 (_) _ _","_ 1/16 (_) _ _",
				"1/16 _ (_) _ _","1/16 _ (_) _ _","_ _ (_) _ 1/32dot","_ _ (_) _ 1/32dot","_ _ (_) 1/32dot _","_ _ (_) 1/32dot _","_ _ (1/32dot) _ 1/16trip","_ _ (1/32dot) _ 1/16trip","_ 1/32dot (_) 1/16trip _","_ 1/32dot (_) 1/16trip _",
				"1/32dot _  (1/16trip) _ _","1/32dot _  (1/16trip) _ _","_ 1/16trip (_) _ _","_ 1/16trip (_) _ _","1/16trip _ (_) _ _","1/16trip _ (_) _ _","_ _ (_) _ 1/32","_ _ (_) _ 1/32","_ _ (_)1/32 _","_ _ (_)1/32 _",
				"_ _ (1/32) _ _","_ _ (1/32) _ _","_ 1/32 (_) _ _","_ 1/32 (_) _ _","1/32 _ (_) _ _","1/32 _ (_) _ _","_ _ (_) _ 1/64dot","_ _ (_) _ 1/64dot","_ _ (_) 1/64dot _","_ _ (_) 1/64dot _","_ _ (1/64dot) _ 1/32trip","_ _ (1/64dot) _ 1/32trip",
				"_ 1/64dot (_) 1/32trip _","_ 1/64dot (_) 1/32trip _","1/64dot _ (1/32trip) _ _","1/64dot _ (1/32trip) _ _","_ 1/32trip (_) _ _","_ 1/32trip (_) _ _","1/32trip _ (_) _ _","1/32trip _ (_) _ _","_ _ (_) _ 1/64","_ _ (_) _ 1/64",
				"_ _ (_) 1/64 _","_ _ (_) 1/64 _","_ _ (1/64) _ _","_ _ (1/64) _ _","_ 1/64 (_) _ _","_ 1/64 (_) _ _","1/64 _ (_) _ _","1/64 _ (_) _ _","1/64_ _ (_) _","1/64_ _ (_) _","1/64 _ _ (_)"],
	"14 00 59": ["min 32.0 Bars","30.2 Bars","28.6 Bars","27.0 Bars","25.4 Bars","24.0 Bars","22.6 Bars","21.4 Bars","20.2 Bars","19.1 Bars","18.0 Bars",
			"17.0 Bars","16.0 Bars","15.1 Bars","14.3 Bars","13.5 Bars","12.7 Bars","12.0 Bars","11.3 Bars","10.7 Bars","10.1 Bars","9.5 Bars","9.0 Bars",
			"8.5 Bars","8.0 Bars","7.6 Bars","7.1 Bars","6.7 Bars","6.3 Bars","6.0 Bars","5.7 Bars","5.3 Bars","5.0 Bars","4.8 Bars","4.5 Bars","4.2 Bars",
			"4.0 Bars","3.8 Bars","3.6 Bars","3.4 Bars","3.2 Bars","3.0 Bars","2.8 Bars","2.7 Bars","2.5 Bars","2.4 Bars","2.2 Bars","2.1 Bars","_ _ (2/1) _ _",
			"_ 2/1 (_) _ _","2/1 _ (_) _ _","_ _ (_) _ 1/1dot","_ _ (_) 1/1dot _","_ _ (1/1dot) _ 2/1trip","_  1/1dot (_) 2/1trip _","1/1dot _ (2/1trip) _ _","_ 2/1trip (_) _ _",
			"2/1trip _ (_) _ _","_ _ (_) _ 1/1","_ _ (_) 1/1 _","_ _ (1/1) _ _","_ 1/1 (_) _ _","1/1 _ (_) _ _","_ _ (_) _ 1/2dot","_ _ (_) 1/2dot _","_ _ (1/2dot) _ 1/1trip",
			"_ 1/2dot (_) 1/1trip _","1/2dot _ (1/1trip) _ _","_ 1/1trip (_) _ _","1/1trip _ (_) _ _","_ _ (_) _ 1/2","_ _ (_) 1/2 _","_ _ (1/2) _ _","_ 1/2 (_) _ _","1/2 _ (_) _ _",
			"_ _ (_) _ 1/4dot","_ _ (_) 1/4dot _","_ _ (1/4dot) _ 1/2trip","_ 1/4dot (_) 1/2trip _","1/4dot _ (1/2trip) _ _","_ 1/2trip (_) _ _","1/2trip _ (_) _ _","_ _ (_) _ 1/4",
			"_ _ (_) 1/4 _","_ _ (1/4) _ _","_ 1/4 (_) _ _","1/4 _ (_) _ _","_ _ (_) _ 1/8dot","_ _ (_) 1/8dot _","_ _ (1/8dot) _ 1/4trip","_ 1/8dot (_) 1/4trip _","1/8dot _ (1/4trip) _ _",
			"_ 1/4trip (_) _ _","1/4trip _ (_) _ _","_ _ (_) _ 1/8","_ _ (_) 1/8 _","_ _ (1/8) _ _","_ 1/8 (_) _ _","1/8 _ (_) _ _","_ _ (_) _ 1/16dot","_ _ (_) 1/16dot _","_ _ (1/16dot) _ 1/8trip",
			"_ 1/16dot (_) 1/8trip _","1/16dot _ (1/8trip) _ _","_ 1/8trip (_) _ _","1/8trip _ (_) _ _","_ _ (_) _ 1/16","_ _ (_) 1/16 _","_ _ (1/16) _ _","_ 1/16 (_) _ _","1/16 _ (_) _ _",
			"_ _ (_) _ 1/32dot","_ _ (_) 1/32dot _","_ _ (1/32dot) _ 1/16trip","_ 1/32dot (_) 1/16trip _","1/32dot _ (1/16trip) _ _","_ 1/16trip (_) _ _","1/16trip _ (_) _ _","_ _ (_) _ 1/32",
			"_ _ (_) 1/32 _","_ _ (1/32) _ _","_ 1/32 (_) _ _","1/32 _ (_) _ _","_ _ (_) _ 1/64dot","_ _ (_) 1/64dot _","_ _ (1/64dot) _ 1/32trip","_ 1/64dot (_) 1/32trip _","_ (1/32trip)"],		
	"5d 01 41": [0.200,0.250,0.300,0.350,0.400,0.420,0.450,0.470,0.500,	0.520,0.540,0.560,0.580,0.600,0.620,0.640,0.660,0.680,0.700,0.720,0.740,0.760,0.780,0.800,0.820,
				0.840,0.870,0.890,0.910,0.930,0.950,0.970,0.990,1.020,1.040,1.060,1.090,1.110,1.130,1.160,1.180,1.210,1.240,1.260,1.290,1.320,1.350,1.370,1.400,1.430,1.460,
				1.500,1.530,1.560,1.590,1.630,1.660,1.700,1.740,1.770,1.810,1.850,1.890,1.940,1.980,2.020,2.070,2.120,2.170,2.220,2.270,2.320,2.380,2.430,2.500,2.560,2.620,
				2.690,2.760,2.830,2.900,2.980,3.070,3.150,3.230,3.330,3.430,3.530,3.630,3.740,3.860,3.980,4.110,4.240,4.390,4.550,4.700,4.870,5.060,5.260,5.460,5.670,5.930,
				6.200,6.460,6.740,7.110,7.480,7.850,8.240,8.790,9.340,9.900,10.490,11.410,12.330,13.250,14.240,16.080,17.910,19.750,21.780,27.290,32.790,38.290,44.000,57.970,
				71.940,85.920,100.00],
	//echo reverb decay time
	"5d 01 34": [0.10,0.12,0.15,0.17,0.20,0.21,0.22,0.24,0.25,0.26,0.27,0.28,0.29,0.30,0.31,0.32,0.33,0.34,0.35,0.36,0.37,0.38,0.39,0.40,0.41,0.42,0.43,0.44,0.45,0.46,
				0.47,0.49,0.50,0.51,0.52,0.53,0.54,0.56,0.57,0.58,0.59,0.61,0.62,0.63,0.64,0.66,0.67,0.69,0.70,0.72,0.73,0.75,0.76,0.78,0.80,0.81,0.83,0.85,0.87,0.89,
				0.91,0.93,0.95,0.97,0.99,1.01,1.04,1.06,1.08,1.11,1.13,1.16,1.19,1.22,1.25,1.28,1.31,1.34,1.38,1.42,1.45,1.49,1.53,1.58,1.62,1.66,1.71,1.76,1.81,1.87,
				1.93,1.99,2.05,2.12,2.20,2.27,2.35,2.43,2.53,2.63,2.73,2.84,2.97,3.10,3.23,3.37,3.56,3.74,3.92,4.12,4.40,4.67,4.95,5.24,5.70,6.16,6.62,7.12,8.04,8.96,
				9.87,10.89,13.64,16.40,19.15,22.00,28.99,35.97,42.96,50.00],
	"5d 01 35": [0.400,0.500,0.600,0.700,0.800,0.850,0.900,0.950,1.000,1.040,1.080,1.120,1.170,1.210,1.250,1.290,1.330,1.370,1.410,1.450,1.490,1.530,1.570,1.610,1.650,
				1.690,1.730,1.770,1.810,1.860,1.900,1.950,1.990,2.030,2.080,2.130,2.170,2.220,2.270,2.320,2.370,2.420,2.470,2.530,2.580,2.630,2.690,2.750,2.810,2.870,
				2.930,2.990,3.050,3.120,3.190,3.260,3.320,3.400,3.470,3.550,3.620,3.700,3.790,3.870,3.960,4.050,4.140,4.240,4.330,4.430,4.540,4.650,4.760,4.870,4.990,
				5.120,5.240,5.380,5.520,5.660,5.810,5.960,6.130,6.300,6.470,6.650,6.850,7.060,7.260,7.470,7.720,7.970,8.220,8.480,8.790,9.100,9.400,9.730,10.130,10.520,	
				10.920,11.340,11.870,12.400,12.920,13.490,14.220,14.960,15.690,16.480,17.590,18.690,19.790,20.980,22.820,24.660,26.490,28.490,32.160,35.830,39.490,43.570,
				54.580,65.580,76.590,88.000,115.940,143.890,171.830,200.000],
	"47 01 35": [0.12,0.12,0.13,0.13,0.14,0.14,0.15,0.15,0.16,0.16,0.17,0.17,0.17,0.18,0.18,0.19,0.19,0.20,0.20,0.21,0.21,0.22,0.23,0.23,0.24,0.25,0.25,0.26,0.27,0.27,
				0.28,0.29,0.30,0.31,0.31,0.32,0.33,0.34,0.35,0.35,0.37,0.38,0.38,0.40,0.41,0.42,0.43,0.44,0.46,0.47,0.48,0.49,0.51,0.52,0.54,0.55,0.57,0.58,0.60,0.62,
				0.63,0.65,0.67,0.68,0.70,0.72,0.74,0.76,0.78,0.80,0.82,0.85,0.87,0.89,0.92,0.94,0.96,0.99,1.02,1.05,1.08,1.11,1.14,1.17,1.20,1.23,1.26,1.30,1.33,1.37,
				1.40,1.44,1.48,1.52,1.56,1.61,1.65,1.69,1.74,1.79,1.84,1.89,1.94,2.00,2.05,2.11,2.16,2.22,2.28,2.34,2.41,2.48,2.55,2.61,2.68,2.76,2.83,2.90,2.98,3.07,
				3.15,3.23,3.33,3.42,3.51,3.60,3.70,3.80,3.90,4.00],
	//formant reverb high cut			
	"44 01 36": [329.6,339.2,349.1,359.2,369.7,380.4,391.5,402.9,414.6,426.6,439.0,451.8,464.9,478.4,492.3,506.7,521.4,536.5,552.1,568.2,584.7,601.7,619.2,637.2,655.7,
				674.8,694.4,714.6,735.4,756.8,778.8,801.4,824.7,848.7,873.3,898.7,924.9,951.8,979.4,1007.9,1037.2,1067.3,1098.4,1130.3,1163.2,1197.0,1231.8,1267.6,1304.4,
				1342.3,1381.4,1421.5,1462.9,1505.4,1549.1,1594.2,1640.5,1688.2,1737.3,1787.8,1839.8,1893.2,1948.3,2004.9,2063.2,2123.2,2184.9,2248.4,2313.8,2381.1,2450.3,
				2521.5,2594.8,2670.2,2747.8,2827.7,2909.9,2994.5,3081.6,3171.1,3263.3,3358.2,3455.8,3556.3,3659.6,3766.0,3875.5,3988.1,4104.1,4233.4,4346.1,4472.5,4602.5,
				4736.3,4874.0,5015.6,5161.4,5350.0,5665.5,5999.7,6353.5,6728.2,7125.0,7545.2,7990.2,8461.5,8960.5,9488.9,10048.6,10641.2,11268.7,11933.3,12637.1,13382.3,
				14171.6,15007.3,15892.4,16829.6,17822.1,18873.1,19986.1,21164.8,22412.9,23734.6,25134.3,26616.5,28186.2,29848.3,31608.5,33488.1]																			
}

//get the values from parsedStr, avoid dupl defintions
const notRenderableStr = {
	//Micro pitch(detune) & vibrato(depth)
	"15 00 47": parsedStr['15 00 47'],
	"15 00 44": parsedStr['15 00 47'],	   
	//chromatic pitch Detune		   
	"3a 01 02": parsedStr['3a 01 02'],
	"3a 01 16": parsedStr['3a 01 02'],
	"3a 01 17": parsedStr['3a 01 02'],			
	//dual crystal pitch detune
	"3a 01 0b": parsedStr['3a 01 02'],	
	//dual loop pitch detune
	"3a 01 0c": parsedStr['3a 01 02'],	
	//melody chormatic pitch detune
	"3a 01 22": parsedStr['3a 01 02'],
	//quad chormatic pitch detune
	"3a 01 25": parsedStr['3a 01 02'],																					   
	"14 00 46": parsedStr['14 00 46'],
	//phaser rate
	"14 00 59": parsedStr['14 00 59'],		
	
	"14 00 51": parsedStr['14 00 59'],				 
	//phaser vibe rate
	"14 00 52": parsedStr['14 00 59'],				 			  
	"5d 01 41": parsedStr['5d 01 41'],
	"5d 01 32": parsedStr['5d 01 41'],
	"5d 01 33": parsedStr['5d 01 41'],	
	"5d 01 31": parsedStr['5d 01 41'],
	"5d 01 35": parsedStr['5d 01 41'],	
	"5d 01 34": parsedStr['5d 01 34'],
	"5d 01 35": parsedStr['5d 01 35'],
	//fromant reverb decay time
	"5d 01 36": parsedStr['5d 01 35'],
	//ionosphere reverb decay time
	"5d 01 37": parsedStr['5d 01 35'],
	//cirrus reverb attack time
	"47 01 35": parsedStr['47 01 35'],
	//formant reverb attack time
	"47 01 36": parsedStr['47 01 35'],
	//ionosphere reverb attack time
	"47 01 37": parsedStr['47 01 35'],
	"44 01 36": parsedStr['44 01 36'],
	"44 01 37": parsedStr['44 01 36']	
	
				//dual loop pitch (pitch detune) & melody chromatic (pitch detune) & quad chromatic (pitch detune)	& chromatic pitch (detune)	& dual crystal (pitch detune)   
	//"32 3a": []		   

}



//this object is modified when scanning rigs and it is written to hdd
let rigsList = {
	"rigNames" : [0]
}

//how many elements to show at once
const rigsAndPerfSelVal = {
	"48" : ['1 - 48','49 - 96','97 - '],
	"36" : ['1 - 36','37 - 72','73 - 108','109 - '],
	"24" : ['1 - 24','25 - 48','49 - 72','73 - 96','97 - 120','121 - '],
    "18" : ['1 - 18','19 - 36','37 - 54','55 - 72','73 - 90','91 - 108','109 - ']
}	

//definitions end


//here the helper function starts

// convert 33 from a 0-10 range to a 0-16383
// var n = scaleValue(33, [0,16383],[0,10])
function scaleValue(valueToConv, from, to){
	let scale = (to[1] - to[0]) / (from[1] - from[0]);
	let capped = Math.min(from[1], Math.max(from[0],valueToConv)) - from[0];
	return Number(capped * scale + to[0]).toFixed(2);
}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);	
}	


function updateStrInterface(splitSysex,id,stomp) {
	textSplitSysex = splitSysex.slice(1).map(x=>String.fromCharCode(x));		//convert hex code to chars
	logItAll('updateStrInterface ',textSplitSysex,id,stomp,textSplitSysex.join("").replace(/\0.*$/g,''),'','','');
	textSplitSysex.pop();
	textSplitSysex.shift();
	textSplitSysex.shift();	

	if (stomp === 0) {  //kemprigvol, etc..
		if (id != '' ) {receive(sendIp,serverPort,id + 'Text',textSplitSysex.join(""));}  //write decibel rigvol, if id is not set because of "f0 00 20 33 00 00 03 00 00 00 30 00 f7" avoid js error
    } else {            //fxknobs value string repres.
		receive(sendIp,serverPort,id,stomp,textSplitSysex.join(""));
	}
	
	if ( (id === '/kempRigname') && initRigs < 0 && browseMode) {  //calculate if a rig is selected via rig right or rig left navigation
		Object.keys(rigsList).forEach(function(key) {
			if (key == textSplitSysex.join("").replace(/\0.*$/g,'')) {
				programChangeSelOffset =  (~~((rigsList[key] - 1) / defNrSimShownRigsOrPerfs) ) * defNrSimShownRigsOrPerfs;  // get 0 if < 18 (nr simultan shown is 18), get 1 if > 18 ...			
				receive(sendIp,serverPort,'/rigsAndPerfSel',~~(rigsList[key] / defNrSimShownRigsOrPerfs) );
				showCurrSelection(rigsList); 						
				receive(sendIp,serverPort,'/rawSelections',parseInt( rigsList[key] - 1));	
			}
			 logItAll('updateStrInterface kemprigname found',rigsList[key].toString(),(typeof rigsList[key].toString()),key,(typeof textSplitSysex.join("").replace(/\0.*$/g,'')),'','',''); 

		})	
	}	
	
	if ( (id === '/kempRigname') && initRigs > -1) {  //we now know that we are scanning the rigs
		if (  ((lastScannedRigs.toString() != textSplitSysex.toString()) || (lastScannedRigs === '')) && browseMode ) { 
			receive(sendIp,serverPort,'/scannedFirstSlotName',textSplitSysex.join("").replace(/\0.*$/g,''));	  // update the last scanned rig in the SETTIGS

			// write the the successfully scanned rigs here
			lastScannedRigs = textSplitSysex;	
			
			if (initRigs === 0) {				//first rig needs to be renamed
				
				Object.keys(rigsList).forEach(function(key) {delete rigsList[key];});  //empty rigslist object
				rigsList['rigNames'] = [0];                                            //default one like on startup  
			
				rigsList[lastScannedRigs.join("").replace(/\0.*$/g,'')] = rigsList['rigNames'];
				delete rigsList['rigNames'];
			} else {
				rigsList[lastScannedRigs.join("").replace(/\0.*$/g,'')] = [0];   //make an empty performance entry
			}
			rigsList[lastScannedRigs.join("").replace(/\0.*$/g,'')][0] = initRigs + 1;   //we start with program change + 1 we input the number of the program assignment as on the kemper 
			initRigs = initRigs + 1;
		}  		
		
	}
}	

//update the parameter controls of the fx: labels, steps, range
function stompsFxControls(stompId,fxHex,color){
	j = 0;  // counter for steps, min and max
	for(i = 0; i < maxFxControls; i ++) {
		logItAll('stompsFxControls ',stompId,(fxIdentHex[fxHex].length / 2 ),fxHex,'','','','');
	 //   if (i <  fxLabelControl[fxHex].length && fxHex !== '00 00') {      //set labels show the knobs
	    if (i < (fxIdentHex[fxHex].length / 2 ) && fxHex !== '00 00') {
			
			receive('/FXKNOB_' + i + '/showFxControls',stompId,1);               //every label has a knob so show them 
			receive('/FXKNOB_' + i + '/showFxControlsHtmlLabel', stompId , '<h6 style="text-align:center;"> ' + fxIdentHex[fxHex][i + (fxIdentHex[fxHex].length / 2 )] + ' </h6>');  //set html property of knob		
	        receive('/FXKNOB_' + i + '/showFxControlsSteps',stompId,fxControlsKnobSetup[fxHex][j]);   												//set the number of steps of the correspomding control
	        receive('/FXKNOB_' + i + '/showFxControlsRange',stompId,'{ "min": ' + fxControlsKnobSetup[fxHex][j + 1] + ',"max":' + fxControlsKnobSetup[fxHex][j + 2] + '}');  //set range of fx control, aka min and max
	        send('midi', midiDeviceName, '/sysex',  'f0 00 20 33 02 7f 41 00 ' + getKeyByValue(fxStompIdent,stompId) + ' ' + fxIdentHex[fxHex][i] + ' f7');
     	} else {                                       // hide the rest and default it
	        receive('/FXKNOB_' + i + '/showFxControls',stompId,0);
            receive('/FXKNOB_' + i + '/showFxControlsHtmlLabel', stompId,'');
	        receive('/FXKNOB_' + i + '/showFxControlsSteps',stompId,128); 
		    receive('/FXKNOB_' + i + '/showFxControlsRange',stompId,{ "min": 0,"max": 16383});
			receive('/FXKNOBVAL_' + i ,stompId,'');  //set textvalue of knobs empty
		}	
	    j = j + 3;
	}	
}

function evalSection(ident) {
    if ((ident === '32' ) || (ident === '33') || (ident === '34') || (ident === '35')){  // not very elegant switch on /off main sections STOMPS, STACK, EFFECTS
        return '/rigSection1'; 			
	} else if ((ident === '0a') || (ident === '0b' ) || (ident === '0c')) {
	    return '/rigSection2';
	}else {
	    return '/rigSection3'; 
	}	
			   
}	

//on several points we update all visible controls by requesting several things
function requestRigInfo(){
	
//save midi bandwith and just send the really needed one -> which can be seen on the main screen	
	send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 04 40 f7');  //req single parameter stomps	
    send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 04 41 f7');  //req single parameter sttacks	
    send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 04 42 f7');  //req single parameter effects	
	send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 0c 02 f7');  //req single parameter cab
	send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 0b 02 f7');  //req single parameter eq
	send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 0a 02 f7');  //req single parameter amp 	
	
    	
	//send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 47 00 7f 00 f7');  //req single parameter main out volume 	
	//send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 7f 01 f7');  //req single parameter headphone out volume 	
	//send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 7f 02 f7');  //req single parameter monitor out volume 	
	//send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 7f 03 f7');  //req single parameter direct out volume 	
	//send('midi',midiDeviceName,'/sysex','f0 00 20 33 02 7f 41 00 7f 04 f7');  //req single parameter spdif volume 	
		
	//send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 01 f7');   //req string for current rig name
	
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 02 f7');   //req string for current author name			
    send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 10 f7');   //req string for amp description
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 04 f7');   //req string for  profile info		
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 42 00 09 00 f7');  //req multi parameter INPUT -> noise gate intensity, input clean sense, input distortion sense
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 42 00 0b 00 f7');  //req multi parameter Equalizer
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 0a 04 f7');  //req single parameter gain vol
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 04 01 f7');  //req single parameter rig vol	
	
	
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 32 00 f7');  //req single parameter stomp A type
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 32 03 f7');  //req single parameter stomp A on / off 	
	
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 33 00 f7');  //req single parameter stomp B type 
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 33 03 f7');  //req single parameter stomp B on / off 
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 34 00 f7');  //req single parameter stomp C type 
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 34 03 f7');  //req single parameter stomp C on / off 
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 35 00 f7');  //req single parameter stomp D type 
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 35 03 f7');  //req single parameter stomp D on / off 
	
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 38 00 f7');  //req single parameter stomp X type 
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 38 03 f7');  //req single parameter stomp X on / off 
	
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 3a 00 f7');  //req single parameter stomp MOD type
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 3a 03 f7');  //req single parameter stomp MOD on / off 
    send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 3c 00 f7');  //req single parameter stomp Delay type
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 3c 03 f7');  //req single parameter stomp Delay on / off  	
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 3d 00 f7');  //req single parameter stomp Reverb type
	send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 3d 03 f7');  //req single parameter stomp Reverb on / off 	
	

}	

//helper function for incoming messages, takes care of several cases
function inFilterHelper(inValue,hostType){
	let updateKnobValKemper,valSplitMulti;  //infilter vars
	textSplitSysex = inValue.split(" ");
	updateId = '';
	logItAll('infilterhelper begin ',inValue,stompIdent,textSplitSysex[9],'','','','');
	
	if ((typeof adrIdToKemp[textSplitSysex[8] + ' ' +  textSplitSysex[9]]) !== 'undefined') {
		updateId = adrIdToKemp[textSplitSysex[8] + ' ' +  textSplitSysex[9]]; 
		logItAll('infilterhelper nach update id ',adrIdToKemp[textSplitSysex[8]],updateId,stompIdent,'','','',''); 
		if (updateId === '/kempRigname') {requestRigInfo();}
	 
	}
	if((textSplitSysex[4] == '00') && (textSplitSysex[5] == '00') && (textSplitSysex[6] == '01')) {	 // single parameter return 
	    knobVal = (parseInt(textSplitSysex[10],16) * 128) + parseInt(textSplitSysex[11],16);
	   
		
        if ((typeof adrIdToKemp[textSplitSysex[8] + ' ' + textSplitSysex[9]] === "undefined")  ) { //get the info to update from a stomp 
			if ( (textSplitSysex[8] === '00' && textSplitSysex[9] === '2f') || (textSplitSysex[8] === '00' && textSplitSysex[9] === '50') ) {
				return;
			}   // sysex when switching from browser to perform and vice versa not needed the actual settings are sent via control change
				
			i = fxIdentHex[stompFxIdent].indexOf(textSplitSysex[9]);
			j = (fxIdentHex[stompFxIdent].indexOf(textSplitSysex[9])) * 3;
			k =  ((fxIdentHex[stompFxIdent].indexOf(textSplitSysex[9])) * 3) + (fxControlsKnobSetup[stompFxIdent].length / 2);  // the second half of the values are for the label values
			stompTemp = 10;  // starting position of hex string 			
	        knobVal =   (parseInt( textSplitSysex[stompTemp],16) * 128) + parseInt( textSplitSysex[stompTemp + 1],16);
			fxKnobFinalValue = scaleValue(knobVal,[fxControlsKnobSetup[stompFxIdent][j + 1],fxControlsKnobSetup[stompFxIdent][j + 2]],[fxControlsKnobSetup[stompFxIdent][k + 1],fxControlsKnobSetup[stompFxIdent][k + 2]]);
			logItAll('infilterhelper begin 1 fxknobfinalvalue ',fxControlsKnobSetup[stompFxIdent][j + 1],'',fxControlsKnobSetup[stompFxIdent][k + 1],k,'','','');
			receive(sendIp,serverPort,'/FXKNOB_' + i,stompIdent, knobVal );
			receive(sendIp,serverPort,'/FXKNOBVAL_' + i,stompIdent, fxKnobFinalValue );

	    } else if ( ((adrIdToKemp[textSplitSysex[8] + ' ' + textSplitSysex[9]]) === '/kempRigVol') )  {        // if the range of the displayed value is not good calculateable just request a string for it  global knobs 
			receive(sendIp,serverPort,adrIdToKemp[textSplitSysex[8] + ' ' + textSplitSysex[9]] , knobVal);
            updateKnobValKemper = 'f0 00 20 33 02 7f 7c 00 ' + textSplitSysex[8] + ' ' + textSplitSysex[9] + ' ' + textSplitSysex[10] + ' ' + textSplitSysex[11] + ' ' + textSplitSysex[12];	//update the knob on the interface		   
  		    send('midi', midiDeviceName, '/sysex', updateKnobValKemper); //update rig volume, etc. as this is somekind of nonlinear calc just ask per sysex for the string 
		//}  else if (typeof reqStrValue[stompFxIdent] === 'object') { // incoming request strings for the fx knobs
		} else if ((adrIdToKemp[textSplitSysex[8] + ' ' + textSplitSysex[9]]).substring(0,11) === '/rigSection') {                 // special turn on and off stomps, stacks effects
		    receive(sendIp,serverPort,adrIdToKemp[textSplitSysex[8] + ' ' + textSplitSysex[9]] , parseInt(textSplitSysex[11]));
   
		} else {		   		 		                                                                                       //standard interface update knobs positions and values
			stompTemp = textSplitSysex[8] + ' ' + textSplitSysex[9];
			fxKnobFinalValue = scaleValue(knobVal,[fxControlsKnobSetup[stompTemp][1],fxControlsKnobSetup[stompTemp][2]],[fxControlsKnobSetup[stompTemp][4],fxControlsKnobSetup[stompTemp][5]]);
			
			logItAll('infilterhelper begin 2 ',knobVal,fxKnobFinalValue,'','','','','');
			logItAll('infilterhelper begin 3 ',textSplitSysex,(parseInt(textSplitSysex[10],16) * 128) + parseInt(textSplitSysex[11],16),stompIdent,'','','',''); 
			
			receive(sendIp,serverPort,adrIdToKemp[textSplitSysex[8] + ' ' + textSplitSysex[9]] , knobVal);
			receive(sendIp,serverPort,adrIdToKemp[textSplitSysex[8] + ' ' + textSplitSysex[9]] + 'Text', fxKnobFinalValue);		 
    
		}	
		if ((typeof reqStrValue[textSplitSysex[9] + ' ' + stompFxIdent] === 'object' ) ) {   // in this fx is at least one knob that needs string rep. value, fxhex and stomp fx hex must exist
			if (reqStrValue[textSplitSysex[9] + ' ' + stompFxIdent] === '14 00 46') {		
			}	
			logItAll('infilterhelper begin reqstrvalue ',reqStrValue[textSplitSysex[9] + ' ' + stompFxIdent],stompFxIdent,textSplitSysex[9],'','','','');
			updateKnobValKemper = 'f0 00 20 33 02 7f 7c 00 ' + textSplitSysex[8] + ' ' + textSplitSysex[9] + ' ' + textSplitSysex[10] + ' ' + textSplitSysex[11] + ' ' + textSplitSysex[12];
		    send('midi', midiDeviceName, '/sysex', updateKnobValKemper);	  
		}	  
	 	
			
    } else if((textSplitSysex[4] == '00') && (textSplitSysex[5] == '00') && (textSplitSysex[6] == '03')) {  // answer from string request
		
		updateStrInterface(inValue.split(" ").slice(7).map(x=>parseInt(x,16)),updateId,0);      // send stomp 0 assume it is no fxknob 
		
	} else if((textSplitSysex[4] == '02') && (textSplitSysex[5] == '7f') && (textSplitSysex[6] == '3c')) {  //request parameter value as redered string
		logItAll('in reqeust string 02 7f 3c ',updateId,stompFxIdent,stompIdent,textSplitSysex[8],textSplitSysex[9],'','');
		if ( (updateId === '')  && (typeof reqStrValue[textSplitSysex[9] + ' ' + stompFxIdent ] === 'object')  ) {
           
			updateStrInterface(inValue.split(" ").slice(9).map(x=>parseInt(x,16)),'/FXKNOBVAL_' + reqStrValue[textSplitSysex[9] + ' ' + stompFxIdent][0],stompIdent);   
		} else {
			updateStrInterface(inValue.split(" ").slice(9).map(x=>parseInt(x,16)),updateId,0);
		}		
		 
	} else {
	}	
}

function outFilterHelper(addressOut,argsValue){
   	let volKnobUpdateKemper,volKnobStringUpdate;
	updateId = '';	
   
    if (typeof (getKeyByValue(adrIdToKemp,addressOut)) !== 'undefined') {updateId = getKeyByValue(adrIdToKemp,addressOut);} 
 	volKnobUpdateKemper =  'f0 00 20 33 02 7f 01 00 ' + updateId + (argsValue & 0x7f).toString(16).padStart(2,'0') + ' ' + ((argsValue >> 7) & 0x7f).toString(16).padStart(2,'0') + ' f7';		
	if (addressOut.substring(0,9) === '/kempStomp') {
	   volKnobUpdateKemper =  'f0 00 20 33 00 00 01 00 ' + updateId + (argsValue & 0x7f).toString(16).padStart(2,'0') + ' ' + ((argsValue >> 7) & 0x7f).toString(16).padStart(2,'0') + ' f7';     //on and off effects stomps, stacks, effects 
	} else if (updateId !== '' ){
	  receive(sendIp,serverPort,addressOut + 'Text', scaleValue(argsValue,[fxControlsKnobSetup[updateId][1],fxControlsKnobSetup[updateId][2]],[fxControlsKnobSetup[updateId][4],fxControlsKnobSetup[updateId][5]]));             
    }		
	
	logItAll('outfilterhelper ',addressOut,argsValue,'','','','','');
	
	if (updateId != '') {                                                                                                                        //update kemper              
		logItAll('outfilterhelper rigvolknob',volKnobUpdateKemper,argsValue,'','','','','');
    	send('midi',midiDeviceName,'/sysex',volKnobUpdateKemper);
        if (addressOut === '/kempRigVol') { 
		   volKnobStringUpdate = 'f0 00 20 33 02 7f 7c 00 ' + updateId + ((argsValue >> 7) & 0x7f).toString(16).padStart(2,'0') + ' ' + (argsValue & 0x7f).toString(16).padStart(2,'0') + ' f7';
		   send('midi',midiDeviceName,'/sysex', volKnobStringUpdate);          
	   }   		
	}	
	
}	


//used for scanning rigs or performance, a recursive function which request and catches these req by incoming sysex values		
function timeOut(id,opType) {
	
	setTimeout(function () {
		logItAll('scan started ',tempTimeout,initRigs,id,opType,'','','');
		if (bankNr === 4 && tempTimeout === 111 && opType === 'PERFORM') {                   //when scanning is finished we write the perofrmancelist object as file, this file will be read on next time start at init function 
		//if (tempTimeout === 80 && opType === 'PERFORM') {                   //when scanning is finished we write the perofrmancelist object as file, this file will be read on next time start at init function 
			setTimeout(function () { 
				receive('/progressScan/showprogressScan',0);
				initRigs = -1;
				fs.writeFile('PERFORMANCESLIST.JSON', JSON.stringify(perfList) , (err) => {
					if (err) {
						throw err;
					}	
					logItAll('scan saved ','','','','','','','');
					readRigOrPerfFile('PERFORMANCESLIST.JSON');		
					showCurrSelection(perfList);   //at startup browse mode is default		
					//bankNr = 0;
					initMainSel(Object.keys(perfList).length,'');					
				}); 			 
			},1000 ); 		//wait a second to ensure a saved file 
			return;
		}
	
	
		if ( id  % 2 === 0) {
			if (opType === 'BROWSE') {send('midi', midiDeviceName, '/program', 1, tempTimeout );}
			if ( (opType === 'PERFORM') &&  (((tempTimeout + pgOffsetPerf[bankNr])  === 0) || ( ((tempTimeout) + pgOffsetPerf[bankNr]) % 5 === 0 ) ) ) { // in performance mode just send program changes for the first slot -> the first for every performance
				send('midi', midiDeviceName, '/program', 1, tempTimeout );				 
			}  
			if ( (opType === 'PERFORM') &&  (((tempTimeout + pgOffsetPerf[bankNr])  === 2) || ( ((tempTimeout - 2) + pgOffsetPerf[bankNr]) % 5 === 0 )) ) {  // after the performance name has been requested, request the rig names of the slots
				logItAll('perfomance changed ',tempTimeout,'','','','','','');
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 47 00 00 00 01 00 01 f7');  // extended string request slot 1 name
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 47 00 00 00 01 00 02 f7');  // extended string request slot 1 name
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 47 00 00 00 01 00 03 f7');  // extended string request slot 1 name
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 47 00 00 00 01 00 04 f7');  // extended string request slot 1 name
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 47 00 00 00 01 00 05 f7');  // extended string request slot 1 name
			}
			tempTimeout++;
			if (opType === 'BROWSE') {receive(sendIp,serverPort,'/progressScan',tempTimeout);}
			if ( (tempTimeout === 128  ) && (opType === 'PERFORM') )  {tempTimeout = 0;	} 							
		}
		if ( id  % 2 !== 0) {
			//if ( (tempTimeout === 1) || ( (tempTimeout - 1) % 5 === 0 ) ) {           //when tempTimeout is 1 / 6 / 11 ask for the performance name -> after the first slot select of the actual performance occurs 
            if ( (opType === 'PERFORM') &&  (((tempTimeout + pgOffsetPerf[bankNr])  === 1) || ( ((tempTimeout - 1) + pgOffsetPerf[bankNr]) % 5 === 0 )) ) {  // after the first slot of a performance is set, request the performance name
				perfIndex++; 
				receive(sendIp,serverPort,'/progressScan',perfIndex);   				//update progress bar per performance 1 - 125
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 47 00 00 00 01 00 00 f7');  // extended string request performance name
			}		
			if (opType === 'BROWSE') { send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 01 f7');}
			if ( (id === 255  ) && (opType === 'PERFORM') )  {
				id = 0;	
				bankNr++;
				send('midi', midiDeviceName, '/control', 1,32, bankNr );	
			} 
				
			if ( (id === 255  ) && (opType === 'BROWSE') )  {            //when scanning is finished we write the rigslist object as file, this file will be read on next time start at init function 
			//if ( (id === 15  ) && (opType === 'BROWSE') )  {   
				receive('/progressScan/showprogressScan',0);
				logItAll('after rigscan rignameslist  ',rigsList,countRigs,'','','','','');
				initRigs = -1;
				fs.writeFile('RIGSLIST.JSON', JSON.stringify(rigsList) , (err) => {
					if (err) {
						throw err;
					}					
					logItAll('rigsliste saved  ','','','','','','','');				
				    countRigs =  Object.keys(rigsList).length; 				
					receive(sendIp,serverPort,'/rigsAndPerfSel', 0 );	//switch to first main category		
					readRigOrPerfFile('RIGSLIST.JSON');		
					showCurrSelection(rigsList);   //at startup browse mode is default		
					initMainSel(Object.keys(rigsList).length,'');	

				}); 
				return;			
			
			}	
		}
		id++;
		timeOut(id,opType);
			
	}, 750);	//750 ms for each cycle
			
}	
	
	


//update the main window, where the primary selection of rigs or perfs occur
function initMainSel(nrElems,stringOut) {
	//nrElems could be rigs (countRigs) or Performances
	for(i = 0; i < nrElems; i++) {
		logItAll('initMainSel ',nrElems,stringOut,'','','','','');
		if ((defNrSimShownRigsOrPerfs * i) >= nrElems ) {
			stringOut +=  '}';
			break; 
		}
		if (i > 0) { stringOut += ',"' + rigsAndPerfSelVal[defNrSimShownRigsOrPerfs][i] + '":' + i;	}	
		if (i === 0 ) {stringOut = '{"' + rigsAndPerfSelVal[defNrSimShownRigsOrPerfs][i] + '":' + i;}
	}	
	if (nrElems === 1) {stringOut +=  '}';}
	receive('/rigsAndPerfSel/showMainSel',0);	
	receive('/rigsAndPerfSel/showNrSimultanSelection',stringOut);  //populate when load, it is too early in init function
	stringOut = '';
}	

//at init read the two default files 
function readRigOrPerfFile(fileName) {
	tempObj = {};
	fs.readFile(fileName,'utf8',(err,data) => {
		if (err ) { //just read readable ones or the first start
			if (fileName === 'RIGSLIST.JSON') {
			    tempObj = rigsList;
			} else {
				tempObj = perfList;
			}		
			fs.writeFile(fileName, JSON.stringify(tempObj) , (err) => {
				if (err) {
					console.log('error saving ' + fileName  + ' file');
				}	
				console.log(' Default ' + fileName + ' list saved ' + tempObj['P1'])
			});		
		} else {
			tempObj = JSON.parse(data);
			if (fileName === 'RIGSLIST.JSON') { 
				rigsList = tempObj;
			} else {
				perfList = tempObj;
				showCurrSelection(perfList);
			}	
			logItAll('readrigorperffile ',Object.keys(tempObj).length,fileName,rigsList,'','','','');
		}	
					
	});
}	

//show the rigs or perfs as pressable button for the selection ("1-18 / 19- .." and so on)
function showCurrSelection(rigsOrPerfsObj) {
	logItAll('showCurrSelection ',programChangeSelOffset,defNrSimShownRigsOrPerfs,rigsOrPerfsObj,'','','','');
	i = 0;
	rigsAndPerfsListTemp = {};
	Object.keys(rigsOrPerfsObj).forEach(function(key,value) {  //build the new object according to range by main selection
		if ( i >= programChangeSelOffset && i < (programChangeSelOffset + defNrSimShownRigsOrPerfs)) {
			rigsAndPerfsListTemp[key] = value;
		}					
		i = i + 1;
	})
	receive('/rawSelections/showRigs',rigsAndPerfsListTemp);	
	i = 0;
}	
//show the rigs for the performance selected -> hence called only in performance mode
function updateRigsOfPerfs(indexNr) {
	rigsAndPerfsListTemp = {};
	
	logItAll('updaterigsorperfs ',indexNr,Object.values(perfList)[indexNr],'','','','','');
	
	if (typeof Object.values(perfList)[indexNr] === 'undefined') {			//when scanning we must prevent the error
		receive('/perfRigs/showRigs',rigsAndPerfsListTemp);	
		receive('/perfRigs/showPerfName','');	
		receive(sendIp,serverPort,'/perfRigs', 0 );
		return;
	}	
	
	for(i = 0; i < Object.values(perfList)[indexNr].length; i++) {
		rigsAndPerfsListTemp[Object.values(perfList)[indexNr][i]] = i;
	}		
					
	receive('/perfRigs/showRigs',rigsAndPerfsListTemp);	
	receive('/perfRigs/showPerfName',Object.keys(perfList)[indexNr]);	
	receive(sendIp,serverPort,'/perfRigs', 0 );
}	

//get parts of the fx depending wether it es WAH, DIST, etc.. (not ALL)
function getPartObjByKeySearch(partKeyStr,wholeObj){
	let tempObj = {};
	tempObj['off'] = "00 00";
	Object.keys(wholeObj).forEach(function(key) {
		if (key.includes(partKeyStr)) {
			tempObj[key] = wholeObj[key];  //get the value from the original object, adding a value in this function here results in number conversion
		}
	})	
	return tempObj;
}	

//make the object with all fx categories e.g. wah / dist ,...
function populateFxSubCats() {
	stompFxIdTemp = {};
	stompFxIdTemp['all'] = "all";
	Object.keys(stompFxId).forEach(function(key) {
		
		if (key.includes('#')) {			
			if (!stompFxIdTemp.hasOwnProperty(key.substr((key.indexOf('#') + 1)))) {       //if key is not in the temp object write it 
				stompFxIdTemp[key.substr((key.indexOf('#') + 1))] = key.substr((key.indexOf('#') + 1));
			}	
			
		}
	})
	receive('/fxCatShow/showMainFxCat','A',stompFxIdTemp);	
	receive('/fxCatShow/showMainFxCat','B',stompFxIdTemp);	
	receive('/fxCatShow/showMainFxCat','C',stompFxIdTemp);	
	receive('/fxCatShow/showMainFxCat','D',stompFxIdTemp);	
	receive('/fxCatShow/showMainFxCat','X',stompFxIdTemp);	
	receive('/fxCatShow/showMainFxCat','M',stompFxIdTemp);	
	receive('/fxCatShow/showMainFxCat','E',stompFxIdTemp);	
	receive('/fxCatShow/showMainFxCat','R',stompFxIdTemp);	
}	

//main log function -> uncomment to log a lot of values  
function logItAll(text1,value1,text2,value2,text3,value3,text4,value4) {
	
//	console.log(text1 + '#' + value2 + '##' + text2 + '#' + value2 + '##' + text3 + '#' + value3 + '##' + text4 + '#' + value4);
}	

function updateNotRenderableControls(lsbFxHex, hexId10,hexId11,typ) {

	let wholeNr; 
	let remainder;
	if (typ === 'in') { 				//incoming messages, when turning the knob on the kemper, or when pressing show fx controls
		if (hexId10 === '00') wholeNr = ~~( (parseInt( hexId11,16) * 128)  / 127);			//when req. all controls per fx msb is emtpy, get LSB instead
		if (hexId10 !== '00') wholeNr = ~~( ((parseInt( hexId10,16) * 128) + parseInt(hexId11,16)) / 127);
		
		if (wholeNr === notRenderableStr[lsbFxHex + ' ' + stompFxIdent].length) wholeNr = 127;
		remainder = (((parseInt( hexId10,16) * 128) + parseInt( hexId11,16)) / 127) - wholeNr;
	}
	if (typ === 'out') {				//when turning the knob in the gui
		wholeNr = ~~( hexId10 / 127);				
		if (wholeNr > 127) wholeNr = 127;
		logItAll('fun updatenotrenderablecontrols 1 ',lsbFxHex,'','',typ,Math.round((hexId10/127)),~~( hexId10 / 127),(hexId10/127));
		remainder = ( hexId10 / 127) - wholeNr;
	}	

	i = fxIdentHex[stompFxIdent].indexOf(lsbFxHex);
	logItAll('fun updatenotrenderablecontrols 2',lsbFxHex,hexId10,hexId11,typ,notRenderableStr[lsbFxHex + ' ' + stompFxIdent][wholeNr],notRenderableStr[lsbFxHex + ' ' + stompFxIdent].length,wholeNr);

	if ( (typeof notRenderableStr[lsbFxHex + ' ' + stompFxIdent][0]) !== 'number' ){		//when strings should be shown in the gui
		logItAll('fun updatenotrenderablecontrols 3 no number ',fxStompIdent,stompFxIdent,hexId11,typ, getKeyByValue(fxStompIdent,stompIdent),fxIdentHex[stompFxIdent][hexId11],(wholeNr & 0x7f).toString(16).padStart(2,'0'));
		receive(sendIp,serverPort,'/FXKNOBVAL_' + i,stompIdent,( notRenderableStr[lsbFxHex + ' ' + stompFxIdent][wholeNr] ) );
		if ( (typ === 'in') && (hexId10 === '00') ) receive(sendIp,serverPort,'/FXKNOB_' + i,stompIdent, (parseInt( hexId11,16) * 128)  );		//when msb is empty because of request all values of fx when pressing "show fx controls" take LSB
		if ( (typ === 'in') && (hexId10 !== '00') ) receive(sendIp,serverPort,'/FXKNOB_' + i,stompIdent, ((parseInt( hexId10,16) * 128) + parseInt(hexId11,16)) );

	
		//warning just working for msb hex of not renderable values which are no number -> fxIdenthex needs proper value otherwise it throws a midi error tbf.
		//send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 ' +  getKeyByValue(fxStompIdent,stompIdent) + ' ' + fxIdentHex[stompFxIdent][lsbFxHex] +  (wholeNr & 0x7f).toString(16).padStart(2,'0') + ' 00' + ' f7'); //update values on kemper
		if (typ === 'out') send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 ' + getKeyByValue(fxStompIdent,stompIdent) + ' ' +  fxIdentHex[stompFxIdent][hexId11] + ' ' +  (wholeNr & 0x7f).toString(16).padStart(2,'0') + ' 00 f7'); //update values on kemper
				
		//}
		
		return;
	}
	let finalVal;
	if (typ === 'out') {
        wholeNr = ~~( hexId10 / 127);
		logItAll('fun updatenotrenderablecontrols 4 out ',fxStompIdent,stompFxIdent,hexId11,wholeNr, (127 & 0x7f).toString(16).padStart(2,'0'),(128 & 0x7f).toString(16).padStart(2,'0'),);
	}
	if (  wholeNr < (notRenderableStr[lsbFxHex + ' ' + stompFxIdent].length - 1) ) {
		finalVal =  parseFloat( ( (notRenderableStr[lsbFxHex + ' ' + stompFxIdent][wholeNr + 1] - notRenderableStr[lsbFxHex + ' ' + stompFxIdent][wholeNr ])*remainder));
		receive(sendIp,serverPort,'/FXKNOBVAL_' + i,stompIdent,( notRenderableStr[lsbFxHex + ' ' + stompFxIdent][wholeNr] + finalVal).toFixed(2)  );
	} else {
		finalVal = ( notRenderableStr[lsbFxHex + ' ' + stompFxIdent][wholeNr] );
		receive(sendIp,serverPort,'/FXKNOBVAL_' + i,stompIdent,( notRenderableStr[lsbFxHex + ' ' + stompFxIdent][wholeNr] ).toFixed(2)  );
	}
	
	if (typ === 'out') {			//update kemper when touching the gui deal with msb hex value, because we default the most controls to 128 steps
		
		if (wholeNr === (notRenderableStr[lsbFxHex + ' ' + stompFxIdent].length - 1)) {
			send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 ' + getKeyByValue(fxStompIdent,stompIdent) + ' ' +  fxIdentHex[stompFxIdent][hexId11] + ' 7f 7f f7'); //the final value needs special treatment
		} else {
			send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 ' + getKeyByValue(fxStompIdent,stompIdent) + ' ' +  fxIdentHex[stompFxIdent][hexId11] + ' ' +  (wholeNr & 0x7f).toString(16).padStart(2,'0') + ' 00 f7'); //update values on kemper
		}

		return;  //just update the knob when controlled on the kemper
	}	
	i = fxIdentHex[stompFxIdent].indexOf(lsbFxHex);
	j = (fxIdentHex[stompFxIdent].indexOf(lsbFxHex)) * 3;
	k =  ((fxIdentHex[stompFxIdent].indexOf(lsbFxHex)) * 3) + (fxControlsKnobSetup[stompFxIdent].length / 2);  // the second half of the values are for the label values
	stompTemp = 10;  // starting position of hex string 			
	knobVal =   (parseInt( textSplitSysex[stompTemp],16) * 128) + parseInt( textSplitSysex[stompTemp + 1],16);
	logItAll('updatenotrenderable controls ',fxControlsKnobSetup[stompFxIdent][j + 1],'',fxControlsKnobSetup[stompFxIdent][k + 1],k,knobVal,'','');
	receive(sendIp,serverPort,'/FXKNOB_' + i,stompIdent, ((parseInt( hexId10,16) * 128) + parseInt(hexId11,16)) );
}

module.exports = {
	
	init: function() {
		
		programChangeSelOffset = 0;
		countRigs = 0;
	
		var widgetData = loadJSON(settings.read('load'));
		//extract the default number of rigs or perfs which should be selectable at once
		for (let indexit = 0; indexit < widgetData.session.tabs[0].widgets.length; indexit++ ) {
			if (widgetData.session.tabs[0].widgets[indexit].id === 'kempSetting'){
                for (let indexitAgain = 0; indexitAgain < widgetData.session.tabs[0].widgets[indexit].widgets.length; indexitAgain++ ) {
					if (widgetData.session.tabs[0].widgets[indexit].widgets[indexitAgain].id === 'nrVisibleRigsAndPerfs') { defNrSimShownRigsOrPerfs = widgetData.session.tabs[0].widgets[indexit].widgets[indexitAgain].default;}
				 }			
				
			}
		}	
		
		//init vars depending on the settings in the server window
		midiDeviceName = settings.read('midi')[0].substr(0,settings.read('midi')[0].indexOf(':'));
		serverPort = settings.read('port');
		sendIp = settings.read('send')[0].substr(0,settings.read('send')[0].indexOf(':'));
		logItAll('init json',defNrSimShownRigsOrPerfs,midiDeviceName,sendIp,serverPort,'','','');
			
		//this is for the first startup, if the two files for rigslists and performanceslists are missing write the empty default files		
		 //get the default number of simult. shown rigs or performances from json file -> tab id 5 the kempsetting modal is at id 22 and widget id 5 is the switch
		readRigOrPerfFile('PERFORMANCESLIST.JSON');          //must be in init, otherwise it will be the default object
		readRigOrPerfFile('RIGSLIST.JSON');		            //must be in init, otherwise it will be the default object
					
		app.on('sessionOpened',(data,client) => {
			notRenderableStr['15 00 44'] = notRenderableStr['15 00 47'];

			receive(sendIp,serverPort,'/progressScan', 0 );
			showCurrSelection(rigsList);   //at startup browse mode is default		
			initMainSel(Object.keys(rigsList).length,'');

			//defaultinit for browse mode, must be on sessionOpened otherwise it has no effect
			receive('/progressScan/showScanProgRange','{ "min": ' + 1 + ',"max":' + 128 + '}');  //set the range of the progress bar 
			receive('/progressScan/showScanProgGrad','{ "1": "red" ,"62": "yellow","128":"green"}');  //set the range of the progress bar 
			receive('/scanKemper/showScanType','SCAN IT'); 	
			receive('/scannedPerfName/showScannedPerf',0); 	
			receive('/perfRigs/showRigs','{"":"","":"","":"","":"","":""}');	
			receive('/perfRigs/showPerfRigs',0);
			
			populateFxSubCats();
			
			receive('/stompASel/showFxByCat',stompFxId);        //update all stomps chooseable fx
			receive('/stompBSel/showFxByCat',stompFxId);
			receive('/stompCSel/showFxByCat',stompFxId);
			receive('/stompDSel/showFxByCat',stompFxId);
			receive('/stompXSel/showFxByCat',stompFxId);
			receive('/stompMSel/showFxByCat',stompFxId);
			receive('/stompESel/showFxByCat',stompFxId);
			receive('/stompRSel/showFxByCat',stompFxId);
		})		
	},	
	
    oscOutFilter: function(data) {

        var {address, args, host, port} = data
		
		logItAll('outfilter begin:  ',args[0].value,address,'','','','','');
		
		//send midi notes for rig right or rig left pressed
		if (address.substring(0,13) === '/rigBrowseSel' ) {
			if (address === '/rigBrowseSelRight'){ 	send('midi', midiDeviceName, '/control', 1,48, 0 );	} 
			if (address === '/rigBrowseSelLeft'){	send('midi', midiDeviceName, '/control', 1,49, 0 );	}	
			//requestRigInfo(); 
			setTimeout(function () { send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 01 f7');  },300 );  //request rigname, when this is received in infilterhelper request the other parameters of the rig
			return;
		}
		
		//show the controls for the current fx
		if (address.substring(0,10) === '/kempFxDet'){    //set the values global when clicking on fx details
			if (args[1].value === 0)  {return;}  //when closing fx details do nothing
			stompIdent = address.substring(10,11);                             
			stompFxIdent = args[0].value;
			logItAll('stompident',stompIdent,'stompfxident',stompFxIdent,args[1].value,'address',address.substring(10,11),'');
			stompsFxControls(stompIdent,args[0].value,'red');
		} 
		//main categories of the fx ('all', 'wah',....)
		if (address.substring(0,11) === '/fxCatShow'){ 
			stomFxIdTemp = {};
			if (args[1].value === 'all') {
				
				receive(sendIp,serverPort,'/stomp' + args[0].value + 'Sel/showFxByCat',stompFxId);
			}else {	
				stompFxIdTemp = getPartObjByKeySearch('#' + args[1].value,stompFxId);
				receive(sendIp,serverPort,'/stomp' + args[0].value + 'Sel/showFxByCat',stompFxIdTemp);	
			}
		}
		//Testbutton 
		if (address === '/button_x33') {
			j = 0;
			let inVal,outVal;
            let range_in = [],
                range_out = [];
			for(i = 0;i < 88; i++){
            //    inVal = (j / 16383) || 0;
				//if (j < 5000) {
            //    if (inVal < 0.295) {    
            //        range_in = [0,0.295];
            //        range_out = [0,2.0];
				//} else if (j < 7400){
            //    } else if (inVal < 0.44){    
            //        range_in = [0.295,0.44];
            //        range_out = [2.0,4];
				//	testval = Math.exp(Math.log(0.4) + (Math.log(0.8) - Math.log(0.4)) * (j / 16383) )
				//} else if (j < 10000) {
            //    } else if (inVal < 0.60) {                    
            //        range_in = [0.44,0.6];
            //        range_out = [4,8];
			//	} else if (inVal < 1) {                    
            //        range_in = [0.6,0.74];
            //        range_out = [8,16];	
                 //   testval = Math.exp(Math.log(5.9) + (Math.log(50) - Math.log(5.9)) * (j / 16383) )
			//	} else if (inVal < 1) {                    
			//		range_in = [0.74,1];
			//		range_out = [16,50];	
			 //   testval = Math.exp(Math.log(5.9) + (Math.log(50) - Math.log(5.9)) * (j / 16383) )
			//	}
            //    outVal = (inVal - range_in[0] ) / (range_in[1] - range_in[0]); 
            //    outVal = outVal * (range_out[1] - range_in[0]) + range_out[0];
				//testval = Math.exp(Math.log(0.378) + (Math.log(50) - Math.log(0.378)) * (j / 16383) )
			//	console.log('button_x33 ' + j + ' # ' + outVal.toFixed(1) + ' ### ' + inVal);
			    j = j + 127;
			} 
            //outVal = Math.exp(Math.log(-50) + (Math.log(0) - Math.log(-50)) * (0.5))   
            //console.log('button_x33 ' + outVal);  
			//return;
			j = 15240;
			for (i = 0; i < 20; i++ ){

				setTimeout(function () {  
					send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 32 44 ' +  ((j >> 7) & 0x7f).toString(16).padStart(2,'0') + ' ' +  (j & 0x7f).toString(16).padStart(2,'0') + ' f7');
                    //send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 32 15 ' +  ((j >> 7) & 0x7f).toString(16).padStart(2,'0') + ' 00 f7');
                    //send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 32 15 ' +  (i & 0x7f).toString(16).padStart(2,'0') + ' 00 f7');
					console.log(j);
					j = j + 127;
					
				},7000 * i );
					
				console.log('button_x33 i ' + i + '##' + j);	
			}
			console.log('button_x33 ' + args[0].value + '#' + args[1].value + '#' + ((args[1].value >> 7) & 0x7f).toString(16).padStart(2,'0') + ' ' +  (args[1].value & 0x7f).toString(16).padStart(2,'0') );
			//send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 32 15 ' +  (args[1].value & 0x7f).toString(16).padStart(2,'0') + ' ' + ((args[1].value >> 7) & 0x7f).toString(16).padStart(2,'0') + ' f7');
			//send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 32 15 ' +  ((args[1].value >> 7) & 0x7f).toString(16).padStart(2,'0') + ' ' +  (args[1].value & 0x7f).toString(16).padStart(2,'0') + ' f7');
			//send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 7f 00 f7');  //req single parameter gain vol
			//send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 7f 01 f7');  //req single parameter gain vol
			//send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 41 00 7f 0c f7');  //req single parameter gain vol
			//logItAll('0.5 ct  09 06:' +  ((parseInt( '09',16) * 128) + parseInt( '06',16)) );
			//logItAll('1.0 ct  13 74:' +  ((parseInt( '13',16) * 128) + parseInt( '74',16)) );
			//logItAll('2.0 ct  25 4b:' +  ((parseInt( '25',16) * 128) + parseInt( '4b',16)) );
			//logItAll('3.0 ct  31 1d:' +  ((parseInt( '31',16) * 128) + parseInt( '1d',16)) );
			//logItAll('4.0 ct  39 25:' +  ((parseInt( '39',16) * 128) + parseInt( '25',16)) );
			//logItAll('5.0 ct  3f 62:' +  ((parseInt( '3f',16) * 128) + parseInt( '62',16)) );
			//logItAll('10.0 ct  52 7f:' +  ((parseInt( '52',16) * 128) + parseInt( '7f',16)) );
			//logItAll('20.0 ct  66 34:' +  ((parseInt( '66',16) * 128) + parseInt( '34',16)) );
			//logItAll('30.0 ct  71 4b:' +  ((parseInt( '71',16) * 128) + parseInt( '4b',16)) );
			//logItAll('40.0 ct  79 4e:' +  ((parseInt( '79',16) * 128) + parseInt( '4e',16)) );
			//logItAll('50.0 ct  7f 7f:' +  ((parseInt( '7f',16) * 128) + parseInt( '7f',16)) );
			//return {address, args, host, port};
			
		}	

		//Scan in settings pressed, decide wether browse or performance mode is choosen
		if (address === '/scanKemper') {	
			logItAll('scan pressed',browseMode,'','','','','','');
			tempTimeout = 0
			receive(sendIp,serverPort,'/progressScan', 0 );         //set progress scan to start			
			receive('/progressScan/showprogressScan',1);            //show the fader representing the progress 
						
			if (browseMode) {				
				initRigs = 0;
				i = 0;
				try {							// delete file
					fs.unlinkSync('RIGSLIST.JSON');	
				} catch(err) {
					console.log(err);
					return;
				}
				countRigs = 0;				
				rigsList = {};
				setTimeout(function () { timeOut(0,"BROWSE"); },1000 );   //after a little waiting start perf scan
				
			} else {	
				initRigs = 0;
				i = 0;
				bankNr = 0;
				send('midi', midiDeviceName, '/control', 1,32, 0 ); //set bank to 1 in case it is on greater 1				
				try {							// delete file
					fs.unlinkSync('PERFORMANCESLIST.JSON');	
				} catch(err) {
					console.log(err);
				}
				
				perfList = {};                                                           //empty object, in this object we will store the data 
				logItAll('performance scan',Object.keys(perfList).length,'','','','','','');
				perfIndex = 0;
				setTimeout(function () { timeOut(0,"PERFORM"); },1000 );   //after a little waiting start perf scan -> done by recursion				
				bankNr = 0;
				send('midi', midiDeviceName, '/control', 1,32, bankNr );   //after scan switch to first bank select

			}								
		}	
		
		//the number of rigs or perfs and which index of it is currently shown, the reddish  button  labelled "1-18 / 19 - xxx" and so on
		if (address === '/rigsAndPerfSel') {
			logItAll('rigsandperfsel ',defNrSimShownRigsOrPerfs,args[0].value,programChangeSelOffset,'','','','');
			programChangeSelOffset = (defNrSimShownRigsOrPerfs * args[0].value);
			//update the currently available rigs or perfs depending if it is browse or performance mode
			if(browseMode) {         
				showCurrSelection(rigsList);
				initMainSel(Object.keys(rigsList).length,'');
			} else {
				bankNr = 0;
				send('midi', midiDeviceName, '/control', 1,32, bankNr );  //reset to first bank each time changing main operation mode
				showCurrSelection(perfList);
				initMainSel(Object.keys(perfList).length,'');
			}		
	
		}	
		
		//in performance mode show the five rigs of the performance
		if (address.substring(0,9) === '/perfRigs' ) {
			//if (args[0].value === 0) {return;}
			logItAll('perfrigs',args[0].value,Object.values(perfList)[args[0].value],'','','','','');
			if (!browseMode) {
				send('midi', midiDeviceName, '/control', 1,(50 + args[0].value) ,1);
				setTimeout(function () { send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 01 f7');  },300 );   //request rigname, when this is received in infilterhelper request the other parameters of the rig
				//requestRigInfo();
			}
		
		}	
		
		//in SETTINGS you can choose between several options / how many rigs or perfs you want to show at once in the main selection window
		if (address === '/nrVisibleRigsAndPerfs') {
			receive(sendIp,serverPort,'/rigsAndPerfSel', 0 );	//switch to first main category
			defNrSimShownRigsOrPerfs = args[0].value;           //choose the default, 18,24,36,48
		    programChangeSelOffset = 0;
			if (browseMode) {                                   //init switches and defaults  
				showCurrSelection(rigsList);
				initMainSel(Object.keys(rigsList).length,'');	
			} else {
				showCurrSelection(perfList);
				initMainSel(Object.keys(perfList).length,'');
			}

			
		}	
		
		//the switch to change browse to performance mode or vice versa
		if (address === '/rigSelector') {              
			programChangeSelOffset = 0;
			receive(sendIp,serverPort,'/rigsAndPerfSel', 0 );
		    if (args[0].value === 1) {                       //switched to browse mode
				receive('/scannedPerfName/showScannedPerf',0); 
				receive('/perfRigs/showRigs','{"":"","":"","":"","":"","":""}');	
				receive('/perfRigs/showPerfRigs',0);	
				receive('/rigBrowseSelLeft/showPerfRigs',1);
				receive('/rigBrowseSelRight/showPerfRigs',1);
				receive('/rigBrowseSelUp/showPerfRigs',1);				
				browseMode = true;
				showCurrSelection(rigsList);
				initMainSel(Object.keys(rigsList).length,'');	
			} else { 										//switched to performance mode
				receive('/scannedPerfName/showScannedPerf',1); 
				receive('/perfRigs/showPerfRigs',1);	
				receive('/rigBrowseSelLeft/showPerfRigs',0);
				receive('/rigBrowseSelRight/showPerfRigs',0);
				receive('/rigBrowseSelUp/showPerfRigs',0);
				browseMode = false;
				showCurrSelection(perfList);
				initMainSel(Object.keys(perfList).length,'');	
			}			
				
			receive('/progressScan/showScanProgRange','{ "min": ' + 1 + ',"max":' + 128 + '}');  //set the range of the progress bar 
			receive('/progressScan/showScanProgGrad','{ "1": "red" ,"62": "yellow","128":"green"}');  //set the colors of the progress bar 
			receive('/scanKemper/showScanType','SCAN IT'); 
				
		}
		
		//the main window to load a rig or a new performance
		if (address.substring(0,14) === '/rawSelections'){               
			logItAll('rawselections',args[0].value,pgOffsetPerf[bankNr],browseMode,bankNr,'','','');
			
			if (!browseMode) {                                        //in performance mode
			    perfHelper = (args[0].value) * 5
				if (perfHelper >= 127) {
					bankNr = 0;
					i = 0
					while (perfHelper >= 127) {						//is a bank change needed ?
                        perfHelper = perfHelper - 127;
						bankNr++;					
					}
					perfHelper = (args[0].value) * 5
					send('midi', midiDeviceName, '/control', 1,32, bankNr );
					logItAll('rawselections 1',args[0].value,Object.values(perfList)[args[0].value],'','','','','');
					updateRigsOfPerfs(args[0].value);
			
					perfHelper = 0;
				} else  {
					bankNr = 0;
					send('midi', midiDeviceName, '/control', 1,32, bankNr );
					logItAll('rawselections 2',(typeof args[0].value),'','','','','','');
				    updateRigsOfPerfs(args[0].value);
					
				}	
				if ( args[0].value === 0) {send('midi', midiDeviceName, '/program', 1, args[0].value  );}
				if ( (args[0].value > 0)  ) {
					send('midi', midiDeviceName, '/program', 1, (perfHelper +  pgOffsetPerf[bankNr])  );
				
				}
		
			} else {													//in browse
				i = 0;
				j = 0;
				send('midi', midiDeviceName, '/program', 1, args[0].value );
			}	
			setTimeout(function () { send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 01 f7');  },300 );	  //request rigname, when this is received in infilterhelper request the other parameters of the rig
			//requestRigInfo(); 											//update visible controls and infos
			return;
		}	
		
		//stomp a to x is pressed turn on or off the stomp section 
		if(address.substring(0,11) === '/rigSection') {
			logItAll('outfilter rigsection',adrIdToKemp,'','','','','','');
			if (args[0].value === 0) {
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 00 00 01 00 ' + getKeyByValue(adrIdToKemp,address) + '00 00 f7');    //turn off the subsection
			} else {
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 00 00 01 00 ' + getKeyByValue(adrIdToKemp,address) + '01 00 f7');    //turn on the subsection  
			}	
		}			
		
		//send out the values to the kemper when touching a knob of a fx
		if (address.substring(0,8) === '/FXKNOB_'){											//update of fxknobs in the gui send this to the kemper 
			logItAll('fxknob out ',args[0].value,stompIdent,stompFxIdent,fxIdentHex[stompFxIdent][address.substr(8)],'','','');
			if (typeof reqStrValue[fxIdentHex[stompFxIdent][address.substr(8)] + ' ' + stompFxIdent] === 'object'){  // fxknob where the string value should be updated by  string request 
				send('midi', midiDeviceName, '/sysex',  'f0 00 20 33 02 7f 7c 00 ' +  getKeyByValue(fxStompIdent,stompIdent) + ' ' + fxIdentHex[stompFxIdent][address.substr(8)] + ' ' + ((args[0].value >> 7) & 0x7f).toString(16).padStart(2,'0') + ' ' +  (args[0].value & 0x7f).toString(16).padStart(2,'0') + ' f7' );
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 ' +  getKeyByValue(fxStompIdent,stompIdent) + ' ' + fxIdentHex[stompFxIdent][address.substr(8)] + ' ' + ((args[0].value >> 7) & 0x7f).toString(16).padStart(2,'0') + ' ' +  (args[0].value & 0x7f).toString(16).padStart(2,'0') + ' f7'); //update values on kemper
				return;
			}
			if ((typeof notRenderableStr[fxIdentHex[stompFxIdent][address.substr(8)] + ' ' + stompFxIdent]) !== 'undefined' ) {  //send correct values if string can not be rendered and is not linear
				//receive(sendIp,serverPort,'/FXKNOBVAL_' + address.substr(8),stompIdent, notRenderableStr[fxIdentHex[stompFxIdent][address.substr(8)] + ' ' + stompFxIdent][ ~~( args[0].value / 127)] );
				updateNotRenderableControls(fxIdentHex[stompFxIdent][address.substr(8)],args[0].value,address.substr(8),'out' );
				return;

			} else {                                                      //if no string should be request, and it is no renderable value, just update the value from hex values
				
				j =  parseInt(address.substr(8)) * 3;
				k =  (parseInt(address.substr(8)) * 3)  + (fxControlsKnobSetup[stompFxIdent].length / 2);
				fxKnobFinalValue = scaleValue(args[0].value,[fxControlsKnobSetup[stompFxIdent][j + 1],fxControlsKnobSetup[stompFxIdent][j + 2]],[fxControlsKnobSetup[stompFxIdent][k + 1],fxControlsKnobSetup[stompFxIdent][k + 2]]);
						
				receive(sendIp,serverPort,'/FXKNOBVAL_' + address.substr(8),stompIdent, fxKnobFinalValue );    //update values of knobs in interface
				//return;
			}			
			if (((args[0].value >> 7) & 0x7f).toString(16).padStart(2,'0') === '00') {   // when the value is represented by 2bytes hex only calc it different 
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 ' +  getKeyByValue(fxStompIdent,stompIdent) + ' ' + fxIdentHex[stompFxIdent][address.substr(8)] + ' ' + ((args[0].value >> 7) & 0x7f).toString(16).padStart(2,'0') + ' ' +  (args[0].value & 0x7f).toString(16).padStart(2,'0') + ' f7'); //update values on kemper
			} else {
				send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00 ' +  getKeyByValue(fxStompIdent,stompIdent) + ' ' + fxIdentHex[stompFxIdent][address.substr(8)] +  (args[0].value & 0x7f).toString(16).padStart(2,'0') + ' ' + ((args[0].value >> 7) & 0x7f).toString(16).padStart(2,'0') + ' f7'); //update values on kemper
					
			}
			return;				  
			
		}			
		 
		//operations on the stomps 
		if (address.substring(0,6) === '/stomp') {   // preselect stomps  
			stompTemp = stompArgs.indexOf(address.substring(6,7)) + 1; 
			logItAll('stompArgs index',stompTemp,stompArgs[stompTemp],args[0].value,'','','','');
				
  		    if (args[0].value !== '00' && args[0].value !== 'undefined' ) {   // value of the effects of stomp a to d value '00' means off
                send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00' + stompArgs[stompTemp] + '00 ' +  args[0].value + ' f7');  //first select the effect			
     			send('midi', midiDeviceName, '/control', 1, stompArgs[stompTemp + 1], 1);                                                //after that turn on the stomp
			} else {
			   send('midi', midiDeviceName, '/control', 1,stompArgs[stompTemp + 1], 0);                                                 //turn off the stomp   
			   send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 01 00' + stompArgs[stompTemp] + '00 ' +  args[0].value + ' f7');                      // remove effect by setting it to 'off'
			}	
			//return;
			
		}	
		if (address.substring(0,5) === '/kemp') { 
			outFilterHelper(address,args[0].value);
			return;
		}	

		
		if (address === '/program') {
			//setTimeout(function () { send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 01 f7');  },300 );  //request rigname, when this is received in infilterhelper request the other parameters of the rig
			send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 01 f7');
			//requestRigInfo();
  
			if (args[2].value !== 0 ) { return {address, args, host, port} };
		} else if (address === '/sysex'){
		} else {
			return {address, args, host, port};
        }  		
    },

    oscInFilter: function(data) {

        var {host, port, address, args} = data     			 
        
		var inArgs = args.map(x=>x.value),
			outArgs = [];					
			
		logItAll('oscinfilter start',address,args[0].value,notRenderableStr['15 00 44'],'','','','');
		
		if (address === '/sysex'){
			var [value] = inArgs;
	        logItAll('infilter sysex',host,value,'','','','','');	
			if (value.includes("f0 00 20 33 00 00 07 00 00 00 01 00 ")) {  // extended string request from scanning performances and their rig names
				tempPerfHex = value.split(' ').join('').substr(26);
				
				for (i = 0; i < ( tempPerfHex.length - 2); i += 2){
					tempStr += String.fromCharCode(parseInt(tempPerfHex.substr(i,2),16));
				}	
				textSplitSysex = value.toString(16);
				logItAll('ext. str req',tempStr,( parseInt(value.split(' ').join('').substr(24,2) , 16) - 1),tempStr.localeCompare('Slot'),'','','','');
				receive(sendIp,serverPort,'/kempPerfnameText',tempStr);			
				
				if (value.includes("f0 00 20 33 00 00 07 00 00 00 01 00 00 ")) {	  //perfname received				    
					currPerfName = perfIndex + '-' + tempStr.replace(/\0.*$/g,'');    //remove unwanted "\u0000" from the end of the string
					perfList[currPerfName] = ["","","","",""];                        //make an empty performance entry
					receive(sendIp,serverPort,'/scannedPerfName',tempStr);            //update performance name in the gui when found   
					logItAll('performance received ',currPerfName,'','','','','','');
			
				} else if (  (parseInt(value.split(' ').join('').substr(24,2) , 16) > 0) && (parseInt(value.split(' ').join('').substr(24,2) , 16) < 6)	) {  //rig names with hex id 1 to 5
					if (parseInt(value.split(' ').join('').substr(24,2) , 16) === 1) {receive(sendIp,serverPort,'/scannedFirstSlotName',tempStr);}            //first slot name is printed every time 
					  
					if ((tempStr.localeCompare('Slot') !== 0) ){   																							  //when not Slot write the req. string as it is  
						perfList[currPerfName][parseInt(value.split(' ').join('').substr(24,2) , 16) - 1] = tempStr ;   
					} else {																																  //otherwise it is assumed an empty slot and labeled with number,  otherwise it just would be one slot	
						perfList[currPerfName][parseInt(value.split(' ').join('').substr(24,2) , 16) - 1] = tempStr + parseInt(value.split(' ').join('').substr(24,2) , 16); 
					}	 
				}	 
			
				tempStr = '';
				return;   // no need for further processing
		    }	 
		    if ((value === 'f0 00 20 33 00 00 01 00 00 2f 00 7f f7') ) {   //kemper is sending this sysex when switching between browse and perf mode
				//return;
			}	
            if (value.includes("f0 00 20 33 00 00 01 00 ") )    {         // singleparameter 
	           	valSplitMulti = value.split(" ");
			   	logItAll('oscinfilter singleparameter 1',fxStompIdent.hasOwnProperty(valSplitMulti[8]),valSplitMulti[8],valSplitMulti[9],valSplitMulti[10],valSplitMulti[11],'');
			   	if (fxStompIdent.hasOwnProperty(valSplitMulti[8]) && (valSplitMulti[9] === '00') ) {  //update incoming fx selection as special singleparameter  stomp a - d have at position 9 '00'     				                                                                                                                                       
					logItAll('oscinfilter singelparameter 2',fxStompIdent.hasOwnProperty(valSplitMulti[8]),valSplitMulti[8],valSplitMulti[9],valSplitMulti[10],valSplitMulti[11],'');
					if ((valSplitMulti[8] === '7f') && (valSplitMulti[9] === '00')) {  		// Fix main out Volume
						inFilterHelper(value,host);
						return;
					}  
					if ((valSplitMulti[10] === '00') && (valSplitMulti[11] === '01')) {
					   send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 42 00 ' + valSplitMulti[8] + ' 00 f7');  //multi req fx of stomp stack effects section, because we don't know the effects hex here
					} else {                                                                                       // turn the subsection on (on the device ) always sends 00 01, which is also the fx id of wah wah, so req it  
				     receive(sendIp,serverPort,'/stomp' + fxStompIdent[valSplitMulti[8]] + 'Sel', valSplitMulti[10] + ' ' + valSplitMulti[11] );
					}	   
			    } else {	
					
					if ((typeof notRenderableStr[valSplitMulti[9] + ' ' + stompFxIdent]) !== 'undefined' ){
						logItAll('oscinfilter notrenderable found',valSplitMulti[9],valSplitMulti[10],valSplitMulti[11],stompFxIdent,'','');
						updateNotRenderableControls(valSplitMulti[9],valSplitMulti[10],valSplitMulti[11],'in' );
						return;
					}
									
					inFilterHelper(value,host);		 				
			   	}
			} 
			else if ((value.includes("f0 00 20 33 02 7f 3c 00 ")) || (value.includes("f0 00 20 33 00 00 03 00 "))) { // singleparameter rigvol as string
			   	inFilterHelper(value,host);
			}
							
			//catch the multireq of stomps FX, convert the values to values like shown on kemper print these values and set the knob to the correct position
		    if (value.includes("f0 00 20 33 00 00 02 00 3")) {
        	    valSplitMulti = value.split(" ");
				stompIdent = fxStompIdent[valSplitMulti[8]];  // check stomp from hexval at pos 8
				curFxId = valSplitMulti[10] + ' ' + valSplitMulti[11]; //four hex chars define the fx id according to kemper response	
				j = 0;
			    receive(sendIp,serverPort,'/stomp' + stompIdent + 'Sel', valSplitMulti[10] + ' ' + valSplitMulti[11] );    // set stomp[x]Sel widget 	
				logItAll('fxmulticreq 20 33 00 00 02 00 3 ',valSplitMulti,stompIdent,curFxId,fxIdentHex[curFxId],'','','');
			    for (const[keyid,valueid] of Object.entries(adrIdToKemp) ) {
				    if (keyid.substring(0,2) === valSplitMulti[8]){
						receive(sendIp,serverPort,valueid , parseInt(valSplitMulti[17]) );
					}	
				}	

    			for (i = 0; i < (fxIdentHex[curFxId].length / 2); i++ ) {
					stompTemp = (parseInt(fxIdentHex[curFxId][i],16) * 2) + 10;  // starting position of hex string 
	                knobVal =   (parseInt( valSplitMulti[stompTemp],16) * 128) + parseInt( valSplitMulti[stompTemp + 1],16);
					logItAll('fxmulticontrolud ',knobVal,stompTemp,curFxId,'','','','');
					k = j + (fxControlsKnobSetup[curFxId].length / 2);
					//fxKnobFinalValue = scaleValue(knobVal,[fxControlsKnobSetup[curFxId][j + 1],fxControlsKnobSetup[curFxId][j + 2]],[fxControlsKnobVal[curFxId][j + 1],fxControlsKnobVal[curFxId][j + 2]]);
					fxKnobFinalValue = scaleValue(knobVal,[fxControlsKnobSetup[curFxId][j + 1],fxControlsKnobSetup[curFxId][j + 2]],[fxControlsKnobSetup[curFxId][k + 1],fxControlsKnobSetup[curFxId][k + 2]]);
					receive(sendIp,serverPort,'/FXKNOB_' + i,stompIdent, knobVal );                       
					receive(sendIp,serverPort,'/FXKNOBVAL_' + i,stompIdent, fxKnobFinalValue );
				  j = j + 3;
				}					
			
			} else if ( (value.includes("f0 00 20 33 00 00 02 00 09")) || (value.includes("f0 00 20 33 00 00 02 00 0b")) ) {  //update input section
				valSplitMulti = value.split(" ");
			    curFxId = valSplitMulti[8] + ' ' + valSplitMulti[9];
				j = 0;
				i = 0;
				for (const[keyid,valueid] of Object.entries(adrIdToKemp) ) {              // check all key value pairs of object adrIdToKemp
				    if (keyid.substring(0,2) === valSplitMulti[8]){                       // we need all with values like 90 xx  
					    stompTemp = (parseInt(fxIdentHex[curFxId][i],16) * 2) + 10;  // starting position of hex string
				        knobVal =   (parseInt( valSplitMulti[stompTemp],16) * 128) + parseInt( valSplitMulti[stompTemp + 1],16);  // get the value of 4 hex bytes
                        k = j + (fxControlsKnobSetup[curFxId].length / 2);					//the values to which the value should be converted on the knobs starts at the second half of the values
						fxKnobFinalValue = scaleValue(knobVal,[fxControlsKnobSetup[curFxId][j + 1],fxControlsKnobSetup[curFxId][j + 2]],[fxControlsKnobSetup[curFxId][k + 1],fxControlsKnobSetup[curFxId][k + 2]]);  // get the correct values for the according ranges
						logItAll('fxmulticontrolid 2 ',fxControlsKnobSetup[curFxId][j + 1],curFxId,stompTemp,knobVal,fxKnobFinalValue,'','');
					    receive(sendIp,serverPort,valueid, knobVal );                              //update knobs positin by integer value
					    receive(sendIp,serverPort,valueid + 'Text', fxKnobFinalValue );            // display according correct value in the text field beneath  
                        i = i + 1;						
					    j = j + 3;
					}	
				}							
				
			} else if(value.includes("f0 00 20 33 00 00 02 00 7f")) {  // output Section
                valSplitMulti = value.split(" ");
				curFxId = valSplitMulti[8] + ' ' + valSplitMulti[9];
				i = 0;
				j = 0;
				for (const[keyid,valueid] of Object.entries(adrIdToKemp) ) {              // check all key value pairs of object adrIdToKemp
				    if (keyid.substring(0,2) === valSplitMulti[8]){                       // we need all with values like 90 xx  
						stompTemp = (parseInt(fxIdentHex[curFxId][i],16) * 2) + 10;                      // starting position of hex string
						updateKnobValKemper = 'f0 00 20 33 02 7f 7c 00 ' + getKeyByValue(adrIdToKemp,valueid) + ' ' +  valSplitMulti[stompTemp] + ' ' + valSplitMulti[stompTemp + 1] + ' f7'; 						
						send('midi', midiDeviceName, '/sysex', updateKnobValKemper);                   //ask for the db strings to display
                        i = i + 1;						
					    j = j + 3;																		
					}	
				}					
				
			} else if  (value.includes("f0 00 20 33 00 00 02 00 0b")) { 			   				
			}				
		
		}
		
		if (address === '/control') {                    							 //incomming control messages from kemper 
			if ( (args[1].value >= 50 ) && (args[1].value <= 54) && !browseMode )  {		//update the gui when the slot is changing on the kemper
				logItAll('infilter control 1',args[0].value,args[1].value,'','','','','');
				receive(sendIp,serverPort,'/perfRigs',(args[1].value - 50));
			
			}
			if ( (args[1].value === 47 ) && (args[2].value < 127) && !browseMode )  { 		//update the gui (performance) when the performance is changed on the kemper
				logItAll('infilter control 2',args[0].value,args[1].value,'','','','','');
				receive(sendIp,serverPort,'/rawSelections',args[2].value);	
				updateRigsOfPerfs(args[2].value);		   
			}			
            return;    			
		}
		if (address === '/program') {
			logItAll('infilter program ',args[0].value,args[1].value,'','','','','');
			if ((!browseMode) && (args[1].value === 0 )){
				receive(sendIp,serverPort,'/perfRigs', 0 );
				setTimeout(function () { send('midi', midiDeviceName, '/sysex', 'f0 00 20 33 02 7f 43 00 00 01 f7');  },300 );  //request rigname, when this is received in infilterhelper request the other parameters of the rig
				//requestRigInfo();	
			}	
		}	       		
		return {address, args, host, port};
    }


}
