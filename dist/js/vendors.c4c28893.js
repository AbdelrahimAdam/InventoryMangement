(self["webpackChunkmonofia_perfume_inventory"]=self["webpackChunkmonofia_perfume_inventory"]||[]).push([[96],{14:function(e,t,n){"use strict";n.d(t,{Fo:function(){return u},O_:function(){return a},Uw:function(){return s},zy:function(){return o}});var r=n(641);let i=Symbol("Context");var s=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(s||{});function o(){return null!==a()}function a(){return(0,r.WQ)(i,null)}function u(e){(0,r.Gt)(i,e)}},33:function(e,t,n){"use strict";
/**
* @vue/shared v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function r(e){const t=Object.create(null);for(const n of e.split(","))t[n]=1;return e=>e in t}n.d(t,{$3:function(){return d},$H:function(){return U},BH:function(){return W},BX:function(){return ne},Bm:function(){return b},C4:function(){return Y},CE:function(){return g},CP:function(){return c},DY:function(){return F},Gv:function(){return E},J$:function(){return Z},Kg:function(){return w},MZ:function(){return i},Mp:function(){return u},NO:function(){return a},Oj:function(){return s},PT:function(){return D},Qd:function(){return A},Ro:function(){return B},SU:function(){return R},TF:function(){return h},Tg:function(){return P},Tn:function(){return _},Tr:function(){return G},We:function(){return q},X$:function(){return l},Y2:function(){return ee},ZH:function(){return L},Zf:function(){return C},bB:function(){return j},cy:function(){return p},gd:function(){return y},pD:function(){return r},rU:function(){return M},tE:function(){return o},u3:function(){return re},vM:function(){return m},v_:function(){return se},yI:function(){return k},yL:function(){return T},yQ:function(){return V}});const i={},s=[],o=()=>{},a=()=>!1,u=e=>111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),c=e=>e.startsWith("onUpdate:"),l=Object.assign,h=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},f=Object.prototype.hasOwnProperty,d=(e,t)=>f.call(e,t),p=Array.isArray,g=e=>"[object Map]"===S(e),m=e=>"[object Set]"===S(e),v=e=>"[object Date]"===S(e),y=e=>"[object RegExp]"===S(e),_=e=>"function"===typeof e,w=e=>"string"===typeof e,b=e=>"symbol"===typeof e,E=e=>null!==e&&"object"===typeof e,T=e=>(E(e)||_(e))&&_(e.then)&&_(e.catch),I=Object.prototype.toString,S=e=>I.call(e),C=e=>S(e).slice(8,-1),A=e=>"[object Object]"===S(e),k=e=>w(e)&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e,R=r(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),O=e=>{const t=Object.create(null);return n=>{const r=t[n];return r||(t[n]=e(n))}},N=/-\w/g,D=O(e=>e.replace(N,e=>e.slice(1).toUpperCase())),x=/\B([A-Z])/g,P=O(e=>e.replace(x,"-$1").toLowerCase()),L=O(e=>e.charAt(0).toUpperCase()+e.slice(1)),M=O(e=>{const t=e?`on${L(e)}`:"";return t}),U=(e,t)=>!Object.is(e,t),F=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},V=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},j=e=>{const t=parseFloat(e);return isNaN(t)?e:t},B=e=>{const t=w(e)?Number(e):NaN;return isNaN(t)?e:t};let $;const q=()=>$||($="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:"undefined"!==typeof window?window:"undefined"!==typeof n.g?n.g:{});const K="Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol",W=r(K);function G(e){if(p(e)){const t={};for(let n=0;n<e.length;n++){const r=e[n],i=w(r)?X(r):G(r);if(i)for(const e in i)t[e]=i[e]}return t}if(w(e)||E(e))return e}const z=/;(?![^(]*\))/g,H=/:([^]+)/,Q=/\/\*[^]*?\*\//g;function X(e){const t={};return e.replace(Q,"").split(z).forEach(e=>{if(e){const n=e.split(H);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function Y(e){let t="";if(w(e))t=e;else if(p(e))for(let n=0;n<e.length;n++){const r=Y(e[n]);r&&(t+=r+" ")}else if(E(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const J="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Z=r(J);function ee(e){return!!e||""===e}function te(e,t){if(e.length!==t.length)return!1;let n=!0;for(let r=0;n&&r<e.length;r++)n=ne(e[r],t[r]);return n}function ne(e,t){if(e===t)return!0;let n=v(e),r=v(t);if(n||r)return!(!n||!r)&&e.getTime()===t.getTime();if(n=b(e),r=b(t),n||r)return e===t;if(n=p(e),r=p(t),n||r)return!(!n||!r)&&te(e,t);if(n=E(e),r=E(t),n||r){if(!n||!r)return!1;const i=Object.keys(e).length,s=Object.keys(t).length;if(i!==s)return!1;for(const n in e){const r=e.hasOwnProperty(n),i=t.hasOwnProperty(n);if(r&&!i||!r&&i||!ne(e[n],t[n]))return!1}}return String(e)===String(t)}function re(e,t){return e.findIndex(e=>ne(e,t))}const ie=e=>!(!e||!0!==e["__v_isRef"]),se=e=>w(e)?e:null==e?"":p(e)||E(e)&&(e.toString===I||!_(e.toString))?ie(e)?se(e.value):JSON.stringify(e,oe,2):String(e),oe=(e,t)=>ie(t)?oe(e,t.value):g(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[ae(t,r)+" =>"]=n,e),{})}:m(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>ae(e))}:b(t)?ae(t):!E(t)||p(t)||A(t)?t:String(t),ae=(e,t="")=>{var n;return b(e)?`Symbol(${null!=(n=e.description)?n:t})`:e}},125:function(e,t,n){"use strict";n.d(t,{h1:function(){return c},uA:function(){return i}});var r=n(743);class i{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
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
 */const s="[DEFAULT]";
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
 */class o{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new r.cY;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(null===e||void 0===e?void 0:e.identifier),r=null!==(t=null===e||void 0===e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(r)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(u(e))try{this.getOrInitializeService({instanceIdentifier:s})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=s){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=s){return this.instances.has(e)}getOptions(e=s){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,s]of this.instancesDeferred.entries()){const e=this.normalizeInstanceIdentifier(i);n===e&&s.resolve(r)}return r}onInit(e,t){var n;const r=this.normalizeInstanceIdentifier(t),i=null!==(n=this.onInitCallbacks.get(r))&&void 0!==n?n:new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch(r){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:a(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(r){}return n||null}normalizeInstanceIdentifier(e=s){return this.component?this.component.multipleInstances?e:s:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}function a(e){return e===s?void 0:e}function u(e){return"EAGER"===e.instantiationMode}
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
 */class c{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){const t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new o(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}},146:function(e,t,n){"use strict";n.d(t,{_:function(){return a}});var r=Object.defineProperty,i=(e,t,n)=>t in e?r(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,s=(e,t,n)=>(i(e,"symbol"!=typeof t?t+"":t,n),n);class o{constructor(){s(this,"current",this.detect()),s(this,"currentId",0)}set(e){this.current!==e&&(this.currentId=0,this.current=e)}reset(){this.set(this.detect())}nextId(){return++this.currentId}get isServer(){return"server"===this.current}get isClient(){return"client"===this.current}detect(){return"undefined"==typeof window||"undefined"==typeof document?"server":"client"}}let a=new o},223:function(e,t,n){"use strict";n.d(t,{Wp:function(){return r.Wp}});var r=n(928),i="firebase",s="10.14.1";
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
(0,r.KO)(i,s,"app")},232:function(e,t,n){"use strict";n.d(t,{_:function(){return R},O:function(){return N}});var r=n(641),i=n(953),s=n(33),o=n(869),a=n(14),u=n(413),c=n(146),l=n(388),h=n(605),f=n(858);function d(e){let t={called:!1};return(...n)=>{if(!t.called)return t.called=!0,e(...n)}}function p(e,...t){e&&t.length>0&&e.classList.add(...t)}function g(e,...t){e&&t.length>0&&e.classList.remove(...t)}var m=(e=>(e.Finished="finished",e.Cancelled="cancelled",e))(m||{});function v(e,t){let n=(0,f.e)();if(!e)return n.dispose;let{transitionDuration:r,transitionDelay:i}=getComputedStyle(e),[s,o]=[r,i].map(e=>{let[t=0]=e.split(",").filter(Boolean).map(e=>e.includes("ms")?parseFloat(e):1e3*parseFloat(e)).sort((e,t)=>t-e);return t});return 0!==s?n.setTimeout(()=>t("finished"),s+o):t("finished"),n.add(()=>t("cancelled")),n.dispose}function y(e,t,n,r,i,s){let o=(0,f.e)(),a=void 0!==s?d(s):()=>{};return g(e,...i),p(e,...t,...n),o.nextFrame(()=>{g(e,...n),p(e,...r),o.add(v(e,n=>(g(e,...r,...t),p(e,...i),a(n))))}),o.add(()=>g(e,...t,...n,...r,...i)),o.add(()=>a("cancelled")),o.dispose}function _(e=""){return e.split(/\s+/).filter(e=>e.length>1)}let w=Symbol("TransitionContext");var b=(e=>(e.Visible="visible",e.Hidden="hidden",e))(b||{});function E(){return null!==(0,r.WQ)(w,null)}function T(){let e=(0,r.WQ)(w,null);if(null===e)throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");return e}function I(){let e=(0,r.WQ)(S,null);if(null===e)throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");return e}let S=Symbol("NestingContext");function C(e){return"children"in e?C(e.children):e.value.filter(({state:e})=>"visible"===e).length>0}function A(e){let t=(0,i.KR)([]),n=(0,i.KR)(!1);function s(r,i=h.mK.Hidden){let s=t.value.findIndex(({id:e})=>e===r);-1!==s&&((0,l.Y)(i,{[h.mK.Unmount](){t.value.splice(s,1)},[h.mK.Hidden](){t.value[s].state="hidden"}}),!C(t)&&n.value&&(null==e||e()))}function o(e){let n=t.value.find(({id:t})=>t===e);return n?"visible"!==n.state&&(n.state="visible"):t.value.push({id:e,state:"visible"}),()=>s(e,h.mK.Unmount)}return(0,r.sV)(()=>n.value=!0),(0,r.hi)(()=>n.value=!1),{children:t,register:o,unregister:s}}let k=h.O5.RenderStrategy,R=(0,r.pM)({props:{as:{type:[Object,String],default:"div"},show:{type:[Boolean],default:null},unmount:{type:[Boolean],default:!0},appear:{type:[Boolean],default:!1},enter:{type:[String],default:""},enterFrom:{type:[String],default:""},enterTo:{type:[String],default:""},entered:{type:[String],default:""},leave:{type:[String],default:""},leaveFrom:{type:[String],default:""},leaveTo:{type:[String],default:""}},emits:{beforeEnter:()=>!0,afterEnter:()=>!0,beforeLeave:()=>!0,afterLeave:()=>!0},setup(e,{emit:t,attrs:n,slots:f,expose:d}){let p=(0,i.KR)(0);function g(){p.value|=a.Uw.Opening,t("beforeEnter")}function v(){p.value&=~a.Uw.Opening,t("afterEnter")}function w(){p.value|=a.Uw.Closing,t("beforeLeave")}function b(){p.value&=~a.Uw.Closing,t("afterLeave")}if(!E()&&(0,a.zy)())return()=>(0,r.h)(N,{...e,onBeforeEnter:g,onAfterEnter:v,onBeforeLeave:w,onAfterLeave:b},f);let R=(0,i.KR)(null),O=(0,r.EW)(()=>e.unmount?h.mK.Unmount:h.mK.Hidden);d({el:R,$el:R});let{show:D,appear:x}=T(),{register:P,unregister:L}=I(),M=(0,i.KR)(D.value?"visible":"hidden"),U={value:!0},F=(0,o.B)(),V={value:!1},j=A(()=>{!V.value&&"hidden"!==M.value&&(M.value="hidden",L(F),b())});(0,r.sV)(()=>{let e=P(F);(0,r.hi)(e)}),(0,r.nT)(()=>{if(O.value===h.mK.Hidden&&F){if(D.value&&"visible"!==M.value)return void(M.value="visible");(0,l.Y)(M.value,{["hidden"]:()=>L(F),["visible"]:()=>P(F)})}});let B=_(e.enter),$=_(e.enterFrom),q=_(e.enterTo),K=_(e.entered),W=_(e.leave),G=_(e.leaveFrom),z=_(e.leaveTo);function H(e){let t=U.value&&!x.value,n=(0,u.t)(R);!n||!(n instanceof HTMLElement)||t||(V.value=!0,D.value&&g(),D.value||w(),e(D.value?y(n,B,$,q,K,e=>{V.value=!1,e===m.Finished&&v()}):y(n,W,G,z,K,e=>{V.value=!1,e===m.Finished&&(C(j)||(M.value="hidden",L(F),b()))})))}return(0,r.sV)(()=>{(0,r.nT)(()=>{if("visible"===M.value){let e=(0,u.t)(R);if(e instanceof Comment&&""===e.data)throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?")}})}),(0,r.sV)(()=>{(0,r.wB)([D],(e,t,n)=>{H(n),U.value=!1},{immediate:!0})}),(0,r.Gt)(S,j),(0,a.Fo)((0,r.EW)(()=>(0,l.Y)(M.value,{["visible"]:a.Uw.Open,["hidden"]:a.Uw.Closed})|p.value)),()=>{let{appear:t,show:r,enter:i,enterFrom:o,enterTo:a,entered:u,leave:l,leaveFrom:d,leaveTo:p,...g}=e,m={ref:R},v={...g,...x.value&&D.value&&c._.isServer?{class:(0,s.C4)([n.class,g.class,...B,...$])}:{}};return(0,h.XX)({theirProps:v,ourProps:m,slot:{},slots:f,attrs:n,features:k,visible:"visible"===M.value,name:"TransitionChild"})}}}),O=R,N=(0,r.pM)({inheritAttrs:!1,props:{as:{type:[Object,String],default:"div"},show:{type:[Boolean],default:null},unmount:{type:[Boolean],default:!0},appear:{type:[Boolean],default:!1},enter:{type:[String],default:""},enterFrom:{type:[String],default:""},enterTo:{type:[String],default:""},entered:{type:[String],default:""},leave:{type:[String],default:""},leaveFrom:{type:[String],default:""},leaveTo:{type:[String],default:""}},emits:{beforeEnter:()=>!0,afterEnter:()=>!0,beforeLeave:()=>!0,afterLeave:()=>!0},setup(e,{emit:t,attrs:n,slots:s}){let o=(0,a.O_)(),u=(0,r.EW)(()=>null===e.show&&null!==o?(o.value&a.Uw.Open)===a.Uw.Open:e.show);(0,r.nT)(()=>{if(![!0,!1].includes(u.value))throw new Error('A <Transition /> is used but it is missing a `:show="true | false"` prop.')});let c=(0,i.KR)(u.value?"visible":"hidden"),l=A(()=>{c.value="hidden"}),f=(0,i.KR)(!0),d={show:u,appear:(0,r.EW)(()=>e.appear||!f.value)};return(0,r.sV)(()=>{(0,r.nT)(()=>{f.value=!1,u.value?c.value="visible":C(l)||(c.value="hidden")})}),(0,r.Gt)(S,l),(0,r.Gt)(w,d),()=>{let i=(0,h.cJ)(e,["show","appear","unmount","onBeforeEnter","onBeforeLeave","onAfterEnter","onAfterLeave"]),o={unmount:e.unmount};return(0,h.XX)({ourProps:{...o,as:"template"},theirProps:{},slot:{},slots:{...s,default:()=>[(0,r.h)(O,{onBeforeEnter:()=>t("beforeEnter"),onAfterEnter:()=>t("afterEnter"),onBeforeLeave:()=>t("beforeLeave"),onAfterLeave:()=>t("afterLeave"),...n,...o,...i},s.default)]},attrs:{},features:k,visible:"visible"===c.value,name:"Transition"})}}})},262:function(e,t){"use strict";t.A=(e,t)=>{const n=e.__vccOpts||e;for(const[r,i]of t)n[r]=i;return n}},278:function(e,t,n){"use strict";n.d(t,{y$:function(){return te},Pj:function(){return v}});var r=n(641),i=n(953);function s(){return o().__VUE_DEVTOOLS_GLOBAL_HOOK__}function o(){return"undefined"!==typeof navigator&&"undefined"!==typeof window?window:"undefined"!==typeof globalThis?globalThis:{}}const a="function"===typeof Proxy,u="devtools-plugin:setup",c="plugin:settings:set";let l,h;function f(){var e;return void 0!==l||("undefined"!==typeof window&&window.performance?(l=!0,h=window.performance):"undefined"!==typeof globalThis&&(null===(e=globalThis.perf_hooks)||void 0===e?void 0:e.performance)?(l=!0,h=globalThis.perf_hooks.performance):l=!1),l}function d(){return f()?h.now():Date.now()}class p{constructor(e,t){this.target=null,this.targetQueue=[],this.onQueue=[],this.plugin=e,this.hook=t;const n={};if(e.settings)for(const o in e.settings){const t=e.settings[o];n[o]=t.defaultValue}const r=`__vue-devtools-plugin-settings__${e.id}`;let i=Object.assign({},n);try{const e=localStorage.getItem(r),t=JSON.parse(e);Object.assign(i,t)}catch(s){}this.fallbacks={getSettings(){return i},setSettings(e){try{localStorage.setItem(r,JSON.stringify(e))}catch(s){}i=e},now(){return d()}},t&&t.on(c,(e,t)=>{e===this.plugin.id&&this.fallbacks.setSettings(t)}),this.proxiedOn=new Proxy({},{get:(e,t)=>this.target?this.target.on[t]:(...e)=>{this.onQueue.push({method:t,args:e})}}),this.proxiedTarget=new Proxy({},{get:(e,t)=>this.target?this.target[t]:"on"===t?this.proxiedOn:Object.keys(this.fallbacks).includes(t)?(...e)=>(this.targetQueue.push({method:t,args:e,resolve:()=>{}}),this.fallbacks[t](...e)):(...e)=>new Promise(n=>{this.targetQueue.push({method:t,args:e,resolve:n})})})}async setRealTarget(e){this.target=e;for(const t of this.onQueue)this.target.on[t.method](...t.args);for(const t of this.targetQueue)t.resolve(await this.target[t.method](...t.args))}}function g(e,t){const n=e,r=o(),i=s(),c=a&&n.enableEarlyProxy;if(!i||!r.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__&&c){const e=c?new p(n,i):null,s=r.__VUE_DEVTOOLS_PLUGINS__=r.__VUE_DEVTOOLS_PLUGINS__||[];s.push({pluginDescriptor:n,setupFn:t,proxy:e}),e&&t(e.proxiedTarget)}else i.emit(u,e,t)}
/*!
 * vuex v4.1.0
 * (c) 2022 Evan You
 * @license MIT
 */
var m="store";function v(e){return void 0===e&&(e=null),(0,r.WQ)(null!==e?e:m)}function y(e,t){Object.keys(e).forEach(function(n){return t(e[n],n)})}function _(e){return null!==e&&"object"===typeof e}function w(e){return e&&"function"===typeof e.then}function b(e,t){return function(){return e(t)}}function E(e,t,n){return t.indexOf(e)<0&&(n&&n.prepend?t.unshift(e):t.push(e)),function(){var n=t.indexOf(e);n>-1&&t.splice(n,1)}}function T(e,t){e._actions=Object.create(null),e._mutations=Object.create(null),e._wrappedGetters=Object.create(null),e._modulesNamespaceMap=Object.create(null);var n=e.state;S(e,n,[],e._modules.root,!0),I(e,n,t)}function I(e,t,n){var s=e._state,o=e._scope;e.getters={},e._makeLocalGettersCache=Object.create(null);var a=e._wrappedGetters,u={},c={},l=(0,i.uY)(!0);l.run(function(){y(a,function(t,n){u[n]=b(t,e),c[n]=(0,r.EW)(function(){return u[n]()}),Object.defineProperty(e.getters,n,{get:function(){return c[n].value},enumerable:!0})})}),e._state=(0,i.Kh)({data:t}),e._scope=l,e.strict&&N(e),s&&n&&e._withCommit(function(){s.data=null}),o&&o.stop()}function S(e,t,n,r,i){var s=!n.length,o=e._modules.getNamespace(n);if(r.namespaced&&(e._modulesNamespaceMap[o],e._modulesNamespaceMap[o]=r),!s&&!i){var a=D(t,n.slice(0,-1)),u=n[n.length-1];e._withCommit(function(){a[u]=r.state})}var c=r.context=C(e,o,n);r.forEachMutation(function(t,n){var r=o+n;k(e,r,t,c)}),r.forEachAction(function(t,n){var r=t.root?n:o+n,i=t.handler||t;R(e,r,i,c)}),r.forEachGetter(function(t,n){var r=o+n;O(e,r,t,c)}),r.forEachChild(function(r,s){S(e,t,n.concat(s),r,i)})}function C(e,t,n){var r=""===t,i={dispatch:r?e.dispatch:function(n,r,i){var s=x(n,r,i),o=s.payload,a=s.options,u=s.type;return a&&a.root||(u=t+u),e.dispatch(u,o)},commit:r?e.commit:function(n,r,i){var s=x(n,r,i),o=s.payload,a=s.options,u=s.type;a&&a.root||(u=t+u),e.commit(u,o,a)}};return Object.defineProperties(i,{getters:{get:r?function(){return e.getters}:function(){return A(e,t)}},state:{get:function(){return D(e.state,n)}}}),i}function A(e,t){if(!e._makeLocalGettersCache[t]){var n={},r=t.length;Object.keys(e.getters).forEach(function(i){if(i.slice(0,r)===t){var s=i.slice(r);Object.defineProperty(n,s,{get:function(){return e.getters[i]},enumerable:!0})}}),e._makeLocalGettersCache[t]=n}return e._makeLocalGettersCache[t]}function k(e,t,n,r){var i=e._mutations[t]||(e._mutations[t]=[]);i.push(function(t){n.call(e,r.state,t)})}function R(e,t,n,r){var i=e._actions[t]||(e._actions[t]=[]);i.push(function(t){var i=n.call(e,{dispatch:r.dispatch,commit:r.commit,getters:r.getters,state:r.state,rootGetters:e.getters,rootState:e.state},t);return w(i)||(i=Promise.resolve(i)),e._devtoolHook?i.catch(function(t){throw e._devtoolHook.emit("vuex:error",t),t}):i})}function O(e,t,n,r){e._wrappedGetters[t]||(e._wrappedGetters[t]=function(e){return n(r.state,r.getters,e.state,e.getters)})}function N(e){(0,r.wB)(function(){return e._state.data},function(){0},{deep:!0,flush:"sync"})}function D(e,t){return t.reduce(function(e,t){return e[t]},e)}function x(e,t,n){return _(e)&&e.type&&(n=t,t=e,e=e.type),{type:e,payload:t,options:n}}var P="vuex bindings",L="vuex:mutations",M="vuex:actions",U="vuex",F=0;function V(e,t){g({id:"org.vuejs.vuex",app:e,label:"Vuex",homepage:"https://next.vuex.vuejs.org/",logo:"https://vuejs.org/images/icons/favicon-96x96.png",packageName:"vuex",componentStateTypes:[P]},function(n){n.addTimelineLayer({id:L,label:"Vuex Mutations",color:j}),n.addTimelineLayer({id:M,label:"Vuex Actions",color:j}),n.addInspector({id:U,label:"Vuex",icon:"storage",treeFilterPlaceholder:"Filter stores..."}),n.on.getInspectorTree(function(n){if(n.app===e&&n.inspectorId===U)if(n.filter){var r=[];G(r,t._modules.root,n.filter,""),n.rootNodes=r}else n.rootNodes=[W(t._modules.root,"")]}),n.on.getInspectorState(function(n){if(n.app===e&&n.inspectorId===U){var r=n.nodeId;A(t,r),n.state=z(Q(t._modules,r),"root"===r?t.getters:t._makeLocalGettersCache,r)}}),n.on.editInspectorState(function(n){if(n.app===e&&n.inspectorId===U){var r=n.nodeId,i=n.path;"root"!==r&&(i=r.split("/").filter(Boolean).concat(i)),t._withCommit(function(){n.set(t._state.data,i,n.state.value)})}}),t.subscribe(function(e,t){var r={};e.payload&&(r.payload=e.payload),r.state=t,n.notifyComponentUpdate(),n.sendInspectorTree(U),n.sendInspectorState(U),n.addTimelineEvent({layerId:L,event:{time:Date.now(),title:e.type,data:r}})}),t.subscribeAction({before:function(e,t){var r={};e.payload&&(r.payload=e.payload),e._id=F++,e._time=Date.now(),r.state=t,n.addTimelineEvent({layerId:M,event:{time:e._time,title:e.type,groupId:e._id,subtitle:"start",data:r}})},after:function(e,t){var r={},i=Date.now()-e._time;r.duration={_custom:{type:"duration",display:i+"ms",tooltip:"Action duration",value:i}},e.payload&&(r.payload=e.payload),r.state=t,n.addTimelineEvent({layerId:M,event:{time:Date.now(),title:e.type,groupId:e._id,subtitle:"end",data:r}})}})})}var j=8702998,B=6710886,$=16777215,q={label:"namespaced",textColor:$,backgroundColor:B};function K(e){return e&&"root"!==e?e.split("/").slice(-2,-1)[0]:"Root"}function W(e,t){return{id:t||"root",label:K(t),tags:e.namespaced?[q]:[],children:Object.keys(e._children).map(function(n){return W(e._children[n],t+n+"/")})}}function G(e,t,n,r){r.includes(n)&&e.push({id:r||"root",label:r.endsWith("/")?r.slice(0,r.length-1):r||"Root",tags:t.namespaced?[q]:[]}),Object.keys(t._children).forEach(function(i){G(e,t._children[i],n,r+i+"/")})}function z(e,t,n){t="root"===n?t:t[n];var r=Object.keys(t),i={state:Object.keys(e.state).map(function(t){return{key:t,editable:!0,value:e.state[t]}})};if(r.length){var s=H(t);i.getters=Object.keys(s).map(function(e){return{key:e.endsWith("/")?K(e):e,editable:!1,value:X(function(){return s[e]})}})}return i}function H(e){var t={};return Object.keys(e).forEach(function(n){var r=n.split("/");if(r.length>1){var i=t,s=r.pop();r.forEach(function(e){i[e]||(i[e]={_custom:{value:{},display:e,tooltip:"Module",abstract:!0}}),i=i[e]._custom.value}),i[s]=X(function(){return e[n]})}else t[n]=X(function(){return e[n]})}),t}function Q(e,t){var n=t.split("/").filter(function(e){return e});return n.reduce(function(e,r,i){var s=e[r];if(!s)throw new Error('Missing module "'+r+'" for path "'+t+'".');return i===n.length-1?s:s._children},"root"===t?e:e.root._children)}function X(e){try{return e()}catch(t){return t}}var Y=function(e,t){this.runtime=t,this._children=Object.create(null),this._rawModule=e;var n=e.state;this.state=("function"===typeof n?n():n)||{}},J={namespaced:{configurable:!0}};J.namespaced.get=function(){return!!this._rawModule.namespaced},Y.prototype.addChild=function(e,t){this._children[e]=t},Y.prototype.removeChild=function(e){delete this._children[e]},Y.prototype.getChild=function(e){return this._children[e]},Y.prototype.hasChild=function(e){return e in this._children},Y.prototype.update=function(e){this._rawModule.namespaced=e.namespaced,e.actions&&(this._rawModule.actions=e.actions),e.mutations&&(this._rawModule.mutations=e.mutations),e.getters&&(this._rawModule.getters=e.getters)},Y.prototype.forEachChild=function(e){y(this._children,e)},Y.prototype.forEachGetter=function(e){this._rawModule.getters&&y(this._rawModule.getters,e)},Y.prototype.forEachAction=function(e){this._rawModule.actions&&y(this._rawModule.actions,e)},Y.prototype.forEachMutation=function(e){this._rawModule.mutations&&y(this._rawModule.mutations,e)},Object.defineProperties(Y.prototype,J);var Z=function(e){this.register([],e,!1)};function ee(e,t,n){if(t.update(n),n.modules)for(var r in n.modules){if(!t.getChild(r))return void 0;ee(e.concat(r),t.getChild(r),n.modules[r])}}Z.prototype.get=function(e){return e.reduce(function(e,t){return e.getChild(t)},this.root)},Z.prototype.getNamespace=function(e){var t=this.root;return e.reduce(function(e,n){return t=t.getChild(n),e+(t.namespaced?n+"/":"")},"")},Z.prototype.update=function(e){ee([],this.root,e)},Z.prototype.register=function(e,t,n){var r=this;void 0===n&&(n=!0);var i=new Y(t,n);if(0===e.length)this.root=i;else{var s=this.get(e.slice(0,-1));s.addChild(e[e.length-1],i)}t.modules&&y(t.modules,function(t,i){r.register(e.concat(i),t,n)})},Z.prototype.unregister=function(e){var t=this.get(e.slice(0,-1)),n=e[e.length-1],r=t.getChild(n);r&&r.runtime&&t.removeChild(n)},Z.prototype.isRegistered=function(e){var t=this.get(e.slice(0,-1)),n=e[e.length-1];return!!t&&t.hasChild(n)};function te(e){return new ne(e)}var ne=function(e){var t=this;void 0===e&&(e={});var n=e.plugins;void 0===n&&(n=[]);var r=e.strict;void 0===r&&(r=!1);var i=e.devtools;this._committing=!1,this._actions=Object.create(null),this._actionSubscribers=[],this._mutations=Object.create(null),this._wrappedGetters=Object.create(null),this._modules=new Z(e),this._modulesNamespaceMap=Object.create(null),this._subscribers=[],this._makeLocalGettersCache=Object.create(null),this._scope=null,this._devtools=i;var s=this,o=this,a=o.dispatch,u=o.commit;this.dispatch=function(e,t){return a.call(s,e,t)},this.commit=function(e,t,n){return u.call(s,e,t,n)},this.strict=r;var c=this._modules.root.state;S(this,c,[],this._modules.root),I(this,c),n.forEach(function(e){return e(t)})},re={state:{configurable:!0}};ne.prototype.install=function(e,t){e.provide(t||m,this),e.config.globalProperties.$store=this;var n=void 0!==this._devtools&&this._devtools;n&&V(e,this)},re.state.get=function(){return this._state.data},re.state.set=function(e){0},ne.prototype.commit=function(e,t,n){var r=this,i=x(e,t,n),s=i.type,o=i.payload,a=(i.options,{type:s,payload:o}),u=this._mutations[s];u&&(this._withCommit(function(){u.forEach(function(e){e(o)})}),this._subscribers.slice().forEach(function(e){return e(a,r.state)}))},ne.prototype.dispatch=function(e,t){var n=this,r=x(e,t),i=r.type,s=r.payload,o={type:i,payload:s},a=this._actions[i];if(a){try{this._actionSubscribers.slice().filter(function(e){return e.before}).forEach(function(e){return e.before(o,n.state)})}catch(c){0}var u=a.length>1?Promise.all(a.map(function(e){return e(s)})):a[0](s);return new Promise(function(e,t){u.then(function(t){try{n._actionSubscribers.filter(function(e){return e.after}).forEach(function(e){return e.after(o,n.state)})}catch(c){0}e(t)},function(e){try{n._actionSubscribers.filter(function(e){return e.error}).forEach(function(t){return t.error(o,n.state,e)})}catch(c){0}t(e)})})}},ne.prototype.subscribe=function(e,t){return E(e,this._subscribers,t)},ne.prototype.subscribeAction=function(e,t){var n="function"===typeof e?{before:e}:e;return E(n,this._actionSubscribers,t)},ne.prototype.watch=function(e,t,n){var i=this;return(0,r.wB)(function(){return e(i.state,i.getters)},t,Object.assign({},n))},ne.prototype.replaceState=function(e){var t=this;this._withCommit(function(){t._state.data=e})},ne.prototype.registerModule=function(e,t,n){void 0===n&&(n={}),"string"===typeof e&&(e=[e]),this._modules.register(e,t),S(this,this.state,e,this._modules.get(e),n.preserveState),I(this,this.state)},ne.prototype.unregisterModule=function(e){var t=this;"string"===typeof e&&(e=[e]),this._modules.unregister(e),this._withCommit(function(){var n=D(t.state,e.slice(0,-1));delete n[e[e.length-1]]}),T(this)},ne.prototype.hasModule=function(e){return"string"===typeof e&&(e=[e]),this._modules.isRegistered(e)},ne.prototype.hotUpdate=function(e){this._modules.update(e),T(this,!0)},ne.prototype._withCommit=function(e){var t=this._committing;this._committing=!0,e(),this._committing=t},Object.defineProperties(ne.prototype,re);oe(function(e,t){var n={};return ie(t).forEach(function(t){var r=t.key,i=t.val;n[r]=function(){var t=this.$store.state,n=this.$store.getters;if(e){var r=ae(this.$store,"mapState",e);if(!r)return;t=r.context.state,n=r.context.getters}return"function"===typeof i?i.call(this,t,n):t[i]},n[r].vuex=!0}),n}),oe(function(e,t){var n={};return ie(t).forEach(function(t){var r=t.key,i=t.val;n[r]=function(){var t=[],n=arguments.length;while(n--)t[n]=arguments[n];var r=this.$store.commit;if(e){var s=ae(this.$store,"mapMutations",e);if(!s)return;r=s.context.commit}return"function"===typeof i?i.apply(this,[r].concat(t)):r.apply(this.$store,[i].concat(t))}}),n}),oe(function(e,t){var n={};return ie(t).forEach(function(t){var r=t.key,i=t.val;i=e+i,n[r]=function(){if(!e||ae(this.$store,"mapGetters",e))return this.$store.getters[i]},n[r].vuex=!0}),n}),oe(function(e,t){var n={};return ie(t).forEach(function(t){var r=t.key,i=t.val;n[r]=function(){var t=[],n=arguments.length;while(n--)t[n]=arguments[n];var r=this.$store.dispatch;if(e){var s=ae(this.$store,"mapActions",e);if(!s)return;r=s.context.dispatch}return"function"===typeof i?i.apply(this,[r].concat(t)):r.apply(this.$store,[i].concat(t))}}),n});function ie(e){return se(e)?Array.isArray(e)?e.map(function(e){return{key:e,val:e}}):Object.keys(e).map(function(t){return{key:t,val:e[t]}}):[]}function se(e){return Array.isArray(e)||_(e)}function oe(e){return function(t,n){return"string"!==typeof t?(n=t,t=""):"/"!==t.charAt(t.length-1)&&(t+="/"),e(t,n)}}function ae(e,t,n){var r=e._modulesNamespaceMap[n];return r}},353:function(e,t,n){"use strict";n.d(t,{A:function(){return i}});var r=n(641);function i(e,t){return(0,r.uX)(),(0,r.Wv)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"2",stroke:"currentColor","aria-hidden":"true"},[(0,r.bF)("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18L18 6M6 6l12 12"})])}},388:function(e,t,n){"use strict";function r(e,t,...n){if(e in t){let r=t[e];return"function"==typeof r?r(...n):r}let i=new Error(`Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(t).map(e=>`"${e}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(i,r),i}n.d(t,{Y:function(){return r}})},413:function(e,t,n){"use strict";function r(e){var t;if(null==e||null==e.value)return null;let n=null!=(t=e.value.$el)?t:e.value;return n instanceof Node?n:null}n.d(t,{t:function(){return r}})},424:function(e,t,n){"use strict";n.d(t,{$b:function(){return i},Vy:function(){return c}});
/**
 * @license
 * Copyright 2017 Google LLC
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
const r=[];var i;(function(e){e[e["DEBUG"]=0]="DEBUG",e[e["VERBOSE"]=1]="VERBOSE",e[e["INFO"]=2]="INFO",e[e["WARN"]=3]="WARN",e[e["ERROR"]=4]="ERROR",e[e["SILENT"]=5]="SILENT"})(i||(i={}));const s={debug:i.DEBUG,verbose:i.VERBOSE,info:i.INFO,warn:i.WARN,error:i.ERROR,silent:i.SILENT},o=i.INFO,a={[i.DEBUG]:"log",[i.VERBOSE]:"log",[i.INFO]:"info",[i.WARN]:"warn",[i.ERROR]:"error"},u=(e,t,...n)=>{if(t<e.logLevel)return;const r=(new Date).toISOString(),i=a[t];if(!i)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[i](`[${r}]  ${e.name}:`,...n)};class c{constructor(e){this.name=e,this._logLevel=o,this._logHandler=u,this._userLogHandler=null,r.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in i))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"===typeof e?s[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!==typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,i.DEBUG,...e),this._logHandler(this,i.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,i.VERBOSE,...e),this._logHandler(this,i.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,i.INFO,...e),this._logHandler(this,i.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,i.WARN,...e),this._logHandler(this,i.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,i.ERROR,...e),this._logHandler(this,i.ERROR,...e)}}},496:function(e,t,n){"use strict";n.d(t,{eJ:function(){return Ut},xI:function(){return Jr},hg:function(){return Kt},gA:function(){return Vt},x9:function(){return Ft},CI:function(){return Wt},r7:function(){return Bt}});var r=n(928),i=n(743),s=n(424);function o(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n}Object.create;Object.create;"function"===typeof SuppressedError&&SuppressedError;var a=n(125);function u(){return{["dependent-sdk-initialized-before-auth"]:"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const c=u,l=new i.FA("auth","Firebase",u()),h=new s.Vy("@firebase/auth");function f(e,...t){h.logLevel<=s.$b.WARN&&h.warn(`Auth (${r.MF}): ${e}`,...t)}function d(e,...t){h.logLevel<=s.$b.ERROR&&h.error(`Auth (${r.MF}): ${e}`,...t)}
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
 */function p(e,...t){throw y(e,...t)}function g(e,...t){return y(e,...t)}function m(e,t,n){const r=Object.assign(Object.assign({},c()),{[t]:n}),s=new i.FA("auth","Firebase",r);return s.create(t,{appName:e.name})}function v(e){return m(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function y(e,...t){if("string"!==typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return l.create(e,...t)}function _(e,t,...n){if(!e)throw y(t,...n)}function w(e){const t="INTERNAL ASSERTION FAILED: "+e;throw d(t),new Error(t)}function b(e,t){e||w(t)}
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
 */function E(){var e;return"undefined"!==typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function T(){return"http:"===I()||"https:"===I()}function I(){var e;return"undefined"!==typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}
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
 */function S(){return!("undefined"!==typeof navigator&&navigator&&"onLine"in navigator&&"boolean"===typeof navigator.onLine&&(T()||(0,i.sr)()||"connection"in navigator))||navigator.onLine}function C(){if("undefined"===typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}
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
 */class A{constructor(e,t){this.shortDelay=e,this.longDelay=t,b(t>e,"Short delay should be less than long delay!"),this.isMobile=(0,i.jZ)()||(0,i.lV)()}get(){return S()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
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
 */function k(e,t){b(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
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
 */class R{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!==typeof self&&"fetch"in self?self.fetch:"undefined"!==typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!==typeof fetch?fetch:void w("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!==typeof self&&"Headers"in self?self.Headers:"undefined"!==typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!==typeof Headers?Headers:void w("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!==typeof self&&"Response"in self?self.Response:"undefined"!==typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!==typeof Response?Response:void w("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
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
 */const O={["CREDENTIAL_MISMATCH"]:"custom-token-mismatch",["MISSING_CUSTOM_TOKEN"]:"internal-error",["INVALID_IDENTIFIER"]:"invalid-email",["MISSING_CONTINUE_URI"]:"internal-error",["INVALID_PASSWORD"]:"wrong-password",["MISSING_PASSWORD"]:"missing-password",["INVALID_LOGIN_CREDENTIALS"]:"invalid-credential",["EMAIL_EXISTS"]:"email-already-in-use",["PASSWORD_LOGIN_DISABLED"]:"operation-not-allowed",["INVALID_IDP_RESPONSE"]:"invalid-credential",["INVALID_PENDING_TOKEN"]:"invalid-credential",["FEDERATED_USER_ID_ALREADY_LINKED"]:"credential-already-in-use",["MISSING_REQ_TYPE"]:"internal-error",["EMAIL_NOT_FOUND"]:"user-not-found",["RESET_PASSWORD_EXCEED_LIMIT"]:"too-many-requests",["EXPIRED_OOB_CODE"]:"expired-action-code",["INVALID_OOB_CODE"]:"invalid-action-code",["MISSING_OOB_CODE"]:"internal-error",["CREDENTIAL_TOO_OLD_LOGIN_AGAIN"]:"requires-recent-login",["INVALID_ID_TOKEN"]:"invalid-user-token",["TOKEN_EXPIRED"]:"user-token-expired",["USER_NOT_FOUND"]:"user-token-expired",["TOO_MANY_ATTEMPTS_TRY_LATER"]:"too-many-requests",["PASSWORD_DOES_NOT_MEET_REQUIREMENTS"]:"password-does-not-meet-requirements",["INVALID_CODE"]:"invalid-verification-code",["INVALID_SESSION_INFO"]:"invalid-verification-id",["INVALID_TEMPORARY_PROOF"]:"invalid-credential",["MISSING_SESSION_INFO"]:"missing-verification-id",["SESSION_EXPIRED"]:"code-expired",["MISSING_ANDROID_PACKAGE_NAME"]:"missing-android-pkg-name",["UNAUTHORIZED_DOMAIN"]:"unauthorized-continue-uri",["INVALID_OAUTH_CLIENT_ID"]:"invalid-oauth-client-id",["ADMIN_ONLY_OPERATION"]:"admin-restricted-operation",["INVALID_MFA_PENDING_CREDENTIAL"]:"invalid-multi-factor-session",["MFA_ENROLLMENT_NOT_FOUND"]:"multi-factor-info-not-found",["MISSING_MFA_ENROLLMENT_ID"]:"missing-multi-factor-info",["MISSING_MFA_PENDING_CREDENTIAL"]:"missing-multi-factor-session",["SECOND_FACTOR_EXISTS"]:"second-factor-already-in-use",["SECOND_FACTOR_LIMIT_EXCEEDED"]:"maximum-second-factor-count-exceeded",["BLOCKING_FUNCTION_ERROR_RESPONSE"]:"internal-error",["RECAPTCHA_NOT_ENABLED"]:"recaptcha-not-enabled",["MISSING_RECAPTCHA_TOKEN"]:"missing-recaptcha-token",["INVALID_RECAPTCHA_TOKEN"]:"invalid-recaptcha-token",["INVALID_RECAPTCHA_ACTION"]:"invalid-recaptcha-action",["MISSING_CLIENT_TYPE"]:"missing-client-type",["MISSING_RECAPTCHA_VERSION"]:"missing-recaptcha-version",["INVALID_RECAPTCHA_VERSION"]:"invalid-recaptcha-version",["INVALID_REQ_TYPE"]:"invalid-req-type"},N=new A(3e4,6e4);
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
 */function D(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function x(e,t,n,r,s={}){return P(e,s,async()=>{let s={},o={};r&&("GET"===t?o=r:s={body:JSON.stringify(r)});const a=(0,i.Am)(Object.assign({key:e.config.apiKey},o)).slice(1),u=await e._getAdditionalHeaders();u["Content-Type"]="application/json",e.languageCode&&(u["X-Firebase-Locale"]=e.languageCode);const c=Object.assign({method:t,headers:u},s);return(0,i.c1)()||(c.referrerPolicy="no-referrer"),R.fetch()(M(e,e.config.apiHost,n,a),c)})}async function P(e,t,n){e._canInitEmulator=!1;const r=Object.assign(Object.assign({},O),t);try{const t=new F(e),i=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const s=await i.json();if("needConfirmation"in s)throw V(e,"account-exists-with-different-credential",s);if(i.ok&&!("errorMessage"in s))return s;{const t=i.ok?s.errorMessage:s.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw V(e,"credential-already-in-use",s);if("EMAIL_EXISTS"===n)throw V(e,"email-already-in-use",s);if("USER_DISABLED"===n)throw V(e,"user-disabled",s);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw m(e,a,o);p(e,a)}}catch(s){if(s instanceof i.g)throw s;p(e,"network-request-failed",{message:String(s)})}}async function L(e,t,n,r,i={}){const s=await x(e,t,n,r,i);return"mfaPendingCredential"in s&&p(e,"multi-factor-auth-required",{_serverResponse:s}),s}function M(e,t,n,r){const i=`${t}${n}?${r}`;return e.config.emulator?k(e.config,i):`${e.config.apiScheme}://${i}`}function U(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class F{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(g(this.auth,"network-request-failed")),N.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function V(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=g(e,t,r);return i.customData._tokenResponse=n,i}
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
 */function j(e){return void 0!==e&&void 0!==e.enterprise}class B{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return U(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}}
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
 */async function $(e,t){return x(e,"GET","/v2/recaptchaConfig",D(e,t))}
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
 */async function q(e,t){return x(e,"POST","/v1/accounts:delete",t)}async function K(e,t){return x(e,"POST","/v1/accounts:lookup",t)}
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
 */function W(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}
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
 */async function G(e,t=!1){const n=(0,i.Ku)(e),r=await n.getIdToken(t),s=H(r);_(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const o="object"===typeof s.firebase?s.firebase:void 0,a=null===o||void 0===o?void 0:o["sign_in_provider"];return{claims:s,token:r,authTime:W(z(s.auth_time)),issuedAtTime:W(z(s.iat)),expirationTime:W(z(s.exp)),signInProvider:a||null,signInSecondFactor:(null===o||void 0===o?void 0:o["sign_in_second_factor"])||null}}function z(e){return 1e3*Number(e)}function H(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return d("JWT malformed, contained fewer than 3 sections"),null;try{const e=(0,i.u)(n);return e?JSON.parse(e):(d("Failed to decode base64 JWT payload"),null)}catch(s){return d("Caught error parsing JWT payload as JSON",null===s||void 0===s?void 0:s.toString()),null}}function Q(e){const t=H(e);return _(t,"internal-error"),_("undefined"!==typeof t.exp,"internal-error"),_("undefined"!==typeof t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
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
 */async function X(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof i.g&&Y(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}function Y({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
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
 */class J{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0,n=e-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===(null===e||void 0===e?void 0:e.code)&&this.schedule(!0))}this.schedule()}}
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
 */class Z{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=W(this.lastLoginAt),this.creationTime=W(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
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
 */async function ee(e){var t;const n=e.auth,r=await e.getIdToken(),i=await X(e,K(n,{idToken:r}));_(null===i||void 0===i?void 0:i.users.length,n,"internal-error");const s=i.users[0];e._notifyReloadListener(s);const o=(null===(t=s.providerUserInfo)||void 0===t?void 0:t.length)?re(s.providerUserInfo):[],a=ne(e.providerData,o),u=e.isAnonymous,c=!(e.email&&s.passwordHash)&&!(null===a||void 0===a?void 0:a.length),l=!!u&&c,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Z(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(e,h)}async function te(e){const t=(0,i.Ku)(e);await ee(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function ne(e,t){const n=e.filter(e=>!t.some(t=>t.providerId===e.providerId));return[...n,...t]}function re(e){return e.map(e=>{var{providerId:t}=e,n=o(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}
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
 */async function ie(e,t){const n=await P(e,{},async()=>{const n=(0,i.Am)({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:s}=e.config,o=M(e,r,"/v1/token",`key=${s}`),a=await e._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",R.fetch()(o,{method:"POST",headers:a,body:n})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function se(e,t){return x(e,"POST","/v2/accounts:revokeToken",D(e,t))}
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
 */class oe{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_(e.idToken,"internal-error"),_("undefined"!==typeof e.idToken,"internal-error"),_("undefined"!==typeof e.refreshToken,"internal-error");const t="expiresIn"in e&&"undefined"!==typeof e.expiresIn?Number(e.expiresIn):Q(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){_(0!==e.length,"internal-error");const t=Q(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(_(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:i}=await ie(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:i}=t,s=new oe;return n&&(_("string"===typeof n,"internal-error",{appName:e}),s.refreshToken=n),r&&(_("string"===typeof r,"internal-error",{appName:e}),s.accessToken=r),i&&(_("number"===typeof i,"internal-error",{appName:e}),s.expirationTime=i),s}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new oe,this.toJSON())}_performRefresh(){return w("not implemented")}}
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
 */function ae(e,t){_("string"===typeof e||"undefined"===typeof e,"internal-error",{appName:t})}class ue{constructor(e){var{uid:t,auth:n,stsTokenManager:r}=e,i=o(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new J(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Z(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await X(this,this.stsTokenManager.getToken(this.auth,e));return _(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return G(this,e)}reload(){return te(this)}_assign(e){this!==e&&(_(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>Object.assign({},e)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new ue(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){_(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await ee(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if((0,r.xZ)(this.auth.app))return Promise.reject(v(this.auth));const e=await this.getIdToken();return await X(this,q(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,r,i,s,o,a,u,c;const l=null!==(n=t.displayName)&&void 0!==n?n:void 0,h=null!==(r=t.email)&&void 0!==r?r:void 0,f=null!==(i=t.phoneNumber)&&void 0!==i?i:void 0,d=null!==(s=t.photoURL)&&void 0!==s?s:void 0,p=null!==(o=t.tenantId)&&void 0!==o?o:void 0,g=null!==(a=t._redirectEventId)&&void 0!==a?a:void 0,m=null!==(u=t.createdAt)&&void 0!==u?u:void 0,v=null!==(c=t.lastLoginAt)&&void 0!==c?c:void 0,{uid:y,emailVerified:w,isAnonymous:b,providerData:E,stsTokenManager:T}=t;_(y&&T,e,"internal-error");const I=oe.fromJSON(this.name,T);_("string"===typeof y,e,"internal-error"),ae(l,e.name),ae(h,e.name),_("boolean"===typeof w,e,"internal-error"),_("boolean"===typeof b,e,"internal-error"),ae(f,e.name),ae(d,e.name),ae(p,e.name),ae(g,e.name),ae(m,e.name),ae(v,e.name);const S=new ue({uid:y,auth:e,email:h,emailVerified:w,displayName:l,isAnonymous:b,photoURL:d,phoneNumber:f,tenantId:p,stsTokenManager:I,createdAt:m,lastLoginAt:v});return E&&Array.isArray(E)&&(S.providerData=E.map(e=>Object.assign({},e))),g&&(S._redirectEventId=g),S}static async _fromIdTokenResponse(e,t,n=!1){const r=new oe;r.updateFromServerResponse(t);const i=new ue({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await ee(i),i}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];_(void 0!==r.localId,"internal-error");const i=void 0!==r.providerUserInfo?re(r.providerUserInfo):[],s=!(r.email&&r.passwordHash)&&!(null===i||void 0===i?void 0:i.length),o=new oe;o.updateFromIdToken(n);const a=new ue({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:s}),u={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new Z(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(null===i||void 0===i?void 0:i.length)};return Object.assign(a,u),a}}
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
 */const ce=new Map;function le(e){b(e instanceof Function,"Expected a class definition");let t=ce.get(e);return t?(b(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,ce.set(e,t),t)}
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
 */class he{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}he.type="NONE";const fe=he;
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
 */function de(e,t,n){return`firebase:${e}:${t}:${n}`}class pe{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:i}=this.auth;this.fullUserKey=de(this.userKey,r.apiKey,i),this.fullPersistenceKey=de("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?ue._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new pe(le(fe),e,n);const r=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e);let i=r[0]||le(fe);const s=de(n,e.config.apiKey,e.name);let o=null;for(const c of t)try{const t=await c._get(s);if(t){const n=ue._fromJSON(e,t);c!==i&&(o=n),i=c;break}}catch(u){}const a=r.filter(e=>e._shouldAllowMigration);return i._shouldAllowMigration&&a.length?(i=a[0],o&&await i._set(s,o.toJSON()),await Promise.all(t.map(async e=>{if(e!==i)try{await e._remove(s)}catch(u){}})),new pe(i,e,n)):new pe(i,e,n)}}
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
 */function ge(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(_e(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(me(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(be(t))return"Blackberry";if(Ee(t))return"Webos";if(ve(t))return"Safari";if((t.includes("chrome/")||ye(t))&&!t.includes("edge/"))return"Chrome";if(we(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null===n||void 0===n?void 0:n.length))return n[1]}return"Other"}function me(e=(0,i.ZQ)()){return/firefox\//i.test(e)}function ve(e=(0,i.ZQ)()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function ye(e=(0,i.ZQ)()){return/crios\//i.test(e)}function _e(e=(0,i.ZQ)()){return/iemobile/i.test(e)}function we(e=(0,i.ZQ)()){return/android/i.test(e)}function be(e=(0,i.ZQ)()){return/blackberry/i.test(e)}function Ee(e=(0,i.ZQ)()){return/webos/i.test(e)}function Te(e=(0,i.ZQ)()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function Ie(e=(0,i.ZQ)()){var t;return Te(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}function Se(){return(0,i.lT)()&&10===document.documentMode}function Ce(e=(0,i.ZQ)()){return Te(e)||we(e)||Ee(e)||be(e)||/windows phone/i.test(e)||_e(e)}
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
 */function Ae(e,t=[]){let n;switch(e){case"Browser":n=ge((0,i.ZQ)());break;case"Worker":n=`${ge((0,i.ZQ)())}-${e}`;break;default:n=e}const s=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${r.MF}/${s}`}
/**
 * @license
 * Copyright 2022 Google LLC
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
 */class ke{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise((n,r)=>{try{const r=e(t);n(r)}catch(i){r(i)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null===n||void 0===n?void 0:n.message})}}}
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
 */async function Re(e,t={}){return x(e,"GET","/v2/passwordPolicy",D(e,t))}
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
 */const Oe=6;class Ne{constructor(e){var t,n,r,i;const s=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=null!==(t=s.minPasswordLength)&&void 0!==t?t:Oe,s.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=s.maxPasswordLength),void 0!==s.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=s.containsLowercaseCharacter),void 0!==s.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=s.containsUppercaseCharacter),void 0!==s.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=s.containsNumericCharacter),void 0!==s.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=s.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=null!==(r=null===(n=e.allowedNonAlphanumericCharacters)||void 0===n?void 0:n.join(""))&&void 0!==r?r:"",this.forceUpgradeOnSignin=null!==(i=e.forceUpgradeOnSignin)&&void 0!==i&&i,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,r,i,s,o;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=null===(t=a.meetsMinPasswordLength)||void 0===t||t),a.isValid&&(a.isValid=null===(n=a.meetsMaxPasswordLength)||void 0===n||n),a.isValid&&(a.isValid=null===(r=a.containsLowercaseLetter)||void 0===r||r),a.isValid&&(a.isValid=null===(i=a.containsUppercaseLetter)||void 0===i||i),a.isValid&&(a.isValid=null===(s=a.containsNumericCharacter)||void 0===s||s),a.isValid&&(a.isValid=null===(o=a.containsNonAlphanumericCharacter)||void 0===o||o),a}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}
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
 */class De{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Pe(this),this.idTokenSubscription=new Pe(this),this.beforeStateQueue=new ke(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=l,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=le(t)),this._initializationPromise=this.queue(async()=>{var n,r;if(!this._deleted&&(this.persistenceManager=await pe.create(this,e),!this._deleted)){if(null===(n=this._popupRedirectResolver)||void 0===n?void 0:n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(i){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(r=this.currentUser)||void 0===r?void 0:r.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void await this.currentUser.getIdToken()):void await this._updateCurrentUser(e,!0):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await K(this,{idToken:e}),n=await ue._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if((0,r.xZ)(this.app)){const e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let i=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const n=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,r=null===i||void 0===i?void 0:i._redirectEventId,o=await this.tryRedirectSignIn(e);n&&n!==r||!(null===o||void 0===o?void 0:o.user)||(i=o.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return _(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await ee(e)}catch(t){if("auth/network-request-failed"!==(null===t||void 0===t?void 0:t.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=C()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if((0,r.xZ)(this.app))return Promise.reject(v(this));const t=e?(0,i.Ku)(e):null;return t&&_(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return(0,r.xZ)(this.app)?Promise.reject(v(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return(0,r.xZ)(this.app)?Promise.reject(v(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(le(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Re(this),t=new Ne(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new i.FA("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};null!=this.tenantId&&(n.tenantId=this.tenantId),await se(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&le(e)||this._popupRedirectResolver;_(t,this,"argument-error"),this.redirectPersistenceManager=await pe.create(this,[le(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e?this._currentUser:(null===(n=this.redirectUser)||void 0===n?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const i="function"===typeof t?t:t.next.bind(t);let s=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(_(o,this,"internal-error"),o.then(()=>{s||i(this.currentUser)}),"function"===typeof t){const i=e.addObserver(t,n,r);return()=>{s=!0,i()}}{const n=e.addObserver(t);return()=>{s=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ae(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={["X-Client-Version"]:this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await(null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;const t=await(null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null===t||void 0===t?void 0:t.error)&&f(`Error while retrieving App Check token: ${t.error}`),null===t||void 0===t?void 0:t.token}}function xe(e){return(0,i.Ku)(e)}class Pe{constructor(e){this.auth=e,this.observer=null,this.addObserver=(0,i.tD)(e=>this.observer=e)}get next(){return _(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
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
 */let Le={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Me(e){Le=e}function Ue(e){return Le.loadJS(e)}function Fe(){return Le.recaptchaEnterpriseScript}function Ve(){return Le.gapiScript}function je(e){return`__${e}${Math.floor(1e6*Math.random())}`}const Be="recaptcha-enterprise",$e="NO_RECAPTCHA";class qe{constructor(e){this.type=Be,this.auth=xe(e)}async verify(e="verify",t=!1){async function n(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,n)=>{$(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(r=>{if(void 0!==r.recaptchaKey){const n=new B(r);return null==e.tenantId?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}n(new Error("recaptcha Enterprise site key undefined"))}).catch(e=>{n(e)})})}function r(t,n,r){const i=window.grecaptcha;j(i)?i.enterprise.ready(()=>{i.enterprise.execute(t,{action:e}).then(e=>{n(e)}).catch(()=>{n($e)})}):r(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((e,i)=>{n(this.auth).then(n=>{if(!t&&j(window.grecaptcha))r(n,e,i);else{if("undefined"===typeof window)return void i(new Error("RecaptchaVerifier is only supported in browser"));let t=Fe();0!==t.length&&(t+=n),Ue(t).then(()=>{r(n,e,i)}).catch(e=>{i(e)})}}).catch(e=>{i(e)})})}}async function Ke(e,t,n,r=!1){const i=new qe(e);let s;try{s=await i.verify(n)}catch(a){s=await i.verify(n,!0)}const o=Object.assign({},t);return r?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function We(e,t,n,r){var i;if(null===(i=e._getRecaptchaConfig())||void 0===i?void 0:i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Ke(e,t,n,"getOobCode"===n);return r(e,i)}return r(e,t).catch(async i=>{if("auth/missing-recaptcha-token"===i.code){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const i=await Ke(e,t,n,"getOobCode"===n);return r(e,i)}return Promise.reject(i)})}
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
function Ge(e,t){const n=(0,r.j6)(e,"auth");if(n.isInitialized()){const e=n.getImmediate(),r=n.getOptions();if((0,i.bD)(r,null!==t&&void 0!==t?t:{}))return e;p(e,"already-initialized")}const s=n.initialize({options:t});return s}function ze(e,t){const n=(null===t||void 0===t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(le);(null===t||void 0===t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null===t||void 0===t?void 0:t.popupRedirectResolver)}function He(e,t,n){const r=xe(e);_(r._canInitEmulator,r,"emulator-config-failed"),_(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const i=!!(null===n||void 0===n?void 0:n.disableWarnings),s=Qe(t),{host:o,port:a}=Xe(t),u=null===a?"":`:${a}`;r.config.emulator={url:`${s}//${o}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),i||Je()}function Qe(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function Xe(e){const t=Qe(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const e=i[1];return{host:e,port:Ye(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:Ye(t)}}}function Ye(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}function Je(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!==typeof console&&"function"===typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),"undefined"!==typeof window&&"undefined"!==typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}
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
 */class Ze{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return w("not implemented")}_getIdTokenResponse(e){return w("not implemented")}_linkToIdToken(e,t){return w("not implemented")}_getReauthenticationResolver(e){return w("not implemented")}}
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
 */async function et(e,t){return x(e,"POST","/v1/accounts:signUp",t)}
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
async function tt(e,t){return L(e,"POST","/v1/accounts:signInWithPassword",D(e,t))}async function nt(e,t){return x(e,"POST","/v1/accounts:sendOobCode",D(e,t))}async function rt(e,t){return nt(e,t)}
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
async function it(e,t){return L(e,"POST","/v1/accounts:signInWithEmailLink",D(e,t))}async function st(e,t){return L(e,"POST","/v1/accounts:signInWithEmailLink",D(e,t))}
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
 */class ot extends Ze{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new ot(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new ot(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t="string"===typeof e?JSON.parse(e):e;if((null===t||void 0===t?void 0:t.email)&&(null===t||void 0===t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return We(e,t,"signInWithPassword",tt);case"emailLink":return it(e,{email:this._email,oobCode:this._password});default:p(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return We(e,n,"signUpPassword",et);case"emailLink":return st(e,{idToken:t,email:this._email,oobCode:this._password});default:p(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}
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
 */async function at(e,t){return L(e,"POST","/v1/accounts:signInWithIdp",D(e,t))}
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
 */const ut="http://localhost";class ct extends Ze{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ct(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):p("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"===typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r}=t,i=o(t,["providerId","signInMethod"]);if(!n||!r)return null;const s=new ct(n,r);return s.idToken=i.idToken||void 0,s.accessToken=i.accessToken||void 0,s.secret=i.secret,s.nonce=i.nonce,s.pendingToken=i.pendingToken||null,s}_getIdTokenResponse(e){const t=this.buildRequest();return at(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,at(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,at(e,t)}buildRequest(){const e={requestUri:ut,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t["id_token"]=this.idToken),this.accessToken&&(t["access_token"]=this.accessToken),this.secret&&(t["oauth_token_secret"]=this.secret),t["providerId"]=this.providerId,this.nonce&&!this.pendingToken&&(t["nonce"]=this.nonce),e.postBody=(0,i.Am)(t)}return e}}
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
 */async function lt(e,t){return x(e,"POST","/v1/accounts:sendVerificationCode",D(e,t))}async function ht(e,t){return L(e,"POST","/v1/accounts:signInWithPhoneNumber",D(e,t))}async function ft(e,t){const n=await L(e,"POST","/v1/accounts:signInWithPhoneNumber",D(e,t));if(n.temporaryProof)throw V(e,"account-exists-with-different-credential",n);return n}const dt={["USER_NOT_FOUND"]:"user-not-found"};async function pt(e,t){const n=Object.assign(Object.assign({},t),{operation:"REAUTH"});return L(e,"POST","/v1/accounts:signInWithPhoneNumber",D(e,n),dt)}
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
 */class gt extends Ze{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new gt({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new gt({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return ht(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return ft(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return pt(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:r}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:r}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"===typeof e&&(e=JSON.parse(e));const{verificationId:t,verificationCode:n,phoneNumber:r,temporaryProof:i}=e;return n||t||r||i?new gt({verificationId:t,verificationCode:n,phoneNumber:r,temporaryProof:i}):null}}
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
 */function mt(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function vt(e){const t=(0,i.I9)((0,i.hp)(e))["link"],n=t?(0,i.I9)((0,i.hp)(t))["deep_link_id"]:null,r=(0,i.I9)((0,i.hp)(e))["deep_link_id"],s=r?(0,i.I9)((0,i.hp)(r))["link"]:null;return s||r||n||t||e}class yt{constructor(e){var t,n,r,s,o,a;const u=(0,i.I9)((0,i.hp)(e)),c=null!==(t=u["apiKey"])&&void 0!==t?t:null,l=null!==(n=u["oobCode"])&&void 0!==n?n:null,h=mt(null!==(r=u["mode"])&&void 0!==r?r:null);_(c&&l&&h,"argument-error"),this.apiKey=c,this.operation=h,this.code=l,this.continueUrl=null!==(s=u["continueUrl"])&&void 0!==s?s:null,this.languageCode=null!==(o=u["languageCode"])&&void 0!==o?o:null,this.tenantId=null!==(a=u["tenantId"])&&void 0!==a?a:null}static parseLink(e){const t=vt(e);try{return new yt(t)}catch(n){return null}}}
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
class _t{constructor(){this.providerId=_t.PROVIDER_ID}static credential(e,t){return ot._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=yt.parseLink(t);return _(n,"argument-error"),ot._fromEmailAndCode(e,n.code,n.tenantId)}}_t.PROVIDER_ID="password",_t.EMAIL_PASSWORD_SIGN_IN_METHOD="password",_t.EMAIL_LINK_SIGN_IN_METHOD="emailLink";
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
class wt{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
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
 */class bt extends wt{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}
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
class Et extends bt{constructor(){super("facebook.com")}static credential(e){return ct._fromParams({providerId:Et.PROVIDER_ID,signInMethod:Et.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Et.credentialFromTaggedObject(e)}static credentialFromError(e){return Et.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Et.credential(e.oauthAccessToken)}catch(t){return null}}}Et.FACEBOOK_SIGN_IN_METHOD="facebook.com",Et.PROVIDER_ID="facebook.com";
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
class Tt extends bt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ct._fromParams({providerId:Tt.PROVIDER_ID,signInMethod:Tt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Tt.credentialFromTaggedObject(e)}static credentialFromError(e){return Tt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Tt.credential(t,n)}catch(r){return null}}}Tt.GOOGLE_SIGN_IN_METHOD="google.com",Tt.PROVIDER_ID="google.com";
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
class It extends bt{constructor(){super("github.com")}static credential(e){return ct._fromParams({providerId:It.PROVIDER_ID,signInMethod:It.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return It.credentialFromTaggedObject(e)}static credentialFromError(e){return It.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return It.credential(e.oauthAccessToken)}catch(t){return null}}}It.GITHUB_SIGN_IN_METHOD="github.com",It.PROVIDER_ID="github.com";
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
class St extends bt{constructor(){super("twitter.com")}static credential(e,t){return ct._fromParams({providerId:St.PROVIDER_ID,signInMethod:St.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return St.credentialFromTaggedObject(e)}static credentialFromError(e){return St.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return St.credential(t,n)}catch(r){return null}}}
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
async function Ct(e,t){return L(e,"POST","/v1/accounts:signUp",D(e,t))}
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
 */St.TWITTER_SIGN_IN_METHOD="twitter.com",St.PROVIDER_ID="twitter.com";class At{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const i=await ue._fromIdTokenResponse(e,n,r),s=kt(n),o=new At({user:i,providerId:s,_tokenResponse:n,operationType:t});return o}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=kt(n);return new At({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function kt(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
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
class Rt extends i.g{constructor(e,t,n,r){var i;super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Rt.prototype),this.customData={appName:e.name,tenantId:null!==(i=e.tenantId)&&void 0!==i?i:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Rt(e,t,n,r)}}function Ot(e,t,n,r){const i="reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e);return i.catch(n=>{if("auth/multi-factor-auth-required"===n.code)throw Rt._fromErrorAndOperation(e,n,t,r);throw n})}
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
 */async function Nt(e,t,n=!1){const r=await X(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return At._forOperation(e,"link",r)}
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
async function Dt(e,t,n=!1){const{auth:i}=e;if((0,r.xZ)(i.app))return Promise.reject(v(i));const s="reauthenticate";try{const r=await X(e,Ot(i,s,t,e),n);_(r.idToken,i,"internal-error");const o=H(r.idToken);_(o,i,"internal-error");const{sub:a}=o;return _(e.uid===a,i,"user-mismatch"),At._forOperation(e,s,r)}catch(o){throw"auth/user-not-found"===(null===o||void 0===o?void 0:o.code)&&p(i,"user-mismatch"),o}}
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
 */async function xt(e,t,n=!1){if((0,r.xZ)(e.app))return Promise.reject(v(e));const i="signIn",s=await Ot(e,i,t),o=await At._fromIdTokenResponse(e,i,s);return n||await e._updateCurrentUser(o.user),o}async function Pt(e,t){return xt(xe(e),t)}
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
function Lt(e,t,n){var r;_((null===(r=n.url)||void 0===r?void 0:r.length)>0,e,"invalid-continue-uri"),_("undefined"===typeof n.dynamicLinkDomain||n.dynamicLinkDomain.length>0,e,"invalid-dynamic-link-domain"),t.continueUrl=n.url,t.dynamicLinkDomain=n.dynamicLinkDomain,t.canHandleCodeInApp=n.handleCodeInApp,n.iOS&&(_(n.iOS.bundleId.length>0,e,"missing-ios-bundle-id"),t.iOSBundleId=n.iOS.bundleId),n.android&&(_(n.android.packageName.length>0,e,"missing-android-pkg-name"),t.androidInstallApp=n.android.installApp,t.androidMinimumVersionCode=n.android.minimumVersion,t.androidPackageName=n.android.packageName)}
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
 */async function Mt(e){const t=xe(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function Ut(e,t,n){if((0,r.xZ)(e.app))return Promise.reject(v(e));const i=xe(e),s={returnSecureToken:!0,email:t,password:n,clientType:"CLIENT_TYPE_WEB"},o=We(i,s,"signUpPassword",Ct),a=await o.catch(t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Mt(e),t}),u=await At._fromIdTokenResponse(i,"signIn",a);return await i._updateCurrentUser(u.user),u}function Ft(e,t,n){return(0,r.xZ)(e.app)?Promise.reject(v(e)):Pt((0,i.Ku)(e),_t.credential(t,n)).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Mt(e),t})}
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
 */async function Vt(e,t){const n=(0,i.Ku)(e),r=await e.getIdToken(),s={requestType:"VERIFY_EMAIL",idToken:r};t&&Lt(n.auth,s,t);const{email:o}=await rt(n.auth,s);o!==e.email&&await e.reload()}
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
async function jt(e,t){return x(e,"POST","/v1/accounts:update",t)}
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
 */async function Bt(e,{displayName:t,photoURL:n}){if(void 0===t&&void 0===n)return;const r=(0,i.Ku)(e),s=await r.getIdToken(),o={idToken:s,displayName:t,photoUrl:n,returnSecureToken:!0},a=await X(r,jt(r.auth,o));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const u=r.providerData.find(({providerId:e})=>"password"===e);u&&(u.displayName=r.displayName,u.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function $t(e,t,n,r){return(0,i.Ku)(e).onIdTokenChanged(t,n,r)}function qt(e,t,n){return(0,i.Ku)(e).beforeAuthStateChanged(t,n)}function Kt(e,t,n,r){return(0,i.Ku)(e).onAuthStateChanged(t,n,r)}function Wt(e){return(0,i.Ku)(e).signOut()}
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
function Gt(e,t){return x(e,"POST","/v2/accounts/mfaEnrollment:start",D(e,t))}function zt(e,t){return x(e,"POST","/v2/accounts/mfaEnrollment:finalize",D(e,t))}function Ht(e,t){return x(e,"POST","/v2/accounts/mfaEnrollment:start",D(e,t))}function Qt(e,t){return x(e,"POST","/v2/accounts/mfaEnrollment:finalize",D(e,t))}new WeakMap;const Xt="__sak";
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
 */class Yt{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Xt,"1"),this.storage.removeItem(Xt),Promise.resolve(!0)):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
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
 */const Jt=1e3,Zt=10;class en extends Yt{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ce(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},i=this.storage.getItem(n);Se()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,Zt):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},Jt)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}en.type="LOCAL";const tn=en;
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
 */class nn extends Yt{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}nn.type="SESSION";const rn=nn;
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
 */function sn(e){return Promise.all(e.map(async e=>{try{const t=await e;return{fulfilled:!0,value:t}}catch(t){return{fulfilled:!1,reason:t}}}))}
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
 */class on{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;const n=new on(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:i}=t.data,s=this.handlersMap[r];if(!(null===s||void 0===s?void 0:s.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(s).map(async e=>e(t.origin,i)),a=await sn(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
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
function an(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
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
 */on.receivers=[];class un{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!==typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,s;return new Promise((o,a)=>{const u=an("",20);r.port1.start();const c=setTimeout(()=>{a(new Error("unsupported_event"))},n);s={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===u)switch(t.data.status){case"ack":clearTimeout(c),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),o(t.data.response);break;default:clearTimeout(c),clearTimeout(i),a(new Error("invalid_response"));break}}},this.handlers.add(s),r.port1.addEventListener("message",s.onMessage),this.target.postMessage({eventType:e,eventId:u,data:t},[r.port2])}).finally(()=>{s&&this.removeMessageHandler(s)})}}
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
 */function cn(){return window}function ln(e){cn().location.href=e}
/**
 * @license
 * Copyright 2020 Google LLC.
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
 */function hn(){return"undefined"!==typeof cn()["WorkerGlobalScope"]&&"function"===typeof cn()["importScripts"]}async function fn(){if(!(null===navigator||void 0===navigator?void 0:navigator.serviceWorker))return null;try{const e=await navigator.serviceWorker.ready;return e.active}catch(e){return null}}function dn(){var e;return(null===(e=null===navigator||void 0===navigator?void 0:navigator.serviceWorker)||void 0===e?void 0:e.controller)||null}function pn(){return hn()?self:null}
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
 */const gn="firebaseLocalStorageDb",mn=1,vn="firebaseLocalStorage",yn="fbase_key";class _n{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function wn(e,t){return e.transaction([vn],t?"readwrite":"readonly").objectStore(vn)}function bn(){const e=indexedDB.deleteDatabase(gn);return new _n(e).toPromise()}function En(){const e=indexedDB.open(gn,mn);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const t=e.result;try{t.createObjectStore(vn,{keyPath:yn})}catch(r){n(r)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains(vn)?t(n):(n.close(),await bn(),t(await En()))})})}async function Tn(e,t,n){const r=wn(e,!0).put({[yn]:t,value:n});return new _n(r).toPromise()}async function In(e,t){const n=wn(e,!1).get(t),r=await new _n(n).toPromise();return void 0===r?null:r.value}function Sn(e,t){const n=wn(e,!0).delete(t);return new _n(n).toPromise()}const Cn=800,An=3;class kn{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await En()),this.db}async _withRetries(e){let t=0;while(1)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>An)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return hn()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=on._getInstance(pn()),this.receiver._subscribe("keyChanged",async(e,t)=>{const n=await this._poll();return{keyProcessed:n.includes(t.key)}}),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await fn(),!this.activeServiceWorker)return;this.sender=new un(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null===(e=n[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=n[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(this.sender&&this.activeServiceWorker&&dn()===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(t){}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await En();return await Tn(e,Xt,"1"),await Sn(e,Xt),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Tn(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(t=>In(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Sn(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(e=>{const t=wn(e,!1).getAll();return new _n(t).toPromise()});if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Cn)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}kn.type="LOCAL";const Rn=kn;
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
 */function On(e,t){return x(e,"POST","/v2/accounts/mfaSignIn:start",D(e,t))}function Nn(e,t){return x(e,"POST","/v2/accounts/mfaSignIn:finalize",D(e,t))}function Dn(e,t){return x(e,"POST","/v2/accounts/mfaSignIn:finalize",D(e,t))}
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
je("rcb"),new A(3e4,6e4);
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
const xn="recaptcha";async function Pn(e,t,n){var r;const i=await n.verify();try{let s;if(_("string"===typeof i,e,"argument-error"),_(n.type===xn,e,"argument-error"),s="string"===typeof t?{phoneNumber:t}:t,"session"in s){const t=s.session;if("phoneNumber"in s){_("enroll"===t.type,e,"internal-error");const n=await Gt(e,{idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,recaptchaToken:i}});return n.phoneSessionInfo.sessionInfo}{_("signin"===t.type,e,"internal-error");const n=(null===(r=s.multiFactorHint)||void 0===r?void 0:r.uid)||s.multiFactorUid;_(n,e,"missing-multi-factor-info");const o=await On(e,{mfaPendingCredential:t.credential,mfaEnrollmentId:n,phoneSignInInfo:{recaptchaToken:i}});return o.phoneResponseInfo.sessionInfo}}{const{sessionInfo:t}=await lt(e,{phoneNumber:s.phoneNumber,recaptchaToken:i});return t}}finally{n._reset()}}
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
class Ln{constructor(e){this.providerId=Ln.PROVIDER_ID,this.auth=xe(e)}verifyPhoneNumber(e,t){return Pn(this.auth,e,(0,i.Ku)(t))}static credential(e,t){return gt._fromVerification(e,t)}static credentialFromResult(e){const t=e;return Ln.credentialFromTaggedObject(t)}static credentialFromError(e){return Ln.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:n}=e;return t&&n?gt._fromTokenResponse(t,n):null}}
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
function Mn(e,t){return t?le(t):(_(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}
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
 */Ln.PROVIDER_ID="phone",Ln.PHONE_SIGN_IN_METHOD="phone";class Un extends Ze{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return at(e,this._buildIdpRequest())}_linkToIdToken(e,t){return at(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return at(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Fn(e){return xt(e.auth,new Un(e),e.bypassAuthState)}function Vn(e){const{auth:t,user:n}=e;return _(n,t,"internal-error"),Dt(n,new Un(e),e.bypassAuthState)}async function jn(e){const{auth:t,user:n}=e;return _(n,t,"internal-error"),Nt(n,new Un(e),e.bypassAuthState)}
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
 */class Bn{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:s,type:o}=e;if(s)return void this.reject(s);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Fn;case"linkViaPopup":case"linkViaRedirect":return jn;case"reauthViaPopup":case"reauthViaRedirect":return Vn;default:p(this.auth,"internal-error")}}resolve(e){b(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){b(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
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
 */const $n=new A(2e3,1e4);class qn extends Bn{constructor(e,t,n,r,i){super(e,t,r,i),this.provider=n,this.authWindow=null,this.pollId=null,qn.currentPopupAction&&qn.currentPopupAction.cancel(),qn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return _(e,this.auth,"internal-error"),e}async onExecution(){b(1===this.filter.length,"Popup operations only handle one event");const e=an();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(g(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(g(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,qn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null===(n=null===(t=this.authWindow)||void 0===t?void 0:t.window)||void 0===n?void 0:n.closed)?this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(g(this.auth,"popup-closed-by-user"))},8e3):this.pollId=window.setTimeout(e,$n.get())};e()}}qn.currentPopupAction=null;
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
const Kn="pendingRedirect",Wn=new Map;class Gn extends Bn{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Wn.get(this.auth._key());if(!e){try{const t=await zn(this.resolver,this.auth),n=t?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}Wn.set(this.auth._key(),e)}return this.bypassAuthState||Wn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}async function zn(e,t){const n=Xn(t),r=Qn(e);if(!await r._isAvailable())return!1;const i="true"===await r._get(n);return await r._remove(n),i}function Hn(e,t){Wn.set(e._key(),t)}function Qn(e){return le(e._redirectPersistence)}function Xn(e){return de(Kn,e.config.apiKey,e.name)}
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
 */async function Yn(e,t,n=!1){if((0,r.xZ)(e.app))return Promise.reject(v(e));const i=xe(e),s=Mn(i,t),o=new Gn(i,s,n),a=await o.execute();return a&&!n&&(delete a.user._redirectEventId,await i._persistUserIfCurrent(a.user),await i._setRedirectUser(null,t)),a}
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
const Jn=6e5;class Zn{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!nr(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!tr(e)){const r=(null===(n=e.error.code)||void 0===n?void 0:n.split("auth/")[1])||"internal-error";t.onError(g(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Jn&&this.cachedEventUids.clear(),this.cachedEventUids.has(er(e))}saveEventToCache(e){this.cachedEventUids.add(er(e)),this.lastProcessedEventTime=Date.now()}}function er(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function tr({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null===t||void 0===t?void 0:t.code)}function nr(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return tr(e);default:return!1}}
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
 */async function rr(e,t={}){return x(e,"GET","/v1/projects",t)}
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
 */const ir=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,sr=/^https?/;async function or(e){if(e.config.emulator)return;const{authorizedDomains:t}=await rr(e);for(const r of t)try{if(ar(r))return}catch(n){}p(e,"unauthorized-domain")}function ar(e){const t=E(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return""===i.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&i.hostname===r}if(!sr.test(n))return!1;if(ir.test(e))return r===e;const i=e.replace(/\./g,"\\."),s=new RegExp("^(.+\\."+i+"|"+i+")$","i");return s.test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const ur=new A(3e4,6e4);function cr(){const e=cn().___jsl;if(null===e||void 0===e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function lr(e){return new Promise((t,n)=>{var r,i,s;function o(){cr(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{cr(),n(g(e,"network-request-failed"))},timeout:ur.get()})}if(null===(i=null===(r=cn().gapi)||void 0===r?void 0:r.iframes)||void 0===i?void 0:i.Iframe)t(gapi.iframes.getContext());else{if(!(null===(s=cn().gapi)||void 0===s?void 0:s.load)){const t=je("iframefcb");return cn()[t]=()=>{gapi.load?o():n(g(e,"network-request-failed"))},Ue(`${Ve()}?onload=${t}`).catch(e=>n(e))}o()}}).catch(e=>{throw hr=null,e})}let hr=null;function fr(e){return hr=hr||lr(e),hr}
/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const dr=new A(5e3,15e3),pr="__/auth/iframe",gr="emulator/auth/iframe",mr={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},vr=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function yr(e){const t=e.config;_(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?k(t,gr):`https://${e.config.authDomain}/${pr}`,s={apiKey:t.apiKey,appName:e.name,v:r.MF},o=vr.get(e.config.apiHost);o&&(s.eid=o);const a=e._getFrameworks();return a.length&&(s.fw=a.join(",")),`${n}?${(0,i.Am)(s).slice(1)}`}async function _r(e){const t=await fr(e),n=cn().gapi;return _(n,e,"internal-error"),t.open({where:document.body,url:yr(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:mr,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});const i=g(e,"network-request-failed"),s=cn().setTimeout(()=>{r(i)},dr.get());function o(){cn().clearTimeout(s),n(t)}t.ping(o).then(o,()=>{r(i)})}))}
/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const wr={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},br=500,Er=600,Tr="_blank",Ir="http://localhost";class Sr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function Cr(e,t,n,r=br,s=Er){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const c=Object.assign(Object.assign({},wr),{width:r.toString(),height:s.toString(),top:o,left:a}),l=(0,i.ZQ)().toLowerCase();n&&(u=ye(l)?Tr:n),me(l)&&(t=t||Ir,c.scrollbars="yes");const h=Object.entries(c).reduce((e,[t,n])=>`${e}${t}=${n},`,"");if(Ie(l)&&"_self"!==u)return Ar(t||"",u),new Sr(null);const f=window.open(t||"",u,h);_(f,e,"popup-blocked");try{f.focus()}catch(d){}return new Sr(f)}function Ar(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
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
 */const kr="__/auth/handler",Rr="emulator/auth/handler",Or=encodeURIComponent("fac");async function Nr(e,t,n,s,o,a){_(e.config.authDomain,e,"auth-domain-config-required"),_(e.config.apiKey,e,"invalid-api-key");const u={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:s,v:r.MF,eventId:o};if(t instanceof wt){t.setDefaultLanguage(e.languageCode),u.providerId=t.providerId||"",(0,i.Im)(t.getCustomParameters())||(u.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries(a||{}))u[e]=t}if(t instanceof bt){const e=t.getScopes().filter(e=>""!==e);e.length>0&&(u.scopes=e.join(","))}e.tenantId&&(u.tid=e.tenantId);const c=u;for(const r of Object.keys(c))void 0===c[r]&&delete c[r];const l=await e._getAppCheckToken(),h=l?`#${Or}=${encodeURIComponent(l)}`:"";return`${Dr(e)}?${(0,i.Am)(c).slice(1)}${h}`}function Dr({config:e}){return e.emulator?k(e,Rr):`https://${e.authDomain}/${kr}`}
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
 */const xr="webStorageSupport";class Pr{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=rn,this._completeRedirectFn=Yn,this._overrideRedirectResult=Hn}async _openPopup(e,t,n,r){var i;b(null===(i=this.eventManagers[e._key()])||void 0===i?void 0:i.manager,"_initialize() not called before _openPopup()");const s=await Nr(e,t,n,E(),r);return Cr(e,s,an())}async _openRedirect(e,t,n,r){await this._originValidation(e);const i=await Nr(e,t,n,E(),r);return ln(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(b(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await _r(e),n=new Zn(e);return t.register("authEvent",t=>{_(null===t||void 0===t?void 0:t.authEvent,e,"invalid-auth-event");const r=n.onEvent(t.authEvent);return{status:r?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){const n=this.iframes[e._key()];n.send(xr,{type:xr},n=>{var r;const i=null===(r=null===n||void 0===n?void 0:n[0])||void 0===r?void 0:r[xr];void 0!==i&&t(!!i),p(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=or(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Ce()||ve()||Te()}}const Lr=Pr;class Mr{constructor(e){this.factorId=e}_process(e,t,n){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,n);case"signin":return this._finalizeSignIn(e,t.credential);default:return w("unexpected MultiFactorSessionType")}}}class Ur extends Mr{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new Ur(e)}_finalizeEnroll(e,t,n){return zt(e,{idToken:t,displayName:n,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return Nn(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class Fr{constructor(){}static assertion(e){return Ur._fromCredential(e)}}Fr.FACTOR_ID="phone";class Vr{static assertionForEnrollment(e,t){return jr._fromSecret(e,t)}static assertionForSignIn(e,t){return jr._fromEnrollmentId(e,t)}static async generateSecret(e){var t;const n=e;_("undefined"!==typeof(null===(t=n.user)||void 0===t?void 0:t.auth),"internal-error");const r=await Ht(n.user.auth,{idToken:n.credential,totpEnrollmentInfo:{}});return Br._fromStartTotpMfaEnrollmentResponse(r,n.user.auth)}}Vr.FACTOR_ID="totp";class jr extends Mr{constructor(e,t,n){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=n}static _fromSecret(e,t){return new jr(t,void 0,e)}static _fromEnrollmentId(e,t){return new jr(t,e)}async _finalizeEnroll(e,t,n){return _("undefined"!==typeof this.secret,e,"argument-error"),Qt(e,{idToken:t,displayName:n,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){_(void 0!==this.enrollmentId&&void 0!==this.otp,e,"argument-error");const n={verificationCode:this.otp};return Dn(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:n})}}class Br{constructor(e,t,n,r,i,s,o){this.sessionInfo=s,this.auth=o,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=n,this.codeIntervalSeconds=r,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new Br(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var n;let r=!1;return($r(e)||$r(t))&&(r=!0),r&&($r(e)&&(e=(null===(n=this.auth.currentUser)||void 0===n?void 0:n.email)||"unknownuser"),$r(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function $r(e){return"undefined"===typeof e||0===(null===e||void 0===e?void 0:e.length)}var qr="@firebase/auth",Kr="1.7.9";
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
class Wr{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;const t=await this.auth.currentUser.getIdToken(e);return{accessToken:t}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(t=>{e((null===t||void 0===t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
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
 */function Gr(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function zr(e){(0,r.om)(new a.uA("auth",(t,{options:n})=>{const r=t.getProvider("app").getImmediate(),i=t.getProvider("heartbeat"),s=t.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;_(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:a,clientPlatform:e,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ae(e)},c=new De(r,i,s,u);return ze(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{const r=e.getProvider("auth-internal");r.initialize()})),(0,r.om)(new a.uA("auth-internal",e=>{const t=xe(e.getProvider("auth").getImmediate());return(e=>new Wr(e))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),(0,r.KO)(qr,Kr,Gr(e)),(0,r.KO)(qr,Kr,"esm2017")}
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
 */const Hr=300,Qr=(0,i.XA)("authIdTokenMaxAge")||Hr;let Xr=null;const Yr=e=>async t=>{const n=t&&await t.getIdTokenResult(),r=n&&((new Date).getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Qr)return;const i=null===n||void 0===n?void 0:n.token;Xr!==i&&(Xr=i,await fetch(e,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Jr(e=(0,r.Sx)()){const t=(0,r.j6)(e,"auth");if(t.isInitialized())return t.getImmediate();const n=Ge(e,{popupRedirectResolver:Lr,persistence:[Rn,tn,rn]}),s=(0,i.XA)("authTokenSyncURL");if(s&&"boolean"===typeof isSecureContext&&isSecureContext){const e=new URL(s,location.origin);if(location.origin===e.origin){const t=Yr(e.toString());qt(n,t,()=>t(n.currentUser)),$t(n,e=>t(e))}}const o=(0,i.Tj)("auth");return o&&He(n,`http://${o}`),n}function Zr(){var e,t;return null!==(t=null===(e=document.getElementsByTagName("head"))||void 0===e?void 0:e[0])&&void 0!==t?t:document}Me({loadJS(e){return new Promise((t,n)=>{const r=document.createElement("script");r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=g("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",Zr().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="}),zr("Browser")},499:function(e,t,n){"use strict";n.d(t,{aE:function(){return ht},LA:function(){return Re},lq:function(){return dt},rd:function(){return ft}});
/*!
 * vue-router v4.6.3
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
const r="undefined"!==typeof document;function i(e){return"object"===typeof e||"displayName"in e||"props"in e||"__vccOpts"in e}function s(e){return e.__esModule||"Module"===e[Symbol.toStringTag]||e.default&&i(e.default)}const o=Object.assign;function a(e,t){const n={};for(const r in t){const i=t[r];n[r]=c(i)?i.map(e):e(i)}return n}const u=()=>{},c=Array.isArray;function l(e,t){const n={};for(const r in e)n[r]=r in t?t[r]:e[r];return n}const h=/#/g,f=/&/g,d=/\//g,p=/=/g,g=/\?/g,m=/\+/g,v=/%5B/g,y=/%5D/g,_=/%5E/g,w=/%60/g,b=/%7B/g,E=/%7C/g,T=/%7D/g,I=/%20/g;function S(e){return null==e?"":encodeURI(""+e).replace(E,"|").replace(v,"[").replace(y,"]")}function C(e){return S(e).replace(b,"{").replace(T,"}").replace(_,"^")}function A(e){return S(e).replace(m,"%2B").replace(I,"+").replace(h,"%23").replace(f,"%26").replace(w,"`").replace(b,"{").replace(T,"}").replace(_,"^")}function k(e){return A(e).replace(p,"%3D")}function R(e){return S(e).replace(h,"%23").replace(g,"%3F")}function O(e){return R(e).replace(d,"%2F")}function N(e){if(null==e)return null;try{return decodeURIComponent(""+e)}catch(t){}return""+e}const D=/\/$/,x=e=>e.replace(D,"");function P(e,t,n="/"){let r,i={},s="",o="";const a=t.indexOf("#");let u=t.indexOf("?");return u=a>=0&&u>a?-1:u,u>=0&&(r=t.slice(0,u),s=t.slice(u,a>0?a:t.length),i=e(s.slice(1))),a>=0&&(r=r||t.slice(0,a),o=t.slice(a,t.length)),r=$(null!=r?r:t,n),{fullPath:r+s+o,path:r,query:i,hash:N(o)}}function L(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}function M(e,t){return t&&e.toLowerCase().startsWith(t.toLowerCase())?e.slice(t.length)||"/":e}function U(e,t,n){const r=t.matched.length-1,i=n.matched.length-1;return r>-1&&r===i&&F(t.matched[r],n.matched[i])&&V(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function F(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function V(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!j(e[n],t[n]))return!1;return!0}function j(e,t){return c(e)?B(e,t):c(t)?B(t,e):e===t}function B(e,t){return c(t)?e.length===t.length&&e.every((e,n)=>e===t[n]):1===e.length&&e[0]===t}function $(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),r=e.split("/"),i=r[r.length-1];".."!==i&&"."!==i||r.push("");let s,o,a=n.length-1;for(s=0;s<r.length;s++)if(o=r[s],"."!==o){if(".."!==o)break;a>1&&a--}return n.slice(0,a).join("/")+"/"+r.slice(s).join("/")}const q={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};let K=function(e){return e["pop"]="pop",e["push"]="push",e}({}),W=function(e){return e["back"]="back",e["forward"]="forward",e["unknown"]="",e}({});function G(e){if(!e)if(r){const t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return"/"!==e[0]&&"#"!==e[0]&&(e="/"+e),x(e)}const z=/^[^#]+#/;function H(e,t){return e.replace(z,"#")+t}function Q(e,t){const n=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return{behavior:t.behavior,left:r.left-n.left-(t.left||0),top:r.top-n.top-(t.top||0)}}const X=()=>({left:window.scrollX,top:window.scrollY});function Y(e){let t;if("el"in e){const n=e.el,r="string"===typeof n&&n.startsWith("#");0;const i="string"===typeof n?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!i)return;t=Q(i,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(null!=t.left?t.left:window.scrollX,null!=t.top?t.top:window.scrollY)}function J(e,t){return(history.state?history.state.position-t:-1)+e}const Z=new Map;function ee(e,t){Z.set(e,t)}function te(e){const t=Z.get(e);return Z.delete(e),t}function ne(e){return"string"===typeof e||e&&"object"===typeof e}function re(e){return"string"===typeof e||"symbol"===typeof e}let ie=function(e){return e[e["MATCHER_NOT_FOUND"]=1]="MATCHER_NOT_FOUND",e[e["NAVIGATION_GUARD_REDIRECT"]=2]="NAVIGATION_GUARD_REDIRECT",e[e["NAVIGATION_ABORTED"]=4]="NAVIGATION_ABORTED",e[e["NAVIGATION_CANCELLED"]=8]="NAVIGATION_CANCELLED",e[e["NAVIGATION_DUPLICATED"]=16]="NAVIGATION_DUPLICATED",e}({});const se=Symbol("");ie.MATCHER_NOT_FOUND,ie.NAVIGATION_GUARD_REDIRECT,ie.NAVIGATION_ABORTED,ie.NAVIGATION_CANCELLED,ie.NAVIGATION_DUPLICATED;function oe(e,t){return o(new Error,{type:e,[se]:!0},t)}function ae(e,t){return e instanceof Error&&se in e&&(null==t||!!(e.type&t))}const ue=["params","query","hash"];function ce(e){if("string"===typeof e)return e;if(null!=e.path)return e.path;const t={};for(const n of ue)n in e&&(t[n]=e[n]);return JSON.stringify(t,null,2)}function le(e){const t={};if(""===e||"?"===e)return t;const n=("?"===e[0]?e.slice(1):e).split("&");for(let r=0;r<n.length;++r){const e=n[r].replace(m," "),i=e.indexOf("="),s=N(i<0?e:e.slice(0,i)),o=i<0?null:N(e.slice(i+1));if(s in t){let e=t[s];c(e)||(e=t[s]=[e]),e.push(o)}else t[s]=o}return t}function he(e){let t="";for(let n in e){const r=e[n];n=k(n),null!=r?(c(r)?r.map(e=>e&&A(e)):[r&&A(r)]).forEach(e=>{void 0!==e&&(t+=(t.length?"&":"")+n,null!=e&&(t+="="+e))}):void 0!==r&&(t+=(t.length?"&":"")+n)}return t}function fe(e){const t={};for(const n in e){const r=e[n];void 0!==r&&(t[n]=c(r)?r.map(e=>null==e?null:""+e):null==r?r:""+r)}return t}const de=Symbol(""),pe=Symbol(""),ge=Symbol(""),me=Symbol(""),ve=Symbol("");function ye(){let e=[];function t(t){return e.push(t),()=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)}}function n(){e=[]}return{add:t,list:()=>e.slice(),reset:n}}function _e(e,t,n,r,i,s=e=>e()){const o=r&&(r.enterCallbacks[i]=r.enterCallbacks[i]||[]);return()=>new Promise((a,u)=>{const c=e=>{!1===e?u(oe(ie.NAVIGATION_ABORTED,{from:n,to:t})):e instanceof Error?u(e):ne(e)?u(oe(ie.NAVIGATION_GUARD_REDIRECT,{from:t,to:e})):(o&&r.enterCallbacks[i]===o&&"function"===typeof e&&o.push(e),a())},l=s(()=>e.call(r&&r.instances[i],t,n,c));let h=Promise.resolve(l);e.length<3&&(h=h.then(c)),h.catch(e=>u(e))})}function we(e,t,n,r,o=e=>e()){const a=[];for(const u of e){0;for(const e in u.components){let c=u.components[e];if("beforeRouteEnter"===t||u.instances[e])if(i(c)){const i=(c.__vccOpts||c)[t];i&&a.push(_e(i,n,r,u,e,o))}else{let i=c();0,a.push(()=>i.then(i=>{if(!i)throw new Error(`Couldn't resolve component "${e}" at "${u.path}"`);const a=s(i)?i.default:i;u.mods[e]=i,u.components[e]=a;const c=(a.__vccOpts||a)[t];return c&&_e(c,n,r,u,e,o)()}))}}}return a}function be(e,t){const n=[],r=[],i=[],s=Math.max(t.matched.length,e.matched.length);for(let o=0;o<s;o++){const s=t.matched[o];s&&(e.matched.find(e=>F(e,s))?r.push(s):n.push(s));const a=e.matched[o];a&&(t.matched.find(e=>F(e,a))||i.push(a))}return[n,r,i]}var Ee=n(641),Te=n(953);
/*!
 * vue-router v4.6.3
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let Ie=()=>location.protocol+"//"+location.host;function Se(e,t){const{pathname:n,search:r,hash:i}=t,s=e.indexOf("#");if(s>-1){let t=i.includes(e.slice(s))?e.slice(s).length:1,n=i.slice(t);return"/"!==n[0]&&(n="/"+n),M(n,"")}return M(n,e)+r+i}function Ce(e,t,n,r){let i=[],s=[],a=null;const u=({state:s})=>{const o=Se(e,location),u=n.value,c=t.value;let l=0;if(s){if(n.value=o,t.value=s,a&&a===u)return void(a=null);l=c?s.position-c.position:0}else r(o);i.forEach(e=>{e(n.value,u,{delta:l,type:K.pop,direction:l?l>0?W.forward:W.back:W.unknown})})};function c(){a=n.value}function l(e){i.push(e);const t=()=>{const t=i.indexOf(e);t>-1&&i.splice(t,1)};return s.push(t),t}function h(){if("hidden"===document.visibilityState){const{history:e}=window;if(!e.state)return;e.replaceState(o({},e.state,{scroll:X()}),"")}}function f(){for(const e of s)e();s=[],window.removeEventListener("popstate",u),window.removeEventListener("pagehide",h),document.removeEventListener("visibilitychange",h)}return window.addEventListener("popstate",u),window.addEventListener("pagehide",h),document.addEventListener("visibilitychange",h),{pauseListeners:c,listen:l,destroy:f}}function Ae(e,t,n,r=!1,i=!1){return{back:e,current:t,forward:n,replaced:r,position:window.history.length,scroll:i?X():null}}function ke(e){const{history:t,location:n}=window,r={value:Se(e,n)},i={value:t.state};function s(r,s,o){const a=e.indexOf("#"),u=a>-1?(n.host&&document.querySelector("base")?e:e.slice(a))+r:Ie()+e+r;try{t[o?"replaceState":"pushState"](s,"",u),i.value=s}catch(c){console.error(c),n[o?"replace":"assign"](u)}}function a(e,n){s(e,o({},t.state,Ae(i.value.back,e,i.value.forward,!0),n,{position:i.value.position}),!0),r.value=e}function u(e,n){const a=o({},i.value,t.state,{forward:e,scroll:X()});s(a.current,a,!0),s(e,o({},Ae(r.value,e,null),{position:a.position+1},n),!1),r.value=e}return i.value||s(r.value,{back:null,current:r.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0),{location:r,state:i,push:u,replace:a}}function Re(e){e=G(e);const t=ke(e),n=Ce(e,t.state,t.location,t.replace);function r(e,t=!0){t||n.pauseListeners(),history.go(e)}const i=o({location:"",base:e,go:r,createHref:H.bind(null,e)},t,n);return Object.defineProperty(i,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(i,"state",{enumerable:!0,get:()=>t.state.value}),i}let Oe=function(e){return e[e["Static"]=0]="Static",e[e["Param"]=1]="Param",e[e["Group"]=2]="Group",e}({});var Ne=function(e){return e[e["Static"]=0]="Static",e[e["Param"]=1]="Param",e[e["ParamRegExp"]=2]="ParamRegExp",e[e["ParamRegExpEnd"]=3]="ParamRegExpEnd",e[e["EscapeNext"]=4]="EscapeNext",e}(Ne||{});const De={type:Oe.Static,value:""},xe=/[a-zA-Z0-9_]/;function Pe(e){if(!e)return[[]];if("/"===e)return[[De]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(e){throw new Error(`ERR (${n})/"${c}": ${e}`)}let n=Ne.Static,r=n;const i=[];let s;function o(){s&&i.push(s),s=[]}let a,u=0,c="",l="";function h(){c&&(n===Ne.Static?s.push({type:Oe.Static,value:c}):n===Ne.Param||n===Ne.ParamRegExp||n===Ne.ParamRegExpEnd?(s.length>1&&("*"===a||"+"===a)&&t(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`),s.push({type:Oe.Param,value:c,regexp:l,repeatable:"*"===a||"+"===a,optional:"*"===a||"?"===a})):t("Invalid state to consume buffer"),c="")}function f(){c+=a}while(u<e.length)if(a=e[u++],"\\"!==a||n===Ne.ParamRegExp)switch(n){case Ne.Static:"/"===a?(c&&h(),o()):":"===a?(h(),n=Ne.Param):f();break;case Ne.EscapeNext:f(),n=r;break;case Ne.Param:"("===a?n=Ne.ParamRegExp:xe.test(a)?f():(h(),n=Ne.Static,"*"!==a&&"?"!==a&&"+"!==a&&u--);break;case Ne.ParamRegExp:")"===a?"\\"==l[l.length-1]?l=l.slice(0,-1)+a:n=Ne.ParamRegExpEnd:l+=a;break;case Ne.ParamRegExpEnd:h(),n=Ne.Static,"*"!==a&&"?"!==a&&"+"!==a&&u--,l="";break;default:t("Unknown state");break}else r=n,n=Ne.EscapeNext;return n===Ne.ParamRegExp&&t(`Unfinished custom RegExp for param "${c}"`),h(),o(),i}const Le="[^/]+?",Me={sensitive:!1,strict:!1,start:!0,end:!0};var Ue=function(e){return e[e["_multiplier"]=10]="_multiplier",e[e["Root"]=90]="Root",e[e["Segment"]=40]="Segment",e[e["SubSegment"]=30]="SubSegment",e[e["Static"]=40]="Static",e[e["Dynamic"]=20]="Dynamic",e[e["BonusCustomRegExp"]=10]="BonusCustomRegExp",e[e["BonusWildcard"]=-50]="BonusWildcard",e[e["BonusRepeatable"]=-20]="BonusRepeatable",e[e["BonusOptional"]=-8]="BonusOptional",e[e["BonusStrict"]=.7000000000000001]="BonusStrict",e[e["BonusCaseSensitive"]=.25]="BonusCaseSensitive",e}(Ue||{});const Fe=/[.+*?^${}()[\]/\\]/g;function Ve(e,t){const n=o({},Me,t),r=[];let i=n.start?"^":"";const s=[];for(const o of e){const e=o.length?[]:[Ue.Root];n.strict&&!o.length&&(i+="/");for(let t=0;t<o.length;t++){const r=o[t];let a=Ue.Segment+(n.sensitive?Ue.BonusCaseSensitive:0);if(r.type===Oe.Static)t||(i+="/"),i+=r.value.replace(Fe,"\\$&"),a+=Ue.Static;else if(r.type===Oe.Param){const{value:e,repeatable:n,optional:u,regexp:c}=r;s.push({name:e,repeatable:n,optional:u});const l=c||Le;l!==Le&&(a+=Ue.BonusCustomRegExp);let h=n?`((?:${l})(?:/(?:${l}))*)`:`(${l})`;t||(h=u&&o.length<2?`(?:/${h})`:"/"+h),u&&(h+="?"),i+=h,a+=Ue.Dynamic,u&&(a+=Ue.BonusOptional),n&&(a+=Ue.BonusRepeatable),".*"===l&&(a+=Ue.BonusWildcard)}e.push(a)}r.push(e)}if(n.strict&&n.end){const e=r.length-1;r[e][r[e].length-1]+=Ue.BonusStrict}n.strict||(i+="/?"),n.end?i+="$":n.strict&&!i.endsWith("/")&&(i+="(?:/|$)");const a=new RegExp(i,n.sensitive?"":"i");function u(e){const t=e.match(a),n={};if(!t)return null;for(let r=1;r<t.length;r++){const e=t[r]||"",i=s[r-1];n[i.name]=e&&i.repeatable?e.split("/"):e}return n}function l(t){let n="",r=!1;for(const i of e){r&&n.endsWith("/")||(n+="/"),r=!1;for(const e of i)if(e.type===Oe.Static)n+=e.value;else if(e.type===Oe.Param){const{value:s,repeatable:o,optional:a}=e,u=s in t?t[s]:"";if(c(u)&&!o)throw new Error(`Provided param "${s}" is an array but it is not repeatable (* or + modifiers)`);const l=c(u)?u.join("/"):u;if(!l){if(!a)throw new Error(`Missing required param "${s}"`);i.length<2&&(n.endsWith("/")?n=n.slice(0,-1):r=!0)}n+=l}}return n||"/"}return{re:a,score:r,keys:s,parse:u,stringify:l}}function je(e,t){let n=0;while(n<e.length&&n<t.length){const r=t[n]-e[n];if(r)return r;n++}return e.length<t.length?1===e.length&&e[0]===Ue.Static+Ue.Segment?-1:1:e.length>t.length?1===t.length&&t[0]===Ue.Static+Ue.Segment?1:-1:0}function Be(e,t){let n=0;const r=e.score,i=t.score;while(n<r.length&&n<i.length){const e=je(r[n],i[n]);if(e)return e;n++}if(1===Math.abs(i.length-r.length)){if($e(r))return 1;if($e(i))return-1}return i.length-r.length}function $e(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const qe={strict:!1,end:!0,sensitive:!1};function Ke(e,t,n){const r=Ve(Pe(e.path),n);const i=o(r,{record:e,parent:t,children:[],alias:[]});return t&&!i.record.aliasOf===!t.record.aliasOf&&t.children.push(i),i}function We(e,t){const n=[],r=new Map;function i(e){return r.get(e)}function s(e,n,r){const i=!r,c=ze(e);c.aliasOf=r&&r.record;const f=l(t,e),d=[c];if("alias"in e){const t="string"===typeof e.alias?[e.alias]:e.alias;for(const e of t)d.push(ze(o({},c,{components:r?r.record.components:c.components,path:e,aliasOf:r?r.record:c})))}let p,g;for(const t of d){const{path:o}=t;if(n&&"/"!==o[0]){const e=n.record.path,r="/"===e[e.length-1]?"":"/";t.path=n.record.path+(o&&r+o)}if(p=Ke(t,n,f),r?r.alias.push(p):(g=g||p,g!==p&&g.alias.push(p),i&&e.name&&!Qe(p)&&a(e.name)),Ze(p)&&h(p),c.children){const e=c.children;for(let t=0;t<e.length;t++)s(e[t],p,r&&r.children[t])}r=r||p}return g?()=>{a(g)}:u}function a(e){if(re(e)){const t=r.get(e);t&&(r.delete(e),n.splice(n.indexOf(t),1),t.children.forEach(a),t.alias.forEach(a))}else{const t=n.indexOf(e);t>-1&&(n.splice(t,1),e.record.name&&r.delete(e.record.name),e.children.forEach(a),e.alias.forEach(a))}}function c(){return n}function h(e){const t=Ye(e,n);n.splice(t,0,e),e.record.name&&!Qe(e)&&r.set(e.record.name,e)}function f(e,t){let i,s,a,u={};if("name"in e&&e.name){if(i=r.get(e.name),!i)throw oe(ie.MATCHER_NOT_FOUND,{location:e});0,a=i.record.name,u=o(Ge(t.params,i.keys.filter(e=>!e.optional).concat(i.parent?i.parent.keys.filter(e=>e.optional):[]).map(e=>e.name)),e.params&&Ge(e.params,i.keys.map(e=>e.name))),s=i.stringify(u)}else if(null!=e.path)s=e.path,i=n.find(e=>e.re.test(s)),i&&(u=i.parse(s),a=i.record.name);else{if(i=t.name?r.get(t.name):n.find(e=>e.re.test(t.path)),!i)throw oe(ie.MATCHER_NOT_FOUND,{location:e,currentLocation:t});a=i.record.name,u=o({},t.params,e.params),s=i.stringify(u)}const c=[];let l=i;while(l)c.unshift(l.record),l=l.parent;return{name:a,path:s,params:u,matched:c,meta:Xe(c)}}function d(){n.length=0,r.clear()}return t=l(qe,t),e.forEach(e=>s(e)),{addRoute:s,resolve:f,removeRoute:a,clearRoutes:d,getRoutes:c,getRecordMatcher:i}}function Ge(e,t){const n={};for(const r of t)r in e&&(n[r]=e[r]);return n}function ze(e){const t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:He(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,"mods",{value:{}}),t}function He(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const r in e.components)t[r]="object"===typeof n?n[r]:n;return t}function Qe(e){while(e){if(e.record.aliasOf)return!0;e=e.parent}return!1}function Xe(e){return e.reduce((e,t)=>o(e,t.meta),{})}function Ye(e,t){let n=0,r=t.length;while(n!==r){const i=n+r>>1;Be(e,t[i])<0?r=i:n=i+1}const i=Je(e);return i&&(r=t.lastIndexOf(i,r-1)),r}function Je(e){let t=e;while(t=t.parent)if(Ze(t)&&0===Be(e,t))return t}function Ze({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function et(e){const t=(0,Ee.WQ)(ge),n=(0,Ee.WQ)(me);const r=(0,Ee.EW)(()=>{const n=(0,Te.R1)(e.to);return t.resolve(n)}),i=(0,Ee.EW)(()=>{const{matched:e}=r.value,{length:t}=e,i=e[t-1],s=n.matched;if(!i||!s.length)return-1;const o=s.findIndex(F.bind(null,i));if(o>-1)return o;const a=ot(e[t-2]);return t>1&&ot(i)===a&&s[s.length-1].path!==a?s.findIndex(F.bind(null,e[t-2])):o}),s=(0,Ee.EW)(()=>i.value>-1&&st(n.params,r.value.params)),o=(0,Ee.EW)(()=>i.value>-1&&i.value===n.matched.length-1&&V(n.params,r.value.params));function a(n={}){if(it(n)){const n=t[(0,Te.R1)(e.replace)?"replace":"push"]((0,Te.R1)(e.to)).catch(u);return e.viewTransition&&"undefined"!==typeof document&&"startViewTransition"in document&&document.startViewTransition(()=>n),n}return Promise.resolve()}return{route:r,href:(0,Ee.EW)(()=>r.value.href),isActive:s,isExactActive:o,navigate:a}}function tt(e){return 1===e.length?e[0]:e}const nt=(0,Ee.pM)({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:et,setup(e,{slots:t}){const n=(0,Te.Kh)(et(e)),{options:r}=(0,Ee.WQ)(ge),i=(0,Ee.EW)(()=>({[at(e.activeClass,r.linkActiveClass,"router-link-active")]:n.isActive,[at(e.exactActiveClass,r.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const r=t.default&&tt(t.default(n));return e.custom?r:(0,Ee.h)("a",{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:i.value},r)}}}),rt=nt;function it(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&(void 0===e.button||0===e.button)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function st(e,t){for(const n in t){const r=t[n],i=e[n];if("string"===typeof r){if(r!==i)return!1}else if(!c(i)||i.length!==r.length||r.some((e,t)=>e!==i[t]))return!1}return!0}function ot(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const at=(e,t,n)=>null!=e?e:null!=t?t:n,ut=(0,Ee.pM)({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:n}){const r=(0,Ee.WQ)(ve),i=(0,Ee.EW)(()=>e.route||r.value),s=(0,Ee.WQ)(pe,0),a=(0,Ee.EW)(()=>{let e=(0,Te.R1)(s);const{matched:t}=i.value;let n;while((n=t[e])&&!n.components)e++;return e}),u=(0,Ee.EW)(()=>i.value.matched[a.value]);(0,Ee.Gt)(pe,(0,Ee.EW)(()=>a.value+1)),(0,Ee.Gt)(de,u),(0,Ee.Gt)(ve,i);const c=(0,Te.KR)();return(0,Ee.wB)(()=>[c.value,u.value,e.name],([e,t,n],[r,i,s])=>{t&&(t.instances[n]=e,i&&i!==t&&e&&e===r&&(t.leaveGuards.size||(t.leaveGuards=i.leaveGuards),t.updateGuards.size||(t.updateGuards=i.updateGuards))),!e||!t||i&&F(t,i)&&r||(t.enterCallbacks[n]||[]).forEach(t=>t(e))},{flush:"post"}),()=>{const r=i.value,s=e.name,a=u.value,l=a&&a.components[s];if(!l)return ct(n.default,{Component:l,route:r});const h=a.props[s],f=h?!0===h?r.params:"function"===typeof h?h(r):h:null,d=e=>{e.component.isUnmounted&&(a.instances[s]=null)},p=(0,Ee.h)(l,o({},f,t,{onVnodeUnmounted:d,ref:c}));return ct(n.default,{Component:p,route:r})||p}}});function ct(e,t){if(!e)return null;const n=e(t);return 1===n.length?n[0]:n}const lt=ut;function ht(e){const t=We(e.routes,e),n=e.parseQuery||le,i=e.stringifyQuery||he,s=e.history;const l=ye(),h=ye(),f=ye(),d=(0,Te.IJ)(q);let p=q;r&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const g=a.bind(null,e=>""+e),m=a.bind(null,O),v=a.bind(null,N);function y(e,n){let r,i;return re(e)?(r=t.getRecordMatcher(e),i=n):i=e,t.addRoute(i,r)}function _(e){const n=t.getRecordMatcher(e);n&&t.removeRoute(n)}function w(){return t.getRoutes().map(e=>e.record)}function b(e){return!!t.getRecordMatcher(e)}function E(e,r){if(r=o({},r||d.value),"string"===typeof e){const i=P(n,e,r.path),a=t.resolve({path:i.path},r),u=s.createHref(i.fullPath);return o(i,a,{params:v(a.params),hash:N(i.hash),redirectedFrom:void 0,href:u})}let a;if(null!=e.path)a=o({},e,{path:P(n,e.path,r.path).path});else{const t=o({},e.params);for(const e in t)null==t[e]&&delete t[e];a=o({},e,{params:m(t)}),r.params=m(r.params)}const u=t.resolve(a,r),c=e.hash||"";u.params=g(v(u.params));const l=L(i,o({},e,{hash:C(c),path:u.path})),h=s.createHref(l);return o({fullPath:l,hash:c,query:i===he?fe(e.query):e.query||{}},u,{redirectedFrom:void 0,href:h})}function T(e){return"string"===typeof e?P(n,e,d.value.path):o({},e)}function I(e,t){if(p!==e)return oe(ie.NAVIGATION_CANCELLED,{from:t,to:e})}function S(e){return R(e)}function A(e){return S(o(T(e),{replace:!0}))}function k(e,t){const n=e.matched[e.matched.length-1];if(n&&n.redirect){const{redirect:r}=n;let i="function"===typeof r?r(e,t):r;return"string"===typeof i&&(i=i.includes("?")||i.includes("#")?i=T(i):{path:i},i.params={}),o({query:e.query,hash:e.hash,params:null!=i.path?{}:e.params},i)}}function R(e,t){const n=p=E(e),r=d.value,s=e.state,a=e.force,u=!0===e.replace,c=k(n,r);if(c)return R(o(T(c),{state:"object"===typeof c?o({},s,c.state):s,force:a,replace:u}),t||n);const l=n;let h;return l.redirectedFrom=t,!a&&U(i,r,n)&&(h=oe(ie.NAVIGATION_DUPLICATED,{to:l,from:r}),Z(r,r,!0,!1)),(h?Promise.resolve(h):M(l,r)).catch(e=>ae(e)?ae(e,ie.NAVIGATION_GUARD_REDIRECT)?e:Q(e):z(e,l,r)).then(e=>{if(e){if(ae(e,ie.NAVIGATION_GUARD_REDIRECT))return R(o({replace:u},T(e.to),{state:"object"===typeof e.to?o({},s,e.to.state):s,force:a}),t||l)}else e=V(l,r,!0,u,s);return F(l,r,e),e})}function D(e,t){const n=I(e,t);return n?Promise.reject(n):Promise.resolve()}function x(e){const t=ue.values().next().value;return t&&"function"===typeof t.runWithContext?t.runWithContext(e):e()}function M(e,t){let n;const[r,i,s]=be(e,t);n=we(r.reverse(),"beforeRouteLeave",e,t);for(const a of r)a.leaveGuards.forEach(r=>{n.push(_e(r,e,t))});const o=D.bind(null,e,t);return n.push(o),de(n).then(()=>{n=[];for(const r of l.list())n.push(_e(r,e,t));return n.push(o),de(n)}).then(()=>{n=we(i,"beforeRouteUpdate",e,t);for(const r of i)r.updateGuards.forEach(r=>{n.push(_e(r,e,t))});return n.push(o),de(n)}).then(()=>{n=[];for(const r of s)if(r.beforeEnter)if(c(r.beforeEnter))for(const i of r.beforeEnter)n.push(_e(i,e,t));else n.push(_e(r.beforeEnter,e,t));return n.push(o),de(n)}).then(()=>(e.matched.forEach(e=>e.enterCallbacks={}),n=we(s,"beforeRouteEnter",e,t,x),n.push(o),de(n))).then(()=>{n=[];for(const r of h.list())n.push(_e(r,e,t));return n.push(o),de(n)}).catch(e=>ae(e,ie.NAVIGATION_CANCELLED)?e:Promise.reject(e))}function F(e,t,n){f.list().forEach(r=>x(()=>r(e,t,n)))}function V(e,t,n,i,a){const u=I(e,t);if(u)return u;const c=t===q,l=r?history.state:{};n&&(i||c?s.replace(e.fullPath,o({scroll:c&&l&&l.scroll},a)):s.push(e.fullPath,a)),d.value=e,Z(e,t,n,c),Q()}let j;function B(){j||(j=s.listen((e,t,n)=>{if(!ce.listening)return;const i=E(e),a=k(i,ce.currentRoute.value);if(a)return void R(o(a,{replace:!0,force:!0}),i).catch(u);p=i;const c=d.value;r&&ee(J(c.fullPath,n.delta),X()),M(i,c).catch(e=>ae(e,ie.NAVIGATION_ABORTED|ie.NAVIGATION_CANCELLED)?e:ae(e,ie.NAVIGATION_GUARD_REDIRECT)?(R(o(T(e.to),{force:!0}),i).then(e=>{ae(e,ie.NAVIGATION_ABORTED|ie.NAVIGATION_DUPLICATED)&&!n.delta&&n.type===K.pop&&s.go(-1,!1)}).catch(u),Promise.reject()):(n.delta&&s.go(-n.delta,!1),z(e,i,c))).then(e=>{e=e||V(i,c,!1),e&&(n.delta&&!ae(e,ie.NAVIGATION_CANCELLED)?s.go(-n.delta,!1):n.type===K.pop&&ae(e,ie.NAVIGATION_ABORTED|ie.NAVIGATION_DUPLICATED)&&s.go(-1,!1)),F(i,c,e)}).catch(u)}))}let $,W=ye(),G=ye();function z(e,t,n){Q(e);const r=G.list();return r.length?r.forEach(r=>r(e,t,n)):console.error(e),Promise.reject(e)}function H(){return $&&d.value!==q?Promise.resolve():new Promise((e,t)=>{W.add([e,t])})}function Q(e){return $||($=!e,B(),W.list().forEach(([t,n])=>e?n(e):t()),W.reset()),e}function Z(t,n,i,s){const{scrollBehavior:o}=e;if(!r||!o)return Promise.resolve();const a=!i&&te(J(t.fullPath,0))||(s||!i)&&history.state&&history.state.scroll||null;return(0,Ee.dY)().then(()=>o(t,n,a)).then(e=>e&&Y(e)).catch(e=>z(e,t,n))}const ne=e=>s.go(e);let se;const ue=new Set,ce={currentRoute:d,listening:!0,addRoute:y,removeRoute:_,clearRoutes:t.clearRoutes,hasRoute:b,getRoutes:w,resolve:E,options:e,push:S,replace:A,go:ne,back:()=>ne(-1),forward:()=>ne(1),beforeEach:l.add,beforeResolve:h.add,afterEach:f.add,onError:G.add,isReady:H,install(e){e.component("RouterLink",rt),e.component("RouterView",lt),e.config.globalProperties.$router=ce,Object.defineProperty(e.config.globalProperties,"$route",{enumerable:!0,get:()=>(0,Te.R1)(d)}),r&&!se&&d.value===q&&(se=!0,S(s.location).catch(e=>{0}));const t={};for(const r in q)Object.defineProperty(t,r,{get:()=>d.value[r],enumerable:!0});e.provide(ge,ce),e.provide(me,(0,Te.Gc)(t)),e.provide(ve,d);const n=e.unmount;ue.add(e),e.unmount=function(){ue.delete(e),ue.size<1&&(p=q,j&&j(),j=null,d.value=q,se=!1,$=!1),n()}}};function de(e){return e.reduce((e,t)=>e.then(()=>x(t)),Promise.resolve())}return ce}function ft(){return(0,Ee.WQ)(ge)}function dt(e){return(0,Ee.WQ)(me)}},543:function(e,t,n){var r;
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */e=n.nmd(e),function(){var i,s="4.17.21",o=200,a="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",u="Expected a function",c="Invalid `variable` option passed into `_.template`",l="__lodash_hash_undefined__",h=500,f="__lodash_placeholder__",d=1,p=2,g=4,m=1,v=2,y=1,_=2,w=4,b=8,E=16,T=32,I=64,S=128,C=256,A=512,k=30,R="...",O=800,N=16,D=1,x=2,P=3,L=1/0,M=9007199254740991,U=17976931348623157e292,F=NaN,V=4294967295,j=V-1,B=V>>>1,$=[["ary",S],["bind",y],["bindKey",_],["curry",b],["curryRight",E],["flip",A],["partial",T],["partialRight",I],["rearg",C]],q="[object Arguments]",K="[object Array]",W="[object AsyncFunction]",G="[object Boolean]",z="[object Date]",H="[object DOMException]",Q="[object Error]",X="[object Function]",Y="[object GeneratorFunction]",J="[object Map]",Z="[object Number]",ee="[object Null]",te="[object Object]",ne="[object Promise]",re="[object Proxy]",ie="[object RegExp]",se="[object Set]",oe="[object String]",ae="[object Symbol]",ue="[object Undefined]",ce="[object WeakMap]",le="[object WeakSet]",he="[object ArrayBuffer]",fe="[object DataView]",de="[object Float32Array]",pe="[object Float64Array]",ge="[object Int8Array]",me="[object Int16Array]",ve="[object Int32Array]",ye="[object Uint8Array]",_e="[object Uint8ClampedArray]",we="[object Uint16Array]",be="[object Uint32Array]",Ee=/\b__p \+= '';/g,Te=/\b(__p \+=) '' \+/g,Ie=/(__e\(.*?\)|\b__t\)) \+\n'';/g,Se=/&(?:amp|lt|gt|quot|#39);/g,Ce=/[&<>"']/g,Ae=RegExp(Se.source),ke=RegExp(Ce.source),Re=/<%-([\s\S]+?)%>/g,Oe=/<%([\s\S]+?)%>/g,Ne=/<%=([\s\S]+?)%>/g,De=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,xe=/^\w*$/,Pe=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Le=/[\\^$.*+?()[\]{}|]/g,Me=RegExp(Le.source),Ue=/^\s+/,Fe=/\s/,Ve=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,je=/\{\n\/\* \[wrapped with (.+)\] \*/,Be=/,? & /,$e=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,qe=/[()=,{}\[\]\/\s]/,Ke=/\\(\\)?/g,We=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Ge=/\w*$/,ze=/^[-+]0x[0-9a-f]+$/i,He=/^0b[01]+$/i,Qe=/^\[object .+?Constructor\]$/,Xe=/^0o[0-7]+$/i,Ye=/^(?:0|[1-9]\d*)$/,Je=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Ze=/($^)/,et=/['\n\r\u2028\u2029\\]/g,tt="\\ud800-\\udfff",nt="\\u0300-\\u036f",rt="\\ufe20-\\ufe2f",it="\\u20d0-\\u20ff",st=nt+rt+it,ot="\\u2700-\\u27bf",at="a-z\\xdf-\\xf6\\xf8-\\xff",ut="\\xac\\xb1\\xd7\\xf7",ct="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",lt="\\u2000-\\u206f",ht=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",ft="A-Z\\xc0-\\xd6\\xd8-\\xde",dt="\\ufe0e\\ufe0f",pt=ut+ct+lt+ht,gt="['’]",mt="["+tt+"]",vt="["+pt+"]",yt="["+st+"]",_t="\\d+",wt="["+ot+"]",bt="["+at+"]",Et="[^"+tt+pt+_t+ot+at+ft+"]",Tt="\\ud83c[\\udffb-\\udfff]",It="(?:"+yt+"|"+Tt+")",St="[^"+tt+"]",Ct="(?:\\ud83c[\\udde6-\\uddff]){2}",At="[\\ud800-\\udbff][\\udc00-\\udfff]",kt="["+ft+"]",Rt="\\u200d",Ot="(?:"+bt+"|"+Et+")",Nt="(?:"+kt+"|"+Et+")",Dt="(?:"+gt+"(?:d|ll|m|re|s|t|ve))?",xt="(?:"+gt+"(?:D|LL|M|RE|S|T|VE))?",Pt=It+"?",Lt="["+dt+"]?",Mt="(?:"+Rt+"(?:"+[St,Ct,At].join("|")+")"+Lt+Pt+")*",Ut="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",Ft="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",Vt=Lt+Pt+Mt,jt="(?:"+[wt,Ct,At].join("|")+")"+Vt,Bt="(?:"+[St+yt+"?",yt,Ct,At,mt].join("|")+")",$t=RegExp(gt,"g"),qt=RegExp(yt,"g"),Kt=RegExp(Tt+"(?="+Tt+")|"+Bt+Vt,"g"),Wt=RegExp([kt+"?"+bt+"+"+Dt+"(?="+[vt,kt,"$"].join("|")+")",Nt+"+"+xt+"(?="+[vt,kt+Ot,"$"].join("|")+")",kt+"?"+Ot+"+"+Dt,kt+"+"+xt,Ft,Ut,_t,jt].join("|"),"g"),Gt=RegExp("["+Rt+tt+st+dt+"]"),zt=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Ht=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Qt=-1,Xt={};Xt[de]=Xt[pe]=Xt[ge]=Xt[me]=Xt[ve]=Xt[ye]=Xt[_e]=Xt[we]=Xt[be]=!0,Xt[q]=Xt[K]=Xt[he]=Xt[G]=Xt[fe]=Xt[z]=Xt[Q]=Xt[X]=Xt[J]=Xt[Z]=Xt[te]=Xt[ie]=Xt[se]=Xt[oe]=Xt[ce]=!1;var Yt={};Yt[q]=Yt[K]=Yt[he]=Yt[fe]=Yt[G]=Yt[z]=Yt[de]=Yt[pe]=Yt[ge]=Yt[me]=Yt[ve]=Yt[J]=Yt[Z]=Yt[te]=Yt[ie]=Yt[se]=Yt[oe]=Yt[ae]=Yt[ye]=Yt[_e]=Yt[we]=Yt[be]=!0,Yt[Q]=Yt[X]=Yt[ce]=!1;var Jt={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"},Zt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},en={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},tn={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},nn=parseFloat,rn=parseInt,sn="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g,on="object"==typeof self&&self&&self.Object===Object&&self,an=sn||on||Function("return this")(),un=t&&!t.nodeType&&t,cn=un&&e&&!e.nodeType&&e,ln=cn&&cn.exports===un,hn=ln&&sn.process,fn=function(){try{var e=cn&&cn.require&&cn.require("util").types;return e||hn&&hn.binding&&hn.binding("util")}catch(t){}}(),dn=fn&&fn.isArrayBuffer,pn=fn&&fn.isDate,gn=fn&&fn.isMap,mn=fn&&fn.isRegExp,vn=fn&&fn.isSet,yn=fn&&fn.isTypedArray;function _n(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function wn(e,t,n,r){var i=-1,s=null==e?0:e.length;while(++i<s){var o=e[i];t(r,o,n(o),e)}return r}function bn(e,t){var n=-1,r=null==e?0:e.length;while(++n<r)if(!1===t(e[n],n,e))break;return e}function En(e,t){var n=null==e?0:e.length;while(n--)if(!1===t(e[n],n,e))break;return e}function Tn(e,t){var n=-1,r=null==e?0:e.length;while(++n<r)if(!t(e[n],n,e))return!1;return!0}function In(e,t){var n=-1,r=null==e?0:e.length,i=0,s=[];while(++n<r){var o=e[n];t(o,n,e)&&(s[i++]=o)}return s}function Sn(e,t){var n=null==e?0:e.length;return!!n&&Un(e,t,0)>-1}function Cn(e,t,n){var r=-1,i=null==e?0:e.length;while(++r<i)if(n(t,e[r]))return!0;return!1}function An(e,t){var n=-1,r=null==e?0:e.length,i=Array(r);while(++n<r)i[n]=t(e[n],n,e);return i}function kn(e,t){var n=-1,r=t.length,i=e.length;while(++n<r)e[i+n]=t[n];return e}function Rn(e,t,n,r){var i=-1,s=null==e?0:e.length;r&&s&&(n=e[++i]);while(++i<s)n=t(n,e[i],i,e);return n}function On(e,t,n,r){var i=null==e?0:e.length;r&&i&&(n=e[--i]);while(i--)n=t(n,e[i],i,e);return n}function Nn(e,t){var n=-1,r=null==e?0:e.length;while(++n<r)if(t(e[n],n,e))return!0;return!1}var Dn=Bn("length");function xn(e){return e.split("")}function Pn(e){return e.match($e)||[]}function Ln(e,t,n){var r;return n(e,function(e,n,i){if(t(e,n,i))return r=n,!1}),r}function Mn(e,t,n,r){var i=e.length,s=n+(r?1:-1);while(r?s--:++s<i)if(t(e[s],s,e))return s;return-1}function Un(e,t,n){return t===t?dr(e,t,n):Mn(e,Vn,n)}function Fn(e,t,n,r){var i=n-1,s=e.length;while(++i<s)if(r(e[i],t))return i;return-1}function Vn(e){return e!==e}function jn(e,t){var n=null==e?0:e.length;return n?Wn(e,t)/n:F}function Bn(e){return function(t){return null==t?i:t[e]}}function $n(e){return function(t){return null==e?i:e[t]}}function qn(e,t,n,r,i){return i(e,function(e,i,s){n=r?(r=!1,e):t(n,e,i,s)}),n}function Kn(e,t){var n=e.length;e.sort(t);while(n--)e[n]=e[n].value;return e}function Wn(e,t){var n,r=-1,s=e.length;while(++r<s){var o=t(e[r]);o!==i&&(n=n===i?o:n+o)}return n}function Gn(e,t){var n=-1,r=Array(e);while(++n<e)r[n]=t(n);return r}function zn(e,t){return An(t,function(t){return[t,e[t]]})}function Hn(e){return e?e.slice(0,vr(e)+1).replace(Ue,""):e}function Qn(e){return function(t){return e(t)}}function Xn(e,t){return An(t,function(t){return e[t]})}function Yn(e,t){return e.has(t)}function Jn(e,t){var n=-1,r=e.length;while(++n<r&&Un(t,e[n],0)>-1);return n}function Zn(e,t){var n=e.length;while(n--&&Un(t,e[n],0)>-1);return n}function er(e,t){var n=e.length,r=0;while(n--)e[n]===t&&++r;return r}var tr=$n(Jt),nr=$n(Zt);function rr(e){return"\\"+tn[e]}function ir(e,t){return null==e?i:e[t]}function sr(e){return Gt.test(e)}function or(e){return zt.test(e)}function ar(e){var t,n=[];while(!(t=e.next()).done)n.push(t.value);return n}function ur(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function cr(e,t){return function(n){return e(t(n))}}function lr(e,t){var n=-1,r=e.length,i=0,s=[];while(++n<r){var o=e[n];o!==t&&o!==f||(e[n]=f,s[i++]=n)}return s}function hr(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function fr(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=[e,e]}),n}function dr(e,t,n){var r=n-1,i=e.length;while(++r<i)if(e[r]===t)return r;return-1}function pr(e,t,n){var r=n+1;while(r--)if(e[r]===t)return r;return r}function gr(e){return sr(e)?_r(e):Dn(e)}function mr(e){return sr(e)?wr(e):xn(e)}function vr(e){var t=e.length;while(t--&&Fe.test(e.charAt(t)));return t}var yr=$n(en);function _r(e){var t=Kt.lastIndex=0;while(Kt.test(e))++t;return t}function wr(e){return e.match(Kt)||[]}function br(e){return e.match(Wt)||[]}var Er=function e(t){t=null==t?an:Tr.defaults(an.Object(),t,Tr.pick(an,Ht));var n=t.Array,r=t.Date,Fe=t.Error,$e=t.Function,tt=t.Math,nt=t.Object,rt=t.RegExp,it=t.String,st=t.TypeError,ot=n.prototype,at=$e.prototype,ut=nt.prototype,ct=t["__core-js_shared__"],lt=at.toString,ht=ut.hasOwnProperty,ft=0,dt=function(){var e=/[^.]+$/.exec(ct&&ct.keys&&ct.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),pt=ut.toString,gt=lt.call(nt),mt=an._,vt=rt("^"+lt.call(ht).replace(Le,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),yt=ln?t.Buffer:i,_t=t.Symbol,wt=t.Uint8Array,bt=yt?yt.allocUnsafe:i,Et=cr(nt.getPrototypeOf,nt),Tt=nt.create,It=ut.propertyIsEnumerable,St=ot.splice,Ct=_t?_t.isConcatSpreadable:i,At=_t?_t.iterator:i,kt=_t?_t.toStringTag:i,Rt=function(){try{var e=zo(nt,"defineProperty");return e({},"",{}),e}catch(t){}}(),Ot=t.clearTimeout!==an.clearTimeout&&t.clearTimeout,Nt=r&&r.now!==an.Date.now&&r.now,Dt=t.setTimeout!==an.setTimeout&&t.setTimeout,xt=tt.ceil,Pt=tt.floor,Lt=nt.getOwnPropertySymbols,Mt=yt?yt.isBuffer:i,Ut=t.isFinite,Ft=ot.join,Vt=cr(nt.keys,nt),jt=tt.max,Bt=tt.min,Kt=r.now,Wt=t.parseInt,Gt=tt.random,zt=ot.reverse,Jt=zo(t,"DataView"),Zt=zo(t,"Map"),en=zo(t,"Promise"),tn=zo(t,"Set"),sn=zo(t,"WeakMap"),on=zo(nt,"create"),un=sn&&new sn,cn={},hn=Da(Jt),fn=Da(Zt),Dn=Da(en),xn=Da(tn),$n=Da(sn),dr=_t?_t.prototype:i,_r=dr?dr.valueOf:i,wr=dr?dr.toString:i;function Er(e){if(Sl(e)&&!ul(e)&&!(e instanceof Ar)){if(e instanceof Cr)return e;if(ht.call(e,"__wrapped__"))return Pa(e)}return new Cr(e)}var Ir=function(){function e(){}return function(t){if(!Il(t))return{};if(Tt)return Tt(t);e.prototype=t;var n=new e;return e.prototype=i,n}}();function Sr(){}function Cr(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=i}function Ar(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=V,this.__views__=[]}function kr(){var e=new Ar(this.__wrapped__);return e.__actions__=ro(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=ro(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=ro(this.__views__),e}function Rr(){if(this.__filtered__){var e=new Ar(this);e.__dir__=-1,e.__filtered__=!0}else e=this.clone(),e.__dir__*=-1;return e}function Or(){var e=this.__wrapped__.value(),t=this.__dir__,n=ul(e),r=t<0,i=n?e.length:0,s=Jo(0,i,this.__views__),o=s.start,a=s.end,u=a-o,c=r?a:o-1,l=this.__iteratees__,h=l.length,f=0,d=Bt(u,this.__takeCount__);if(!n||!r&&i==u&&d==u)return Fs(e,this.__actions__);var p=[];e:while(u--&&f<d){c+=t;var g=-1,m=e[c];while(++g<h){var v=l[g],y=v.iteratee,_=v.type,w=y(m);if(_==x)m=w;else if(!w){if(_==D)continue e;break e}}p[f++]=m}return p}function Nr(e){var t=-1,n=null==e?0:e.length;this.clear();while(++t<n){var r=e[t];this.set(r[0],r[1])}}function Dr(){this.__data__=on?on(null):{},this.size=0}function xr(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}function Pr(e){var t=this.__data__;if(on){var n=t[e];return n===l?i:n}return ht.call(t,e)?t[e]:i}function Lr(e){var t=this.__data__;return on?t[e]!==i:ht.call(t,e)}function Mr(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=on&&t===i?l:t,this}function Ur(e){var t=-1,n=null==e?0:e.length;this.clear();while(++t<n){var r=e[t];this.set(r[0],r[1])}}function Fr(){this.__data__=[],this.size=0}function Vr(e){var t=this.__data__,n=li(t,e);if(n<0)return!1;var r=t.length-1;return n==r?t.pop():St.call(t,n,1),--this.size,!0}function jr(e){var t=this.__data__,n=li(t,e);return n<0?i:t[n][1]}function Br(e){return li(this.__data__,e)>-1}function $r(e,t){var n=this.__data__,r=li(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}function qr(e){var t=-1,n=null==e?0:e.length;this.clear();while(++t<n){var r=e[t];this.set(r[0],r[1])}}function Kr(){this.size=0,this.__data__={hash:new Nr,map:new(Zt||Ur),string:new Nr}}function Wr(e){var t=Wo(this,e)["delete"](e);return this.size-=t?1:0,t}function Gr(e){return Wo(this,e).get(e)}function zr(e){return Wo(this,e).has(e)}function Hr(e,t){var n=Wo(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this}function Qr(e){var t=-1,n=null==e?0:e.length;this.__data__=new qr;while(++t<n)this.add(e[t])}function Xr(e){return this.__data__.set(e,l),this}function Yr(e){return this.__data__.has(e)}function Jr(e){var t=this.__data__=new Ur(e);this.size=t.size}function Zr(){this.__data__=new Ur,this.size=0}function ei(e){var t=this.__data__,n=t["delete"](e);return this.size=t.size,n}function ti(e){return this.__data__.get(e)}function ni(e){return this.__data__.has(e)}function ri(e,t){var n=this.__data__;if(n instanceof Ur){var r=n.__data__;if(!Zt||r.length<o-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new qr(r)}return n.set(e,t),this.size=n.size,this}function ii(e,t){var n=ul(e),r=!n&&al(e),i=!n&&!r&&dl(e),s=!n&&!r&&!i&&jl(e),o=n||r||i||s,a=o?Gn(e.length,it):[],u=a.length;for(var c in e)!t&&!ht.call(e,c)||o&&("length"==c||i&&("offset"==c||"parent"==c)||s&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||oa(c,u))||a.push(c);return a}function si(e){var t=e.length;return t?e[vs(0,t-1)]:i}function oi(e,t){return Ra(ro(e),mi(t,0,e.length))}function ai(e){return Ra(ro(e))}function ui(e,t,n){(n!==i&&!il(e[t],n)||n===i&&!(t in e))&&pi(e,t,n)}function ci(e,t,n){var r=e[t];ht.call(e,t)&&il(r,n)&&(n!==i||t in e)||pi(e,t,n)}function li(e,t){var n=e.length;while(n--)if(il(e[n][0],t))return n;return-1}function hi(e,t,n,r){return Ei(e,function(e,i,s){t(r,e,n(e),s)}),r}function fi(e,t){return e&&io(t,Eh(t),e)}function di(e,t){return e&&io(t,Th(t),e)}function pi(e,t,n){"__proto__"==t&&Rt?Rt(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}function gi(e,t){var r=-1,s=t.length,o=n(s),a=null==e;while(++r<s)o[r]=a?i:mh(e,t[r]);return o}function mi(e,t,n){return e===e&&(n!==i&&(e=e<=n?e:n),t!==i&&(e=e>=t?e:t)),e}function vi(e,t,n,r,s,o){var a,u=t&d,c=t&p,l=t&g;if(n&&(a=s?n(e,r,s,o):n(e)),a!==i)return a;if(!Il(e))return e;var h=ul(e);if(h){if(a=ta(e),!u)return ro(e,a)}else{var f=Yo(e),m=f==X||f==Y;if(dl(e))return zs(e,u);if(f==te||f==q||m&&!s){if(a=c||m?{}:na(e),!u)return c?oo(e,di(a,e)):so(e,fi(a,e))}else{if(!Yt[f])return s?e:{};a=ra(e,f,u)}}o||(o=new Jr);var v=o.get(e);if(v)return v;o.set(e,a),Ul(e)?e.forEach(function(r){a.add(vi(r,t,n,r,e,o))}):Cl(e)&&e.forEach(function(r,i){a.set(i,vi(r,t,n,i,e,o))});var y=l?c?jo:Vo:c?Th:Eh,_=h?i:y(e);return bn(_||e,function(r,i){_&&(i=r,r=e[i]),ci(a,i,vi(r,t,n,i,e,o))}),a}function yi(e){var t=Eh(e);return function(n){return _i(n,e,t)}}function _i(e,t,n){var r=n.length;if(null==e)return!r;e=nt(e);while(r--){var s=n[r],o=t[s],a=e[s];if(a===i&&!(s in e)||!o(a))return!1}return!0}function wi(e,t,n){if("function"!=typeof e)throw new st(u);return Sa(function(){e.apply(i,n)},t)}function bi(e,t,n,r){var i=-1,s=Sn,a=!0,u=e.length,c=[],l=t.length;if(!u)return c;n&&(t=An(t,Qn(n))),r?(s=Cn,a=!1):t.length>=o&&(s=Yn,a=!1,t=new Qr(t));e:while(++i<u){var h=e[i],f=null==n?h:n(h);if(h=r||0!==h?h:0,a&&f===f){var d=l;while(d--)if(t[d]===f)continue e;c.push(h)}else s(t,f,r)||c.push(h)}return c}Er.templateSettings={escape:Re,evaluate:Oe,interpolate:Ne,variable:"",imports:{_:Er}},Er.prototype=Sr.prototype,Er.prototype.constructor=Er,Cr.prototype=Ir(Sr.prototype),Cr.prototype.constructor=Cr,Ar.prototype=Ir(Sr.prototype),Ar.prototype.constructor=Ar,Nr.prototype.clear=Dr,Nr.prototype["delete"]=xr,Nr.prototype.get=Pr,Nr.prototype.has=Lr,Nr.prototype.set=Mr,Ur.prototype.clear=Fr,Ur.prototype["delete"]=Vr,Ur.prototype.get=jr,Ur.prototype.has=Br,Ur.prototype.set=$r,qr.prototype.clear=Kr,qr.prototype["delete"]=Wr,qr.prototype.get=Gr,qr.prototype.has=zr,qr.prototype.set=Hr,Qr.prototype.add=Qr.prototype.push=Xr,Qr.prototype.has=Yr,Jr.prototype.clear=Zr,Jr.prototype["delete"]=ei,Jr.prototype.get=ti,Jr.prototype.has=ni,Jr.prototype.set=ri;var Ei=co(Ni),Ti=co(Di,!0);function Ii(e,t){var n=!0;return Ei(e,function(e,r,i){return n=!!t(e,r,i),n}),n}function Si(e,t,n){var r=-1,s=e.length;while(++r<s){var o=e[r],a=t(o);if(null!=a&&(u===i?a===a&&!Vl(a):n(a,u)))var u=a,c=o}return c}function Ci(e,t,n,r){var s=e.length;n=Hl(n),n<0&&(n=-n>s?0:s+n),r=r===i||r>s?s:Hl(r),r<0&&(r+=s),r=n>r?0:Ql(r);while(n<r)e[n++]=t;return e}function Ai(e,t){var n=[];return Ei(e,function(e,r,i){t(e,r,i)&&n.push(e)}),n}function ki(e,t,n,r,i){var s=-1,o=e.length;n||(n=sa),i||(i=[]);while(++s<o){var a=e[s];t>0&&n(a)?t>1?ki(a,t-1,n,r,i):kn(i,a):r||(i[i.length]=a)}return i}var Ri=lo(),Oi=lo(!0);function Ni(e,t){return e&&Ri(e,t,Eh)}function Di(e,t){return e&&Oi(e,t,Eh)}function xi(e,t){return In(t,function(t){return bl(e[t])})}function Pi(e,t){t=qs(t,e);var n=0,r=t.length;while(null!=e&&n<r)e=e[Na(t[n++])];return n&&n==r?e:i}function Li(e,t,n){var r=t(e);return ul(e)?r:kn(r,n(e))}function Mi(e){return null==e?e===i?ue:ee:kt&&kt in nt(e)?Ho(e):_a(e)}function Ui(e,t){return e>t}function Fi(e,t){return null!=e&&ht.call(e,t)}function Vi(e,t){return null!=e&&t in nt(e)}function ji(e,t,n){return e>=Bt(t,n)&&e<jt(t,n)}function Bi(e,t,r){var s=r?Cn:Sn,o=e[0].length,a=e.length,u=a,c=n(a),l=1/0,h=[];while(u--){var f=e[u];u&&t&&(f=An(f,Qn(t))),l=Bt(f.length,l),c[u]=!r&&(t||o>=120&&f.length>=120)?new Qr(u&&f):i}f=e[0];var d=-1,p=c[0];e:while(++d<o&&h.length<l){var g=f[d],m=t?t(g):g;if(g=r||0!==g?g:0,!(p?Yn(p,m):s(h,m,r))){u=a;while(--u){var v=c[u];if(!(v?Yn(v,m):s(e[u],m,r)))continue e}p&&p.push(m),h.push(g)}}return h}function $i(e,t,n,r){return Ni(e,function(e,i,s){t(r,n(e),i,s)}),r}function qi(e,t,n){t=qs(t,e),e=ba(e,t);var r=null==e?e:e[Na(su(t))];return null==r?i:_n(r,e,n)}function Ki(e){return Sl(e)&&Mi(e)==q}function Wi(e){return Sl(e)&&Mi(e)==he}function Gi(e){return Sl(e)&&Mi(e)==z}function zi(e,t,n,r,i){return e===t||(null==e||null==t||!Sl(e)&&!Sl(t)?e!==e&&t!==t:Hi(e,t,n,r,zi,i))}function Hi(e,t,n,r,i,s){var o=ul(e),a=ul(t),u=o?K:Yo(e),c=a?K:Yo(t);u=u==q?te:u,c=c==q?te:c;var l=u==te,h=c==te,f=u==c;if(f&&dl(e)){if(!dl(t))return!1;o=!0,l=!1}if(f&&!l)return s||(s=new Jr),o||jl(e)?Lo(e,t,n,r,i,s):Mo(e,t,u,n,r,i,s);if(!(n&m)){var d=l&&ht.call(e,"__wrapped__"),p=h&&ht.call(t,"__wrapped__");if(d||p){var g=d?e.value():e,v=p?t.value():t;return s||(s=new Jr),i(g,v,n,r,s)}}return!!f&&(s||(s=new Jr),Uo(e,t,n,r,i,s))}function Qi(e){return Sl(e)&&Yo(e)==J}function Xi(e,t,n,r){var s=n.length,o=s,a=!r;if(null==e)return!o;e=nt(e);while(s--){var u=n[s];if(a&&u[2]?u[1]!==e[u[0]]:!(u[0]in e))return!1}while(++s<o){u=n[s];var c=u[0],l=e[c],h=u[1];if(a&&u[2]){if(l===i&&!(c in e))return!1}else{var f=new Jr;if(r)var d=r(l,h,c,e,t,f);if(!(d===i?zi(h,l,m|v,r,f):d))return!1}}return!0}function Yi(e){if(!Il(e)||ha(e))return!1;var t=bl(e)?vt:Qe;return t.test(Da(e))}function Ji(e){return Sl(e)&&Mi(e)==ie}function Zi(e){return Sl(e)&&Yo(e)==se}function es(e){return Sl(e)&&Tl(e.length)&&!!Xt[Mi(e)]}function ts(e){return"function"==typeof e?e:null==e?Nf:"object"==typeof e?ul(e)?as(e[0],e[1]):os(e):Kf(e)}function ns(e){if(!da(e))return Vt(e);var t=[];for(var n in nt(e))ht.call(e,n)&&"constructor"!=n&&t.push(n);return t}function rs(e){if(!Il(e))return ya(e);var t=da(e),n=[];for(var r in e)("constructor"!=r||!t&&ht.call(e,r))&&n.push(r);return n}function is(e,t){return e<t}function ss(e,t){var r=-1,i=ll(e)?n(e.length):[];return Ei(e,function(e,n,s){i[++r]=t(e,n,s)}),i}function os(e){var t=Go(e);return 1==t.length&&t[0][2]?ga(t[0][0],t[0][1]):function(n){return n===e||Xi(n,e,t)}}function as(e,t){return ua(e)&&pa(t)?ga(Na(e),t):function(n){var r=mh(n,e);return r===i&&r===t?yh(n,e):zi(t,r,m|v)}}function us(e,t,n,r,s){e!==t&&Ri(t,function(o,a){if(s||(s=new Jr),Il(o))cs(e,t,a,n,us,r,s);else{var u=r?r(Ta(e,a),o,a+"",e,t,s):i;u===i&&(u=o),ui(e,a,u)}},Th)}function cs(e,t,n,r,s,o,a){var u=Ta(e,n),c=Ta(t,n),l=a.get(c);if(l)ui(e,n,l);else{var h=o?o(u,c,n+"",e,t,a):i,f=h===i;if(f){var d=ul(c),p=!d&&dl(c),g=!d&&!p&&jl(c);h=c,d||p||g?ul(u)?h=u:hl(u)?h=ro(u):p?(f=!1,h=zs(c,!0)):g?(f=!1,h=Js(c,!0)):h=[]:Pl(c)||al(c)?(h=u,al(u)?h=Yl(u):Il(u)&&!bl(u)||(h=na(c))):f=!1}f&&(a.set(c,h),s(h,c,r,o,a),a["delete"](c)),ui(e,n,h)}}function ls(e,t){var n=e.length;if(n)return t+=t<0?n:0,oa(t,n)?e[t]:i}function hs(e,t,n){t=t.length?An(t,function(e){return ul(e)?function(t){return Pi(t,1===e.length?e[0]:e)}:e}):[Nf];var r=-1;t=An(t,Qn(Ko()));var i=ss(e,function(e,n,i){var s=An(t,function(t){return t(e)});return{criteria:s,index:++r,value:e}});return Kn(i,function(e,t){return eo(e,t,n)})}function fs(e,t){return ds(e,t,function(t,n){return yh(e,n)})}function ds(e,t,n){var r=-1,i=t.length,s={};while(++r<i){var o=t[r],a=Pi(e,o);n(a,o)&&Ts(s,qs(o,e),a)}return s}function ps(e){return function(t){return Pi(t,e)}}function gs(e,t,n,r){var i=r?Fn:Un,s=-1,o=t.length,a=e;e===t&&(t=ro(t)),n&&(a=An(e,Qn(n)));while(++s<o){var u=0,c=t[s],l=n?n(c):c;while((u=i(a,l,u,r))>-1)a!==e&&St.call(a,u,1),St.call(e,u,1)}return e}function ms(e,t){var n=e?t.length:0,r=n-1;while(n--){var i=t[n];if(n==r||i!==s){var s=i;oa(i)?St.call(e,i,1):Ls(e,i)}}return e}function vs(e,t){return e+Pt(Gt()*(t-e+1))}function ys(e,t,r,i){var s=-1,o=jt(xt((t-e)/(r||1)),0),a=n(o);while(o--)a[i?o:++s]=e,e+=r;return a}function _s(e,t){var n="";if(!e||t<1||t>M)return n;do{t%2&&(n+=e),t=Pt(t/2),t&&(e+=e)}while(t);return n}function ws(e,t){return Ca(wa(e,t,Nf),e+"")}function bs(e){return si(Bh(e))}function Es(e,t){var n=Bh(e);return Ra(n,mi(t,0,n.length))}function Ts(e,t,n,r){if(!Il(e))return e;t=qs(t,e);var s=-1,o=t.length,a=o-1,u=e;while(null!=u&&++s<o){var c=Na(t[s]),l=n;if("__proto__"===c||"constructor"===c||"prototype"===c)return e;if(s!=a){var h=u[c];l=r?r(h,c,u):i,l===i&&(l=Il(h)?h:oa(t[s+1])?[]:{})}ci(u,c,l),u=u[c]}return e}var Is=un?function(e,t){return un.set(e,t),e}:Nf,Ss=Rt?function(e,t){return Rt(e,"toString",{configurable:!0,enumerable:!1,value:Af(t),writable:!0})}:Nf;function Cs(e){return Ra(Bh(e))}function As(e,t,r){var i=-1,s=e.length;t<0&&(t=-t>s?0:s+t),r=r>s?s:r,r<0&&(r+=s),s=t>r?0:r-t>>>0,t>>>=0;var o=n(s);while(++i<s)o[i]=e[i+t];return o}function ks(e,t){var n;return Ei(e,function(e,r,i){return n=t(e,r,i),!n}),!!n}function Rs(e,t,n){var r=0,i=null==e?r:e.length;if("number"==typeof t&&t===t&&i<=B){while(r<i){var s=r+i>>>1,o=e[s];null!==o&&!Vl(o)&&(n?o<=t:o<t)?r=s+1:i=s}return i}return Os(e,t,Nf,n)}function Os(e,t,n,r){var s=0,o=null==e?0:e.length;if(0===o)return 0;t=n(t);var a=t!==t,u=null===t,c=Vl(t),l=t===i;while(s<o){var h=Pt((s+o)/2),f=n(e[h]),d=f!==i,p=null===f,g=f===f,m=Vl(f);if(a)var v=r||g;else v=l?g&&(r||d):u?g&&d&&(r||!p):c?g&&d&&!p&&(r||!m):!p&&!m&&(r?f<=t:f<t);v?s=h+1:o=h}return Bt(o,j)}function Ns(e,t){var n=-1,r=e.length,i=0,s=[];while(++n<r){var o=e[n],a=t?t(o):o;if(!n||!il(a,u)){var u=a;s[i++]=0===o?0:o}}return s}function Ds(e){return"number"==typeof e?e:Vl(e)?F:+e}function xs(e){if("string"==typeof e)return e;if(ul(e))return An(e,xs)+"";if(Vl(e))return wr?wr.call(e):"";var t=e+"";return"0"==t&&1/e==-L?"-0":t}function Ps(e,t,n){var r=-1,i=Sn,s=e.length,a=!0,u=[],c=u;if(n)a=!1,i=Cn;else if(s>=o){var l=t?null:Ro(e);if(l)return hr(l);a=!1,i=Yn,c=new Qr}else c=t?[]:u;e:while(++r<s){var h=e[r],f=t?t(h):h;if(h=n||0!==h?h:0,a&&f===f){var d=c.length;while(d--)if(c[d]===f)continue e;t&&c.push(f),u.push(h)}else i(c,f,n)||(c!==u&&c.push(f),u.push(h))}return u}function Ls(e,t){return t=qs(t,e),e=ba(e,t),null==e||delete e[Na(su(t))]}function Ms(e,t,n,r){return Ts(e,t,n(Pi(e,t)),r)}function Us(e,t,n,r){var i=e.length,s=r?i:-1;while((r?s--:++s<i)&&t(e[s],s,e));return n?As(e,r?0:s,r?s+1:i):As(e,r?s+1:0,r?i:s)}function Fs(e,t){var n=e;return n instanceof Ar&&(n=n.value()),Rn(t,function(e,t){return t.func.apply(t.thisArg,kn([e],t.args))},n)}function Vs(e,t,r){var i=e.length;if(i<2)return i?Ps(e[0]):[];var s=-1,o=n(i);while(++s<i){var a=e[s],u=-1;while(++u<i)u!=s&&(o[s]=bi(o[s]||a,e[u],t,r))}return Ps(ki(o,1),t,r)}function js(e,t,n){var r=-1,s=e.length,o=t.length,a={};while(++r<s){var u=r<o?t[r]:i;n(a,e[r],u)}return a}function Bs(e){return hl(e)?e:[]}function $s(e){return"function"==typeof e?e:Nf}function qs(e,t){return ul(e)?e:ua(e,t)?[e]:Oa(Zl(e))}var Ks=ws;function Ws(e,t,n){var r=e.length;return n=n===i?r:n,!t&&n>=r?e:As(e,t,n)}var Gs=Ot||function(e){return an.clearTimeout(e)};function zs(e,t){if(t)return e.slice();var n=e.length,r=bt?bt(n):new e.constructor(n);return e.copy(r),r}function Hs(e){var t=new e.constructor(e.byteLength);return new wt(t).set(new wt(e)),t}function Qs(e,t){var n=t?Hs(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}function Xs(e){var t=new e.constructor(e.source,Ge.exec(e));return t.lastIndex=e.lastIndex,t}function Ys(e){return _r?nt(_r.call(e)):{}}function Js(e,t){var n=t?Hs(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function Zs(e,t){if(e!==t){var n=e!==i,r=null===e,s=e===e,o=Vl(e),a=t!==i,u=null===t,c=t===t,l=Vl(t);if(!u&&!l&&!o&&e>t||o&&a&&c&&!u&&!l||r&&a&&c||!n&&c||!s)return 1;if(!r&&!o&&!l&&e<t||l&&n&&s&&!r&&!o||u&&n&&s||!a&&s||!c)return-1}return 0}function eo(e,t,n){var r=-1,i=e.criteria,s=t.criteria,o=i.length,a=n.length;while(++r<o){var u=Zs(i[r],s[r]);if(u){if(r>=a)return u;var c=n[r];return u*("desc"==c?-1:1)}}return e.index-t.index}function to(e,t,r,i){var s=-1,o=e.length,a=r.length,u=-1,c=t.length,l=jt(o-a,0),h=n(c+l),f=!i;while(++u<c)h[u]=t[u];while(++s<a)(f||s<o)&&(h[r[s]]=e[s]);while(l--)h[u++]=e[s++];return h}function no(e,t,r,i){var s=-1,o=e.length,a=-1,u=r.length,c=-1,l=t.length,h=jt(o-u,0),f=n(h+l),d=!i;while(++s<h)f[s]=e[s];var p=s;while(++c<l)f[p+c]=t[c];while(++a<u)(d||s<o)&&(f[p+r[a]]=e[s++]);return f}function ro(e,t){var r=-1,i=e.length;t||(t=n(i));while(++r<i)t[r]=e[r];return t}function io(e,t,n,r){var s=!n;n||(n={});var o=-1,a=t.length;while(++o<a){var u=t[o],c=r?r(n[u],e[u],u,n,e):i;c===i&&(c=e[u]),s?pi(n,u,c):ci(n,u,c)}return n}function so(e,t){return io(e,Qo(e),t)}function oo(e,t){return io(e,Xo(e),t)}function ao(e,t){return function(n,r){var i=ul(n)?wn:hi,s=t?t():{};return i(n,e,Ko(r,2),s)}}function uo(e){return ws(function(t,n){var r=-1,s=n.length,o=s>1?n[s-1]:i,a=s>2?n[2]:i;o=e.length>3&&"function"==typeof o?(s--,o):i,a&&aa(n[0],n[1],a)&&(o=s<3?i:o,s=1),t=nt(t);while(++r<s){var u=n[r];u&&e(t,u,r,o)}return t})}function co(e,t){return function(n,r){if(null==n)return n;if(!ll(n))return e(n,r);var i=n.length,s=t?i:-1,o=nt(n);while(t?s--:++s<i)if(!1===r(o[s],s,o))break;return n}}function lo(e){return function(t,n,r){var i=-1,s=nt(t),o=r(t),a=o.length;while(a--){var u=o[e?a:++i];if(!1===n(s[u],u,s))break}return t}}function ho(e,t,n){var r=t&y,i=go(e);function s(){var t=this&&this!==an&&this instanceof s?i:e;return t.apply(r?n:this,arguments)}return s}function fo(e){return function(t){t=Zl(t);var n=sr(t)?mr(t):i,r=n?n[0]:t.charAt(0),s=n?Ws(n,1).join(""):t.slice(1);return r[e]()+s}}function po(e){return function(t){return Rn(Ef(Hh(t).replace($t,"")),e,"")}}function go(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=Ir(e.prototype),r=e.apply(n,t);return Il(r)?r:n}}function mo(e,t,r){var s=go(e);function o(){var a=arguments.length,u=n(a),c=a,l=qo(o);while(c--)u[c]=arguments[c];var h=a<3&&u[0]!==l&&u[a-1]!==l?[]:lr(u,l);if(a-=h.length,a<r)return Ao(e,t,_o,o.placeholder,i,u,h,i,i,r-a);var f=this&&this!==an&&this instanceof o?s:e;return _n(f,this,u)}return o}function vo(e){return function(t,n,r){var s=nt(t);if(!ll(t)){var o=Ko(n,3);t=Eh(t),n=function(e){return o(s[e],e,s)}}var a=e(t,n,r);return a>-1?s[o?t[a]:a]:i}}function yo(e){return Fo(function(t){var n=t.length,r=n,s=Cr.prototype.thru;e&&t.reverse();while(r--){var o=t[r];if("function"!=typeof o)throw new st(u);if(s&&!a&&"wrapper"==$o(o))var a=new Cr([],!0)}r=a?r:n;while(++r<n){o=t[r];var c=$o(o),l="wrapper"==c?Bo(o):i;a=l&&la(l[0])&&l[1]==(S|b|T|C)&&!l[4].length&&1==l[9]?a[$o(l[0])].apply(a,l[3]):1==o.length&&la(o)?a[c]():a.thru(o)}return function(){var e=arguments,r=e[0];if(a&&1==e.length&&ul(r))return a.plant(r).value();var i=0,s=n?t[i].apply(this,e):r;while(++i<n)s=t[i].call(this,s);return s}})}function _o(e,t,r,s,o,a,u,c,l,h){var f=t&S,d=t&y,p=t&_,g=t&(b|E),m=t&A,v=p?i:go(e);function w(){var i=arguments.length,y=n(i),_=i;while(_--)y[_]=arguments[_];if(g)var b=qo(w),E=er(y,b);if(s&&(y=to(y,s,o,g)),a&&(y=no(y,a,u,g)),i-=E,g&&i<h){var T=lr(y,b);return Ao(e,t,_o,w.placeholder,r,y,T,c,l,h-i)}var I=d?r:this,S=p?I[e]:e;return i=y.length,c?y=Ea(y,c):m&&i>1&&y.reverse(),f&&l<i&&(y.length=l),this&&this!==an&&this instanceof w&&(S=v||go(S)),S.apply(I,y)}return w}function wo(e,t){return function(n,r){return $i(n,e,t(r),{})}}function bo(e,t){return function(n,r){var s;if(n===i&&r===i)return t;if(n!==i&&(s=n),r!==i){if(s===i)return r;"string"==typeof n||"string"==typeof r?(n=xs(n),r=xs(r)):(n=Ds(n),r=Ds(r)),s=e(n,r)}return s}}function Eo(e){return Fo(function(t){return t=An(t,Qn(Ko())),ws(function(n){var r=this;return e(t,function(e){return _n(e,r,n)})})})}function To(e,t){t=t===i?" ":xs(t);var n=t.length;if(n<2)return n?_s(t,e):t;var r=_s(t,xt(e/gr(t)));return sr(t)?Ws(mr(r),0,e).join(""):r.slice(0,e)}function Io(e,t,r,i){var s=t&y,o=go(e);function a(){var t=-1,u=arguments.length,c=-1,l=i.length,h=n(l+u),f=this&&this!==an&&this instanceof a?o:e;while(++c<l)h[c]=i[c];while(u--)h[c++]=arguments[++t];return _n(f,s?r:this,h)}return a}function So(e){return function(t,n,r){return r&&"number"!=typeof r&&aa(t,n,r)&&(n=r=i),t=zl(t),n===i?(n=t,t=0):n=zl(n),r=r===i?t<n?1:-1:zl(r),ys(t,n,r,e)}}function Co(e){return function(t,n){return"string"==typeof t&&"string"==typeof n||(t=Xl(t),n=Xl(n)),e(t,n)}}function Ao(e,t,n,r,s,o,a,u,c,l){var h=t&b,f=h?a:i,d=h?i:a,p=h?o:i,g=h?i:o;t|=h?T:I,t&=~(h?I:T),t&w||(t&=~(y|_));var m=[e,t,s,p,f,g,d,u,c,l],v=n.apply(i,m);return la(e)&&Ia(v,m),v.placeholder=r,Aa(v,e,t)}function ko(e){var t=tt[e];return function(e,n){if(e=Xl(e),n=null==n?0:Bt(Hl(n),292),n&&Ut(e)){var r=(Zl(e)+"e").split("e"),i=t(r[0]+"e"+(+r[1]+n));return r=(Zl(i)+"e").split("e"),+(r[0]+"e"+(+r[1]-n))}return t(e)}}var Ro=tn&&1/hr(new tn([,-0]))[1]==L?function(e){return new tn(e)}:Vf;function Oo(e){return function(t){var n=Yo(t);return n==J?ur(t):n==se?fr(t):zn(t,e(t))}}function No(e,t,n,r,s,o,a,c){var l=t&_;if(!l&&"function"!=typeof e)throw new st(u);var h=r?r.length:0;if(h||(t&=~(T|I),r=s=i),a=a===i?a:jt(Hl(a),0),c=c===i?c:Hl(c),h-=s?s.length:0,t&I){var f=r,d=s;r=s=i}var p=l?i:Bo(e),g=[e,t,n,r,s,f,d,o,a,c];if(p&&va(g,p),e=g[0],t=g[1],n=g[2],r=g[3],s=g[4],c=g[9]=g[9]===i?l?0:e.length:jt(g[9]-h,0),!c&&t&(b|E)&&(t&=~(b|E)),t&&t!=y)m=t==b||t==E?mo(e,t,c):t!=T&&t!=(y|T)||s.length?_o.apply(i,g):Io(e,t,n,r);else var m=ho(e,t,n);var v=p?Is:Ia;return Aa(v(m,g),e,t)}function Do(e,t,n,r){return e===i||il(e,ut[n])&&!ht.call(r,n)?t:e}function xo(e,t,n,r,s,o){return Il(e)&&Il(t)&&(o.set(t,e),us(e,t,i,xo,o),o["delete"](t)),e}function Po(e){return Pl(e)?i:e}function Lo(e,t,n,r,s,o){var a=n&m,u=e.length,c=t.length;if(u!=c&&!(a&&c>u))return!1;var l=o.get(e),h=o.get(t);if(l&&h)return l==t&&h==e;var f=-1,d=!0,p=n&v?new Qr:i;o.set(e,t),o.set(t,e);while(++f<u){var g=e[f],y=t[f];if(r)var _=a?r(y,g,f,t,e,o):r(g,y,f,e,t,o);if(_!==i){if(_)continue;d=!1;break}if(p){if(!Nn(t,function(e,t){if(!Yn(p,t)&&(g===e||s(g,e,n,r,o)))return p.push(t)})){d=!1;break}}else if(g!==y&&!s(g,y,n,r,o)){d=!1;break}}return o["delete"](e),o["delete"](t),d}function Mo(e,t,n,r,i,s,o){switch(n){case fe:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case he:return!(e.byteLength!=t.byteLength||!s(new wt(e),new wt(t)));case G:case z:case Z:return il(+e,+t);case Q:return e.name==t.name&&e.message==t.message;case ie:case oe:return e==t+"";case J:var a=ur;case se:var u=r&m;if(a||(a=hr),e.size!=t.size&&!u)return!1;var c=o.get(e);if(c)return c==t;r|=v,o.set(e,t);var l=Lo(a(e),a(t),r,i,s,o);return o["delete"](e),l;case ae:if(_r)return _r.call(e)==_r.call(t)}return!1}function Uo(e,t,n,r,s,o){var a=n&m,u=Vo(e),c=u.length,l=Vo(t),h=l.length;if(c!=h&&!a)return!1;var f=c;while(f--){var d=u[f];if(!(a?d in t:ht.call(t,d)))return!1}var p=o.get(e),g=o.get(t);if(p&&g)return p==t&&g==e;var v=!0;o.set(e,t),o.set(t,e);var y=a;while(++f<c){d=u[f];var _=e[d],w=t[d];if(r)var b=a?r(w,_,d,t,e,o):r(_,w,d,e,t,o);if(!(b===i?_===w||s(_,w,n,r,o):b)){v=!1;break}y||(y="constructor"==d)}if(v&&!y){var E=e.constructor,T=t.constructor;E==T||!("constructor"in e)||!("constructor"in t)||"function"==typeof E&&E instanceof E&&"function"==typeof T&&T instanceof T||(v=!1)}return o["delete"](e),o["delete"](t),v}function Fo(e){return Ca(wa(e,i,Ha),e+"")}function Vo(e){return Li(e,Eh,Qo)}function jo(e){return Li(e,Th,Xo)}var Bo=un?function(e){return un.get(e)}:Vf;function $o(e){var t=e.name+"",n=cn[t],r=ht.call(cn,t)?n.length:0;while(r--){var i=n[r],s=i.func;if(null==s||s==e)return i.name}return t}function qo(e){var t=ht.call(Er,"placeholder")?Er:e;return t.placeholder}function Ko(){var e=Er.iteratee||Df;return e=e===Df?ts:e,arguments.length?e(arguments[0],arguments[1]):e}function Wo(e,t){var n=e.__data__;return ca(t)?n["string"==typeof t?"string":"hash"]:n.map}function Go(e){var t=Eh(e),n=t.length;while(n--){var r=t[n],i=e[r];t[n]=[r,i,pa(i)]}return t}function zo(e,t){var n=ir(e,t);return Yi(n)?n:i}function Ho(e){var t=ht.call(e,kt),n=e[kt];try{e[kt]=i;var r=!0}catch(o){}var s=pt.call(e);return r&&(t?e[kt]=n:delete e[kt]),s}var Qo=Lt?function(e){return null==e?[]:(e=nt(e),In(Lt(e),function(t){return It.call(e,t)}))}:Hf,Xo=Lt?function(e){var t=[];while(e)kn(t,Qo(e)),e=Et(e);return t}:Hf,Yo=Mi;function Jo(e,t,n){var r=-1,i=n.length;while(++r<i){var s=n[r],o=s.size;switch(s.type){case"drop":e+=o;break;case"dropRight":t-=o;break;case"take":t=Bt(t,e+o);break;case"takeRight":e=jt(e,t-o);break}}return{start:e,end:t}}function Zo(e){var t=e.match(je);return t?t[1].split(Be):[]}function ea(e,t,n){t=qs(t,e);var r=-1,i=t.length,s=!1;while(++r<i){var o=Na(t[r]);if(!(s=null!=e&&n(e,o)))break;e=e[o]}return s||++r!=i?s:(i=null==e?0:e.length,!!i&&Tl(i)&&oa(o,i)&&(ul(e)||al(e)))}function ta(e){var t=e.length,n=new e.constructor(t);return t&&"string"==typeof e[0]&&ht.call(e,"index")&&(n.index=e.index,n.input=e.input),n}function na(e){return"function"!=typeof e.constructor||da(e)?{}:Ir(Et(e))}function ra(e,t,n){var r=e.constructor;switch(t){case he:return Hs(e);case G:case z:return new r(+e);case fe:return Qs(e,n);case de:case pe:case ge:case me:case ve:case ye:case _e:case we:case be:return Js(e,n);case J:return new r;case Z:case oe:return new r(e);case ie:return Xs(e);case se:return new r;case ae:return Ys(e)}}function ia(e,t){var n=t.length;if(!n)return e;var r=n-1;return t[r]=(n>1?"& ":"")+t[r],t=t.join(n>2?", ":" "),e.replace(Ve,"{\n/* [wrapped with "+t+"] */\n")}function sa(e){return ul(e)||al(e)||!!(Ct&&e&&e[Ct])}function oa(e,t){var n=typeof e;return t=null==t?M:t,!!t&&("number"==n||"symbol"!=n&&Ye.test(e))&&e>-1&&e%1==0&&e<t}function aa(e,t,n){if(!Il(n))return!1;var r=typeof t;return!!("number"==r?ll(n)&&oa(t,n.length):"string"==r&&t in n)&&il(n[t],e)}function ua(e,t){if(ul(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!Vl(e))||(xe.test(e)||!De.test(e)||null!=t&&e in nt(t))}function ca(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}function la(e){var t=$o(e),n=Er[t];if("function"!=typeof n||!(t in Ar.prototype))return!1;if(e===n)return!0;var r=Bo(n);return!!r&&e===r[0]}function ha(e){return!!dt&&dt in e}(Jt&&Yo(new Jt(new ArrayBuffer(1)))!=fe||Zt&&Yo(new Zt)!=J||en&&Yo(en.resolve())!=ne||tn&&Yo(new tn)!=se||sn&&Yo(new sn)!=ce)&&(Yo=function(e){var t=Mi(e),n=t==te?e.constructor:i,r=n?Da(n):"";if(r)switch(r){case hn:return fe;case fn:return J;case Dn:return ne;case xn:return se;case $n:return ce}return t});var fa=ct?bl:Qf;function da(e){var t=e&&e.constructor,n="function"==typeof t&&t.prototype||ut;return e===n}function pa(e){return e===e&&!Il(e)}function ga(e,t){return function(n){return null!=n&&(n[e]===t&&(t!==i||e in nt(n)))}}function ma(e){var t=jc(e,function(e){return n.size===h&&n.clear(),e}),n=t.cache;return t}function va(e,t){var n=e[1],r=t[1],i=n|r,s=i<(y|_|S),o=r==S&&n==b||r==S&&n==C&&e[7].length<=t[8]||r==(S|C)&&t[7].length<=t[8]&&n==b;if(!s&&!o)return e;r&y&&(e[2]=t[2],i|=n&y?0:w);var a=t[3];if(a){var u=e[3];e[3]=u?to(u,a,t[4]):a,e[4]=u?lr(e[3],f):t[4]}return a=t[5],a&&(u=e[5],e[5]=u?no(u,a,t[6]):a,e[6]=u?lr(e[5],f):t[6]),a=t[7],a&&(e[7]=a),r&S&&(e[8]=null==e[8]?t[8]:Bt(e[8],t[8])),null==e[9]&&(e[9]=t[9]),e[0]=t[0],e[1]=i,e}function ya(e){var t=[];if(null!=e)for(var n in nt(e))t.push(n);return t}function _a(e){return pt.call(e)}function wa(e,t,r){return t=jt(t===i?e.length-1:t,0),function(){var i=arguments,s=-1,o=jt(i.length-t,0),a=n(o);while(++s<o)a[s]=i[t+s];s=-1;var u=n(t+1);while(++s<t)u[s]=i[s];return u[t]=r(a),_n(e,this,u)}}function ba(e,t){return t.length<2?e:Pi(e,As(t,0,-1))}function Ea(e,t){var n=e.length,r=Bt(t.length,n),s=ro(e);while(r--){var o=t[r];e[r]=oa(o,n)?s[o]:i}return e}function Ta(e,t){if(("constructor"!==t||"function"!==typeof e[t])&&"__proto__"!=t)return e[t]}var Ia=ka(Is),Sa=Dt||function(e,t){return an.setTimeout(e,t)},Ca=ka(Ss);function Aa(e,t,n){var r=t+"";return Ca(e,ia(r,xa(Zo(r),n)))}function ka(e){var t=0,n=0;return function(){var r=Kt(),s=N-(r-n);if(n=r,s>0){if(++t>=O)return arguments[0]}else t=0;return e.apply(i,arguments)}}function Ra(e,t){var n=-1,r=e.length,s=r-1;t=t===i?r:t;while(++n<t){var o=vs(n,s),a=e[o];e[o]=e[n],e[n]=a}return e.length=t,e}var Oa=ma(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(Pe,function(e,n,r,i){t.push(r?i.replace(Ke,"$1"):n||e)}),t});function Na(e){if("string"==typeof e||Vl(e))return e;var t=e+"";return"0"==t&&1/e==-L?"-0":t}function Da(e){if(null!=e){try{return lt.call(e)}catch(t){}try{return e+""}catch(t){}}return""}function xa(e,t){return bn($,function(n){var r="_."+n[0];t&n[1]&&!Sn(e,r)&&e.push(r)}),e.sort()}function Pa(e){if(e instanceof Ar)return e.clone();var t=new Cr(e.__wrapped__,e.__chain__);return t.__actions__=ro(e.__actions__),t.__index__=e.__index__,t.__values__=e.__values__,t}function La(e,t,r){t=(r?aa(e,t,r):t===i)?1:jt(Hl(t),0);var s=null==e?0:e.length;if(!s||t<1)return[];var o=0,a=0,u=n(xt(s/t));while(o<s)u[a++]=As(e,o,o+=t);return u}function Ma(e){var t=-1,n=null==e?0:e.length,r=0,i=[];while(++t<n){var s=e[t];s&&(i[r++]=s)}return i}function Ua(){var e=arguments.length;if(!e)return[];var t=n(e-1),r=arguments[0],i=e;while(i--)t[i-1]=arguments[i];return kn(ul(r)?ro(r):[r],ki(t,1))}var Fa=ws(function(e,t){return hl(e)?bi(e,ki(t,1,hl,!0)):[]}),Va=ws(function(e,t){var n=su(t);return hl(n)&&(n=i),hl(e)?bi(e,ki(t,1,hl,!0),Ko(n,2)):[]}),ja=ws(function(e,t){var n=su(t);return hl(n)&&(n=i),hl(e)?bi(e,ki(t,1,hl,!0),i,n):[]});function Ba(e,t,n){var r=null==e?0:e.length;return r?(t=n||t===i?1:Hl(t),As(e,t<0?0:t,r)):[]}function $a(e,t,n){var r=null==e?0:e.length;return r?(t=n||t===i?1:Hl(t),t=r-t,As(e,0,t<0?0:t)):[]}function qa(e,t){return e&&e.length?Us(e,Ko(t,3),!0,!0):[]}function Ka(e,t){return e&&e.length?Us(e,Ko(t,3),!0):[]}function Wa(e,t,n,r){var i=null==e?0:e.length;return i?(n&&"number"!=typeof n&&aa(e,t,n)&&(n=0,r=i),Ci(e,t,n,r)):[]}function Ga(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var i=null==n?0:Hl(n);return i<0&&(i=jt(r+i,0)),Mn(e,Ko(t,3),i)}function za(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var s=r-1;return n!==i&&(s=Hl(n),s=n<0?jt(r+s,0):Bt(s,r-1)),Mn(e,Ko(t,3),s,!0)}function Ha(e){var t=null==e?0:e.length;return t?ki(e,1):[]}function Qa(e){var t=null==e?0:e.length;return t?ki(e,L):[]}function Xa(e,t){var n=null==e?0:e.length;return n?(t=t===i?1:Hl(t),ki(e,t)):[]}function Ya(e){var t=-1,n=null==e?0:e.length,r={};while(++t<n){var i=e[t];r[i[0]]=i[1]}return r}function Ja(e){return e&&e.length?e[0]:i}function Za(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var i=null==n?0:Hl(n);return i<0&&(i=jt(r+i,0)),Un(e,t,i)}function eu(e){var t=null==e?0:e.length;return t?As(e,0,-1):[]}var tu=ws(function(e){var t=An(e,Bs);return t.length&&t[0]===e[0]?Bi(t):[]}),nu=ws(function(e){var t=su(e),n=An(e,Bs);return t===su(n)?t=i:n.pop(),n.length&&n[0]===e[0]?Bi(n,Ko(t,2)):[]}),ru=ws(function(e){var t=su(e),n=An(e,Bs);return t="function"==typeof t?t:i,t&&n.pop(),n.length&&n[0]===e[0]?Bi(n,i,t):[]});function iu(e,t){return null==e?"":Ft.call(e,t)}function su(e){var t=null==e?0:e.length;return t?e[t-1]:i}function ou(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var s=r;return n!==i&&(s=Hl(n),s=s<0?jt(r+s,0):Bt(s,r-1)),t===t?pr(e,t,s):Mn(e,Vn,s,!0)}function au(e,t){return e&&e.length?ls(e,Hl(t)):i}var uu=ws(cu);function cu(e,t){return e&&e.length&&t&&t.length?gs(e,t):e}function lu(e,t,n){return e&&e.length&&t&&t.length?gs(e,t,Ko(n,2)):e}function hu(e,t,n){return e&&e.length&&t&&t.length?gs(e,t,i,n):e}var fu=Fo(function(e,t){var n=null==e?0:e.length,r=gi(e,t);return ms(e,An(t,function(e){return oa(e,n)?+e:e}).sort(Zs)),r});function du(e,t){var n=[];if(!e||!e.length)return n;var r=-1,i=[],s=e.length;t=Ko(t,3);while(++r<s){var o=e[r];t(o,r,e)&&(n.push(o),i.push(r))}return ms(e,i),n}function pu(e){return null==e?e:zt.call(e)}function gu(e,t,n){var r=null==e?0:e.length;return r?(n&&"number"!=typeof n&&aa(e,t,n)?(t=0,n=r):(t=null==t?0:Hl(t),n=n===i?r:Hl(n)),As(e,t,n)):[]}function mu(e,t){return Rs(e,t)}function vu(e,t,n){return Os(e,t,Ko(n,2))}function yu(e,t){var n=null==e?0:e.length;if(n){var r=Rs(e,t);if(r<n&&il(e[r],t))return r}return-1}function _u(e,t){return Rs(e,t,!0)}function wu(e,t,n){return Os(e,t,Ko(n,2),!0)}function bu(e,t){var n=null==e?0:e.length;if(n){var r=Rs(e,t,!0)-1;if(il(e[r],t))return r}return-1}function Eu(e){return e&&e.length?Ns(e):[]}function Tu(e,t){return e&&e.length?Ns(e,Ko(t,2)):[]}function Iu(e){var t=null==e?0:e.length;return t?As(e,1,t):[]}function Su(e,t,n){return e&&e.length?(t=n||t===i?1:Hl(t),As(e,0,t<0?0:t)):[]}function Cu(e,t,n){var r=null==e?0:e.length;return r?(t=n||t===i?1:Hl(t),t=r-t,As(e,t<0?0:t,r)):[]}function Au(e,t){return e&&e.length?Us(e,Ko(t,3),!1,!0):[]}function ku(e,t){return e&&e.length?Us(e,Ko(t,3)):[]}var Ru=ws(function(e){return Ps(ki(e,1,hl,!0))}),Ou=ws(function(e){var t=su(e);return hl(t)&&(t=i),Ps(ki(e,1,hl,!0),Ko(t,2))}),Nu=ws(function(e){var t=su(e);return t="function"==typeof t?t:i,Ps(ki(e,1,hl,!0),i,t)});function Du(e){return e&&e.length?Ps(e):[]}function xu(e,t){return e&&e.length?Ps(e,Ko(t,2)):[]}function Pu(e,t){return t="function"==typeof t?t:i,e&&e.length?Ps(e,i,t):[]}function Lu(e){if(!e||!e.length)return[];var t=0;return e=In(e,function(e){if(hl(e))return t=jt(e.length,t),!0}),Gn(t,function(t){return An(e,Bn(t))})}function Mu(e,t){if(!e||!e.length)return[];var n=Lu(e);return null==t?n:An(n,function(e){return _n(t,i,e)})}var Uu=ws(function(e,t){return hl(e)?bi(e,t):[]}),Fu=ws(function(e){return Vs(In(e,hl))}),Vu=ws(function(e){var t=su(e);return hl(t)&&(t=i),Vs(In(e,hl),Ko(t,2))}),ju=ws(function(e){var t=su(e);return t="function"==typeof t?t:i,Vs(In(e,hl),i,t)}),Bu=ws(Lu);function $u(e,t){return js(e||[],t||[],ci)}function qu(e,t){return js(e||[],t||[],Ts)}var Ku=ws(function(e){var t=e.length,n=t>1?e[t-1]:i;return n="function"==typeof n?(e.pop(),n):i,Mu(e,n)});function Wu(e){var t=Er(e);return t.__chain__=!0,t}function Gu(e,t){return t(e),e}function zu(e,t){return t(e)}var Hu=Fo(function(e){var t=e.length,n=t?e[0]:0,r=this.__wrapped__,s=function(t){return gi(t,e)};return!(t>1||this.__actions__.length)&&r instanceof Ar&&oa(n)?(r=r.slice(n,+n+(t?1:0)),r.__actions__.push({func:zu,args:[s],thisArg:i}),new Cr(r,this.__chain__).thru(function(e){return t&&!e.length&&e.push(i),e})):this.thru(s)});function Qu(){return Wu(this)}function Xu(){return new Cr(this.value(),this.__chain__)}function Yu(){this.__values__===i&&(this.__values__=Gl(this.value()));var e=this.__index__>=this.__values__.length,t=e?i:this.__values__[this.__index__++];return{done:e,value:t}}function Ju(){return this}function Zu(e){var t,n=this;while(n instanceof Sr){var r=Pa(n);r.__index__=0,r.__values__=i,t?s.__wrapped__=r:t=r;var s=r;n=n.__wrapped__}return s.__wrapped__=e,t}function ec(){var e=this.__wrapped__;if(e instanceof Ar){var t=e;return this.__actions__.length&&(t=new Ar(this)),t=t.reverse(),t.__actions__.push({func:zu,args:[pu],thisArg:i}),new Cr(t,this.__chain__)}return this.thru(pu)}function tc(){return Fs(this.__wrapped__,this.__actions__)}var nc=ao(function(e,t,n){ht.call(e,n)?++e[n]:pi(e,n,1)});function rc(e,t,n){var r=ul(e)?Tn:Ii;return n&&aa(e,t,n)&&(t=i),r(e,Ko(t,3))}function ic(e,t){var n=ul(e)?In:Ai;return n(e,Ko(t,3))}var sc=vo(Ga),oc=vo(za);function ac(e,t){return ki(mc(e,t),1)}function uc(e,t){return ki(mc(e,t),L)}function cc(e,t,n){return n=n===i?1:Hl(n),ki(mc(e,t),n)}function lc(e,t){var n=ul(e)?bn:Ei;return n(e,Ko(t,3))}function hc(e,t){var n=ul(e)?En:Ti;return n(e,Ko(t,3))}var fc=ao(function(e,t,n){ht.call(e,n)?e[n].push(t):pi(e,n,[t])});function dc(e,t,n,r){e=ll(e)?e:Bh(e),n=n&&!r?Hl(n):0;var i=e.length;return n<0&&(n=jt(i+n,0)),Fl(e)?n<=i&&e.indexOf(t,n)>-1:!!i&&Un(e,t,n)>-1}var pc=ws(function(e,t,r){var i=-1,s="function"==typeof t,o=ll(e)?n(e.length):[];return Ei(e,function(e){o[++i]=s?_n(t,e,r):qi(e,t,r)}),o}),gc=ao(function(e,t,n){pi(e,n,t)});function mc(e,t){var n=ul(e)?An:ss;return n(e,Ko(t,3))}function vc(e,t,n,r){return null==e?[]:(ul(t)||(t=null==t?[]:[t]),n=r?i:n,ul(n)||(n=null==n?[]:[n]),hs(e,t,n))}var yc=ao(function(e,t,n){e[n?0:1].push(t)},function(){return[[],[]]});function _c(e,t,n){var r=ul(e)?Rn:qn,i=arguments.length<3;return r(e,Ko(t,4),n,i,Ei)}function wc(e,t,n){var r=ul(e)?On:qn,i=arguments.length<3;return r(e,Ko(t,4),n,i,Ti)}function bc(e,t){var n=ul(e)?In:Ai;return n(e,Bc(Ko(t,3)))}function Ec(e){var t=ul(e)?si:bs;return t(e)}function Tc(e,t,n){t=(n?aa(e,t,n):t===i)?1:Hl(t);var r=ul(e)?oi:Es;return r(e,t)}function Ic(e){var t=ul(e)?ai:Cs;return t(e)}function Sc(e){if(null==e)return 0;if(ll(e))return Fl(e)?gr(e):e.length;var t=Yo(e);return t==J||t==se?e.size:ns(e).length}function Cc(e,t,n){var r=ul(e)?Nn:ks;return n&&aa(e,t,n)&&(t=i),r(e,Ko(t,3))}var Ac=ws(function(e,t){if(null==e)return[];var n=t.length;return n>1&&aa(e,t[0],t[1])?t=[]:n>2&&aa(t[0],t[1],t[2])&&(t=[t[0]]),hs(e,ki(t,1),[])}),kc=Nt||function(){return an.Date.now()};function Rc(e,t){if("function"!=typeof t)throw new st(u);return e=Hl(e),function(){if(--e<1)return t.apply(this,arguments)}}function Oc(e,t,n){return t=n?i:t,t=e&&null==t?e.length:t,No(e,S,i,i,i,i,t)}function Nc(e,t){var n;if("function"!=typeof t)throw new st(u);return e=Hl(e),function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=i),n}}var Dc=ws(function(e,t,n){var r=y;if(n.length){var i=lr(n,qo(Dc));r|=T}return No(e,r,t,n,i)}),xc=ws(function(e,t,n){var r=y|_;if(n.length){var i=lr(n,qo(xc));r|=T}return No(t,r,e,n,i)});function Pc(e,t,n){t=n?i:t;var r=No(e,b,i,i,i,i,i,t);return r.placeholder=Pc.placeholder,r}function Lc(e,t,n){t=n?i:t;var r=No(e,E,i,i,i,i,i,t);return r.placeholder=Lc.placeholder,r}function Mc(e,t,n){var r,s,o,a,c,l,h=0,f=!1,d=!1,p=!0;if("function"!=typeof e)throw new st(u);function g(t){var n=r,o=s;return r=s=i,h=t,a=e.apply(o,n),a}function m(e){return h=e,c=Sa(_,t),f?g(e):a}function v(e){var n=e-l,r=e-h,i=t-n;return d?Bt(i,o-r):i}function y(e){var n=e-l,r=e-h;return l===i||n>=t||n<0||d&&r>=o}function _(){var e=kc();if(y(e))return w(e);c=Sa(_,v(e))}function w(e){return c=i,p&&r?g(e):(r=s=i,a)}function b(){c!==i&&Gs(c),h=0,r=l=s=c=i}function E(){return c===i?a:w(kc())}function T(){var e=kc(),n=y(e);if(r=arguments,s=this,l=e,n){if(c===i)return m(l);if(d)return Gs(c),c=Sa(_,t),g(l)}return c===i&&(c=Sa(_,t)),a}return t=Xl(t)||0,Il(n)&&(f=!!n.leading,d="maxWait"in n,o=d?jt(Xl(n.maxWait)||0,t):o,p="trailing"in n?!!n.trailing:p),T.cancel=b,T.flush=E,T}var Uc=ws(function(e,t){return wi(e,1,t)}),Fc=ws(function(e,t,n){return wi(e,Xl(t)||0,n)});function Vc(e){return No(e,A)}function jc(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new st(u);var n=function(){var r=arguments,i=t?t.apply(this,r):r[0],s=n.cache;if(s.has(i))return s.get(i);var o=e.apply(this,r);return n.cache=s.set(i,o)||s,o};return n.cache=new(jc.Cache||qr),n}function Bc(e){if("function"!=typeof e)throw new st(u);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}function $c(e){return Nc(2,e)}jc.Cache=qr;var qc=Ks(function(e,t){t=1==t.length&&ul(t[0])?An(t[0],Qn(Ko())):An(ki(t,1),Qn(Ko()));var n=t.length;return ws(function(r){var i=-1,s=Bt(r.length,n);while(++i<s)r[i]=t[i].call(this,r[i]);return _n(e,this,r)})}),Kc=ws(function(e,t){var n=lr(t,qo(Kc));return No(e,T,i,t,n)}),Wc=ws(function(e,t){var n=lr(t,qo(Wc));return No(e,I,i,t,n)}),Gc=Fo(function(e,t){return No(e,C,i,i,i,t)});function zc(e,t){if("function"!=typeof e)throw new st(u);return t=t===i?t:Hl(t),ws(e,t)}function Hc(e,t){if("function"!=typeof e)throw new st(u);return t=null==t?0:jt(Hl(t),0),ws(function(n){var r=n[t],i=Ws(n,0,t);return r&&kn(i,r),_n(e,this,i)})}function Qc(e,t,n){var r=!0,i=!0;if("function"!=typeof e)throw new st(u);return Il(n)&&(r="leading"in n?!!n.leading:r,i="trailing"in n?!!n.trailing:i),Mc(e,t,{leading:r,maxWait:t,trailing:i})}function Xc(e){return Oc(e,1)}function Yc(e,t){return Kc($s(t),e)}function Jc(){if(!arguments.length)return[];var e=arguments[0];return ul(e)?e:[e]}function Zc(e){return vi(e,g)}function el(e,t){return t="function"==typeof t?t:i,vi(e,g,t)}function tl(e){return vi(e,d|g)}function nl(e,t){return t="function"==typeof t?t:i,vi(e,d|g,t)}function rl(e,t){return null==t||_i(e,t,Eh(t))}function il(e,t){return e===t||e!==e&&t!==t}var sl=Co(Ui),ol=Co(function(e,t){return e>=t}),al=Ki(function(){return arguments}())?Ki:function(e){return Sl(e)&&ht.call(e,"callee")&&!It.call(e,"callee")},ul=n.isArray,cl=dn?Qn(dn):Wi;function ll(e){return null!=e&&Tl(e.length)&&!bl(e)}function hl(e){return Sl(e)&&ll(e)}function fl(e){return!0===e||!1===e||Sl(e)&&Mi(e)==G}var dl=Mt||Qf,pl=pn?Qn(pn):Gi;function gl(e){return Sl(e)&&1===e.nodeType&&!Pl(e)}function ml(e){if(null==e)return!0;if(ll(e)&&(ul(e)||"string"==typeof e||"function"==typeof e.splice||dl(e)||jl(e)||al(e)))return!e.length;var t=Yo(e);if(t==J||t==se)return!e.size;if(da(e))return!ns(e).length;for(var n in e)if(ht.call(e,n))return!1;return!0}function vl(e,t){return zi(e,t)}function yl(e,t,n){n="function"==typeof n?n:i;var r=n?n(e,t):i;return r===i?zi(e,t,i,n):!!r}function _l(e){if(!Sl(e))return!1;var t=Mi(e);return t==Q||t==H||"string"==typeof e.message&&"string"==typeof e.name&&!Pl(e)}function wl(e){return"number"==typeof e&&Ut(e)}function bl(e){if(!Il(e))return!1;var t=Mi(e);return t==X||t==Y||t==W||t==re}function El(e){return"number"==typeof e&&e==Hl(e)}function Tl(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=M}function Il(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function Sl(e){return null!=e&&"object"==typeof e}var Cl=gn?Qn(gn):Qi;function Al(e,t){return e===t||Xi(e,t,Go(t))}function kl(e,t,n){return n="function"==typeof n?n:i,Xi(e,t,Go(t),n)}function Rl(e){return xl(e)&&e!=+e}function Ol(e){if(fa(e))throw new Fe(a);return Yi(e)}function Nl(e){return null===e}function Dl(e){return null==e}function xl(e){return"number"==typeof e||Sl(e)&&Mi(e)==Z}function Pl(e){if(!Sl(e)||Mi(e)!=te)return!1;var t=Et(e);if(null===t)return!0;var n=ht.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&lt.call(n)==gt}var Ll=mn?Qn(mn):Ji;function Ml(e){return El(e)&&e>=-M&&e<=M}var Ul=vn?Qn(vn):Zi;function Fl(e){return"string"==typeof e||!ul(e)&&Sl(e)&&Mi(e)==oe}function Vl(e){return"symbol"==typeof e||Sl(e)&&Mi(e)==ae}var jl=yn?Qn(yn):es;function Bl(e){return e===i}function $l(e){return Sl(e)&&Yo(e)==ce}function ql(e){return Sl(e)&&Mi(e)==le}var Kl=Co(is),Wl=Co(function(e,t){return e<=t});function Gl(e){if(!e)return[];if(ll(e))return Fl(e)?mr(e):ro(e);if(At&&e[At])return ar(e[At]());var t=Yo(e),n=t==J?ur:t==se?hr:Bh;return n(e)}function zl(e){if(!e)return 0===e?e:0;if(e=Xl(e),e===L||e===-L){var t=e<0?-1:1;return t*U}return e===e?e:0}function Hl(e){var t=zl(e),n=t%1;return t===t?n?t-n:t:0}function Ql(e){return e?mi(Hl(e),0,V):0}function Xl(e){if("number"==typeof e)return e;if(Vl(e))return F;if(Il(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=Il(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=Hn(e);var n=He.test(e);return n||Xe.test(e)?rn(e.slice(2),n?2:8):ze.test(e)?F:+e}function Yl(e){return io(e,Th(e))}function Jl(e){return e?mi(Hl(e),-M,M):0===e?e:0}function Zl(e){return null==e?"":xs(e)}var eh=uo(function(e,t){if(da(t)||ll(t))io(t,Eh(t),e);else for(var n in t)ht.call(t,n)&&ci(e,n,t[n])}),th=uo(function(e,t){io(t,Th(t),e)}),nh=uo(function(e,t,n,r){io(t,Th(t),e,r)}),rh=uo(function(e,t,n,r){io(t,Eh(t),e,r)}),ih=Fo(gi);function sh(e,t){var n=Ir(e);return null==t?n:fi(n,t)}var oh=ws(function(e,t){e=nt(e);var n=-1,r=t.length,s=r>2?t[2]:i;s&&aa(t[0],t[1],s)&&(r=1);while(++n<r){var o=t[n],a=Th(o),u=-1,c=a.length;while(++u<c){var l=a[u],h=e[l];(h===i||il(h,ut[l])&&!ht.call(e,l))&&(e[l]=o[l])}}return e}),ah=ws(function(e){return e.push(i,xo),_n(Ah,i,e)});function uh(e,t){return Ln(e,Ko(t,3),Ni)}function ch(e,t){return Ln(e,Ko(t,3),Di)}function lh(e,t){return null==e?e:Ri(e,Ko(t,3),Th)}function hh(e,t){return null==e?e:Oi(e,Ko(t,3),Th)}function fh(e,t){return e&&Ni(e,Ko(t,3))}function dh(e,t){return e&&Di(e,Ko(t,3))}function ph(e){return null==e?[]:xi(e,Eh(e))}function gh(e){return null==e?[]:xi(e,Th(e))}function mh(e,t,n){var r=null==e?i:Pi(e,t);return r===i?n:r}function vh(e,t){return null!=e&&ea(e,t,Fi)}function yh(e,t){return null!=e&&ea(e,t,Vi)}var _h=wo(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=pt.call(t)),e[t]=n},Af(Nf)),wh=wo(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=pt.call(t)),ht.call(e,t)?e[t].push(n):e[t]=[n]},Ko),bh=ws(qi);function Eh(e){return ll(e)?ii(e):ns(e)}function Th(e){return ll(e)?ii(e,!0):rs(e)}function Ih(e,t){var n={};return t=Ko(t,3),Ni(e,function(e,r,i){pi(n,t(e,r,i),e)}),n}function Sh(e,t){var n={};return t=Ko(t,3),Ni(e,function(e,r,i){pi(n,r,t(e,r,i))}),n}var Ch=uo(function(e,t,n){us(e,t,n)}),Ah=uo(function(e,t,n,r){us(e,t,n,r)}),kh=Fo(function(e,t){var n={};if(null==e)return n;var r=!1;t=An(t,function(t){return t=qs(t,e),r||(r=t.length>1),t}),io(e,jo(e),n),r&&(n=vi(n,d|p|g,Po));var i=t.length;while(i--)Ls(n,t[i]);return n});function Rh(e,t){return Nh(e,Bc(Ko(t)))}var Oh=Fo(function(e,t){return null==e?{}:fs(e,t)});function Nh(e,t){if(null==e)return{};var n=An(jo(e),function(e){return[e]});return t=Ko(t),ds(e,n,function(e,n){return t(e,n[0])})}function Dh(e,t,n){t=qs(t,e);var r=-1,s=t.length;s||(s=1,e=i);while(++r<s){var o=null==e?i:e[Na(t[r])];o===i&&(r=s,o=n),e=bl(o)?o.call(e):o}return e}function xh(e,t,n){return null==e?e:Ts(e,t,n)}function Ph(e,t,n,r){return r="function"==typeof r?r:i,null==e?e:Ts(e,t,n,r)}var Lh=Oo(Eh),Mh=Oo(Th);function Uh(e,t,n){var r=ul(e),i=r||dl(e)||jl(e);if(t=Ko(t,4),null==n){var s=e&&e.constructor;n=i?r?new s:[]:Il(e)&&bl(s)?Ir(Et(e)):{}}return(i?bn:Ni)(e,function(e,r,i){return t(n,e,r,i)}),n}function Fh(e,t){return null==e||Ls(e,t)}function Vh(e,t,n){return null==e?e:Ms(e,t,$s(n))}function jh(e,t,n,r){return r="function"==typeof r?r:i,null==e?e:Ms(e,t,$s(n),r)}function Bh(e){return null==e?[]:Xn(e,Eh(e))}function $h(e){return null==e?[]:Xn(e,Th(e))}function qh(e,t,n){return n===i&&(n=t,t=i),n!==i&&(n=Xl(n),n=n===n?n:0),t!==i&&(t=Xl(t),t=t===t?t:0),mi(Xl(e),t,n)}function Kh(e,t,n){return t=zl(t),n===i?(n=t,t=0):n=zl(n),e=Xl(e),ji(e,t,n)}function Wh(e,t,n){if(n&&"boolean"!=typeof n&&aa(e,t,n)&&(t=n=i),n===i&&("boolean"==typeof t?(n=t,t=i):"boolean"==typeof e&&(n=e,e=i)),e===i&&t===i?(e=0,t=1):(e=zl(e),t===i?(t=e,e=0):t=zl(t)),e>t){var r=e;e=t,t=r}if(n||e%1||t%1){var s=Gt();return Bt(e+s*(t-e+nn("1e-"+((s+"").length-1))),t)}return vs(e,t)}var Gh=po(function(e,t,n){return t=t.toLowerCase(),e+(n?zh(t):t)});function zh(e){return bf(Zl(e).toLowerCase())}function Hh(e){return e=Zl(e),e&&e.replace(Je,tr).replace(qt,"")}function Qh(e,t,n){e=Zl(e),t=xs(t);var r=e.length;n=n===i?r:mi(Hl(n),0,r);var s=n;return n-=t.length,n>=0&&e.slice(n,s)==t}function Xh(e){return e=Zl(e),e&&ke.test(e)?e.replace(Ce,nr):e}function Yh(e){return e=Zl(e),e&&Me.test(e)?e.replace(Le,"\\$&"):e}var Jh=po(function(e,t,n){return e+(n?"-":"")+t.toLowerCase()}),Zh=po(function(e,t,n){return e+(n?" ":"")+t.toLowerCase()}),ef=fo("toLowerCase");function tf(e,t,n){e=Zl(e),t=Hl(t);var r=t?gr(e):0;if(!t||r>=t)return e;var i=(t-r)/2;return To(Pt(i),n)+e+To(xt(i),n)}function nf(e,t,n){e=Zl(e),t=Hl(t);var r=t?gr(e):0;return t&&r<t?e+To(t-r,n):e}function rf(e,t,n){e=Zl(e),t=Hl(t);var r=t?gr(e):0;return t&&r<t?To(t-r,n)+e:e}function sf(e,t,n){return n||null==t?t=0:t&&(t=+t),Wt(Zl(e).replace(Ue,""),t||0)}function of(e,t,n){return t=(n?aa(e,t,n):t===i)?1:Hl(t),_s(Zl(e),t)}function af(){var e=arguments,t=Zl(e[0]);return e.length<3?t:t.replace(e[1],e[2])}var uf=po(function(e,t,n){return e+(n?"_":"")+t.toLowerCase()});function cf(e,t,n){return n&&"number"!=typeof n&&aa(e,t,n)&&(t=n=i),n=n===i?V:n>>>0,n?(e=Zl(e),e&&("string"==typeof t||null!=t&&!Ll(t))&&(t=xs(t),!t&&sr(e))?Ws(mr(e),0,n):e.split(t,n)):[]}var lf=po(function(e,t,n){return e+(n?" ":"")+bf(t)});function hf(e,t,n){return e=Zl(e),n=null==n?0:mi(Hl(n),0,e.length),t=xs(t),e.slice(n,n+t.length)==t}function ff(e,t,n){var r=Er.templateSettings;n&&aa(e,t,n)&&(t=i),e=Zl(e),t=nh({},t,r,Do);var s,o,a=nh({},t.imports,r.imports,Do),u=Eh(a),l=Xn(a,u),h=0,f=t.interpolate||Ze,d="__p += '",p=rt((t.escape||Ze).source+"|"+f.source+"|"+(f===Ne?We:Ze).source+"|"+(t.evaluate||Ze).source+"|$","g"),g="//# sourceURL="+(ht.call(t,"sourceURL")?(t.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++Qt+"]")+"\n";e.replace(p,function(t,n,r,i,a,u){return r||(r=i),d+=e.slice(h,u).replace(et,rr),n&&(s=!0,d+="' +\n__e("+n+") +\n'"),a&&(o=!0,d+="';\n"+a+";\n__p += '"),r&&(d+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),h=u+t.length,t}),d+="';\n";var m=ht.call(t,"variable")&&t.variable;if(m){if(qe.test(m))throw new Fe(c)}else d="with (obj) {\n"+d+"\n}\n";d=(o?d.replace(Ee,""):d).replace(Te,"$1").replace(Ie,"$1;"),d="function("+(m||"obj")+") {\n"+(m?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(s?", __e = _.escape":"")+(o?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+d+"return __p\n}";var v=Tf(function(){return $e(u,g+"return "+d).apply(i,l)});if(v.source=d,_l(v))throw v;return v}function df(e){return Zl(e).toLowerCase()}function pf(e){return Zl(e).toUpperCase()}function gf(e,t,n){if(e=Zl(e),e&&(n||t===i))return Hn(e);if(!e||!(t=xs(t)))return e;var r=mr(e),s=mr(t),o=Jn(r,s),a=Zn(r,s)+1;return Ws(r,o,a).join("")}function mf(e,t,n){if(e=Zl(e),e&&(n||t===i))return e.slice(0,vr(e)+1);if(!e||!(t=xs(t)))return e;var r=mr(e),s=Zn(r,mr(t))+1;return Ws(r,0,s).join("")}function vf(e,t,n){if(e=Zl(e),e&&(n||t===i))return e.replace(Ue,"");if(!e||!(t=xs(t)))return e;var r=mr(e),s=Jn(r,mr(t));return Ws(r,s).join("")}function yf(e,t){var n=k,r=R;if(Il(t)){var s="separator"in t?t.separator:s;n="length"in t?Hl(t.length):n,r="omission"in t?xs(t.omission):r}e=Zl(e);var o=e.length;if(sr(e)){var a=mr(e);o=a.length}if(n>=o)return e;var u=n-gr(r);if(u<1)return r;var c=a?Ws(a,0,u).join(""):e.slice(0,u);if(s===i)return c+r;if(a&&(u+=c.length-u),Ll(s)){if(e.slice(u).search(s)){var l,h=c;s.global||(s=rt(s.source,Zl(Ge.exec(s))+"g")),s.lastIndex=0;while(l=s.exec(h))var f=l.index;c=c.slice(0,f===i?u:f)}}else if(e.indexOf(xs(s),u)!=u){var d=c.lastIndexOf(s);d>-1&&(c=c.slice(0,d))}return c+r}function _f(e){return e=Zl(e),e&&Ae.test(e)?e.replace(Se,yr):e}var wf=po(function(e,t,n){return e+(n?" ":"")+t.toUpperCase()}),bf=fo("toUpperCase");function Ef(e,t,n){return e=Zl(e),t=n?i:t,t===i?or(e)?br(e):Pn(e):e.match(t)||[]}var Tf=ws(function(e,t){try{return _n(e,i,t)}catch(n){return _l(n)?n:new Fe(n)}}),If=Fo(function(e,t){return bn(t,function(t){t=Na(t),pi(e,t,Dc(e[t],e))}),e});function Sf(e){var t=null==e?0:e.length,n=Ko();return e=t?An(e,function(e){if("function"!=typeof e[1])throw new st(u);return[n(e[0]),e[1]]}):[],ws(function(n){var r=-1;while(++r<t){var i=e[r];if(_n(i[0],this,n))return _n(i[1],this,n)}})}function Cf(e){return yi(vi(e,d))}function Af(e){return function(){return e}}function kf(e,t){return null==e||e!==e?t:e}var Rf=yo(),Of=yo(!0);function Nf(e){return e}function Df(e){return ts("function"==typeof e?e:vi(e,d))}function xf(e){return os(vi(e,d))}function Pf(e,t){return as(e,vi(t,d))}var Lf=ws(function(e,t){return function(n){return qi(n,e,t)}}),Mf=ws(function(e,t){return function(n){return qi(e,n,t)}});function Uf(e,t,n){var r=Eh(t),i=xi(t,r);null!=n||Il(t)&&(i.length||!r.length)||(n=t,t=e,e=this,i=xi(t,Eh(t)));var s=!(Il(n)&&"chain"in n)||!!n.chain,o=bl(e);return bn(i,function(n){var r=t[n];e[n]=r,o&&(e.prototype[n]=function(){var t=this.__chain__;if(s||t){var n=e(this.__wrapped__),i=n.__actions__=ro(this.__actions__);return i.push({func:r,args:arguments,thisArg:e}),n.__chain__=t,n}return r.apply(e,kn([this.value()],arguments))})}),e}function Ff(){return an._===this&&(an._=mt),this}function Vf(){}function jf(e){return e=Hl(e),ws(function(t){return ls(t,e)})}var Bf=Eo(An),$f=Eo(Tn),qf=Eo(Nn);function Kf(e){return ua(e)?Bn(Na(e)):ps(e)}function Wf(e){return function(t){return null==e?i:Pi(e,t)}}var Gf=So(),zf=So(!0);function Hf(){return[]}function Qf(){return!1}function Xf(){return{}}function Yf(){return""}function Jf(){return!0}function Zf(e,t){if(e=Hl(e),e<1||e>M)return[];var n=V,r=Bt(e,V);t=Ko(t),e-=V;var i=Gn(r,t);while(++n<e)t(n);return i}function ed(e){return ul(e)?An(e,Na):Vl(e)?[e]:ro(Oa(Zl(e)))}function td(e){var t=++ft;return Zl(e)+t}var nd=bo(function(e,t){return e+t},0),rd=ko("ceil"),id=bo(function(e,t){return e/t},1),sd=ko("floor");function od(e){return e&&e.length?Si(e,Nf,Ui):i}function ad(e,t){return e&&e.length?Si(e,Ko(t,2),Ui):i}function ud(e){return jn(e,Nf)}function cd(e,t){return jn(e,Ko(t,2))}function ld(e){return e&&e.length?Si(e,Nf,is):i}function hd(e,t){return e&&e.length?Si(e,Ko(t,2),is):i}var fd=bo(function(e,t){return e*t},1),dd=ko("round"),pd=bo(function(e,t){return e-t},0);function gd(e){return e&&e.length?Wn(e,Nf):0}function md(e,t){return e&&e.length?Wn(e,Ko(t,2)):0}return Er.after=Rc,Er.ary=Oc,Er.assign=eh,Er.assignIn=th,Er.assignInWith=nh,Er.assignWith=rh,Er.at=ih,Er.before=Nc,Er.bind=Dc,Er.bindAll=If,Er.bindKey=xc,Er.castArray=Jc,Er.chain=Wu,Er.chunk=La,Er.compact=Ma,Er.concat=Ua,Er.cond=Sf,Er.conforms=Cf,Er.constant=Af,Er.countBy=nc,Er.create=sh,Er.curry=Pc,Er.curryRight=Lc,Er.debounce=Mc,Er.defaults=oh,Er.defaultsDeep=ah,Er.defer=Uc,Er.delay=Fc,Er.difference=Fa,Er.differenceBy=Va,Er.differenceWith=ja,Er.drop=Ba,Er.dropRight=$a,Er.dropRightWhile=qa,Er.dropWhile=Ka,Er.fill=Wa,Er.filter=ic,Er.flatMap=ac,Er.flatMapDeep=uc,Er.flatMapDepth=cc,Er.flatten=Ha,Er.flattenDeep=Qa,Er.flattenDepth=Xa,Er.flip=Vc,Er.flow=Rf,Er.flowRight=Of,Er.fromPairs=Ya,Er.functions=ph,Er.functionsIn=gh,Er.groupBy=fc,Er.initial=eu,Er.intersection=tu,Er.intersectionBy=nu,Er.intersectionWith=ru,Er.invert=_h,Er.invertBy=wh,Er.invokeMap=pc,Er.iteratee=Df,Er.keyBy=gc,Er.keys=Eh,Er.keysIn=Th,Er.map=mc,Er.mapKeys=Ih,Er.mapValues=Sh,Er.matches=xf,Er.matchesProperty=Pf,Er.memoize=jc,Er.merge=Ch,Er.mergeWith=Ah,Er.method=Lf,Er.methodOf=Mf,Er.mixin=Uf,Er.negate=Bc,Er.nthArg=jf,Er.omit=kh,Er.omitBy=Rh,Er.once=$c,Er.orderBy=vc,Er.over=Bf,Er.overArgs=qc,Er.overEvery=$f,Er.overSome=qf,Er.partial=Kc,Er.partialRight=Wc,Er.partition=yc,Er.pick=Oh,Er.pickBy=Nh,Er.property=Kf,Er.propertyOf=Wf,Er.pull=uu,Er.pullAll=cu,Er.pullAllBy=lu,Er.pullAllWith=hu,Er.pullAt=fu,Er.range=Gf,Er.rangeRight=zf,Er.rearg=Gc,Er.reject=bc,Er.remove=du,Er.rest=zc,Er.reverse=pu,Er.sampleSize=Tc,Er.set=xh,Er.setWith=Ph,Er.shuffle=Ic,Er.slice=gu,Er.sortBy=Ac,Er.sortedUniq=Eu,Er.sortedUniqBy=Tu,Er.split=cf,Er.spread=Hc,Er.tail=Iu,Er.take=Su,Er.takeRight=Cu,Er.takeRightWhile=Au,Er.takeWhile=ku,Er.tap=Gu,Er.throttle=Qc,Er.thru=zu,Er.toArray=Gl,Er.toPairs=Lh,Er.toPairsIn=Mh,Er.toPath=ed,Er.toPlainObject=Yl,Er.transform=Uh,Er.unary=Xc,Er.union=Ru,Er.unionBy=Ou,Er.unionWith=Nu,Er.uniq=Du,Er.uniqBy=xu,Er.uniqWith=Pu,Er.unset=Fh,Er.unzip=Lu,Er.unzipWith=Mu,Er.update=Vh,Er.updateWith=jh,Er.values=Bh,Er.valuesIn=$h,Er.without=Uu,Er.words=Ef,Er.wrap=Yc,Er.xor=Fu,Er.xorBy=Vu,Er.xorWith=ju,Er.zip=Bu,Er.zipObject=$u,Er.zipObjectDeep=qu,Er.zipWith=Ku,Er.entries=Lh,Er.entriesIn=Mh,Er.extend=th,Er.extendWith=nh,Uf(Er,Er),Er.add=nd,Er.attempt=Tf,Er.camelCase=Gh,Er.capitalize=zh,Er.ceil=rd,Er.clamp=qh,Er.clone=Zc,Er.cloneDeep=tl,Er.cloneDeepWith=nl,Er.cloneWith=el,Er.conformsTo=rl,Er.deburr=Hh,Er.defaultTo=kf,Er.divide=id,Er.endsWith=Qh,Er.eq=il,Er.escape=Xh,Er.escapeRegExp=Yh,Er.every=rc,Er.find=sc,Er.findIndex=Ga,Er.findKey=uh,Er.findLast=oc,Er.findLastIndex=za,Er.findLastKey=ch,Er.floor=sd,Er.forEach=lc,Er.forEachRight=hc,Er.forIn=lh,Er.forInRight=hh,Er.forOwn=fh,Er.forOwnRight=dh,Er.get=mh,Er.gt=sl,Er.gte=ol,Er.has=vh,Er.hasIn=yh,Er.head=Ja,Er.identity=Nf,Er.includes=dc,Er.indexOf=Za,Er.inRange=Kh,Er.invoke=bh,Er.isArguments=al,Er.isArray=ul,Er.isArrayBuffer=cl,Er.isArrayLike=ll,Er.isArrayLikeObject=hl,Er.isBoolean=fl,Er.isBuffer=dl,Er.isDate=pl,Er.isElement=gl,Er.isEmpty=ml,Er.isEqual=vl,Er.isEqualWith=yl,Er.isError=_l,Er.isFinite=wl,Er.isFunction=bl,Er.isInteger=El,Er.isLength=Tl,Er.isMap=Cl,Er.isMatch=Al,Er.isMatchWith=kl,Er.isNaN=Rl,Er.isNative=Ol,Er.isNil=Dl,Er.isNull=Nl,Er.isNumber=xl,Er.isObject=Il,Er.isObjectLike=Sl,Er.isPlainObject=Pl,Er.isRegExp=Ll,Er.isSafeInteger=Ml,Er.isSet=Ul,Er.isString=Fl,Er.isSymbol=Vl,Er.isTypedArray=jl,Er.isUndefined=Bl,Er.isWeakMap=$l,Er.isWeakSet=ql,Er.join=iu,Er.kebabCase=Jh,Er.last=su,Er.lastIndexOf=ou,Er.lowerCase=Zh,Er.lowerFirst=ef,Er.lt=Kl,Er.lte=Wl,Er.max=od,Er.maxBy=ad,Er.mean=ud,Er.meanBy=cd,Er.min=ld,Er.minBy=hd,Er.stubArray=Hf,Er.stubFalse=Qf,Er.stubObject=Xf,Er.stubString=Yf,Er.stubTrue=Jf,Er.multiply=fd,Er.nth=au,Er.noConflict=Ff,Er.noop=Vf,Er.now=kc,Er.pad=tf,Er.padEnd=nf,Er.padStart=rf,Er.parseInt=sf,Er.random=Wh,Er.reduce=_c,Er.reduceRight=wc,Er.repeat=of,Er.replace=af,Er.result=Dh,Er.round=dd,Er.runInContext=e,Er.sample=Ec,Er.size=Sc,Er.snakeCase=uf,Er.some=Cc,Er.sortedIndex=mu,Er.sortedIndexBy=vu,Er.sortedIndexOf=yu,Er.sortedLastIndex=_u,Er.sortedLastIndexBy=wu,Er.sortedLastIndexOf=bu,Er.startCase=lf,Er.startsWith=hf,Er.subtract=pd,Er.sum=gd,Er.sumBy=md,Er.template=ff,Er.times=Zf,Er.toFinite=zl,Er.toInteger=Hl,Er.toLength=Ql,Er.toLower=df,Er.toNumber=Xl,Er.toSafeInteger=Jl,Er.toString=Zl,Er.toUpper=pf,Er.trim=gf,Er.trimEnd=mf,Er.trimStart=vf,Er.truncate=yf,Er.unescape=_f,Er.uniqueId=td,Er.upperCase=wf,Er.upperFirst=bf,Er.each=lc,Er.eachRight=hc,Er.first=Ja,Uf(Er,function(){var e={};return Ni(Er,function(t,n){ht.call(Er.prototype,n)||(e[n]=t)}),e}(),{chain:!1}),Er.VERSION=s,bn(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){Er[e].placeholder=Er}),bn(["drop","take"],function(e,t){Ar.prototype[e]=function(n){n=n===i?1:jt(Hl(n),0);var r=this.__filtered__&&!t?new Ar(this):this.clone();return r.__filtered__?r.__takeCount__=Bt(n,r.__takeCount__):r.__views__.push({size:Bt(n,V),type:e+(r.__dir__<0?"Right":"")}),r},Ar.prototype[e+"Right"]=function(t){return this.reverse()[e](t).reverse()}}),bn(["filter","map","takeWhile"],function(e,t){var n=t+1,r=n==D||n==P;Ar.prototype[e]=function(e){var t=this.clone();return t.__iteratees__.push({iteratee:Ko(e,3),type:n}),t.__filtered__=t.__filtered__||r,t}}),bn(["head","last"],function(e,t){var n="take"+(t?"Right":"");Ar.prototype[e]=function(){return this[n](1).value()[0]}}),bn(["initial","tail"],function(e,t){var n="drop"+(t?"":"Right");Ar.prototype[e]=function(){return this.__filtered__?new Ar(this):this[n](1)}}),Ar.prototype.compact=function(){return this.filter(Nf)},Ar.prototype.find=function(e){return this.filter(e).head()},Ar.prototype.findLast=function(e){return this.reverse().find(e)},Ar.prototype.invokeMap=ws(function(e,t){return"function"==typeof e?new Ar(this):this.map(function(n){return qi(n,e,t)})}),Ar.prototype.reject=function(e){return this.filter(Bc(Ko(e)))},Ar.prototype.slice=function(e,t){e=Hl(e);var n=this;return n.__filtered__&&(e>0||t<0)?new Ar(n):(e<0?n=n.takeRight(-e):e&&(n=n.drop(e)),t!==i&&(t=Hl(t),n=t<0?n.dropRight(-t):n.take(t-e)),n)},Ar.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},Ar.prototype.toArray=function(){return this.take(V)},Ni(Ar.prototype,function(e,t){var n=/^(?:filter|find|map|reject)|While$/.test(t),r=/^(?:head|last)$/.test(t),s=Er[r?"take"+("last"==t?"Right":""):t],o=r||/^find/.test(t);s&&(Er.prototype[t]=function(){var t=this.__wrapped__,a=r?[1]:arguments,u=t instanceof Ar,c=a[0],l=u||ul(t),h=function(e){var t=s.apply(Er,kn([e],a));return r&&f?t[0]:t};l&&n&&"function"==typeof c&&1!=c.length&&(u=l=!1);var f=this.__chain__,d=!!this.__actions__.length,p=o&&!f,g=u&&!d;if(!o&&l){t=g?t:new Ar(this);var m=e.apply(t,a);return m.__actions__.push({func:zu,args:[h],thisArg:i}),new Cr(m,f)}return p&&g?e.apply(this,a):(m=this.thru(h),p?r?m.value()[0]:m.value():m)})}),bn(["pop","push","shift","sort","splice","unshift"],function(e){var t=ot[e],n=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",r=/^(?:pop|shift)$/.test(e);Er.prototype[e]=function(){var e=arguments;if(r&&!this.__chain__){var i=this.value();return t.apply(ul(i)?i:[],e)}return this[n](function(n){return t.apply(ul(n)?n:[],e)})}}),Ni(Ar.prototype,function(e,t){var n=Er[t];if(n){var r=n.name+"";ht.call(cn,r)||(cn[r]=[]),cn[r].push({name:t,func:n})}}),cn[_o(i,_).name]=[{name:"wrapper",func:i}],Ar.prototype.clone=kr,Ar.prototype.reverse=Rr,Ar.prototype.value=Or,Er.prototype.at=Hu,Er.prototype.chain=Qu,Er.prototype.commit=Xu,Er.prototype.next=Yu,Er.prototype.plant=Zu,Er.prototype.reverse=ec,Er.prototype.toJSON=Er.prototype.valueOf=Er.prototype.value=tc,Er.prototype.first=Er.prototype.head,At&&(Er.prototype[At]=Ju),Er},Tr=Er();an._=Tr,r=function(){return Tr}.call(t,n,t,e),r===i||(e.exports=r)}.call(this)},605:function(e,t,n){"use strict";n.d(t,{O5:function(){return s},XX:function(){return a},cJ:function(){return h},mK:function(){return o}});var r=n(641),i=n(388),s=(e=>(e[e.None=0]="None",e[e.RenderStrategy=1]="RenderStrategy",e[e.Static=2]="Static",e))(s||{}),o=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(o||{});function a({visible:e=!0,features:t=0,ourProps:n,theirProps:r,...s}){var o;let a=l(r,n),c=Object.assign(s,{props:a});if(e||2&t&&a.static)return u(c);if(1&t){let e=null==(o=a.unmount)||o?0:1;return(0,i.Y)(e,{[0](){return null},[1](){return u({...s,props:{...a,hidden:!0,style:{display:"none"}}})}})}return u(c)}function u({props:e,attrs:t,slots:n,slot:i,name:s}){var o,a;let{as:u,...d}=h(e,["unmount","static"]),p=null==(o=n.default)?void 0:o.call(n,i),g={};if(i){let e=!1,t=[];for(let[n,r]of Object.entries(i))"boolean"==typeof r&&(e=!0),!0===r&&t.push(n);e&&(g["data-headlessui-state"]=t.join(" "))}if("template"===u){if(p=c(null!=p?p:[]),Object.keys(d).length>0||Object.keys(t).length>0){let[e,...n]=null!=p?p:[];if(!f(e)||n.length>0)throw new Error(['Passing props on "template"!',"",`The current component <${s} /> is rendering a "template".`,"However we need to passthrough the following props:",Object.keys(d).concat(Object.keys(t)).map(e=>e.trim()).filter((e,t,n)=>n.indexOf(e)===t).sort((e,t)=>e.localeCompare(t)).map(e=>`  - ${e}`).join("\n"),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".',"Render a single element as the child so that we can forward the props onto that element."].map(e=>`  - ${e}`).join("\n")].join("\n"));let i=l(null!=(a=e.props)?a:{},d,g),o=(0,r.E3)(e,i,!0);for(let t in i)t.startsWith("on")&&(o.props||(o.props={}),o.props[t]=i[t]);return o}return Array.isArray(p)&&1===p.length?p[0]:p}return(0,r.h)(u,Object.assign({},d,g),{default:()=>p})}function c(e){return e.flatMap(e=>e.type===r.FK?c(e.children):[e])}function l(...e){if(0===e.length)return{};if(1===e.length)return e[0];let t={},n={};for(let r of e)for(let e in r)e.startsWith("on")&&"function"==typeof r[e]?(null!=n[e]||(n[e]=[]),n[e].push(r[e])):t[e]=r[e];if(t.disabled||t["aria-disabled"])return Object.assign(t,Object.fromEntries(Object.keys(n).map(e=>[e,void 0])));for(let r in n)Object.assign(t,{[r](e,...t){let i=n[r];for(let n of i){if(e instanceof Event&&e.defaultPrevented)return;n(e,...t)}}});return t}function h(e,t=[]){let n=Object.assign({},e);for(let r of t)r in n&&delete n[r];return n}function f(e){return null!=e&&("string"==typeof e.type||"object"==typeof e.type||"function"==typeof e.type)}},641:function(e,t,n){"use strict";n.d(t,{$u:function(){return _e},Bi:function(){return ee},CE:function(){return hn},Df:function(){return J},E3:function(){return bn},EW:function(){return Jn},FK:function(){return Zt},Fv:function(){return Tn},Gt:function(){return nt},Gy:function(){return G},Im:function(){return B},K9:function(){return $t},Lk:function(){return vn},MZ:function(){return Y},OW:function(){return X},Q3:function(){return In},QP:function(){return H},WQ:function(){return rt},Wv:function(){return fn},bF:function(){return yn},bo:function(){return R},dY:function(){return m},eW:function(){return En},g2:function(){return Ae},h:function(){return Zn},hi:function(){return be},k6:function(){return k},nI:function(){return Pn},nT:function(){return ot},pI:function(){return Ne},pM:function(){return Z},qL:function(){return o},sV:function(){return ve},uX:function(){return on},wB:function(){return at}});var r=n(953),i=n(33);function s(e,t,n,r){try{return r?e(...r):e()}catch(i){a(i,t,n)}}function o(e,t,n,r){if((0,i.Tn)(e)){const o=s(e,t,n,r);return o&&(0,i.yL)(o)&&o.catch(e=>{a(e,t,n)}),o}if((0,i.cy)(e)){const i=[];for(let s=0;s<e.length;s++)i.push(o(e[s],t,n,r));return i}}function a(e,t,n,o=!0){const a=t?t.vnode:null,{errorHandler:c,throwUnhandledErrorInProduction:l}=t&&t.appContext.config||i.MZ;if(t){let i=t.parent;const o=t.proxy,a=`https://vuejs.org/error-reference/#runtime-${n}`;while(i){const t=i.ec;if(t)for(let n=0;n<t.length;n++)if(!1===t[n](e,o,a))return;i=i.parent}if(c)return(0,r.C4)(),s(c,null,10,[e,o,a]),void(0,r.bl)()}u(e,n,a,o,l)}function u(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}const c=[];let l=-1;const h=[];let f=null,d=0;const p=Promise.resolve();let g=null;function m(e){const t=g||p;return e?t.then(this?e.bind(this):e):t}function v(e){let t=l+1,n=c.length;while(t<n){const r=t+n>>>1,i=c[r],s=T(i);s<e||s===e&&2&i.flags?t=r+1:n=r}return t}function y(e){if(!(1&e.flags)){const t=T(e),n=c[c.length-1];!n||!(2&e.flags)&&t>=T(n)?c.push(e):c.splice(v(t),0,e),e.flags|=1,_()}}function _(){g||(g=p.then(I))}function w(e){(0,i.cy)(e)?h.push(...e):f&&-1===e.id?f.splice(d+1,0,e):1&e.flags||(h.push(e),e.flags|=1),_()}function b(e,t,n=l+1){for(0;n<c.length;n++){const t=c[n];if(t&&2&t.flags){if(e&&t.id!==e.uid)continue;0,c.splice(n,1),n--,4&t.flags&&(t.flags&=-2),t(),4&t.flags||(t.flags&=-2)}}}function E(e){if(h.length){const e=[...new Set(h)].sort((e,t)=>T(e)-T(t));if(h.length=0,f)return void f.push(...e);for(f=e,d=0;d<f.length;d++){const e=f[d];0,4&e.flags&&(e.flags&=-2),8&e.flags||e(),e.flags&=-2}f=null,d=0}}const T=e=>null==e.id?2&e.flags?-1:1/0:e.id;function I(e){i.tE;try{for(l=0;l<c.length;l++){const e=c[l];!e||8&e.flags||(4&e.flags&&(e.flags&=-2),s(e,e.i,e.i?15:14),4&e.flags||(e.flags&=-2))}}finally{for(;l<c.length;l++){const e=c[l];e&&(e.flags&=-2)}l=-1,c.length=0,E(e),g=null,(c.length||h.length)&&I(e)}}let S=null,C=null;function A(e){const t=S;return S=e,C=e&&e.type.__scopeId||null,t}function k(e,t=S,n){if(!t)return e;if(e._n)return e;const r=(...n)=>{r._d&&cn(-1);const i=A(t);let s;try{s=e(...n)}finally{A(i),r._d&&cn(1)}return s};return r._n=!0,r._c=!0,r._d=!0,r}function R(e,t){if(null===S)return e;const n=Qn(S),s=e.dirs||(e.dirs=[]);for(let o=0;o<t.length;o++){let[e,a,u,c=i.MZ]=t[o];e&&((0,i.Tn)(e)&&(e={mounted:e,updated:e}),e.deep&&(0,r.hV)(a),s.push({dir:e,instance:n,value:a,oldValue:void 0,arg:u,modifiers:c}))}return e}function O(e,t,n,i){const s=e.dirs,a=t&&t.dirs;for(let u=0;u<s.length;u++){const c=s[u];a&&(c.oldValue=a[u].value);let l=c.dir[i];l&&((0,r.C4)(),o(l,n,8,[e.el,c,e,t]),(0,r.bl)())}}const N=Symbol("_vte"),D=e=>e.__isTeleport,x=e=>e&&(e.disabled||""===e.disabled),P=e=>e&&(e.defer||""===e.defer),L=e=>"undefined"!==typeof SVGElement&&e instanceof SVGElement,M=e=>"function"===typeof MathMLElement&&e instanceof MathMLElement,U=(e,t)=>{const n=e&&e.to;if((0,i.Kg)(n)){if(t){const e=t(n);return e}return null}return n},F={name:"Teleport",__isTeleport:!0,process(e,t,n,r,i,s,o,a,u,c){const{mc:l,pc:h,pbc:f,o:{insert:d,querySelector:p,createText:g,createComment:m}}=c,v=x(t.props);let{shapeFlag:y,children:_,dynamicChildren:w}=t;if(null==e){const e=t.el=g(""),c=t.anchor=g("");d(e,n,r),d(c,n,r);const h=(e,t)=>{16&y&&l(_,e,t,i,s,o,a,u)},f=()=>{const e=t.target=U(t.props,p),n=q(e,t,g,d);e&&("svg"!==o&&L(e)?o="svg":"mathml"!==o&&M(e)&&(o="mathml"),i&&i.isCE&&(i.ce._teleportTargets||(i.ce._teleportTargets=new Set)).add(e),v||(h(e,n),$(t,!1)))};v&&(h(n,c),$(t,!0)),P(t.props)?(t.el.__isMounted=!1,Bt(()=>{f(),delete t.el.__isMounted},s)):f()}else{if(P(t.props)&&!1===e.el.__isMounted)return void Bt(()=>{F.process(e,t,n,r,i,s,o,a,u,c)},s);t.el=e.el,t.targetStart=e.targetStart;const l=t.anchor=e.anchor,d=t.target=e.target,g=t.targetAnchor=e.targetAnchor,m=x(e.props),y=m?n:d,_=m?l:g;if("svg"===o||L(d)?o="svg":("mathml"===o||M(d))&&(o="mathml"),w?(f(e.dynamicChildren,w,y,i,s,o,a),zt(e,t,!0)):u||h(e,t,y,_,i,s,o,a,!1),v)m?t.props&&e.props&&t.props.to!==e.props.to&&(t.props.to=e.props.to):V(t,n,l,c,1);else if((t.props&&t.props.to)!==(e.props&&e.props.to)){const e=t.target=U(t.props,p);e&&V(t,e,null,c,0)}else m&&V(t,d,g,c,1);$(t,v)}},remove(e,t,n,{um:r,o:{remove:i}},s){const{shapeFlag:o,children:a,anchor:u,targetStart:c,targetAnchor:l,target:h,props:f}=e;if(h&&(i(c),i(l)),s&&i(u),16&o){const e=s||!x(f);for(let i=0;i<a.length;i++){const s=a[i];r(s,t,n,e,!!s.dynamicChildren)}}},move:V,hydrate:j};function V(e,t,n,{o:{insert:r},m:i},s=2){0===s&&r(e.targetAnchor,t,n);const{el:o,anchor:a,shapeFlag:u,children:c,props:l}=e,h=2===s;if(h&&r(o,t,n),(!h||x(l))&&16&u)for(let f=0;f<c.length;f++)i(c[f],t,n,2);h&&r(a,t,n)}function j(e,t,n,r,i,s,{o:{nextSibling:o,parentNode:a,querySelector:u,insert:c,createText:l}},h){function f(e,t,u,c){t.anchor=h(o(e),t,a(e),n,r,i,s),t.targetStart=u,t.targetAnchor=c}const d=t.target=U(t.props,u),p=x(t.props);if(d){const a=d._lpa||d.firstChild;if(16&t.shapeFlag)if(p)f(e,t,a,a&&o(a));else{t.anchor=o(e);let u=a;while(u){if(u&&8===u.nodeType)if("teleport start anchor"===u.data)t.targetStart=u;else if("teleport anchor"===u.data){t.targetAnchor=u,d._lpa=t.targetAnchor&&o(t.targetAnchor);break}u=o(u)}t.targetAnchor||q(d,t,l,c),h(a&&o(a),t,d,n,r,i,s)}$(t,p)}else p&&16&t.shapeFlag&&f(e,t,e,o(e));return t.anchor&&o(t.anchor)}const B=F;function $(e,t){const n=e.ctx;if(n&&n.ut){let r,i;t?(r=e.el,i=e.anchor):(r=e.targetStart,i=e.targetAnchor);while(r&&r!==i)1===r.nodeType&&r.setAttribute("data-v-owner",n.uid),r=r.nextSibling;n.ut()}}function q(e,t,n,r){const i=t.targetStart=n(""),s=t.targetAnchor=n("");return i[N]=s,e&&(r(i,e),r(s,e)),s}const K=Symbol("_leaveCb"),W=Symbol("_enterCb");function G(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return ve(()=>{e.isMounted=!0}),we(()=>{e.isUnmounting=!0}),e}const z=[Function,Array],H={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:z,onEnter:z,onAfterEnter:z,onEnterCancelled:z,onBeforeLeave:z,onLeave:z,onAfterLeave:z,onLeaveCancelled:z,onBeforeAppear:z,onAppear:z,onAfterAppear:z,onAppearCancelled:z};function Q(e,t){const{leavingVNodes:n}=e;let r=n.get(t.type);return r||(r=Object.create(null),n.set(t.type,r)),r}function X(e,t,n,r,s){const{appear:a,mode:u,persisted:c=!1,onBeforeEnter:l,onEnter:h,onAfterEnter:f,onEnterCancelled:d,onBeforeLeave:p,onLeave:g,onAfterLeave:m,onLeaveCancelled:v,onBeforeAppear:y,onAppear:_,onAfterAppear:w,onAppearCancelled:b}=t,E=String(e.key),T=Q(n,e),I=(e,t)=>{e&&o(e,r,9,t)},S=(e,t)=>{const n=t[1];I(e,t),(0,i.cy)(e)?e.every(e=>e.length<=1)&&n():e.length<=1&&n()},C={mode:u,persisted:c,beforeEnter(t){let r=l;if(!n.isMounted){if(!a)return;r=y||l}t[K]&&t[K](!0);const i=T[E];i&&pn(e,i)&&i.el[K]&&i.el[K](),I(r,[t])},enter(e){let t=h,r=f,i=d;if(!n.isMounted){if(!a)return;t=_||h,r=w||f,i=b||d}let s=!1;const o=e[W]=t=>{s||(s=!0,I(t?i:r,[e]),C.delayedLeave&&C.delayedLeave(),e[W]=void 0)};t?S(t,[e,o]):o()},leave(t,r){const i=String(e.key);if(t[W]&&t[W](!0),n.isUnmounting)return r();I(p,[t]);let s=!1;const o=t[K]=n=>{s||(s=!0,r(),I(n?v:m,[t]),t[K]=void 0,T[i]===e&&delete T[i])};T[i]=e,g?S(g,[t,o]):o()},clone(e){const i=X(e,t,n,r,s);return s&&s(i),i}};return C}function Y(e,t){6&e.shapeFlag&&e.component?(e.transition=t,Y(e.component.subTree,t)):128&e.shapeFlag?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function J(e,t=!1,n){let r=[],i=0;for(let s=0;s<e.length;s++){let o=e[s];const a=null==n?o.key:String(n)+String(null!=o.key?o.key:s);o.type===Zt?(128&o.patchFlag&&i++,r=r.concat(J(o.children,t,a))):(t||o.type!==tn)&&r.push(null!=a?bn(o,{key:a}):o)}if(i>1)for(let s=0;s<r.length;s++)r[s].patchFlag=-2;return r}function Z(e,t){return(0,i.Tn)(e)?(()=>(0,i.X$)({name:e.name},t,{setup:e}))():e}function ee(){const e=Pn();return e?(e.appContext.config.idPrefix||"v")+"-"+e.ids[0]+e.ids[1]++:""}function te(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}const ne=new WeakMap;function re(e,t,n,o,a=!1){if((0,i.cy)(e))return void e.forEach((e,r)=>re(e,t&&((0,i.cy)(t)?t[r]:t),n,o,a));if(se(o)&&!a)return void(512&o.shapeFlag&&o.type.__asyncResolved&&o.component.subTree.component&&re(e,t,n,o.component.subTree));const u=4&o.shapeFlag?Qn(o.component):o.el,c=a?null:u,{i:l,r:h}=e;const f=t&&t.r,d=l.refs===i.MZ?l.refs={}:l.refs,p=l.setupState,g=(0,r.ux)(p),m=p===i.MZ?i.NO:e=>(0,i.$3)(g,e),v=e=>!0;if(null!=f&&f!==h)if(ie(t),(0,i.Kg)(f))d[f]=null,m(f)&&(p[f]=null);else if((0,r.i9)(f)){v(f)&&(f.value=null);const e=t;e.k&&(d[e.k]=null)}if((0,i.Tn)(h))s(h,l,12,[c,d]);else{const t=(0,i.Kg)(h),s=(0,r.i9)(h);if(t||s){const r=()=>{if(e.f){const n=t?m(h)?p[h]:d[h]:v(h)||!e.k?h.value:d[e.k];if(a)(0,i.cy)(n)&&(0,i.TF)(n,u);else if((0,i.cy)(n))n.includes(u)||n.push(u);else if(t)d[h]=[u],m(h)&&(p[h]=d[h]);else{const t=[u];v(h)&&(h.value=t),e.k&&(d[e.k]=t)}}else t?(d[h]=c,m(h)&&(p[h]=c)):s&&(v(h)&&(h.value=c),e.k&&(d[e.k]=c))};if(c){const t=()=>{r(),ne.delete(e)};t.id=-1,ne.set(e,t),Bt(t,n)}else ie(e),r()}else 0}}function ie(e){const t=ne.get(e);t&&(t.flags|=8,ne.delete(e))}(0,i.We)().requestIdleCallback,(0,i.We)().cancelIdleCallback;const se=e=>!!e.type.__asyncLoader;const oe=e=>e.type.__isKeepAlive;RegExp,RegExp;function ae(e,t){return(0,i.cy)(e)?e.some(e=>ae(e,t)):(0,i.Kg)(e)?e.split(",").includes(t):!!(0,i.gd)(e)&&(e.lastIndex=0,e.test(t))}function ue(e,t){le(e,"a",t)}function ce(e,t){le(e,"da",t)}function le(e,t,n=xn){const r=e.__wdc||(e.__wdc=()=>{let t=n;while(t){if(t.isDeactivated)return;t=t.parent}return e()});if(pe(t,r,n),n){let e=n.parent;while(e&&e.parent)oe(e.parent.vnode)&&he(r,t,n,e),e=e.parent}}function he(e,t,n,r){const s=pe(t,e,r,!0);be(()=>{(0,i.TF)(r[t],s)},n)}function fe(e){e.shapeFlag&=-257,e.shapeFlag&=-513}function de(e){return 128&e.shapeFlag?e.ssContent:e}function pe(e,t,n=xn,i=!1){if(n){const s=n[e]||(n[e]=[]),a=t.__weh||(t.__weh=(...i)=>{(0,r.C4)();const s=Un(n),a=o(t,n,e,i);return s(),(0,r.bl)(),a});return i?s.unshift(a):s.push(a),a}}const ge=e=>(t,n=xn)=>{$n&&"sp"!==e||pe(e,(...e)=>t(...e),n)},me=ge("bm"),ve=ge("m"),ye=ge("bu"),_e=ge("u"),we=ge("bum"),be=ge("um"),Ee=ge("sp"),Te=ge("rtg"),Ie=ge("rtc");function Se(e,t=xn){pe("ec",e,t)}const Ce="components";function Ae(e,t){return Re(Ce,e,!0,t)||e}const ke=Symbol.for("v-ndc");function Re(e,t,n=!0,r=!1){const s=S||xn;if(s){const n=s.type;if(e===Ce){const e=Xn(n,!1);if(e&&(e===t||e===(0,i.PT)(t)||e===(0,i.ZH)((0,i.PT)(t))))return n}const o=Oe(s[e]||n[e],t)||Oe(s.appContext[e],t);return!o&&r?n:o}}function Oe(e,t){return e&&(e[t]||e[(0,i.PT)(t)]||e[(0,i.ZH)((0,i.PT)(t))])}function Ne(e,t,n,s){let o;const a=n&&n[s],u=(0,i.cy)(e);if(u||(0,i.Kg)(e)){const n=u&&(0,r.g8)(e);let i=!1,s=!1;n&&(i=!(0,r.fE)(e),s=(0,r.Tm)(e),e=(0,r.qA)(e)),o=new Array(e.length);for(let u=0,c=e.length;u<c;u++)o[u]=t(i?s?(0,r.a1)((0,r.lJ)(e[u])):(0,r.lJ)(e[u]):e[u],u,void 0,a&&a[u])}else if("number"===typeof e){0,o=new Array(e);for(let n=0;n<e;n++)o[n]=t(n+1,n,void 0,a&&a[n])}else if((0,i.Gv)(e))if(e[Symbol.iterator])o=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{const n=Object.keys(e);o=new Array(n.length);for(let r=0,i=n.length;r<i;r++){const i=n[r];o[r]=t(e[i],i,r,a&&a[r])}}else o=[];return n&&(n[s]=o),o}const De=e=>e?Vn(e)?Qn(e):De(e.parent):null,xe=(0,i.X$)(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>De(e.parent),$root:e=>De(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>$e(e),$forceUpdate:e=>e.f||(e.f=()=>{y(e.update)}),$nextTick:e=>e.n||(e.n=m.bind(e.proxy)),$watch:e=>ct.bind(e)}),Pe=(e,t)=>e!==i.MZ&&!e.__isScriptSetup&&(0,i.$3)(e,t),Le={get({_:e},t){if("__v_skip"===t)return!0;const{ctx:n,setupState:s,data:o,props:a,accessCache:u,type:c,appContext:l}=e;if("$"!==t[0]){const e=u[t];if(void 0!==e)switch(e){case 1:return s[t];case 2:return o[t];case 4:return n[t];case 3:return a[t]}else{if(Pe(s,t))return u[t]=1,s[t];if(o!==i.MZ&&(0,i.$3)(o,t))return u[t]=2,o[t];if((0,i.$3)(a,t))return u[t]=3,a[t];if(n!==i.MZ&&(0,i.$3)(n,t))return u[t]=4,n[t];Ue&&(u[t]=0)}}const h=xe[t];let f,d;return h?("$attrs"===t&&(0,r.u4)(e.attrs,"get",""),h(e)):(f=c.__cssModules)&&(f=f[t])?f:n!==i.MZ&&(0,i.$3)(n,t)?(u[t]=4,n[t]):(d=l.config.globalProperties,(0,i.$3)(d,t)?d[t]:void 0)},set({_:e},t,n){const{data:r,setupState:s,ctx:o}=e;return Pe(s,t)?(s[t]=n,!0):r!==i.MZ&&(0,i.$3)(r,t)?(r[t]=n,!0):!(0,i.$3)(e.props,t)&&(("$"!==t[0]||!(t.slice(1)in e))&&(o[t]=n,!0))},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:s,props:o,type:a}},u){let c;return!!(n[u]||e!==i.MZ&&"$"!==u[0]&&(0,i.$3)(e,u)||Pe(t,u)||(0,i.$3)(o,u)||(0,i.$3)(r,u)||(0,i.$3)(xe,u)||(0,i.$3)(s.config.globalProperties,u)||(c=a.__cssModules)&&c[u])},defineProperty(e,t,n){return null!=n.get?e._.accessCache[t]=0:(0,i.$3)(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function Me(e){return(0,i.cy)(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}let Ue=!0;function Fe(e){const t=$e(e),n=e.proxy,s=e.ctx;Ue=!1,t.beforeCreate&&je(t.beforeCreate,e,"bc");const{data:o,computed:a,methods:u,watch:c,provide:l,inject:h,created:f,beforeMount:d,mounted:p,beforeUpdate:g,updated:m,activated:v,deactivated:y,beforeDestroy:_,beforeUnmount:w,destroyed:b,unmounted:E,render:T,renderTracked:I,renderTriggered:S,errorCaptured:C,serverPrefetch:A,expose:k,inheritAttrs:R,components:O,directives:N,filters:D}=t,x=null;if(h&&Ve(h,s,x),u)for(const r in u){const e=u[r];(0,i.Tn)(e)&&(s[r]=e.bind(n))}if(o){0;const t=o.call(n,n);0,(0,i.Gv)(t)&&(e.data=(0,r.Kh)(t))}if(Ue=!0,a)for(const r in a){const e=a[r],t=(0,i.Tn)(e)?e.bind(n,n):(0,i.Tn)(e.get)?e.get.bind(n,n):i.tE;0;const o=!(0,i.Tn)(e)&&(0,i.Tn)(e.set)?e.set.bind(n):i.tE,u=Jn({get:t,set:o});Object.defineProperty(s,r,{enumerable:!0,configurable:!0,get:()=>u.value,set:e=>u.value=e})}if(c)for(const r in c)Be(c[r],s,n,r);if(l){const e=(0,i.Tn)(l)?l.call(n):l;Reflect.ownKeys(e).forEach(t=>{nt(t,e[t])})}function P(e,t){(0,i.cy)(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(f&&je(f,e,"c"),P(me,d),P(ve,p),P(ye,g),P(_e,m),P(ue,v),P(ce,y),P(Se,C),P(Ie,I),P(Te,S),P(we,w),P(be,E),P(Ee,A),(0,i.cy)(k))if(k.length){const t=e.exposed||(e.exposed={});k.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||(e.exposed={});T&&e.render===i.tE&&(e.render=T),null!=R&&(e.inheritAttrs=R),O&&(e.components=O),N&&(e.directives=N),A&&te(e)}function Ve(e,t,n=i.tE){(0,i.cy)(e)&&(e=ze(e));for(const s in e){const n=e[s];let o;o=(0,i.Gv)(n)?"default"in n?rt(n.from||s,n.default,!0):rt(n.from||s):rt(n),(0,r.i9)(o)?Object.defineProperty(t,s,{enumerable:!0,configurable:!0,get:()=>o.value,set:e=>o.value=e}):t[s]=o}}function je(e,t,n){o((0,i.cy)(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function Be(e,t,n,r){let s=r.includes(".")?lt(n,r):()=>n[r];if((0,i.Kg)(e)){const n=t[e];(0,i.Tn)(n)&&at(s,n)}else if((0,i.Tn)(e))at(s,e.bind(n));else if((0,i.Gv)(e))if((0,i.cy)(e))e.forEach(e=>Be(e,t,n,r));else{const r=(0,i.Tn)(e.handler)?e.handler.bind(n):t[e.handler];(0,i.Tn)(r)&&at(s,r,e)}else 0}function $e(e){const t=e.type,{mixins:n,extends:r}=t,{mixins:s,optionsCache:o,config:{optionMergeStrategies:a}}=e.appContext,u=o.get(t);let c;return u?c=u:s.length||n||r?(c={},s.length&&s.forEach(e=>qe(c,e,a,!0)),qe(c,t,a)):c=t,(0,i.Gv)(t)&&o.set(t,c),c}function qe(e,t,n,r=!1){const{mixins:i,extends:s}=t;s&&qe(e,s,n,!0),i&&i.forEach(t=>qe(e,t,n,!0));for(const o in t)if(r&&"expose"===o);else{const r=Ke[o]||n&&n[o];e[o]=r?r(e[o],t[o]):t[o]}return e}const Ke={data:We,props:Xe,emits:Xe,methods:Qe,computed:Qe,beforeCreate:He,created:He,beforeMount:He,mounted:He,beforeUpdate:He,updated:He,beforeDestroy:He,beforeUnmount:He,destroyed:He,unmounted:He,activated:He,deactivated:He,errorCaptured:He,serverPrefetch:He,components:Qe,directives:Qe,watch:Ye,provide:We,inject:Ge};function We(e,t){return t?e?function(){return(0,i.X$)((0,i.Tn)(e)?e.call(this,this):e,(0,i.Tn)(t)?t.call(this,this):t)}:t:e}function Ge(e,t){return Qe(ze(e),ze(t))}function ze(e){if((0,i.cy)(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function He(e,t){return e?[...new Set([].concat(e,t))]:t}function Qe(e,t){return e?(0,i.X$)(Object.create(null),e,t):t}function Xe(e,t){return e?(0,i.cy)(e)&&(0,i.cy)(t)?[...new Set([...e,...t])]:(0,i.X$)(Object.create(null),Me(e),Me(null!=t?t:{})):t}function Ye(e,t){if(!e)return t;if(!t)return e;const n=(0,i.X$)(Object.create(null),e);for(const r in t)n[r]=He(e[r],t[r]);return n}function Je(){return{app:null,config:{isNativeTag:i.NO,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Ze=0;function et(e,t){return function(n,r=null){(0,i.Tn)(n)||(n=(0,i.X$)({},n)),null==r||(0,i.Gv)(r)||(r=null);const s=Je(),a=new WeakSet,u=[];let c=!1;const l=s.app={_uid:Ze++,_component:n,_props:r,_container:null,_context:s,_instance:null,version:er,get config(){return s.config},set config(e){0},use(e,...t){return a.has(e)||(e&&(0,i.Tn)(e.install)?(a.add(e),e.install(l,...t)):(0,i.Tn)(e)&&(a.add(e),e(l,...t))),l},mixin(e){return s.mixins.includes(e)||s.mixins.push(e),l},component(e,t){return t?(s.components[e]=t,l):s.components[e]},directive(e,t){return t?(s.directives[e]=t,l):s.directives[e]},mount(i,o,a){if(!c){0;const u=l._ceVNode||yn(n,r);return u.appContext=s,!0===a?a="svg":!1===a&&(a=void 0),o&&t?t(u,i):e(u,i,a),c=!0,l._container=i,i.__vue_app__=l,Qn(u.component)}},onUnmount(e){u.push(e)},unmount(){c&&(o(u,l._instance,16),e(null,l._container),delete l._container.__vue_app__)},provide(e,t){return s.provides[e]=t,l},runWithContext(e){const t=tt;tt=l;try{return e()}finally{tt=t}}};return l}}let tt=null;function nt(e,t){if(xn){let n=xn.provides;const r=xn.parent&&xn.parent.provides;r===n&&(n=xn.provides=Object.create(r)),n[e]=t}}function rt(e,t,n=!1){const r=Pn();if(r||tt){let s=tt?tt._context.provides:r?null==r.parent||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(s&&e in s)return s[e];if(arguments.length>1)return n&&(0,i.Tn)(t)?t.call(r&&r.proxy):t}else 0}const it=Symbol.for("v-scx"),st=()=>{{const e=rt(it);return e}};function ot(e,t){return ut(e,null,t)}function at(e,t,n){return ut(e,t,n)}function ut(e,t,n=i.MZ){const{immediate:s,deep:a,flush:u,once:c}=n;const l=(0,i.X$)({},n);const h=t&&s||!t&&"post"!==u;let f;if($n)if("sync"===u){const e=st();f=e.__watcherHandles||(e.__watcherHandles=[])}else if(!h){const e=()=>{};return e.stop=i.tE,e.resume=i.tE,e.pause=i.tE,e}const d=xn;l.call=(e,t,n)=>o(e,d,t,n);let p=!1;"post"===u?l.scheduler=e=>{Bt(e,d&&d.suspense)}:"sync"!==u&&(p=!0,l.scheduler=(e,t)=>{t?e():y(e)}),l.augmentJob=e=>{t&&(e.flags|=4),p&&(e.flags|=2,d&&(e.id=d.uid,e.i=d))};const g=(0,r.wB)(e,t,l);return $n&&(f?f.push(g):h&&g()),g}function ct(e,t,n){const r=this.proxy,s=(0,i.Kg)(e)?e.includes(".")?lt(r,e):()=>r[e]:e.bind(r,r);let o;(0,i.Tn)(t)?o=t:(o=t.handler,n=t);const a=Un(this),u=ut(s,o.bind(r),n);return a(),u}function lt(e,t){const n=t.split(".");return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}const ht=(e,t)=>"modelValue"===t||"model-value"===t?e.modelModifiers:e[`${t}Modifiers`]||e[`${(0,i.PT)(t)}Modifiers`]||e[`${(0,i.Tg)(t)}Modifiers`];function ft(e,t,...n){if(e.isUnmounted)return;const r=e.vnode.props||i.MZ;let s=n;const a=t.startsWith("update:"),u=a&&ht(r,t.slice(7));let c;u&&(u.trim&&(s=n.map(e=>(0,i.Kg)(e)?e.trim():e)),u.number&&(s=n.map(i.bB)));let l=r[c=(0,i.rU)(t)]||r[c=(0,i.rU)((0,i.PT)(t))];!l&&a&&(l=r[c=(0,i.rU)((0,i.Tg)(t))]),l&&o(l,e,6,s);const h=r[c+"Once"];if(h){if(e.emitted){if(e.emitted[c])return}else e.emitted={};e.emitted[c]=!0,o(h,e,6,s)}}const dt=new WeakMap;function pt(e,t,n=!1){const r=n?dt:t.emitsCache,s=r.get(e);if(void 0!==s)return s;const o=e.emits;let a={},u=!1;if(!(0,i.Tn)(e)){const r=e=>{const n=pt(e,t,!0);n&&(u=!0,(0,i.X$)(a,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return o||u?((0,i.cy)(o)?o.forEach(e=>a[e]=null):(0,i.X$)(a,o),(0,i.Gv)(e)&&r.set(e,a),a):((0,i.Gv)(e)&&r.set(e,null),null)}function gt(e,t){return!(!e||!(0,i.Mp)(t))&&(t=t.slice(2).replace(/Once$/,""),(0,i.$3)(e,t[0].toLowerCase()+t.slice(1))||(0,i.$3)(e,(0,i.Tg)(t))||(0,i.$3)(e,t))}function mt(e){const{type:t,vnode:n,proxy:r,withProxy:s,propsOptions:[o],slots:u,attrs:c,emit:l,render:h,renderCache:f,props:d,data:p,setupState:g,ctx:m,inheritAttrs:v}=e,y=A(e);let _,w;try{if(4&n.shapeFlag){const e=s||r,t=e;_=Sn(h.call(t,e,f,d,g,p,m)),w=c}else{const e=t;0,_=Sn(e.length>1?e(d,{attrs:c,slots:u,emit:l}):e(d,null)),w=t.props?c:vt(c)}}catch(E){rn.length=0,a(E,e,1),_=yn(tn)}let b=_;if(w&&!1!==v){const e=Object.keys(w),{shapeFlag:t}=b;e.length&&7&t&&(o&&e.some(i.CP)&&(w=yt(w,o)),b=bn(b,w,!1,!0))}return n.dirs&&(b=bn(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&Y(b,n.transition),_=b,A(y),_}const vt=e=>{let t;for(const n in e)("class"===n||"style"===n||(0,i.Mp)(n))&&((t||(t={}))[n]=e[n]);return t},yt=(e,t)=>{const n={};for(const r in e)(0,i.CP)(r)&&r.slice(9)in t||(n[r]=e[r]);return n};function _t(e,t,n){const{props:r,children:i,component:s}=e,{props:o,children:a,patchFlag:u}=t,c=s.emitsOptions;if(t.dirs||t.transition)return!0;if(!(n&&u>=0))return!(!i&&!a||a&&a.$stable)||r!==o&&(r?!o||wt(r,o,c):!!o);if(1024&u)return!0;if(16&u)return r?wt(r,o,c):!!o;if(8&u){const e=t.dynamicProps;for(let t=0;t<e.length;t++){const n=e[t];if(o[n]!==r[n]&&!gt(c,n))return!0}}return!1}function wt(e,t,n){const r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){const s=r[i];if(t[s]!==e[s]&&!gt(n,s))return!0}return!1}function bt({vnode:e,parent:t},n){while(t){const r=t.subTree;if(r.suspense&&r.suspense.activeBranch===e&&(r.el=e.el),r!==e)break;(e=t.vnode).el=n,t=t.parent}}const Et={},Tt=()=>Object.create(Et),It=e=>Object.getPrototypeOf(e)===Et;function St(e,t,n,i=!1){const s={},o=Tt();e.propsDefaults=Object.create(null),At(e,t,s,o);for(const r in e.propsOptions[0])r in s||(s[r]=void 0);n?e.props=i?s:(0,r.Gc)(s):e.type.props?e.props=s:e.props=o,e.attrs=o}function Ct(e,t,n,s){const{props:o,attrs:a,vnode:{patchFlag:u}}=e,c=(0,r.ux)(o),[l]=e.propsOptions;let h=!1;if(!(s||u>0)||16&u){let r;At(e,t,o,a)&&(h=!0);for(const s in c)t&&((0,i.$3)(t,s)||(r=(0,i.Tg)(s))!==s&&(0,i.$3)(t,r))||(l?!n||void 0===n[s]&&void 0===n[r]||(o[s]=kt(l,c,s,void 0,e,!0)):delete o[s]);if(a!==c)for(const e in a)t&&(0,i.$3)(t,e)||(delete a[e],h=!0)}else if(8&u){const n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let s=n[r];if(gt(e.emitsOptions,s))continue;const u=t[s];if(l)if((0,i.$3)(a,s))u!==a[s]&&(a[s]=u,h=!0);else{const t=(0,i.PT)(s);o[t]=kt(l,c,t,u,e,!1)}else u!==a[s]&&(a[s]=u,h=!0)}}h&&(0,r.hZ)(e.attrs,"set","")}function At(e,t,n,s){const[o,a]=e.propsOptions;let u,c=!1;if(t)for(let r in t){if((0,i.SU)(r))continue;const l=t[r];let h;o&&(0,i.$3)(o,h=(0,i.PT)(r))?a&&a.includes(h)?(u||(u={}))[h]=l:n[h]=l:gt(e.emitsOptions,r)||r in s&&l===s[r]||(s[r]=l,c=!0)}if(a){const t=(0,r.ux)(n),s=u||i.MZ;for(let r=0;r<a.length;r++){const u=a[r];n[u]=kt(o,t,u,s[u],e,!(0,i.$3)(s,u))}}return c}function kt(e,t,n,r,s,o){const a=e[n];if(null!=a){const e=(0,i.$3)(a,"default");if(e&&void 0===r){const e=a.default;if(a.type!==Function&&!a.skipFactory&&(0,i.Tn)(e)){const{propsDefaults:i}=s;if(n in i)r=i[n];else{const o=Un(s);r=i[n]=e.call(null,t),o()}}else r=e;s.ce&&s.ce._setProp(n,r)}a[0]&&(o&&!e?r=!1:!a[1]||""!==r&&r!==(0,i.Tg)(n)||(r=!0))}return r}const Rt=new WeakMap;function Ot(e,t,n=!1){const r=n?Rt:t.propsCache,s=r.get(e);if(s)return s;const o=e.props,a={},u=[];let c=!1;if(!(0,i.Tn)(e)){const r=e=>{c=!0;const[n,r]=Ot(e,t,!0);(0,i.X$)(a,n),r&&u.push(...r)};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}if(!o&&!c)return(0,i.Gv)(e)&&r.set(e,i.Oj),i.Oj;if((0,i.cy)(o))for(let h=0;h<o.length;h++){0;const e=(0,i.PT)(o[h]);Nt(e)&&(a[e]=i.MZ)}else if(o){0;for(const e in o){const t=(0,i.PT)(e);if(Nt(t)){const n=o[e],r=a[t]=(0,i.cy)(n)||(0,i.Tn)(n)?{type:n}:(0,i.X$)({},n),s=r.type;let c=!1,l=!0;if((0,i.cy)(s))for(let e=0;e<s.length;++e){const t=s[e],n=(0,i.Tn)(t)&&t.name;if("Boolean"===n){c=!0;break}"String"===n&&(l=!1)}else c=(0,i.Tn)(s)&&"Boolean"===s.name;r[0]=c,r[1]=l,(c||(0,i.$3)(r,"default"))&&u.push(t)}}}const l=[a,u];return(0,i.Gv)(e)&&r.set(e,l),l}function Nt(e){return"$"!==e[0]&&!(0,i.SU)(e)}const Dt=e=>"_"===e||"_ctx"===e||"$stable"===e,xt=e=>(0,i.cy)(e)?e.map(Sn):[Sn(e)],Pt=(e,t,n)=>{if(t._n)return t;const r=k((...e)=>xt(t(...e)),n);return r._c=!1,r},Lt=(e,t,n)=>{const r=e._ctx;for(const s in e){if(Dt(s))continue;const n=e[s];if((0,i.Tn)(n))t[s]=Pt(s,n,r);else if(null!=n){0;const e=xt(n);t[s]=()=>e}}},Mt=(e,t)=>{const n=xt(t);e.slots.default=()=>n},Ut=(e,t,n)=>{for(const r in t)!n&&Dt(r)||(e[r]=t[r])},Ft=(e,t,n)=>{const r=e.slots=Tt();if(32&e.vnode.shapeFlag){const e=t._;e?(Ut(r,t,n),n&&(0,i.yQ)(r,"_",e,!0)):Lt(t,r)}else t&&Mt(e,t)},Vt=(e,t,n)=>{const{vnode:r,slots:s}=e;let o=!0,a=i.MZ;if(32&r.shapeFlag){const e=t._;e?n&&1===e?o=!1:Ut(s,t,n):(o=!t.$stable,Lt(t,s)),a=t}else t&&(Mt(e,t),a={default:1});if(o)for(const i in s)Dt(i)||null!=a[i]||delete s[i]};function jt(){}const Bt=Jt;function $t(e){return qt(e)}function qt(e,t){jt();const n=(0,i.We)();n.__VUE__=!0;const{insert:s,remove:o,patchProp:a,createElement:u,createText:c,createComment:l,setText:h,setElementText:f,parentNode:d,nextSibling:p,setScopeId:g=i.tE,insertStaticContent:m}=e,v=(e,t,n,r=null,i=null,s=null,o=void 0,a=null,u=!!t.dynamicChildren)=>{if(e===t)return;e&&!pn(e,t)&&(r=Y(e),G(e,i,s,!0),e=null),-2===t.patchFlag&&(u=!1,t.dynamicChildren=null);const{type:c,ref:l,shapeFlag:h}=t;switch(c){case en:_(e,t,n,r);break;case tn:w(e,t,n,r);break;case nn:null==e&&T(t,n,r,o);break;case Zt:L(e,t,n,r,i,s,o,a,u);break;default:1&h?C(e,t,n,r,i,s,o,a,u):6&h?M(e,t,n,r,i,s,o,a,u):(64&h||128&h)&&c.process(e,t,n,r,i,s,o,a,u,ee)}null!=l&&i?re(l,e&&e.ref,s,t||e,!t):null==l&&e&&null!=e.ref&&re(e.ref,null,s,e,!0)},_=(e,t,n,r)=>{if(null==e)s(t.el=c(t.children),n,r);else{const n=t.el=e.el;t.children!==e.children&&h(n,t.children)}},w=(e,t,n,r)=>{null==e?s(t.el=l(t.children||""),n,r):t.el=e.el},T=(e,t,n,r)=>{[e.el,e.anchor]=m(e.children,t,n,r,e.el,e.anchor)},I=({el:e,anchor:t},n,r)=>{let i;while(e&&e!==t)i=p(e),s(e,n,r),e=i;s(t,n,r)},S=({el:e,anchor:t})=>{let n;while(e&&e!==t)n=p(e),o(e),e=n;o(t)},C=(e,t,n,r,i,s,o,a,u)=>{if("svg"===t.type?o="svg":"math"===t.type&&(o="mathml"),null==e)A(t,n,r,i,s,o,a,u);else{const n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),D(e,t,i,s,o,a,u)}finally{n&&n._endPatch()}}},A=(e,t,n,r,o,c,l,h)=>{let d,p;const{props:g,shapeFlag:m,transition:v,dirs:y}=e;if(d=e.el=u(e.type,c,g&&g.is,g),8&m?f(d,e.children):16&m&&R(e.children,d,null,r,o,Kt(e,c),l,h),y&&O(e,null,r,"created"),k(d,e,e.scopeId,l,r),g){for(const e in g)"value"===e||(0,i.SU)(e)||a(d,e,null,g[e],c,r);"value"in g&&a(d,"value",null,g.value,c),(p=g.onVnodeBeforeMount)&&Rn(p,r,e)}y&&O(e,null,r,"beforeMount");const _=Gt(o,v);_&&v.beforeEnter(d),s(d,t,n),((p=g&&g.onVnodeMounted)||_||y)&&Bt(()=>{p&&Rn(p,r,e),_&&v.enter(d),y&&O(e,null,r,"mounted")},o)},k=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let s=0;s<r.length;s++)g(e,r[s]);if(i){let n=i.subTree;if(t===n||Yt(n.type)&&(n.ssContent===t||n.ssFallback===t)){const t=i.vnode;k(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},R=(e,t,n,r,i,s,o,a,u=0)=>{for(let c=u;c<e.length;c++){const u=e[c]=a?Cn(e[c]):Sn(e[c]);v(null,u,t,n,r,i,s,o,a)}},D=(e,t,n,r,s,o,u)=>{const c=t.el=e.el;let{patchFlag:l,dynamicChildren:h,dirs:d}=t;l|=16&e.patchFlag;const p=e.props||i.MZ,g=t.props||i.MZ;let m;if(n&&Wt(n,!1),(m=g.onVnodeBeforeUpdate)&&Rn(m,n,t,e),d&&O(t,e,n,"beforeUpdate"),n&&Wt(n,!0),(p.innerHTML&&null==g.innerHTML||p.textContent&&null==g.textContent)&&f(c,""),h?x(e.dynamicChildren,h,c,n,r,Kt(t,s),o):u||B(e,t,c,null,n,r,Kt(t,s),o,!1),l>0){if(16&l)P(c,p,g,n,s);else if(2&l&&p.class!==g.class&&a(c,"class",null,g.class,s),4&l&&a(c,"style",p.style,g.style,s),8&l){const e=t.dynamicProps;for(let t=0;t<e.length;t++){const r=e[t],i=p[r],o=g[r];o===i&&"value"!==r||a(c,r,i,o,s,n)}}1&l&&e.children!==t.children&&f(c,t.children)}else u||null!=h||P(c,p,g,n,s);((m=g.onVnodeUpdated)||d)&&Bt(()=>{m&&Rn(m,n,t,e),d&&O(t,e,n,"updated")},r)},x=(e,t,n,r,i,s,o)=>{for(let a=0;a<t.length;a++){const u=e[a],c=t[a],l=u.el&&(u.type===Zt||!pn(u,c)||198&u.shapeFlag)?d(u.el):n;v(u,c,l,null,r,i,s,o,!0)}},P=(e,t,n,r,s)=>{if(t!==n){if(t!==i.MZ)for(const o in t)(0,i.SU)(o)||o in n||a(e,o,t[o],null,s,r);for(const o in n){if((0,i.SU)(o))continue;const u=n[o],c=t[o];u!==c&&"value"!==o&&a(e,o,c,u,s,r)}"value"in n&&a(e,"value",t.value,n.value,s)}},L=(e,t,n,r,i,o,a,u,l)=>{const h=t.el=e?e.el:c(""),f=t.anchor=e?e.anchor:c("");let{patchFlag:d,dynamicChildren:p,slotScopeIds:g}=t;g&&(u=u?u.concat(g):g),null==e?(s(h,n,r),s(f,n,r),R(t.children||[],n,f,i,o,a,u,l)):d>0&&64&d&&p&&e.dynamicChildren?(x(e.dynamicChildren,p,n,i,o,a,u),(null!=t.key||i&&t===i.subTree)&&zt(e,t,!0)):B(e,t,n,f,i,o,a,u,l)},M=(e,t,n,r,i,s,o,a,u)=>{t.slotScopeIds=a,null==e?512&t.shapeFlag?i.ctx.activate(t,n,r,o,u):U(t,n,r,i,s,o,u):F(e,t,u)},U=(e,t,n,r,i,s,o)=>{const a=e.component=Dn(e,r,i);if(oe(e)&&(a.ctx.renderer=ee),qn(a,!1,o),a.asyncDep){if(i&&i.registerDep(a,V,o),!e.el){const r=a.subTree=yn(tn);w(null,r,t,n),e.placeholder=r.el}}else V(a,e,t,n,i,s,o)},F=(e,t,n)=>{const r=t.component=e.component;if(_t(e,t,n)){if(r.asyncDep&&!r.asyncResolved)return void j(r,t,n);r.next=t,r.update()}else t.el=e.el,r.vnode=t},V=(e,t,n,s,o,a,u)=>{const c=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:s,vnode:l}=e;{const n=Qt(e);if(n)return t&&(t.el=l.el,j(e,t,u)),void n.asyncDep.then(()=>{e.isUnmounted||c()})}let h,f=t;0,Wt(e,!1),t?(t.el=l.el,j(e,t,u)):t=l,n&&(0,i.DY)(n),(h=t.props&&t.props.onVnodeBeforeUpdate)&&Rn(h,s,t,l),Wt(e,!0);const p=mt(e);0;const g=e.subTree;e.subTree=p,v(g,p,d(g.el),Y(g),e,o,a),t.el=p.el,null===f&&bt(e,p.el),r&&Bt(r,o),(h=t.props&&t.props.onVnodeUpdated)&&Bt(()=>Rn(h,s,t,l),o)}else{let r;const{el:u,props:c}=t,{bm:l,m:h,parent:f,root:d,type:p}=e,g=se(t);if(Wt(e,!1),l&&(0,i.DY)(l),!g&&(r=c&&c.onVnodeBeforeMount)&&Rn(r,f,t),Wt(e,!0),u&&ne){const t=()=>{e.subTree=mt(e),ne(u,e.subTree,e,o,null)};g&&p.__asyncHydrate?p.__asyncHydrate(u,e,t):t()}else{d.ce&&!1!==d.ce._def.shadowRoot&&d.ce._injectChildStyle(p);const r=e.subTree=mt(e);0,v(null,r,n,s,e,o,a),t.el=r.el}if(h&&Bt(h,o),!g&&(r=c&&c.onVnodeMounted)){const e=t;Bt(()=>Rn(r,f,e),o)}(256&t.shapeFlag||f&&se(f.vnode)&&256&f.vnode.shapeFlag)&&e.a&&Bt(e.a,o),e.isMounted=!0,t=n=s=null}};e.scope.on();const l=e.effect=new r.X2(c);e.scope.off();const h=e.update=l.run.bind(l),f=e.job=l.runIfDirty.bind(l);f.i=e,f.id=e.uid,l.scheduler=()=>y(f),Wt(e,!0),h()},j=(e,t,n)=>{t.component=e;const i=e.vnode.props;e.vnode=t,e.next=null,Ct(e,t.props,i,n),Vt(e,t.children,n),(0,r.C4)(),b(e),(0,r.bl)()},B=(e,t,n,r,i,s,o,a,u=!1)=>{const c=e&&e.children,l=e?e.shapeFlag:0,h=t.children,{patchFlag:d,shapeFlag:p}=t;if(d>0){if(128&d)return void q(c,h,n,r,i,s,o,a,u);if(256&d)return void $(c,h,n,r,i,s,o,a,u)}8&p?(16&l&&X(c,i,s),h!==c&&f(n,h)):16&l?16&p?q(c,h,n,r,i,s,o,a,u):X(c,i,s,!0):(8&l&&f(n,""),16&p&&R(h,n,r,i,s,o,a,u))},$=(e,t,n,r,s,o,a,u,c)=>{e=e||i.Oj,t=t||i.Oj;const l=e.length,h=t.length,f=Math.min(l,h);let d;for(d=0;d<f;d++){const r=t[d]=c?Cn(t[d]):Sn(t[d]);v(e[d],r,n,null,s,o,a,u,c)}l>h?X(e,s,o,!0,!1,f):R(t,n,r,s,o,a,u,c,f)},q=(e,t,n,r,s,o,a,u,c)=>{let l=0;const h=t.length;let f=e.length-1,d=h-1;while(l<=f&&l<=d){const r=e[l],i=t[l]=c?Cn(t[l]):Sn(t[l]);if(!pn(r,i))break;v(r,i,n,null,s,o,a,u,c),l++}while(l<=f&&l<=d){const r=e[f],i=t[d]=c?Cn(t[d]):Sn(t[d]);if(!pn(r,i))break;v(r,i,n,null,s,o,a,u,c),f--,d--}if(l>f){if(l<=d){const e=d+1,i=e<h?t[e].el:r;while(l<=d)v(null,t[l]=c?Cn(t[l]):Sn(t[l]),n,i,s,o,a,u,c),l++}}else if(l>d)while(l<=f)G(e[l],s,o,!0),l++;else{const p=l,g=l,m=new Map;for(l=g;l<=d;l++){const e=t[l]=c?Cn(t[l]):Sn(t[l]);null!=e.key&&m.set(e.key,l)}let y,_=0;const w=d-g+1;let b=!1,E=0;const T=new Array(w);for(l=0;l<w;l++)T[l]=0;for(l=p;l<=f;l++){const r=e[l];if(_>=w){G(r,s,o,!0);continue}let i;if(null!=r.key)i=m.get(r.key);else for(y=g;y<=d;y++)if(0===T[y-g]&&pn(r,t[y])){i=y;break}void 0===i?G(r,s,o,!0):(T[i-g]=l+1,i>=E?E=i:b=!0,v(r,t[i],n,null,s,o,a,u,c),_++)}const I=b?Ht(T):i.Oj;for(y=I.length-1,l=w-1;l>=0;l--){const e=g+l,i=t[e],f=t[e+1],d=e+1<h?f.el||f.placeholder:r;0===T[l]?v(null,i,n,d,s,o,a,u,c):b&&(y<0||l!==I[y]?W(i,n,d,2):y--)}}},W=(e,t,n,r,i=null)=>{const{el:a,type:u,transition:c,children:l,shapeFlag:h}=e;if(6&h)return void W(e.component.subTree,t,n,r);if(128&h)return void e.suspense.move(t,n,r);if(64&h)return void u.move(e,t,n,ee);if(u===Zt){s(a,t,n);for(let e=0;e<l.length;e++)W(l[e],t,n,r);return void s(e.anchor,t,n)}if(u===nn)return void I(e,t,n);const f=2!==r&&1&h&&c;if(f)if(0===r)c.beforeEnter(a),s(a,t,n),Bt(()=>c.enter(a),i);else{const{leave:r,delayLeave:i,afterLeave:u}=c,l=()=>{e.ctx.isUnmounted?o(a):s(a,t,n)},h=()=>{a._isLeaving&&a[K](!0),r(a,()=>{l(),u&&u()})};i?i(a,l,h):h()}else s(a,t,n)},G=(e,t,n,i=!1,s=!1)=>{const{type:o,props:a,ref:u,children:c,dynamicChildren:l,shapeFlag:h,patchFlag:f,dirs:d,cacheIndex:p}=e;if(-2===f&&(s=!1),null!=u&&((0,r.C4)(),re(u,null,n,e,!0),(0,r.bl)()),null!=p&&(t.renderCache[p]=void 0),256&h)return void t.ctx.deactivate(e);const g=1&h&&d,m=!se(e);let v;if(m&&(v=a&&a.onVnodeBeforeUnmount)&&Rn(v,t,e),6&h)Q(e.component,n,i);else{if(128&h)return void e.suspense.unmount(n,i);g&&O(e,null,t,"beforeUnmount"),64&h?e.type.remove(e,t,n,ee,i):l&&!l.hasOnce&&(o!==Zt||f>0&&64&f)?X(l,t,n,!1,!0):(o===Zt&&384&f||!s&&16&h)&&X(c,t,n),i&&z(e)}(m&&(v=a&&a.onVnodeUnmounted)||g)&&Bt(()=>{v&&Rn(v,t,e),g&&O(e,null,t,"unmounted")},n)},z=e=>{const{type:t,el:n,anchor:r,transition:i}=e;if(t===Zt)return void H(n,r);if(t===nn)return void S(e);const s=()=>{o(n),i&&!i.persisted&&i.afterLeave&&i.afterLeave()};if(1&e.shapeFlag&&i&&!i.persisted){const{leave:t,delayLeave:r}=i,o=()=>t(n,s);r?r(e.el,s,o):o()}else s()},H=(e,t)=>{let n;while(e!==t)n=p(e),o(e),e=n;o(t)},Q=(e,t,n)=>{const{bum:r,scope:s,job:o,subTree:a,um:u,m:c,a:l}=e;Xt(c),Xt(l),r&&(0,i.DY)(r),s.stop(),o&&(o.flags|=8,G(a,e,t,n)),u&&Bt(u,t),Bt(()=>{e.isUnmounted=!0},t)},X=(e,t,n,r=!1,i=!1,s=0)=>{for(let o=s;o<e.length;o++)G(e[o],t,n,r,i)},Y=e=>{if(6&e.shapeFlag)return Y(e.component.subTree);if(128&e.shapeFlag)return e.suspense.next();const t=p(e.anchor||e.el),n=t&&t[N];return n?p(n):t};let J=!1;const Z=(e,t,n)=>{null==e?t._vnode&&G(t._vnode,null,null,!0):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e,J||(J=!0,b(),E(),J=!1)},ee={p:v,um:G,m:W,r:z,mt:U,mc:R,pc:B,pbc:x,n:Y,o:e};let te,ne;return t&&([te,ne]=t(ee)),{render:Z,hydrate:te,createApp:et(Z,te)}}function Kt({type:e,props:t},n){return"svg"===n&&"foreignObject"===e||"mathml"===n&&"annotation-xml"===e&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function Wt({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Gt(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function zt(e,t,n=!1){const r=e.children,s=t.children;if((0,i.cy)(r)&&(0,i.cy)(s))for(let i=0;i<r.length;i++){const e=r[i];let t=s[i];1&t.shapeFlag&&!t.dynamicChildren&&((t.patchFlag<=0||32===t.patchFlag)&&(t=s[i]=Cn(s[i]),t.el=e.el),n||-2===t.patchFlag||zt(e,t)),t.type===en&&-1!==t.patchFlag&&(t.el=e.el),t.type!==tn||t.el||(t.el=e.el)}}function Ht(e){const t=e.slice(),n=[0];let r,i,s,o,a;const u=e.length;for(r=0;r<u;r++){const u=e[r];if(0!==u){if(i=n[n.length-1],e[i]<u){t[r]=i,n.push(r);continue}s=0,o=n.length-1;while(s<o)a=s+o>>1,e[n[a]]<u?s=a+1:o=a;u<e[n[s]]&&(s>0&&(t[r]=n[s-1]),n[s]=r)}}s=n.length,o=n[s-1];while(s-- >0)n[s]=o,o=t[o];return n}function Qt(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Qt(t)}function Xt(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}const Yt=e=>e.__isSuspense;function Jt(e,t){t&&t.pendingBranch?(0,i.cy)(e)?t.effects.push(...e):t.effects.push(e):w(e)}const Zt=Symbol.for("v-fgt"),en=Symbol.for("v-txt"),tn=Symbol.for("v-cmt"),nn=Symbol.for("v-stc"),rn=[];let sn=null;function on(e=!1){rn.push(sn=e?null:[])}function an(){rn.pop(),sn=rn[rn.length-1]||null}let un=1;function cn(e,t=!1){un+=e,e<0&&sn&&t&&(sn.hasOnce=!0)}function ln(e){return e.dynamicChildren=un>0?sn||i.Oj:null,an(),un>0&&sn&&sn.push(e),e}function hn(e,t,n,r,i,s){return ln(vn(e,t,n,r,i,s,!0))}function fn(e,t,n,r,i){return ln(yn(e,t,n,r,i,!0))}function dn(e){return!!e&&!0===e.__v_isVNode}function pn(e,t){return e.type===t.type&&e.key===t.key}const gn=({key:e})=>null!=e?e:null,mn=({ref:e,ref_key:t,ref_for:n})=>("number"===typeof e&&(e=""+e),null!=e?(0,i.Kg)(e)||(0,r.i9)(e)||(0,i.Tn)(e)?{i:S,r:e,k:t,f:!!n}:e:null);function vn(e,t=null,n=null,r=0,s=null,o=(e===Zt?0:1),a=!1,u=!1){const c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&gn(t),ref:t&&mn(t),scopeId:C,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:o,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:S};return u?(An(c,n),128&o&&e.normalize(c)):n&&(c.shapeFlag|=(0,i.Kg)(n)?8:16),un>0&&!a&&sn&&(c.patchFlag>0||6&o)&&32!==c.patchFlag&&sn.push(c),c}const yn=_n;function _n(e,t=null,n=null,s=0,o=null,a=!1){if(e&&e!==ke||(e=tn),dn(e)){const r=bn(e,t,!0);return n&&An(r,n),un>0&&!a&&sn&&(6&r.shapeFlag?sn[sn.indexOf(e)]=r:sn.push(r)),r.patchFlag=-2,r}if(Yn(e)&&(e=e.__vccOpts),t){t=wn(t);let{class:e,style:n}=t;e&&!(0,i.Kg)(e)&&(t.class=(0,i.C4)(e)),(0,i.Gv)(n)&&((0,r.ju)(n)&&!(0,i.cy)(n)&&(n=(0,i.X$)({},n)),t.style=(0,i.Tr)(n))}const u=(0,i.Kg)(e)?1:Yt(e)?128:D(e)?64:(0,i.Gv)(e)?4:(0,i.Tn)(e)?2:0;return vn(e,t,n,s,o,u,a,!0)}function wn(e){return e?(0,r.ju)(e)||It(e)?(0,i.X$)({},e):e:null}function bn(e,t,n=!1,r=!1){const{props:s,ref:o,patchFlag:a,children:u,transition:c}=e,l=t?kn(s||{},t):s,h={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&gn(l),ref:t&&t.ref?n&&o?(0,i.cy)(o)?o.concat(mn(t)):[o,mn(t)]:mn(t):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:u,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Zt?-1===a?16:16|a:a,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&bn(e.ssContent),ssFallback:e.ssFallback&&bn(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return c&&r&&Y(h,c.clone(h)),h}function En(e=" ",t=0){return yn(en,null,e,t)}function Tn(e,t){const n=yn(nn,null,e);return n.staticCount=t,n}function In(e="",t=!1){return t?(on(),fn(tn,null,e)):yn(tn,null,e)}function Sn(e){return null==e||"boolean"===typeof e?yn(tn):(0,i.cy)(e)?yn(Zt,null,e.slice()):dn(e)?Cn(e):yn(en,null,String(e))}function Cn(e){return null===e.el&&-1!==e.patchFlag||e.memo?e:bn(e)}function An(e,t){let n=0;const{shapeFlag:r}=e;if(null==t)t=null;else if((0,i.cy)(t))n=16;else if("object"===typeof t){if(65&r){const n=t.default;return void(n&&(n._c&&(n._d=!1),An(e,n()),n._c&&(n._d=!0)))}{n=32;const r=t._;r||It(t)?3===r&&S&&(1===S.slots._?t._=1:(t._=2,e.patchFlag|=1024)):t._ctx=S}}else(0,i.Tn)(t)?(t={default:t,_ctx:S},n=32):(t=String(t),64&r?(n=16,t=[En(t)]):n=8);e.children=t,e.shapeFlag|=n}function kn(...e){const t={};for(let n=0;n<e.length;n++){const r=e[n];for(const e in r)if("class"===e)t.class!==r.class&&(t.class=(0,i.C4)([t.class,r.class]));else if("style"===e)t.style=(0,i.Tr)([t.style,r.style]);else if((0,i.Mp)(e)){const n=t[e],s=r[e];!s||n===s||(0,i.cy)(n)&&n.includes(s)||(t[e]=n?[].concat(n,s):s)}else""!==e&&(t[e]=r[e])}return t}function Rn(e,t,n,r=null){o(e,t,7,[n,r])}const On=Je();let Nn=0;function Dn(e,t,n){const s=e.type,o=(t?t.appContext:e.appContext)||On,a={uid:Nn++,vnode:e,type:s,parent:t,appContext:o,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new r.yC(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(o.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Ot(s,o),emitsOptions:pt(s,o),emit:null,emitted:null,propsDefaults:i.MZ,inheritAttrs:s.inheritAttrs,ctx:i.MZ,data:i.MZ,props:i.MZ,attrs:i.MZ,slots:i.MZ,refs:i.MZ,setupState:i.MZ,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return a.ctx={_:a},a.root=t?t.root:a,a.emit=ft.bind(null,a),e.ce&&e.ce(a),a}let xn=null;const Pn=()=>xn||S;let Ln,Mn;{const e=(0,i.We)(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};Ln=t("__VUE_INSTANCE_SETTERS__",e=>xn=e),Mn=t("__VUE_SSR_SETTERS__",e=>$n=e)}const Un=e=>{const t=xn;return Ln(e),e.scope.on(),()=>{e.scope.off(),Ln(t)}},Fn=()=>{xn&&xn.scope.off(),Ln(null)};function Vn(e){return 4&e.vnode.shapeFlag}let jn,Bn,$n=!1;function qn(e,t=!1,n=!1){t&&Mn(t);const{props:r,children:i}=e.vnode,s=Vn(e);St(e,r,s,t),Ft(e,i,n||t);const o=s?Kn(e,t):void 0;return t&&Mn(!1),o}function Kn(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Le);const{setup:o}=n;if(o){(0,r.C4)();const n=e.setupContext=o.length>1?Hn(e):null,u=Un(e),c=s(o,e,0,[e.props,n]),l=(0,i.yL)(c);if((0,r.bl)(),u(),!l&&!e.sp||se(e)||te(e),l){if(c.then(Fn,Fn),t)return c.then(n=>{Wn(e,n,t)}).catch(t=>{a(t,e,0)});e.asyncDep=c}else Wn(e,c,t)}else Gn(e,t)}function Wn(e,t,n){(0,i.Tn)(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:(0,i.Gv)(t)&&(e.setupState=(0,r.Pr)(t)),Gn(e,n)}function Gn(e,t,n){const s=e.type;if(!e.render){if(!t&&jn&&!s.render){const t=s.template||$e(e).template;if(t){0;const{isCustomElement:n,compilerOptions:r}=e.appContext.config,{delimiters:o,compilerOptions:a}=s,u=(0,i.X$)((0,i.X$)({isCustomElement:n,delimiters:o},r),a);s.render=jn(t,u)}}e.render=s.render||i.tE,Bn&&Bn(e)}{const t=Un(e);(0,r.C4)();try{Fe(e)}finally{(0,r.bl)(),t()}}}const zn={get(e,t){return(0,r.u4)(e,"get",""),e[t]}};function Hn(e){const t=t=>{e.exposed=t||{}};return{attrs:new Proxy(e.attrs,zn),slots:e.slots,emit:e.emit,expose:t}}function Qn(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy((0,r.Pr)((0,r.IG)(e.exposed)),{get(t,n){return n in t?t[n]:n in xe?xe[n](e):void 0},has(e,t){return t in e||t in xe}})):e.proxy}function Xn(e,t=!0){return(0,i.Tn)(e)?e.displayName||e.name:e.name||t&&e.__name}function Yn(e){return(0,i.Tn)(e)&&"__vccOpts"in e}const Jn=(e,t)=>{const n=(0,r.EW)(e,t,$n);return n};function Zn(e,t,n){try{cn(-1);const r=arguments.length;return 2===r?(0,i.Gv)(t)&&!(0,i.cy)(t)?dn(t)?yn(e,null,[t]):yn(e,t):yn(e,null,t):(r>3?n=Array.prototype.slice.call(arguments,2):3===r&&dn(n)&&(n=[n]),yn(e,t,n))}finally{cn(1)}}const er="3.5.25"},743:function(e,t,n){"use strict";n.d(t,{Am:function(){return V},FA:function(){return x},Fy:function(){return w},I9:function(){return j},Im:function(){return M},Ku:function(){return G},T9:function(){return v},Tj:function(){return g},Uj:function(){return u},XA:function(){return y},ZQ:function(){return b},bD:function(){return U},c1:function(){return I},cY:function(){return _},eX:function(){return O},g:function(){return D},hp:function(){return B},jZ:function(){return E},lT:function(){return A},lV:function(){return C},nr:function(){return k},sr:function(){return S},tD:function(){return $},u:function(){return c},yU:function(){return m},zW:function(){return R}});
/**
 * @license
 * Copyright 2017 Google LLC
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
const r=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=63&i|128):55296===(64512&i)&&r+1<e.length&&56320===(64512&e.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++r)),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=63&i|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=63&i|128)}return t},i=function(e){const t=[];let n=0,r=0;while(n<e.length){const i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=e[n++];t[r++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){const s=e[n++],o=e[n++],a=e[n++],u=((7&i)<<18|(63&s)<<12|(63&o)<<6|63&a)-65536;t[r++]=String.fromCharCode(55296+(u>>10)),t[r++]=String.fromCharCode(56320+(1023&u))}else{const s=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&o)}}return t.join("")},s={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"===typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){const t=e[i],s=i+1<e.length,o=s?e[i+1]:0,a=i+2<e.length,u=a?e[i+2]:0,c=t>>2,l=(3&t)<<4|o>>4;let h=(15&o)<<2|u>>6,f=63&u;a||(f=64,s||(h=64)),r.push(n[c],n[l],n[h],n[f])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(r(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):i(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){const t=n[e.charAt(i++)],s=i<e.length,a=s?n[e.charAt(i)]:0;++i;const u=i<e.length,c=u?n[e.charAt(i)]:64;++i;const l=i<e.length,h=l?n[e.charAt(i)]:64;if(++i,null==t||null==a||null==c||null==h)throw new o;const f=t<<2|a>>4;if(r.push(f),64!==c){const e=a<<4&240|c>>2;if(r.push(e),64!==h){const e=c<<6&192|h;r.push(e)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class o extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const a=function(e){const t=r(e);return s.encodeByteArray(t,!0)},u=function(e){return a(e).replace(/\./g,"")},c=function(e){try{return s.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};
/**
 * @license
 * Copyright 2022 Google LLC
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
function l(){if("undefined"!==typeof self)return self;if("undefined"!==typeof window)return window;if("undefined"!==typeof n.g)return n.g;throw new Error("Unable to locate global object.")}
/**
 * @license
 * Copyright 2022 Google LLC
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
 */const h=()=>l().__FIREBASE_DEFAULTS__,f=()=>{if("undefined"===typeof process)return;const e={NODE_ENV:"production",VUE_APP_FIREBASE_API_KEY:"AIzaSyDxpbXvFH6UvfE2I6OJ_wNFnA889Zu-NEQ",VUE_APP_FIREBASE_APP_ID:"1:788480597316:web:776a05277fb4e60806cb11",VUE_APP_FIREBASE_AUTH_DOMAIN:"monofia-inventory.firebaseapp.com",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"788480597316",VUE_APP_FIREBASE_PROJECT_ID:"monofia-inventory",VUE_APP_FIREBASE_STORAGE_BUCKET:"monofia-inventory.firebasestorage.app",BASE_URL:"/"}.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0},d=()=>{if("undefined"===typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&c(e[1]);return t&&JSON.parse(t)},p=()=>{try{return h()||f()||d()}catch(e){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`)}},g=e=>{var t,n;return null===(n=null===(t=p())||void 0===t?void 0:t.emulatorHosts)||void 0===n?void 0:n[e]},m=e=>{const t=g(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]},v=()=>{var e;return null===(e=p())||void 0===e?void 0:e.config},y=e=>{var t;return null===(t=p())||void 0===t?void 0:t[`_${e}`]};
/**
 * @license
 * Copyright 2017 Google LLC
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
class _{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"===typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
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
 */function w(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=t||"demo-project",i=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},e),a="";return[u(JSON.stringify(n)),u(JSON.stringify(o)),a].join(".")}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function b(){return"undefined"!==typeof navigator&&"string"===typeof navigator["userAgent"]?navigator["userAgent"]:""}function E(){return"undefined"!==typeof window&&!!(window["cordova"]||window["phonegap"]||window["PhoneGap"])&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(b())}function T(){var e;const t=null===(e=p())||void 0===e?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(n.g.process)}catch(r){return!1}}function I(){return"undefined"!==typeof navigator&&"Cloudflare-Workers"===navigator.userAgent}function S(){const e="object"===typeof chrome?chrome.runtime:"object"===typeof browser?browser.runtime:void 0;return"object"===typeof e&&void 0!==e.id}function C(){return"object"===typeof navigator&&"ReactNative"===navigator["product"]}function A(){const e=b();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function k(){return!T()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function R(){try{return"object"===typeof indexedDB}catch(e){return!1}}function O(){return new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(n){t(n)}})}
/**
 * @license
 * Copyright 2017 Google LLC
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
const N="FirebaseError";class D extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=N,Object.setPrototypeOf(this,D.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,x.prototype.create)}}class x{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],s=i?P(i,n):"Error",o=`${this.serviceName}: ${s} (${r}).`,a=new D(r,o,n);return a}}function P(e,t){return e.replace(L,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}const L=/\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function M(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function U(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const i of n){if(!r.includes(i))return!1;const n=e[i],s=t[i];if(F(n)&&F(s)){if(!U(n,s))return!1}else if(n!==s)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function F(e){return null!==e&&"object"===typeof e}
/**
 * @license
 * Copyright 2022 Google LLC
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
 * Copyright 2017 Google LLC
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
function V(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function j(e){const t={},n=e.replace(/^\?/,"").split("&");return n.forEach(e=>{if(e){const[n,r]=e.split("=");t[decodeURIComponent(n)]=decodeURIComponent(r)}}),t}function B(e){const t=e.indexOf("?");if(!t)return"";const n=e.indexOf("#",t);return e.substring(t,n>0?n:void 0)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function $(e,t){const n=new q(e,t);return n.subscribe.bind(n)}class q{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=K(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=W),void 0===r.error&&(r.error=W),void 0===r.complete&&(r.complete=W);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}}),this.observers.push(r),i}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!==typeof console&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function K(e,t){if("object"!==typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"===typeof e[n])return!0;return!1}function W(){}
/**
 * @license
 * Copyright 2017 Google LLC
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
function G(e){return e&&e._delegate?e._delegate:e}},751:function(e,t,n){"use strict";n.d(t,{D$:function(){return ae},Ef:function(){return de},Jo:function(){return H},XL:function(){return Y},hp:function(){return ne},jR:function(){return ce},lH:function(){return Q},u1:function(){return J}});var r=n(641),i=n(33);n(953);
/**
* @vue/runtime-dom v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let s;const o="undefined"!==typeof window&&window.trustedTypes;if(o)try{s=o.createPolicy("vue",{createHTML:e=>e})}catch(me){}const a=s?e=>s.createHTML(e):e=>e,u="http://www.w3.org/2000/svg",c="http://www.w3.org/1998/Math/MathML",l="undefined"!==typeof document?document:null,h=l&&l.createElement("template"),f={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{const i="svg"===t?l.createElementNS(u,e):"mathml"===t?l.createElementNS(c,e):n?l.createElement(e,{is:n}):l.createElement(e);return"select"===e&&r&&null!=r.multiple&&i.setAttribute("multiple",r.multiple),i},createText:e=>l.createTextNode(e),createComment:e=>l.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>l.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,r,i,s){const o=n?n.previousSibling:t.lastChild;if(i&&(i===s||i.nextSibling)){while(1)if(t.insertBefore(i.cloneNode(!0),n),i===s||!(i=i.nextSibling))break}else{h.innerHTML=a("svg"===r?`<svg>${e}</svg>`:"mathml"===r?`<math>${e}</math>`:e);const i=h.content;if("svg"===r||"mathml"===r){const e=i.firstChild;while(e.firstChild)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},d=Symbol("_vtc"),p={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String};r.QP;function g(e,t,n){const r=e[d];r&&(t=(t?[t,...r]:[...r]).join(" ")),null==t?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}const m=Symbol("_vod"),v=Symbol("_vsh");const y=Symbol("");const _=/(?:^|;)\s*display\s*:/;function w(e,t,n){const r=e.style,s=(0,i.Kg)(n);let o=!1;if(n&&!s){if(t)if((0,i.Kg)(t))for(const e of t.split(";")){const t=e.slice(0,e.indexOf(":")).trim();null==n[t]&&E(r,t,"")}else for(const e in t)null==n[e]&&E(r,e,"");for(const e in n)"display"===e&&(o=!0),E(r,e,n[e])}else if(s){if(t!==n){const e=r[y];e&&(n+=";"+e),r.cssText=n,o=_.test(n)}}else t&&e.removeAttribute("style");m in e&&(e[m]=o?r.display:"",e[v]&&(r.display="none"))}const b=/\s*!important$/;function E(e,t,n){if((0,i.cy)(n))n.forEach(n=>E(e,t,n));else if(null==n&&(n=""),t.startsWith("--"))e.setProperty(t,n);else{const r=S(e,t);b.test(n)?e.setProperty((0,i.Tg)(r),n.replace(b,""),"important"):e[r]=n}}const T=["Webkit","Moz","ms"],I={};function S(e,t){const n=I[t];if(n)return n;let r=(0,i.PT)(t);if("filter"!==r&&r in e)return I[t]=r;r=(0,i.ZH)(r);for(let i=0;i<T.length;i++){const n=T[i]+r;if(n in e)return I[t]=n}return t}const C="http://www.w3.org/1999/xlink";function A(e,t,n,r,s,o=(0,i.J$)(t)){r&&t.startsWith("xlink:")?null==n?e.removeAttributeNS(C,t.slice(6,t.length)):e.setAttributeNS(C,t,n):null==n||o&&!(0,i.Y2)(n)?e.removeAttribute(t):e.setAttribute(t,o?"":(0,i.Bm)(n)?String(n):n)}function k(e,t,n,r,s){if("innerHTML"===t||"textContent"===t)return void(null!=n&&(e[t]="innerHTML"===t?a(n):n));const o=e.tagName;if("value"===t&&"PROGRESS"!==o&&!o.includes("-")){const r="OPTION"===o?e.getAttribute("value")||"":e.value,i=null==n?"checkbox"===e.type?"on":"":String(n);return r===i&&"_value"in e||(e.value=i),null==n&&e.removeAttribute(t),void(e._value=n)}let u=!1;if(""===n||null==n){const r=typeof e[t];"boolean"===r?n=(0,i.Y2)(n):null==n&&"string"===r?(n="",u=!0):"number"===r&&(n=0,u=!0)}try{e[t]=n}catch(me){0}u&&e.removeAttribute(s||t)}function R(e,t,n,r){e.addEventListener(t,n,r)}function O(e,t,n,r){e.removeEventListener(t,n,r)}const N=Symbol("_vei");function D(e,t,n,r,i=null){const s=e[N]||(e[N]={}),o=s[t];if(r&&o)o.value=r;else{const[n,a]=P(t);if(r){const o=s[t]=F(r,i);R(e,n,o,a)}else o&&(O(e,n,o,a),s[t]=void 0)}}const x=/(?:Once|Passive|Capture)$/;function P(e){let t;if(x.test(e)){let n;t={};while(n=e.match(x))e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}const n=":"===e[2]?e.slice(3):(0,i.Tg)(e.slice(2));return[n,t]}let L=0;const M=Promise.resolve(),U=()=>L||(M.then(()=>L=0),L=Date.now());function F(e,t){const n=e=>{if(e._vts){if(e._vts<=n.attached)return}else e._vts=Date.now();(0,r.qL)(V(e,n.value),t,5,[e])};return n.value=e,n.attached=U(),n}function V(e,t){if((0,i.cy)(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(e=>t=>!t._stopped&&e&&e(t))}return t}const j=e=>111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,B=(e,t,n,r,s,o)=>{const a="svg"===s;"class"===t?g(e,r,a):"style"===t?w(e,n,r):(0,i.Mp)(t)?(0,i.CP)(t)||D(e,t,n,r,o):("."===t[0]?(t=t.slice(1),1):"^"===t[0]?(t=t.slice(1),0):$(e,t,r,a))?(k(e,t,r),e.tagName.includes("-")||"value"!==t&&"checked"!==t&&"selected"!==t||A(e,t,r,a,o,"value"!==t)):!e._isVueCE||!/[A-Z]/.test(t)&&(0,i.Kg)(r)?("true-value"===t?e._trueValue=r:"false-value"===t&&(e._falseValue=r),A(e,t,r,a)):k(e,(0,i.PT)(t),r,o,t)};function $(e,t,n,r){if(r)return"innerHTML"===t||"textContent"===t||!!(t in e&&j(t)&&(0,i.Tn)(n));if("spellcheck"===t||"draggable"===t||"translate"===t||"autocorrect"===t)return!1;if("sandbox"===t&&"IFRAME"===e.tagName)return!1;if("form"===t)return!1;if("list"===t&&"INPUT"===e.tagName)return!1;if("type"===t&&"TEXTAREA"===e.tagName)return!1;if("width"===t||"height"===t){const t=e.tagName;if("IMG"===t||"VIDEO"===t||"CANVAS"===t||"SOURCE"===t)return!1}return(!j(t)||!(0,i.Kg)(n))&&t in e}"undefined"!==typeof HTMLElement&&HTMLElement;Symbol("_moveCb"),Symbol("_enterCb");const q=e=>{const t=e.props["onUpdate:modelValue"]||!1;return(0,i.cy)(t)?e=>(0,i.DY)(t,e):t};function K(e){e.target.composing=!0}function W(e){const t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event("input")))}const G=Symbol("_assign");function z(e,t,n){return t&&(e=e.trim()),n&&(e=(0,i.bB)(e)),e}const H={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e[G]=q(i);const s=r||i.props&&"number"===i.props.type;R(e,t?"change":"input",t=>{t.target.composing||e[G](z(e.value,n,s))}),(n||s)&&R(e,"change",()=>{e.value=z(e.value,n,s)}),t||(R(e,"compositionstart",K),R(e,"compositionend",W),R(e,"change",W))},mounted(e,{value:t}){e.value=null==t?"":t},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:s,number:o}},a){if(e[G]=q(a),e.composing)return;const u=!o&&"number"!==e.type||/^0\d/.test(e.value)?e.value:(0,i.bB)(e.value),c=null==t?"":t;if(u!==c){if(document.activeElement===e&&"range"!==e.type){if(r&&t===n)return;if(s&&e.value.trim()===c)return}e.value=c}}},Q={deep:!0,created(e,t,n){e[G]=q(n),R(e,"change",()=>{const t=e._modelValue,n=ee(e),r=e.checked,s=e[G];if((0,i.cy)(t)){const e=(0,i.u3)(t,n),o=-1!==e;if(r&&!o)s(t.concat(n));else if(!r&&o){const n=[...t];n.splice(e,1),s(n)}}else if((0,i.vM)(t)){const e=new Set(t);r?e.add(n):e.delete(n),s(e)}else s(te(e,r))})},mounted:X,beforeUpdate(e,t,n){e[G]=q(n),X(e,t,n)}};function X(e,{value:t,oldValue:n},r){let s;if(e._modelValue=t,(0,i.cy)(t))s=(0,i.u3)(t,r.props.value)>-1;else if((0,i.vM)(t))s=t.has(r.props.value);else{if(t===n)return;s=(0,i.BX)(t,te(e,!0))}e.checked!==s&&(e.checked=s)}const Y={created(e,{value:t},n){e.checked=(0,i.BX)(t,n.props.value),e[G]=q(n),R(e,"change",()=>{e[G](ee(e))})},beforeUpdate(e,{value:t,oldValue:n},r){e[G]=q(r),t!==n&&(e.checked=(0,i.BX)(t,r.props.value))}},J={deep:!0,created(e,{value:t,modifiers:{number:n}},s){const o=(0,i.vM)(t);R(e,"change",()=>{const t=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?(0,i.bB)(ee(e)):ee(e));e[G](e.multiple?o?new Set(t):t:t[0]),e._assigning=!0,(0,r.dY)(()=>{e._assigning=!1})}),e[G]=q(s)},mounted(e,{value:t}){Z(e,t)},beforeUpdate(e,t,n){e[G]=q(n)},updated(e,{value:t}){e._assigning||Z(e,t)}};function Z(e,t){const n=e.multiple,r=(0,i.cy)(t);if(!n||r||(0,i.vM)(t)){for(let s=0,o=e.options.length;s<o;s++){const o=e.options[s],a=ee(o);if(n)if(r){const e=typeof a;o.selected="string"===e||"number"===e?t.some(e=>String(e)===String(a)):(0,i.u3)(t,a)>-1}else o.selected=t.has(a);else if((0,i.BX)(ee(o),t))return void(e.selectedIndex!==s&&(e.selectedIndex=s))}n||-1===e.selectedIndex||(e.selectedIndex=-1)}}function ee(e){return"_value"in e?e._value:e.value}function te(e,t){const n=t?"_trueValue":"_falseValue";return n in e?e[n]:t}const ne={created(e,t,n){ie(e,t,n,null,"created")},mounted(e,t,n){ie(e,t,n,null,"mounted")},beforeUpdate(e,t,n,r){ie(e,t,n,r,"beforeUpdate")},updated(e,t,n,r){ie(e,t,n,r,"updated")}};function re(e,t){switch(e){case"SELECT":return J;case"TEXTAREA":return H;default:switch(t){case"checkbox":return Q;case"radio":return Y;default:return H}}}function ie(e,t,n,r,i){const s=re(e.tagName,n.props&&n.props.type),o=s[i];o&&o(e,t,n,r)}const se=["ctrl","shift","alt","meta"],oe={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&0!==e.button,middle:e=>"button"in e&&1!==e.button,right:e=>"button"in e&&2!==e.button,exact:(e,t)=>se.some(n=>e[`${n}Key`]&&!t.includes(n))},ae=(e,t)=>{const n=e._withMods||(e._withMods={}),r=t.join(".");return n[r]||(n[r]=(n,...r)=>{for(let e=0;e<t.length;e++){const r=oe[t[e]];if(r&&r(n,t))return}return e(n,...r)})},ue={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},ce=(e,t)=>{const n=e._withKeys||(e._withKeys={}),r=t.join(".");return n[r]||(n[r]=n=>{if(!("key"in n))return;const r=(0,i.Tg)(n.key);return t.some(e=>e===r||ue[e]===r)?e(n):void 0})},le=(0,i.X$)({patchProp:B},f);let he;function fe(){return he||(he=(0,r.K9)(le))}const de=(...e)=>{const t=fe().createApp(...e);const{mount:n}=t;return t.mount=e=>{const r=ge(e);if(!r)return;const s=t._component;(0,i.Tn)(s)||s.render||s.template||(s.template=r.innerHTML),1===r.nodeType&&(r.textContent="");const o=n(r,!1,pe(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},t};function pe(e){return e instanceof SVGElement?"svg":"function"===typeof MathMLElement&&e instanceof MathMLElement?"mathml":void 0}function ge(e){if((0,i.Kg)(e)){const t=document.querySelector(e);return t}return e}},770:function(e,t,n){"use strict";n.d(t,{lG:function(){return Oe},Lj:function(){return Ne},L3:function(){return De}});var r=n(641),i=n(953),s=n(146);function o(e,t,n,i){s._.isServer||(0,r.nT)(r=>{e=null!=e?e:window,e.addEventListener(t,n,i),r(()=>e.removeEventListener(t,n,i))})}function a(e,t,n){s._.isServer||(0,r.nT)(r=>{window.addEventListener(e,t,n),r(()=>window.removeEventListener(e,t,n))})}var u=(e=>(e[e.Forwards=0]="Forwards",e[e.Backwards=1]="Backwards",e))(u||{});function c(){let e=(0,i.KR)(0);return a("keydown",t=>{"Tab"===t.key&&(e.value=t.shiftKey?1:0)}),e}var l=n(605),h=(e=>(e[e.None=1]="None",e[e.Focusable=2]="Focusable",e[e.Hidden=4]="Hidden",e))(h||{});let f=(0,r.pM)({name:"Hidden",props:{as:{type:[Object,String],default:"div"},features:{type:Number,default:1}},setup(e,{slots:t,attrs:n}){return()=>{var r;let{features:i,...s}=e,o={"aria-hidden":2===(2&i)||(null!=(r=s["aria-hidden"])?r:void 0),hidden:4===(4&i)||void 0,style:{position:"fixed",top:1,left:1,width:1,height:0,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0",...4===(4&i)&&2!==(2&i)&&{display:"none"}}};return(0,l.XX)({ourProps:o,theirProps:s,slot:{},attrs:n,slots:t,name:"Hidden"})}}});function d(e){function t(){"loading"!==document.readyState&&(e(),document.removeEventListener("DOMContentLoaded",t))}"undefined"!=typeof window&&"undefined"!=typeof document&&(document.addEventListener("DOMContentLoaded",t),t())}let p=[];d(()=>{function e(e){e.target instanceof HTMLElement&&e.target!==document.body&&p[0]!==e.target&&(p.unshift(e.target),p=p.filter(e=>null!=e&&e.isConnected),p.splice(10))}window.addEventListener("click",e,{capture:!0}),window.addEventListener("mousedown",e,{capture:!0}),window.addEventListener("focus",e,{capture:!0}),document.body.addEventListener("click",e,{capture:!0}),document.body.addEventListener("mousedown",e,{capture:!0}),document.body.addEventListener("focus",e,{capture:!0})});var g=n(413),m=n(388);function v(e){if(s._.isServer)return null;if(e instanceof Node)return e.ownerDocument;if(null!=e&&e.hasOwnProperty("value")){let t=(0,g.t)(e);if(t)return t.ownerDocument}return document}let y=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var _=(e=>(e[e.First=1]="First",e[e.Previous=2]="Previous",e[e.Next=4]="Next",e[e.Last=8]="Last",e[e.WrapAround=16]="WrapAround",e[e.NoScroll=32]="NoScroll",e))(_||{}),w=(e=>(e[e.Error=0]="Error",e[e.Overflow=1]="Overflow",e[e.Success=2]="Success",e[e.Underflow=3]="Underflow",e))(w||{}),b=(e=>(e[e.Previous=-1]="Previous",e[e.Next=1]="Next",e))(b||{});function E(e=document.body){return null==e?[]:Array.from(e.querySelectorAll(y)).sort((e,t)=>Math.sign((e.tabIndex||Number.MAX_SAFE_INTEGER)-(t.tabIndex||Number.MAX_SAFE_INTEGER)))}var T=(e=>(e[e.Strict=0]="Strict",e[e.Loose=1]="Loose",e))(T||{});function I(e,t=0){var n;return e!==(null==(n=v(e))?void 0:n.body)&&(0,m.Y)(t,{[0](){return e.matches(y)},[1](){let t=e;for(;null!==t;){if(t.matches(y))return!0;t=t.parentElement}return!1}})}var S=(e=>(e[e.Keyboard=0]="Keyboard",e[e.Mouse=1]="Mouse",e))(S||{});function C(e){null==e||e.focus({preventScroll:!0})}"undefined"!=typeof window&&"undefined"!=typeof document&&(document.addEventListener("keydown",e=>{e.metaKey||e.altKey||e.ctrlKey||(document.documentElement.dataset.headlessuiFocusVisible="")},!0),document.addEventListener("click",e=>{1===e.detail?delete document.documentElement.dataset.headlessuiFocusVisible:0===e.detail&&(document.documentElement.dataset.headlessuiFocusVisible="")},!0));let A=["textarea","input"].join(",");function k(e){var t,n;return null!=(n=null==(t=null==e?void 0:e.matches)?void 0:t.call(e,A))&&n}function R(e,t=e=>e){return e.slice().sort((e,n)=>{let r=t(e),i=t(n);if(null===r||null===i)return 0;let s=r.compareDocumentPosition(i);return s&Node.DOCUMENT_POSITION_FOLLOWING?-1:s&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function O(e,t,{sorted:n=!0,relativeTo:r=null,skipElements:i=[]}={}){var s;let o=null!=(s=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:null==e?void 0:e.ownerDocument)?s:document,a=Array.isArray(e)?n?R(e):e:E(e);i.length>0&&a.length>1&&(a=a.filter(e=>!i.includes(e))),r=null!=r?r:o.activeElement;let u,c=(()=>{if(5&t)return 1;if(10&t)return-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),l=(()=>{if(1&t)return 0;if(2&t)return Math.max(0,a.indexOf(r))-1;if(4&t)return Math.max(0,a.indexOf(r))+1;if(8&t)return a.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),h=32&t?{preventScroll:!0}:{},f=0,d=a.length;do{if(f>=d||f+d<=0)return 0;let e=l+f;if(16&t)e=(e+d)%d;else{if(e<0)return 3;if(e>=d)return 1}u=a[e],null==u||u.focus(h),f+=c}while(u!==o.activeElement);return 6&t&&k(u)&&u.select(),2}var N=n(827);function D(e){if(!e)return new Set;if("function"==typeof e)return new Set(e());let t=new Set;for(let n of e.value){let e=(0,g.t)(n);e instanceof HTMLElement&&t.add(e)}return t}var x=(e=>(e[e.None=1]="None",e[e.InitialFocus=2]="InitialFocus",e[e.TabLock=4]="TabLock",e[e.FocusLock=8]="FocusLock",e[e.RestoreFocus=16]="RestoreFocus",e[e.All=30]="All",e))(x||{});let P=Object.assign((0,r.pM)({name:"FocusTrap",props:{as:{type:[Object,String],default:"div"},initialFocus:{type:Object,default:null},features:{type:Number,default:30},containers:{type:[Object,Function],default:(0,i.KR)(new Set)}},inheritAttrs:!1,setup(e,{attrs:t,slots:n,expose:s}){let o=(0,i.KR)(null);s({el:o,$el:o});let a=(0,r.EW)(()=>v(o)),d=(0,i.KR)(!1);(0,r.sV)(()=>d.value=!0),(0,r.hi)(()=>d.value=!1),M({ownerDocument:a},(0,r.EW)(()=>d.value&&Boolean(16&e.features)));let p=U({ownerDocument:a,container:o,initialFocus:(0,r.EW)(()=>e.initialFocus)},(0,r.EW)(()=>d.value&&Boolean(2&e.features)));F({ownerDocument:a,container:o,containers:e.containers,previousActiveElement:p},(0,r.EW)(()=>d.value&&Boolean(8&e.features)));let y=c();function w(e){let t=(0,g.t)(o);t&&(e=>{e()})(()=>{(0,m.Y)(y.value,{[u.Forwards]:()=>{O(t,_.First,{skipElements:[e.relatedTarget]})},[u.Backwards]:()=>{O(t,_.Last,{skipElements:[e.relatedTarget]})}})})}let b=(0,i.KR)(!1);function E(e){"Tab"===e.key&&(b.value=!0,requestAnimationFrame(()=>{b.value=!1}))}function T(t){if(!d.value)return;let n=D(e.containers);(0,g.t)(o)instanceof HTMLElement&&n.add((0,g.t)(o));let r=t.relatedTarget;r instanceof HTMLElement&&"true"!==r.dataset.headlessuiFocusGuard&&(V(n,r)||(b.value?O((0,g.t)(o),(0,m.Y)(y.value,{[u.Forwards]:()=>_.Next,[u.Backwards]:()=>_.Previous})|_.WrapAround,{relativeTo:t.target}):t.target instanceof HTMLElement&&C(t.target)))}return()=>{let i={},s={ref:o,onKeydown:E,onFocusout:T},{features:a,initialFocus:u,containers:c,...d}=e;return(0,r.h)(r.FK,[Boolean(4&a)&&(0,r.h)(f,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:w,features:h.Focusable}),(0,l.XX)({ourProps:s,theirProps:{...t,...d},slot:i,attrs:t,slots:n,name:"FocusTrap"}),Boolean(4&a)&&(0,r.h)(f,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:w,features:h.Focusable})])}}}),{features:x});function L(e){let t=(0,i.KR)(p.slice());return(0,r.wB)([e],([e],[n])=>{!0===n&&!1===e?(0,N._)(()=>{t.value.splice(0)}):!1===n&&!0===e&&(t.value=p.slice())},{flush:"post"}),()=>{var e;return null!=(e=t.value.find(e=>null!=e&&e.isConnected))?e:null}}function M({ownerDocument:e},t){let n=L(t);(0,r.sV)(()=>{(0,r.nT)(()=>{var r,i;t.value||(null==(r=e.value)?void 0:r.activeElement)===(null==(i=e.value)?void 0:i.body)&&C(n())},{flush:"post"})}),(0,r.hi)(()=>{t.value&&C(n())})}function U({ownerDocument:e,container:t,initialFocus:n},s){let o=(0,i.KR)(null),a=(0,i.KR)(!1);return(0,r.sV)(()=>a.value=!0),(0,r.hi)(()=>a.value=!1),(0,r.sV)(()=>{(0,r.wB)([t,n,s],(r,i)=>{if(r.every((e,t)=>(null==i?void 0:i[t])===e)||!s.value)return;let u=(0,g.t)(t);u&&(0,N._)(()=>{var t,r;if(!a.value)return;let i=(0,g.t)(n),s=null==(t=e.value)?void 0:t.activeElement;if(i){if(i===s)return void(o.value=s)}else if(u.contains(s))return void(o.value=s);i?C(i):O(u,_.First|_.NoScroll)===w.Error&&console.warn("There are no focusable elements inside the <FocusTrap />"),o.value=null==(r=e.value)?void 0:r.activeElement})},{immediate:!0,flush:"post"})}),o}function F({ownerDocument:e,container:t,containers:n,previousActiveElement:r},i){var s;o(null==(s=e.value)?void 0:s.defaultView,"focus",e=>{if(!i.value)return;let s=D(n);(0,g.t)(t)instanceof HTMLElement&&s.add((0,g.t)(t));let o=r.value;if(!o)return;let a=e.target;a&&a instanceof HTMLElement?V(s,a)?(r.value=a,C(a)):(e.preventDefault(),e.stopPropagation(),C(o)):C(r.value)},!0)}function V(e,t){for(let n of e)if(n.contains(t))return!0;return!1}function j(e){let t=(0,i.IJ)(e.getSnapshot());return(0,r.hi)(e.subscribe(()=>{t.value=e.getSnapshot()})),t}var B=n(858);function $(e,t){let n=e(),r=new Set;return{getSnapshot(){return n},subscribe(e){return r.add(e),()=>r.delete(e)},dispatch(e,...i){let s=t[e].call(n,...i);s&&(n=s,r.forEach(e=>e()))}}}function q(){let e;return{before({doc:t}){var n;let r=t.documentElement;e=(null!=(n=t.defaultView)?n:window).innerWidth-r.clientWidth},after({doc:t,d:n}){let r=t.documentElement,i=r.clientWidth-r.offsetWidth,s=e-i;n.style(r,"paddingRight",`${s}px`)}}}function K(){return/iPhone/gi.test(window.navigator.platform)||/Mac/gi.test(window.navigator.platform)&&window.navigator.maxTouchPoints>0}function W(){return/Android/gi.test(window.navigator.userAgent)}function G(){return K()||W()}function z(){return K()?{before({doc:e,d:t,meta:n}){function r(e){return n.containers.flatMap(e=>e()).some(t=>t.contains(e))}t.microTask(()=>{var n;if("auto"!==window.getComputedStyle(e.documentElement).scrollBehavior){let n=(0,B.e)();n.style(e.documentElement,"scrollBehavior","auto"),t.add(()=>t.microTask(()=>n.dispose()))}let i=null!=(n=window.scrollY)?n:window.pageYOffset,s=null;t.addEventListener(e,"click",t=>{if(t.target instanceof HTMLElement)try{let n=t.target.closest("a");if(!n)return;let{hash:i}=new URL(n.href),o=e.querySelector(i);o&&!r(o)&&(s=o)}catch{}},!0),t.addEventListener(e,"touchstart",e=>{if(e.target instanceof HTMLElement)if(r(e.target)){let n=e.target;for(;n.parentElement&&r(n.parentElement);)n=n.parentElement;t.style(n,"overscrollBehavior","contain")}else t.style(e.target,"touchAction","none")}),t.addEventListener(e,"touchmove",e=>{if(e.target instanceof HTMLElement){if("INPUT"===e.target.tagName)return;if(r(e.target)){let t=e.target;for(;t.parentElement&&""!==t.dataset.headlessuiPortal&&!(t.scrollHeight>t.clientHeight||t.scrollWidth>t.clientWidth);)t=t.parentElement;""===t.dataset.headlessuiPortal&&e.preventDefault()}else e.preventDefault()}},{passive:!1}),t.add(()=>{var e;let t=null!=(e=window.scrollY)?e:window.pageYOffset;i!==t&&window.scrollTo(0,i),s&&s.isConnected&&(s.scrollIntoView({block:"nearest"}),s=null)})})}}:{}}function H(){return{before({doc:e,d:t}){t.style(e.documentElement,"overflow","hidden")}}}function Q(e){let t={};for(let n of e)Object.assign(t,n(t));return t}let X=$(()=>new Map,{PUSH(e,t){var n;let r=null!=(n=this.get(e))?n:{doc:e,count:0,d:(0,B.e)(),meta:new Set};return r.count++,r.meta.add(t),this.set(e,r),this},POP(e,t){let n=this.get(e);return n&&(n.count--,n.meta.delete(t)),this},SCROLL_PREVENT({doc:e,d:t,meta:n}){let r={doc:e,d:t,meta:Q(n)},i=[z(),q(),H()];i.forEach(({before:e})=>null==e?void 0:e(r)),i.forEach(({after:e})=>null==e?void 0:e(r))},SCROLL_ALLOW({d:e}){e.dispose()},TEARDOWN({doc:e}){this.delete(e)}});function Y(e,t,n){let i=j(X),s=(0,r.EW)(()=>{let t=e.value?i.value.get(e.value):void 0;return!!t&&t.count>0});return(0,r.wB)([e,t],([e,t],[r],i)=>{if(!e||!t)return;X.dispatch("PUSH",e,n);let s=!1;i(()=>{s||(X.dispatch("POP",null!=r?r:e,n),s=!0)})},{immediate:!0}),s}X.subscribe(()=>{let e=X.getSnapshot(),t=new Map;for(let[n]of e)t.set(n,n.documentElement.style.overflow);for(let n of e.values()){let e="hidden"===t.get(n.doc),r=0!==n.count;(r&&!e||!r&&e)&&X.dispatch(n.count>0?"SCROLL_PREVENT":"SCROLL_ALLOW",n),0===n.count&&X.dispatch("TEARDOWN",n)}});var J=n(869);let Z=new Map,ee=new Map;function te(e,t=(0,i.KR)(!0)){(0,r.nT)(n=>{var r;if(!t.value)return;let i=(0,g.t)(e);if(!i)return;n(function(){var e;if(!i)return;let t=null!=(e=ee.get(i))?e:1;if(1===t?ee.delete(i):ee.set(i,t-1),1!==t)return;let n=Z.get(i);n&&(null===n["aria-hidden"]?i.removeAttribute("aria-hidden"):i.setAttribute("aria-hidden",n["aria-hidden"]),i.inert=n.inert,Z.delete(i))});let s=null!=(r=ee.get(i))?r:0;ee.set(i,s+1),0===s&&(Z.set(i,{"aria-hidden":i.getAttribute("aria-hidden"),inert:i.inert}),i.setAttribute("aria-hidden","true"),i.inert=!0)})}function ne(e,t,n){s._.isServer||(0,r.nT)(r=>{document.addEventListener(e,t,n),r(()=>document.removeEventListener(e,t,n))})}function re(e,t,n=(0,r.EW)(()=>!0)){function s(r,i){if(!n.value||r.defaultPrevented)return;let s=i(r);if(null===s||!s.getRootNode().contains(s))return;let o=function e(t){return"function"==typeof t?e(t()):Array.isArray(t)||t instanceof Set?t:[t]}(e);for(let e of o){if(null===e)continue;let t=e instanceof HTMLElement?e:(0,g.t)(e);if(null!=t&&t.contains(s)||r.composed&&r.composedPath().includes(t))return}return!I(s,T.Loose)&&-1!==s.tabIndex&&r.preventDefault(),t(r,s)}let o=(0,i.KR)(null);ne("pointerdown",e=>{var t,r;n.value&&(o.value=(null==(r=null==(t=e.composedPath)?void 0:t.call(e))?void 0:r[0])||e.target)},!0),ne("mousedown",e=>{var t,r;n.value&&(o.value=(null==(r=null==(t=e.composedPath)?void 0:t.call(e))?void 0:r[0])||e.target)},!0),ne("click",e=>{G()||o.value&&(s(e,()=>o.value),o.value=null)},!0),ne("touchend",e=>s(e,()=>e.target instanceof HTMLElement?e.target:null),!0),a("blur",e=>s(e,()=>window.document.activeElement instanceof HTMLIFrameElement?window.document.activeElement:null),!0)}function ie({defaultContainers:e=[],portals:t,mainTreeNodeRef:n}={}){let s=(0,i.KR)(null),o=v(s);function a(){var n,r,i;let a=[];for(let t of e)null!==t&&(t instanceof HTMLElement?a.push(t):"value"in t&&t.value instanceof HTMLElement&&a.push(t.value));if(null!=t&&t.value)for(let e of t.value)a.push(e);for(let e of null!=(n=null==o?void 0:o.querySelectorAll("html > *, body > *"))?n:[])e!==document.body&&e!==document.head&&e instanceof HTMLElement&&"headlessui-portal-root"!==e.id&&(e.contains((0,g.t)(s))||e.contains(null==(i=null==(r=(0,g.t)(s))?void 0:r.getRootNode())?void 0:i.host)||a.some(t=>e.contains(t))||a.push(e));return a}return{resolveContainers:a,contains(e){return a().some(t=>t.contains(e))},mainTreeNodeRef:s,MainTreeNode(){return null!=n?null:(0,r.h)(f,{features:h.Hidden,ref:s})}}}var se=n(14);let oe=Symbol("ForcePortalRootContext");function ae(){return(0,r.WQ)(oe,!1)}let ue=(0,r.pM)({name:"ForcePortalRoot",props:{as:{type:[Object,String],default:"template"},force:{type:Boolean,default:!1}},setup(e,{slots:t,attrs:n}){return(0,r.Gt)(oe,e.force),()=>{let{force:r,...i}=e;return(0,l.XX)({theirProps:i,ourProps:{},slot:{},slots:t,attrs:n,name:"ForcePortalRoot"})}}}),ce=Symbol("StackContext");var le=(e=>(e[e.Add=0]="Add",e[e.Remove=1]="Remove",e))(le||{});function he(){return(0,r.WQ)(ce,()=>{})}function fe({type:e,enabled:t,element:n,onUpdate:i}){let s=he();function o(...e){null==i||i(...e),s(...e)}(0,r.sV)(()=>{(0,r.wB)(t,(t,r)=>{t?o(0,e,n):!0===r&&o(1,e,n)},{immediate:!0,flush:"sync"})}),(0,r.hi)(()=>{t.value&&o(1,e,n)}),(0,r.Gt)(ce,o)}var de=(e=>(e.Space=" ",e.Enter="Enter",e.Escape="Escape",e.Backspace="Backspace",e.Delete="Delete",e.ArrowLeft="ArrowLeft",e.ArrowUp="ArrowUp",e.ArrowRight="ArrowRight",e.ArrowDown="ArrowDown",e.Home="Home",e.End="End",e.PageUp="PageUp",e.PageDown="PageDown",e.Tab="Tab",e))(de||{});let pe=Symbol("DescriptionContext");function ge(){let e=(0,r.WQ)(pe,null);if(null===e)throw new Error("Missing parent");return e}function me({slot:e=(0,i.KR)({}),name:t="Description",props:n={}}={}){let s=(0,i.KR)([]);function o(e){return s.value.push(e),()=>{let t=s.value.indexOf(e);-1!==t&&s.value.splice(t,1)}}return(0,r.Gt)(pe,{register:o,slot:e,name:t,props:n}),(0,r.EW)(()=>s.value.length>0?s.value.join(" "):void 0)}(0,r.pM)({name:"Description",props:{as:{type:[Object,String],default:"p"},id:{type:String,default:null}},setup(e,{attrs:t,slots:n}){var s;let o=null!=(s=e.id)?s:`headlessui-description-${(0,J.B)()}`,a=ge();return(0,r.sV)(()=>(0,r.hi)(a.register(o))),()=>{let{name:r="Description",slot:s=(0,i.KR)({}),props:u={}}=a,{...c}=e,h={...Object.entries(u).reduce((e,[t,n])=>Object.assign(e,{[t]:(0,i.R1)(n)}),{}),id:o};return(0,l.XX)({ourProps:h,theirProps:c,slot:s.value,attrs:t,slots:n,name:r})}}});function ve(e){let t=v(e);if(!t){if(null===e)return null;throw new Error(`[Headless UI]: Cannot find ownerDocument for contextElement: ${e}`)}let n=t.getElementById("headlessui-portal-root");if(n)return n;let r=t.createElement("div");return r.setAttribute("id","headlessui-portal-root"),t.body.appendChild(r)}const ye=new WeakMap;function _e(e){var t;return null!=(t=ye.get(e))?t:0}function we(e,t){let n=t(_e(e));return n<=0?ye.delete(e):ye.set(e,n),n}let be=(0,r.pM)({name:"Portal",props:{as:{type:[Object,String],default:"div"}},setup(e,{slots:t,attrs:n}){let s=(0,i.KR)(null),o=(0,r.EW)(()=>v(s)),a=ae(),u=(0,r.WQ)(Ie,null),c=(0,i.KR)(!0===a||null==u?ve(s.value):u.resolveTarget());c.value&&we(c.value,e=>e+1);let h=(0,i.KR)(!1);(0,r.sV)(()=>{h.value=!0}),(0,r.nT)(()=>{a||null!=u&&(c.value=u.resolveTarget())});let f=(0,r.WQ)(Ee,null),d=!1,p=(0,r.nI)();return(0,r.wB)(s,()=>{if(d||!f)return;let e=(0,g.t)(s);e&&((0,r.hi)(f.register(e),p),d=!0)}),(0,r.hi)(()=>{var e,t;let n=null==(e=o.value)?void 0:e.getElementById("headlessui-portal-root");!n||c.value!==n||we(c.value,e=>e-1)||c.value.children.length>0||null==(t=c.value.parentElement)||t.removeChild(c.value)}),()=>{if(!h.value||null===c.value)return null;let i={ref:s,"data-headlessui-portal":""};return(0,r.h)(r.Im,{to:c.value},(0,l.XX)({ourProps:i,theirProps:e,slot:{},attrs:n,slots:t,name:"Portal"}))}}}),Ee=Symbol("PortalParentContext");function Te(){let e=(0,r.WQ)(Ee,null),t=(0,i.KR)([]);function n(n){return t.value.push(n),e&&e.register(n),()=>s(n)}function s(n){let r=t.value.indexOf(n);-1!==r&&t.value.splice(r,1),e&&e.unregister(n)}let o={register:n,unregister:s,portals:t};return[t,(0,r.pM)({name:"PortalWrapper",setup(e,{slots:t}){return(0,r.Gt)(Ee,o),()=>{var e;return null==(e=t.default)?void 0:e.call(t)}}})]}let Ie=Symbol("PortalGroupContext"),Se=(0,r.pM)({name:"PortalGroup",props:{as:{type:[Object,String],default:"template"},target:{type:Object,default:null}},setup(e,{attrs:t,slots:n}){let s=(0,i.Kh)({resolveTarget(){return e.target}});return(0,r.Gt)(Ie,s),()=>{let{target:r,...i}=e;return(0,l.XX)({theirProps:i,ourProps:{},slot:{},attrs:t,slots:n,name:"PortalGroup"})}}});var Ce=(e=>(e[e.Open=0]="Open",e[e.Closed=1]="Closed",e))(Ce||{});let Ae=Symbol("DialogContext");function ke(e){let t=(0,r.WQ)(Ae,null);if(null===t){let t=new Error(`<${e} /> is missing a parent <Dialog /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(t,ke),t}return t}let Re="DC8F892D-2EBD-447C-A4C8-A03058436FF4",Oe=(0,r.pM)({name:"Dialog",inheritAttrs:!1,props:{as:{type:[Object,String],default:"div"},static:{type:Boolean,default:!1},unmount:{type:Boolean,default:!0},open:{type:[Boolean,String],default:Re},initialFocus:{type:Object,default:null},id:{type:String,default:null},role:{type:String,default:"dialog"}},emits:{close:e=>!0},setup(e,{emit:t,attrs:n,slots:s,expose:a}){var u,c;let h=null!=(u=e.id)?u:`headlessui-dialog-${(0,J.B)()}`,f=(0,i.KR)(!1);(0,r.sV)(()=>{f.value=!0});let d=!1,p=(0,r.EW)(()=>"dialog"===e.role||"alertdialog"===e.role?e.role:(d||(d=!0,console.warn(`Invalid role [${p}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`)),"dialog")),y=(0,i.KR)(0),_=(0,se.O_)(),w=(0,r.EW)(()=>e.open===Re&&null!==_?(_.value&se.Uw.Open)===se.Uw.Open:e.open),b=(0,i.KR)(null),E=(0,r.EW)(()=>v(b));if(a({el:b,$el:b}),e.open===Re&&null===_)throw new Error("You forgot to provide an `open` prop to the `Dialog`.");if("boolean"!=typeof w.value)throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${w.value===Re?void 0:e.open}`);let T=(0,r.EW)(()=>f.value&&w.value?0:1),I=(0,r.EW)(()=>0===T.value),S=(0,r.EW)(()=>y.value>1),C=null!==(0,r.WQ)(Ae,null),[A,k]=Te(),{resolveContainers:R,mainTreeNodeRef:O,MainTreeNode:N}=ie({portals:A,defaultContainers:[(0,r.EW)(()=>{var e;return null!=(e=B.panelRef.value)?e:b.value})]}),D=(0,r.EW)(()=>S.value?"parent":"leaf"),x=(0,r.EW)(()=>null!==_&&(_.value&se.Uw.Closing)===se.Uw.Closing),L=(0,r.EW)(()=>!C&&!x.value&&I.value),M=(0,r.EW)(()=>{var e,t,n;return null!=(n=Array.from(null!=(t=null==(e=E.value)?void 0:e.querySelectorAll("body > *"))?t:[]).find(e=>"headlessui-portal-root"!==e.id&&(e.contains((0,g.t)(O))&&e instanceof HTMLElement)))?n:null});te(M,L);let U=(0,r.EW)(()=>!!S.value||I.value),F=(0,r.EW)(()=>{var e,t,n;return null!=(n=Array.from(null!=(t=null==(e=E.value)?void 0:e.querySelectorAll("[data-headlessui-portal]"))?t:[]).find(e=>e.contains((0,g.t)(O))&&e instanceof HTMLElement))?n:null});te(F,U),fe({type:"Dialog",enabled:(0,r.EW)(()=>0===T.value),element:b,onUpdate:(e,t)=>{if("Dialog"===t)return(0,m.Y)(e,{[le.Add]:()=>y.value+=1,[le.Remove]:()=>y.value-=1})}});let V=me({name:"DialogDescription",slot:(0,r.EW)(()=>({open:w.value}))}),j=(0,i.KR)(null),B={titleId:j,panelRef:(0,i.KR)(null),dialogState:T,setTitleId(e){j.value!==e&&(j.value=e)},close(){t("close",!1)}};(0,r.Gt)(Ae,B);let $=(0,r.EW)(()=>!(!I.value||S.value));re(R,(e,t)=>{e.preventDefault(),B.close(),(0,r.dY)(()=>null==t?void 0:t.focus())},$);let q=(0,r.EW)(()=>!(S.value||0!==T.value));o(null==(c=E.value)?void 0:c.defaultView,"keydown",e=>{q.value&&(e.defaultPrevented||e.key===de.Escape&&(e.preventDefault(),e.stopPropagation(),B.close()))});let K=(0,r.EW)(()=>!(x.value||0!==T.value||C));return Y(E,K,e=>{var t;return{containers:[...null!=(t=e.containers)?t:[],R]}}),(0,r.nT)(e=>{if(0!==T.value)return;let t=(0,g.t)(b);if(!t)return;let n=new ResizeObserver(e=>{for(let t of e){let e=t.target.getBoundingClientRect();0===e.x&&0===e.y&&0===e.width&&0===e.height&&B.close()}});n.observe(t),e(()=>n.disconnect())}),()=>{let{open:t,initialFocus:i,...o}=e,a={...n,ref:b,id:h,role:p.value,"aria-modal":0===T.value||void 0,"aria-labelledby":j.value,"aria-describedby":V.value},u={open:0===T.value};return(0,r.h)(ue,{force:!0},()=>[(0,r.h)(be,()=>(0,r.h)(Se,{target:b.value},()=>(0,r.h)(ue,{force:!1},()=>(0,r.h)(P,{initialFocus:i,containers:R,features:I.value?(0,m.Y)(D.value,{parent:P.features.RestoreFocus,leaf:P.features.All&~P.features.FocusLock}):P.features.None},()=>(0,r.h)(k,{},()=>(0,l.XX)({ourProps:a,theirProps:{...o,...n},slot:u,attrs:n,slots:s,visible:0===T.value,features:l.O5.RenderStrategy|l.O5.Static,name:"Dialog"})))))),(0,r.h)(N)])}}}),Ne=((0,r.pM)({name:"DialogOverlay",props:{as:{type:[Object,String],default:"div"},id:{type:String,default:null}},setup(e,{attrs:t,slots:n}){var r;let i=null!=(r=e.id)?r:`headlessui-dialog-overlay-${(0,J.B)()}`,s=ke("DialogOverlay");function o(e){e.target===e.currentTarget&&(e.preventDefault(),e.stopPropagation(),s.close())}return()=>{let{...r}=e;return(0,l.XX)({ourProps:{id:i,"aria-hidden":!0,onClick:o},theirProps:r,slot:{open:0===s.dialogState.value},attrs:t,slots:n,name:"DialogOverlay"})}}}),(0,r.pM)({name:"DialogBackdrop",props:{as:{type:[Object,String],default:"div"},id:{type:String,default:null}},inheritAttrs:!1,setup(e,{attrs:t,slots:n,expose:s}){var o;let a=null!=(o=e.id)?o:`headlessui-dialog-backdrop-${(0,J.B)()}`,u=ke("DialogBackdrop"),c=(0,i.KR)(null);return s({el:c,$el:c}),(0,r.sV)(()=>{if(null===u.panelRef.value)throw new Error("A <DialogBackdrop /> component is being used, but a <DialogPanel /> component is missing.")}),()=>{let{...i}=e,s={id:a,ref:c,"aria-hidden":!0};return(0,r.h)(ue,{force:!0},()=>(0,r.h)(be,()=>(0,l.XX)({ourProps:s,theirProps:{...t,...i},slot:{open:0===u.dialogState.value},attrs:t,slots:n,name:"DialogBackdrop"})))}}}),(0,r.pM)({name:"DialogPanel",props:{as:{type:[Object,String],default:"div"},id:{type:String,default:null}},setup(e,{attrs:t,slots:n,expose:r}){var i;let s=null!=(i=e.id)?i:`headlessui-dialog-panel-${(0,J.B)()}`,o=ke("DialogPanel");function a(e){e.stopPropagation()}return r({el:o.panelRef,$el:o.panelRef}),()=>{let{...r}=e,i={id:s,ref:o.panelRef,onClick:a};return(0,l.XX)({ourProps:i,theirProps:r,slot:{open:0===o.dialogState.value},attrs:t,slots:n,name:"DialogPanel"})}}})),De=(0,r.pM)({name:"DialogTitle",props:{as:{type:[Object,String],default:"h2"},id:{type:String,default:null}},setup(e,{attrs:t,slots:n}){var i;let s=null!=(i=e.id)?i:`headlessui-dialog-title-${(0,J.B)()}`,o=ke("DialogTitle");return(0,r.sV)(()=>{o.setTitleId(s),(0,r.hi)(()=>o.setTitleId(null))}),()=>{let{...r}=e;return(0,l.XX)({ourProps:{id:s},theirProps:r,slot:{open:0===o.dialogState.value},attrs:t,slots:n,name:"DialogTitle"})}}})},827:function(e,t,n){"use strict";function r(e){"function"==typeof queueMicrotask?queueMicrotask(e):Promise.resolve().then(e).catch(e=>setTimeout(()=>{throw e}))}n.d(t,{_:function(){return r}})},858:function(e,t,n){"use strict";n.d(t,{e:function(){return i}});var r=n(827);function i(){let e=[],t={addEventListener(e,n,r,i){return e.addEventListener(n,r,i),t.add(()=>e.removeEventListener(n,r,i))},requestAnimationFrame(...e){let n=requestAnimationFrame(...e);t.add(()=>cancelAnimationFrame(n))},nextFrame(...e){t.requestAnimationFrame(()=>{t.requestAnimationFrame(...e)})},setTimeout(...e){let n=setTimeout(...e);t.add(()=>clearTimeout(n))},microTask(...e){let n={current:!0};return(0,r._)(()=>{n.current&&e[0]()}),t.add(()=>{n.current=!1})},style(e,t,n){let r=e.style.getPropertyValue(t);return Object.assign(e.style,{[t]:n}),this.add(()=>{Object.assign(e.style,{[t]:r})})},group(e){let t=i();return e(t),this.add(()=>t.dispose())},add(t){return e.push(t),()=>{let n=e.indexOf(t);if(n>=0)for(let t of e.splice(n,1))t()}},dispose(){for(let t of e.splice(0))t()}};return t}},869:function(e,t,n){"use strict";n.d(t,{B:function(){return a}});var r,i=n(641);let s=Symbol("headlessui.useid"),o=0;const a=null!=(r=i.Bi)?r:function(){return i.WQ(s,()=>""+ ++o)()}},884:function(e,t,n){"use strict";n.d(t,{Dc:function(){return H},rJ:function(){return Jo},kd:function(){return cu},H9:function(){return Zo},x7:function(){return iu},GG:function(){return ou},aU:function(){return ra},AB:function(){return Ga},aQ:function(){return lu},My:function(){return Ka},P:function(){return Va},c4:function(){return vu},O5:function(){return yu},BN:function(){return au},mZ:function(){return uu},_M:function(){return Ba},wP:function(){return _u}});var r,i,s=n(928),o=n(125),a=n(424),u=n(743),c="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof window?window:"undefined"!==typeof n.g?n.g:"undefined"!==typeof self?self:{},l={};(function(){var e;
/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(e,t){function n(){}n.prototype=t.prototype,e.D=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.C=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}function n(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}function o(e,t,n){n||(n=0);var r=Array(16);if("string"===typeof t)for(var i=0;16>i;++i)r[i]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(i=0;16>i;++i)r[i]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],i=e.g[2];var s=e.g[3],o=t+(s^n&(i^s))+r[0]+3614090360&4294967295;t=n+(o<<7&4294967295|o>>>25),o=s+(i^t&(n^i))+r[1]+3905402710&4294967295,s=t+(o<<12&4294967295|o>>>20),o=i+(n^s&(t^n))+r[2]+606105819&4294967295,i=s+(o<<17&4294967295|o>>>15),o=n+(t^i&(s^t))+r[3]+3250441966&4294967295,n=i+(o<<22&4294967295|o>>>10),o=t+(s^n&(i^s))+r[4]+4118548399&4294967295,t=n+(o<<7&4294967295|o>>>25),o=s+(i^t&(n^i))+r[5]+1200080426&4294967295,s=t+(o<<12&4294967295|o>>>20),o=i+(n^s&(t^n))+r[6]+2821735955&4294967295,i=s+(o<<17&4294967295|o>>>15),o=n+(t^i&(s^t))+r[7]+4249261313&4294967295,n=i+(o<<22&4294967295|o>>>10),o=t+(s^n&(i^s))+r[8]+1770035416&4294967295,t=n+(o<<7&4294967295|o>>>25),o=s+(i^t&(n^i))+r[9]+2336552879&4294967295,s=t+(o<<12&4294967295|o>>>20),o=i+(n^s&(t^n))+r[10]+4294925233&4294967295,i=s+(o<<17&4294967295|o>>>15),o=n+(t^i&(s^t))+r[11]+2304563134&4294967295,n=i+(o<<22&4294967295|o>>>10),o=t+(s^n&(i^s))+r[12]+1804603682&4294967295,t=n+(o<<7&4294967295|o>>>25),o=s+(i^t&(n^i))+r[13]+4254626195&4294967295,s=t+(o<<12&4294967295|o>>>20),o=i+(n^s&(t^n))+r[14]+2792965006&4294967295,i=s+(o<<17&4294967295|o>>>15),o=n+(t^i&(s^t))+r[15]+1236535329&4294967295,n=i+(o<<22&4294967295|o>>>10),o=t+(i^s&(n^i))+r[1]+4129170786&4294967295,t=n+(o<<5&4294967295|o>>>27),o=s+(n^i&(t^n))+r[6]+3225465664&4294967295,s=t+(o<<9&4294967295|o>>>23),o=i+(t^n&(s^t))+r[11]+643717713&4294967295,i=s+(o<<14&4294967295|o>>>18),o=n+(s^t&(i^s))+r[0]+3921069994&4294967295,n=i+(o<<20&4294967295|o>>>12),o=t+(i^s&(n^i))+r[5]+3593408605&4294967295,t=n+(o<<5&4294967295|o>>>27),o=s+(n^i&(t^n))+r[10]+38016083&4294967295,s=t+(o<<9&4294967295|o>>>23),o=i+(t^n&(s^t))+r[15]+3634488961&4294967295,i=s+(o<<14&4294967295|o>>>18),o=n+(s^t&(i^s))+r[4]+3889429448&4294967295,n=i+(o<<20&4294967295|o>>>12),o=t+(i^s&(n^i))+r[9]+568446438&4294967295,t=n+(o<<5&4294967295|o>>>27),o=s+(n^i&(t^n))+r[14]+3275163606&4294967295,s=t+(o<<9&4294967295|o>>>23),o=i+(t^n&(s^t))+r[3]+4107603335&4294967295,i=s+(o<<14&4294967295|o>>>18),o=n+(s^t&(i^s))+r[8]+1163531501&4294967295,n=i+(o<<20&4294967295|o>>>12),o=t+(i^s&(n^i))+r[13]+2850285829&4294967295,t=n+(o<<5&4294967295|o>>>27),o=s+(n^i&(t^n))+r[2]+4243563512&4294967295,s=t+(o<<9&4294967295|o>>>23),o=i+(t^n&(s^t))+r[7]+1735328473&4294967295,i=s+(o<<14&4294967295|o>>>18),o=n+(s^t&(i^s))+r[12]+2368359562&4294967295,n=i+(o<<20&4294967295|o>>>12),o=t+(n^i^s)+r[5]+4294588738&4294967295,t=n+(o<<4&4294967295|o>>>28),o=s+(t^n^i)+r[8]+2272392833&4294967295,s=t+(o<<11&4294967295|o>>>21),o=i+(s^t^n)+r[11]+1839030562&4294967295,i=s+(o<<16&4294967295|o>>>16),o=n+(i^s^t)+r[14]+4259657740&4294967295,n=i+(o<<23&4294967295|o>>>9),o=t+(n^i^s)+r[1]+2763975236&4294967295,t=n+(o<<4&4294967295|o>>>28),o=s+(t^n^i)+r[4]+1272893353&4294967295,s=t+(o<<11&4294967295|o>>>21),o=i+(s^t^n)+r[7]+4139469664&4294967295,i=s+(o<<16&4294967295|o>>>16),o=n+(i^s^t)+r[10]+3200236656&4294967295,n=i+(o<<23&4294967295|o>>>9),o=t+(n^i^s)+r[13]+681279174&4294967295,t=n+(o<<4&4294967295|o>>>28),o=s+(t^n^i)+r[0]+3936430074&4294967295,s=t+(o<<11&4294967295|o>>>21),o=i+(s^t^n)+r[3]+3572445317&4294967295,i=s+(o<<16&4294967295|o>>>16),o=n+(i^s^t)+r[6]+76029189&4294967295,n=i+(o<<23&4294967295|o>>>9),o=t+(n^i^s)+r[9]+3654602809&4294967295,t=n+(o<<4&4294967295|o>>>28),o=s+(t^n^i)+r[12]+3873151461&4294967295,s=t+(o<<11&4294967295|o>>>21),o=i+(s^t^n)+r[15]+530742520&4294967295,i=s+(o<<16&4294967295|o>>>16),o=n+(i^s^t)+r[2]+3299628645&4294967295,n=i+(o<<23&4294967295|o>>>9),o=t+(i^(n|~s))+r[0]+4096336452&4294967295,t=n+(o<<6&4294967295|o>>>26),o=s+(n^(t|~i))+r[7]+1126891415&4294967295,s=t+(o<<10&4294967295|o>>>22),o=i+(t^(s|~n))+r[14]+2878612391&4294967295,i=s+(o<<15&4294967295|o>>>17),o=n+(s^(i|~t))+r[5]+4237533241&4294967295,n=i+(o<<21&4294967295|o>>>11),o=t+(i^(n|~s))+r[12]+1700485571&4294967295,t=n+(o<<6&4294967295|o>>>26),o=s+(n^(t|~i))+r[3]+2399980690&4294967295,s=t+(o<<10&4294967295|o>>>22),o=i+(t^(s|~n))+r[10]+4293915773&4294967295,i=s+(o<<15&4294967295|o>>>17),o=n+(s^(i|~t))+r[1]+2240044497&4294967295,n=i+(o<<21&4294967295|o>>>11),o=t+(i^(n|~s))+r[8]+1873313359&4294967295,t=n+(o<<6&4294967295|o>>>26),o=s+(n^(t|~i))+r[15]+4264355552&4294967295,s=t+(o<<10&4294967295|o>>>22),o=i+(t^(s|~n))+r[6]+2734768916&4294967295,i=s+(o<<15&4294967295|o>>>17),o=n+(s^(i|~t))+r[13]+1309151649&4294967295,n=i+(o<<21&4294967295|o>>>11),o=t+(i^(n|~s))+r[4]+4149444226&4294967295,t=n+(o<<6&4294967295|o>>>26),o=s+(n^(t|~i))+r[11]+3174756917&4294967295,s=t+(o<<10&4294967295|o>>>22),o=i+(t^(s|~n))+r[2]+718787259&4294967295,i=s+(o<<15&4294967295|o>>>17),o=n+(s^(i|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(i+(o<<21&4294967295|o>>>11))&4294967295,e.g[2]=e.g[2]+i&4294967295,e.g[3]=e.g[3]+s&4294967295}function a(e,t){var n=c;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}function u(e,t){this.h=t;for(var n=[],r=!0,i=e.length-1;0<=i;i--){var s=0|e[i];r&&s==t||(n[i]=s,r=!1)}this.g=n}t(s,n),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},s.prototype.u=function(e,t){void 0===t&&(t=e.length);for(var n=t-this.blockSize,r=this.B,i=this.h,s=0;s<t;){if(0==i)for(;s<=n;)o(this,e,s),s+=this.blockSize;if("string"===typeof e){for(;s<t;)if(r[i++]=e.charCodeAt(s++),i==this.blockSize){o(this,r),i=0;break}}else for(;s<t;)if(r[i++]=e[s++],i==this.blockSize){o(this,r),i=0;break}}this.h=i,this.o+=t},s.prototype.v=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var n=8*this.o;for(t=e.length-8;t<e.length;++t)e[t]=255&n,n/=256;for(this.u(e),e=Array(16),t=n=0;4>t;++t)for(var r=0;32>r;r+=8)e[n++]=this.g[t]>>>r&255;return e};var c={};function h(e){return-128<=e&&128>e?a(e,function(e){return new u([0|e],0>e?-1:0)}):new u([0|e],0>e?-1:0)}function f(e){if(isNaN(e)||!isFinite(e))return p;if(0>e)return _(f(-e));for(var t=[],n=1,r=0;e>=n;r++)t[r]=e/n|0,n*=4294967296;return new u(t,0)}function d(e,t){if(0==e.length)throw Error("number format error: empty string");if(t=t||10,2>t||36<t)throw Error("radix out of range: "+t);if("-"==e.charAt(0))return _(d(e.substring(1),t));if(0<=e.indexOf("-"))throw Error('number format error: interior "-" character');for(var n=f(Math.pow(t,8)),r=p,i=0;i<e.length;i+=8){var s=Math.min(8,e.length-i),o=parseInt(e.substring(i,i+s),t);8>s?(s=f(Math.pow(t,s)),r=r.j(s).add(f(o))):(r=r.j(n),r=r.add(f(o)))}return r}var p=h(0),g=h(1),m=h(16777216);function v(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function y(e){return-1==e.h}function _(e){for(var t=e.g.length,n=[],r=0;r<t;r++)n[r]=~e.g[r];return new u(n,~e.h).add(g)}function w(e,t){return e.add(_(t))}function b(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function E(e,t){this.g=e,this.h=t}function T(e,t){if(v(t))throw Error("division by zero");if(v(e))return new E(p,p);if(y(e))return t=T(_(e),t),new E(_(t.g),_(t.h));if(y(t))return t=T(e,_(t)),new E(_(t.g),t.h);if(30<e.g.length){if(y(e)||y(t))throw Error("slowDivide_ only works with positive integers.");for(var n=g,r=t;0>=r.l(e);)n=I(n),r=I(r);var i=S(n,1),s=S(r,1);for(r=S(r,2),n=S(n,2);!v(r);){var o=s.add(r);0>=o.l(e)&&(i=i.add(n),s=o),r=S(r,1),n=S(n,1)}return t=w(e,i.j(t)),new E(i,t)}for(i=p;0<=e.l(t);){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=Math.ceil(Math.log(n)/Math.LN2),r=48>=r?1:Math.pow(2,r-48),s=f(n),o=s.j(t);y(o)||0<o.l(e);)n-=r,s=f(n),o=s.j(t);v(s)&&(s=g),i=i.add(s),e=w(e,o)}return new E(i,e)}function I(e){for(var t=e.g.length+1,n=[],r=0;r<t;r++)n[r]=e.i(r)<<1|e.i(r-1)>>>31;return new u(n,e.h)}function S(e,t){var n=t>>5;t%=32;for(var r=e.g.length-n,i=[],s=0;s<r;s++)i[s]=0<t?e.i(s+n)>>>t|e.i(s+n+1)<<32-t:e.i(s+n);return new u(i,e.h)}e=u.prototype,e.m=function(){if(y(this))return-_(this).m();for(var e=0,t=1,n=0;n<this.g.length;n++){var r=this.i(n);e+=(0<=r?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if(e=e||10,2>e||36<e)throw Error("radix out of range: "+e);if(v(this))return"0";if(y(this))return"-"+_(this).toString(e);for(var t=f(Math.pow(e,6)),n=this,r="";;){var i=T(n,t).g;n=w(n,i.j(t));var s=((0<n.g.length?n.g[0]:n.h)>>>0).toString(e);if(n=i,v(n))return s+r;for(;6>s.length;)s="0"+s;r=s+r}},e.i=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},e.l=function(e){return e=w(this,e),y(e)?-1:v(e)?0:1},e.abs=function(){return y(this)?_(this):this},e.add=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],r=0,i=0;i<=t;i++){var s=r+(65535&this.i(i))+(65535&e.i(i)),o=(s>>>16)+(this.i(i)>>>16)+(e.i(i)>>>16);r=o>>>16,s&=65535,o&=65535,n[i]=o<<16|s}return new u(n,-2147483648&n[n.length-1]?-1:0)},e.j=function(e){if(v(this)||v(e))return p;if(y(this))return y(e)?_(this).j(_(e)):_(_(this).j(e));if(y(e))return _(this.j(_(e)));if(0>this.l(m)&&0>e.l(m))return f(this.m()*e.m());for(var t=this.g.length+e.g.length,n=[],r=0;r<2*t;r++)n[r]=0;for(r=0;r<this.g.length;r++)for(var i=0;i<e.g.length;i++){var s=this.i(r)>>>16,o=65535&this.i(r),a=e.i(i)>>>16,c=65535&e.i(i);n[2*r+2*i]+=o*c,b(n,2*r+2*i),n[2*r+2*i+1]+=s*c,b(n,2*r+2*i+1),n[2*r+2*i+1]+=o*a,b(n,2*r+2*i+1),n[2*r+2*i+2]+=s*a,b(n,2*r+2*i+2)}for(r=0;r<t;r++)n[r]=n[2*r+1]<<16|n[2*r];for(r=t;r<2*t;r++)n[r]=0;return new u(n,0)},e.A=function(e){return T(this,e).h},e.and=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],r=0;r<t;r++)n[r]=this.i(r)&e.i(r);return new u(n,this.h&e.h)},e.or=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],r=0;r<t;r++)n[r]=this.i(r)|e.i(r);return new u(n,this.h|e.h)},e.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],r=0;r<t;r++)n[r]=this.i(r)^e.i(r);return new u(n,this.h^e.h)},s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,i=l.Md5=s,u.prototype.add=u.prototype.add,u.prototype.multiply=u.prototype.j,u.prototype.modulo=u.prototype.A,u.prototype.compare=u.prototype.l,u.prototype.toNumber=u.prototype.m,u.prototype.toString=u.prototype.toString,u.prototype.getBits=u.prototype.i,u.fromNumber=f,u.fromString=d,r=l.Integer=u}).apply("undefined"!==typeof c?c:"undefined"!==typeof self?self:"undefined"!==typeof window?window:{});var h,f,d,p,g,m,v,y,_="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof window?window:"undefined"!==typeof n.g?n.g:"undefined"!==typeof self?self:{},w={};(function(){var e,t="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,n){return e==Array.prototype||e==Object.prototype||(e[t]=n.value),e};function n(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof _&&_];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}var r=n(this);function i(e,n){if(n)e:{var i=r;e=e.split(".");for(var s=0;s<e.length-1;s++){var o=e[s];if(!(o in i))break e;i=i[o]}e=e[e.length-1],s=i[e],n=n(s),n!=s&&null!=n&&t(i,e,{configurable:!0,writable:!0,value:n})}}function s(e,t){e instanceof String&&(e+="");var n=0,r=!1,i={next:function(){if(!r&&n<e.length){var i=n++;return{value:t(i,e[i]),done:!1}}return r=!0,{done:!0,value:void 0}}};return i[Symbol.iterator]=function(){return i},i}i("Array.prototype.values",function(e){return e||function(){return s(this,function(e,t){return t})}});
/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var o=o||{},a=this||self;function u(e){var t=typeof e;return t="object"!=t?t:e?Array.isArray(e)?"array":t:"null","array"==t||"object"==t&&"number"==typeof e.length}function c(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function l(e,t,n){return e.call.apply(e.bind,arguments)}function E(e,t,n){if(!e)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),e.apply(t,n)}}return function(){return e.apply(t,arguments)}}function T(e,t,n){return T=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?l:E,T.apply(null,arguments)}function S(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function C(e,t){function n(){}n.prototype=t.prototype,e.aa=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Qb=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}function A(e){const t=e.length;if(0<t){const n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function k(e,t){for(let n=1;n<arguments.length;n++){const t=arguments[n];if(u(t)){const n=e.length||0,r=t.length||0;e.length=n+r;for(let i=0;i<r;i++)e[n+i]=t[i]}else e.push(t)}}class R{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}function O(e){return/^[\s\xa0]*$/.test(e)}function N(){var e=a.navigator;return e&&(e=e.userAgent)?e:""}function D(e){return D[" "](e),e}D[" "]=function(){};var x=-1!=N().indexOf("Gecko")&&!(-1!=N().toLowerCase().indexOf("webkit")&&-1==N().indexOf("Edge"))&&!(-1!=N().indexOf("Trident")||-1!=N().indexOf("MSIE"))&&-1==N().indexOf("Edge");function P(e,t,n){for(const r in e)t.call(n,e[r],r,e)}function L(e,t){for(const n in e)t.call(void 0,e[n],n,e)}function M(e){const t={};for(const n in e)t[n]=e[n];return t}const U="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function F(e,t){let n,r;for(let i=1;i<arguments.length;i++){for(n in r=arguments[i],r)e[n]=r[n];for(let t=0;t<U.length;t++)n=U[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function V(e){var t=1;e=e.split(":");const n=[];for(;0<t&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(":")),n}function j(e){a.setTimeout(()=>{throw e},0)}function B(){var e=z;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}class ${constructor(){this.h=this.g=null}add(e,t){const n=q.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}}var q=new R(()=>new K,e=>e.reset());class K{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let W,G=!1,z=new $,H=()=>{const e=a.Promise.resolve(void 0);W=()=>{e.then(Q)}};var Q=()=>{for(var e;e=B();){try{e.h.call(e.g)}catch(n){j(n)}var t=q;t.j(e),100>t.h&&(t.h++,e.next=t.g,t.g=e)}G=!1};function X(){this.s=this.s,this.C=this.C}function Y(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}X.prototype.s=!1,X.prototype.ma=function(){this.s||(this.s=!0,this.N())},X.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},Y.prototype.h=function(){this.defaultPrevented=!0};var J=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const e=()=>{};a.addEventListener("test",e,t),a.removeEventListener("test",e,t)}catch(n){}return e}();function Z(e,t){if(Y.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(x){e:{try{D(t.nodeName);var i=!0;break e}catch(s){}i=!1}i||(t=null)}}else"mouseover"==n?t=e.fromElement:"mouseout"==n&&(t=e.toElement);this.relatedTarget=t,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"===typeof e.pointerType?e.pointerType:ee[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&Z.aa.h.call(this)}}C(Z,Y);var ee={2:"touch",3:"pen",4:"mouse"};Z.prototype.h=function(){Z.aa.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var te="closure_listenable_"+(1e6*Math.random()|0),ne=0;function re(e,t,n,r,i){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=i,this.key=++ne,this.da=this.fa=!1}function ie(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function se(e){this.src=e,this.g={},this.h=0}function oe(e,t){var n=t.type;if(n in e.g){var r,i=e.g[n],s=Array.prototype.indexOf.call(i,t,void 0);(r=0<=s)&&Array.prototype.splice.call(i,s,1),r&&(ie(t),0==e.g[n].length&&(delete e.g[n],e.h--))}}function ae(e,t,n,r){for(var i=0;i<e.length;++i){var s=e[i];if(!s.da&&s.listener==t&&s.capture==!!n&&s.ha==r)return i}return-1}se.prototype.add=function(e,t,n,r,i){var s=e.toString();e=this.g[s],e||(e=this.g[s]=[],this.h++);var o=ae(e,t,r,i);return-1<o?(t=e[o],n||(t.fa=!1)):(t=new re(t,this.src,s,!!r,i),t.fa=n,e.push(t)),t};var ue="closure_lm_"+(1e6*Math.random()|0),ce={};function le(e,t,n,r,i){if(r&&r.once)return de(e,t,n,r,i);if(Array.isArray(t)){for(var s=0;s<t.length;s++)le(e,t[s],n,r,i);return null}return n=we(n),e&&e[te]?e.K(t,n,c(r)?!!r.capture:!!r,i):he(e,t,n,!1,r,i)}function he(e,t,n,r,i,s){if(!t)throw Error("Invalid event type");var o=c(i)?!!i.capture:!!i,a=ye(e);if(a||(e[ue]=a=new se(e)),n=a.add(t,n,r,o,s),n.proxy)return n;if(r=fe(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)J||(i=o),void 0===i&&(i=!1),e.addEventListener(t.toString(),r,i);else if(e.attachEvent)e.attachEvent(me(t.toString()),r);else{if(!e.addListener||!e.removeListener)throw Error("addEventListener and attachEvent are unavailable.");e.addListener(r)}return n}function fe(){function e(n){return t.call(e.src,e.listener,n)}const t=ve;return e}function de(e,t,n,r,i){if(Array.isArray(t)){for(var s=0;s<t.length;s++)de(e,t[s],n,r,i);return null}return n=we(n),e&&e[te]?e.L(t,n,c(r)?!!r.capture:!!r,i):he(e,t,n,!0,r,i)}function pe(e,t,n,r,i){if(Array.isArray(t))for(var s=0;s<t.length;s++)pe(e,t[s],n,r,i);else r=c(r)?!!r.capture:!!r,n=we(n),e&&e[te]?(e=e.i,t=String(t).toString(),t in e.g&&(s=e.g[t],n=ae(s,n,r,i),-1<n&&(ie(s[n]),Array.prototype.splice.call(s,n,1),0==s.length&&(delete e.g[t],e.h--)))):e&&(e=ye(e))&&(t=e.g[t.toString()],e=-1,t&&(e=ae(t,n,r,i)),(n=-1<e?t[e]:null)&&ge(n))}function ge(e){if("number"!==typeof e&&e&&!e.da){var t=e.src;if(t&&t[te])oe(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent(me(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=ye(t))?(oe(n,e),0==n.h&&(n.src=null,t[ue]=null)):ie(e)}}}function me(e){return e in ce?ce[e]:ce[e]="on"+e}function ve(e,t){if(e.da)e=!0;else{t=new Z(t,this);var n=e.listener,r=e.ha||e.src;e.fa&&ge(e),e=n.call(r,t)}return e}function ye(e){return e=e[ue],e instanceof se?e:null}var _e="__closure_events_fn_"+(1e9*Math.random()>>>0);function we(e){return"function"===typeof e?e:(e[_e]||(e[_e]=function(t){return e.handleEvent(t)}),e[_e])}function be(){X.call(this),this.i=new se(this),this.M=this,this.F=null}function Ee(e,t){var n,r=e.F;if(r)for(n=[];r;r=r.F)n.push(r);if(e=e.M,r=t.type||t,"string"===typeof t)t=new Y(t,e);else if(t instanceof Y)t.target=t.target||e;else{var i=t;t=new Y(r,e),F(t,i)}if(i=!0,n)for(var s=n.length-1;0<=s;s--){var o=t.g=n[s];i=Te(o,r,!0,t)&&i}if(o=t.g=e,i=Te(o,r,!0,t)&&i,i=Te(o,r,!1,t)&&i,n)for(s=0;s<n.length;s++)o=t.g=n[s],i=Te(o,r,!1,t)&&i}function Te(e,t,n,r){if(t=e.i.g[String(t)],!t)return!0;t=t.concat();for(var i=!0,s=0;s<t.length;++s){var o=t[s];if(o&&!o.da&&o.capture==n){var a=o.listener,u=o.ha||o.src;o.fa&&oe(e.i,o),i=!1!==a.call(u,r)&&i}}return i&&!r.defaultPrevented}function Ie(e,t,n){if("function"===typeof e)n&&(e=T(e,n));else{if(!e||"function"!=typeof e.handleEvent)throw Error("Invalid listener argument");e=T(e.handleEvent,e)}return 2147483647<Number(t)?-1:a.setTimeout(e,t||0)}function Se(e){e.g=Ie(()=>{e.g=null,e.i&&(e.i=!1,Se(e))},e.l);const t=e.h;e.h=null,e.m.apply(null,t)}C(be,X),be.prototype[te]=!0,be.prototype.removeEventListener=function(e,t,n,r){pe(this,e,t,n,r)},be.prototype.N=function(){if(be.aa.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var n=t.g[e],r=0;r<n.length;r++)ie(n[r]);delete t.g[e],t.h--}}this.F=null},be.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},be.prototype.L=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};class Ce extends X{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:Se(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ae(e){X.call(this),this.h=e,this.g={}}C(Ae,X);var ke=[];function Re(e){P(e.g,function(e,t){this.g.hasOwnProperty(t)&&ge(e)},e),e.g={}}Ae.prototype.N=function(){Ae.aa.N.call(this),Re(this)},Ae.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Oe=a.JSON.stringify,Ne=a.JSON.parse,De=class{stringify(e){return a.JSON.stringify(e,void 0)}parse(e){return a.JSON.parse(e,void 0)}};function xe(){}function Pe(e){return e.h||(e.h=e.i())}function Le(){}xe.prototype.h=null;var Me={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ue(){Y.call(this,"d")}function Fe(){Y.call(this,"c")}C(Ue,Y),C(Fe,Y);var Ve={},je=null;function Be(){return je=je||new be}function $e(e){Y.call(this,Ve.La,e)}function qe(e){const t=Be();Ee(t,new $e(t))}function Ke(e,t){Y.call(this,Ve.STAT_EVENT,e),this.stat=t}function We(e){const t=Be();Ee(t,new Ke(t,e))}function Ge(e,t){Y.call(this,Ve.Ma,e),this.size=t}function ze(e,t){if("function"!==typeof e)throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){e()},t)}function He(){this.g=!0}function Qe(e,t,n,r,i,s){e.info(function(){if(e.g)if(s)for(var o="",a=s.split("&"),u=0;u<a.length;u++){var c=a[u].split("=");if(1<c.length){var l=c[0];c=c[1];var h=l.split("_");o=2<=h.length&&"type"==h[1]?o+(l+"=")+c+"&":o+(l+"=redacted&")}}else o=null;else o=s;return"XMLHTTP REQ ("+r+") [attempt "+i+"]: "+t+"\n"+n+"\n"+o})}function Xe(e,t,n,r,i,s,o){e.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+i+"]: "+t+"\n"+n+"\n"+s+" "+o})}function Ye(e,t,n,r){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+Ze(e,n)+(r?" "+r:"")})}function Je(e,t){e.info(function(){return"TIMEOUT: "+t})}function Ze(e,t){if(!e.g)return t;if(!t)return null;try{var n=JSON.parse(t);if(n)for(e=0;e<n.length;e++)if(Array.isArray(n[e])){var r=n[e];if(!(2>r.length)){var i=r[1];if(Array.isArray(i)&&!(1>i.length)){var s=i[0];if("noop"!=s&&"stop"!=s&&"close"!=s)for(var o=1;o<i.length;o++)i[o]=""}}}return Oe(n)}catch(a){return t}}Ve.La="serverreachability",C($e,Y),Ve.STAT_EVENT="statevent",C(Ke,Y),Ve.Ma="timingevent",C(Ge,Y),He.prototype.xa=function(){this.g=!1},He.prototype.info=function(){};var et,tt={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},nt={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"};function rt(){}function it(e,t,n,r){this.j=e,this.i=t,this.l=n,this.R=r||1,this.U=new Ae(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new st}function st(){this.i=null,this.g="",this.h=!1}C(rt,xe),rt.prototype.g=function(){return new XMLHttpRequest},rt.prototype.i=function(){return{}},et=new rt;var ot={},at={};function ut(e,t,n){e.L=1,e.v=Ut(Dt(t)),e.m=n,e.P=!0,ct(e,null)}function ct(e,t){e.F=Date.now(),ft(e),e.A=Dt(e.v);var n=e.A,r=e.R;Array.isArray(r)||(r=[String(r)]),Xt(n.i,"t",r),e.C=0,n=e.j.J,e.h=new st,e.g=qn(e.j,n?t:null,!e.m),0<e.O&&(e.M=new Ce(T(e.Y,e,e.g),e.O)),t=e.U,n=e.g,r=e.ca;var i="readystatechange";Array.isArray(i)||(i&&(ke[0]=i.toString()),i=ke);for(var s=0;s<i.length;s++){var o=le(n,i[s],r||t.handleEvent,!1,t.h||t);if(!o)break;t.g[o.key]=o}t=e.H?M(e.H):{},e.m?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.A,e.u,e.m,t)):(e.u="GET",e.g.ea(e.A,e.u,null,t)),qe(),Qe(e.i,e.u,e.A,e.l,e.R,e.m)}function lt(e){return!!e.g&&("GET"==e.u&&2!=e.L&&e.j.Ca)}function ht(e,t){var n=e.C,r=t.indexOf("\n",n);return-1==r?at:(n=Number(t.substring(n,r)),isNaN(n)?ot:(r+=1,r+n>t.length?at:(t=t.slice(r,r+n),e.C=r+n,t)))}function ft(e){e.S=Date.now()+e.I,dt(e,e.I)}function dt(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=ze(T(e.ba,e),t)}function pt(e){e.B&&(a.clearTimeout(e.B),e.B=null)}function gt(e){0==e.j.G||e.J||Fn(e.j,e)}function mt(e){pt(e);var t=e.M;t&&"function"==typeof t.ma&&t.ma(),e.M=null,Re(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.ma())}function vt(e,t){try{var n=e.j;if(0!=n.G&&(n.g==e||Et(n.h,e)))if(!e.K&&Et(n.h,e)&&3==n.G){try{var r=n.Da.g.parse(t)}catch(c){r=null}if(Array.isArray(r)&&3==r.length){var i=r;if(0==i[0]){e:if(!n.u){if(n.g){if(!(n.g.F+3e3<e.F))break e;Un(n),Cn(n)}Pn(n),We(18)}}else n.za=i[1],0<n.za-n.T&&37500>i[2]&&n.F&&0==n.v&&!n.C&&(n.C=ze(T(n.Za,n),6e3));if(1>=bt(n.h)&&n.ca){try{n.ca()}catch(c){}n.ca=void 0}}else jn(n,11)}else if((e.K||n.g==e)&&Un(n),!O(t))for(i=n.Da.g.parse(t),t=0;t<i.length;t++){let c=i[t];if(n.T=c[0],c=c[1],2==n.G)if("c"==c[0]){n.K=c[1],n.ia=c[2];const t=c[3];null!=t&&(n.la=t,n.j.info("VER="+n.la));const i=c[4];null!=i&&(n.Aa=i,n.j.info("SVER="+n.Aa));const l=c[5];null!=l&&"number"===typeof l&&0<l&&(r=1.5*l,n.L=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const h=e.g;if(h){const e=h.g?h.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var s=r.h;s.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(s.j=s.l,s.g=new Set,s.h&&(Tt(s,s.h),s.h=null))}if(r.D){const e=h.g?h.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(r.ya=e,Mt(r.I,r.D,e))}}n.G=3,n.l&&n.l.ua(),n.ba&&(n.R=Date.now()-e.F,n.j.info("Handshake RTT: "+n.R+"ms")),r=n;var o=e;if(r.qa=$n(r,r.J?r.ia:null,r.W),o.K){It(r.h,o);var a=o,u=r.L;u&&(a.I=u),a.B&&(pt(a),ft(a)),r.g=o}else xn(r);0<n.i.length&&kn(n)}else"stop"!=c[0]&&"close"!=c[0]||jn(n,7);else 3==n.G&&("stop"==c[0]||"close"==c[0]?"stop"==c[0]?jn(n,7):Sn(n):"noop"!=c[0]&&n.l&&n.l.ta(c),n.v=0)}qe(4)}catch(c){}}it.prototype.ca=function(e){e=e.target;const t=this.M;t&&3==wn(e)?t.j():this.Y(e)},it.prototype.Y=function(e){try{if(e==this.g)e:{const f=wn(this.g);var t=this.g.Ba();const d=this.g.Z();if(!(3>f)&&(3!=f||this.g&&(this.h.h||this.g.oa()||bn(this.g)))){this.J||4!=f||7==t||qe(8==t||0>=d?3:2),pt(this);var n=this.g.Z();this.X=n;t:if(lt(this)){var r=bn(this.g);e="";var i=r.length,s=4==wn(this.g);if(!this.h.i){if("undefined"===typeof TextDecoder){mt(this),gt(this);var o="";break t}this.h.i=new a.TextDecoder}for(t=0;t<i;t++)this.h.h=!0,e+=this.h.i.decode(r[t],{stream:!(s&&t==i-1)});r.length=0,this.h.g+=e,this.C=0,o=this.h.g}else o=this.g.oa();if(this.o=200==n,Xe(this.i,this.u,this.A,this.l,this.R,f,n),this.o){if(this.T&&!this.K){t:{if(this.g){var u,c=this.g;if((u=c.g?c.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!O(u)){var l=u;break t}}l=null}if(!(n=l)){this.o=!1,this.s=3,We(12),mt(this),gt(this);break e}Ye(this.i,this.l,n,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,vt(this,n)}if(this.P){let e;for(n=!0;!this.J&&this.C<o.length;){if(e=ht(this,o),e==at){4==f&&(this.s=4,We(14),n=!1),Ye(this.i,this.l,null,"[Incomplete Response]");break}if(e==ot){this.s=4,We(15),Ye(this.i,this.l,o,"[Invalid Chunk]"),n=!1;break}Ye(this.i,this.l,e,null),vt(this,e)}if(lt(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=f||0!=o.length||this.h.h||(this.s=1,We(16),n=!1),this.o=this.o&&n,n){if(0<o.length&&!this.W){this.W=!0;var h=this.j;h.g==this&&h.ba&&!h.M&&(h.j.info("Great, no buffering proxy detected. Bytes received: "+o.length),Ln(h),h.M=!0,We(11))}}else Ye(this.i,this.l,o,"[Invalid Chunked Response]"),mt(this),gt(this)}else Ye(this.i,this.l,o,null),vt(this,o);4==f&&mt(this),this.o&&!this.J&&(4==f?Fn(this.j,this):(this.o=!1,ft(this)))}else En(this.g),400==n&&0<o.indexOf("Unknown SID")?(this.s=3,We(12)):(this.s=0,We(13)),mt(this),gt(this)}}}catch(b){}},it.prototype.cancel=function(){this.J=!0,mt(this)},it.prototype.ba=function(){this.B=null;const e=Date.now();0<=e-this.S?(Je(this.i,this.A),2!=this.L&&(qe(),We(17)),mt(this),this.s=2,gt(this)):dt(this,this.S-e)};var yt=class{constructor(e,t){this.g=e,this.map=t}};function _t(e){this.l=e||10,a.PerformanceNavigationTiming?(e=a.performance.getEntriesByType("navigation"),e=0<e.length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol)):e=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function wt(e){return!!e.h||!!e.g&&e.g.size>=e.j}function bt(e){return e.h?1:e.g?e.g.size:0}function Et(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function Tt(e,t){e.g?e.g.add(t):e.h=t}function It(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function St(e){if(null!=e.h)return e.i.concat(e.h.D);if(null!=e.g&&0!==e.g.size){let t=e.i;for(const n of e.g.values())t=t.concat(n.D);return t}return A(e.i)}function Ct(e){if(e.V&&"function"==typeof e.V)return e.V();if("undefined"!==typeof Map&&e instanceof Map||"undefined"!==typeof Set&&e instanceof Set)return Array.from(e.values());if("string"===typeof e)return e.split("");if(u(e)){for(var t=[],n=e.length,r=0;r<n;r++)t.push(e[r]);return t}for(r in t=[],n=0,e)t[n++]=e[r];return t}function At(e){if(e.na&&"function"==typeof e.na)return e.na();if(!e.V||"function"!=typeof e.V){if("undefined"!==typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!==typeof Set&&e instanceof Set)){if(u(e)||"string"===typeof e){var t=[];e=e.length;for(var n=0;n<e;n++)t.push(n);return t}t=[],n=0;for(const r in e)t[n++]=r;return t}}}function kt(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(u(e)||"string"===typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var n=At(e),r=Ct(e),i=r.length,s=0;s<i;s++)t.call(void 0,r[s],n&&n[s],e)}_t.prototype.cancel=function(){if(this.i=St(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const e of this.g.values())e.cancel();this.g.clear()}};var Rt=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ot(e,t){if(e){e=e.split("&");for(var n=0;n<e.length;n++){var r=e[n].indexOf("="),i=null;if(0<=r){var s=e[n].substring(0,r);i=e[n].substring(r+1)}else s=e[n];t(s,i?decodeURIComponent(i.replace(/\+/g," ")):"")}}}function Nt(e){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,e instanceof Nt){this.h=e.h,xt(this,e.j),this.o=e.o,this.g=e.g,Pt(this,e.s),this.l=e.l;var t=e.i,n=new Gt;n.i=t.i,t.g&&(n.g=new Map(t.g),n.h=t.h),Lt(this,n),this.m=e.m}else e&&(t=String(e).match(Rt))?(this.h=!1,xt(this,t[1]||"",!0),this.o=Ft(t[2]||""),this.g=Ft(t[3]||"",!0),Pt(this,t[4]),this.l=Ft(t[5]||"",!0),Lt(this,t[6]||"",!0),this.m=Ft(t[7]||"")):(this.h=!1,this.i=new Gt(null,this.h))}function Dt(e){return new Nt(e)}function xt(e,t,n){e.j=n?Ft(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function Pt(e,t){if(t){if(t=Number(t),isNaN(t)||0>t)throw Error("Bad port number "+t);e.s=t}else e.s=null}function Lt(e,t,n){t instanceof Gt?(e.i=t,Jt(e.i,e.h)):(n||(t=Vt(t,Kt)),e.i=new Gt(t,e.h))}function Mt(e,t,n){e.i.set(t,n)}function Ut(e){return Mt(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function Ft(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function Vt(e,t,n){return"string"===typeof e?(e=encodeURI(e).replace(t,jt),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function jt(e){return e=e.charCodeAt(0),"%"+(e>>4&15).toString(16)+(15&e).toString(16)}Nt.prototype.toString=function(){var e=[],t=this.j;t&&e.push(Vt(t,Bt,!0),":");var n=this.g;return(n||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(Vt(t,Bt,!0),"@"),e.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n=this.s,null!=n&&e.push(":",String(n))),(n=this.l)&&(this.g&&"/"!=n.charAt(0)&&e.push("/"),e.push(Vt(n,"/"==n.charAt(0)?qt:$t,!0))),(n=this.i.toString())&&e.push("?",n),(n=this.m)&&e.push("#",Vt(n,Wt)),e.join("")};var Bt=/[#\/\?@]/g,$t=/[#\?:]/g,qt=/[#\?]/g,Kt=/[#\?@]/g,Wt=/#/g;function Gt(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function zt(e){e.g||(e.g=new Map,e.h=0,e.i&&Ot(e.i,function(t,n){e.add(decodeURIComponent(t.replace(/\+/g," ")),n)}))}function Ht(e,t){zt(e),t=Yt(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function Qt(e,t){return zt(e),t=Yt(e,t),e.g.has(t)}function Xt(e,t,n){Ht(e,t),0<n.length&&(e.i=null,e.g.set(Yt(e,t),A(n)),e.h+=n.length)}function Yt(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function Jt(e,t){t&&!e.j&&(zt(e),e.i=null,e.g.forEach(function(e,t){var n=t.toLowerCase();t!=n&&(Ht(this,t),Xt(this,n,e))},e)),e.j=t}function Zt(e,t){const n=new He;if(a.Image){const r=new Image;r.onload=S(tn,n,"TestLoadImage: loaded",!0,t,r),r.onerror=S(tn,n,"TestLoadImage: error",!1,t,r),r.onabort=S(tn,n,"TestLoadImage: abort",!1,t,r),r.ontimeout=S(tn,n,"TestLoadImage: timeout",!1,t,r),a.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=e}else t(!1)}function en(e,t){const n=new He,r=new AbortController,i=setTimeout(()=>{r.abort(),tn(n,"TestPingServer: timeout",!1,t)},1e4);fetch(e,{signal:r.signal}).then(e=>{clearTimeout(i),e.ok?tn(n,"TestPingServer: ok",!0,t):tn(n,"TestPingServer: server error",!1,t)}).catch(()=>{clearTimeout(i),tn(n,"TestPingServer: error",!1,t)})}function tn(e,t,n,r,i){try{i&&(i.onload=null,i.onerror=null,i.onabort=null,i.ontimeout=null),r(n)}catch(s){}}function nn(){this.g=new De}function rn(e,t,n){const r=n||"";try{kt(e,function(e,n){let i=e;c(e)&&(i=Oe(e)),t.push(r+n+"="+encodeURIComponent(i))})}catch(i){throw t.push(r+"type="+encodeURIComponent("_badmap")),i}}function sn(e){this.l=e.Ub||null,this.j=e.eb||!1}function on(e,t){be.call(this),this.D=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}function an(e){e.j.read().then(e.Pa.bind(e)).catch(e.ga.bind(e))}function un(e){e.readyState=4,e.l=null,e.j=null,e.v=null,cn(e)}function cn(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function ln(e){let t="";return P(e,function(e,n){t+=n,t+=":",t+=e,t+="\r\n"}),t}function hn(e,t,n){e:{for(r in n){var r=!1;break e}r=!0}r||(n=ln(n),"string"===typeof e?null!=n&&encodeURIComponent(String(n)):Mt(e,t,n))}function fn(e){be.call(this),this.headers=new Map,this.o=e||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}e=Gt.prototype,e.add=function(e,t){zt(this),this.i=null,e=Yt(this,e);var n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this},e.forEach=function(e,t){zt(this),this.g.forEach(function(n,r){n.forEach(function(n){e.call(t,n,r,this)},this)},this)},e.na=function(){zt(this);const e=Array.from(this.g.values()),t=Array.from(this.g.keys()),n=[];for(let r=0;r<t.length;r++){const i=e[r];for(let e=0;e<i.length;e++)n.push(t[r])}return n},e.V=function(e){zt(this);let t=[];if("string"===typeof e)Qt(this,e)&&(t=t.concat(this.g.get(Yt(this,e))));else{e=Array.from(this.g.values());for(let n=0;n<e.length;n++)t=t.concat(e[n])}return t},e.set=function(e,t){return zt(this),this.i=null,e=Yt(this,e),Qt(this,e)&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e?(e=this.V(e),0<e.length?String(e[0]):t):t},e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],t=Array.from(this.g.keys());for(var n=0;n<t.length;n++){var r=t[n];const s=encodeURIComponent(String(r)),o=this.V(r);for(r=0;r<o.length;r++){var i=s;""!==o[r]&&(i+="="+encodeURIComponent(String(o[r]))),e.push(i)}}return this.i=e.join("&")},C(sn,xe),sn.prototype.g=function(){return new on(this.l,this.j)},sn.prototype.i=function(e){return function(){return e}}({}),C(on,be),e=on.prototype,e.open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.B=e,this.A=t,this.readyState=1,cn(this)},e.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;const t={headers:this.u,method:this.B,credentials:this.m,cache:void 0};e&&(t.body=e),(this.D||a).fetch(new Request(this.A,t)).then(this.Sa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,un(this)),this.readyState=0},e.Sa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,cn(this)),this.g&&(this.readyState=3,cn(this),this.g)))if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if("undefined"!==typeof a.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;an(this)}else e.text().then(this.Ra.bind(this),this.ga.bind(this))},e.Pa=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.v.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?un(this):cn(this),3==this.readyState&&an(this)}},e.Ra=function(e){this.g&&(this.response=this.responseText=e,un(this))},e.Qa=function(e){this.g&&(this.response=e,un(this))},e.ga=function(){this.g&&un(this)},e.setRequestHeader=function(e,t){this.u.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+": "+n[1]),n=t.next();return e.join("\r\n")},Object.defineProperty(on.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),C(fn,be);var dn=/^https?$/i,pn=["POST","PUT"];function gn(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.m=5,mn(e),yn(e)}function mn(e){e.A||(e.A=!0,Ee(e,"complete"),Ee(e,"error"))}function vn(e){if(e.h&&"undefined"!=typeof o&&(!e.v[1]||4!=wn(e)||2!=e.Z()))if(e.u&&4==wn(e))Ie(e.Ea,0,e);else if(Ee(e,"readystatechange"),4==wn(e)){e.h=!1;try{const o=e.Z();e:switch(o){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break e;default:t=!1}var n;if(!(n=t)){var r;if(r=0===o){var i=String(e.D).match(Rt)[1]||null;!i&&a.self&&a.self.location&&(i=a.self.location.protocol.slice(0,-1)),r=!dn.test(i?i.toLowerCase():"")}n=r}if(n)Ee(e,"complete"),Ee(e,"success");else{e.m=6;try{var s=2<wn(e)?e.g.statusText:""}catch(u){s=""}e.l=s+" ["+e.Z()+"]",mn(e)}}finally{yn(e)}}}function yn(e,t){if(e.g){_n(e);const r=e.g,i=e.v[0]?()=>{}:null;e.g=null,e.v=null,t||Ee(e,"ready");try{r.onreadystatechange=i}catch(n){}}}function _n(e){e.I&&(a.clearTimeout(e.I),e.I=null)}function wn(e){return e.g?e.g.readyState:0}function bn(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.H){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(I){return null}}function En(e){const t={};e=(e.g&&2<=wn(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<e.length;r++){if(O(e[r]))continue;var n=V(e[r]);const i=n[0];if(n=n[1],"string"!==typeof n)continue;n=n.trim();const s=t[i]||[];t[i]=s,s.push(n)}L(t,function(e){return e.join(", ")})}function Tn(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function In(e){this.Aa=0,this.i=[],this.j=new He,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Tn("failFast",!1,e),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Tn("baseRetryDelayMs",5e3,e),this.cb=Tn("retryDelaySeedMs",1e4,e),this.Wa=Tn("forwardChannelMaxRetries",2,e),this.wa=Tn("forwardChannelRequestTimeoutMs",2e4,e),this.pa=e&&e.xmlHttpFactory||void 0,this.Xa=e&&e.Tb||void 0,this.Ca=e&&e.useFetchStreams||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.h=new _t(e&&e.concurrentRequestLimit),this.Da=new nn,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=e&&e.Rb||!1,e&&e.xa&&this.j.xa(),e&&e.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&e&&e.detectBufferingProxy||!1,this.ja=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.ja=e.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}function Sn(e){if(An(e),3==e.G){var t=e.U++,n=Dt(e.I);if(Mt(n,"SID",e.K),Mt(n,"RID",t),Mt(n,"TYPE","terminate"),Nn(e,n),t=new it(e,e.j,t),t.L=2,t.v=Ut(Dt(n)),n=!1,a.navigator&&a.navigator.sendBeacon)try{n=a.navigator.sendBeacon(t.v.toString(),"")}catch(r){}!n&&a.Image&&((new Image).src=t.v,n=!0),n||(t.g=qn(t.j,null),t.g.ea(t.v)),t.F=Date.now(),ft(t)}Bn(e)}function Cn(e){e.g&&(Ln(e),e.g.cancel(),e.g=null)}function An(e){Cn(e),e.u&&(a.clearTimeout(e.u),e.u=null),Un(e),e.h.cancel(),e.s&&("number"===typeof e.s&&a.clearTimeout(e.s),e.s=null)}function kn(e){if(!wt(e.h)&&!e.s){e.s=!0;var t=e.Ga;W||H(),G||(W(),G=!0),z.add(t,e),e.B=0}}function Rn(e,t){return!(bt(e.h)>=e.h.j-(e.s?1:0))&&(e.s?(e.i=t.D.concat(e.i),!0):!(1==e.G||2==e.G||e.B>=(e.Va?0:e.Wa))&&(e.s=ze(T(e.Ga,e,t),Vn(e,e.B)),e.B++,!0))}function On(e,t){var n;n=t?t.l:e.U++;const r=Dt(e.I);Mt(r,"SID",e.K),Mt(r,"RID",n),Mt(r,"AID",e.T),Nn(e,r),e.m&&e.o&&hn(r,e.m,e.o),n=new it(e,e.j,n,e.B+1),null===e.m&&(n.H=e.o),t&&(e.i=t.D.concat(e.i)),t=Dn(e,n,1e3),n.I=Math.round(.5*e.wa)+Math.round(.5*e.wa*Math.random()),Tt(e.h,n),ut(n,r,t)}function Nn(e,t){e.H&&P(e.H,function(e,n){Mt(t,n,e)}),e.l&&kt({},function(e,n){Mt(t,n,e)})}function Dn(e,t,n){n=Math.min(e.i.length,n);var r=e.l?T(e.l.Na,e.l,e):null;e:{var i=e.i;let t=-1;for(;;){const e=["count="+n];-1==t?0<n?(t=i[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let s=!0;for(let o=0;o<n;o++){let n=i[o].g;const a=i[o].map;if(n-=t,0>n)t=Math.max(0,i[o].g-100),s=!1;else try{rn(a,e,"req"+n+"_")}catch(b){r&&r(a)}}if(s){r=e.join("&");break e}}}return e=e.i.splice(0,n),t.D=e,r}function xn(e){if(!e.g&&!e.u){e.Y=1;var t=e.Fa;W||H(),G||(W(),G=!0),z.add(t,e),e.v=0}}function Pn(e){return!(e.g||e.u||3<=e.v)&&(e.Y++,e.u=ze(T(e.Fa,e),Vn(e,e.v)),e.v++,!0)}function Ln(e){null!=e.A&&(a.clearTimeout(e.A),e.A=null)}function Mn(e){e.g=new it(e,e.j,"rpc",e.Y),null===e.m&&(e.g.H=e.o),e.g.O=0;var t=Dt(e.qa);Mt(t,"RID","rpc"),Mt(t,"SID",e.K),Mt(t,"AID",e.T),Mt(t,"CI",e.F?"0":"1"),!e.F&&e.ja&&Mt(t,"TO",e.ja),Mt(t,"TYPE","xmlhttp"),Nn(e,t),e.m&&e.o&&hn(t,e.m,e.o),e.L&&(e.g.I=e.L);var n=e.g;e=e.ia,n.L=1,n.v=Ut(Dt(t)),n.m=null,n.P=!0,ct(n,e)}function Un(e){null!=e.C&&(a.clearTimeout(e.C),e.C=null)}function Fn(e,t){var n=null;if(e.g==t){Un(e),Ln(e),e.g=null;var r=2}else{if(!Et(e.h,t))return;n=t.D,It(e.h,t),r=1}if(0!=e.G)if(t.o)if(1==r){n=t.m?t.m.length:0,t=Date.now()-t.F;var i=e.B;r=Be(),Ee(r,new Ge(r,n)),kn(e)}else xn(e);else if(i=t.s,3==i||0==i&&0<t.X||!(1==r&&Rn(e,t)||2==r&&Pn(e)))switch(n&&0<n.length&&(t=e.h,t.i=t.i.concat(n)),i){case 1:jn(e,5);break;case 4:jn(e,10);break;case 3:jn(e,6);break;default:jn(e,2)}}function Vn(e,t){let n=e.Ta+Math.floor(Math.random()*e.cb);return e.isActive()||(n*=2),n*t}function jn(e,t){if(e.j.info("Error code "+t),2==t){var n=T(e.fb,e),r=e.Xa;const t=!r;r=new Nt(r||"//www.google.com/images/cleardot.gif"),a.location&&"http"==a.location.protocol||xt(r,"https"),Ut(r),t?Zt(r.toString(),n):en(r.toString(),n)}else We(2);e.G=0,e.l&&e.l.sa(t),Bn(e),An(e)}function Bn(e){if(e.G=0,e.ka=[],e.l){const t=St(e.h);0==t.length&&0==e.i.length||(k(e.ka,t),k(e.ka,e.i),e.h.i.length=0,A(e.i),e.i.length=0),e.l.ra()}}function $n(e,t,n){var r=n instanceof Nt?Dt(n):new Nt(n);if(""!=r.g)t&&(r.g=t+"."+r.g),Pt(r,r.s);else{var i=a.location;r=i.protocol,t=t?t+"."+i.hostname:i.hostname,i=+i.port;var s=new Nt(null);r&&xt(s,r),t&&(s.g=t),i&&Pt(s,i),n&&(s.l=n),r=s}return n=e.D,t=e.ya,n&&t&&Mt(r,n,t),Mt(r,"VER",e.la),Nn(e,r),r}function qn(e,t,n){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return t=e.Ca&&!e.pa?new fn(new sn({eb:n})):new fn(e.pa),t.Ha(e.J),t}function Kn(){}function Wn(){}function Gn(e,t){be.call(this),this.g=new In(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.va&&(e?e["X-WebChannel-Client-Profile"]=t.va:e={"X-WebChannel-Client-Profile":t.va}),this.g.S=e,(e=t&&t.Sb)&&!O(e)&&(this.g.m=e),this.v=t&&t.supportsCrossDomainXhr||!1,this.u=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!O(t)&&(this.g.D=t,e=this.h,null!==e&&t in e&&(e=this.h,t in e&&delete e[t])),this.j=new Qn(this)}function zn(e){Ue.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(const n in t){e=n;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function Hn(){Fe.call(this),this.status=1}function Qn(e){this.g=e}e=fn.prototype,e.Ha=function(e){this.J=e},e.ea=function(e,t,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);t=t?t.toUpperCase():"GET",this.D=e,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():et.g(),this.v=this.o?Pe(this.o):Pe(et),this.g.onreadystatechange=T(this.Ea,this);try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(s){return void gn(this,s)}if(e=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var i in r)n.set(i,r[i]);else{if("function"!==typeof r.keys||"function"!==typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const e of r.keys())n.set(e,r.get(e))}r=Array.from(n.keys()).find(e=>"content-type"==e.toLowerCase()),i=a.FormData&&e instanceof a.FormData,!(0<=Array.prototype.indexOf.call(pn,t,void 0))||r||i||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[o,a]of n)this.g.setRequestHeader(o,a);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{_n(this),this.u=!0,this.g.send(e),this.u=!1}catch(s){gn(this,s)}},e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=e||7,Ee(this,"complete"),Ee(this,"abort"),yn(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),yn(this,!0)),fn.aa.N.call(this)},e.Ea=function(){this.s||(this.B||this.u||this.j?vn(this):this.bb())},e.bb=function(){vn(this)},e.isActive=function(){return!!this.g},e.Z=function(){try{return 2<wn(this)?this.g.status:-1}catch(e){return-1}},e.oa=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},e.Oa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),Ne(t)}},e.Ba=function(){return this.m},e.Ka=function(){return"string"===typeof this.l?this.l:String(this.l)},e=In.prototype,e.la=8,e.G=1,e.connect=function(e,t,n,r){We(0),this.W=e,this.H=t||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.I=$n(this,null,this.W),kn(this)},e.Ga=function(e){if(this.s)if(this.s=null,1==this.G){if(!e){this.U=Math.floor(1e5*Math.random()),e=this.U++;const i=new it(this,this.j,e);let s=this.o;if(this.S&&(s?(s=M(s),F(s,this.S)):s=this.S),null!==this.m||this.O||(i.H=s,s=null),this.P)e:{for(var t=0,n=0;n<this.i.length;n++){var r=this.i[n];if(r="__data__"in r.map&&(r=r.map.__data__,"string"===typeof r)?r.length:void 0,void 0===r)break;if(t+=r,4096<t){t=n;break e}if(4096===t||n===this.i.length-1){t=n+1;break e}}t=1e3}else t=1e3;t=Dn(this,i,t),n=Dt(this.I),Mt(n,"RID",e),Mt(n,"CVER",22),this.D&&Mt(n,"X-HTTP-Session-Id",this.D),Nn(this,n),s&&(this.O?t="headers="+encodeURIComponent(String(ln(s)))+"&"+t:this.m&&hn(n,this.m,s)),Tt(this.h,i),this.Ua&&Mt(n,"TYPE","init"),this.P?(Mt(n,"$req",t),Mt(n,"SID","null"),i.T=!0,ut(i,n,null)):ut(i,n,t),this.G=2}}else 3==this.G&&(e?On(this,e):0==this.i.length||wt(this.h)||On(this))},e.Fa=function(){if(this.u=null,Mn(this),this.ba&&!(this.M||null==this.g||0>=this.R)){var e=2*this.R;this.j.info("BP detection timer enabled: "+e),this.A=ze(T(this.ab,this),e)}},e.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,We(10),Cn(this),Mn(this))},e.Za=function(){null!=this.C&&(this.C=null,Cn(this),Pn(this),We(19))},e.fb=function(e){e?(this.j.info("Successfully pinged google.com"),We(2)):(this.j.info("Failed to ping google.com"),We(1))},e.isActive=function(){return!!this.l&&this.l.isActive(this)},e=Kn.prototype,e.ua=function(){},e.ta=function(){},e.sa=function(){},e.ra=function(){},e.isActive=function(){return!0},e.Na=function(){},Wn.prototype.g=function(e,t){return new Gn(e,t)},C(Gn,be),Gn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Gn.prototype.close=function(){Sn(this.g)},Gn.prototype.o=function(e){var t=this.g;if("string"===typeof e){var n={};n.__data__=e,e=n}else this.u&&(n={},n.__data__=Oe(e),e=n);t.i.push(new yt(t.Ya++,e)),3==t.G&&kn(t)},Gn.prototype.N=function(){this.g.l=null,delete this.j,Sn(this.g),delete this.g,Gn.aa.N.call(this)},C(zn,Ue),C(Hn,Fe),C(Qn,Kn),Qn.prototype.ua=function(){Ee(this.g,"a")},Qn.prototype.ta=function(e){Ee(this.g,new zn(e))},Qn.prototype.sa=function(e){Ee(this.g,new Hn)},Qn.prototype.ra=function(){Ee(this.g,"b")},Wn.prototype.createWebChannel=Wn.prototype.g,Gn.prototype.send=Gn.prototype.o,Gn.prototype.open=Gn.prototype.m,Gn.prototype.close=Gn.prototype.close,y=w.createWebChannelTransport=function(){return new Wn},v=w.getStatEventTarget=function(){return Be()},m=w.Event=Ve,g=w.Stat={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},tt.NO_ERROR=0,tt.TIMEOUT=8,tt.HTTP_ERROR=6,p=w.ErrorCode=tt,nt.COMPLETE="complete",d=w.EventType=nt,Le.EventType=Me,Me.OPEN="a",Me.CLOSE="b",Me.ERROR="c",Me.MESSAGE="d",be.prototype.listen=be.prototype.K,f=w.WebChannel=Le,w.FetchXmlHttpFactory=sn,fn.prototype.listenOnce=fn.prototype.L,fn.prototype.getLastError=fn.prototype.Ka,fn.prototype.getLastErrorCode=fn.prototype.Ba,fn.prototype.getStatus=fn.prototype.Z,fn.prototype.getResponseJson=fn.prototype.Oa,fn.prototype.getResponseText=fn.prototype.oa,fn.prototype.send=fn.prototype.ea,fn.prototype.setWithCredentials=fn.prototype.Ha,h=w.XhrIo=fn}).apply("undefined"!==typeof _?_:"undefined"!==typeof self?self:"undefined"!==typeof window?window:{});const b="@firebase/firestore";
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class E{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}E.UNAUTHENTICATED=new E(null),E.GOOGLE_CREDENTIALS=new E("google-credentials-uid"),E.FIRST_PARTY=new E("first-party-uid"),E.MOCK_USER=new E("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
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
let T="10.14.0";
/**
 * @license
 * Copyright 2017 Google LLC
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
 */const I=new a.Vy("@firebase/firestore");function S(){return I.logLevel}function C(e,...t){if(I.logLevel<=a.$b.DEBUG){const n=t.map(R);I.debug(`Firestore (${T}): ${e}`,...n)}}function A(e,...t){if(I.logLevel<=a.$b.ERROR){const n=t.map(R);I.error(`Firestore (${T}): ${e}`,...n)}}function k(e,...t){if(I.logLevel<=a.$b.WARN){const n=t.map(R);I.warn(`Firestore (${T}): ${e}`,...n)}}function R(e){if("string"==typeof e)return e;try{
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
return function(e){return JSON.stringify(e)}(e)}catch(t){return e}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function O(e="Unexpected state"){const t=`FIRESTORE (${T}) INTERNAL ASSERTION FAILED: `+e;throw A(t),new Error(t)}function N(e,t){e||O()}function D(e,t){return e}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */const x={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class P extends u.g{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class L{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class M{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class U{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(E.UNAUTHENTICATED))}shutdown(){}}class F{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class V{constructor(e){this.t=e,this.currentUser=E.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){N(void 0===this.o);let n=this.i;const r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve();let i=new L;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new L,e.enqueueRetryable(()=>r(this.currentUser))};const s=()=>{const t=i;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},o=e=>{C("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){const e=this.t.getImmediate({optional:!0});e?o(e):(C("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new L)}},0),s()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(C("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(N("string"==typeof t.accessToken),new M(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return N(null===e||"string"==typeof e),new E(e)}}class j{constructor(e,t,n){this.l=e,this.h=t,this.P=n,this.type="FirstParty",this.user=E.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class B{constructor(e,t,n){this.l=e,this.h=t,this.P=n}getToken(){return Promise.resolve(new j(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(E.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ${constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class q{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){N(void 0===this.o);const n=e=>{null!=e.error&&C("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);const n=e.token!==this.R;return this.R=e.token,C("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};const r=e=>{C("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){const e=this.A.getImmediate({optional:!0});e?r(e):C("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(N("string"==typeof e.token),this.R=e.token,new $(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
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
function K(e){const t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class W{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let n="";for(;n.length<20;){const r=K(40);for(let i=0;i<r.length;++i)n.length<20&&r[i]<t&&(n+=e.charAt(r[i]%e.length))}return n}}function G(e,t){return e<t?-1:e>t?1:0}function z(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}
/**
 * @license
 * Copyright 2017 Google LLC
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
class H{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new P(x.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new P(x.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new P(x.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new P(x.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return H.fromMillis(Date.now())}static fromDate(e){return H.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor(1e6*(e-1e3*t));return new H(t,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?G(this.nanoseconds,e.nanoseconds):G(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Q{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Q(e)}static min(){return new Q(new H(0,0))}static max(){return new Q(new H(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class X{constructor(e,t,n){void 0===t?t=0:t>e.length&&O(),void 0===n?n=e.length-t:n>e.length-t&&O(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===X.comparator(this,e)}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof X?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=e.get(r),i=t.get(r);if(n<i)return-1;if(n>i)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Y extends X{construct(e,t,n){return new Y(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new P(x.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new Y(t)}static emptyPath(){return new Y([])}}const J=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Z extends X{construct(e,t,n){return new Z(e,t,n)}static isValidIdentifier(e){return J.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Z.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&"__name__"===this.get(0)}static keyField(){return new Z(["__name__"])}static fromServerFormat(e){const t=[];let n="",r=0;const i=()=>{if(0===n.length)throw new P(x.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let s=!1;for(;r<e.length;){const t=e[r];if("\\"===t){if(r+1===e.length)throw new P(x.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new P(x.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?(s=!s,r++):"."!==t||s?(n+=t,r++):(i(),r++)}if(i(),s)throw new P(x.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Z(t)}static emptyPath(){return new Z([])}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class ee{constructor(e){this.path=e}static fromPath(e){return new ee(Y.fromString(e))}static fromName(e){return new ee(Y.fromString(e).popFirst(5))}static empty(){return new ee(Y.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===Y.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return Y.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ee(new Y(e.slice()))}}
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
 */class te{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}te.UNKNOWN_ID=-1;function ne(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,i=Q.fromTimestamp(1e9===r?new H(n+1,0):new H(n,r));return new ie(i,ee.empty(),t)}function re(e){return new ie(e.readTime,e.key,-1)}class ie{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new ie(Q.min(),ee.empty(),-1)}static max(){return new ie(Q.max(),ee.empty(),-1)}}function se(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:(n=ee.comparator(e.documentKey,t.documentKey),0!==n?n:G(e.largestBatchId,t.largestBatchId)
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
 */)}const oe="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class ae{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */async function ue(e){if(e.code!==x.FAILED_PRECONDITION||e.message!==oe)throw e;C("LocalStore","Unexpectedly lost primary lease")}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class ce{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&O(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new ce((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof ce?t:ce.resolve(t)}catch(e){return ce.reject(e)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):ce.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):ce.reject(t)}static resolve(e){return new ce((t,n)=>{t(e)})}static reject(e){return new ce((t,n)=>{n(e)})}static waitFor(e){return new ce((t,n)=>{let r=0,i=0,s=!1;e.forEach(e=>{++r,e.next(()=>{++i,s&&i===r&&t()},e=>n(e))}),s=!0,i===r&&t()})}static or(e){let t=ce.resolve(!1);for(const n of e)t=t.next(e=>e?ce.resolve(e):n());return t}static forEach(e,t){const n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new ce((n,r)=>{const i=e.length,s=new Array(i);let o=0;for(let a=0;a<i;a++){const u=a;t(e[u]).next(e=>{s[u]=e,++o,o===i&&n(s)},e=>r(e))}})}static doWhile(e,t){return new ce((n,r)=>{const i=()=>{!0===e()?t().next(()=>{i()},r):n()};i()})}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function le(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function he(e){return"IndexedDbTransactionError"===e.name}
/**
 * @license
 * Copyright 2018 Google LLC
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
class fe{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ie(e),this.se=e=>t.writeSequenceNumber(e))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}function de(e){return null==e}function pe(e){return 0===e&&1/e==-1/0}function ge(e){return"number"==typeof e&&Number.isInteger(e)&&!pe(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */fe.oe=-1;const me=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],ve=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],ye=ve,_e=[...ye,"indexConfiguration","indexState","indexEntries"];
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
 * Copyright 2017 Google LLC
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
function we(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function be(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function Ee(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Te{constructor(e,t){this.comparator=e,this.root=t||Se.EMPTY}insert(e,t){return new Te(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Se.BLACK,null,null))}remove(e){return new Te(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Se.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ie(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ie(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ie(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ie(this.root,e,this.comparator,!0)}}class Ie{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Se{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:Se.RED,this.left=null!=r?r:Se.EMPTY,this.right=null!=i?i:Se.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new Se(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const i=n(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Se.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return Se.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Se.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Se.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw O();if(this.right.isRed())throw O();const e=this.left.check();if(e!==this.right.check())throw O();return e+(this.isRed()?0:1)}}Se.EMPTY=null,Se.RED=!0,Se.BLACK=!1,Se.EMPTY=new class{constructor(){this.size=0}get key(){throw O()}get value(){throw O()}get color(){throw O()}get left(){throw O()}get right(){throw O()}copy(e,t,n,r,i){return this}insert(e,t,n){return new Se(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
 * @license
 * Copyright 2017 Google LLC
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
class Ce{constructor(e){this.comparator=e,this.data=new Te(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ae(this.data.getIterator())}getIteratorFrom(e){return new Ae(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof Ce))return!1;if(this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ce(this.comparator);return t.data=e,t}}class Ae{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}
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
class ke{constructor(e){this.fields=e,e.sort(Z.comparator)}static empty(){return new ke([])}unionWith(e){let t=new Ce(Z.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new ke(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return z(this.fields,e.fields,(e,t)=>e.isEqual(t))}}
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
 */class Re extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
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
class Oe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new Re("Invalid base64 string: "+e):e}}(e);return new Oe(t)}static fromUint8Array(e){const t=function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e);return new Oe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}
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
 */(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return G(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Oe.EMPTY_BYTE_STRING=new Oe("");const Ne=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function De(e){if(N(!!e),"string"==typeof e){let t=0;const n=Ne.exec(e);if(N(!!n),n[1]){let e=n[1];e=(e+"000000000").substr(0,9),t=Number(e)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:xe(e.seconds),nanos:xe(e.nanos)}}function xe(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function Pe(e){return"string"==typeof e?Oe.fromBase64String(e):Oe.fromUint8Array(e)}
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
 */function Le(e){var t,n;return"server_timestamp"===(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{}).__type__)||void 0===n?void 0:n.stringValue)}function Me(e){const t=e.mapValue.fields.__previous_value__;return Le(t)?Me(t):t}function Ue(e){const t=De(e.mapValue.fields.__local_write_time__.timestampValue);return new H(t.seconds,t.nanos)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Fe{constructor(e,t,n,r,i,s,o,a,u){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=u}}class Ve{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Ve("","")}get isDefaultDatabase(){return"(default)"===this.database}isEqual(e){return e instanceof Ve&&e.projectId===this.projectId&&e.database===this.database}}
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
 */const je={mapValue:{fields:{__type__:{stringValue:"__max__"}}}};function Be(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Le(e)?4:rt(e)?9007199254740991:tt(e)?10:11:O()}function $e(e,t){if(e===t)return!0;const n=Be(e);if(n!==Be(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return Ue(e).isEqual(Ue(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;const n=De(e.timestampValue),r=De(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return function(e,t){return Pe(e.bytesValue).isEqual(Pe(t.bytesValue))}(e,t);case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return xe(e.geoPointValue.latitude)===xe(t.geoPointValue.latitude)&&xe(e.geoPointValue.longitude)===xe(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return xe(e.integerValue)===xe(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){const n=xe(e.doubleValue),r=xe(t.doubleValue);return n===r?pe(n)===pe(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return z(e.arrayValue.values||[],t.arrayValue.values||[],$e);case 10:case 11:return function(e,t){const n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(we(n)!==we(r))return!1;for(const i in n)if(n.hasOwnProperty(i)&&(void 0===r[i]||!$e(n[i],r[i])))return!1;return!0}(e,t);default:return O()}}function qe(e,t){return void 0!==(e.values||[]).find(e=>$e(e,t))}function Ke(e,t){if(e===t)return 0;const n=Be(e),r=Be(t);if(n!==r)return G(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return G(e.booleanValue,t.booleanValue);case 2:return function(e,t){const n=xe(e.integerValue||e.doubleValue),r=xe(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return We(e.timestampValue,t.timestampValue);case 4:return We(Ue(e),Ue(t));case 5:return G(e.stringValue,t.stringValue);case 6:return function(e,t){const n=Pe(e),r=Pe(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){const n=e.split("/"),r=t.split("/");for(let i=0;i<n.length&&i<r.length;i++){const e=G(n[i],r[i]);if(0!==e)return e}return G(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){const n=G(xe(e.latitude),xe(t.latitude));return 0!==n?n:G(xe(e.longitude),xe(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return Ge(e.arrayValue,t.arrayValue);case 10:return function(e,t){var n,r,i,s;const o=e.fields||{},a=t.fields||{},u=null===(n=o.value)||void 0===n?void 0:n.arrayValue,c=null===(r=a.value)||void 0===r?void 0:r.arrayValue,l=G((null===(i=null==u?void 0:u.values)||void 0===i?void 0:i.length)||0,(null===(s=null==c?void 0:c.values)||void 0===s?void 0:s.length)||0);return 0!==l?l:Ge(u,c)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===je.mapValue&&t===je.mapValue)return 0;if(e===je.mapValue)return 1;if(t===je.mapValue)return-1;const n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let o=0;o<r.length&&o<s.length;++o){const e=G(r[o],s[o]);if(0!==e)return e;const t=Ke(n[r[o]],i[s[o]]);if(0!==t)return t}return G(r.length,s.length)}(e.mapValue,t.mapValue);default:throw O()}}function We(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return G(e,t);const n=De(e),r=De(t),i=G(n.seconds,r.seconds);return 0!==i?i:G(n.nanos,r.nanos)}function Ge(e,t){const n=e.values||[],r=t.values||[];for(let i=0;i<n.length&&i<r.length;++i){const e=Ke(n[i],r[i]);if(e)return e}return G(n.length,r.length)}function ze(e){return He(e)}function He(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){const t=De(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?function(e){return Pe(e).toBase64()}(e.bytesValue):"referenceValue"in e?function(e){return ee.fromName(e).toString()}(e.referenceValue):"geoPointValue"in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):"arrayValue"in e?function(e){let t="[",n=!0;for(const r of e.values||[])n?n=!1:t+=",",t+=He(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){const t=Object.keys(e.fields||{}).sort();let n="{",r=!0;for(const i of t)r?r=!1:n+=",",n+=`${i}:${He(e.fields[i])}`;return n+"}"}(e.mapValue):O()}function Qe(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function Xe(e){return!!e&&"integerValue"in e}function Ye(e){return!!e&&"arrayValue"in e}function Je(e){return!!e&&"nullValue"in e}function Ze(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function et(e){return!!e&&"mapValue"in e}function tt(e){var t,n;return"__vector__"===(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{}).__type__)||void 0===n?void 0:n.stringValue)}function nt(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){const t={mapValue:{fields:{}}};return be(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=nt(n)),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=nt(e.arrayValue.values[n]);return t}return Object.assign({},e)}function rt(e){return"__max__"===(((e.mapValue||{}).fields||{}).__type__||{}).stringValue}
/**
 * @license
 * Copyright 2017 Google LLC
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
class it{constructor(e){this.value=e}static empty(){return new it({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!et(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=nt(t)}setAll(e){let t=Z.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){const e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=nt(e):r.push(i.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){const t=this.field(e.popLast());et(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return $e(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];et(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){be(t,(t,n)=>e[t]=n);for(const r of n)delete e[r]}clone(){return new it(nt(this.value))}}function st(e){const t=[];return be(e.fields,(e,n)=>{const r=new Z([e]);if(et(n)){const e=st(n.mapValue).fields;if(0===e.length)t.push(r);else for(const n of e)t.push(r.child(n))}else t.push(r)}),new ke(t)
/**
 * @license
 * Copyright 2017 Google LLC
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
 */}class ot{constructor(e,t,n,r,i,s,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=o}static newInvalidDocument(e){return new ot(e,0,Q.min(),Q.min(),Q.min(),it.empty(),0)}static newFoundDocument(e,t,n,r){return new ot(e,1,t,Q.min(),n,r,0)}static newNoDocument(e,t){return new ot(e,2,t,Q.min(),Q.min(),it.empty(),0)}static newUnknownDocument(e,t){return new ot(e,3,t,Q.min(),Q.min(),it.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Q.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=it.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=it.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof ot&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ot(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
 * @license
 * Copyright 2022 Google LLC
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
 */class at{constructor(e,t){this.position=e,this.inclusive=t}}function ut(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){const s=t[i],o=e.position[i];if(r=s.field.isKeyField()?ee.comparator(ee.fromName(o.referenceValue),n.key):Ke(o,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function ct(e,t){if(null===e)return null===t;if(null===t)return!1;if(e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!$e(e.position[n],t.position[n]))return!1;return!0}
/**
 * @license
 * Copyright 2022 Google LLC
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
 */class lt{constructor(e,t="asc"){this.field=e,this.dir=t}}function ht(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
/**
 * @license
 * Copyright 2022 Google LLC
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
 */class ft{}class dt extends ft{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new bt(e,t,n):"array-contains"===t?new St(e,n):"in"===t?new Ct(e,n):"not-in"===t?new At(e,n):"array-contains-any"===t?new kt(e,n):new dt(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new Et(e,n):new Tt(e,n)}matches(e){const t=e.data.field(this.field);return"!="===this.op?null!==t&&this.matchesComparison(Ke(t,this.value)):null!==t&&Be(this.value)===Be(t)&&this.matchesComparison(Ke(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return O()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class pt extends ft{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new pt(e,t)}matches(e){return gt(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.ae||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function gt(e){return"and"===e.op}function mt(e){return vt(e)&&gt(e)}function vt(e){for(const t of e.filters)if(t instanceof pt)return!1;return!0}function yt(e){if(e instanceof dt)return e.field.canonicalString()+e.op.toString()+ze(e.value);if(mt(e))return e.filters.map(e=>yt(e)).join(",");{const t=e.filters.map(e=>yt(e)).join(",");return`${e.op}(${t})`}}function _t(e,t){return e instanceof dt?function(e,t){return t instanceof dt&&e.op===t.op&&e.field.isEqual(t.field)&&$e(e.value,t.value)}(e,t):e instanceof pt?function(e,t){return t instanceof pt&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce((e,n,r)=>e&&_t(n,t.filters[r]),!0)}(e,t):void O()}function wt(e){return e instanceof dt?function(e){return`${e.field.canonicalString()} ${e.op} ${ze(e.value)}`}(e):e instanceof pt?function(e){return e.op.toString()+" {"+e.getFilters().map(wt).join(" ,")+"}"}(e):"Filter"}class bt extends dt{constructor(e,t,n){super(e,t,n),this.key=ee.fromName(n.referenceValue)}matches(e){const t=ee.comparator(e.key,this.key);return this.matchesComparison(t)}}class Et extends dt{constructor(e,t){super(e,"in",t),this.keys=It("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Tt extends dt{constructor(e,t){super(e,"not-in",t),this.keys=It("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function It(e,t){var n;return((null===(n=t.arrayValue)||void 0===n?void 0:n.values)||[]).map(e=>ee.fromName(e.referenceValue))}class St extends dt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Ye(t)&&qe(t.arrayValue,this.value)}}class Ct extends dt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return null!==t&&qe(this.value.arrayValue,t)}}class At extends dt{constructor(e,t){super(e,"not-in",t)}matches(e){if(qe(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return null!==t&&!qe(this.value.arrayValue,t)}}class kt extends dt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Ye(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>qe(this.value.arrayValue,e))}}
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
 */class Rt{constructor(e,t=null,n=[],r=[],i=null,s=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=o,this.ue=null}}function Ot(e,t=null,n=[],r=[],i=null,s=null,o=null){return new Rt(e,t,n,r,i,s,o)}function Nt(e){const t=D(e);if(null===t.ue){let e=t.path.canonicalString();null!==t.collectionGroup&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(e=>yt(e)).join(","),e+="|ob:",e+=t.orderBy.map(e=>function(e){return e.field.canonicalString()+e.dir}(e)).join(","),de(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(e=>ze(e)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(e=>ze(e)).join(",")),t.ue=e}return t.ue}function Dt(e,t){if(e.limit!==t.limit)return!1;if(e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!ht(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!_t(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!ct(e.startAt,t.startAt)&&ct(e.endAt,t.endAt)}function xt(e){return ee.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}
/**
 * @license
 * Copyright 2017 Google LLC
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
class Pt{constructor(e,t=null,n=[],r=[],i=null,s="F",o=null,a=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=o,this.endAt=a,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Lt(e,t,n,r,i,s,o,a){return new Pt(e,t,n,r,i,s,o,a)}function Mt(e){return new Pt(e)}function Ut(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function Ft(e){return null!==e.collectionGroup}function Vt(e){const t=D(e);if(null===t.ce){t.ce=[];const e=new Set;for(const i of t.explicitOrderBy)t.ce.push(i),e.add(i.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc",r=function(e){let t=new Ce(Z.comparator);return e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t}(t);r.forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.ce.push(new lt(r,n))}),e.has(Z.keyField().canonicalString())||t.ce.push(new lt(Z.keyField(),n))}return t.ce}function jt(e){const t=D(e);return t.le||(t.le=Bt(t,Vt(e))),t.le}function Bt(e,t){if("F"===e.limitType)return Ot(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{const t="desc"===e.dir?"asc":"desc";return new lt(e.field,t)});const n=e.endAt?new at(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new at(e.startAt.position,e.startAt.inclusive):null;return Ot(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function $t(e,t){const n=e.filters.concat([t]);return new Pt(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function qt(e,t,n){return new Pt(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function Kt(e,t){return Dt(jt(e),jt(t))&&e.limitType===t.limitType}function Wt(e){return`${Nt(jt(e))}|lt:${e.limitType}`}function Gt(e){return`Query(target=${function(e){let t=e.path.canonicalString();return null!==e.collectionGroup&&(t+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map(e=>wt(e)).join(", ")}]`),de(e.limit)||(t+=", limit: "+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map(e=>function(e){return`${e.field.canonicalString()} (${e.dir})`}(e)).join(", ")}]`),e.startAt&&(t+=", startAt: ",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(e=>ze(e)).join(",")),e.endAt&&(t+=", endAt: ",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(e=>ze(e)).join(",")),`Target(${t})`}(jt(e))}; limitType=${e.limitType})`}function zt(e,t){return t.isFoundDocument()&&function(e,t){const n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):ee.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(const n of Vt(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(const n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&function(e,t){return!(e.startAt&&!function(e,t,n){const r=ut(e,t,n);return e.inclusive?r<=0:r<0}(e.startAt,Vt(e),t))&&!(e.endAt&&!function(e,t,n){const r=ut(e,t,n);return e.inclusive?r>=0:r>0}(e.endAt,Vt(e),t))}(e,t)}function Ht(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function Qt(e){return(t,n)=>{let r=!1;for(const i of Vt(e)){const e=Xt(i,t,n);if(0!==e)return e;r=r||i.field.isKeyField()}return 0}}function Xt(e,t,n){const r=e.field.isKeyField()?ee.comparator(t.key,n.key):function(e,t,n){const r=t.data.field(e),i=n.data.field(e);return null!==r&&null!==i?Ke(r,i):O()}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return O()}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Yt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n)for(const[r,i]of n)if(this.equalsFn(r,e))return i}has(e){return void 0!==this.get(e)}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){be(this.inner,(t,n)=>{for(const[r,i]of n)e(r,i)})}isEmpty(){return Ee(this.inner)}size(){return this.innerSize}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */const Jt=new Te(ee.comparator);function Zt(){return Jt}const en=new Te(ee.comparator);function tn(...e){let t=en;for(const n of e)t=t.insert(n.key,n);return t}function nn(e){let t=en;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function rn(){return on()}function sn(){return on()}function on(){return new Yt(e=>e.toString(),(e,t)=>e.isEqual(t))}const an=new Te(ee.comparator),un=new Ce(ee.comparator);function cn(...e){let t=un;for(const n of e)t=t.add(n);return t}const ln=new Ce(G);function hn(){return ln}
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
 */function fn(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:pe(t)?"-0":t}}function dn(e){return{integerValue:""+e}}function pn(e,t){return ge(t)?dn(t):fn(e,t)}
/**
 * @license
 * Copyright 2018 Google LLC
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
 */class gn{constructor(){this._=void 0}}function mn(e,t,n){return e instanceof _n?function(e,t){const n={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&Le(t)&&(t=Me(t)),t&&(n.fields.__previous_value__=t),{mapValue:n}}(n,t):e instanceof wn?bn(e,t):e instanceof En?Tn(e,t):function(e,t){const n=yn(e,t),r=Sn(n)+Sn(e.Pe);return Xe(n)&&Xe(e.Pe)?dn(r):fn(e.serializer,r)}(e,t)}function vn(e,t,n){return e instanceof wn?bn(e,t):e instanceof En?Tn(e,t):n}function yn(e,t){return e instanceof In?function(e){return Xe(e)||function(e){return!!e&&"doubleValue"in e}(e)}(t)?t:{integerValue:0}:null}class _n extends gn{}class wn extends gn{constructor(e){super(),this.elements=e}}function bn(e,t){const n=Cn(t);for(const r of e.elements)n.some(e=>$e(e,r))||n.push(r);return{arrayValue:{values:n}}}class En extends gn{constructor(e){super(),this.elements=e}}function Tn(e,t){let n=Cn(t);for(const r of e.elements)n=n.filter(e=>!$e(e,r));return{arrayValue:{values:n}}}class In extends gn{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Sn(e){return xe(e.integerValue||e.doubleValue)}function Cn(e){return Ye(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class An{constructor(e,t){this.field=e,this.transform=t}}function kn(e,t){return e.field.isEqual(t.field)&&function(e,t){return e instanceof wn&&t instanceof wn||e instanceof En&&t instanceof En?z(e.elements,t.elements,$e):e instanceof In&&t instanceof In?$e(e.Pe,t.Pe):e instanceof _n&&t instanceof _n}(e.transform,t.transform)}class Rn{constructor(e,t){this.version=e,this.transformResults=t}}class On{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new On}static exists(e){return new On(void 0,e)}static updateTime(e){return new On(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Nn(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class Dn{}function xn(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new qn(e.key,On.none()):new Fn(e.key,e.data,On.none());{const n=e.data,r=it.empty();let i=new Ce(Z.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),i=i.add(e)}return new Vn(e.key,r,new ke(i.toArray()),On.none())}}function Pn(e,t,n){e instanceof Fn?function(e,t,n){const r=e.value.clone(),i=Bn(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof Vn?function(e,t,n){if(!Nn(e.precondition,t))return void t.convertToUnknownDocument(n.version);const r=Bn(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(jn(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(e,t,n):function(e,t,n){t.convertToNoDocument(n.version).setHasCommittedMutations()}(0,t,n)}function Ln(e,t,n,r){return e instanceof Fn?function(e,t,n,r){if(!Nn(e.precondition,t))return n;const i=e.value.clone(),s=$n(e.fieldTransforms,r,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof Vn?function(e,t,n,r){if(!Nn(e.precondition,t))return n;const i=$n(e.fieldTransforms,r,t),s=t.data;return s.setAll(jn(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===n?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):function(e,t,n){return Nn(e.precondition,t)?(t.convertToNoDocument(t.version).setHasLocalMutations(),null):n}(e,t,n)}function Mn(e,t){let n=null;for(const r of e.fieldTransforms){const e=t.data.field(r.field),i=yn(r.transform,e||null);null!=i&&(null===n&&(n=it.empty()),n.set(r.field,i))}return n||null}function Un(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&!!function(e,t){return void 0===e&&void 0===t||!(!e||!t)&&z(e,t,(e,t)=>kn(e,t))}(e.fieldTransforms,t.fieldTransforms)&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask))}class Fn extends Dn{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Vn extends Dn{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function jn(e){const t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}}),t}function Bn(e,t,n){const r=new Map;N(e.length===n.length);for(let i=0;i<n.length;i++){const s=e[i],o=s.transform,a=t.data.field(s.field);r.set(s.field,vn(o,a,n[i]))}return r}function $n(e,t,n){const r=new Map;for(const i of e){const e=i.transform,s=n.data.field(i.field);r.set(i.field,mn(e,s,t))}return r}class qn extends Dn{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Kn extends Dn{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Wn{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const t=this.mutations[r];t.key.isEqual(e.key)&&Pn(t,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Ln(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Ln(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=sn();return this.mutations.forEach(r=>{const i=e.get(r.key),s=i.overlayedDocument;let o=this.applyToLocalView(s,i.mutatedFields);o=t.has(r.key)?null:o;const a=xn(s,o);null!==a&&n.set(r.key,a),s.isValidDocument()||s.convertToNoDocument(Q.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),cn())}isEqual(e){return this.batchId===e.batchId&&z(this.mutations,e.mutations,(e,t)=>Un(e,t))&&z(this.baseMutations,e.baseMutations,(e,t)=>Un(e,t))}}class Gn{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){N(e.mutations.length===n.length);let r=function(){return an}();const i=e.mutations;for(let s=0;s<i.length;s++)r=r.insert(i[s].key,n[s].version);return new Gn(e,t,n,r)}}
/**
 * @license
 * Copyright 2022 Google LLC
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
 */class zn{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
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
 * Copyright 2017 Google LLC
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
class Hn{constructor(e,t){this.count=e,this.unchangedNames=t}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */var Qn,Xn;function Yn(e){switch(e){default:return O();case x.CANCELLED:case x.UNKNOWN:case x.DEADLINE_EXCEEDED:case x.RESOURCE_EXHAUSTED:case x.INTERNAL:case x.UNAVAILABLE:case x.UNAUTHENTICATED:return!1;case x.INVALID_ARGUMENT:case x.NOT_FOUND:case x.ALREADY_EXISTS:case x.PERMISSION_DENIED:case x.FAILED_PRECONDITION:case x.ABORTED:case x.OUT_OF_RANGE:case x.UNIMPLEMENTED:case x.DATA_LOSS:return!0}}function Jn(e){if(void 0===e)return A("GRPC error has no .code"),x.UNKNOWN;switch(e){case Qn.OK:return x.OK;case Qn.CANCELLED:return x.CANCELLED;case Qn.UNKNOWN:return x.UNKNOWN;case Qn.DEADLINE_EXCEEDED:return x.DEADLINE_EXCEEDED;case Qn.RESOURCE_EXHAUSTED:return x.RESOURCE_EXHAUSTED;case Qn.INTERNAL:return x.INTERNAL;case Qn.UNAVAILABLE:return x.UNAVAILABLE;case Qn.UNAUTHENTICATED:return x.UNAUTHENTICATED;case Qn.INVALID_ARGUMENT:return x.INVALID_ARGUMENT;case Qn.NOT_FOUND:return x.NOT_FOUND;case Qn.ALREADY_EXISTS:return x.ALREADY_EXISTS;case Qn.PERMISSION_DENIED:return x.PERMISSION_DENIED;case Qn.FAILED_PRECONDITION:return x.FAILED_PRECONDITION;case Qn.ABORTED:return x.ABORTED;case Qn.OUT_OF_RANGE:return x.OUT_OF_RANGE;case Qn.UNIMPLEMENTED:return x.UNIMPLEMENTED;case Qn.DATA_LOSS:return x.DATA_LOSS;default:return O()}}(Xn=Qn||(Qn={}))[Xn.OK=0]="OK",Xn[Xn.CANCELLED=1]="CANCELLED",Xn[Xn.UNKNOWN=2]="UNKNOWN",Xn[Xn.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Xn[Xn.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Xn[Xn.NOT_FOUND=5]="NOT_FOUND",Xn[Xn.ALREADY_EXISTS=6]="ALREADY_EXISTS",Xn[Xn.PERMISSION_DENIED=7]="PERMISSION_DENIED",Xn[Xn.UNAUTHENTICATED=16]="UNAUTHENTICATED",Xn[Xn.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Xn[Xn.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Xn[Xn.ABORTED=10]="ABORTED",Xn[Xn.OUT_OF_RANGE=11]="OUT_OF_RANGE",Xn[Xn.UNIMPLEMENTED=12]="UNIMPLEMENTED",Xn[Xn.INTERNAL=13]="INTERNAL",Xn[Xn.UNAVAILABLE=14]="UNAVAILABLE",Xn[Xn.DATA_LOSS=15]="DATA_LOSS";
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
let Zn=null;
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
 */function er(){return new TextEncoder}
/**
 * @license
 * Copyright 2022 Google LLC
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
 */const tr=new r([4294967295,4294967295],0);function nr(e){const t=er().encode(e),n=new i;return n.update(t),new Uint8Array(n.digest())}function rr(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),i=t.getUint32(4,!0),s=t.getUint32(8,!0),o=t.getUint32(12,!0);return[new r([n,i],0),new r([s,o],0)]}class ir{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new sr(`Invalid padding: ${t}`);if(n<0)throw new sr(`Invalid hash count: ${n}`);if(e.length>0&&0===this.hashCount)throw new sr(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new sr(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=r.fromNumber(this.Ie)}Ee(e,t,n){let i=e.add(t.multiply(r.fromNumber(n)));return 1===i.compare(tr)&&(i=new r([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return 0!=(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.Ie)return!1;const t=nr(e),[n,r]=rr(t);for(let i=0;i<this.hashCount;i++){const e=this.Ee(n,r,i);if(!this.de(e))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),s=new ir(i,r,t);return n.forEach(e=>s.insert(e)),s}insert(e){if(0===this.Ie)return;const t=nr(e),[n,r]=rr(t);for(let i=0;i<this.hashCount;i++){const e=this.Ee(n,r,i);this.Ae(e)}}Ae(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class sr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class or{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,ar.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new or(Q.min(),r,new Te(G),Zt(),cn())}}class ar{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new ar(n,t,cn(),cn(),cn())}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class ur{constructor(e,t,n,r){this.Re=e,this.removedTargetIds=t,this.key=n,this.Ve=r}}class cr{constructor(e,t){this.targetId=e,this.me=t}}class lr{constructor(e,t,n=Oe.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class hr{constructor(){this.fe=0,this.ge=pr(),this.pe=Oe.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return 0!==this.fe}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=cn(),t=cn(),n=cn();return this.ge.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:O()}}),new ar(this.pe,this.ye,e,t,n)}Ce(){this.we=!1,this.ge=pr()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,N(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class fr{constructor(e){this.Le=e,this.Be=new Map,this.ke=Zt(),this.qe=dr(),this.Qe=new Te(G)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const n=this.Ge(t);switch(e.state){case 0:this.ze(t)&&n.De(e.resumeToken);break;case 1:n.Oe(),n.Se||n.Ce(),n.De(e.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(n.Ne(),n.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),n.De(e.resumeToken));break;default:O()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((e,n)=>{this.ze(n)&&t(n)})}He(e){const t=e.targetId,n=e.me.count,r=this.Je(t);if(r){const i=r.target;if(xt(i))if(0===n){const e=new ee(i.path);this.Ue(t,e,ot.newNoDocument(e,Q.min()))}else N(1===n);else{const r=this.Ye(t);if(r!==n){const n=this.Ze(e),i=n?this.Xe(n,e,r):1;if(0!==i){this.je(t);const e=2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,e)}null==Zn||Zn.et(function(e,t,n,r,i){var s,o,a,u,c,l;const h={localCacheCount:e,existenceFilterCount:t.count,databaseId:n.database,projectId:n.projectId},f=t.unchangedNames;return f&&(h.bloomFilter={applied:0===i,hashCount:null!==(s=null==f?void 0:f.hashCount)&&void 0!==s?s:0,bitmapLength:null!==(u=null===(a=null===(o=null==f?void 0:f.bits)||void 0===o?void 0:o.bitmap)||void 0===a?void 0:a.length)&&void 0!==u?u:0,padding:null!==(l=null===(c=null==f?void 0:f.bits)||void 0===c?void 0:c.padding)&&void 0!==l?l:0,mightContain:e=>{var t;return null!==(t=null==r?void 0:r.mightContain(e))&&void 0!==t&&t}}),h}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */(r,e.me,this.Le.tt(),n,i))}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:i=0}=t;let s,o;try{s=Pe(n).toUint8Array()}catch(e){if(e instanceof Re)return k("Decoding the base64 bloom filter in existence filter failed ("+e.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw e}try{o=new ir(s,r,i)}catch(e){return k(e instanceof sr?"BloomFilter error: ":"Applying bloom filter failed: ",e),null}return 0===o.Ie?null:o}Xe(e,t,n){return t.me.count===n-this.nt(e,t.targetId)?0:2}nt(e,t){const n=this.Le.getRemoteKeysForTarget(t);let r=0;return n.forEach(n=>{const i=this.Le.tt(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(s)||(this.Ue(t,n,null),r++)}),r}rt(e){const t=new Map;this.Be.forEach((n,r)=>{const i=this.Je(r);if(i){if(n.current&&xt(i.target)){const t=new ee(i.target.path);null!==this.ke.get(t)||this.it(r,t)||this.Ue(r,t,ot.newNoDocument(t,e))}n.be&&(t.set(r,n.ve()),n.Ce())}});let n=cn();this.qe.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{const t=this.Je(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.ke.forEach((t,n)=>n.setReadTime(e));const r=new or(e,t,this.Qe,this.ke,n);return this.ke=Zt(),this.qe=dr(),this.Qe=new Te(G),r}$e(e,t){if(!this.ze(e))return;const n=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,n),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,n){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,t)?r.Fe(t,1):r.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),n&&(this.ke=this.ke.insert(t,n))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new hr,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new Ce(G),this.qe=this.qe.insert(e,t)),t}ze(e){const t=null!==this.Je(e);return t||C("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new hr),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function dr(){return new Te(ee.comparator)}function pr(){return new Te(ee.comparator)}const gr=(()=>{const e={asc:"ASCENDING",desc:"DESCENDING"};return e})(),mr=(()=>{const e={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"};return e})(),vr=(()=>{const e={and:"AND",or:"OR"};return e})();class yr{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function _r(e,t){return e.useProto3Json||de(t)?t:{value:t}}function wr(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function br(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Er(e,t){return wr(e,t.toTimestamp())}function Tr(e){return N(!!e),Q.fromTimestamp(function(e){const t=De(e);return new H(t.seconds,t.nanos)}(e))}function Ir(e,t){return Sr(e,t).canonicalString()}function Sr(e,t){const n=function(e){return new Y(["projects",e.projectId,"databases",e.database])}(e).child("documents");return void 0===t?n:n.child(t)}function Cr(e){const t=Y.fromString(e);return N(Xr(t)),t}function Ar(e,t){return Ir(e.databaseId,t.path)}function kr(e,t){const n=Cr(t);if(n.get(1)!==e.databaseId.projectId)throw new P(x.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new P(x.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new ee(Dr(n))}function Rr(e,t){return Ir(e.databaseId,t)}function Or(e){const t=Cr(e);return 4===t.length?Y.emptyPath():Dr(t)}function Nr(e){return new Y(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function Dr(e){return N(e.length>4&&"documents"===e.get(4)),e.popFirst(5)}function xr(e,t,n){return{name:Ar(e,t),fields:n.value.mapValue.fields}}function Pr(e,t){return"found"in t?function(e,t){N(!!t.found),t.found.name,t.found.updateTime;const n=kr(e,t.found.name),r=Tr(t.found.updateTime),i=t.found.createTime?Tr(t.found.createTime):Q.min(),s=new it({mapValue:{fields:t.found.fields}});return ot.newFoundDocument(n,r,i,s)}(e,t):"missing"in t?function(e,t){N(!!t.missing),N(!!t.readTime);const n=kr(e,t.missing),r=Tr(t.readTime);return ot.newNoDocument(n,r)}(e,t):O()}function Lr(e,t){let n;if("targetChange"in t){t.targetChange;const r=function(e){return"NO_CHANGE"===e?0:"ADD"===e?1:"REMOVE"===e?2:"CURRENT"===e?3:"RESET"===e?4:O()}(t.targetChange.targetChangeType||"NO_CHANGE"),i=t.targetChange.targetIds||[],s=function(e,t){return e.useProto3Json?(N(void 0===t||"string"==typeof t),Oe.fromBase64String(t||"")):(N(void 0===t||t instanceof Buffer||t instanceof Uint8Array),Oe.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),o=t.targetChange.cause,a=o&&function(e){const t=void 0===e.code?x.UNKNOWN:Jn(e.code);return new P(t,e.message||"")}(o);n=new lr(r,i,s,a||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const i=kr(e,r.document.name),s=Tr(r.document.updateTime),o=r.document.createTime?Tr(r.document.createTime):Q.min(),a=new it({mapValue:{fields:r.document.fields}}),u=ot.newFoundDocument(i,s,o,a),c=r.targetIds||[],l=r.removedTargetIds||[];n=new ur(c,l,u.key,u)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const i=kr(e,r.document),s=r.readTime?Tr(r.readTime):Q.min(),o=ot.newNoDocument(i,s),a=r.removedTargetIds||[];n=new ur([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const i=kr(e,r.document),s=r.removedTargetIds||[];n=new ur([],s,i,null)}else{if(!("filter"in t))return O();{t.filter;const e=t.filter;e.targetId;const{count:r=0,unchangedNames:i}=e,s=new Hn(r,i),o=e.targetId;n=new cr(o,s)}}return n}function Mr(e,t){let n;if(t instanceof Fn)n={update:xr(e,t.key,t.value)};else if(t instanceof qn)n={delete:Ar(e,t.key)};else if(t instanceof Vn)n={update:xr(e,t.key,t.data),updateMask:Qr(t.fieldMask)};else{if(!(t instanceof Kn))return O();n={verify:Ar(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>function(e,t){const n=t.transform;if(n instanceof _n)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof wn)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof En)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof In)return{fieldPath:t.field.canonicalString(),increment:n.Pe};throw O()}(0,e))),t.precondition.isNone||(n.currentDocument=function(e,t){return void 0!==t.updateTime?{updateTime:Er(e,t.updateTime)}:void 0!==t.exists?{exists:t.exists}:O()}(e,t.precondition)),n}function Ur(e,t){return e&&e.length>0?(N(void 0!==t),e.map(e=>function(e,t){let n=e.updateTime?Tr(e.updateTime):Tr(t);return n.isEqual(Q.min())&&(n=Tr(t)),new Rn(n,e.transformResults||[])}(e,t))):[]}function Fr(e,t){return{documents:[Rr(e,t.path)]}}function Vr(e,t){const n={structuredQuery:{}},r=t.path;let i;null!==t.collectionGroup?(i=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Rr(e,i);const s=function(e){if(0!==e.length)return Hr(pt.create(e,"and"))}(t.filters);s&&(n.structuredQuery.where=s);const o=function(e){if(0!==e.length)return e.map(e=>function(e){return{field:Gr(e.field),direction:qr(e.dir)}}(e))}(t.orderBy);o&&(n.structuredQuery.orderBy=o);const a=_r(e,t.limit);return null!==a&&(n.structuredQuery.limit=a),t.startAt&&(n.structuredQuery.startAt=function(e){return{before:e.inclusive,values:e.position}}(t.startAt)),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{_t:n,parent:i}}function jr(e){let t=Or(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){N(1===r);const e=n.from[0];e.allDescendants?i=e.collectionId:t=t.child(e.collectionId)}let s=[];n.where&&(s=function(e){const t=$r(e);return t instanceof pt&&mt(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=function(e){return e.map(e=>function(e){return new lt(zr(e.field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(e.direction))}(e))}(n.orderBy));let a=null;n.limit&&(a=function(e){let t;return t="object"==typeof e?e.value:e,de(t)?null:t}(n.limit));let u=null;n.startAt&&(u=function(e){const t=!!e.before,n=e.values||[];return new at(n,t)}(n.startAt));let c=null;return n.endAt&&(c=function(e){const t=!e.before,n=e.values||[];return new at(n,t)}(n.endAt)),Lt(t,i,o,s,a,"F",u,c)}function Br(e,t){const n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return O()}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}function $r(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":const t=zr(e.unaryFilter.field);return dt.create(t,"==",{doubleValue:NaN});case"IS_NULL":const n=zr(e.unaryFilter.field);return dt.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=zr(e.unaryFilter.field);return dt.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const i=zr(e.unaryFilter.field);return dt.create(i,"!=",{nullValue:"NULL_VALUE"});default:return O()}}(e):void 0!==e.fieldFilter?function(e){return dt.create(zr(e.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return O()}}(e.fieldFilter.op),e.fieldFilter.value)}(e):void 0!==e.compositeFilter?function(e){return pt.create(e.compositeFilter.filters.map(e=>$r(e)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return O()}}(e.compositeFilter.op))}(e):O()}function qr(e){return gr[e]}function Kr(e){return mr[e]}function Wr(e){return vr[e]}function Gr(e){return{fieldPath:e.canonicalString()}}function zr(e){return Z.fromServerFormat(e.fieldPath)}function Hr(e){return e instanceof dt?function(e){if("=="===e.op){if(Ze(e.value))return{unaryFilter:{field:Gr(e.field),op:"IS_NAN"}};if(Je(e.value))return{unaryFilter:{field:Gr(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(Ze(e.value))return{unaryFilter:{field:Gr(e.field),op:"IS_NOT_NAN"}};if(Je(e.value))return{unaryFilter:{field:Gr(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Gr(e.field),op:Kr(e.op),value:e.value}}}(e):e instanceof pt?function(e){const t=e.getFilters().map(e=>Hr(e));return 1===t.length?t[0]:{compositeFilter:{op:Wr(e.op),filters:t}}}(e):O()}function Qr(e){const t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Xr(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Yr{constructor(e,t,n,r,i=Q.min(),s=Q.min(),o=Oe.EMPTY_BYTE_STRING,a=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(e){return new Yr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Yr(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Yr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Yr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Jr{constructor(e){this.ct=e}}function Zr(e){const t=jr({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?qt(t,t.limit,"L"):t}
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
class ei{constructor(){}It(e,t){this.Tt(e,t),t.Et()}Tt(e,t){if("nullValue"in e)this.dt(t,5);else if("booleanValue"in e)this.dt(t,10),t.At(e.booleanValue?1:0);else if("integerValue"in e)this.dt(t,15),t.At(xe(e.integerValue));else if("doubleValue"in e){const n=xe(e.doubleValue);isNaN(n)?this.dt(t,13):(this.dt(t,15),pe(n)?t.At(0):t.At(n))}else if("timestampValue"in e){let n=e.timestampValue;this.dt(t,20),"string"==typeof n&&(n=De(n)),t.Rt(`${n.seconds||""}`),t.At(n.nanos||0)}else if("stringValue"in e)this.Vt(e.stringValue,t),this.ft(t);else if("bytesValue"in e)this.dt(t,30),t.gt(Pe(e.bytesValue)),this.ft(t);else if("referenceValue"in e)this.yt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.dt(t,45),t.At(n.latitude||0),t.At(n.longitude||0)}else"mapValue"in e?rt(e)?this.dt(t,Number.MAX_SAFE_INTEGER):tt(e)?this.wt(e.mapValue,t):(this.St(e.mapValue,t),this.ft(t)):"arrayValue"in e?(this.bt(e.arrayValue,t),this.ft(t)):O()}Vt(e,t){this.dt(t,25),this.Dt(e,t)}Dt(e,t){t.Rt(e)}St(e,t){const n=e.fields||{};this.dt(t,55);for(const r of Object.keys(n))this.Vt(r,t),this.Tt(n[r],t)}wt(e,t){var n,r;const i=e.fields||{};this.dt(t,53);const s="value",o=(null===(r=null===(n=i[s].arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.length)||0;this.dt(t,15),t.At(xe(o)),this.Vt(s,t),this.Tt(i[s],t)}bt(e,t){const n=e.values||[];this.dt(t,50);for(const r of n)this.Tt(r,t)}yt(e,t){this.dt(t,37),ee.fromName(e).path.forEach(e=>{this.dt(t,60),this.Dt(e,t)})}dt(e,t){e.At(t)}ft(e){e.At(2)}}ei.vt=new ei;
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
class ti{constructor(){this.un=new ni}addToCollectionParentIndex(e,t){return this.un.add(t),ce.resolve()}getCollectionParents(e,t){return ce.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return ce.resolve()}deleteFieldIndex(e,t){return ce.resolve()}deleteAllFieldIndexes(e){return ce.resolve()}createTargetIndexes(e,t){return ce.resolve()}getDocumentsMatchingTarget(e,t){return ce.resolve(null)}getIndexType(e,t){return ce.resolve(0)}getFieldIndexes(e,t){return ce.resolve([])}getNextCollectionGroupToUpdate(e){return ce.resolve(null)}getMinOffset(e,t){return ce.resolve(ie.min())}getMinOffsetFromCollectionGroup(e,t){return ce.resolve(ie.min())}updateCollectionGroup(e,t,n){return ce.resolve()}updateIndexEntries(e,t){return ce.resolve()}}class ni{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new Ce(Y.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new Ce(Y.comparator)).toArray()}}
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
 */new Uint8Array(0);class ri{constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}static withCacheSize(e){return new ri(e,ri.DEFAULT_COLLECTION_PERCENTILE,ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}
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
 * Copyright 2017 Google LLC
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
 */ri.DEFAULT_COLLECTION_PERCENTILE=10,ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ri.DEFAULT=new ri(41943040,ri.DEFAULT_COLLECTION_PERCENTILE,ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ri.DISABLED=new ri(-1,0,0);
/**
 * @license
 * Copyright 2017 Google LLC
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
class ii{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new ii(0)}static kn(){return new ii(-1)}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 * Copyright 2017 Google LLC
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
class si{constructor(){this.changes=new Yt(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ot.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return void 0!==n?ce.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 * Copyright 2017 Google LLC
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
 * Copyright 2022 Google LLC
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
class oi{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class ai{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&Ln(n.mutation,e,ke.empty(),H.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,cn()).next(()=>t))}getLocalViewOfDocuments(e,t,n=cn()){const r=rn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=tn();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){const n=rn();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,cn()))}populateOverlays(e,t,n){const r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let i=Zt();const s=on(),o=function(){return on()}();return t.forEach((e,t)=>{const o=n.get(t.key);r.has(t.key)&&(void 0===o||o.mutation instanceof Vn)?i=i.insert(t.key,t):void 0!==o?(s.set(t.key,o.mutation.getFieldMask()),Ln(o.mutation,t,o.mutation.getFieldMask(),H.now())):s.set(t.key,ke.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>{var n;return o.set(e,new oi(t,null!==(n=s.get(e))&&void 0!==n?n:null))}),o))}recalculateAndSaveOverlays(e,t){const n=on();let r=new Te((e,t)=>e-t),i=cn();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(const i of e)i.keys().forEach(e=>{const s=t.get(e);if(null===s)return;let o=n.get(e)||ke.empty();o=i.applyToLocalView(s,o),n.set(e,o);const a=(r.get(i.batchId)||cn()).add(e);r=r.insert(i.batchId,a)})}).next(()=>{const s=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,u=r.value,c=sn();u.forEach(e=>{if(!i.has(e)){const r=xn(t.get(e),n.get(e));null!==r&&c.set(e,r),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,a,c))}return ce.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return function(e){return ee.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Ft(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r)}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{const s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):ce.resolve(rn());let o=-1,a=i;return s.next(t=>ce.forEach(t,(t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),i.get(t)?ce.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{a=a.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,a,t,cn())).next(e=>({batchId:o,changes:nn(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ee(t)).next(e=>{let t=tn();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const i=t.collectionGroup;let s=tn();return this.indexManager.getCollectionParents(e,i).next(o=>ce.forEach(o,o=>{const a=function(e,t){return new Pt(t,null,e.explicitOrderBy.slice(),e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(t,o.child(i));return this.getDocumentsMatchingCollectionQuery(e,a,n,r).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(e=>{i.forEach((t,n)=>{const r=n.getKey();null===e.get(r)&&(e=e.insert(r,ot.newInvalidDocument(r)))});let n=tn();return e.forEach((e,r)=>{const s=i.get(e);void 0!==s&&Ln(s.mutation,r,ke.empty(),H.now()),zt(t,r)&&(n=n.insert(e,r))}),n})}}
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
 */class ui{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return ce.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(e){return{id:e.id,version:e.version,createTime:Tr(e.createTime)}}(t)),ce.resolve()}getNamedQuery(e,t){return ce.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(e){return{name:e.name,query:Zr(e.bundledQuery),readTime:Tr(e.readTime)}}(t)),ce.resolve()}}
/**
 * @license
 * Copyright 2022 Google LLC
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
 */class ci{constructor(){this.overlays=new Te(ee.comparator),this.Ir=new Map}getOverlay(e,t){return ce.resolve(this.overlays.get(t))}getOverlays(e,t){const n=rn();return ce.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.ht(e,t,r)}),ce.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.Ir.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.Ir.delete(n)),ce.resolve()}getOverlaysForCollection(e,t,n){const r=rn(),i=t.length+1,s=new ee(t.child("")),o=this.overlays.getIteratorFrom(s);for(;o.hasNext();){const e=o.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return ce.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new Te((e,t)=>e-t);const s=this.overlays.getIterator();for(;s.hasNext();){const e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);null===t&&(t=rn(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}const o=rn(),a=i.getIterator();for(;a.hasNext();)if(a.getNext().value.forEach((e,t)=>o.set(e,t)),o.size()>=r)break;return ce.resolve(o)}ht(e,t,n){const r=this.overlays.get(n.key);if(null!==r){const e=this.Ir.get(r.largestBatchId).delete(n.key);this.Ir.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new zn(t,n));let i=this.Ir.get(t);void 0===i&&(i=cn(),this.Ir.set(t,i)),this.Ir.set(t,i.add(n.key))}}
/**
 * @license
 * Copyright 2024 Google LLC
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
 */class li{constructor(){this.sessionToken=Oe.EMPTY_BYTE_STRING}getSessionToken(e){return ce.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,ce.resolve()}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class hi{constructor(){this.Tr=new Ce(fi.Er),this.dr=new Ce(fi.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const n=new fi(e,t);this.Tr=this.Tr.add(n),this.dr=this.dr.add(n)}Rr(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Vr(new fi(e,t))}mr(e,t){e.forEach(e=>this.removeReference(e,t))}gr(e){const t=new ee(new Y([])),n=new fi(t,e),r=new fi(t,e+1),i=[];return this.dr.forEachInRange([n,r],e=>{this.Vr(e),i.push(e.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new ee(new Y([])),n=new fi(t,e),r=new fi(t,e+1);let i=cn();return this.dr.forEachInRange([n,r],e=>{i=i.add(e.key)}),i}containsKey(e){const t=new fi(e,0),n=this.Tr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class fi{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return ee.comparator(e.key,t.key)||G(e.wr,t.wr)}static Ar(e,t){return G(e.wr,t.wr)||ee.comparator(e.key,t.key)}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class di{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Ce(fi.Er)}checkEmpty(e){return ce.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const s=new Wn(i,t,n,r);this.mutationQueue.push(s);for(const o of r)this.br=this.br.add(new fi(o.key,i)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return ce.resolve(s)}lookupMutationBatch(e,t){return ce.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.vr(n),i=r<0?0:r;return ce.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return ce.resolve(0===this.mutationQueue.length?-1:this.Sr-1)}getAllMutationBatches(e){return ce.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new fi(t,0),r=new fi(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([n,r],e=>{const t=this.Dr(e.wr);i.push(t)}),ce.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ce(G);return t.forEach(e=>{const t=new fi(e,0),r=new fi(e,Number.POSITIVE_INFINITY);this.br.forEachInRange([t,r],e=>{n=n.add(e.wr)})}),ce.resolve(this.Cr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let i=n;ee.isDocumentKey(i)||(i=i.child(""));const s=new fi(new ee(i),0);let o=new Ce(G);return this.br.forEachWhile(e=>{const t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.wr)),!0)},s),ce.resolve(this.Cr(o))}Cr(e){const t=[];return e.forEach(e=>{const n=this.Dr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){N(0===this.Fr(t.batchId,"removed")),this.mutationQueue.shift();let n=this.br;return ce.forEach(t.mutations,r=>{const i=new fi(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=n})}On(e){}containsKey(e,t){const n=new fi(t,0),r=this.br.firstAfterOrEqual(n);return ce.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,ce.resolve()}Fr(e,t){return this.vr(e)}vr(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class pi{constructor(e){this.Mr=e,this.docs=function(){return new Te(ee.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),i=r?r.size:0,s=this.Mr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return ce.resolve(n?n.document.mutableCopy():ot.newInvalidDocument(t))}getEntries(e,t){let n=Zt();return t.forEach(e=>{const t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():ot.newInvalidDocument(e))}),ce.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=Zt();const s=t.path,o=new ee(s.child("")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:e,value:{document:o}}=a.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||se(re(o),n)<=0||(r.has(o.key)||zt(t,o))&&(i=i.insert(o.key,o.mutableCopy()))}return ce.resolve(i)}getAllFromCollectionGroup(e,t,n,r){O()}Or(e,t){return ce.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new gi(this)}getSize(e){return ce.resolve(this.size)}}class gi extends si{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.cr.addEntry(e,r)):this.cr.removeEntry(n)}),ce.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class mi{constructor(e){this.persistence=e,this.Nr=new Yt(e=>Nt(e),Dt),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.Lr=0,this.Br=new hi,this.targetCount=0,this.kr=ii.Bn()}forEachTarget(e,t){return this.Nr.forEach((e,n)=>t(n)),ce.resolve()}getLastRemoteSnapshotVersion(e){return ce.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return ce.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),ce.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.Lr&&(this.Lr=t),ce.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new ii(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,ce.resolve()}updateTargetData(e,t){return this.Kn(t),ce.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,ce.resolve()}removeTargets(e,t,n){let r=0;const i=[];return this.Nr.forEach((s,o)=>{o.sequenceNumber<=t&&null===n.get(o.targetId)&&(this.Nr.delete(s),i.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)}),ce.waitFor(i).next(()=>r)}getTargetCount(e){return ce.resolve(this.targetCount)}getTargetData(e,t){const n=this.Nr.get(t)||null;return ce.resolve(n)}addMatchingKeys(e,t,n){return this.Br.Rr(t,n),ce.resolve()}removeMatchingKeys(e,t,n){this.Br.mr(t,n);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(t=>{i.push(r.markPotentiallyOrphaned(e,t))}),ce.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),ce.resolve()}getMatchingKeysForTargetId(e,t){const n=this.Br.yr(t);return ce.resolve(n)}containsKey(e,t){return ce.resolve(this.Br.containsKey(t))}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class vi{constructor(e,t){this.qr={},this.overlays={},this.Qr=new fe(0),this.Kr=!1,this.Kr=!0,this.$r=new li,this.referenceDelegate=e(this),this.Ur=new mi(this),this.indexManager=new ti,this.remoteDocumentCache=function(e){return new pi(e)}(e=>this.referenceDelegate.Wr(e)),this.serializer=new Jr(t),this.Gr=new ui(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new ci,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.qr[e.toKey()];return n||(n=new di(t,this.referenceDelegate),this.qr[e.toKey()]=n),n}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,n){C("MemoryPersistence","Starting transaction:",e);const r=new yi(this.Qr.next());return this.referenceDelegate.zr(),n(r).next(e=>this.referenceDelegate.jr(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Hr(e,t){return ce.or(Object.values(this.qr).map(n=>()=>n.containsKey(e,t)))}}class yi extends ae{constructor(e){super(),this.currentSequenceNumber=e}}class _i{constructor(e){this.persistence=e,this.Jr=new hi,this.Yr=null}static Zr(e){return new _i(e)}get Xr(){if(this.Yr)return this.Yr;throw O()}addReference(e,t,n){return this.Jr.addReference(n,t),this.Xr.delete(n.toString()),ce.resolve()}removeReference(e,t,n){return this.Jr.removeReference(n,t),this.Xr.add(n.toString()),ce.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),ce.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(e=>this.Xr.add(e.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.Xr.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return ce.forEach(this.Xr,n=>{const r=ee.fromPath(n);return this.ei(e,r).next(e=>{e||t.removeEntry(r,Q.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(e=>{e?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return ce.or([()=>ce.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}
/**
 * @license
 * Copyright 2017 Google LLC
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
class wi{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.$i=n,this.Ui=r}static Wi(e,t){let n=cn(),r=cn();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new wi(e,t.fromCache,n,r)}}
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
 */class bi{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}
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
 */class Ei{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return(0,u.nr)()?8:le((0,u.ZQ)())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,n,r){const i={result:null};return this.Yi(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.Zi(e,t,r,n).next(e=>{i.result=e})}).next(()=>{if(i.result)return;const n=new bi;return this.Xi(e,t,n).next(r=>{if(i.result=r,this.zi)return this.es(e,t,n,r.size)})}).next(()=>i.result)}es(e,t,n,r){return n.documentReadCount<this.ji?(S()<=a.$b.DEBUG&&C("QueryEngine","SDK will not create cache indexes for query:",Gt(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),ce.resolve()):(S()<=a.$b.DEBUG&&C("QueryEngine","Query:",Gt(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.Hi*r?(S()<=a.$b.DEBUG&&C("QueryEngine","The SDK decides to create cache indexes for query:",Gt(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,jt(t))):ce.resolve())}Yi(e,t){if(Ut(t))return ce.resolve(null);let n=jt(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(t=qt(t,null,"F"),n=jt(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{const i=cn(...r);return this.Ji.getDocuments(e,i).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{const s=this.ts(t,r);return this.ns(t,s,i,n.readTime)?this.Yi(e,qt(t,null,"F")):this.rs(e,s,t,n)}))})))}Zi(e,t,n,r){return Ut(t)||r.isEqual(Q.min())?ce.resolve(null):this.Ji.getDocuments(e,n).next(i=>{const s=this.ts(t,i);return this.ns(t,s,n,r)?ce.resolve(null):(S()<=a.$b.DEBUG&&C("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Gt(t)),this.rs(e,s,t,ne(r,-1)).next(e=>e))})}ts(e,t){let n=new Ce(Qt(e));return t.forEach((t,r)=>{zt(e,r)&&(n=n.add(r))}),n}ns(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;const i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Xi(e,t,n){return S()<=a.$b.DEBUG&&C("QueryEngine","Using full collection scan to execute query:",Gt(t)),this.Ji.getDocumentsMatchingQuery(e,t,ie.min(),n)}rs(e,t,n,r){return this.Ji.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}
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
 */class Ti{constructor(e,t,n,r){this.persistence=e,this.ss=t,this.serializer=r,this.os=new Te(G),this._s=new Yt(e=>Nt(e),Dt),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(n)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ai(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function Ii(e,t,n,r){return new Ti(e,t,n,r)}async function Si(e,t){const n=D(e);return await n.persistence.runTransaction("Handle user change","readonly",e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next(i=>(r=i,n.ls(t),n.mutationQueue.getAllMutationBatches(e))).next(t=>{const i=[],s=[];let o=cn();for(const e of r){i.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}for(const e of t){s.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next(e=>({hs:e,removedBatchIds:i,addedBatchIds:s}))})})}function Ci(e,t){const n=D(e);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{const r=t.batch.keys(),i=n.cs.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){const i=n.batch,s=i.keys();let o=ce.resolve();return s.forEach(e=>{o=o.next(()=>r.getEntry(t,e)).next(t=>{const s=n.docVersions.get(e);N(null!==s),t.version.compareTo(s)<0&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),o.next(()=>e.mutationQueue.removeMutationBatch(t,i))}(n,e,t,i).next(()=>i.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=cn();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))})}function Ai(e){const t=D(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Ur.getLastRemoteSnapshotVersion(e))}function ki(e,t){const n=D(e),r=t.snapshotVersion;let i=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",e=>{const s=n.cs.newChangeBuffer({trackRemovals:!0});i=n.os;const o=[];t.targetChanges.forEach((s,a)=>{const u=i.get(a);if(!u)return;o.push(n.Ur.removeMatchingKeys(e,s.removedDocuments,a).next(()=>n.Ur.addMatchingKeys(e,s.addedDocuments,a)));let c=u.withSequenceNumber(e.currentSequenceNumber);null!==t.targetMismatches.get(a)?c=c.withResumeToken(Oe.EMPTY_BYTE_STRING,Q.min()).withLastLimboFreeSnapshotVersion(Q.min()):s.resumeToken.approximateByteSize()>0&&(c=c.withResumeToken(s.resumeToken,r)),i=i.insert(a,c),function(e,t,n){return 0===e.resumeToken.approximateByteSize()||(t.snapshotVersion.toMicroseconds()-e.snapshotVersion.toMicroseconds()>=3e8||n.addedDocuments.size+n.modifiedDocuments.size+n.removedDocuments.size>0)}(u,c,s)&&o.push(n.Ur.updateTargetData(e,c))});let a=Zt(),u=cn();if(t.documentUpdates.forEach(r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))}),o.push(Ri(e,s,t.documentUpdates).next(e=>{a=e.Ps,u=e.Is})),!r.isEqual(Q.min())){const t=n.Ur.getLastRemoteSnapshotVersion(e).next(t=>n.Ur.setTargetsMetadata(e,e.currentSequenceNumber,r));o.push(t)}return ce.waitFor(o).next(()=>s.apply(e)).next(()=>n.localDocuments.getLocalViewOfDocuments(e,a,u)).next(()=>a)}).then(e=>(n.os=i,e))}function Ri(e,t,n){let r=cn(),i=cn();return n.forEach(e=>r=r.add(e)),t.getEntries(e,r).next(e=>{let r=Zt();return n.forEach((n,s)=>{const o=e.get(n);s.isFoundDocument()!==o.isFoundDocument()&&(i=i.add(n)),s.isNoDocument()&&s.version.isEqual(Q.min())?(t.removeEntry(n,s.readTime),r=r.insert(n,s)):!o.isValidDocument()||s.version.compareTo(o.version)>0||0===s.version.compareTo(o.version)&&o.hasPendingWrites?(t.addEntry(s),r=r.insert(n,s)):C("LocalStore","Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",s.version)}),{Ps:r,Is:i}})}function Oi(e,t){const n=D(e);return n.persistence.runTransaction("Get next mutation batch","readonly",e=>(void 0===t&&(t=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t)))}function Ni(e,t){const n=D(e);return n.persistence.runTransaction("Allocate target","readwrite",e=>{let r;return n.Ur.getTargetData(e,t).next(i=>i?(r=i,ce.resolve(r)):n.Ur.allocateTargetId(e).next(i=>(r=new Yr(t,i,"TargetPurposeListen",e.currentSequenceNumber),n.Ur.addTargetData(e,r).next(()=>r))))}).then(e=>{const r=n.os.get(e.targetId);return(null===r||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.os=n.os.insert(e.targetId,e),n._s.set(t,e.targetId)),e})}async function Di(e,t,n){const r=D(e),i=r.os.get(t),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,e=>r.persistence.referenceDelegate.removeTarget(e,i))}catch(e){if(!he(e))throw e;C("LocalStore",`Failed to update sequence numbers for target ${t}: ${e}`)}r.os=r.os.remove(t),r._s.delete(i.target)}function xi(e,t,n){const r=D(e);let i=Q.min(),s=cn();return r.persistence.runTransaction("Execute query","readwrite",e=>function(e,t,n){const r=D(e),i=r._s.get(n);return void 0!==i?ce.resolve(r.os.get(i)):r.Ur.getTargetData(t,n)}(r,e,jt(t)).next(t=>{if(t)return i=t.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(e,t.targetId).next(e=>{s=e})}).next(()=>r.ss.getDocumentsMatchingQuery(e,t,n?i:Q.min(),n?s:cn())).next(e=>(Pi(r,Ht(t),e),{documents:e,Ts:s})))}function Pi(e,t,n){let r=e.us.get(t)||Q.min();n.forEach((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)}),e.us.set(t,r)}class Li{constructor(){this.activeTargetIds=hn()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Mi{constructor(){this.so=new Li,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,n){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Li,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}
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
 */class Ui{_o(e){}shutdown(){}}
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
 */class Fi{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){C("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){C("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
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
 */let Vi=null;function ji(){return null===Vi?Vi=function(){return 268435456+Math.round(2147483648*Math.random())}():Vi++,"0x"+Vi.toString(16)
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
 */}const Bi={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class $i{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */const qi="WebChannelConnection";class Ki extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=t+"://"+e.host,this.vo=`projects/${n}/databases/${r}`,this.Co="(default)"===this.databaseId.database?`project_id=${n}`:`project_id=${n}&database_id=${r}`}get Fo(){return!1}Mo(e,t,n,r,i){const s=ji(),o=this.xo(e,t.toUriEncodedString());C("RestConnection",`Sending RPC '${e}' ${s}:`,o,n);const a={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(a,r,i),this.No(e,o,a,n).then(t=>(C("RestConnection",`Received RPC '${e}' ${s}: `,t),t),t=>{throw k("RestConnection",`RPC '${e}' ${s} failed with error: `,t,"url: ",o,"request:",n),t})}Lo(e,t,n,r,i,s){return this.Mo(e,t,n,r,i)}Oo(e,t,n){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+T}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}xo(e,t){const n=Bi[e];return`${this.Do}/v1/${t}:${n}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,n,r){const i=ji();return new Promise((s,o)=>{const a=new h;a.setWithCredentials(!0),a.listenOnce(d.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case p.NO_ERROR:const t=a.getResponseJson();C(qi,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(t)),s(t);break;case p.TIMEOUT:C(qi,`RPC '${e}' ${i} timed out`),o(new P(x.DEADLINE_EXCEEDED,"Request time out"));break;case p.HTTP_ERROR:const n=a.getStatus();if(C(qi,`RPC '${e}' ${i} failed with status:`,n,"response text:",a.getResponseText()),n>0){let e=a.getResponseJson();Array.isArray(e)&&(e=e[0]);const t=null==e?void 0:e.error;if(t&&t.status&&t.message){const e=function(e){const t=e.toLowerCase().replace(/_/g,"-");return Object.values(x).indexOf(t)>=0?t:x.UNKNOWN}(t.status);o(new P(e,t.message))}else o(new P(x.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new P(x.UNAVAILABLE,"Connection failed."));break;default:O()}}finally{C(qi,`RPC '${e}' ${i} completed.`)}});const u=JSON.stringify(r);C(qi,`RPC '${e}' ${i} sending request:`,r),a.send(t,"POST",u,n,15)})}Bo(e,t,n){const r=ji(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],s=y(),o=v(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;void 0!==u&&(a.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(a.useFetchStreams=!0),this.Oo(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const c=i.join("");C(qi,`Creating RPC '${e}' stream ${r}: ${c}`,a);const l=s.createWebChannel(c,a);let h=!1,d=!1;const p=new $i({Io:t=>{d?C(qi,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(h||(C(qi,`Opening RPC '${e}' stream ${r} transport.`),l.open(),h=!0),C(qi,`RPC '${e}' stream ${r} sending:`,t),l.send(t))},To:()=>l.close()}),_=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(e){setTimeout(()=>{throw e},0)}})};return _(l,f.EventType.OPEN,()=>{d||(C(qi,`RPC '${e}' stream ${r} transport opened.`),p.yo())}),_(l,f.EventType.CLOSE,()=>{d||(d=!0,C(qi,`RPC '${e}' stream ${r} transport closed`),p.So())}),_(l,f.EventType.ERROR,t=>{d||(d=!0,k(qi,`RPC '${e}' stream ${r} transport errored:`,t),p.So(new P(x.UNAVAILABLE,"The operation could not be completed")))}),_(l,f.EventType.MESSAGE,t=>{var n;if(!d){const i=t.data[0];N(!!i);const s=i,o=s.error||(null===(n=s[0])||void 0===n?void 0:n.error);if(o){C(qi,`RPC '${e}' stream ${r} received error:`,o);const t=o.status;let n=function(e){const t=Qn[e];if(void 0!==t)return Jn(t)}(t),i=o.message;void 0===n&&(n=x.INTERNAL,i="Unknown error status: "+t+" with message "+o.message),d=!0,p.So(new P(n,i)),l.close()}else C(qi,`RPC '${e}' stream ${r} received:`,i),p.bo(i)}}),_(o,m.STAT_EVENT,t=>{t.stat===g.PROXY?C(qi,`RPC '${e}' stream ${r} detected buffering proxy`):t.stat===g.NOPROXY&&C(qi,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{p.wo()},0),p}}
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
 */function Wi(){return"undefined"!=typeof document?document:null}
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
 */function Gi(e){return new yr(e,!0)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class zi{constructor(e,t,n=1e3,r=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=n,this.qo=r,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),n=Math.max(0,Date.now()-this.Uo),r=Math.max(0,t-n);r>0&&C("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){null!==this.$o&&(this.$o.skipDelay(),this.$o=null)}cancel(){null!==this.$o&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Hi{constructor(e,t,n,r,i,s,o,a){this.ui=e,this.Ho=n,this.Jo=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new zi(e,t)}n_(){return 1===this.state||5===this.state||this.r_()}r_(){return 2===this.state||3===this.state}start(){this.e_=0,4!==this.state?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&null===this.Zo&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,4!==e?this.t_.reset():t&&t.code===x.RESOURCE_EXHAUSTED?(A(t.toString()),A("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===x.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.Yo===t&&this.P_(e,n)},t=>{e(()=>{const e=new P(x.UNKNOWN,"Fetching auth token failed: "+t.message);return this.I_(e)})})}P_(e,t){const n=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{n(()=>this.listener.Eo())}),this.stream.Ro(()=>{n(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(e=>{n(()=>this.I_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.e_?this.E_(e):this.onNext(e))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return C("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(C("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Qi extends Hi{constructor(e,t,n,r,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=Lr(this.serializer,e),n=function(e){if(!("targetChange"in e))return Q.min();const t=e.targetChange;return t.targetIds&&t.targetIds.length?Q.min():t.readTime?Tr(t.readTime):Q.min()}(e);return this.listener.d_(t,n)}A_(e){const t={};t.database=Nr(this.serializer),t.addTarget=function(e,t){let n;const r=t.target;if(n=xt(r)?{documents:Fr(e,r)}:{query:Vr(e,r)._t},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=br(e,t.resumeToken);const r=_r(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(Q.min())>0){n.readTime=wr(e,t.snapshotVersion.toTimestamp());const r=_r(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);const n=Br(this.serializer,e);n&&(t.labels=n),this.a_(t)}R_(e){const t={};t.database=Nr(this.serializer),t.removeTarget=e,this.a_(t)}}class Xi extends Hi{constructor(e,t,n,r,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return N(!!e.streamToken),this.lastStreamToken=e.streamToken,N(!e.writeResults||0===e.writeResults.length),this.listener.f_()}onNext(e){N(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Ur(e.writeResults,e.commitTime),n=Tr(e.commitTime);return this.listener.g_(n,t)}p_(){const e={};e.database=Nr(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(e=>Mr(this.serializer,e))};this.a_(t)}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Yi extends class{}{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new P(x.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,n,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Mo(e,Sr(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===x.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new P(x.UNKNOWN,e.toString())})}Lo(e,t,n,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Lo(e,Sr(t,n),r,s,o,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===x.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new P(x.UNKNOWN,e.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class Ji{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){0===this.S_&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){"Online"===this.state?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,"Online"===e&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(A(t),this.D_=!1):C("OnlineStateTracker",t)}x_(){null!==this.b_&&(this.b_.cancel(),this.b_=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Zi{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(e=>{n.enqueueAndForget(async()=>{us(this)&&(C("RemoteStore","Restarting streams for network reachability change."),await async function(e){const t=D(e);t.L_.add(4),await ts(t),t.q_.set("Unknown"),t.L_.delete(4),await es(t)}(this))})}),this.q_=new Ji(n,r)}}async function es(e){if(us(e))for(const t of e.B_)await t(!0)}async function ts(e){for(const t of e.B_)await t(!1)}function ns(e,t){const n=D(e);n.N_.has(t.targetId)||(n.N_.set(t.targetId,t),as(n)?os(n):As(n).r_()&&is(n,t))}function rs(e,t){const n=D(e),r=As(n);n.N_.delete(t),r.r_()&&ss(n,t),0===n.N_.size&&(r.r_()?r.o_():us(n)&&n.q_.set("Unknown"))}function is(e,t){if(e.Q_.xe(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(Q.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}As(e).A_(t)}function ss(e,t){e.Q_.xe(t),As(e).R_(t)}function os(e){e.Q_=new fr({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),ot:t=>e.N_.get(t)||null,tt:()=>e.datastore.serializer.databaseId}),As(e).start(),e.q_.v_()}function as(e){return us(e)&&!As(e).n_()&&e.N_.size>0}function us(e){return 0===D(e).L_.size}function cs(e){e.Q_=void 0}async function ls(e){e.q_.set("Online")}async function hs(e){e.N_.forEach((t,n)=>{is(e,t)})}async function fs(e,t){cs(e),as(e)?(e.q_.M_(t),os(e)):e.q_.set("Unknown")}async function ds(e,t,n){if(e.q_.set("Online"),t instanceof lr&&2===t.state&&t.cause)try{await async function(e,t){const n=t.cause;for(const r of t.targetIds)e.N_.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.N_.delete(r),e.Q_.removeTarget(r))}(e,t)}catch(n){C("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),n),await ps(e,n)}else if(t instanceof ur?e.Q_.Ke(t):t instanceof cr?e.Q_.He(t):e.Q_.We(t),!n.isEqual(Q.min()))try{const t=await Ai(e.localStore);n.compareTo(t)>=0&&await function(e,t){const n=e.Q_.rt(t);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const i=e.N_.get(r);i&&e.N_.set(r,i.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{const r=e.N_.get(t);if(!r)return;e.N_.set(t,r.withResumeToken(Oe.EMPTY_BYTE_STRING,r.snapshotVersion)),ss(e,t);const i=new Yr(r.target,t,n,r.sequenceNumber);is(e,i)}),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(t){C("RemoteStore","Failed to raise snapshot:",t),await ps(e,t)}}async function ps(e,t,n){if(!he(t))throw t;e.L_.add(1),await ts(e),e.q_.set("Offline"),n||(n=()=>Ai(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{C("RemoteStore","Retrying IndexedDB access"),await n(),e.L_.delete(1),await es(e)})}function gs(e,t){return t().catch(n=>ps(e,n,t))}async function ms(e){const t=D(e),n=ks(t);let r=t.O_.length>0?t.O_[t.O_.length-1].batchId:-1;for(;vs(t);)try{const e=await Oi(t.localStore,r);if(null===e){0===t.O_.length&&n.o_();break}r=e.batchId,ys(t,e)}catch(e){await ps(t,e)}_s(t)&&ws(t)}function vs(e){return us(e)&&e.O_.length<10}function ys(e,t){e.O_.push(t);const n=ks(e);n.r_()&&n.V_&&n.m_(t.mutations)}function _s(e){return us(e)&&!ks(e).n_()&&e.O_.length>0}function ws(e){ks(e).start()}async function bs(e){ks(e).p_()}async function Es(e){const t=ks(e);for(const n of e.O_)t.m_(n.mutations)}async function Ts(e,t,n){const r=e.O_.shift(),i=Gn.from(r,t,n);await gs(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await ms(e)}async function Is(e,t){t&&ks(e).V_&&await async function(e,t){if(function(e){return Yn(e)&&e!==x.ABORTED}(t.code)){const n=e.O_.shift();ks(e).s_(),await gs(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await ms(e)}}(e,t),_s(e)&&ws(e)}async function Ss(e,t){const n=D(e);n.asyncQueue.verifyOperationInProgress(),C("RemoteStore","RemoteStore received new credentials");const r=us(n);n.L_.add(3),await ts(n),r&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.L_.delete(3),await es(n)}async function Cs(e,t){const n=D(e);t?(n.L_.delete(2),await es(n)):t||(n.L_.add(2),await ts(n),n.q_.set("Unknown"))}function As(e){return e.K_||(e.K_=function(e,t,n){const r=D(e);return r.w_(),new Qi(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)
/**
 * @license
 * Copyright 2018 Google LLC
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
 */}(e.datastore,e.asyncQueue,{Eo:ls.bind(null,e),Ro:hs.bind(null,e),mo:fs.bind(null,e),d_:ds.bind(null,e)}),e.B_.push(async t=>{t?(e.K_.s_(),as(e)?os(e):e.q_.set("Unknown")):(await e.K_.stop(),cs(e))})),e.K_}function ks(e){return e.U_||(e.U_=function(e,t,n){const r=D(e);return r.w_(),new Xi(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Eo:()=>Promise.resolve(),Ro:bs.bind(null,e),mo:Is.bind(null,e),f_:Es.bind(null,e),g_:Ts.bind(null,e)}),e.B_.push(async t=>{t?(e.U_.s_(),await ms(e)):(await e.U_.stop(),e.O_.length>0&&(C("RemoteStore",`Stopping write stream with ${e.O_.length} pending writes`),e.O_=[]))})),e.U_
/**
 * @license
 * Copyright 2017 Google LLC
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
 */}class Rs{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new L,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){const s=Date.now()+n,o=new Rs(e,t,s,r,i);return o.start(n),o}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new P(x.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Os(e,t){if(A("AsyncQueue",`${t}: ${e}`),he(e))return new P(x.UNAVAILABLE,`${t}: ${e}`);throw e}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Ns{constructor(e){this.comparator=e?(t,n)=>e(t,n)||ee.comparator(t.key,n.key):(e,t)=>ee.comparator(e.key,t.key),this.keyedMap=tn(),this.sortedSet=new Te(this.comparator)}static emptySet(e){return new Ns(e.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ns))return!1;if(this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){const n=new Ns;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Ds{constructor(){this.W_=new Te(ee.comparator)}track(e){const t=e.doc.key,n=this.W_.get(t);n?0!==e.type&&3===n.type?this.W_=this.W_.insert(t,e):3===e.type&&1!==n.type?this.W_=this.W_.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.W_=this.W_.remove(t):1===e.type&&2===n.type?this.W_=this.W_.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):O():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,n)=>{e.push(n)}),e}}class xs{constructor(e,t,n,r,i,s,o,a,u){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=u}static fromInitialDocuments(e,t,n,r,i){const s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new xs(e,t,Ns.emptySet(t),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Kt(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Ps{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class Ls{constructor(){this.queries=Ms(),this.onlineState="Unknown",this.Y_=new Set}terminate(){!function(e,t){const n=D(e),r=n.queries;n.queries=Ms(),r.forEach((e,n)=>{for(const r of n.j_)r.onError(t)})}(this,new P(x.ABORTED,"Firestore shutting down"))}}function Ms(){return new Yt(e=>Wt(e),Kt)}async function Us(e,t){const n=D(e);let r=3;const i=t.query;let s=n.queries.get(i);s?!s.H_()&&t.J_()&&(r=2):(s=new Ps,r=t.J_()?0:1);try{switch(r){case 0:s.z_=await n.onListen(i,!0);break;case 1:s.z_=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(e){const n=Os(e,`Initialization of query '${Gt(t.query)}' failed`);return void t.onError(n)}n.queries.set(i,s),s.j_.push(t),t.Z_(n.onlineState),s.z_&&t.X_(s.z_)&&Bs(n)}async function Fs(e,t){const n=D(e),r=t.query;let i=3;const s=n.queries.get(r);if(s){const e=s.j_.indexOf(t);e>=0&&(s.j_.splice(e,1),0===s.j_.length?i=t.J_()?0:1:!s.H_()&&t.J_()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function Vs(e,t){const n=D(e);let r=!1;for(const i of t){const e=i.query,t=n.queries.get(e);if(t){for(const e of t.j_)e.X_(i)&&(r=!0);t.z_=i}}r&&Bs(n)}function js(e,t,n){const r=D(e),i=r.queries.get(t);if(i)for(const s of i.j_)s.onError(n);r.queries.delete(t)}function Bs(e){e.Y_.forEach(e=>{e.next()})}var $s,qs;(qs=$s||($s={})).ea="default",qs.Cache="cache";class Ks{constructor(e,t,n){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=n||{}}X_(e){if(!this.options.includeMetadataChanges){const t=[];for(const n of e.docChanges)3!==n.type&&t.push(n);e=new xs(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache)return!0;if(!this.J_())return!0;const n="Offline"!==t;return(!this.options._a||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}oa(e){e=xs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==$s.Cache}}
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
 * Copyright 2017 Google LLC
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
class Ws{constructor(e){this.key=e}}class Gs{constructor(e){this.key=e}}class zs{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=cn(),this.mutatedKeys=cn(),this.Aa=Qt(e),this.Ra=new Ns(this.Aa)}get Va(){return this.Ta}ma(e,t){const n=t?t.fa:new Ds,r=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,s=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,u="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{const c=r.get(e),l=zt(this.query,t)?t:null,h=!!c&&this.mutatedKeys.has(c.key),f=!!l&&(l.hasLocalMutations||this.mutatedKeys.has(l.key)&&l.hasCommittedMutations);let d=!1;c&&l?c.data.isEqual(l.data)?h!==f&&(n.track({type:3,doc:l}),d=!0):this.ga(c,l)||(n.track({type:2,doc:l}),d=!0,(a&&this.Aa(l,a)>0||u&&this.Aa(l,u)<0)&&(o=!0)):!c&&l?(n.track({type:0,doc:l}),d=!0):c&&!l&&(n.track({type:1,doc:c}),d=!0,(a||u)&&(o=!0)),d&&(l?(s=s.add(l),i=f?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){const e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{Ra:s,fa:n,ns:o,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const s=e.fa.G_();s.sort((e,t)=>function(e,t){const n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return O()}};return n(e)-n(t)}
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
 */(e.type,t.type)||this.Aa(e.doc,t.doc)),this.pa(n),r=null!=r&&r;const o=t&&!r?this.ya():[],a=0===this.da.size&&this.current&&!r?1:0,u=a!==this.Ea;return this.Ea=a,0!==s.length||u?{snapshot:new xs(this.query,e.Ra,i,s,e.mutatedKeys,0===a,u,!1,!!n&&n.resumeToken.approximateByteSize()>0),wa:o}:{wa:o}}Z_(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Ds,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(e=>this.Ta=this.Ta.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Ta=this.Ta.delete(e)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=cn(),this.Ra.forEach(e=>{this.Sa(e.key)&&(this.da=this.da.add(e.key))});const t=[];return e.forEach(e=>{this.da.has(e)||t.push(new Gs(e))}),this.da.forEach(n=>{e.has(n)||t.push(new Ws(n))}),t}ba(e){this.Ta=e.Ts,this.da=cn();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return xs.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,0===this.Ea,this.hasCachedResults)}}class Hs{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Qs{constructor(e){this.key=e,this.va=!1}}class Xs{constructor(e,t,n,r,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.Ca={},this.Fa=new Yt(e=>Wt(e),Kt),this.Ma=new Map,this.xa=new Set,this.Oa=new Te(ee.comparator),this.Na=new Map,this.La=new hi,this.Ba={},this.ka=new Map,this.qa=ii.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return!0===this.Qa}}async function Ys(e,t,n=!0){const r=wo(e);let i;const s=r.Fa.get(t);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await Zs(r,t,n,!0),i}async function Js(e,t){const n=wo(e);await Zs(n,t,!0,!1)}async function Zs(e,t,n,r){const i=await Ni(e.localStore,jt(t)),s=i.targetId,o=e.sharedClientState.addLocalQueryTarget(s,n);let a;return r&&(a=await eo(e,t,s,"current"===o,i.resumeToken)),e.isPrimaryClient&&n&&ns(e.remoteStore,i),a}async function eo(e,t,n,r,i){e.Ka=(t,n,r)=>async function(e,t,n,r){let i=t.view.ma(n);i.ns&&(i=await xi(e.localStore,t.query,!1).then(({documents:e})=>t.view.ma(e,i)));const s=r&&r.targetChanges.get(t.targetId),o=r&&null!=r.targetMismatches.get(t.targetId),a=t.view.applyChanges(i,e.isPrimaryClient,s,o);return po(e,t.targetId,a.wa),a.snapshot}(e,t,n,r);const s=await xi(e.localStore,t,!0),o=new zs(t,s.Ts),a=o.ma(s.documents),u=ar.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,i),c=o.applyChanges(a,e.isPrimaryClient,u);po(e,n,c.wa);const l=new Hs(t,n,o);return e.Fa.set(t,l),e.Ma.has(n)?e.Ma.get(n).push(t):e.Ma.set(n,[t]),c.snapshot}async function to(e,t,n){const r=D(e),i=r.Fa.get(t),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(e=>!Kt(e,t))),void r.Fa.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Di(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&rs(r.remoteStore,i.targetId),ho(r,i.targetId)}).catch(ue)):(ho(r,i.targetId),await Di(r.localStore,i.targetId,!0))}async function no(e,t){const n=D(e),r=n.Fa.get(t),i=n.Ma.get(r.targetId);n.isPrimaryClient&&1===i.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),rs(n.remoteStore,r.targetId))}async function ro(e,t,n){const r=bo(e);try{const e=await function(e,t){const n=D(e),r=H.now(),i=t.reduce((e,t)=>e.add(t.key),cn());let s,o;return n.persistence.runTransaction("Locally write mutations","readwrite",e=>{let a=Zt(),u=cn();return n.cs.getEntries(e,i).next(e=>{a=e,a.forEach((e,t)=>{t.isValidDocument()||(u=u.add(e))})}).next(()=>n.localDocuments.getOverlayedDocuments(e,a)).next(i=>{s=i;const o=[];for(const e of t){const t=Mn(e,s.get(e.key).overlayedDocument);null!=t&&o.push(new Vn(e.key,t,st(t.value.mapValue),On.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)}).next(t=>{o=t;const r=t.applyToLocalDocumentSet(s,u);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)})}).then(()=>({batchId:o.batchId,changes:nn(s)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.Ba[e.currentUser.toKey()];r||(r=new Te(G)),r=r.insert(t,n),e.Ba[e.currentUser.toKey()]=r}(r,e.batchId,n),await vo(r,e.changes),await ms(r.remoteStore)}catch(e){const t=Os(e,"Failed to persist write");n.reject(t)}}async function io(e,t){const n=D(e);try{const e=await ki(n.localStore,t);t.targetChanges.forEach((e,t)=>{const r=n.Na.get(t);r&&(N(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1),e.addedDocuments.size>0?r.va=!0:e.modifiedDocuments.size>0?N(r.va):e.removedDocuments.size>0&&(N(r.va),r.va=!1))}),await vo(n,e,t)}catch(e){await ue(e)}}function so(e,t,n){const r=D(e);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const e=[];r.Fa.forEach((n,r)=>{const i=r.view.Z_(t);i.snapshot&&e.push(i.snapshot)}),function(e,t){const n=D(e);n.onlineState=t;let r=!1;n.queries.forEach((e,n)=>{for(const i of n.j_)i.Z_(t)&&(r=!0)}),r&&Bs(n)}(r.eventManager,t),e.length&&r.Ca.d_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function oo(e,t,n){const r=D(e);r.sharedClientState.updateQueryState(t,"rejected",n);const i=r.Na.get(t),s=i&&i.key;if(s){let e=new Te(ee.comparator);e=e.insert(s,ot.newNoDocument(s,Q.min()));const n=cn().add(s),i=new or(Q.min(),new Map,new Te(G),e,n);await io(r,i),r.Oa=r.Oa.remove(s),r.Na.delete(t),mo(r)}else await Di(r.localStore,t,!1).then(()=>ho(r,t,n)).catch(ue)}async function ao(e,t){const n=D(e),r=t.batch.batchId;try{const e=await Ci(n.localStore,t);lo(n,r,null),co(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await vo(n,e)}catch(e){await ue(e)}}async function uo(e,t,n){const r=D(e);try{const e=await function(e,t){const n=D(e);return n.persistence.runTransaction("Reject batch","readwrite-primary",e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next(t=>(N(null!==t),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t))).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r)).next(()=>n.localDocuments.getDocuments(e,r))})}(r.localStore,t);lo(r,t,n),co(r,t),r.sharedClientState.updateMutationState(t,"rejected",n),await vo(r,e)}catch(n){await ue(n)}}function co(e,t){(e.ka.get(t)||[]).forEach(e=>{e.resolve()}),e.ka.delete(t)}function lo(e,t,n){const r=D(e);let i=r.Ba[r.currentUser.toKey()];if(i){const e=i.get(t);e&&(n?e.reject(n):e.resolve(),i=i.remove(t)),r.Ba[r.currentUser.toKey()]=i}}function ho(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.Ma.get(t))e.Fa.delete(r),n&&e.Ca.$a(r,n);e.Ma.delete(t),e.isPrimaryClient&&e.La.gr(t).forEach(t=>{e.La.containsKey(t)||fo(e,t)})}function fo(e,t){e.xa.delete(t.path.canonicalString());const n=e.Oa.get(t);null!==n&&(rs(e.remoteStore,n),e.Oa=e.Oa.remove(t),e.Na.delete(n),mo(e))}function po(e,t,n){for(const r of n)r instanceof Ws?(e.La.addReference(r.key,t),go(e,r)):r instanceof Gs?(C("SyncEngine","Document no longer in limbo: "+r.key),e.La.removeReference(r.key,t),e.La.containsKey(r.key)||fo(e,r.key)):O()}function go(e,t){const n=t.key,r=n.path.canonicalString();e.Oa.get(n)||e.xa.has(r)||(C("SyncEngine","New document in limbo: "+n),e.xa.add(r),mo(e))}function mo(e){for(;e.xa.size>0&&e.Oa.size<e.maxConcurrentLimboResolutions;){const t=e.xa.values().next().value;e.xa.delete(t);const n=new ee(Y.fromString(t)),r=e.qa.next();e.Na.set(r,new Qs(n)),e.Oa=e.Oa.insert(n,r),ns(e.remoteStore,new Yr(jt(Mt(n.path)),r,"TargetPurposeLimboResolution",fe.oe))}}async function vo(e,t,n){const r=D(e),i=[],s=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((e,a)=>{o.push(r.Ka(a,t,n).then(e=>{var t;if((e||n)&&r.isPrimaryClient){const i=e?!e.fromCache:null===(t=null==n?void 0:n.targetChanges.get(a.targetId))||void 0===t?void 0:t.current;r.sharedClientState.updateQueryState(a.targetId,i?"current":"not-current")}if(e){i.push(e);const t=wi.Wi(a.targetId,e);s.push(t)}}))}),await Promise.all(o),r.Ca.d_(i),await async function(e,t){const n=D(e);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",e=>ce.forEach(t,t=>ce.forEach(t.$i,r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r)).next(()=>ce.forEach(t.Ui,r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))}catch(e){if(!he(e))throw e;C("LocalStore","Failed to update sequence numbers: "+e)}for(const r of t){const e=r.targetId;if(!r.fromCache){const t=n.os.get(e),r=t.snapshotVersion,i=t.withLastLimboFreeSnapshotVersion(r);n.os=n.os.insert(e,i)}}}(r.localStore,s))}async function yo(e,t){const n=D(e);if(!n.currentUser.isEqual(t)){C("SyncEngine","User change. New user:",t.toKey());const e=await Si(n.localStore,t);n.currentUser=t,function(e,t){e.ka.forEach(e=>{e.forEach(e=>{e.reject(new P(x.CANCELLED,t))})}),e.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await vo(n,e.hs)}}function _o(e,t){const n=D(e),r=n.Na.get(t);if(r&&r.va)return cn().add(r.key);{let e=cn();const r=n.Ma.get(t);if(!r)return e;for(const t of r){const r=n.Fa.get(t);e=e.unionWith(r.view.Va)}return e}}function wo(e){const t=D(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=io.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=_o.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=oo.bind(null,t),t.Ca.d_=Vs.bind(null,t.eventManager),t.Ca.$a=js.bind(null,t.eventManager),t}function bo(e){const t=D(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=ao.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=uo.bind(null,t),t}class Eo{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Gi(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return Ii(this.persistence,new Ei,e.initialUser,this.serializer)}Ga(e){return new vi(_i.Zr,this.serializer)}Wa(e){return new Mi}async terminate(){var e,t;null===(e=this.gcScheduler)||void 0===e||e.stop(),null===(t=this.indexBackfillerScheduler)||void 0===t||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Eo.provider={build:()=>new Eo};class To{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>so(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=yo.bind(null,this.syncEngine),await Cs(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Ls}()}createDatastore(e){const t=Gi(e.databaseInfo.databaseId),n=function(e){return new Ki(e)}(e.databaseInfo);return function(e,t,n,r){return new Yi(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(e,t,n,r,i){return new Zi(e,t,n,r,i)}(this.localStore,this.datastore,e.asyncQueue,e=>so(this.syncEngine,e,0),function(){return Fi.D()?new Fi:new Ui}())}createSyncEngine(e,t){return function(e,t,n,r,i,s,o){const a=new Xs(e,t,n,r,i,s);return o&&(a.Qa=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(e){const t=D(e);C("RemoteStore","RemoteStore shutting down."),t.L_.add(5),await ts(t),t.k_.shutdown(),t.q_.set("Unknown")}(this.remoteStore),null===(e=this.datastore)||void 0===e||e.terminate(),null===(t=this.eventManager)||void 0===t||t.terminate()}}To.provider={build:()=>new To};
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
 * Copyright 2017 Google LLC
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
class Io{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):A("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}
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
 * Copyright 2017 Google LLC
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
class So{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new P(x.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(e,t){const n=D(e),r={documents:t.map(e=>Ar(n.serializer,e))},i=await n.Lo("BatchGetDocuments",n.serializer.databaseId,Y.emptyPath(),r,t.length),s=new Map;i.forEach(e=>{const t=Pr(n.serializer,e);s.set(t.key.toString(),t)});const o=[];return t.forEach(e=>{const t=s.get(e.toString());N(!!t),o.push(t)}),o}(this.datastore,e);return t.forEach(e=>this.recordVersion(e)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(e){this.lastTransactionError=e}this.writtenDocs.add(e.toString())}delete(e){this.write(new qn(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((e,t)=>{const n=ee.fromPath(t);this.mutations.push(new Kn(n,this.precondition(n)))}),await async function(e,t){const n=D(e),r={writes:t.map(e=>Mr(n.serializer,e))};await n.Mo("Commit",n.serializer.databaseId,Y.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw O();t=Q.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new P(x.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(Q.min())?On.exists(!1):On.updateTime(t):On.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(Q.min()))throw new P(x.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return On.updateTime(t)}return On.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}
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
 */class Co{constructor(e,t,n,r,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=i,this._u=n.maxAttempts,this.t_=new zi(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new So(this.datastore),t=this.cu(e);t&&t.then(t=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(t)}).catch(e=>{this.lu(e)}))}).catch(e=>{this.lu(e)})})}cu(e){try{const t=this.updateFunction(e);return!de(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(e){return this.deferred.reject(e),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if("FirebaseError"===e.name){const t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!Yn(t)}return!1}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class Ao{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=E.UNAUTHENTICATED,this.clientId=W.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async e=>{C("FirestoreClient","Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(C("FirestoreClient","Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new L;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Os(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function ko(e,t){e.asyncQueue.verifyOperationInProgress(),C("FirestoreClient","Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await Si(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function Ro(e,t){e.asyncQueue.verifyOperationInProgress();const n=await Oo(e);C("FirestoreClient","Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>Ss(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>Ss(t.remoteStore,n)),e._onlineComponents=t}async function Oo(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){C("FirestoreClient","Using user provided OfflineComponentProvider");try{await ko(e,e._uninitializedComponentsProvider._offline)}catch(t){const n=t;if(!function(e){return"FirebaseError"===e.name?e.code===x.FAILED_PRECONDITION||e.code===x.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&e instanceof DOMException)||22===e.code||20===e.code||11===e.code}(n))throw n;k("Error using user provided cache. Falling back to memory cache: "+n),await ko(e,new Eo)}}else C("FirestoreClient","Using default OfflineComponentProvider"),await ko(e,new Eo);return e._offlineComponents}async function No(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(C("FirestoreClient","Using user provided OnlineComponentProvider"),await Ro(e,e._uninitializedComponentsProvider._online)):(C("FirestoreClient","Using default OnlineComponentProvider"),await Ro(e,new To))),e._onlineComponents}function Do(e){return No(e).then(e=>e.syncEngine)}function xo(e){return No(e).then(e=>e.datastore)}async function Po(e){const t=await No(e),n=t.eventManager;return n.onListen=Ys.bind(null,t.syncEngine),n.onUnlisten=to.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=Js.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=no.bind(null,t.syncEngine),n}function Lo(e,t,n={}){const r=new L;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new Io({next:a=>{s.Za(),t.enqueueAndForget(()=>Fs(e,o));const u=a.docs.has(n);!u&&a.fromCache?i.reject(new P(x.UNAVAILABLE,"Failed to get document because the client is offline.")):u&&a.fromCache&&r&&"server"===r.source?i.reject(new P(x.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(a)},error:e=>i.reject(e)}),o=new Ks(Mt(n.path),s,{includeMetadataChanges:!0,_a:!0});return Us(e,o)}(await Po(e),e.asyncQueue,t,n,r)),r.promise}function Mo(e,t,n={}){const r=new L;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new Io({next:n=>{s.Za(),t.enqueueAndForget(()=>Fs(e,o)),n.fromCache&&"server"===r.source?i.reject(new P(x.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:e=>i.reject(e)}),o=new Ks(n,s,{includeMetadataChanges:!0,_a:!0});return Us(e,o)}(await Po(e),e.asyncQueue,t,n,r)),r.promise}
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
function Uo(e){const t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t
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
 */}const Fo=new Map;
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function Vo(e,t,n){if(!n)throw new P(x.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function jo(e,t,n,r){if(!0===t&&!0===r)throw new P(x.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function Bo(e){if(!ee.isDocumentKey(e))throw new P(x.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function $o(e){if(ee.isDocumentKey(e))throw new P(x.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function qo(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{const t=function(e){return e.constructor?e.constructor.name:null}(e);return t?`a custom ${t} object`:"an object"}}return"function"==typeof e?"a function":O()}function Ko(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new P(x.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=qo(e);throw new P(x.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}function Wo(e,t){if(t<=0)throw new P(x.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)}
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
 */class Go{constructor(e){var t,n;if(void 0===e.host){if(void 0!==e.ssl)throw new P(x.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=null===(t=e.ssl)||void 0===t||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new P(x.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}jo("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Uo(null!==(n=e.experimentalLongPollingOptions)&&void 0!==n?n:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new P(x.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new P(x.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new P(x.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}
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
 */(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(e,t){return e.timeoutSeconds===t.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class zo{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Go({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new P(x.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new P(x.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Go(e),void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new U;switch(e.type){case"firstParty":return new B(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new P(x.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=Fo.get(e);t&&(C("ComponentProvider","Removing Datastore"),Fo.delete(e),t.terminate())}(this),Promise.resolve()}}function Ho(e,t,n,r={}){var i;const s=(e=Ko(e,zo))._getSettings(),o=`${t}:${n}`;if("firestore.googleapis.com"!==s.host&&s.host!==o&&k("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),e._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=E.MOCK_USER;else{t=(0,u.Fy)(r.mockUserToken,null===(i=e._app)||void 0===i?void 0:i.options.projectId);const s=r.mockUserToken.sub||r.mockUserToken.user_id;if(!s)throw new P(x.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new E(s)}e._authCredentials=new F(new M(t,n))}}
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
 */class Qo{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Qo(this.firestore,e,this._query)}}class Xo{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Yo(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Xo(this.firestore,e,this._key)}}class Yo extends Qo{constructor(e,t,n){super(e,t,Mt(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Xo(this.firestore,null,new ee(e))}withConverter(e){return new Yo(this.firestore,e,this._path)}}function Jo(e,t,...n){if(e=(0,u.Ku)(e),Vo("collection","path",t),e instanceof zo){const r=Y.fromString(t,...n);return $o(r),new Yo(e,null,r)}{if(!(e instanceof Xo||e instanceof Yo))throw new P(x.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(Y.fromString(t,...n));return $o(r),new Yo(e.firestore,null,r)}}function Zo(e,t,...n){if(e=(0,u.Ku)(e),1===arguments.length&&(t=W.newId()),Vo("doc","path",t),e instanceof zo){const r=Y.fromString(t,...n);return Bo(r),new Xo(e,null,new ee(r))}{if(!(e instanceof Xo||e instanceof Yo))throw new P(x.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(Y.fromString(t,...n));return Bo(r),new Xo(e.firestore,e instanceof Yo?e.converter:null,new ee(r))}}
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
class ea{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new zi(this,"async_queue_retry"),this.Vu=()=>{const e=Wi();e&&C("AsyncQueue","Visibility state changed to "+e.visibilityState),this.t_.jo()},this.mu=e;const t=Wi();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Wi();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new L;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(0!==this.Pu.length){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!he(e))throw e;C("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(e=>{this.Eu=e,this.du=!1;const t=function(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */(e);throw A("INTERNAL UNHANDLED ERROR: ",t),e}).then(e=>(this.du=!1,e))));return this.mu=t,t}enqueueAfterDelay(e,t,n){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const r=Rs.createAndSchedule(this,e,t,n,e=>this.yu(e));return this.Tu.push(r),r}fu(){this.Eu&&O()}verifyOperationInProgress(){}async wu(){let e;do{e=this.mu,await e}while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((e,t)=>e.targetTimeMs-t.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}function ta(e){return function(e,t){if("object"!=typeof e||null===e)return!1;const n=e;for(const r of t)if(r in n&&"function"==typeof n[r])return!0;return!1}
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
 */(e,["next","error","complete"])}class na extends zo{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new ea,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ea(e),this._firestoreClient=void 0,await e}}}function ra(e,t){const n="object"==typeof e?e:(0,s.Sx)(),r="string"==typeof e?e:t||"(default)",i=(0,s.j6)(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const e=(0,u.yU)("firestore");e&&Ho(i,...e)}return i}function ia(e){if(e._terminated)throw new P(x.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||sa(e),e._firestoreClient}function sa(e){var t,n,r;const i=e._freezeSettings(),s=function(e,t,n,r){return new Fe(e,t,n,r.host,r.ssl,r.experimentalForceLongPolling,r.experimentalAutoDetectLongPolling,Uo(r.experimentalLongPollingOptions),r.useFetchStreams)}(e._databaseId,(null===(t=e._app)||void 0===t?void 0:t.options.appId)||"",e._persistenceKey,i);e._componentsProvider||(null===(n=i.localCache)||void 0===n?void 0:n._offlineComponentProvider)&&(null===(r=i.localCache)||void 0===r?void 0:r._onlineComponentProvider)&&(e._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),e._firestoreClient=new Ao(e._authCredentials,e._appCheckCredentials,e._queue,s,e._componentsProvider&&function(e){const t=null==e?void 0:e._online.build();return{_offline:null==e?void 0:e._offline.build(t),_online:t}}(e._componentsProvider))}
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
class oa{constructor(e){this._byteString=e}static fromBase64String(e){try{return new oa(Oe.fromBase64String(e))}catch(e){throw new P(x.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new oa(Oe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}
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
 */class aa{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new P(x.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Z(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}
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
class ua{constructor(e){this._methodName=e}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */class ca{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new P(x.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new P(x.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return G(this._lat,e._lat)||G(this._long,e._long)}}
/**
 * @license
 * Copyright 2024 Google LLC
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
 */class la{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */const ha=/^__.*__$/;class fa{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new Vn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Fn(e,this.data,t,this.fieldTransforms)}}class da{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Vn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function pa(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw O()}}class ga{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new ga(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.Fu({path:n,xu:!1});return r.Ou(e),r}Nu(e){var t;const n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.Fu({path:n,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Na(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(0===e.length)throw this.Bu("Document fields must not be empty");if(pa(this.Cu)&&ha.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class ma{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Gi(e)}Qu(e,t,n,r=!1){return new ga({Cu:e,methodName:t,qu:n,path:Z.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function va(e){const t=e._freezeSettings(),n=Gi(e._databaseId);return new ma(e._databaseId,!!t.ignoreUndefinedProperties,n)}function ya(e,t,n,r,i,s={}){const o=e.Qu(s.merge||s.mergeFields?2:0,t,n,i);Aa("Data must be an object, but it was:",o,r);const a=Sa(r,o);let u,c;if(s.merge)u=new ke(o.fieldMask),c=o.fieldTransforms;else if(s.mergeFields){const e=[];for(const r of s.mergeFields){const i=ka(t,r,n);if(!o.contains(i))throw new P(x.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);Da(e,i)||e.push(i)}u=new ke(e),c=o.fieldTransforms.filter(e=>u.covers(e.field))}else u=null,c=o.fieldTransforms;return new fa(new it(a),u,c)}class _a extends ua{_toFieldTransform(e){if(2!==e.Cu)throw 1===e.Cu?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof _a}}class wa extends ua{_toFieldTransform(e){return new An(e.path,new _n)}isEqual(e){return e instanceof wa}}function ba(e,t,n,r){const i=e.Qu(1,t,n);Aa("Data must be an object, but it was:",i,r);const s=[],o=it.empty();be(r,(e,r)=>{const a=Oa(t,e,n);r=(0,u.Ku)(r);const c=i.Nu(a);if(r instanceof _a)s.push(a);else{const e=Ia(r,c);null!=e&&(s.push(a),o.set(a,e))}});const a=new ke(s);return new da(o,a,i.fieldTransforms)}function Ea(e,t,n,r,i,s){const o=e.Qu(1,t,n),a=[ka(t,r,n)],c=[i];if(s.length%2!=0)throw new P(x.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let u=0;u<s.length;u+=2)a.push(ka(t,s[u])),c.push(s[u+1]);const l=[],h=it.empty();for(let d=a.length-1;d>=0;--d)if(!Da(l,a[d])){const e=a[d];let t=c[d];t=(0,u.Ku)(t);const n=o.Nu(e);if(t instanceof _a)l.push(e);else{const r=Ia(t,n);null!=r&&(l.push(e),h.set(e,r))}}const f=new ke(l);return new da(h,f,o.fieldTransforms)}function Ta(e,t,n,r=!1){return Ia(n,e.Qu(r?4:3,t))}function Ia(e,t){if(Ca(e=(0,u.Ku)(e)))return Aa("Unsupported field value:",t,e),Sa(e,t);if(e instanceof ua)return function(e,t){if(!pa(t.Cu))throw t.Bu(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Bu(`${e._methodName}() is not currently supported inside arrays`);const n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.xu&&4!==t.Cu)throw t.Bu("Nested arrays are not supported");return function(e,t){const n=[];let r=0;for(const i of e){let e=Ia(i,t.Lu(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=(0,u.Ku)(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return pn(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){const n=H.fromDate(e);return{timestampValue:wr(t.serializer,n)}}if(e instanceof H){const n=new H(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:wr(t.serializer,n)}}if(e instanceof ca)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof oa)return{bytesValue:br(t.serializer,e._byteString)};if(e instanceof Xo){const n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.Bu(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:Ir(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof la)return function(e,t){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:e.toArray().map(e=>{if("number"!=typeof e)throw t.Bu("VectorValues must only contain numeric values.");return fn(t.serializer,e)})}}}}}}(e,t);throw t.Bu(`Unsupported field value: ${qo(e)}`)}(e,t)}function Sa(e,t){const n={};return Ee(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):be(e,(e,r)=>{const i=Ia(r,t.Mu(e));null!=i&&(n[e]=i)}),{mapValue:{fields:n}}}function Ca(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof H||e instanceof ca||e instanceof oa||e instanceof Xo||e instanceof ua||e instanceof la)}function Aa(e,t,n){if(!Ca(n)||!function(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}(n)){const r=qo(n);throw"an object"===r?t.Bu(e+" a custom object"):t.Bu(e+" "+r)}}function ka(e,t,n){if((t=(0,u.Ku)(t))instanceof aa)return t._internalPath;if("string"==typeof t)return Oa(e,t);throw Na("Field path arguments must be of type string or ",e,!1,void 0,n)}const Ra=new RegExp("[~\\*/\\[\\]]");function Oa(e,t,n){if(t.search(Ra)>=0)throw Na(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new aa(...t.split("."))._internalPath}catch(r){throw Na(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function Na(e,t,n,r,i){const s=r&&!r.isEmpty(),o=void 0!==i;let a=`Function ${t}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new P(x.INVALID_ARGUMENT,a+e+u)}function Da(e,t){return e.some(e=>e.isEqual(t))}
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
 */class xa{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Xo(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const e=new Pa(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(La("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class Pa extends xa{data(){return super.data()}}function La(e,t){return"string"==typeof t?Oa(e,t):t instanceof aa?t._internalPath:t._delegate._internalPath}
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
 */function Ma(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new P(x.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ua{}class Fa extends Ua{}function Va(e,t,...n){let r=[];t instanceof Ua&&r.push(t),r=r.concat(n),function(e){const t=e.filter(e=>e instanceof $a).length,n=e.filter(e=>e instanceof ja).length;if(t>1||t>0&&n>0)throw new P(x.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}
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
 */(r);for(const i of r)e=i._apply(e);return e}class ja extends Fa{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new ja(e,t,n)}_apply(e){const t=this._parse(e);return Qa(e._query,t),new Qo(e.firestore,e.converter,$t(e._query,t))}_parse(e){const t=va(e.firestore),n=function(e,t,n,r,i,s,o){let a;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new P(x.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){Ha(o,s);const t=[];for(const n of o)t.push(za(r,e,n));a={arrayValue:{values:t}}}else a=za(r,e,o)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||Ha(o,s),a=Ta(n,t,o,"in"===s||"not-in"===s);return dt.create(i,s,a)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value);return n}}function Ba(e,t,n){const r=t,i=La("where",e);return ja._create(i,r,n)}class $a extends Ua{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new $a(e,t)}_parse(e){const t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:pt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;const r=t.getFlattenedFilters();for(const i of r)Qa(n,i),n=$t(n,i)}(e._query,t),new Qo(e.firestore,e.converter,$t(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class qa extends Fa{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new qa(e,t)}_apply(e){const t=function(e,t,n){if(null!==e.startAt)throw new P(x.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new P(x.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new lt(t,n)}(e._query,this._field,this._direction);return new Qo(e.firestore,e.converter,function(e,t){const n=e.explicitOrderBy.concat([t]);return new Pt(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function Ka(e,t="asc"){const n=t,r=La("orderBy",e);return qa._create(r,n)}class Wa extends Fa{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Wa(e,t,n)}_apply(e){return new Qo(e.firestore,e.converter,qt(e._query,this._limit,this._limitType))}}function Ga(e){return Wo("limit",e),Wa._create("limit",e,"F")}function za(e,t,n){if("string"==typeof(n=(0,u.Ku)(n))){if(""===n)throw new P(x.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ft(t)&&-1!==n.indexOf("/"))throw new P(x.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=t.path.child(Y.fromString(n));if(!ee.isDocumentKey(r))throw new P(x.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Qe(e,new ee(r))}if(n instanceof Xo)return Qe(e,n._key);throw new P(x.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${qo(n)}.`)}function Ha(e,t){if(!Array.isArray(e)||0===e.length)throw new P(x.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Qa(e,t){const n=function(e,t){for(const n of e)for(const e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new P(x.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new P(x.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}class Xa{convertValue(e,t="none"){switch(Be(e)){case 0:return null;case 1:return e.booleanValue;case 2:return xe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Pe(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw O()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return be(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){var t,n,r;const i=null===(r=null===(n=null===(t=e.fields)||void 0===t?void 0:t.value.arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.map(e=>xe(e.doubleValue));return new la(i)}convertGeoPoint(e){return new ca(xe(e.latitude),xe(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Me(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Ue(e));default:return null}}convertTimestamp(e){const t=De(e);return new H(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Y.fromString(e);N(Xr(n));const r=new Ve(n.get(1),n.get(3)),i=new ee(n.popFirst(5));return r.isEqual(t)||A(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}
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
 */function Ya(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}class Ja extends Xa{constructor(e){super(),this.firestore=e}convertBytes(e){return new oa(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Xo(this.firestore,null,t)}}
/**
 * @license
 * Copyright 2022 Google LLC
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
class Za{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class eu extends xa{constructor(e,t,n,r,i,s){super(e,t,n,r,s),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new tu(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(La("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}}class tu extends eu{data(e={}){return super.data(e)}}class nu{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Za(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new tu(this._firestore,this._userDataWriter,n.key,n,new Za(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new P(x.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(n=>{const r=new tu(e._firestore,e._userDataWriter,n.doc.key,n.doc,new Za(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}})}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{const r=new tu(e._firestore,e._userDataWriter,t.doc.key,t.doc,new Za(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter);let i=-1,s=-1;return 0!==t.type&&(i=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(n=n.add(t.doc),s=n.indexOf(t.doc.key)),{type:ru(t.type),doc:r,oldIndex:i,newIndex:s}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function ru(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return O()}}
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
function iu(e){e=Ko(e,Xo);const t=Ko(e.firestore,na);return Lo(ia(t),e._key).then(n=>fu(t,e,n))}class su extends Xa{constructor(e){super(),this.firestore=e}convertBytes(e){return new oa(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Xo(this.firestore,null,t)}}function ou(e){e=Ko(e,Qo);const t=Ko(e.firestore,na),n=ia(t),r=new su(t);return Ma(e._query),Mo(n,e._query).then(n=>new nu(t,r,e,n))}function au(e,t,n){e=Ko(e,Xo);const r=Ko(e.firestore,na),i=Ya(e.converter,t,n);return hu(r,[ya(va(r),"setDoc",e._key,i,null!==e.converter,n).toMutation(e._key,On.none())])}function uu(e,t,n,...r){e=Ko(e,Xo);const i=Ko(e.firestore,na),s=va(i);let o;return o="string"==typeof(t=(0,u.Ku)(t))||t instanceof aa?Ea(s,"updateDoc",e._key,t,n,r):ba(s,"updateDoc",e._key,t),hu(i,[o.toMutation(e._key,On.exists(!0))])}function cu(e){return hu(Ko(e.firestore,na),[new qn(e._key,On.none())])}function lu(e,...t){var n,r,i;e=(0,u.Ku)(e);let s={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof t[o]||ta(t[o])||(s=t[o],o++);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(ta(t[o])){const e=t[o];t[o]=null===(n=e.next)||void 0===n?void 0:n.bind(e),t[o+1]=null===(r=e.error)||void 0===r?void 0:r.bind(e),t[o+2]=null===(i=e.complete)||void 0===i?void 0:i.bind(e)}let c,l,h;if(e instanceof Xo)l=Ko(e.firestore,na),h=Mt(e._key.path),c={next:n=>{t[o]&&t[o](fu(l,e,n))},error:t[o+1],complete:t[o+2]};else{const n=Ko(e,Qo);l=Ko(n.firestore,na),h=n._query;const r=new su(l);c={next:e=>{t[o]&&t[o](new nu(l,r,n,e))},error:t[o+1],complete:t[o+2]},Ma(e._query)}return function(e,t,n,r){const i=new Io(r),s=new Ks(t,i,n);return e.asyncQueue.enqueueAndForget(async()=>Us(await Po(e),s)),()=>{i.Za(),e.asyncQueue.enqueueAndForget(async()=>Fs(await Po(e),s))}}(ia(l),h,a,c)}function hu(e,t){return function(e,t){const n=new L;return e.asyncQueue.enqueueAndForget(async()=>ro(await Do(e),t,n)),n.promise}(ia(e),t)}function fu(e,t,n){const r=n.docs.get(t._key),i=new su(e);return new eu(e,i,t._key,r,new Za(n.hasPendingWrites,n.fromCache),t.converter)}
/**
 * @license
 * Copyright 2022 Google LLC
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
 * Copyright 2022 Google LLC
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
const du={maxAttempts:5};
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
 */class pu{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=va(e)}set(e,t,n){this._verifyNotCommitted();const r=gu(e,this._firestore),i=Ya(r.converter,t,n),s=ya(this._dataReader,"WriteBatch.set",r._key,i,null!==r.converter,n);return this._mutations.push(s.toMutation(r._key,On.none())),this}update(e,t,n,...r){this._verifyNotCommitted();const i=gu(e,this._firestore);let s;return s="string"==typeof(t=(0,u.Ku)(t))||t instanceof aa?Ea(this._dataReader,"WriteBatch.update",i._key,t,n,r):ba(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(s.toMutation(i._key,On.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=gu(e,this._firestore);return this._mutations=this._mutations.concat(new qn(t._key,On.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new P(x.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function gu(e,t){if((e=(0,u.Ku)(e)).firestore!==t)throw new P(x.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}
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
 */class mu extends class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=va(e)}get(e){const t=gu(e,this._firestore),n=new Ja(this._firestore);return this._transaction.lookup([t._key]).then(e=>{if(!e||1!==e.length)return O();const r=e[0];if(r.isFoundDocument())return new xa(this._firestore,n,r.key,r,t.converter);if(r.isNoDocument())return new xa(this._firestore,n,t._key,null,t.converter);throw O()})}set(e,t,n){const r=gu(e,this._firestore),i=Ya(r.converter,t,n),s=ya(this._dataReader,"Transaction.set",r._key,i,null!==r.converter,n);return this._transaction.set(r._key,s),this}update(e,t,n,...r){const i=gu(e,this._firestore);let s;return s="string"==typeof(t=(0,u.Ku)(t))||t instanceof aa?Ea(this._dataReader,"Transaction.update",i._key,t,n,r):ba(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,s),this}delete(e){const t=gu(e,this._firestore);return this._transaction.delete(t._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=gu(e,this._firestore),n=new su(this._firestore);return super.get(e).then(e=>new eu(this._firestore,n,t._key,e._document,new Za(!1,!1),t.converter))}}function vu(e,t,n){e=Ko(e,na);const r=Object.assign(Object.assign({},du),n);return function(e){if(e.maxAttempts<1)throw new P(x.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r),function(e,t,n){const r=new L;return e.asyncQueue.enqueueAndForget(async()=>{const i=await xo(e);new Co(e.asyncQueue,i,n,t,r).au()}),r.promise}(ia(e),n=>t(new mu(e,n)),r)}
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
 */function yu(){return new wa("serverTimestamp")}
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
function _u(e){return ia(e=Ko(e,na)),new pu(e,t=>hu(e,t))
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
 */}new WeakMap;
/**
 * @license
 * Copyright 2017 Google LLC
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
 */!function(e,t=!0){!function(e){T=e}(s.MF),(0,s.om)(new o.uA("firestore",(e,{instanceIdentifier:n,options:r})=>{const i=e.getProvider("app").getImmediate(),s=new na(new V(e.getProvider("auth-internal")),new q(e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new P(x.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ve(e.options.projectId,t)}(i,n),i);return r=Object.assign({useFetchStreams:t},r),s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),(0,s.KO)(b,"4.7.3",e),(0,s.KO)(b,"4.7.3","esm2017")}()},904:function(e,t,n){"use strict";n.d(t,{c7:function(){return G}});var r=n(928),i=n(743),s=n(125);
/**
 * @license
 * Copyright 2017 Google LLC
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
const o="firebasestorage.googleapis.com",a="storageBucket",u=12e4,c=6e5;
/**
 * @license
 * Copyright 2017 Google LLC
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
class l extends i.g{constructor(e,t,n=0){super(d(e),`Firebase Storage: ${t} (${d(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,l.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return d(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}\n${this.customData.serverResponse}`:this.message=this._baseMessage}}var h,f;function d(e){return"storage/"+e}function p(){const e="An unknown error occurred, please check the error payload for server response.";return new l(h.UNKNOWN,e)}function g(){return new l(h.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function m(){return new l(h.CANCELED,"User canceled the upload/download.")}function v(e){return new l(h.INVALID_URL,"Invalid URL '"+e+"'.")}function y(e){return new l(h.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}function _(e){return new l(h.INVALID_ARGUMENT,e)}function w(){return new l(h.APP_DELETED,"The Firebase app was deleted.")}function b(e){return new l(h.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}(function(e){e["UNKNOWN"]="unknown",e["OBJECT_NOT_FOUND"]="object-not-found",e["BUCKET_NOT_FOUND"]="bucket-not-found",e["PROJECT_NOT_FOUND"]="project-not-found",e["QUOTA_EXCEEDED"]="quota-exceeded",e["UNAUTHENTICATED"]="unauthenticated",e["UNAUTHORIZED"]="unauthorized",e["UNAUTHORIZED_APP"]="unauthorized-app",e["RETRY_LIMIT_EXCEEDED"]="retry-limit-exceeded",e["INVALID_CHECKSUM"]="invalid-checksum",e["CANCELED"]="canceled",e["INVALID_EVENT_NAME"]="invalid-event-name",e["INVALID_URL"]="invalid-url",e["INVALID_DEFAULT_BUCKET"]="invalid-default-bucket",e["NO_DEFAULT_BUCKET"]="no-default-bucket",e["CANNOT_SLICE_BLOB"]="cannot-slice-blob",e["SERVER_FILE_WRONG_SIZE"]="server-file-wrong-size",e["NO_DOWNLOAD_URL"]="no-download-url",e["INVALID_ARGUMENT"]="invalid-argument",e["INVALID_ARGUMENT_COUNT"]="invalid-argument-count",e["APP_DELETED"]="app-deleted",e["INVALID_ROOT_OPERATION"]="invalid-root-operation",e["INVALID_FORMAT"]="invalid-format",e["INTERNAL_ERROR"]="internal-error",e["UNSUPPORTED_ENVIRONMENT"]="unsupported-environment"})(h||(h={}));
/**
 * @license
 * Copyright 2017 Google LLC
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
class E{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return 0===this.path.length}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=E.makeFromUrl(e,t)}catch(r){return new E(e,"")}if(""===n.path)return n;throw y(e)}static makeFromUrl(e,t){let n=null;const r="([A-Za-z0-9.\\-_]+)";function i(e){"/"===e.path.charAt(e.path.length-1)&&(e.path_=e.path_.slice(0,-1))}const s="(/(.*))?$",a=new RegExp("^gs://"+r+s,"i"),u={bucket:1,path:3};function c(e){e.path_=decodeURIComponent(e.path)}const l="v[A-Za-z0-9_]+",h=t.replace(/[.]/g,"\\."),f="(/([^?#]*).*)?$",d=new RegExp(`^https?://${h}/${l}/b/${r}/o${f}`,"i"),p={bucket:1,path:3},g=t===o?"(?:storage.googleapis.com|storage.cloud.google.com)":t,m="([^?#]*)",y=new RegExp(`^https?://${g}/${r}/${m}`,"i"),_={bucket:1,path:2},w=[{regex:a,indices:u,postModify:i},{regex:d,indices:p,postModify:c},{regex:y,indices:_,postModify:c}];for(let o=0;o<w.length;o++){const t=w[o],r=t.regex.exec(e);if(r){const e=r[t.indices.bucket];let i=r[t.indices.path];i||(i=""),n=new E(e,i),t.postModify(n);break}}if(null==n)throw v(e);return n}}class T{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function I(e,t,n){let r=1,i=null,s=null,o=!1,a=0;function u(){return 2===a}let c=!1;function l(...e){c||(c=!0,t.apply(null,e))}function h(t){i=setTimeout(()=>{i=null,e(d,u())},t)}function f(){s&&clearTimeout(s)}function d(e,...t){if(c)return void f();if(e)return f(),void l.call(null,e,...t);const n=u()||o;if(n)return f(),void l.call(null,e,...t);let i;r<64&&(r*=2),1===a?(a=2,i=0):i=1e3*(r+Math.random()),h(i)}let p=!1;function g(e){p||(p=!0,f(),c||(null!==i?(e||(a=2),clearTimeout(i),h(0)):e||(a=1)))}return h(0),s=setTimeout(()=>{o=!0,g(!0)},n),g}function S(e){e(!1)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function C(e){return void 0!==e}function A(e,t,n,r){if(r<t)throw _(`Invalid value for '${e}'. Expected ${t} or greater.`);if(r>n)throw _(`Invalid value for '${e}'. Expected ${n} or less.`)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function k(e){const t=encodeURIComponent;let n="?";for(const r in e)if(e.hasOwnProperty(r)){const i=t(r)+"="+t(e[r]);n=n+i+"&"}return n=n.slice(0,-1),n}
/**
 * @license
 * Copyright 2022 Google LLC
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
function R(e,t){const n=e>=500&&e<600,r=[408,429],i=-1!==r.indexOf(e),s=-1!==t.indexOf(e);return n||i||s}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */(function(e){e[e["NO_ERROR"]=0]="NO_ERROR",e[e["NETWORK_ERROR"]=1]="NETWORK_ERROR",e[e["ABORT"]=2]="ABORT"})(f||(f={}));class O{constructor(e,t,n,r,i,s,o,a,u,c,l,h=!0){this.url_=e,this.method_=t,this.headers_=n,this.body_=r,this.successCodes_=i,this.additionalRetryCodes_=s,this.callback_=o,this.errorCallback_=a,this.timeout_=u,this.progressCallback_=c,this.connectionFactory_=l,this.retry=h,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((e,t)=>{this.resolve_=e,this.reject_=t,this.start_()})}start_(){const e=(e,t)=>{if(t)return void e(!1,new N(!1,null,!0));const n=this.connectionFactory_();this.pendingConnection_=n;const r=e=>{const t=e.loaded,n=e.lengthComputable?e.total:-1;null!==this.progressCallback_&&this.progressCallback_(t,n)};null!==this.progressCallback_&&n.addUploadProgressListener(r),n.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{null!==this.progressCallback_&&n.removeUploadProgressListener(r),this.pendingConnection_=null;const t=n.getErrorCode()===f.NO_ERROR,i=n.getStatus();if(!t||R(i,this.additionalRetryCodes_)&&this.retry){const t=n.getErrorCode()===f.ABORT;return void e(!1,new N(!1,null,t))}const s=-1!==this.successCodes_.indexOf(i);e(!0,new N(s,n))})},t=(e,t)=>{const n=this.resolve_,r=this.reject_,i=t.connection;if(t.wasSuccessCode)try{const e=this.callback_(i,i.getResponse());C(e)?n(e):n()}catch(s){r(s)}else if(null!==i){const e=p();e.serverResponse=i.getErrorText(),this.errorCallback_?r(this.errorCallback_(i,e)):r(e)}else if(t.canceled){const e=this.appDelete_?w():m();r(e)}else{const e=g();r(e)}};this.canceled_?t(!1,new N(!1,null,!0)):this.backoffId_=I(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,null!==this.backoffId_&&S(this.backoffId_),null!==this.pendingConnection_&&this.pendingConnection_.abort()}}class N{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function D(e,t){null!==t&&t.length>0&&(e["Authorization"]="Firebase "+t)}function x(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(null!==t&&void 0!==t?t:"AppManager")}function P(e,t){t&&(e["X-Firebase-GMPID"]=t)}function L(e,t){null!==t&&(e["X-Firebase-AppCheck"]=t)}function M(e,t,n,r,i,s,o=!0){const a=k(e.urlParams),u=e.url+a,c=Object.assign({},e.headers);return P(c,t),D(c,n),x(c,s),L(c,r),new O(u,e.method,c,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,i,o)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 * Copyright 2017 Google LLC
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
function U(e){if(0===e.length)return null;const t=e.lastIndexOf("/");if(-1===t)return"";const n=e.slice(0,t);return n}function F(e){const t=e.lastIndexOf("/",e.length-2);return-1===t?e:e.slice(t+1)}
/**
 * @license
 * Copyright 2017 Google LLC
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
class V{constructor(e,t){this._service=e,this._location=t instanceof E?t:E.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new V(e,t)}get root(){const e=new E(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return F(this._location.path)}get storage(){return this._service}get parent(){const e=U(this._location.path);if(null===e)return null;const t=new E(this._location.bucket,e);return new V(this._service,t)}_throwIfRoot(e){if(""===this._location.path)throw b(e)}}function j(e,t){const n=null===t||void 0===t?void 0:t[a];return null==n?null:E.makeFromBucketSpec(n,e)}function B(e,t,n,r={}){e.host=`${t}:${n}`,e._protocol="http";const{mockUserToken:s}=r;s&&(e._overrideAuthToken="string"===typeof s?s:(0,i.Fy)(s,e.app.options.projectId))}class ${constructor(e,t,n,r,i){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=r,this._firebaseVersion=i,this._bucket=null,this._host=o,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=u,this._maxUploadRetryTime=c,this._requests=new Set,this._bucket=null!=r?E.makeFromBucketSpec(r,this._host):j(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,null!=this._url?this._bucket=E.makeFromBucketSpec(this._url,e):this._bucket=j(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){A("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){A("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(null!==t)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();return t.token}return null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new V(this,e)}_makeRequest(e,t,n,r,i=!0){if(this._deleted)return new T(w());{const s=M(e,this._appId,n,r,t,this._firebaseVersion,i);return this._requests.add(s),s.getPromise().then(()=>this._requests.delete(s),()=>this._requests.delete(s)),s}}async makeRequestWithTokens(e,t){const[n,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,r).getPromise()}}const q="@firebase/storage",K="0.13.2",W="storage";function G(e=(0,r.Sx)(),t){e=(0,i.Ku)(e);const n=(0,r.j6)(e,W),s=n.getImmediate({identifier:t}),o=(0,i.yU)("storage");return o&&z(s,...o),s}function z(e,t,n,r={}){B(e,t,n,r)}
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
 */function H(e,{instanceIdentifier:t}){const n=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return new $(n,i,s,t,r.MF)}function Q(){(0,r.om)(new s.uA(W,H,"PUBLIC").setMultipleInstances(!0)),(0,r.KO)(q,K,""),(0,r.KO)(q,K,"esm2017")}Q()},928:function(e,t,n){"use strict";n.d(t,{MF:function(){return _e},j6:function(){return pe},xZ:function(){return ge},om:function(){return de},Sx:function(){return be},Wp:function(){return we},KO:function(){return Ee}});var r=n(125),i=n(424),s=n(743);const o=(e,t)=>t.some(t=>e instanceof t);let a,u;function c(){return a||(a=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function l(){return u||(u=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const h=new WeakMap,f=new WeakMap,d=new WeakMap,p=new WeakMap,g=new WeakMap;function m(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(E(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&h.set(t,e)}).catch(()=>{}),g.set(t,e),t}function v(e){if(f.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});f.set(e,t)}let y={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return f.get(e);if("objectStoreNames"===t)return e.objectStoreNames||d.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return E(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e}};function _(e){y=e(y)}function w(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?l().includes(e)?function(...t){return e.apply(T(this),t),E(h.get(this))}:function(...t){return E(e.apply(T(this),t))}:function(t,...n){const r=e.call(T(this),t,...n);return d.set(r,t.sort?t.sort():[t]),E(r)}}function b(e){return"function"===typeof e?w(e):(e instanceof IDBTransaction&&v(e),o(e,c())?new Proxy(e,y):e)}function E(e){if(e instanceof IDBRequest)return m(e);if(p.has(e))return p.get(e);const t=b(e);return t!==e&&(p.set(e,t),g.set(t,e)),t}const T=e=>g.get(e);function I(e,t,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(e,t),a=E(o);return r&&o.addEventListener("upgradeneeded",e=>{r(E(o.result),e.oldVersion,e.newVersion,E(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{s&&e.addEventListener("close",()=>s()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}const S=["get","getKey","getAll","getAllKeys","count"],C=["put","add","delete","clear"],A=new Map;function k(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!==typeof t)return;if(A.get(t))return A.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=C.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!S.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,i?"readwrite":"readonly");let o=s.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&s.done]))[0]};return A.set(t,s),s}_(e=>({...e,get:(t,n,r)=>k(t,n)||e.get(t,n,r),has:(t,n)=>!!k(t,n)||e.has(t,n)}));
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
class R{constructor(e){this.container=e}getPlatformInfoString(){const e=this.container.getProviders();return e.map(e=>{if(O(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}function O(e){const t=e.getComponent();return"VERSION"===(null===t||void 0===t?void 0:t.type)}const N="@firebase/app",D="0.10.13",x=new i.Vy("@firebase/app"),P="@firebase/app-compat",L="@firebase/analytics-compat",M="@firebase/analytics",U="@firebase/app-check-compat",F="@firebase/app-check",V="@firebase/auth",j="@firebase/auth-compat",B="@firebase/database",$="@firebase/data-connect",q="@firebase/database-compat",K="@firebase/functions",W="@firebase/functions-compat",G="@firebase/installations",z="@firebase/installations-compat",H="@firebase/messaging",Q="@firebase/messaging-compat",X="@firebase/performance",Y="@firebase/performance-compat",J="@firebase/remote-config",Z="@firebase/remote-config-compat",ee="@firebase/storage",te="@firebase/storage-compat",ne="@firebase/firestore",re="@firebase/vertexai-preview",ie="@firebase/firestore-compat",se="firebase",oe="10.14.1",ae="[DEFAULT]",ue={[N]:"fire-core",[P]:"fire-core-compat",[M]:"fire-analytics",[L]:"fire-analytics-compat",[F]:"fire-app-check",[U]:"fire-app-check-compat",[V]:"fire-auth",[j]:"fire-auth-compat",[B]:"fire-rtdb",[$]:"fire-data-connect",[q]:"fire-rtdb-compat",[K]:"fire-fn",[W]:"fire-fn-compat",[G]:"fire-iid",[z]:"fire-iid-compat",[H]:"fire-fcm",[Q]:"fire-fcm-compat",[X]:"fire-perf",[Y]:"fire-perf-compat",[J]:"fire-rc",[Z]:"fire-rc-compat",[ee]:"fire-gcs",[te]:"fire-gcs-compat",[ne]:"fire-fst",[ie]:"fire-fst-compat",[re]:"fire-vertex","fire-js":"fire-js",[se]:"fire-js-all"},ce=new Map,le=new Map,he=new Map;function fe(e,t){try{e.container.addComponent(t)}catch(n){x.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function de(e){const t=e.name;if(he.has(t))return x.debug(`There were multiple attempts to register component ${t}.`),!1;he.set(t,e);for(const n of ce.values())fe(n,e);for(const n of le.values())fe(n,e);return!0}function pe(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function ge(e){return void 0!==e.settings}
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
const me={["no-app"]:"No Firebase App '{$appName}' has been created - call initializeApp() first",["bad-app-name"]:"Illegal App name: '{$appName}'",["duplicate-app"]:"Firebase App named '{$appName}' already exists with different options or config",["app-deleted"]:"Firebase App named '{$appName}' already deleted",["server-app-deleted"]:"Firebase Server App has been deleted",["no-options"]:"Need to provide options, when not being deployed to hosting via source.",["invalid-app-argument"]:"firebase.{$appName}() takes either no argument or a Firebase App instance.",["invalid-log-argument"]:"First argument to `onLog` must be null or a function.",["idb-open"]:"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",["idb-get"]:"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",["idb-set"]:"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",["idb-delete"]:"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",["finalization-registry-not-supported"]:"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",["invalid-server-app-environment"]:"FirebaseServerApp is not for use in browser environments."},ve=new s.FA("app","Firebase",me);
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
class ye{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new r.uA("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ve.create("app-deleted",{appName:this._name})}}
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
const _e=oe;function we(e,t={}){let n=e;if("object"!==typeof t){const e=t;t={name:e}}const i=Object.assign({name:ae,automaticDataCollectionEnabled:!1},t),o=i.name;if("string"!==typeof o||!o)throw ve.create("bad-app-name",{appName:String(o)});if(n||(n=(0,s.T9)()),!n)throw ve.create("no-options");const a=ce.get(o);if(a){if((0,s.bD)(n,a.options)&&(0,s.bD)(i,a.config))return a;throw ve.create("duplicate-app",{appName:o})}const u=new r.h1(o);for(const r of he.values())u.addComponent(r);const c=new ye(n,i,u);return ce.set(o,c),c}function be(e=ae){const t=ce.get(e);if(!t&&e===ae&&(0,s.T9)())return we();if(!t)throw ve.create("no-app",{appName:e});return t}function Ee(e,t,n){var i;let s=null!==(i=ue[e])&&void 0!==i?i:e;n&&(s+=`-${n}`);const o=s.match(/\s|\//),a=t.match(/\s|\//);if(o||a){const e=[`Unable to register library "${s}" with version "${t}":`];return o&&e.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&a&&e.push("and"),a&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void x.warn(e.join(" "))}de(new r.uA(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}
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
const Te="firebase-heartbeat-database",Ie=1,Se="firebase-heartbeat-store";let Ce=null;function Ae(){return Ce||(Ce=I(Te,Ie,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(Se)}catch(n){console.warn(n)}}}}).catch(e=>{throw ve.create("idb-open",{originalErrorMessage:e.message})})),Ce}async function ke(e){try{const t=await Ae(),n=t.transaction(Se),r=await n.objectStore(Se).get(Oe(e));return await n.done,r}catch(t){if(t instanceof s.g)x.warn(t.message);else{const e=ve.create("idb-get",{originalErrorMessage:null===t||void 0===t?void 0:t.message});x.warn(e.message)}}}async function Re(e,t){try{const n=await Ae(),r=n.transaction(Se,"readwrite"),i=r.objectStore(Se);await i.put(t,Oe(e)),await r.done}catch(n){if(n instanceof s.g)x.warn(n.message);else{const e=ve.create("idb-set",{originalErrorMessage:null===n||void 0===n?void 0:n.message});x.warn(e.message)}}}function Oe(e){return`${e.name}!${e.options.appId}`}
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
 */const Ne=1024,De=2592e6;class xe{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Me(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate(),r=n.getPlatformInfoString(),i=Pe();if(null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(e=>e.date===i))return;return this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{const t=new Date(e.date).valueOf(),n=Date.now();return n-t<=De}),this._storage.overwrite(this._heartbeatsCache)}catch(n){x.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=Pe(),{heartbeatsToSend:n,unsentEntries:r}=Le(this._heartbeatsCache.heartbeats),i=(0,s.Uj)(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return x.warn(t),""}}}function Pe(){const e=new Date;return e.toISOString().substring(0,10)}function Le(e,t=Ne){const n=[];let r=e.slice();for(const i of e){const e=n.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),Ue(n)>t){e.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Ue(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Me{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!(0,s.zW)()&&(0,s.eX)().then(()=>!0).catch(()=>!1)}async read(){const e=await this._canUseIndexedDBPromise;if(e){const e=await ke(this.app);return(null===e||void 0===e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;const n=await this._canUseIndexedDBPromise;if(n){const n=await this.read();return Re(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;const n=await this._canUseIndexedDBPromise;if(n){const n=await this.read();return Re(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}}function Ue(e){return(0,s.Uj)(JSON.stringify({version:2,heartbeats:e})).length}
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
 */function Fe(e){de(new r.uA("platform-logger",e=>new R(e),"PRIVATE")),de(new r.uA("heartbeat",e=>new xe(e),"PRIVATE")),Ee(N,D,e),Ee(N,D,"esm2017"),Ee("fire-js","")}Fe("")},953:function(e,t,n){"use strict";n.d(t,{C4:function(){return S},EW:function(){return Ve},Gc:function(){return _e},IG:function(){return Ae},IJ:function(){return De},KR:function(){return Ne},Kh:function(){return ye},Pr:function(){return Ue},R1:function(){return Le},Tm:function(){return Te},X2:function(){return l},a1:function(){return Re},bl:function(){return C},fE:function(){return Ie},g8:function(){return Ee},hV:function(){return We},hZ:function(){return U},i9:function(){return Oe},ju:function(){return Se},lJ:function(){return ke},qA:function(){return V},u4:function(){return M},uY:function(){return a},ux:function(){return Ce},wB:function(){return Ke},yC:function(){return o}});var r=n(33);
/**
* @vue/reactivity v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let i,s;class o{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=i,!e&&i&&(this.index=(i.scopes||(i.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){let e,t;if(this._isPaused=!0,this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].pause();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){let e,t;if(this._isPaused=!1,this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].resume();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].resume()}}run(e){if(this._active){const t=i;try{return i=this,e()}finally{i=t}}else 0}on(){1===++this._on&&(this.prevScope=i,i=this)}off(){this._on>0&&0===--this._on&&(i=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){let t,n;for(this._active=!1,t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}}function a(e){return new o(e)}function u(){return i}const c=new WeakSet;class l{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,i&&i.active&&i.effects.push(this)}pause(){this.flags|=64}resume(){64&this.flags&&(this.flags&=-65,c.has(this)&&(c.delete(this),this.trigger()))}notify(){2&this.flags&&!(32&this.flags)||8&this.flags||p(this)}run(){if(!(1&this.flags))return this.fn();this.flags|=2,A(this),v(this);const e=s,t=T;s=this,T=!0;try{return this.fn()}finally{0,y(this),s=e,T=t,this.flags&=-3}}stop(){if(1&this.flags){for(let e=this.deps;e;e=e.nextDep)b(e);this.deps=this.depsTail=void 0,A(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){64&this.flags?c.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){_(this)&&this.run()}get dirty(){return _(this)}}let h,f,d=0;function p(e,t=!1){if(e.flags|=8,t)return e.next=f,void(f=e);e.next=h,h=e}function g(){d++}function m(){if(--d>0)return;if(f){let e=f;f=void 0;while(e){const t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;while(h){let n=h;h=void 0;while(n){const r=n.next;if(n.next=void 0,n.flags&=-9,1&n.flags)try{n.trigger()}catch(t){e||(e=t)}n=r}}if(e)throw e}function v(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function y(e){let t,n=e.depsTail,r=n;while(r){const e=r.prevDep;-1===r.version?(r===n&&(n=e),b(r),E(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function _(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(w(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function w(e){if(4&e.flags&&!(16&e.flags))return;if(e.flags&=-17,e.globalVersion===k)return;if(e.globalVersion=k,!e.isSSR&&128&e.flags&&(!e.deps&&!e._dirty||!_(e)))return;e.flags|=2;const t=e.dep,n=s,i=T;s=e,T=!0;try{v(e);const n=e.fn(e._value);(0===t.version||(0,r.$H)(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(o){throw t.version++,o}finally{s=n,T=i,y(e),e.flags&=-3}}function b(e,t=!1){const{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)b(e,!0)}t||--n.sc||!n.map||n.map.delete(n.key)}function E(e){const{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}let T=!0;const I=[];function S(){I.push(T),T=!1}function C(){const e=I.pop();T=void 0===e||e}function A(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const e=s;s=void 0;try{t()}finally{s=e}}}let k=0;class R{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class O{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!s||!T||s===this.computed)return;let t=this.activeLink;if(void 0===t||t.sub!==s)t=this.activeLink=new R(s,this),s.deps?(t.prevDep=s.depsTail,s.depsTail.nextDep=t,s.depsTail=t):s.deps=s.depsTail=t,N(t);else if(-1===t.version&&(t.version=this.version,t.nextDep)){const e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=s.depsTail,t.nextDep=void 0,s.depsTail.nextDep=t,s.depsTail=t,s.deps===t&&(s.deps=e)}return t}trigger(e){this.version++,k++,this.notify(e)}notify(e){g();try{0;for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{m()}}}function N(e){if(e.dep.sc++,4&e.sub.flags){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)N(e)}const n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}const D=new WeakMap,x=Symbol(""),P=Symbol(""),L=Symbol("");function M(e,t,n){if(T&&s){let t=D.get(e);t||D.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new O),r.map=t,r.key=n),r.track()}}function U(e,t,n,i,s,o){const a=D.get(e);if(!a)return void k++;const u=e=>{e&&e.trigger()};if(g(),"clear"===t)a.forEach(u);else{const s=(0,r.cy)(e),o=s&&(0,r.yI)(n);if(s&&"length"===n){const e=Number(i);a.forEach((t,n)=>{("length"===n||n===L||!(0,r.Bm)(n)&&n>=e)&&u(t)})}else switch((void 0!==n||a.has(void 0))&&u(a.get(n)),o&&u(a.get(L)),t){case"add":s?o&&u(a.get("length")):(u(a.get(x)),(0,r.CE)(e)&&u(a.get(P)));break;case"delete":s||(u(a.get(x)),(0,r.CE)(e)&&u(a.get(P)));break;case"set":(0,r.CE)(e)&&u(a.get(x));break}}m()}function F(e){const t=Ce(e);return t===e?t:(M(t,"iterate",L),Ie(e)?t:t.map(ke))}function V(e){return M(e=Ce(e),"iterate",L),e}function j(e,t){return Te(e)?Ee(e)?Re(ke(t)):Re(t):ke(t)}const B={__proto__:null,[Symbol.iterator](){return $(this,Symbol.iterator,e=>j(this,e))},concat(...e){return F(this).concat(...e.map(e=>(0,r.cy)(e)?F(e):e))},entries(){return $(this,"entries",e=>(e[1]=j(this,e[1]),e))},every(e,t){return K(this,"every",e,t,void 0,arguments)},filter(e,t){return K(this,"filter",e,t,e=>e.map(e=>j(this,e)),arguments)},find(e,t){return K(this,"find",e,t,e=>j(this,e),arguments)},findIndex(e,t){return K(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return K(this,"findLast",e,t,e=>j(this,e),arguments)},findLastIndex(e,t){return K(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return K(this,"forEach",e,t,void 0,arguments)},includes(...e){return G(this,"includes",e)},indexOf(...e){return G(this,"indexOf",e)},join(e){return F(this).join(e)},lastIndexOf(...e){return G(this,"lastIndexOf",e)},map(e,t){return K(this,"map",e,t,void 0,arguments)},pop(){return z(this,"pop")},push(...e){return z(this,"push",e)},reduce(e,...t){return W(this,"reduce",e,t)},reduceRight(e,...t){return W(this,"reduceRight",e,t)},shift(){return z(this,"shift")},some(e,t){return K(this,"some",e,t,void 0,arguments)},splice(...e){return z(this,"splice",e)},toReversed(){return F(this).toReversed()},toSorted(e){return F(this).toSorted(e)},toSpliced(...e){return F(this).toSpliced(...e)},unshift(...e){return z(this,"unshift",e)},values(){return $(this,"values",e=>j(this,e))}};function $(e,t,n){const r=V(e),i=r[t]();return r===e||Ie(e)||(i._next=i.next,i.next=()=>{const e=i._next();return e.done||(e.value=n(e.value)),e}),i}const q=Array.prototype;function K(e,t,n,r,i,s){const o=V(e),a=o!==e&&!Ie(e),u=o[t];if(u!==q[t]){const t=u.apply(e,s);return a?ke(t):t}let c=n;o!==e&&(a?c=function(t,r){return n.call(this,j(e,t),r,e)}:n.length>2&&(c=function(t,r){return n.call(this,t,r,e)}));const l=u.call(o,c,r);return a&&i?i(l):l}function W(e,t,n,r){const i=V(e);let s=n;return i!==e&&(Ie(e)?n.length>3&&(s=function(t,r,i){return n.call(this,t,r,i,e)}):s=function(t,r,i){return n.call(this,t,j(e,r),i,e)}),i[t](s,...r)}function G(e,t,n){const r=Ce(e);M(r,"iterate",L);const i=r[t](...n);return-1!==i&&!1!==i||!Se(n[0])?i:(n[0]=Ce(n[0]),r[t](...n))}function z(e,t,n=[]){S(),g();const r=Ce(e)[t].apply(e,n);return m(),C(),r}const H=(0,r.pD)("__proto__,__v_isRef,__isVue"),Q=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>"arguments"!==e&&"caller"!==e).map(e=>Symbol[e]).filter(r.Bm));function X(e){(0,r.Bm)(e)||(e=String(e));const t=Ce(this);return M(t,"has",e),t.hasOwnProperty(e)}class Y{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if("__v_skip"===t)return e["__v_skip"];const i=this._isReadonly,s=this._isShallow;if("__v_isReactive"===t)return!i;if("__v_isReadonly"===t)return i;if("__v_isShallow"===t)return s;if("__v_raw"===t)return n===(i?s?ge:pe:s?de:fe).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;const o=(0,r.cy)(e);if(!i){let e;if(o&&(e=B[t]))return e;if("hasOwnProperty"===t)return X}const a=Reflect.get(e,t,Oe(e)?e:n);if((0,r.Bm)(t)?Q.has(t):H(t))return a;if(i||M(e,"get",t),s)return a;if(Oe(a)){const e=o&&(0,r.yI)(t)?a:a.value;return i&&(0,r.Gv)(e)?we(e):e}return(0,r.Gv)(a)?i?we(a):ye(a):a}}class J extends Y{constructor(e=!1){super(!1,e)}set(e,t,n,i){let s=e[t];const o=(0,r.cy)(e)&&(0,r.yI)(t);if(!this._isShallow){const e=Te(s);if(Ie(n)||Te(n)||(s=Ce(s),n=Ce(n)),!o&&Oe(s)&&!Oe(n))return e||(s.value=n),!0}const a=o?Number(t)<e.length:(0,r.$3)(e,t),u=Reflect.set(e,t,n,Oe(e)?e:i);return e===Ce(i)&&(a?(0,r.$H)(n,s)&&U(e,"set",t,n,s):U(e,"add",t,n)),u}deleteProperty(e,t){const n=(0,r.$3)(e,t),i=e[t],s=Reflect.deleteProperty(e,t);return s&&n&&U(e,"delete",t,void 0,i),s}has(e,t){const n=Reflect.has(e,t);return(0,r.Bm)(t)&&Q.has(t)||M(e,"has",t),n}ownKeys(e){return M(e,"iterate",(0,r.cy)(e)?"length":x),Reflect.ownKeys(e)}}class Z extends Y{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}}const ee=new J,te=new Z,ne=new J(!0),re=e=>e,ie=e=>Reflect.getPrototypeOf(e);function se(e,t,n){return function(...i){const s=this["__v_raw"],o=Ce(s),a=(0,r.CE)(o),u="entries"===e||e===Symbol.iterator&&a,c="keys"===e&&a,l=s[e](...i),h=n?re:t?Re:ke;return!t&&M(o,"iterate",c?P:x),{next(){const{value:e,done:t}=l.next();return t?{value:e,done:t}:{value:u?[h(e[0]),h(e[1])]:h(e),done:t}},[Symbol.iterator](){return this}}}}function oe(e){return function(...t){return"delete"!==e&&("clear"===e?void 0:this)}}function ae(e,t){const n={get(n){const i=this["__v_raw"],s=Ce(i),o=Ce(n);e||((0,r.$H)(n,o)&&M(s,"get",n),M(s,"get",o));const{has:a}=ie(s),u=t?re:e?Re:ke;return a.call(s,n)?u(i.get(n)):a.call(s,o)?u(i.get(o)):void(i!==s&&i.get(n))},get size(){const t=this["__v_raw"];return!e&&M(Ce(t),"iterate",x),t.size},has(t){const n=this["__v_raw"],i=Ce(n),s=Ce(t);return e||((0,r.$H)(t,s)&&M(i,"has",t),M(i,"has",s)),t===s?n.has(t):n.has(t)||n.has(s)},forEach(n,r){const i=this,s=i["__v_raw"],o=Ce(s),a=t?re:e?Re:ke;return!e&&M(o,"iterate",x),s.forEach((e,t)=>n.call(r,a(e),a(t),i))}};(0,r.X$)(n,e?{add:oe("add"),set:oe("set"),delete:oe("delete"),clear:oe("clear")}:{add(e){t||Ie(e)||Te(e)||(e=Ce(e));const n=Ce(this),r=ie(n),i=r.has.call(n,e);return i||(n.add(e),U(n,"add",e,e)),this},set(e,n){t||Ie(n)||Te(n)||(n=Ce(n));const i=Ce(this),{has:s,get:o}=ie(i);let a=s.call(i,e);a||(e=Ce(e),a=s.call(i,e));const u=o.call(i,e);return i.set(e,n),a?(0,r.$H)(n,u)&&U(i,"set",e,n,u):U(i,"add",e,n),this},delete(e){const t=Ce(this),{has:n,get:r}=ie(t);let i=n.call(t,e);i||(e=Ce(e),i=n.call(t,e));const s=r?r.call(t,e):void 0,o=t.delete(e);return i&&U(t,"delete",e,void 0,s),o},clear(){const e=Ce(this),t=0!==e.size,n=void 0,r=e.clear();return t&&U(e,"clear",void 0,void 0,n),r}});const i=["keys","values","entries",Symbol.iterator];return i.forEach(r=>{n[r]=se(r,e,t)}),n}function ue(e,t){const n=ae(e,t);return(t,i,s)=>"__v_isReactive"===i?!e:"__v_isReadonly"===i?e:"__v_raw"===i?t:Reflect.get((0,r.$3)(n,i)&&i in t?n:t,i,s)}const ce={get:ue(!1,!1)},le={get:ue(!1,!0)},he={get:ue(!0,!1)};const fe=new WeakMap,de=new WeakMap,pe=new WeakMap,ge=new WeakMap;function me(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function ve(e){return e["__v_skip"]||!Object.isExtensible(e)?0:me((0,r.Zf)(e))}function ye(e){return Te(e)?e:be(e,!1,ee,ce,fe)}function _e(e){return be(e,!1,ne,le,de)}function we(e){return be(e,!0,te,he,pe)}function be(e,t,n,i,s){if(!(0,r.Gv)(e))return e;if(e["__v_raw"]&&(!t||!e["__v_isReactive"]))return e;const o=ve(e);if(0===o)return e;const a=s.get(e);if(a)return a;const u=new Proxy(e,2===o?i:n);return s.set(e,u),u}function Ee(e){return Te(e)?Ee(e["__v_raw"]):!(!e||!e["__v_isReactive"])}function Te(e){return!(!e||!e["__v_isReadonly"])}function Ie(e){return!(!e||!e["__v_isShallow"])}function Se(e){return!!e&&!!e["__v_raw"]}function Ce(e){const t=e&&e["__v_raw"];return t?Ce(t):e}function Ae(e){return!(0,r.$3)(e,"__v_skip")&&Object.isExtensible(e)&&(0,r.yQ)(e,"__v_skip",!0),e}const ke=e=>(0,r.Gv)(e)?ye(e):e,Re=e=>(0,r.Gv)(e)?we(e):e;function Oe(e){return!!e&&!0===e["__v_isRef"]}function Ne(e){return xe(e,!1)}function De(e){return xe(e,!0)}function xe(e,t){return Oe(e)?e:new Pe(e,t)}class Pe{constructor(e,t){this.dep=new O,this["__v_isRef"]=!0,this["__v_isShallow"]=!1,this._rawValue=t?e:Ce(e),this._value=t?e:ke(e),this["__v_isShallow"]=t}get value(){return this.dep.track(),this._value}set value(e){const t=this._rawValue,n=this["__v_isShallow"]||Ie(e)||Te(e);e=n?e:Ce(e),(0,r.$H)(e,t)&&(this._rawValue=e,this._value=n?e:ke(e),this.dep.trigger())}}function Le(e){return Oe(e)?e.value:e}const Me={get:(e,t,n)=>"__v_raw"===t?e:Le(Reflect.get(e,t,n)),set:(e,t,n,r)=>{const i=e[t];return Oe(i)&&!Oe(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function Ue(e){return Ee(e)?e:new Proxy(e,Me)}class Fe{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new O(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=k-1,this.next=void 0,this.effect=this,this["__v_isReadonly"]=!t,this.isSSR=n}notify(){if(this.flags|=16,!(8&this.flags||s===this))return p(this,!0),!0}get value(){const e=this.dep.track();return w(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function Ve(e,t,n=!1){let i,s;(0,r.Tn)(e)?i=e:(i=e.get,s=e.set);const o=new Fe(i,s,n);return o}const je={},Be=new WeakMap;let $e;function qe(e,t=!1,n=$e){if(n){let t=Be.get(n);t||Be.set(n,t=[]),t.push(e)}else 0}function Ke(e,t,n=r.MZ){const{immediate:i,deep:s,once:o,scheduler:a,augmentJob:c,call:h}=n,f=e=>s?e:Ie(e)||!1===s||0===s?We(e,1):We(e);let d,p,g,m,v=!1,y=!1;if(Oe(e)?(p=()=>e.value,v=Ie(e)):Ee(e)?(p=()=>f(e),v=!0):(0,r.cy)(e)?(y=!0,v=e.some(e=>Ee(e)||Ie(e)),p=()=>e.map(e=>Oe(e)?e.value:Ee(e)?f(e):(0,r.Tn)(e)?h?h(e,2):e():void 0)):p=(0,r.Tn)(e)?t?h?()=>h(e,2):e:()=>{if(g){S();try{g()}finally{C()}}const t=$e;$e=d;try{return h?h(e,3,[m]):e(m)}finally{$e=t}}:r.tE,t&&s){const e=p,t=!0===s?1/0:s;p=()=>We(e(),t)}const _=u(),w=()=>{d.stop(),_&&_.active&&(0,r.TF)(_.effects,d)};if(o&&t){const e=t;t=(...t)=>{e(...t),w()}}let b=y?new Array(e.length).fill(je):je;const E=e=>{if(1&d.flags&&(d.dirty||e))if(t){const e=d.run();if(s||v||(y?e.some((e,t)=>(0,r.$H)(e,b[t])):(0,r.$H)(e,b))){g&&g();const n=$e;$e=d;try{const n=[e,b===je?void 0:y&&b[0]===je?[]:b,m];b=e,h?h(t,3,n):t(...n)}finally{$e=n}}}else d.run()};return c&&c(E),d=new l(p),d.scheduler=a?()=>a(E,!1):E,m=e=>qe(e,!1,d),g=d.onStop=()=>{const e=Be.get(d);if(e){if(h)h(e,4);else for(const t of e)t();Be.delete(d)}},t?i?E(!0):b=d.run():a?a(E.bind(null,!0),!0):d.run(),w.pause=d.pause.bind(d),w.resume=d.resume.bind(d),w.stop=w,w}function We(e,t=1/0,n){if(t<=0||!(0,r.Gv)(e)||e["__v_skip"])return e;if(n=n||new Map,(n.get(e)||0)>=t)return e;if(n.set(e,t),t--,Oe(e))We(e.value,t,n);else if((0,r.cy)(e))for(let r=0;r<e.length;r++)We(e[r],t,n);else if((0,r.vM)(e)||(0,r.CE)(e))e.forEach(e=>{We(e,t,n)});else if((0,r.Qd)(e)){for(const r in e)We(e[r],t,n);for(const r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&We(e[r],t,n)}return e}}}]);