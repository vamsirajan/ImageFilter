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
//Normal mode just gives the value of the final color to be equal to the color of the new layer.
$(document).ready(function () {
  $('#normal-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('normal');
      });
      this.render();
    });
  });

  //multiply blend mode determines the final color of a pixel by multiplying the individual channels together 
  //and then dividing the result by 255.
  $('#multiply-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('multiply');
      });
      this.render();
    });
  });
  //screen blend mode, the final color is obtained by inverting the colors of each layer
  //multiplying them, and then again inverting the result. 
  $('#screen-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('screen');
      });
      this.render();
    });
  });

  //overlay blend mode acts like multiply if the bottom color is darker,
  //and it acts like screen if the bottom color is lighter.
  $('#overlay-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('overlay');
      });
      this.render();
    });
  });

  //diff between 2 layers
  $('#difference-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('difference');
      });
      this.render();
    });
  });

  //addition between 2 layers
  $('#addition-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('addition');
      });
      this.render();
    });
  });


 //exclusion blend mode is somewhat similar to difference, but it sets the contrast to a lower value
  $('#exclusion-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('exclusion');
      });
      this.render();
    });
  });

  //might be to soften the colour
  $('#softlight-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('softLight');
      });
      this.render();
    });
  });

  //The lighten blend mode sets the final color of a pixel to be equal to the highest value of individual color channels
  $('#lighten-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('lighten');
      });
      this.render();
    });
  });
 
  // darken blend mode sets the final color of a pixel to be equal to the lowest value of individual color channels.
  $('#darken-btn').on('click', function (e) {
    hexColor = $("#hex-color").val();
    Caman("#canvas", function () {
      this.revert(false);
      this.newLayer(function () {
        this.fillColor(hexColor);
        this.setBlendingMode('darken');
      });
      this.render();
    });
  });

   
  $("#download-btn").on("click", function (e) {
    var fileExtension = fileName.slice(-4);
    if (fileExtension == ".jpg" || fileExtension == ".png") {
      var actualName = fileName.substring(0, fileName.length - 4);
    }
    download(canvas, actualName + "-edited.jpg");
  });

  $("#upload-file").on("change", function () {
    var file = document.querySelector("#upload-file").files[0];
    var reader = new FileReader();

    if (file) {
      fileName = file.name;
      reader.readAsDataURL(file);
    }

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