import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { getCover } from './utils/getCover'

function App() {
  const previewUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
  const [candidates, setCandidates] = useState([]);
  const previewUrlRef = useRef(previewUrl);
  const containerRef = useRef(null);

  useEffect(() => {
    previewUrlRef.current = previewUrl;
    if (previewUrl) {
      console.log('!previewUrl',previewUrl);
      
      getCover(
        previewUrl,
        res => {
          setCandidates(res);
        },
        previewUrlRef,
      );
    } else {
      setCandidates([]);
    }
  }, [previewUrl]);

  console.log('candidates',candidates);
  

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      <div ref={containerRef}>
        {candidates.map((item, cindex) => (
          <img
            draggable={false}
            key={cindex}
            // className={}
            src={item.image}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
