const baseUrl = 'http://localhost:5000';
function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
// fetch超时处理
const TIMEOUT = 100000;
const timeoutFetch = (request) => {
  let fetchPromise = fetch(request);
  let timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('请求超时')), TIMEOUT);
  });
  return Promise.race([fetchPromise, timeoutPromise]);
};

function fetchPost(url, data) {
  let headers = new Headers();
  let body;
  if (data instanceof FormData) {
    body = data;
  } else {
    if (headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json;charset=utf-8');
    } else {
      headers.append('Content-Type', 'application/json;charset=utf-8');
    }

    body = JSON.stringify(data);
  }
  let request = new Request(baseUrl + url, {
    method: 'post',
    headers,
    body,
  });
  return timeoutFetch(request)
    .then(checkStatus)
    .then(parseJSON)
    .then(filterCode)
    .catch((err) => ({ err }));
}

function filterCode(res) {
  const { data, errono } = res;
  if (errono === -1) {
    alert(res.message);
    return;
  }
  let code = data.code;

  if (!code) return data;

  console.error(res.message);

  // switch(code) {
  //   case 900000401:
  //     console.error(res.message);
  //     break;
  //   case 900000403:
  //     console.error(res.message);
  //     break;
  // }
}

export { fetchPost };
