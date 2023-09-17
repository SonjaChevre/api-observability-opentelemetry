import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

var testDuraction = '1m';

const params = {
  headers: { 'Content-Type': 'application/json', 'x-tyk-authorization': '28d220fd77974a4facfb07dc1e49c2aa', 'Response-Type': 'application/json' },
  responseType: 'text'
};

// 4 users with different API calls, all successfull
// 1 user with rate-limiting issue
// 1 user doesn't have permission for API version 2
// 1 user with lots of 404 errors

export function setup() {

  var alias1 = "user102";
  var users = [];

  //  "api_id": "4",
  //  "name": "httpbin rate limit",
  let data = '{"alias": "' + alias1 + '", "expires": -1, "access_rights": { "1": { "api_id": "1","api_name": "httpbin auth","versions": ["Default"]}, "4": { "api_id": "4","api_name": "httpbin rate limit","versions": ["Default"]}}}' ;
  let res = http.post("http://host.docker.internal:8080/tyk/keys/create", data, params);

  var authKey1 = res.json().key;
  users[0] = [alias1, authKey1];

  return { users };
}


export const options = {
  discardResponseBodies: false,
  scenarios: {
    user_102: {
      executor: 'constant-arrival-rate',
      exec: 'user_102',
      rate: 3,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 1, // how large the initial pool of VUs would be
      maxVUs: 1, // if the preAllocatedVUs are not enough, we can initialize more
    }

  }
}

export default function (data) {
  // console.log("default function: " + JSON.stringify(data.authKey));
}

export function user_102(data) {

  const params = {
    headers: { 'authorization': data.users[0][1] }
  };

  http.get('http://host.docker.internal:8080/httpbin-auth/', params);
  http.get('http://host.docker.internal:8080/httpbin-ratelimit/get', params);

}

