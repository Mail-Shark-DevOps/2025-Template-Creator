/**
 * Created by Todd in March, 2019. Modified at various times over the years..
 */
const { path, fs, exec, dirname } = window.api;
// window.$ = window.jQuery = require('jquery');
// const applescript = require("applescript");
// var fs = require("fs-extra");
// var path = require("path");
// const exec = require('child_process').exec;
// var Promise = require("bluebird");

// const $ = window.electronAPI.$;

$(document).ready(() => {
    console.log("jQuery with context isolation is working!");
});

var inddDir = path.join(dirname, ".", "folderstructure");
var myDir = path.join(dirname, ".");
var theYear = new Date().getFullYear();

// $("#date").append("<option value='none'>None</option>");

// Populate drop down with years
// $("#date").append("<option value='none'>None</option>");
for (i=0; i<20; i++) {
    var backYear = theYear - 3 + i;
    $("#date").append("<option value='" + backYear + "'>" + backYear + "</option>");
};

// Load Adobe Software!
var linkInddScript = myDir + '/linkindesign.applescript'
doAppleScript(linkInddScript, "", function(achieved) {
    if (achieved = "Achieved InDesign") {
        var linkAiScript = myDir + '/linkillustrator.applescript'
        // Disappear loading div
        $("#loaded-text").text("Opening Illustrator...");
        doAppleScript(linkAiScript, "", function(achieved) {
            $("#preparing-text").css("display", "none");
            $("#loaded-text").text("Ready!").css("color", "#4ba666");
            $("#loading-fill").delay("slow").fadeOut("slow");
        });
    }
});

// Select current year
// $('#date option[value="' + theYear + '"]').attr("selected",true);
$('#date option[value="none"]').attr("selected",true);


$("#btn-create").click(async function(){



    // Get folder path
    var targetPath = $("#folder-path").text();
    // $('#folder-path').text(folderPath);


    var getYear = $( "#date option:selected" ).text();

    const copyRight = (getYear == "None")
    ? `\xA9Mail Shark\xAE`
    :  `\xA9${getYear} Mail Shark\xAE`

    const dir = (getYear == "None")
    ? `${targetPath}/Mail Shark Design Templates`
    : `${targetPath}/${getYear} Mail Shark Templates`


    async function doThis() {
        // Get texts, put into array to pass to applescript
        var sendArray = [] // Send to applescript

        //print the txt files in the current directory

        var myFiles = await getFilesFromDir(dir, [".indd", ".ai"]);

        console.log(myFiles);

        var myProg = 0;
        console.log("Initial progress is " + myProg);
        $("#progress-bar").css("width", String(myProg) + "%")

        // Had to use callback to prevent rapidfire osascript fires
        var y = 1;
        
        await loopArray(myFiles, y, targetPath, getYear, copyRight, dir, myProg);
    };


    // Copy folderstructure to targetFolder
    try {
        // if (getYear == "None") {
        //     getYear = ""
        // }
        await fs.copy(inddDir, dir);
        await doThis();
    } catch (e) {
        alert("A folder already exists here. Choose a different location.")
        return
    }



});

var loopArray = async function(arr, y, targetPath, getYear, copyRight, dir, myProg) {

    for (let p = 0; p < arr.length; p++) {

        try {
            sendArray = [] // Send to applescript
            sendArray.push(copyRight);
            sendArray.push($("#website").val());
            sendArray.push($("#phone").val());
            sendArray.push($("#indecia1").val());
            sendArray.push($("#indecia2").val());
            sendArray.push($("#indecia3").val());
            sendArray.push($("#indecia4").val());
            sendArray.push(inddDir);
            sendArray.push(getYear);
            sendArray.push(dir + arr[p]);
    
            console.log("Doing " + arr[p]);
    
            console.log(`APPLESCRIPT VARIABLE!
                set myCopy to "${copyRight}"
                set myWeb to "${$("#website").val()}"
                set myPhone to "${$("#phone").val()}"
                set indec1 to "${$("#indecia1").val()}"
                set indec2 to "${$("#indecia2").val()}"
                set indec3 to "${$("#indecia3").val()}"
                set indec4 to "${$("#indecia4").val()}"
                set myDir to "${inddDir}"
                set myYear to "${getYear}"
                set filePath to "${dir + arr[p]}"
            `)
        
            var myAppScript = myDir + '/myappscript.applescript'
        
            $("#status").text("Processing file... " + arr[p]);
            // await doAppleScript(myAppScript, sendArray);
    
            if (sendArray == "") {
                var cmd =  "osascript '" + myAppScript + "'";
            } else {
                var cmd = "osascript '" + myAppScript + "' '" + sendArray.join("' '") + "'";
            }
            
            console.log(cmd)
            // await execute(cmd, (output) => {
            //     callback(output);
            // });
            try {
                let output = await executeAppleScript(cmd);
                console.log("AppleScript output:", output);
    
                if (output !== "Completed!") {
                    throw new Error(`Unexpected output: ${output}`);
                }
            } catch (error) {
                console.error("Error executing AppleScript:", error);
                $("#status").text(`Error processing ${arr[p]}`);
                return; // Exit loop on failure
            }
    
            console.log("Finished processing:", arr[p]);
    
            console.log(myProg);
            myProg = y / arr.length * 100;
            y++;
            $("#progress-bar").css("width", String(myProg) + "%")
    
            console.log("Done " + arr[p]);
        } catch (e) {
            console.error(e);
        };
      
    
    };

    console.log("done");
    $("#progress-bar").css("width", "0%")
    $("#progress-container").css("width", "200px")
    $("#status").text("Done!")

};

