(self["webpackChunkmonofia_perfume_inventory"]=self["webpackChunkmonofia_perfume_inventory"]||[]).push([[297],{223:function(e,t,a){"use strict";a.d(t,{Wp:function(){return r.Wp}});var r=a(8461),n="firebase",i="10.14.1";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(0,r.KO)(n,i,"app")},4213:function(e,t,a){var r,n,i;(function(a,o){n=[],r=o,i="function"===typeof r?r.apply(t,n):r,void 0===i||(e.exports=i)})(0,function(){"use strict";function t(e,t){return"undefined"==typeof t?t={autoBom:!1}:"object"!=typeof t&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e}function r(e,t,a){var r=new XMLHttpRequest;r.open("GET",e),r.responseType="blob",r.onload=function(){c(r.response,t,a)},r.onerror=function(){console.error("could not download file")},r.send()}function n(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function i(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(r){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var o="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof a.g&&a.g.global===a.g?a.g:void 0,s=o.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),c=o.saveAs||("object"!=typeof window||window!==o?function(){}:"download"in HTMLAnchorElement.prototype&&!s?function(e,t,a){var s=o.URL||o.webkitURL,c=document.createElement("a");t=t||e.name||"download",c.download=t,c.rel="noopener","string"==typeof e?(c.href=e,c.origin===location.origin?i(c):n(c.href)?r(e,t,a):i(c,c.target="_blank")):(c.href=s.createObjectURL(e),setTimeout(function(){s.revokeObjectURL(c.href)},4e4),setTimeout(function(){i(c)},0))}:"msSaveOrOpenBlob"in navigator?function(e,a,o){if(a=a||e.name||"download","string"!=typeof e)navigator.msSaveOrOpenBlob(t(e,o),a);else if(n(e))r(e,a,o);else{var s=document.createElement("a");s.href=e,s.target="_blank",setTimeout(function(){i(s)})}}:function(e,t,a,n){if(n=n||open("","_blank"),n&&(n.document.title=n.document.body.innerText="downloading..."),"string"==typeof e)return r(e,t,a);var i="application/octet-stream"===e.type,c=/constructor/i.test(o.HTMLElement)||o.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent);if((f||i&&c||s)&&"undefined"!=typeof FileReader){var h=new FileReader;h.onloadend=function(){var e=h.result;e=f?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),n?n.location.href=e:location=e,n=null},h.readAsDataURL(e)}else{var p=o.URL||o.webkitURL,l=p.createObjectURL(e);n?n.location=l:location.href=l,n=null,setTimeout(function(){p.revokeObjectURL(l)},4e4)}});o.saveAs=c.saveAs=c,e.exports=c})},8461:function(e,t,a){"use strict";a.d(t,{KO:function(){return ee},MF:function(){return Z},Sx:function(){return Y},Wp:function(){return Q},j6:function(){return J},om:function(){return z},xZ:function(){return K}});var r=a(5125),n=a(3424),i=a(6743),o=a(4297);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class s{constructor(e){this.container=e}getPlatformInfoString(){const e=this.container.getProviders();return e.map(e=>{if(c(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}function c(e){const t=e.getComponent();return"VERSION"===(null===t||void 0===t?void 0:t.type)}const f="@firebase/app",h="0.10.13",p=new n.Vy("@firebase/app"),l="@firebase/app-compat",u="@firebase/analytics-compat",d="@firebase/analytics",b="@firebase/app-check-compat",m="@firebase/app-check",g="@firebase/auth",w="@firebase/auth-compat",v="@firebase/database",y="@firebase/data-connect",_="@firebase/database-compat",D="@firebase/functions",C="@firebase/functions-compat",E="@firebase/installations",S="@firebase/installations-compat",A="@firebase/messaging",k="@firebase/messaging-compat",j="@firebase/performance",O="@firebase/performance-compat",I="@firebase/remote-config",x="@firebase/remote-config-compat",$="@firebase/storage",M="@firebase/storage-compat",P="@firebase/firestore",R="@firebase/vertexai-preview",U="@firebase/firestore-compat",B="firebase",H="10.14.1",T="[DEFAULT]",F={[f]:"fire-core",[l]:"fire-core-compat",[d]:"fire-analytics",[u]:"fire-analytics-compat",[m]:"fire-app-check",[b]:"fire-app-check-compat",[g]:"fire-auth",[w]:"fire-auth-compat",[v]:"fire-rtdb",[y]:"fire-data-connect",[_]:"fire-rtdb-compat",[D]:"fire-fn",[C]:"fire-fn-compat",[E]:"fire-iid",[S]:"fire-iid-compat",[A]:"fire-fcm",[k]:"fire-fcm-compat",[j]:"fire-perf",[O]:"fire-perf-compat",[I]:"fire-rc",[x]:"fire-rc-compat",[$]:"fire-gcs",[M]:"fire-gcs-compat",[P]:"fire-fst",[U]:"fire-fst-compat",[R]:"fire-vertex","fire-js":"fire-js",[B]:"fire-js-all"},L=new Map,N=new Map,V=new Map;function W(e,t){try{e.container.addComponent(t)}catch(a){p.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,a)}}function z(e){const t=e.name;if(V.has(t))return p.debug(`There were multiple attempts to register component ${t}.`),!1;V.set(t,e);for(const a of L.values())W(a,e);for(const a of N.values())W(a,e);return!0}function J(e,t){const a=e.container.getProvider("heartbeat").getImmediate({optional:!0});return a&&a.triggerHeartbeat(),e.container.getProvider(t)}function K(e){return void 0!==e.settings}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const X={["no-app"]:"No Firebase App '{$appName}' has been created - call initializeApp() first",["bad-app-name"]:"Illegal App name: '{$appName}'",["duplicate-app"]:"Firebase App named '{$appName}' already exists with different options or config",["app-deleted"]:"Firebase App named '{$appName}' already deleted",["server-app-deleted"]:"Firebase Server App has been deleted",["no-options"]:"Need to provide options, when not being deployed to hosting via source.",["invalid-app-argument"]:"firebase.{$appName}() takes either no argument or a Firebase App instance.",["invalid-log-argument"]:"First argument to `onLog` must be null or a function.",["idb-open"]:"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",["idb-get"]:"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",["idb-set"]:"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",["idb-delete"]:"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",["finalization-registry-not-supported"]:"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",["invalid-server-app-environment"]:"FirebaseServerApp is not for use in browser environments."},q=new i.FA("app","Firebase",X);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class G{constructor(e,t,a){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=a,this.container.addComponent(new r.uA("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw q.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Z=H;function Q(e,t={}){let a=e;if("object"!==typeof t){const e=t;t={name:e}}const n=Object.assign({name:T,automaticDataCollectionEnabled:!1},t),o=n.name;if("string"!==typeof o||!o)throw q.create("bad-app-name",{appName:String(o)});if(a||(a=(0,i.T9)()),!a)throw q.create("no-options");const s=L.get(o);if(s){if((0,i.bD)(a,s.options)&&(0,i.bD)(n,s.config))return s;throw q.create("duplicate-app",{appName:o})}const c=new r.h1(o);for(const r of V.values())c.addComponent(r);const f=new G(a,n,c);return L.set(o,f),f}function Y(e=T){const t=L.get(e);if(!t&&e===T&&(0,i.T9)())return Q();if(!t)throw q.create("no-app",{appName:e});return t}function ee(e,t,a){var n;let i=null!==(n=F[e])&&void 0!==n?n:e;a&&(i+=`-${a}`);const o=i.match(/\s|\//),s=t.match(/\s|\//);if(o||s){const e=[`Unable to register library "${i}" with version "${t}":`];return o&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),o&&s&&e.push("and"),s&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void p.warn(e.join(" "))}z(new r.uA(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const te="firebase-heartbeat-database",ae=1,re="firebase-heartbeat-store";let ne=null;function ie(){return ne||(ne=(0,o.P2)(te,ae,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(re)}catch(a){console.warn(a)}}}}).catch(e=>{throw q.create("idb-open",{originalErrorMessage:e.message})})),ne}async function oe(e){try{const t=await ie(),a=t.transaction(re),r=await a.objectStore(re).get(ce(e));return await a.done,r}catch(t){if(t instanceof i.g)p.warn(t.message);else{const e=q.create("idb-get",{originalErrorMessage:null===t||void 0===t?void 0:t.message});p.warn(e.message)}}}async function se(e,t){try{const a=await ie(),r=a.transaction(re,"readwrite"),n=r.objectStore(re);await n.put(t,ce(e)),await r.done}catch(a){if(a instanceof i.g)p.warn(a.message);else{const e=q.create("idb-set",{originalErrorMessage:null===a||void 0===a?void 0:a.message});p.warn(e.message)}}}function ce(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fe=1024,he=2592e6;class pe{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new de(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const a=this.container.getProvider("platform-logger").getImmediate(),r=a.getPlatformInfoString(),n=le();if(null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===n||this._heartbeatsCache.heartbeats.some(e=>e.date===n))return;return this._heartbeatsCache.heartbeats.push({date:n,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{const t=new Date(e.date).valueOf(),a=Date.now();return a-t<=he}),this._storage.overwrite(this._heartbeatsCache)}catch(a){p.warn(a)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=le(),{heartbeatsToSend:a,unsentEntries:r}=ue(this._heartbeatsCache.heartbeats),n=(0,i.Uj)(JSON.stringify({version:2,heartbeats:a}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),n}catch(t){return p.warn(t),""}}}function le(){const e=new Date;return e.toISOString().substring(0,10)}function ue(e,t=fe){const a=[];let r=e.slice();for(const n of e){const e=a.find(e=>e.agent===n.agent);if(e){if(e.dates.push(n.date),be(a)>t){e.dates.pop();break}}else if(a.push({agent:n.agent,dates:[n.date]}),be(a)>t){a.pop();break}r=r.slice(1)}return{heartbeatsToSend:a,unsentEntries:r}}class de{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!(0,i.zW)()&&(0,i.eX)().then(()=>!0).catch(()=>!1)}async read(){const e=await this._canUseIndexedDBPromise;if(e){const e=await oe(this.app);return(null===e||void 0===e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;const a=await this._canUseIndexedDBPromise;if(a){const a=await this.read();return se(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:a.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;const a=await this._canUseIndexedDBPromise;if(a){const a=await this.read();return se(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:a.lastSentHeartbeatDate,heartbeats:[...a.heartbeats,...e.heartbeats]})}}}function be(e){return(0,i.Uj)(JSON.stringify({version:2,heartbeats:e})).length}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(e){z(new r.uA("platform-logger",e=>new s(e),"PRIVATE")),z(new r.uA("heartbeat",e=>new pe(e),"PRIVATE")),ee(f,h,e),ee(f,h,"esm2017"),ee("fire-js","")}me("")}}]);