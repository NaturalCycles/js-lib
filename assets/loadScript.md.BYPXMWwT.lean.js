import{i as m}from"./chunks/env.BUzbqU-4.js";import{_}from"./chunks/types.C-9dMxxX.js";import{d as S,p as k,c as p,o as u,j as n,e as y,ae as f,G as g}from"./chunks/framework.BKGnXUJ7.js";import{_ as h}from"./chunks/stringify.B2tndjO0.js";async function b(o,a){if(!m())return await new Promise((e,i)=>{const r=_(document.createElement("script"),{src:o,async:!0,...a,onload:e,onerror:(c,l,d,s,t)=>{i(t||new Error(`loadScript failed: ${o}`))}});document.head.append(r)})}async function C(o,a){if(!m())return await new Promise((e,i)=>{const r=_(document.createElement("link"),{href:o,rel:"stylesheet",...a,onload:e,onerror:(c,l,d,s,t)=>{i(t||new Error(`loadCSS failed: ${o}`))}});document.head.append(r)})}const v={class:"app-content"},w={key:0},E=S({__name:"LoadScriptDemo",setup(o){const a=k(!1);async function e(){await l("https://unpkg.com/jquery@3.6.0/dist/jquery.js")}async function i(){await l("https://unpkg.com/jqueryNON_EXISTING")}async function r(){await d("https://cdn.simplecss.org/simple.min.css")}async function c(){await d("https://cdn.simplecss.org/simpleNOTFOUND.min.css")}async function l(s){a.value=!0;try{await b(s),alert("loaded ok")}catch(t){alert(h(t))}finally{a.value=!1}}async function d(s){a.value=!0;try{await C(s),alert("loaded ok")}catch(t){alert(h(t))}finally{a.value=!1}}return(s,t)=>(u(),p("div",v,[n("button",{onClick:e},"Load good script"),n("button",{onClick:i},"Load bad script"),t[0]||(t[0]=n("br",null,null,-1)),t[1]||(t[1]=n("br",null,null,-1)),n("button",{onClick:r},"Load good CSS"),n("button",{onClick:c},"Load bad CSS"),a.value?(u(),p("p",w,"loading...")):y("",!0)]))}}),D=JSON.parse('{"title":"loadScript, loadCSS","description":"","frontmatter":{},"headers":[],"relativePath":"loadScript.md","filePath":"loadScript.md"}'),N={name:"loadScript.md"},F=Object.assign(N,{setup(o){return(a,e)=>(u(),p("div",null,[e[0]||(e[0]=f("",4)),g(E)]))}});export{D as __pageData,F as default};
