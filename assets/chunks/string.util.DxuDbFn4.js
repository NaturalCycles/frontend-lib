function x(e,t=Error,r){let n;if(e instanceof t)n=e;else{const s=l(e);n=p(s,t)}return n}function l(e,t){let r;return o(e)?r=g(e):(e=m(e),d(e)?r=e.error:f(e)?r=e:o(e)?r=g(e):r={name:"Error",message:u(e),data:{}}),Object.assign(r.data,t),r}function g(e){if(!(e instanceof Error)&&f(e))return e;const t={name:e.name,message:e.message,data:{...e.data}};return e.stack&&(t.stack=e.stack),e.cause&&(t.cause=l(e.cause)),t}function p(e,t=Error){if(e instanceof t)return e;const{name:r,cause:n}=e,s=new t(e.message,e.data,{name:r,cause:n});return e.stack&&Object.defineProperty(s,"stack",{value:e.stack}),s instanceof i||(Object.defineProperties(s,{name:{value:r,configurable:!0,writable:!0},data:{value:e.data,writable:!0,configurable:!0,enumerable:!1},cause:{value:n,writable:!0,configurable:!0,enumerable:!0}}),Object.defineProperty(s.constructor,"name",{value:r,configurable:!0,writable:!0})),s}function d(e){return f(e==null?void 0:e.error)}function f(e){return!!e&&typeof e=="object"&&typeof e.name=="string"&&typeof e.message=="string"&&typeof e.data=="object"}function o(e){return!!e&&typeof e=="object"&&typeof e.name=="string"&&typeof e.message=="string"}function S(e,t){var r;return t&&((r=e).data||(r.data={}),Object.assign(e.data,t)),e}class i extends Error{static of(t){return new i(t.message,t.data,{name:t.name,cause:t.cause})}constructor(t,r={},n={}){super(t);const{name:s=y()?this.constructor.name:"AppError",cause:a}=n;Object.defineProperties(this,{name:{value:s,configurable:!0,writable:!0},data:{value:r,writable:!0,configurable:!0,enumerable:!1}}),a&&Object.defineProperty(this,"cause",{value:l(a),writable:!0,configurable:!0,enumerable:!0}),Object.defineProperty(this.constructor,"name",{value:s,configurable:!0,writable:!0})}}class T extends i{constructor(t,r,n){r.response&&Object.defineProperty(r,"response",{enumerable:!1}),super(t,r,{...n,name:"HttpRequestError"})}}class b extends i{constructor(t,r){super(t,r,{name:"AssertionError"})}}class h extends i{constructor(t){const r=["Failed to parse",t.text&&P(t.text,200)].filter(Boolean).join(": ");super(r,t,{name:"JsonParseError"})}}class A extends i{constructor(t,r,n){super(t,r,{...n,name:"TimeoutError"})}}class J extends i{constructor(t){super(t||"expected error was not thrown",{},{name:"UnexpectedPassError"})}}function y(){return typeof window>"u"}const E=/^\s*[{["\-\d]/;function m(e,t){if(typeof e=="string"&&e&&E.test(e))try{return JSON.parse(e,t)}catch{}return e}function v(e,t){try{return JSON.parse(e,t)}catch{throw new h({text:e})}}function O(e,t,r,n){try{return JSON.stringify(e,t,r)}catch{return JSON.stringify(e,_(t,n),r)}}function _(e,t){const r=[],n=[];return t??(t=(s,a)=>r[0]===a?"[Circular ~]":"[Circular ~."+n.slice(0,r.indexOf(a)).join(".")+"]"),function(s,a){if(r.length>0){const c=r.indexOf(this);~c?r.splice(c+1):r.push(this),~c?n.splice(c,1/0,s):n.push(s),~r.indexOf(a)&&(a=t.call(this,s,a))}else r.push(a);return e==null?a:e.call(this,s,a)}}const w=typeof globalThis.AggregateError=="function";let k=O;function u(e,t={}){if(e===void 0)return"undefined";if(e===null)return"null";if(typeof e=="function")return"function";if(typeof e=="symbol")return e.toString();let r;if(e=m(e),d(e))return u(e.error,t);if(e instanceof Error||o(e)){const{includeErrorCause:s=!0}=t;if(r=[e.name,e.message].filter(Boolean).join(": "),typeof e.code=="string"&&(r+=`
code: ${e.code}`),t.includeErrorData&&f(e)&&Object.keys(e.data).length&&(r+=`
`+u(e.data,t)),t.includeErrorStack&&e.stack){const a=r.split(`
`).length;r=[r,...e.stack.split(`
`).slice(a)].join(`
`)}w&&e instanceof AggregateError&&e.errors.length&&(r=[r,`${e.errors.length} error(s):`,...e.errors.map((a,c)=>`${c+1}. ${u(a,t)}`)].join(`
`)),e.cause&&s&&(r=r+`
Caused by: `+u(e.cause,t))}else if(typeof e=="string")r=e.trim()||"empty_string";else{e instanceof Map?e=Object.fromEntries(e):e instanceof Set&&(e=[...e]);try{const{stringifyFn:s=k}=t;r=s(e,void 0,2)}catch{r=String(e)}}if(r===void 0)return"undefined";const{maxLen:n=1e4}=t;return n&&r.length>n&&(r=r.slice(0,n)+`... ${Math.ceil(r.length/1024)} KB message truncated`),r}function P(e,t,r="..."){if(!e||e.length<=t)return e;if(t<=r.length)return r;const n=Math.round((t-r.length)/2),s=e.length-Math.floor((t-r.length)/2);return e.slice(0,n)+r+e.slice(s)}export{b as A,T as H,A as T,J as U,u as _,S as a,x as b,v as c,m as d,g as e,l as f,y as i};
