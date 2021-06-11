const workSelf = this;
// eslint-disable-next-line no-undef
importScripts('/workers/spark-md5.js');

workSelf.onmessage = (e) => {
  const chunkList = e.data;
  const spark = new workSelf.SparkMD5.ArrayBuffer();
  let count = 0;
  let percentage = 0;
  loadNext(0);

  function loadNext(index) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunkList[index]);
    reader.onload = function onload(e) {
      count++;
      spark.append(e.target.result);
      if (count === chunkList.length) {
        //end
        workSelf.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        workSelf.close();
      } else {
        percentage += 100 / chunkList.length;
        workSelf.postMessage({
          percentage,
        });
        loadNext(count);
      }
    };
  }
};
