(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{2805:function(e,t,n){Promise.resolve().then(n.bind(n,7139))},7139:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return l}});var s=n(7437),i=n(2265),a=n(3082),r=n(6085),c=n(4033);function l(){let[e,t]=(0,i.useState)([]),[n,l]=(0,i.useState)(!0),[o,u]=(0,i.useState)(null),d=(0,a.createClientComponentClient)(),h=(0,c.useRouter)();(0,i.useEffect)(()=>{let e=async()=>{let{data:{user:e}}=await d.auth.getUser();u(e)};e()},[]),(0,i.useEffect)(()=>{let e=async()=>{let{data:e,error:n}=await d.from("matches").select("\n          *,\n          venue:venues(*),\n          host:profiles!matches_host_id_fkey(*),\n          participants:match_participants(\n            player:profiles(*)\n          )\n        ").eq("status","upcoming").order("match_date",{ascending:!0}).limit(3);if(n){console.error("Error fetching matches:",n);return}t(e||[]),l(!1)};e()},[]);let m=async e=>{if(!o){h.push("/login");return}try{let{error:t}=await d.from("match_participants").insert({match_id:e,player_id:o.id});if(t)throw t;h.refresh()}catch(e){console.error("Error joining match:",e)}},f=e=>{var t;let[n,...s]=e.split(" ");return"".concat(n," ").concat(null===(t=s[0])||void 0===t?void 0:t[0],".")};return n?(0,s.jsx)("div",{className:"p-4",children:"Loading..."}):(0,s.jsx)("main",{className:"container py-6",children:(0,s.jsxs)("section",{className:"space-y-4",children:[(0,s.jsxs)("div",{className:"flex items-center justify-between",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold",children:"Επερχόμενοι Αγώνες"}),(0,s.jsx)("button",{onClick:()=>h.push("/matches"),className:"text-primary hover:underline",children:"Δείτε όλους"})]}),0===e.length?(0,s.jsxs)("div",{className:"text-center py-12",children:[(0,s.jsx)("h3",{className:"text-lg font-medium",children:"Δεν υπάρχουν διαθέσιμοι αγώνες"}),(0,s.jsx)("p",{className:"text-muted-foreground",children:"Δοκιμάστε ξανά αργότερα"})]}):e.map(e=>{var t;return(0,s.jsx)(r.m,{match:e,isJoined:(null===(t=e.participants)||void 0===t?void 0:t.some(e=>e.player.id===(null==o?void 0:o.id)))||!1,onJoin:()=>m(e.id),formatName:f},e.id)})]})})}},4033:function(e,t,n){e.exports=n(290)}},function(e){e.O(0,[952,890,85,971,864,744],function(){return e(e.s=2805)}),_N_E=e.O()}]);