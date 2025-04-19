import{_ as s,c as a,o as t,ae as i}from"./chunks/framework.BKGnXUJ7.js";const g=JSON.parse('{"title":"js-lib","description":"","frontmatter":{},"headers":[],"relativePath":"index.md","filePath":"index.md"}'),n={name:"index.md"};function o(l,e,r,d,p,c){return t(),a("div",null,e[0]||(e[0]=[i(`<h1 id="js-lib" tabindex="-1">js-lib <a class="header-anchor" href="#js-lib" aria-label="Permalink to &quot;js-lib&quot;">​</a></h1><blockquote><p>Standard library for universal (browser + Node.js) javascript</p></blockquote><div class="badges"><p><img src="https://img.shields.io/npm/v/@naturalcycles/js-lib/latest.svg" alt="npm"><img src="https://badgen.net/bundlephobia/minzip/@naturalcycles/js-lib" alt="min.gz size"><img src="https://github.com/NaturalCycles/js-lib/workflows/default/badge.svg" alt="Actions"><img src="https://badgen.net/codeclimate/loc/NaturalCycles/js-lib" alt="loc"></p></div><div class="badges"><p><img src="https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/maintainability" alt="Maintainability"><img src="https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/test_coverage" alt="Test Coverage"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier"></p></div><h2 id="design" tabindex="-1">Design <a class="header-anchor" href="#design" aria-label="Permalink to &quot;Design&quot;">​</a></h2><p>Inspired by <a href="https://lodash.com/docs/" target="_blank" rel="noreferrer">Lodash</a>, <a href="https://github.com/petkaantonov/bluebird" target="_blank" rel="noreferrer">bluebird</a>, <a href="https://github.com/sindresorhus/promise-fun" target="_blank" rel="noreferrer">promise-fun</a> and other useful small packages.</p><p>Designed to play well with the rest of opinionated &quot;Natural Cycles JS Platform&quot; (link pending). This package is the lowest-level production dependency (not <code>devDependency</code>) of the Platform. Almost everything else depends on it.</p><p>All functions in this package are exported in <code>index.ts</code> (flat), no namespacing is used. So, to avoid conflicts and &quot;global import namespace&quot; pollution , all functions are prefixed with an underscore (e.g <code>_.pick</code> becomes <code>_pick</code>), with some exceptions (later). Promise functions are prefixed with <code>p</code>, e.g <code>pMap</code>.</p><p>Decorators are _prefixed and PascalCased (e.g <code>@_Debounce</code>). <code>_</code>is to be consistent with other naming in this package. PascalCase is to distinguish decorators from similar functions that are not decorators. Example:<code>\\_debounce</code>is a function (lodash-based),<code>\\_Debounce</code>is a decorator (used as<code>@\\_Debounce</code>). PascalCase convention follows Angular/Ionic convention (but doesn&#39;t follow TypeScript documentation convention; we had to pick one).</p><p>Interfaces and Classes are named as usual (no prefix, PascalCase, e.g <code>AppError</code>).</p><p>Q: Why not just use lodash?</p><p>A:</p><ul><li>We believe Lodash is outdated (many functions are pre-ES6 / obsolete by ES6).</li><li>Because it has so many outdated functions - its size is bigger, and solutions to tree-shake exist, but complicated.</li><li>First-class TypeScript support (all code in this repo is TypeScript).</li></ul><p>This package is intended to be 0-dependency (exception: <a href="https://github.com/Microsoft/tslib" target="_blank" rel="noreferrer">tslib</a> from TypeScript), &quot;not bloated&quot;, tree-shakeable. Supported by reasonably modern Browsers and Node.js latest LTS.</p><h2 id="mutation" tabindex="-1">Mutation <a class="header-anchor" href="#mutation" aria-label="Permalink to &quot;Mutation&quot;">​</a></h2><p>All function does <strong>NOT</strong> mutate the arguments by default.</p><p>Many functions support &quot;mutation flag&quot;, which can be set to <code>true</code> to perform a mutation.</p><p>For example:</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> obj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { a: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;a&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, b: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;b&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Non-mutating (default)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> obj2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> _pick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(obj, [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;a&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">])</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// { a: &#39;a&#39; }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Mutating (opt-in)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">_pick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(obj, [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;a&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">], </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// obj was mutated</span></span></code></pre></div><h2 id="highlights" tabindex="-1">Highlights <a class="header-anchor" href="#highlights" aria-label="Permalink to &quot;Highlights&quot;">​</a></h2><ul><li><code>pMap</code> (based on <a href="https://github.com/sindresorhus/p-map" target="_blank" rel="noreferrer">https://github.com/sindresorhus/p-map</a>)</li><li><code>StringMap</code></li><li><code>@_Memo</code></li><li><code>_merge</code> (based on <a href="https://gist.github.com/Salakar/1d7137de9cb8b704e48a" target="_blank" rel="noreferrer">https://gist.github.com/Salakar/1d7137de9cb8b704e48a</a>)</li><li><code>_deepEquals</code> (based on <a href="https://github.com/epoberezkin/fast-deep-equal/" target="_blank" rel="noreferrer">https://github.com/epoberezkin/fast-deep-equal/</a>)</li><li><code>_sortObjectDeep</code> (based on <a href="https://github.com/IndigoUnited/js-deep-sort-object" target="_blank" rel="noreferrer">https://github.com/IndigoUnited/js-deep-sort-object</a>)</li><li><code>_set</code> (based on <a href="https://stackoverflow.com/a/54733755/4919972" target="_blank" rel="noreferrer">https://stackoverflow.com/a/54733755/4919972</a>)</li><li><code>_unset</code> (based on <a href="https://github.com/jonschlinkert/unset-value" target="_blank" rel="noreferrer">https://github.com/jonschlinkert/unset-value</a>)</li><li>...</li></ul>`,21)]))}const u=s(n,[["render",o]]);export{g as __pageData,u as default};
