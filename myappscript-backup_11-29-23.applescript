(*
    Created by Todd in March, 2019. Modified at various times over the years.
*)

(*
set myCopy to "©Mail Shark®"
set myWeb to "www.GoMailShark.com"
set myPhone to "484-652-7990"
set indec1 to "PRST STD"
set indec2 to "US POSTAGE PAID"
set indec3 to "READING, PA"
set indec4 to "PERMIT #412"
set myDir to "/Users/mattshark/Documents/Yearly Template Files/Template Working Files/2019 Templates (Electron) (Yarn)/folderstructure"
set myYear to "None"
set filePath to "/Users/mattshark/Documents/Yearly Template Files/Template Working Files/2024-Templates/Version-Exports/2024_Version-11_Final-Export-Hopefully/Mail Shark Design Templates/2SBT - 2 Sided Flyer/2SBT - 2 Sided Flyer-.ai"
*)
on run argv
	try
		-- get values from electron
		set {myCopy, myWeb, myPhone, indec1, indec2, indec3, indec4, myDir, myYear, filePath} to {(item 1 of argv), (item 2 of argv), (item 3 of argv), (item 4 of argv), (item 5 of argv), (item 6 of argv), (item 7 of argv), (item 8 of argv), (item 9 of argv), (item 10 of argv)}
		
		-- get path to indd files
		--set inddPath to POSIX file (myDir & "/indd") as alias
		-- Loop through every folder in the new folder
		if myYear is "None" then
			set myYear to ""
		end if
		tell application "Finder"
			set aFile to (POSIX file filePath as alias)
			
			set AppleScript's text item delimiters to "."
			set fileName to first text item of (name of (info for aFile))
			set fileName to my findAndReplaceInText(fileName, "2020", myYear)
			-- Create folders at location of aFile
			-- If they already exist, make paths to existing folder
			set parentFolder to (container of aFile)
			try
				set indesignFolder to make new folder at parentFolder with properties {name:"InDesign"}
			on error
				set indesignFolder to ((parentFolder as text) & "InDesign:")
			end try
			try
				set idmlFolder to make new folder at indesignFolder with properties {name:"CS4 or 5"}
			on error
				set idmlFolder to ((indesignFolder as text) & "CS4 or 5:")
			end try
			try
				set indtFolder to make new folder at indesignFolder with properties {name:"CS6+"}
			on error -- Already exists
				set indtFolder to ((indesignFolder as text) & "CS6+:")
			end try
			try
				set aiFolder to make new folder at parentFolder with properties {name:"Illustrator"}
			on error -- Already exists
				set aiFolder to ((parentFolder as text) & "Illustrator:")
			end try
			try
				set aiCCFolder to make new folder at aiFolder with properties {name:"CC"}
			on error -- Already exists
				set aiCCFolder to ((aiFolder as text) & "CC:")
			end try
			try
				set aiCS6Folder to make new folder at aiFolder with properties {name:"CS6"}
			on error -- Already exists
				set aiCS6Folder to ((aiFolder as text) & "CS6:")
			end try
			try
				set aiCS5Folder to make new folder at aiFolder with properties {name:"CS5"}
			on error -- Already exists
				set aiCS5Folder to ((aiFolder as text) & "CS5:")
			end try
			try
				set aiCS4Folder to make new folder at aiFolder with properties {name:"CS4"}
			on error -- Already exists
				set aiCS4Folder to ((aiFolder as text) & "CS4:")
			end try
			try
				set pdfFolder to make new folder at parentFolder with properties {name:"PDF"}
			on error -- Already exists
				set pdfFolder to ((parentFolder as text) & "PDF:")
			end try
			
			
			if (name extension of aFile as text) is "indd" then
				-- BEGIN INDD LOOP
				-- Open file in InDesign
				tell application id "com.adobe.indesign"
					activate
					-- Open file and assign needed variables
					set user interaction level of script preferences to never interact
					open aFile
					
					-- Wait for document to be open
					repeat
						try
							set activeDoc to active document
							exit repeat
						end try
					end repeat
					set activeWindow to active window
					
					-- Focus on page 1, zoom to cmd+0 level
					tell activeWindow
						set active page to page 1 of activeDoc
						zoom given fit page
					end tell
					
					-- Unlock and show all layers
					set locked of every layer of activeDoc to false
					set visible of every layer of activeDoc to true
					
					-- Find / replace text
					my findChangeText("<<copyright>>", myCopy)
					my findChangeText("<<website>>", myWeb)
					my findChangeText("<<phone>>", myPhone)
					my findChangeText("<<postage1>>", indec1)
					my findChangeText("<<postage2>>", indec2)
					my findChangeText("<<postage3>>", indec3)
					my findChangeText("<<postage4>>", indec4)
					my findChangeText("<<CODE>>", "CODE")
					
					-- Outline tagline
					(*
                        set allFrames to text frames of activeDoc
                        repeat with eachFrame in allFrames
                            if eachFrame's label is "tagline" then
                                tell eachFrame to create outlines
                            else if eachFrame's label is "postage" then
                                tell eachFrame to create outlines
                            end if
                        end repeat
                        *)
					
					-- Lock & hide layers based on layer color
					(*
                                "Light Blue" = Locked & Visible
                                "Blue" = Locked & Not Visible
                                "Red" = Unlocked & Active
                            *)
					set allLayers to every layer of activeDoc
					repeat with aLayer in allLayers
						set layerColor to (layer color of aLayer as string)
						if layerColor is "light blue" then
							set locked of aLayer to true
							set visible of aLayer to true
						else if layerColor is "blue" then
							set locked of aLayer to true
							set visible of aLayer to false
						else
							set locked of aLayer to false
							set visible of aLayer to true
							set active layer of activeWindow to aLayer
						end if
						-- We need to turn off the first item in the layer whose name contains "Alternative"
						set layerName to name of aLayer
						if layerName contains "Alternative" then
							set visible of (page item 1 of aLayer) to false
						end if
					end repeat
					
					-- Save files
					
					-- idml
					export activeDoc to (POSIX path of (idmlFolder as string) & (fileName & ".idml")) format InDesign markup
					-- indt
					tell activeDoc to save to ((indtFolder as string) & (fileName & ".indt")) with stationary
					
					-- Close doc without saving
					tell activeDoc to close saving no
					set user interaction level of script preferences to interact with all
				end tell
			else if (name extension of aFile as text) is "ai" then
				-- BEGIN AI LOOP
				tell application id "com.adobe.illustrator"
					activate
					set user interaction level to never interact
					open aFile
					
					-- Wait for doc to open
					repeat
						try
							set activeDoc to current document
							exit repeat
						end try
					end repeat
					
					-- Unlock and make visible every layer
					set allLayers to layers of current document
					repeat with aLayer in allLayers
						set locked of aLayer to false
						set visible of aLayer to true
					end repeat
					
					-- Find change text for taglines & indecia
					my findReplaceAi("<<copyright>>", myCopy)
					my findReplaceAi("<<website>>", myWeb)
					my findReplaceAi("<<phone>>", myPhone)
					my findReplaceAi("<<postage1>>", indec1)
					my findReplaceAi("<<postage2>>", indec2)
					my findReplaceAi("<<postage3>>", indec3)
					my findReplaceAi("<<postage4>>", indec4)
					my findReplaceAi("<<CODE>>", "CODE")
					
					-- Lock / visible layers based on color
					set allLayers to every layer of current document
					repeat with aLayer in allLayers
						-- greens are different
						set gRGB to green of color of aLayer
						if (gRGB as integer) is 79 then -- visible unlocked
							set locked of aLayer to false
							set visible of aLayer to true
						else if (gRGB as integer) is 128 then -- visible locked
							set locked of aLayer to true
							set visible of aLayer to true
						else -- (probably 51, invisible locked)
							set locked of aLayer to true
							set visible of aLayer to false
						end if
						-- We need to turn off the first item in the layer whose name contains "Alternative"
						set layerName to name of aLayer
						if layerName contains "Alternative" then
							set visible of aLayer to true
							set locked of aLayer to false
							set hidden of page item 1 of aLayer to true
							set locked of aLayer to true
							set visible of aLayer to false
						end if
					end repeat
					
					-- Figure out if we save AIs or PDFs
					set nameTick to text -1 of fileName
					if nameTick is "+" or nameTick is "-" then
						set stripFileName to text 1 thru -2 of fileName
					else
						set stripFileName to fileName
					end if
					
					-- Make paths for AI output
					set CCpath to (POSIX path of (aiCCFolder as string) & (stripFileName & " CC.ai"))
					set CS4path to (POSIX path of (aiCS4Folder as string) & (stripFileName & " CS4.ai"))
					set CS5path to (POSIX path of (aiCS5Folder as string) & (stripFileName & " CS5.ai"))
					set CS6path to (POSIX path of (aiCS6Folder as string) & (stripFileName & " CS6.ai"))
					
					set PDFpath to (POSIX path of (pdfFolder as string) & (stripFileName & ".pdf"))
					set otherPDFPath to (POSIX path of (pdfFolder as string) & (fileName & ".pdf"))
					-- set PDFpath to 
					
					-- Save to files
					if nameTick is "-" then
						-- Save AI files
						save current document in file CCpath as Illustrator with options {class:Illustrator save options, compatibility:Illustrator 17}
						save current document in file CS4path as Illustrator with options {class:Illustrator save options, compatibility:Illustrator 14}
						save current document in file CS5path as Illustrator with options {class:Illustrator save options, compatibility:Illustrator 15}
						save current document in file CS6path as Illustrator with options {class:Illustrator save options, compatibility:Illustrator 16}
						
					else if nameTick is "+" then
						-- Save as PDF
						-- Unlock and make visible every layer
						set allLayers to layers of current document
						repeat with aLayer in allLayers
							-- Only make layers with + in name visible
							if name of aLayer contains "+" then
								set visible of aLayer to true
							else
								set visible of aLayer to false
							end if
							
						end repeat
						
						save current document in file PDFpath as pdf with options {class:PDF save options, PDF preset:"[High Quality Print]"}
						
					else
						-- Save to AI
						save current document in file CCpath as Illustrator with options {class:Illustrator save options, compatibility:Illustrator 24}
						save current document in file CS4path as Illustrator with options {class:Illustrator save options, compatibility:Illustrator 14}
						save current document in file CS5path as Illustrator with options {class:Illustrator save options, compatibility:Illustrator 15}
						save current document in file CS6path as Illustrator with options {class:Illustrator save options, compatibility:Illustrator 16}
						-- then save to PDF
						save current document in file otherPDFPath as pdf with options {class:PDF save options, PDF preset:"[High Quality Print]"}
					end if
					
					-- 
					
					close current document saving no
					set user interaction level to interact with all
					
				end tell
				
				tell application "Finder"
					set plusOrMinus to text -1 of fileName
					if plusOrMinus is "-" then
						set filePathCC to (CCpath as POSIX file) as alias
						set filePathCS4 to (CS4path as POSIX file) as alias
						set filePathCS5 to (CS5path as POSIX file) as alias
						set filePathCS6 to (CS6path as POSIX file) as alias
						set newFileName to text 1 thru -2 of fileName
						set the name of file filePathCC to newFileName & ".ait"
						set the name of file filePathCS4 to newFileName & ".ait"
						set the name of file filePathCS5 to newFileName & ".ait"
						set the name of file filePathCS6 to newFileName & ".ait"
						
					end if
				end tell
			end if
			--display dialog "Continue..." -- DEBUG
			-- Remove current file
			delete aFile
		end tell
		return "done"
	on error err
		display dialog err
	end try
end run

on findChangeText(fromText, toText)
	tell application id "com.adobe.indesign"
		set find text preferences to nothing
		set change text preferences to nothing
		set find what of find text preferences to fromText
		set change to of change text preferences to toText
		tell active document to change text
		set find text preferences to nothing
		set change text preferences to nothing
	end tell
end findChangeText

on findReplaceAi(findText, changeText)
	tell application id "com.adobe.illustrator"
		set textFrames to text frames of current document
		repeat with aFrame in textFrames
			if contents of aFrame is findText then
				set contents of aFrame to changeText
			end if
		end repeat
	end tell
end findReplaceAi

-- https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/ManipulateText.html
on findAndReplaceInText(theText, theSearchString, theReplacementString)
	set AppleScript's text item delimiters to theSearchString
	set theTextItems to every text item of theText
	set AppleScript's text item delimiters to theReplacementString
	set theText to theTextItems as string
	set AppleScript's text item delimiters to ""
	return theText
end findAndReplaceInText
