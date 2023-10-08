import { useCallback, useEffect, useRef, useState } from "react";
import CaptureImageComponent from "./CaptureImageComponent";
import SelectAvatarComponent from "./SelectAvatarComponent";
import PreviewComponent from "./PreviewComponent";

export const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([new Blob([ab], { type: mimeString })], "image.jpeg", {
      type: "image/jpeg",
    });
  };

  function App2() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showButtons, setShowButtons] = useState(false);
    const [count, setCount] = useState(0);
    const [formData] = useState(new FormData()); 
  
    useEffect(() => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error(
            "Error accessing webcam plz throw your device in garbage :)",
            error
          );
        });
    }, [capturedImage, showButtons]);
  
  
    const handleCaptureClick = useCallback(async () => {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
  
        canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
  
        const capturedDataURL = canvas.toDataURL("image/jpeg");
        const file = dataURItoBlob(capturedDataURL);
        formData.append("input_image", file);
        setCapturedImage(capturedDataURL);
        setShowButtons(true);
      }
    }, []);
  
  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if(file){
      formData.append("input_image", file);
      setCapturedImage(URL.createObjectURL(file));
      setShowButtons(true);
    }
  }
  
    const handleNextClick = useCallback(() => {
      setCount((e) => e + 1);
    }, []);
  
    const handleRetryClick = useCallback(() => {
      setCapturedImage(null);
      setShowButtons(false);
      
      formData.delete("target_image");
          formData.delete("input_image");
          
    }, []);
  
    return (
      <div className="h-screen w-full flex justify-center items-center flex-col p-2 ">
        <img
          src="https://www.gokapture.com/img/gokapture/favicon.png"
          alt="Logo"
        />{" "}
        {count === 0 && (
          <CaptureImageComponent
            capturedImage={capturedImage}
            handleCaptureClick={handleCaptureClick}
            handleNextClick={handleNextClick}
            handleRetryClick={handleRetryClick}
            showButtons={showButtons}
            videoRef={videoRef}
            handleFileUpload={handleFileUpload}
          />
        )}
        {count === 1 && (
          <SelectAvatarComponent setCount={setCount} formData={formData} />
        )}
        {count === 2 && <PreviewComponent formData={formData} />}
      </div>
    );
  }
  
  export default App2;  

