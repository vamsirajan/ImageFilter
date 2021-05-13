const canvas = document.getElementById("canvas");
// getContext returns a drawing context on the canvas
//"2d", leading to the creation of a CanvasRenderingContext2D object representing a two-dimensional rendering context.
//CanvasRenderingContext2D includes shapes, text, images, and other objects.
const ctx = canvas.getContext("2d");

//All we did here is to place the image in the convas we created using HTML earlier

//Image() constructor helps us creates a new HTMLImageElement instance
let img = new Image();
//WE initally start with null filename
let fileName = "";

//Downloadbutton
const downloadBtn = document.getElementById("download-btn");
//Upload File
const uploadFile = document.getElementById("upload-file");
//Clear filters
const revertBtn = document.getElementById("revert-btn");

//Note:
/*In general Event handlers are placed on to each buttons,but as the no of buttons are more in number,we are going to place the event handler directly on the document */

// Filter & Effect Handlers
//We place an event delegation
//We target anything on "filter-btn" which is included in all the buttons,apart from download and upload buttons at the bottom
document.addEventListener("click", e => {
    //event,the targeted(clicked) looks in th classList and check whether it contains filter-btn
    if (e.target.classList.contains("filter-btn")) {
        //Now we check individually for each of the button and match with the class
        if (e.target.classList.contains("brightness-add")) {
            //Now here is where we call Camanjs,which takes in the canvas element,img(image),function
            Caman("#canvas", img, function () {
                //now the no of units by which we want to change is up to us.
                this.brightness(5).render();
            });
        } else if (e.target.classList.contains("brightness-remove")) {
            Caman("#canvas", img, function () {
                this.brightness(-5).render();
            });
        } else if (e.target.classList.contains("contrast-add")) {
            Caman("#canvas", img, function () {
                this.contrast(5).render();
            });
        } else if (e.target.classList.contains("contrast-remove")) {
            Caman("#canvas", img, function () {
                this.contrast(-5).render();
            });
        } else if (e.target.classList.contains("saturation-add")) {
            Caman("#canvas", img, function () {
                this.saturation(5).render();
            });
        } else if (e.target.classList.contains("saturation-remove")) {
            Caman("#canvas", img, function () {
                this.saturation(-5).render();
            });
        } else if (e.target.classList.contains("vibrance-add")) {
            Caman("#canvas", img, function () {
                this.vibrance(5).render();
            });
        } else if (e.target.classList.contains("vibrance-remove")) {
            Caman("#canvas", img, function () {
                this.vibrance(-5).render();
            });
        } else if (e.target.classList.contains("exposure-remove")) {
            Caman("#canvas", img, function () {
                this.exposure(-5).render();
            });
        } else if (e.target.classList.contains("exposure-add")) {
            Caman("#canvas", img, function () {
                this.exposure(+5).render();
            });
        } else if (e.target.classList.contains("noise-remove")) {
            Caman("#canvas", img, function () {
                this.noise(-5).render();
            });
        } else if (e.target.classList.contains("noise-add")) {
            Caman("#canvas", img, function () {
                this.noise(+5).render();
            });
        } else if (e.target.classList.contains("sharpen-remove")) {
            Caman("#canvas", img, function () {
                this.sharpen(-5).render();
            });
        } else if (e.target.classList.contains("sharpen-add")) {
            Caman("#canvas", img, function () {
                this.sharpen(+5).render();
            });
        } else if (e.target.classList.contains("blur-add")) {
            //console.log("at blur")
            Caman("#canvas", img, function () {
                this.stackBlur(+5).render();
            });
        } else if (e.target.classList.contains("vintage-add")) {
            Caman("#canvas", img, function () {
                this.vintage().render();
            });
        } else if (e.target.classList.contains("lomo-add")) {
            Caman("#canvas", img, function () {
                this.lomo().render();
            });
        } else if (e.target.classList.contains("clarity-add")) {
            Caman("#canvas", img, function () {
                this.clarity().render();
            });
        } else if (e.target.classList.contains("sincity-add")) {
            Caman("#canvas", img, function () {
                this.sinCity().render();
            });
        } else if (e.target.classList.contains("crossprocess-add")) {
            Caman("#canvas", img, function () {
                this.crossProcess().render();
            });
        } else if (e.target.classList.contains("pinhole-add")) {
            Caman("#canvas", img, function () {
                this.pinhole().render();
            });
        } else if (e.target.classList.contains("nostalgia-add")) {
            Caman("#canvas", img, function () {
                this.nostalgia().render();
            });
        } else if (e.target.classList.contains("hermajesty-add")) {
            Caman("#canvas", img, function () {
                this.herMajesty().render();
            });
        }
    }
});

// Revert Filters,remove all the applied filters
revertBtn.addEventListener("click", e => {
    Caman("#canvas", img, function () {
        this.revert();
    });
});


// Upload File
//Placing an event listener on the upload button
uploadFile.addEventListener("change", () => {
    // Get File
    //In the file list we get we take the first file,placed at index0
    const file = document.getElementById("upload-file").files[0];

    // Init FileReader API
    const reader = new FileReader();

    // Check for file
    if (file) {
        // Set file name
        fileName = file.name;
        // Read data as URL and then place it in our canvas
        reader.readAsDataURL(file);
    }

    // Add image to canvas
    reader.addEventListener(
        "load",
        () => {
            // Create image
            img = new Image();
            // Set image src
            //In reader its like an URL
            img.src = reader.result;
            // On image load add to canvas
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                //Need to draw the image on the canvas and we do that using context(ctx) defined earlier
                ctx.drawImage(img, 0, 0, img.width, img.height);
                //Need to remove the attribute based on the instructions
                canvas.removeAttribute("data-caman-id");
            };
        },
        false
    );
});

// Download Event which helps us to generate an event on download click
downloadBtn.addEventListener("click", () => {
    // Get ext,inorder to edit the name.
    // (.jpg,.png) -> we placed this only for this file format
    const fileExtension = fileName.slice(-4);

    // Init new filename
    let newFilename;

    // Check image type,just to make sure the image type  
    if (fileExtension === ".jpg" || fileExtension === ".png") {
        // new filename
        newFilename = fileName.substring(0, fileName.length - 4) + "-edited.jpg";
    }

    // Call download which takes in the canvas and place in the newFilename
    download(canvas, newFilename);
});

// Download
function download(canvas, filename) {
    // Init event
    let e;
    // Create link
    const link = document.createElement("a");
    //While downloading we place in several properties
    // Set props
    link.download = filename;
    link.href = canvas.toDataURL("image/jpeg", 0.8);
    // New mouse event
    e = new MouseEvent("click");
    // Dispatch event
    link.dispatchEvent(e);
}
