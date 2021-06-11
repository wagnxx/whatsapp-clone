import React from 'react';
import { useState, useEffect } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';

const WindwoSizeContext = createContext();
export const useWindowResized = () => useContext(WindwoSizeContext);
export default function WindowResizeContextProvider({ children }) {
  const [screenWidth, setscreenWidth] = useState();
  const [isPhoneClient, setIsPhoneClient] = useState(function () {
    if (screenWidth <= 600) return true;
    return false;
  });

  function resize() {
    const width = window.innerWidth;

    setscreenWidth(width);
    if (width <= 600) {
      setIsPhoneClient(true);
    } else {
      setIsPhoneClient(false);
    }
  }

  useEffect(function () {
    resize();
    window.onresize = debounce.call(window, resize, 200);
  }, []);

  return (
    <WindwoSizeContext.Provider value={{ screenWidth, isPhoneClient }}>
      {children}
    </WindwoSizeContext.Provider>
  );
}

function debounce(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// function throttle(fn, wait) {
//   let lastTime = Date.now();

//   return function () {
//     let args = arguments;
//     let now = Date.now();

//     if (now - lastTime > wait) {
//       fn.apply(this, args);
//       lastTime = now;
//     }
//   };
// }
