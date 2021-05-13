//Here we use jQuery .on() method to trigger the events
//jQuery is a JavaScript library designed to simplify HTML DOM tree traversal and manipulation, as well as event handling, CSS animation, and Ajax
//Creating an image instance
var img = new Image();
//Getting the canvas
var canvas = document.getElementById("canvas");
//Forming the context(ctx) to opearte on the image,we load an image hence a 2d one
var ctx = canvas.getContext("2d");
var fileName = "";
var hexColor = "#ffffff";

//In the advanced version of the filter what we use is mulitple layer function of the camanJS,where it gives us a chance to work on mulitple layers stacked on one another.
$(document).ready(function () { 
    $("#maxrgb-btn").on("click", function (e) {
        hexColor = $("#hex-color").val();
        Caman("#canvas", function () {
            this.revert(false);
            this.newLayer(function () {
                this.fillColor(hexColor);
                this.setBlendingMode("maxrgb");
            });
            this.render();
        });
    });

    $("#minrgb-btn").on("click", function (e) {
        hexColor = $("#hex-color").val();
        Caman("#canvas", function () {
            this.revert(false);
            this.newLayer(function () {
                this.fillColor(hexColor);
                this.setBlendingMode("minrgb");
            });
            this.render();
        });
    });

    $("#threshold-btn").on("click", function (e) {
        Caman("#canvas", function () {
            this.revert(false);
            this.threshold(100);
            this.render();
        });
    });

    $("#greyscale-btn").on("click", function (e) {
        Caman("#canvas", function () {
            this.revert(false);
            this.greyscale();
            this.render();
        });
    });



    //Whenever the download button is clicked,this get triggered
    $("#download-btn").on("click", function (e) {
        var fileExtension = fileName.slice(-4);
        if (fileExtension == ".jpg" || fileExtension == ".png") {
            var actualName = fileName.substring(0, fileName.length - 4);
        }
        download(canvas, actualName + "-edited.jpg");
    });

    //when ever there is a click on the upload,this gets triggered
    $("#upload-file").on("change", function () {
        //In the readerList we will have the file selected by user at files[0]
        var file = document.querySelector("#upload-file").files[0];
        //We create a new instance for the FileReader()
        var reader = new FileReader();

        if (file) {
            fileName = file.name;
            reader.readAsDataURL(file);
        }

        //The onload event for the FileReader is triggered after the selected file has been read successfully. 
        reader.addEventListener(
            "load",
            function () {
                img = new Image();
                img.src = reader.result;
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    $("#canvas").removeAttr("data-caman-id");
                };
            },
            false
        );
    });
});

//you can control how the corresponding pixels of the current layer and parent layer mix together in order to produce the final result.
Caman.Event.listen("processStart", function (job) {
    $(".process-message").text("Applying: " + job.name);
});


//Registering a custom blendmode,we tell what to do with our very own type of handling with 2 layers
//RGB values for different pixels on the current layer and corresponding pixels on the parent layer
//This function returns the final rgb values.
//This custom blendmode maxrgb sets the final value to 255 if the current layer pixel value is >128
Caman.Blender.register("maxrgb", function (rgbaLayer, rgbaParent) {
    return {
        r: rgbaParent.r > 128 ? 255 : rgbaParent.r - rgbaLayer.r,
        g: rgbaParent.g > 128 ? 255 : rgbaParent.g - rgbaLayer.g,
        b: rgbaParent.b > 128 ? 255 : rgbaParent.b - rgbaLayer.b
    };
});

//Another blend mode 
//Here the value of the pixel values of parent would be set to 0 if they are greater than 128
Caman.Blender.register("minrgb", function (rgbaLayer, rgbaParent) {
    return {
        r: rgbaParent.r < 128 ? rgbaParent.r + rgbaLayer.r : 0,
        g: rgbaParent.g < 128 ? rgbaParent.g + rgbaLayer.r : 0,
        b: rgbaParent.b < 128 ? rgbaParent.r + rgbaLayer.r : 0
    };
});

//CamanJS gives us 2 types of filters - pixel based,where we opearte on pixels and convolution kernel based
//In kernel based we determine the color of certain pixel based on the pixels around it.
//In pixel based  The final RGB values for that particular pixel are not affected by the surrounding pixels

//Creating a threshold filter.
//we will allow the users to pass a threshold value. 
//If the luminosity of a particular pixel is above the user provided limit, that pixel will turn white.
// If the luminosity of a particular pixel is less than the user provided limit, that pixel will turn black.
Caman.Filter.register("threshold", function (limit) {
    this.process("threshold", function (rgba) {
        var lumin = 0.299 * rgba.r +  0.587 * rgba.g + 0.114 * rgba.b;
        rgba.r = lumin > limit ? 255 : 0;
        rgba.g = lumin > limit ? 255 : 0;
        rgba.b = lumin > limit ? 255 : 0;
    });
    return this;
});

//Filter we want to design is greyscale.
//Any filter that we create must call the process() method.
//This method accepts the filter name and a callback function as parameters.
//used the greyscale formula
//Grayscale = 0.299R + 0.587G + 0.114B.
Caman.Filter.register("greyscale", function () {
    this.process("greyscale", function (rgba) {
        var lumin = 0.299 * rgba.r +  0.587 * rgba.g + 0.114 * rgba.b;
        rgba.r = lumin;
        rgba.g = lumin;
        rgba.b = lumin;
    });
    return this;
});



function download(canvas, filename) {
    var e;
    var lnk = document.createElement("a");

    lnk.download = filename;

    lnk.href = canvas.toDataURL("image/jpeg", 0.8);

    if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent(
            "click",
            true,
            true,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        );
        lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
        lnk.fireEvent("onclick");
    }
}