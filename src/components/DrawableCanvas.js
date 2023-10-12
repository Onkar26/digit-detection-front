import React, { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../App.css';

const DrawableCanvas = (props) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnNumber, setDrawnNumber] = useState(null);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
  
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  }, [isDrawing, ctxRef]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.lineWidth = 15;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      ctxRef.current = context;
      ctxRef.current.strokeStyle = 'white';

      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);

      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
      };
    }
  }, [draw]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const saveCanvasAsImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');

    // Save the image data to localStorage
    localStorage.setItem('canvasImageData', image);

    const reqConfig = {
      method: 'post', // Change to 'post' to send data to the server
      url: 'http://localhost:3001/number',
      data: {
        digitImage: localStorage.getItem('canvasImageData'),
      },
      headers: {},
    };

    axios
      .request(reqConfig)
      .then((res) => {
        console.log(res.data);
        setDrawnNumber(res.data.number); // Set the drawn number here

        // Clear the canvas for the next drawing
        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.clear()
      })
      .catch((error) => {
        console.error(error);
        // Handle the error gracefully, e.g., display an error message to the user.
      });
  };

  return (
    <div className='CanvasContainer'>
      <canvas
        ref={canvasRef}
        width={props.width || 400}
        height={props.height || 400}
        style={{ border: '1px solid black', backgroundColor: 'black' }}
      />
      <button onClick={saveCanvasAsImage}>Process Drawing</button>
      <h2>You have drawn the number:</h2>
      <h3>{drawnNumber}</h3>
    </div>
  );
}

export default DrawableCanvas;