function executeAppleScript(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(stdout.trim()); // Trim to avoid extra newlines
        });
    });
}

$("#btn-stage-two").click(function(){  // Oct 27, 2020: Notice the .click is crossed out... is that deprecated? .on() is preferred
    $("#stage-two").show();
    $("#stage-one").fadeOut(function() {
        $("#stage-two-overflow").css("overflow", "visible");
        $("#stage-two").animate({
            left:'0px'
        });
    });
});

$("#btn-stage-two-again").click(function(){
    $("#stage-two").show();
    $("#stage-three").fadeOut(function() {
        $("#stage-two-overflow").css("overflow", "visible");
        $("#stage-two").animate({
            left:'0px'
        });
        $("#stage-three").css("left", "335px").css("transform", "translateY(-50%)");
    });
});

// document.getElementById("target-folder").onchange = function(e) {
//     console.log(document.getElementById("target-folder").files);
//     var targetPath = document.getElementById("target-folder").files[0].path;
//     $("#folder-path").text(targetPath);
//     $("#stage-two").fadeOut(function() {
//         $("#stage-three").show();
//         $("#stage-three-overflow").css("overflow", "visible");
//         $("#stage-three").animate({
//             left:'0px'
//         });
//         $("#stage-two").css("left", "335px").css("transform", "translateY(-50%)");

//     });

    
// }

$("#target-folder").on('click', async () => {

    const folderPath = await window.api.selectFolder();
    if (folderPath) {
        console.log('Selected folder:', folderPath);
        $('#folder-path').text(folderPath);

        $("#stage-two").fadeOut(function() {
            $("#stage-three").show();
            $("#stage-three-overflow").css("overflow", "visible");
            $("#stage-three").animate({
                left: '0px'
            });
            $("#stage-two").css("left", "335px").css("transform", "translateY(-50%)");
        });
    } else {
        console.error('No folder selected');
    };
});
//     const files = document.getElementById("target-folder").files;
//     if (files.length > 0) {
//         // Get the directory path from the first file's webkitRelativePath
//         const targetPath = files[0].webkitRelativePath.split('/')[0];
//         const fullPath = path.join(files[0].path, targetPath);

//         console.log(files);
//         $("#folder-path").text(fullPath);
//         $("#stage-two").fadeOut(function() {
//             $("#stage-three").show();
//             $("#stage-three-overflow").css("overflow", "visible");
//             $("#stage-three").animate({
//                 left: '0px'
//             });
//             $("#stage-two").css("left", "335px").css("transform", "translateY(-50%)");
//         });
//     } else {
//         console.error("No files selected");
//     }
// }

$("#btn-stage-one").click(function(){
    $("#stage-two").fadeOut(function() {
        $("#stage-two").css("left", "335px").css("transform", "translateY(-50%)");
        $("#stage-one").fadeIn();
    });
});

// Had to use callback to prevent rapidfire osascript fires
async function doAppleScript(scriptFile, myArray, callback) {
    // applescript.execFile(scriptFile, myArray, (err, rtn) => {
    //     callback();
    //     if (err) {
    //         console.log(err);
    //         callback();
    //     }
    // })

    if (myArray == "") {
        var cmd =  "osascript '" + scriptFile + "'";
    } else {
        var cmd = "osascript '" + scriptFile + "' '" + myArray.join("' '") + "'";
    }
    // Testing bash execution'
    
    console.log(cmd)
    execute(cmd, (output) => {
        callback(output);
    });

}

async function getFilesFromDir(dir, fileTypes) {
    var filesToReturn = [];
    async function walkDir(currentPath) {
      var files = fs.readdirSync(currentPath);
        for (var i in files) {
            if (files[i] == ".DS_Store") {
                continue;
            };
            var curFile = path.join(currentPath, files[i]);   

            if (fs.existsSync(curFile)) {


                try {
                    const stats = await window.api.getFileStats(curFile);
                    console.log('Is file:', stats.isFile);
                    console.log('Is directory:', stats.isDirectory);
                    console.log('Size:', stats.size);

                    if (stats.isFile && fileTypes.includes(path.extname(curFile))) {
                        filesToReturn.push(curFile.replace(dir, ''));
                    } else if (stats.isDirectory) {
                        await walkDir(curFile);
                    }
            
                } catch (err) {
                    console.error('Error getting file stats:', err);
                }
            } else {
                console.error(`Path does not exist: ${curFile}`);
            }   

         


            // if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
            //   filesToReturn.push(curFile.replace(dir, ''));
            // } else if (fs.statSync(curFile).isDirectory()) {
            //  walkDir(curFile);
            // }
        }     
    };
    await walkDir(dir);
    return filesToReturn; 
  }

// Run shell script
function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        if (error) {
            console.log(error);
        }
        if (stderr) {
            console.log(stderr);
        }
        callback(stdout); 
    });
};