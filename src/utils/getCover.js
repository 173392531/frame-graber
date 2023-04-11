export const isFunc = (func) => typeof func === 'function';

export const safeExecute = (func, ...args) =>
  isFunc(func) ? func(...args) : func;

export const getCover = (videoUrl, updater, videoUrlRef, COUNT = 9) => {
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous'; // 解决跨域问题，也就是提示污染资源无法转换视频
  let duration = 1;
  let currentIndex = 0;
  let pool = [];
  let played = false;

  const handleCanPlay = () => {
    if (!played) {
      played = true;
      duration = video.duration;
      pool = [...new Array(COUNT)].map((v, i) => ({
        time: (duration / COUNT) * i,
        done: false,
        image: '',
      }));
      video.currentTime = 0;
    }
  };

  const handleSeeked = async () => {
    if (videoUrlRef && videoUrl !== videoUrlRef.current) {
      removeListener();
      return;
    }

    const item = pool[currentIndex];
    item.done = true;
    item.image = await getThumbnail(video);
    const newPool = [...pool]; // return a new ref to update
    safeExecute(updater, newPool);

    currentIndex++;
    if (currentIndex >= COUNT) {
      removeListener();
      return;
    }
    video.currentTime = pool[currentIndex].time;
  };

  const removeListener = () => {
    video.removeEventListener('seeked', handleSeeked);
    video.removeEventListener('canplay', handleCanPlay);
  };

  video.addEventListener('seeked', handleSeeked);
  video.addEventListener('canplay', handleCanPlay);
  video.src = videoUrl;
};

export const getThumbnail = (video, widthNum = 40, heightNum = 72) => {
  const height = video.videoHeight || heightNum;
  const width = video.videoWidth || widthNum;
  const canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;

  const ctx = canvas.getContext('2d');

  // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  ctx?.drawImage(video, 0, 0, width, height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => blob && resolve(URL.createObjectURL(blob)));
    } catch (e) {
      reject(e);
    }
  });
};
