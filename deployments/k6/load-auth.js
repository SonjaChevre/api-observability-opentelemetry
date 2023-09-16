import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';



var testDuraction = '10s';

const params = {
  headers: { 'Content-Type': 'application/json', 'x-tyk-authorization': '28d220fd77974a4facfb07dc1e49c2aa', 'Response-Type': 'application/json' },
  responseType: 'text'
};

export function setup() {
  
  let alias = "user" + randomIntBetween(1, 100);
  let data = '{"alias": "' + alias + '", "expires": -1, "access_rights": { "1": { "api_id": "1","api_name": "httpbin auth","versions": ["Default"]}}}' ;
  let res = http.post("http://host.docker.internal:8080/tyk/keys/create", data, params);

  var authKey = res.json().key;
  console.log("authKey :" + authKey);
  console.log(res.json().status);

  return { 'authKey': authKey };
  
}

export default function (data) {
  // console.log("default function: " + JSON.stringify(data.authKey));
}

export const options = {
  discardResponseBodies: true,
  scenarios: {
    httpbin_auth: {
      executor: 'constant-arrival-rate',
      exec: 'test_httpbin_auth',
      rate: 35,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 2, // how large the initial pool of VUs would be
      maxVUs: 4, // if the preAllocatedVUs are not enough, we can initialize more
    },
  }
}

export function test_httpbin_auth(data) {
  // console.log("httpbin function: " + JSON.stringify(data.authKey));
  // console.log("authKey :" + data.authKey);

  const params = {
    headers: { 'authorization': data.authKey }
  };

  http.get('http://host.docker.internal:8080/httpbin-auth/', params);
}

