(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[178],{7804:function(e,r,t){Promise.resolve().then(t.bind(t,6402))},6402:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return S}});var s=t(7437),a=t(2265),i=t(1865),n=t(8110),l=t(4578),o=t(3082),c=t(3023),d=t(1315),u=t(1908),p=t(8257),m=t(6072),f=t(9311);let h=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsxs)(m.fC,{ref:r,className:(0,f.cn)("relative flex w-full touch-none select-none items-center",t),...a,children:[(0,s.jsx)(m.fQ,{className:"relative h-2 w-full grow overflow-hidden rounded-full bg-secondary",children:(0,s.jsx)(m.e6,{className:"absolute h-full bg-primary"})}),(0,s.jsx)(m.bU,{className:"block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"})]})});h.displayName=m.fC.displayName;var x=t(2621),g=t(6110),j=t(7309),b=t(6672),v=t(9126),w=t(2536),N=t(9853),y=t(5287);let _=async()=>{try{let e=await y.Z.Notifications.permission;if(console.log("Current permission:",e),!e){let e=await y.Z.Slidedown.promptPush();console.log("Prompt result:",e);let r=await y.Z.Notifications.permission;if(console.log("New permission:",r),!r)return!1}await y.Z.User.PushSubscription.optIn();let r=await y.Z.User.PushSubscription.optedIn;console.log("Is subscribed:",r);let t=await y.Z.Notifications.permission;return console.log("Final browser permission:",t),!!(r&&t)}catch(e){return console.error("Error subscribing to notifications:",e),!1}},C=async()=>{try{await y.Z.User.PushSubscription.optOut();let e=await y.Z.User.PushSubscription.optedIn;return console.log("Is still subscribed:",e),!e}catch(e){return console.error("Error unsubscribing from notifications:",e),!1}},E=async()=>{try{let e=await y.Z.Notifications.permission,r=await y.Z.User.PushSubscription.optedIn;return console.log("Permission:",e,"Push enabled:",r),e&&r?"granted":"denied"}catch(e){return console.error("Error getting notification status:",e),"denied"}},P=l.Ry({username:l.Z_().min(3,"Username must be at least 3 characters").max(20,"Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers and underscores"),phone_number:l.Z_().optional(),phone_public:l.O7().default(!1),notifications_enabled:l.O7().default(!1),speed:l.Rx().min(1).max(5),pace:l.Rx().min(1).max(5),power:l.Rx().min(1).max(5)});function S(){var e;let[r,t]=(0,a.useState)(!0),[l,m]=(0,a.useState)(null),[f,y]=(0,a.useState)(null),[S,I]=(0,a.useState)(null),[Z,k]=(0,a.useState)("default"),U=(0,o.createClientComponentClient)(),{toast:F}=(0,x.pm)(),{t:R}=(0,N.useLanguage)(),q=(0,i.cI)({resolver:(0,n.F)(P),defaultValues:{username:"",phone_number:"",phone_public:!1,notifications_enabled:!1,speed:3,pace:3,power:3}}),W=(q.watch("speed")+q.watch("pace")+q.watch("power"))/3;(0,a.useEffect)(()=>{let e=async()=>{try{let{data:{user:e}}=await U.auth.getUser();if(!e)return;let{data:r}=await U.from("profiles").select("*").eq("id",e.id).single(),t=await E();k(t);let{data:s}=await U.from("match_ratings").select("rating").eq("rated_player_id",e.id);if(r&&(m(r),q.reset({username:r.username||"",phone_number:r.phone_number||"",phone_public:r.phone_public||!1,notifications_enabled:"granted"===t,speed:r.speed||3,pace:r.pace||3,power:r.power||3}),s&&s.length>0)){let e=s.reduce((e,r)=>e+r.rating,0)/s.length;I(Number(e.toFixed(1)))}}catch(e){console.error("Error fetching profile:",e)}finally{t(!1)}};e()},[]);let J=async e=>{try{var r;let{data:{user:t}}=await U.auth.getUser();if(!t)return;let s=null===(r=e.name.split(".").pop())||void 0===r?void 0:r.toLowerCase();if(!s||!["jpg","jpeg","png","gif"].includes(s))throw Error("Invalid file type. Please upload a JPG, PNG, or GIF image.");let a=await (0,w.Z)(e,{maxSizeMB:1,maxWidthOrHeight:800,useWebWorker:!0}),i="".concat(t.id,".").concat(s);await U.storage.from("avatars").remove([i]);let{error:n}=await U.storage.from("avatars").upload(i,a,{upsert:!0,contentType:"image/".concat(s)});if(n)throw n;let{data:{publicUrl:o}}=U.storage.from("avatars").getPublicUrl(i);await U.from("profiles").update({avatar_url:o}).eq("id",t.id),m({...l,avatar_url:o}),F({title:"Success",description:"Profile picture updated"})}catch(e){console.error("Error uploading avatar:",e),F({title:"Error",description:e instanceof Error?e.message:"Failed to upload profile picture",variant:"destructive"})}},O=async e=>{try{let{data:{user:r}}=await U.auth.getUser();if(!r)return;let{data:t,error:s}=await U.from("profiles").select("id").eq("username",e.username).neq("id",r.id);if(s)throw s;if(t&&t.length>0){q.setError("username",{type:"manual",message:"Username is already taken"});return}let{error:a}=await U.from("profiles").update({username:e.username,phone_number:e.phone_number,phone_public:e.phone_public,speed:e.speed,pace:e.pace,power:e.power}).eq("id",r.id);if(a)throw a;F({title:"Success",description:"Profile updated successfully"})}catch(e){console.error("Error updating profile:",e),F({title:"Error",description:"Failed to update profile",variant:"destructive"})}};return r?(0,s.jsx)("div",{className:"p-4",children:"Loading..."}):(0,s.jsx)("div",{className:"p-4 space-y-6",children:(0,s.jsxs)(g.Zb,{children:[(0,s.jsx)(g.Ol,{children:(0,s.jsx)(g.ll,{children:R("profile.title")})}),(0,s.jsxs)(g.aY,{className:"space-y-6",children:[(0,s.jsx)("div",{className:"flex flex-col items-center",children:(0,s.jsxs)("div",{className:"relative group cursor-pointer",children:[(0,s.jsxs)(j.qE,{className:"h-24 w-24",children:[(0,s.jsx)(j.F$,{src:null==l?void 0:l.avatar_url}),(0,s.jsx)(j.Q5,{children:(null==l?void 0:null===(e=l.full_name)||void 0===e?void 0:e[0])||"?"})]}),(0,s.jsx)("div",{className:"absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity",children:(0,s.jsx)("label",{htmlFor:"avatar-upload",className:"text-xs text-white cursor-pointer",children:R("profile.changePhoto")})}),(0,s.jsx)("input",{id:"avatar-upload",type:"file",accept:"image/*",className:"hidden",onChange:e=>{var r;let t=null===(r=e.target.files)||void 0===r?void 0:r[0];t&&J(t)}})]})}),(0,s.jsxs)("div",{className:"space-y-1",children:[(0,s.jsx)("p",{className:"text-sm font-medium",children:R("profile.fullName")}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:(null==l?void 0:l.full_name)||R("profile.notSet")})]}),(0,s.jsx)(d.l0,{...q,children:(0,s.jsxs)("form",{onSubmit:q.handleSubmit(O),className:"space-y-6",children:[(0,s.jsx)(d.Wi,{control:q.control,name:"username",render:e=>{let{field:r}=e;return(0,s.jsxs)(d.xJ,{children:[(0,s.jsx)(d.lX,{children:R("profile.username")}),(0,s.jsx)(d.NI,{children:(0,s.jsx)(u.I,{placeholder:"Enter username",...r})}),(0,s.jsx)(d.zG,{})]})}}),(0,s.jsx)(d.Wi,{control:q.control,name:"phone_number",render:e=>{let{field:r}=e;return(0,s.jsxs)(d.xJ,{children:[(0,s.jsx)(d.lX,{children:R("profile.phoneNumber.label")}),(0,s.jsx)(d.NI,{children:(0,s.jsx)(u.I,{placeholder:R("profile.phoneNumber.placeholder"),...r})}),(0,s.jsx)(d.zG,{})]})}}),(0,s.jsx)(d.Wi,{control:q.control,name:"phone_public",render:e=>{let{field:r}=e;return(0,s.jsxs)(d.xJ,{className:"flex items-center justify-between rounded-lg border p-4",children:[(0,s.jsxs)("div",{className:"space-y-0.5",children:[(0,s.jsx)(d.lX,{className:"text-base",children:R("profile.sharePhone")}),(0,s.jsx)(d.pf,{children:R("profile.sharePhoneDesc")})]}),(0,s.jsx)(d.NI,{children:(0,s.jsx)(p.r,{checked:r.value,onCheckedChange:r.onChange})})]})}}),(0,s.jsx)(d.Wi,{control:q.control,name:"notifications_enabled",render:e=>{let{field:r}=e;return(0,s.jsxs)(d.xJ,{className:"flex flex-row items-center justify-between rounded-lg border p-4",children:[(0,s.jsxs)("div",{className:"space-y-0.5",children:[(0,s.jsx)(d.lX,{className:"text-base",children:"Push Notifications"}),(0,s.jsx)(d.pf,{children:"Receive notifications about new matches"})]}),(0,s.jsx)(d.NI,{children:(0,s.jsx)(p.r,{checked:r.value,onCheckedChange:async e=>{if(null==l?void 0:l.id)try{if(e){let e=await _();if(e){r.onChange(!0);let{error:e}=await U.from("profiles").update({notifications_enabled:!0}).eq("id",l.id);if(e)throw e;F({title:"Success",description:"Notifications enabled successfully"})}else F({title:"Notification Error",description:"Failed to enable notifications. Please check your browser settings and try again.",variant:"destructive"})}else{let e=await C();if(e){r.onChange(!1);let{error:e}=await U.from("profiles").update({notifications_enabled:!1}).eq("id",l.id);if(e)throw e;F({title:"Success",description:"Notifications disabled successfully"})}}}catch(e){console.error("Error updating notification settings:",e),F({title:"Error",description:"Failed to update notification settings",variant:"destructive"})}}})})]})}}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(b._,{children:R("profile.ratings.speed.value").replace("{value}",q.watch("speed").toString())}),(0,s.jsx)(d.Wi,{control:q.control,name:"speed",render:e=>{let{field:r}=e;return(0,s.jsx)(d.xJ,{children:(0,s.jsx)(d.NI,{children:(0,s.jsx)(h,{min:1,max:5,step:1,value:[r.value],onValueChange:e=>{let[t]=e;return r.onChange(t)}})})})}})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(b._,{children:R("profile.ratings.pace.value").replace("{value}",q.watch("pace").toString())}),(0,s.jsx)(d.Wi,{control:q.control,name:"pace",render:e=>{let{field:r}=e;return(0,s.jsx)(d.xJ,{children:(0,s.jsx)(d.NI,{children:(0,s.jsx)(h,{min:1,max:5,step:1,value:[r.value],onValueChange:e=>{let[t]=e;return r.onChange(t)}})})})}})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(b._,{children:R("profile.ratings.power.value").replace("{value}",q.watch("power").toString())}),(0,s.jsx)(d.Wi,{control:q.control,name:"power",render:e=>{let{field:r}=e;return(0,s.jsx)(d.xJ,{children:(0,s.jsx)(d.NI,{children:(0,s.jsx)(h,{min:1,max:5,step:1,value:[r.value],onValueChange:e=>{let[t]=e;return r.onChange(t)}})})})}})]}),(0,s.jsxs)("div",{className:"pt-2 border-t",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center",children:[(0,s.jsx)("p",{className:"font-medium",children:R("profile.selfRating")}),(0,s.jsx)("p",{className:"text-lg font-semibold",children:W.toFixed(1)})]}),S?(0,s.jsxs)("div",{className:"flex justify-between items-center mt-2",children:[(0,s.jsx)("p",{className:"font-medium",children:R("profile.communityRating")}),(0,s.jsxs)("div",{className:"text-right",children:[(0,s.jsx)(v.Z,{rating:S}),(0,s.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:R("profile.basedOnFeedback")})]})]}):(0,s.jsxs)("div",{className:"flex justify-between items-center mt-2",children:[(0,s.jsx)("p",{className:"font-medium",children:R("profile.communityRating")}),(0,s.jsx)("p",{className:"text-sm text-muted-foreground",children:R("profile.noRatingsYet")})]})]})]}),(0,s.jsx)(c.z,{type:"submit",className:"w-full",children:R("profile.updateProfile")})]})})]})]})})}},7309:function(e,r,t){"use strict";t.d(r,{F$:function(){return o},Q5:function(){return c},qE:function(){return l}});var s=t(7437),a=t(2265),i=t(6694),n=t(9311);let l=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)(i.fC,{ref:r,className:(0,n.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",t),...a})});l.displayName=i.fC.displayName;let o=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)(i.Ee,{ref:r,className:(0,n.cn)("aspect-square h-full w-full",t),...a})});o.displayName=i.Ee.displayName;let c=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)(i.NY,{ref:r,className:(0,n.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted",t),...a})});c.displayName=i.NY.displayName},9126:function(e,r,t){"use strict";t.d(r,{Z:function(){return i}});var s=t(7437),a=t(5340);function i(e){let{rating:r,showValue:t=!0,size:i="md"}=e,n={sm:"h-4 w-4",md:"h-5 w-5",lg:"h-6 w-6"};return(0,s.jsxs)("div",{className:"flex items-center gap-1",children:[[1,2,3,4,5].map(e=>(0,s.jsx)(a.Z,{className:"".concat(n[i]," ").concat(e<=r?"fill-primary text-primary":"text-muted-foreground")},e)),t&&(0,s.jsxs)("span",{className:"ml-2 text-sm text-muted-foreground",children:["(",r,")"]})]})}}},function(e){e.O(0,[952,933,573,258,971,864,744],function(){return e(e.s=7804)}),_N_E=e.O()}]);