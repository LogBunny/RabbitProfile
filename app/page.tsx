"use client";
import { removeBackground } from "@imgly/background-removal";
import { useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { CircleCheckBig, ImagePlus, Rabbit } from "lucide-react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = [
    "#ff9fe5",
    "#b3efb2",
    "#f1d302",
    "#020100",
    "#6daedb",
    "#ff9505",
    "#018e42",
    "#6ccff6",
    "#540d6e",
    "#018e42",
    "#fb4d3d",
    "#ffeaae",
    "#3c7a89",
    "#0a369d",
  ];
  const [selectedColor, setSelectedColor] = useState("#ffff");
  const [imageObjectURL, setImageObjectURL] = useState("");
  const [croppedimageObjectURL, setCroppedImageObjectURL] = useState("");
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set the canvas dimensions to match its CSS dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw a white rectangle covering the entire canvas
    ctx.fillStyle = selectedColor;

    const img = new Image();
    img.onload = function () {
      const aspectRatio = img.width / img.height;
      let drawWidth, drawHeight;

      if (canvas.width / canvas.height > aspectRatio) {
        // Canvas is wider than image aspect ratio
        drawHeight = canvas.height;
        drawWidth = drawHeight * aspectRatio;
      } else {
        // Canvas is taller than image aspect ratio
        drawWidth = canvas.width;
        drawHeight = drawWidth / aspectRatio;
      }

      // Draw the image on the canvas centered
      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    };
    img.src = croppedimageObjectURL;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [selectedColor, croppedimageObjectURL, imageObjectURL]);

  async function handleImage(event: any) {
    /*  const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
*/
    const file = event.target.files[0];
    if (!file) return;

    const cropper = cropperRef.current?.cropper;
    const objectUrl = URL.createObjectURL(file);
    //
    cropper?.replace(objectUrl);
    console.log(objectUrl);
    setImageObjectURL(objectUrl);
  }

  const onCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const blob = removeBackground(cropper.getCroppedCanvas().toDataURL());
    setCroppedImageObjectURL(URL.createObjectURL(await blob));
    //console.log(cropper.getCroppedCanvas().toDataURL());
  };

  return (
    <div className="w-[100vw] h-screen bg-slate-600 flex flex-row">
      <div className="bg-slate-800 w-[20%] h-[100vh] p-[16px]">
        <div className="text-white font-bold text-4xl mr-[20px] mb-[5px] flex flex-row p-[4px] gap-2">
        <Rabbit size={49}/> Profile
        </div>
        <div className="text-slate-400 font-medium text-lg">Solid Colors</div>
        <div className="flex flex-wrap gap-4 min-h-20 min-w-10">
          {colors.map((color, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 rounded-md`}
              style={{ backgroundColor: `${color}` }}
              onClick={(e) => {
                setSelectedColor(color);
              }}
            ></div>
          ))}
        </div>
      </div>
      <div className="min-h-screen flex justify-center items-center flex-1 flex-col gap-4">
        {croppedimageObjectURL !== "" ? (
          <canvas
            ref={canvasRef}
            className="size-[270px] rounded-[50%]"
          ></canvas>
        ) : (
          <>
            <Cropper
              src={imageObjectURL}
              style={{ height: 600, width: 600 }}
              // Cropper.js options
              initialAspectRatio={1}
              aspectRatio={1}
              cropBoxResizable={false}
              minCropBoxHeight={270}
              minContainerHeight={270}
              controls={true}
              guides={true}
              //crop={onCrop}
              ref={cropperRef}
              shape="round"
            />
            {!croppedimageObjectURL &&imageObjectURL && (
              <button
                onClick={onCrop}
                className="bg-white p-[8px] rounded-md flex flex-row gap-2"
              >
                <CircleCheckBig /> Confirm
              </button>
            )}
          </>
        )}

        {!imageObjectURL && (
          <>
            <input
              type="file"
              name="img"
              id="image"
              onChange={handleImage}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="bg-white px-4 py-2 rounded cursor-pointer flex flex-row gap-2"
            >
              <ImagePlus />
              Upload Image
            </label>
          </>
        )}
      </div>
    </div>
  );
}
