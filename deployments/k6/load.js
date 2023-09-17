import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

var testDuraction = '1m';
var authKey = "";


export function setup() {
  
}


export const options = {
  discardResponseBodies: false,
  scenarios: {
    httpbin_ratelimit: {
      executor: 'constant-arrival-rate',
      exec: 'test_httpbin_ratelimit',
      rate: 30,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 2, // how large the initial pool of VUs would be
      maxVUs: 2, // if the preAllocatedVUs are not enough, we can initialize more
    },

    httpbin_unstable: {
      executor: 'constant-arrival-rate',
      exec: 'test_httpbin_unstable',
      rate: 26,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 2, // how large the initial pool of VUs would be
      maxVUs: 2, // if the preAllocatedVUs are not enough, we can initialize more
    },

    httpbin_cache: {
      executor: 'constant-arrival-rate',
      exec: 'test_httpbin_delay',
      rate: 10,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 3, // how large the initial pool of VUs would be
      maxVUs: 3, // if the preAllocatedVUs are not enough, we can initialize more
    },

    httpbin_status: {
      executor: 'constant-arrival-rate',
      exec: 'test_httpbin_status',
      rate: 50,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 2, // how large the initial pool of VUs would be
      maxVUs: 4, // if the preAllocatedVUs are not enough, we can initialize more
    },

    httpbin_method_transform: {
      executor: 'constant-arrival-rate',
      exec: 'test_httpbin_method_transform',
      rate: 10,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 2, // how large the initial pool of VUs would be
      maxVUs: 4, // if the preAllocatedVUs are not enough, we can initialize more
    },

    httpbin_auth: {
      executor: 'constant-arrival-rate',
      exec: 'test_httpbin_auth',
      rate: 35,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 2, // how large the initial pool of VUs would be
      maxVUs: 4, // if the preAllocatedVUs are not enough, we can initialize more
    },

    rolldice: {
      executor: 'constant-arrival-rate',
      exec: 'test_rolldice',
      rate: 10,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: testDuraction,
      preAllocatedVUs: 2, // how large the initial pool of VUs would be
      maxVUs: 4, // if the preAllocatedVUs are not enough, we can initialize more
    },

  }
}

export function test_httpbin_ratelimit() {
  http.get('http://host.docker.internal:8080/httpbin-ratelimit/get');
}

export function test_httpbin_unstable() {
  http.get('http://host.docker.internal:8080/httpbin-unstable/');
}

export function test_httpbin_delay() {

  const expr = randomIntBetween(1, 3);

  const params = {
    headers: { 'version': '1.2' }
  };

  if (expr == 1) http.get('http://host.docker.internal:8080/httpbin-cache/delay/3');
  else http.get('http://host.docker.internal:8080/httpbin-cache/delay/3', params);
}

export function test_httpbin_status() {
  http.get('http://host.docker.internal:8080/httpbin-status/200');
  
  const expr = randomIntBetween(1, 10);

  if (expr == 1) http.get('http://host.docker.internal:8080/httpbin-status/404');
  else if (expr == 2) http.get('http://host.docker.internal:8080/httpbin-status/500');
  else if (expr == 3) http.get('http://host.docker.internal:8080/httpbin-status/503');

}

export function test_httpbin_method_transform() {
  http.get('http://host.docker.internal:8080/httpbin-method-transform/delete');
}


export function test_httpbin_auth() {
  const params = {
    headers: { 'Authorization': authKey }
  };

  http.get('http://host.docker.internal:8080/httpbin-auth/', params);
}

export function test_rolldice() {
  http.get('http://host.docker.internal:8090');
}