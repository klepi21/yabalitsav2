(()=>{var e={};e.id=811,e.ids=[811],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},41808:e=>{"use strict";e.exports=require("net")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},85477:e=>{"use strict";e.exports=require("punycode")},12781:e=>{"use strict";e.exports=require("stream")},24404:e=>{"use strict";e.exports=require("tls")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},73624:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>m,originalPathname:()=>d,pages:()=>p,routeModule:()=>h,tree:()=>u});var r=s(73137),i=s(54647),a=s(4183),n=s.n(a),o=s(71775),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);s.d(t,l);let c=r.AppPageRouteModule,u=["",{children:["history",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,76418)),"/Users/konstantinoslepidas/Desktop/football/app/history/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,58022)),"/Users/konstantinoslepidas/Desktop/football/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,51918,23)),"next/dist/client/components/not-found-error"]}],p=["/Users/konstantinoslepidas/Desktop/football/app/history/page.tsx"],d="/history/page",m={require:s,loadChunk:()=>Promise.resolve()},h=new c({definition:{kind:i.x.APP_PAGE,page:"/history/page",pathname:"/history",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:u}})},50247:(e,t,s)=>{Promise.resolve().then(s.bind(s,92489))},92489:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>y});var r=s(60080),i=s(12932),a=s(9885),n=s(19566),o=s(23161);let l=n.fC,c=a.forwardRef(({className:e,...t},s)=>r.jsx(n.aV,{ref:s,className:(0,o.cn)("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",e),...t}));c.displayName=n.aV.displayName;let u=a.forwardRef(({className:e,...t},s)=>r.jsx(n.xz,{ref:s,className:(0,o.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",e),...t}));u.displayName=n.xz.displayName;let p=a.forwardRef(({className:e,...t},s)=>r.jsx(n.VY,{ref:s,className:(0,o.cn)("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",e),...t}));p.displayName=n.VY.displayName;var d=s(22730);let m="https://uinmrgrmqhgonrshidcy.supabase.co",h="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbm1yZ3JtcWhnb25yc2hpZGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MTIyMzUsImV4cCI6MjA1MDA4ODIzNX0.TtAI51MHBOVQUCd7hH-FTIOdERFjIBMIg7FussygnKk";if(!m||!h)throw Error("Missing Supabase environment variables");let x=(0,d.createClient)(m,h,{auth:{persistSession:!0,autoRefreshToken:!0}});function f(e){let[t,s]=(0,a.useState)([]),[r,i]=(0,a.useState)(!0);return(0,a.useEffect)(()=>{let t=async()=>{try{let t=x.from("matches").select(`
            *,
            venue:venues(*),
            host:profiles(*),
            participants:match_participants(
              player:profiles(*)
            )
          `).order("match_date",{ascending:!0});e&&t.eq("status",e);let{data:r,error:i}=await t;if(i)throw i;s(r||[])}catch(e){console.error("Error fetching matches:",e)}finally{i(!1)}};t();let r=x.channel("matches").on("postgres_changes",{event:"*",schema:"public",table:"matches"},()=>{t()}).subscribe();return()=>{r.unsubscribe()}},[e]),{matches:t,loading:r}}var g=s(11526);function y(){let{t:e}=(0,i.useLanguage)(),{matches:t,loading:s}=f("finished"),{matches:a,loading:n}=f("upcoming");return(0,r.jsxs)("div",{className:"p-4 space-y-6",children:[r.jsx("header",{className:"flex items-center justify-between mb-6",children:(0,r.jsxs)("div",{children:[r.jsx("h1",{className:"text-2xl font-bold",children:e("history.title")}),r.jsx("p",{className:"text-muted-foreground",children:e("history.subtitle")})]})}),(0,r.jsxs)(l,{defaultValue:"upcoming",children:[(0,r.jsxs)(c,{className:"grid w-full grid-cols-2",children:[r.jsx(u,{value:"upcoming",children:e("history.tabs.upcoming")}),r.jsx(u,{value:"finished",children:e("history.tabs.finished")})]}),r.jsx(p,{value:"upcoming",children:0===a.length?r.jsx("p",{className:"text-center text-muted-foreground py-8",children:e("history.noMatches")}):r.jsx("div",{className:"space-y-4",children:a.map(e=>r.jsx(g.m,{match:{...e,participants:e.participants?.map(e=>({player:{id:e.id,full_name:e.full_name}}))}},e.id))})}),r.jsx(p,{value:"finished",children:0===t.length?r.jsx("p",{className:"text-center text-muted-foreground py-8",children:e("history.noMatches")}):r.jsx("div",{className:"space-y-4",children:t.map(e=>r.jsx(g.m,{match:{...e,participants:e.participants?.map(e=>({player:{id:e.id,full_name:e.full_name}}))}},e.id))})})]})]})}},76418:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>n,__esModule:()=>a,default:()=>l});var r=s(17536);let i=(0,r.createProxy)(String.raw`/Users/konstantinoslepidas/Desktop/football/app/history/page.tsx`),{__esModule:a,$$typeof:n}=i,o=i.default,l=o}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[650,234,862,843,566,92,52,148,526],()=>s(73624));module.exports=r})();