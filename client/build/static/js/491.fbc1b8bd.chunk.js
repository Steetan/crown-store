"use strict";(self.webpackChunkcrown_store=self.webpackChunkcrown_store||[]).push([[491],{9491:(t,s,e)=>{e.r(s),e.d(s,{default:()=>j});var a=e(2791),c=(e(1201),e(7689)),n=e(1087),r=e(4420),i=e(1933),l=e(5027),o=e(4032);const d=e.p+"static/media/cart-b.e3df211bdbfac971edc551ca665118b6.svg";const h=e.p+"static/media/trash.eb37d9f40a59bcd016679737a3847891.svg";var u=e(1013),m=e(5038),x=e(184);const j=()=>{const{totalPrice:t,cartItems:s}=(0,r.v9)(i.KY),{totalCount:e}=(0,r.v9)((t=>t.cartSlice)),j=(0,r.v9)(m.Jt),b=(0,l.T)(),p=async()=>{let t=0;b((0,i.dv)()).then((s=>{b((0,i.eh)(s.payload.results.length)),s.payload.results.forEach((s=>{t+=s.product_price*s.totalcount})),b((0,i.m1)(t))}))};if(a.useEffect((()=>{p()}),[]),!j)return(0,x.jsx)(c.Fg,{to:"/auth/login"});if(!s.length)return(0,x.jsx)(u.uZ,{});return(0,x.jsx)("div",{className:"container container--cart",children:(0,x.jsxs)("div",{className:"cart",children:[(0,x.jsxs)("div",{className:"cart__top",children:[(0,x.jsxs)("h2",{className:"content__title",children:[(0,x.jsx)("img",{style:{width:30,marginRight:10},src:d,alt:"cart"}),"\u041a\u043e\u0440\u0437\u0438\u043d\u0430"]}),(0,x.jsxs)("button",{onClick:async()=>{window.confirm("\u0412\u044b \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u043e\u0447\u0438\u0441\u0442\u0438\u0442\u044c \u043a\u043e\u0440\u0437\u0438\u043d\u0443?")&&(await o.Z.delete("/cart/delete"),await p())},className:"cart__clear",children:[(0,x.jsx)("img",{src:h,alt:""}),(0,x.jsx)("span",{children:"\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c \u043a\u043e\u0440\u0437\u0438\u043d\u0443"})]})]}),(0,x.jsx)("div",{className:"content__items content__items--cart",children:s.map((t=>(0,x.jsx)(u.bE,{id:t.product_id,totalcount:t.totalcount,title:t.product_title,imgurl:t.product_img},t.id)))}),(0,x.jsxs)("div",{className:"cart__bottom",children:[(0,x.jsxs)("div",{className:"cart__bottom-details",children:[(0,x.jsxs)("span",{children:[" ","\u0412\u0441\u0435\u0433\u043e: ",(0,x.jsxs)("b",{children:[e," \u0448\u0442."]})," "]}),(0,x.jsxs)("span",{children:[" ","\u0421\u0443\u043c\u043c\u0430 \u0437\u0430\u043a\u0430\u0437\u0430: ",(0,x.jsxs)("b",{children:[t," \u20bd"]})," "]})]}),(0,x.jsxs)("div",{className:"cart__bottom-buttons",children:[(0,x.jsxs)(n.rU,{to:"/",className:"button button--outline button--add go-back-btn",children:[(0,x.jsx)("svg",{width:"8",height:"14",viewBox:"0 0 8 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,x.jsx)("path",{d:"M7 13L1 6.93015L6.86175 1",stroke:"#D3D3D3",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),(0,x.jsx)("span",{children:"\u0412\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043d\u0430\u0437\u0430\u0434"})]}),(0,x.jsx)(n.rU,{to:"/resultbuy",className:"button pay-btn",onClick:async()=>{await o.Z.post("/email"),await o.Z.delete("/cart/delete"),await p()},children:(0,x.jsx)("span",{children:"\u041e\u043f\u043b\u0430\u0442\u0438\u0442\u044c \u0441\u0435\u0439\u0447\u0430\u0441"})})]})]})]})})}}}]);
//# sourceMappingURL=491.fbc1b8bd.chunk.js.map