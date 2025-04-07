(function() {
    const CHAT_STORAGE_KEY = 'chat_history';
    const CHAT_EXPIRATION_KEY = 'chat_expiration';
    const CONVERSATION_ID_KEY = 'chat_conversation_id';

    const chatRoot = document.createElement('div');
    chatRoot.id = 'chat-root';
    const shadow = chatRoot.attachShadow({ mode: 'closed' });

    const styles = document.createElement('style');
    styles.textContent = `
       a,hr{color:inherit}progress,sub,sup{vertical-align:baseline}blockquote,body,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,menu,ol,p,pre,ul{margin:0}fieldset,legend,menu,ol,ul{padding:0}.text-\\[\\#030712\\],.text-black,.text-gray-400,.text-gray-500,.text-gray-700,.text-gray-800{--tw-text-opacity:1}#custom-chat-widget{position:fixed;bottom:20px;right:20px;z-index:9999}.chat-container{transition:.5s ease-in-out;transform:translateX(100%)}.chat-container.open{transform:translateX(0)}@keyframes blink{50%{fill:transparent}}.typing-indicator{background-color:transparent;padding:12px 16px;display:inline-flex;align-items:center;border-radius:20px}.typing-indicator span{width:5px;height:5px;margin:0 2px;background-color:#90909090;border-radius:50%;display:inline-block;animation:1.4s ease-in-out infinite typing}.typing-indicator span:first-child{animation-delay:.2s}.typing-indicator span:nth-child(2){animation-delay:.3s}.typing-indicator span:nth-child(3){animation-delay:.4s}@keyframes typing{0%,44%{transform:translateY(0);background-color:#90909090}28%{transform:translateY(-7px);background-color:#666}}.chat-message{opacity:0;transform:translateY(20px);animation:.3s forwards messageAppear}@keyframes messageAppear{to{opacity:1;transform:translateY(0)}}.messages-container{margin-top:5px;padding-bottom:10px;height:calc(100% - 10px);overflow-y:auto}@media (max-width:500px){.messages-container{margin-top:35px}}.input-container{position:absolute;bottom:0;left:0;right:0;background:#fff;padding:10px;border-top:1px solid #e5e7eb;border-radius:0 0 .375rem .375rem}.product-grid{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:10px auto}.product-card{transform:scale(.9);display:flex;flex-direction:column;align-items:center;text-align:center;border:1px solid #e5e7eb;border-radius:12px;padding:12px;transition:box-shadow .3s;background-color:#fff;text-decoration:none}.hover\\:scale-105:hover,.hover\\:scale-90:hover,.transform,.translate-x-0,.translate-x-\\[120\\%\\]{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.product-card:hover{box-shadow:0 6px 18px rgba(0,0,0,.1)}.product-image{width:96px;height:96px;object-fit:cover;border-radius:8px;margin-bottom:12px;transition:transform .3s}.transition,.transition-all,.transition-colors,.transition-transform{transition-duration:150ms}.ease-in-out,.transition,.transition-all,.transition-colors,.transition-transform{transition-timing-function:cubic-bezier(0.4,0,0.2,1)}.product-card:hover .product-image{transform:scale(1.05)}.product-info{display:flex;flex-direction:column;align-items:center}.product-title{font-size:10px;font-weight:600;color:#1f2937;margin-bottom:4px}.product-price{font-size:13px;font-weight:500;color:#10b981;margin-bottom:6px}.product-link{font-size:12px;color:#2563eb;text-decoration:underline}.current-price{font-size:13px;font-weight:600;color:#10b981;margin-right:4px}.discount-badge{background-color:#000;color:#fff;font-size:11px;font-weight:600;padding:2px 6px;border-radius:6px}*,::after,::before{box-sizing:border-box;border:0 solid #e5e7eb;--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.border-t,hr{border-top-width:1px}::after,::before{--tw-content:''}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{line-height:inherit}hr{height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}.hover\\:shadow-xl:hover,.shadow-2xl,.shadow-\\[0_8px_30px_rgb\\(0\\2c 0\\2c 0\\2c 0\\.12\\)\\],.shadow-lg,.shadow-sm{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}menu,ol,ul{list-style:none}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}.hidden,[hidden]{display:none}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{inset:0px}.bottom-10{bottom:2.5rem}.bottom-4{bottom:1rem}.right-0{right:0}.right-4{right:1rem}.top-0{top:0}.z-10{z-index:10}.mx-auto{margin-left:auto;margin-right:auto}.mb-2{margin-bottom:.5rem}.me-4{margin-inline-end:1rem}.mr-3{margin-right:.75rem}.ms-auto{margin-inline-start:auto}.mt-1{margin-top:.25rem}.mt-1\\.5{margin-top:.375rem}.mt-2{margin-top:.5rem}.mt-2\\.5{margin-top:.625rem}.mt-4{margin-top:1rem}.mt-auto{margin-top:auto}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.inline-flex{display:inline-flex}.h-10{height:2.5rem}.h-5{height:1.25rem}.h-\\[89vh\\]{height:89vh}.h-12{height:3rem}.h-4{height:1rem}.h-6{height:1.5rem}.h-8{height:2rem}.w-10{width:2.5rem}.w-11\\/12{width:91.666667%}.w-14{width:3.5rem}.w-3{width:.75rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-full{width:100%}.w-12{width:3rem}.w-4{width:1rem}.w-8{width:2rem}.max-w-\\[80\\%\\]{max-width:80%}.max-w-\\[85\\%\\]{max-width:85%}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.grow{flex-grow:1}.translate-x-0{--tw-translate-x:0px}.translate-x-\\[120\\%\\]{--tw-translate-x:120%}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-x-1{-moz-column-gap:0.25rem;column-gap:.25rem}.gap-x-2{-moz-column-gap:0.5rem;column-gap:.5rem}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-1>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.25rem * var(--tw-space-y-reverse))}.space-y-1\\.5>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.375rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.375rem * var(--tw-space-y-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.75rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.75rem * var(--tw-space-y-reverse))}.space-x-1>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(.25rem * var(--tw-space-x-reverse));margin-left:calc(.25rem * calc(1 - var(--tw-space-x-reverse)))}.space-x-3>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(.75rem * var(--tw-space-x-reverse));margin-left:calc(.75rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem * var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.space-x-4>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(1rem * var(--tw-space-x-reverse));margin-left:calc(1rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}.overflow-y-auto{overflow-y:auto}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-md{border-radius:.375rem}.rounded-xl{border-radius:.75rem}.rounded-3xl{border-radius:1.5rem}.rounded-b-lg{border-bottom-right-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.rounded-t-2xl{border-top-left-radius:1rem;border-top-right-radius:1rem}.rounded-t-3xl{border-top-left-radius:1.5rem;border-top-right-radius:1.5rem}.rounded-tl-none{border-top-left-radius:0}.rounded-tr-none{border-top-right-radius:0}.border{border-width:1px}.border-black\\/30,.focus\\:border-black\\/30:focus{border-color:rgb(0 0 0 / .3)}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity))}.border-white,.focus\\:border-white:focus{--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}.border-white\\/70{border-color:rgb(255 255 255 / .7)}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity))}.border-black\\/10{border-color:rgb(0 0 0 / .1)}.bg-black{--tw-bg-opacity:1;background-color:rgb(0 0 0 / var(--tw-bg-opacity))}.bg-gray-100,.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.bg-gray-600{--tw-bg-opacity:1;background-color:rgb(75 85 99 / var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}.bg-indigo-600{--tw-bg-opacity:1;background-color:rgb(79 70 229 / var(--tw-bg-opacity))}.bg-white\\/20{background-color:rgb(255 255 255 / .2)}.bg-black\\/5,.hover\\:bg-black\\/5:hover{background-color:rgb(0 0 0 / .05)}.bg-white\\/10,.hover\\:bg-white\\/10:hover{background-color:rgb(255 255 255 / .1)}.bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}.from-indigo-600{--tw-gradient-from:#4f46e5 var(--tw-gradient-from-position);--tw-gradient-to:rgb(79 70 229 / 0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}.to-violet-600{--tw-gradient-to:#7c3aed var(--tw-gradient-to-position)}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-2\\.5{padding:.625rem}.p-6{padding:1.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.pb-2{padding-bottom:.5rem}.text-left{text-align:left}.text-end{text-align:end}.text-\\[11px\\]{font-size:11px}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.leading-3{line-height:.75rem}.leading-none{line-height:1}.leading-relaxed{line-height:1.625}.tracking-tight{letter-spacing:-.025em}.tracking-wide{letter-spacing:.025em}.text-\\[\\#030712\\]{color:rgb(3 7 18 / var(--tw-text-opacity))}.text-black{color:rgb(0 0 0 / var(--tw-text-opacity))}.text-gray-500{color:rgb(107 114 128 / var(--tw-text-opacity))}.text-gray-700{color:rgb(55 65 81 / var(--tw-text-opacity))}.text-gray-800{color:rgb(31 41 55 / var(--tw-text-opacity))}.hover\\:text-white:hover,.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.text-gray-400{color:rgb(156 163 175 / var(--tw-text-opacity))}.text-white\\/80{color:rgb(255 255 255 / .8)}.text-black\\/30{color:rgb(0 0 0 / .3)}.text-black\\/40{color:rgb(0 0 0 / .4)}.text-black\\/70{color:rgb(0 0 0 / .7)}.text-black\\/80{color:rgb(0 0 0 / .8)}.text-white\\/60{color:rgb(255 255 255 / .6)}.placeholder-\\[\\#6b7280\\]::-moz-placeholder{--tw-placeholder-opacity:1;color:rgb(107 114 128 / var(--tw-placeholder-opacity))}.placeholder-\\[\\#6b7280\\]::placeholder{--tw-placeholder-opacity:1;color:rgb(107 114 128 / var(--tw-placeholder-opacity))}.placeholder-black\\/40::-moz-placeholder{color:rgb(0 0 0 / .4)}.placeholder-black\\/40::placeholder{color:rgb(0 0 0 / .4)}.opacity-10{opacity:.1}.shadow-lg{--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1),0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-2xl{--tw-shadow:0 25px 50px -12px rgb(0 0 0 / 0.25);--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color)}.shadow-\\[0_8px_30px_rgb\\(0\\2c 0\\2c 0\\2c 0\\.12\\)\\]{--tw-shadow:0 8px 30px rgb(0,0,0,0.12);--tw-shadow-colored:0 8px 30px var(--tw-shadow-color)}.backdrop-blur-sm{--tw-backdrop-blur:blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter}.transition-all{transition-property:all}.transition-transform{transition-property:transform}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke}.duration-300{transition-duration:.3s}.duration-500{transition-duration:.5s}.hover\\:scale-105:hover{--tw-scale-x:1.05;--tw-scale-y:1.05}.hover\\:scale-90:hover{--tw-scale-x:.9;--tw-scale-y:.9}.hover\\:border-black\\/20:hover{border-color:rgb(0 0 0 / .2)}.hover\\:bg-gray-200:hover{--tw-bg-opacity:1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.hover\\:bg-indigo-700:hover{--tw-bg-opacity:1;background-color:rgb(67 56 202 / var(--tw-bg-opacity))}.hover\\:bg-black\\/90:hover{background-color:rgb(0 0 0 / .9)}.hover\\:bg-white\\/5:hover{background-color:rgb(255 255 255 / .05)}.hover\\:shadow-xl:hover{--tw-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1),0 8px 10px -6px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color)}.focus\\:ring-0:focus,.focus\\:ring-1:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus\\:border-indigo-500:focus{--tw-border-opacity:1;border-color:rgb(99 102 241 / var(--tw-border-opacity))}.focus\\:outline-none:focus{outline:transparent solid 2px;outline-offset:2px}.focus\\:ring-0:focus{--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.focus\\:ring-1:focus{--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)}.focus\\:ring-indigo-500:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(99 102 241 / var(--tw-ring-opacity))}.focus\\:ring-black\\/30:focus{--tw-ring-color:rgb(0 0 0 / 0.3)}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}@media (prefers-color-scheme:dark){.dark\\:text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}}@media (min-width:768px){.md\\:right-4{right:1rem}.md\\:w-\\[440px\\]{width:440px}.md\\:text-sm{font-size:.875rem;line-height:1.25rem}}@media (min-width:1280px){.xl\\:h-\\[73vh\\]{height:73vh}}@media (min-width:2036px){.\\33xl\\:h-\\[64vh\\]{height:64vh}.\\33xl\\:w-\\[600px\\]{width:600px}}
    `;
    shadow.appendChild(styles);

    const chatContainer = document.createElement('div');
    chatContainer.id = 'custom-chat-widget';
    shadow.appendChild(chatContainer);

    const protectedChat = {
        initialize() {
            this.manageConversationId();
            this.checkAndClearExpiredChat();
            const questions = window.predefinedQuestions?.slice(0, 2); // Limit 2 questions
            const predefinedQuestionsHTML = questions?.map(question => `
               <button class="block text-left border border-black/30 bg-gray-100 text-gray-700 text-sm rounded-xl py-2 px-3 hover:bg-gray-200 duration-300 focus:outline-none mb-2">
                   ${question}
               </button>
           `).join('') || '';
            chatContainer.innerHTML = `
            <button id="chat-toggle-button"
                class="fixed border border-white/70 bottom-10 right-4 bg-black text-white rounded-full p-2 shadow-lg hover:scale-105 transition-transform duration-300">
                <video autoplay loop muted playsinline class="w-14">
                    <source src="https://talkly.chat/img/icons/ai_icon.webm" type="video/webm">
                </video>
            </button>
            <div id="mainChatContainer"
                class="hidden transition-all duration-500 ease-in-out transform translate-x-[120%] flex flex-col w-full md:w-[440px] 3xl:w-[600px] h-[89vh] xl:h-[73vh] 3xl:h-[64vh] fixed bottom-4 right-0 md:right-4 border rounded-md rounded-t-3xl  bg-white">
                <!-- Header -->
                <div class="bg-black rounded-t-3xl py-4 px-6 relative">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div>
                                <h2 class="font-bold text-white text-lg">${window.chatbotName || 'AI'}</h2>
                                <p class="text-white/60 text-xs tracking-wide">powered by talkly.chat</p>
                            </div>
                        </div>
                    <div class="flex items-center space-x-1">
                        <button class="clearChatStorage p-2 hover:bg-white/5 rounded-full transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5 text-white/60 hover:text-white transition-colors duration-300"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </button>
                        <button class="closeChat p-2 hover:bg-white/5 rounded-full transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5 text-white/60 hover:text-white transition-colors duration-300"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

                <!-- Messages Container with fixed height -->
                <div id="messagesContainer" class="messages-container"></div>

                <div class="mt-auto">
                    <!-- Predefined Questions -->
                    <div id="predefined-questions" class="px-4 py-2 bg-white">
                        ${predefinedQuestionsHTML}
                    </div>

                    <!-- Input Container -->
                    <div class="px-4 py-2 bg-white border-t rounded-b-lg">
                        <form id="chatForm" class="flex items-center justify-center w-full space-x-2">
                            <input
                                class="flex h-10 w-full rounded-md border border-white focus:ring-0 focus:outline-none focus:border-white px-3 py-2 text-base md:text-sm placeholder-[#6b7280] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712]"
                                placeholder="Wiadomość..."
                                minlength="3"
                                maxlength="450"
                                value="">
                            <button type="submit" class="w-6">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="size-6 text-black">
                                    <path
                                        d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                </div>

            </div>
            `;
            this.setupEventListeners();
            this.loadChatHistory();
        },

        checkAndClearExpiredChat() {
            const expirationTimeStr = localStorage.getItem(CHAT_EXPIRATION_KEY);

            if (!expirationTimeStr) {
                localStorage.removeItem(CHAT_STORAGE_KEY);
                localStorage.removeItem(CHAT_EXPIRATION_KEY);
                return true;
            }

            const expirationTime = new Date(expirationTimeStr).getTime();
            const now = new Date().getTime();

            if (now >= expirationTime) {
                localStorage.removeItem(CHAT_STORAGE_KEY);
                localStorage.removeItem(CHAT_EXPIRATION_KEY);
                return true;
            }

            return false;
        },


        formatAIMessageContent(content) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;

            function replaceBold(text) {
                return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            }

            function replaceUrlsWithLinks(text) {
                return text.replace(urlRegex, (url) => {
                    const cleanUrl = url
                        .replace(/^[[(]+/, '')
                        .replace(/[.,;:)\]]+$/, '');
                    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 500;">${cleanUrl}</a>`;
                });
            }

            function generateProductHTML(products) {
                if (!products.length) return '';

                let productHTML = '<div class="product-grid">';
                products.forEach(product => {
                    let priceHtml = '';
                    if (product.price) {
                        priceHtml = `<span class="current-price">${product.price}</span>`;
                        if (product.discount && product.discount !== '-' && !/^\s*-?\s*$/.test(product.discount)) {
                            priceHtml += ` <span class="discount-badge">${product.discount}</span>`;
                        }
                        priceHtml = `<p class="product-price">${priceHtml}</p>`;
                    }

                    productHTML += `
                <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="product-card">
                    <img src="${product.image}" alt="" class="product-image" />
                    <div class="product-info">
                        ${priceHtml}
                    </div>
                </a>
                `;
                });
                productHTML += '</div>';
                return productHTML;
            }

            const productBlockRegex = /\{PRODUCT\}\s*([\s\S]*?)\s*\{\/PRODUCT\}/g;

            let placeholderIndex = 0;
            const productPlaceholders = [];

            let contentWithPlaceholders = content.replace(productBlockRegex, (match, block) => {
                const productItems = [...block.matchAll(
                    /cena\s*=\s*(.*?)\s*\r?\n\s*(?:rabat\s*=\s*(.*?)\s*\r?\n\s*)?link\s*=\s*(.*?)\s*\r?\n\s*obrazek\s*=\s*(.*?)(?=\r?\n?cena=|\{\/PRODUCT\}|$)/gs
                )];

                const products = [];
                productItems.forEach(item => {
                    const price = item[1].trim();
                    const discount = item[2] ? item[2].trim() : null;
                    const link = item[3].trim();
                    const image = item[4].trim();

                    const isValidUrl = (url) => url && !url.includes('[') && !url.includes(']');
                    if (isValidUrl(link) && isValidUrl(image)) {
                        products.push({ price, discount, link, image });
                    }
                });

                const placeholder = `__PRODUCT_PLACEHOLDER_${placeholderIndex}__`;
                productPlaceholders.push(generateProductHTML(products));
                placeholderIndex++;

                return placeholder;
            });

            // Zamieniamy **...** na <strong>...</strong>
            contentWithPlaceholders = replaceBold(contentWithPlaceholders);

            let formattedText = contentWithPlaceholders
                .trim()
                .split(/\n\s*\n/)
                .map(paragraph => {
                    const trimmed = paragraph.trim();

                    if (!trimmed) return null;

                    if (trimmed.match(/__PRODUCT_PLACEHOLDER_\d+__/)) {
                        return trimmed;
                    }

                    return `<p style="font-size: 14px; line-height: 25px;">${trimmed.replace(/\n/g, '<br>')}</p>`;
                })
                .filter(Boolean)
                .join('\n');

            formattedText = replaceUrlsWithLinks(formattedText);

            for (let i = 0; i < productPlaceholders.length; i++) {
                const placeholder = `__PRODUCT_PLACEHOLDER_${i}__`;

                if (formattedText.includes(`<p style="font-size: 14px; line-height: 25px;">${placeholder}</p>`)) {
                    formattedText = formattedText.replace(
                        `<p style="font-size: 14px;">${placeholder}</p>`,
                        productPlaceholders[i]
                    );
                } else {
                    formattedText = formattedText.replace(
                        placeholder,
                        productPlaceholders[i]
                    );
                }
            }

            return formattedText;
        },


        appendMessage(sender, message, type = 'user', isPlaceholder = false, timestamp = null) {
            const isAI = sender === 'AI' || sender === (window.chatbotName || 'AI');
            const messagesContainer = shadow.getElementById('messagesContainer');
            if (!messagesContainer) return;

            const messageDiv = document.createElement('div');

            if (isAI) {
                // Wiadomość AI (lewa strona)
                messageDiv.className = 'w-11/12 mx-auto flex gap-x-2 mt-4 chat-message';
                messageDiv.innerHTML = `
                <img class="inline-block w-10 h-10 rounded-full"
                    src="https://savicki.pl/img/groups_icons/whitesapphire.webp"
                    alt="Avatar">
                <div>
                    <div class="bg-white ${isPlaceholder ? 'mt-1' : 'border border-gray-200 space-y-3 p-3'} rounded-2xl">
                        <p class="leading-relaxed text-sm text-gray-800" style="line-height: 25px;">${message}</p>
                    </div>
                    ${!isPlaceholder ? `
                    <span class="mt-1.5 flex items-center gap-x-1 text-xs text-gray-500">
                        <svg class="shrink-0 w-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 7 17l-5-5"></path>
                            <path d="m22 10-7.5 7.5L13 16"></path>
                        </svg>
                        <span style="font-size: 10px" class="mt-1 messageTimeSpan">${timestamp || this.getCurrentTime()}</span>
                    </span>
                    ` : ''}
                </div>
                `;
            } else {
                // Wiadomość użytkownika (prawa strona)
                messageDiv.className = 'flex w-11/12 mx-auto gap-x-2 me-4 mt-4 chat-message';
                messageDiv.innerHTML = `
            <div class="grow text-end space-y-3">
                <div class="inline-flex flex-col justify-end">
                    <div class="inline-block bg-black rounded-2xl p-3 shadow-sm">
                        <p class="text-sm text-white text-left" style="white-space: pre-wrap;">${message}</p>
                    </div>
                    <span class="mt-1.5 ms-auto flex items-center gap-x-1 text-xs text-gray-500">
                        <svg class="shrink-0 w-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 7 17l-5-5"></path>
                            <path d="m22 10-7.5 7.5L13 16"></path>
                        </svg>
                        <span style="font-size: 10px" class="mt-1 messageTimeSpan">${timestamp || this.getCurrentTime()}</span>
                    </span>
                </div>
            </div>
            <span class="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600">
                <span class="text-sm font-medium text-white leading-none">Ty</span>
            </span>
        `;
            }

            if (isPlaceholder) {
                messageDiv.setAttribute('data-placeholder', 'true');
            }

            messagesContainer.appendChild(messageDiv);
            this.scrollToBottom();
            return messageDiv;
        },

        scrollToBottom() {
            const messagesContainer = shadow.getElementById('messagesContainer');
            if (messagesContainer) {
                messagesContainer.scrollTo({
                    top: messagesContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        },

        getCurrentTime() {
            return new Intl.DateTimeFormat(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(new Date());
        },

        saveMessageToLocalStorage(sender, message) {
            const chatHistory = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)) || [];
            const timestamp = this.getCurrentTime();
            chatHistory.push({ sender, message, timestamp });
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));

            const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
            localStorage.setItem(CHAT_EXPIRATION_KEY, twoHoursLater);
        },

        loadChatHistory() {
            // Check history expired
            if (this.checkAndClearExpiredChat()) {
                this.addWelcomeMessage();
                return;
            }

            const chatHistory = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY));
            const predefinedQuestions = shadow.getElementById('predefined-questions');

            if (!chatHistory) {
                this.addWelcomeMessage();
                return;
            }

            const urlRegex = /(https?:\/\/[^\s]+)/g;

            chatHistory.forEach(({ sender, message, timestamp }) => {
                const formattedMessage = sender === 'AI' || sender === (window.chatbotName || 'AI')
                    ? this.formatAIMessageContent(message)
                    : message;

                this.appendMessage(sender, formattedMessage, sender === 'AI' ? 'ai' : 'user', false, timestamp);
            });

            if (predefinedQuestions && chatHistory.length > 0) {
                predefinedQuestions.style.display = 'none';
            }

            this.scrollToBottom();
        },

        addWelcomeMessage() {
            const defaultWelcome = "Witaj! Jak mogę Ci pomóc?";
            const chatbotName = window.chatbotName || "AI";
            const messagesContainer = shadow.getElementById('messagesContainer');

            if (messagesContainer && !localStorage.getItem(CHAT_STORAGE_KEY)) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'w-11/12 mx-auto flex gap-x-2 mt-4 pb-2 chat-message';
                messageDiv.innerHTML = `
                <img class="inline-block w-10 h-10 rounded-full"
                    src="https://savicki.pl/img/groups_icons/whitesapphire.webp"
                    alt="Avatar">
                <div>
                    <div class="bg-white border border-gray-200 rounded-2xl p-3 space-y-3">
                        <p class="leading-relaxed text-sm text-gray-800">${window.welcomeMessage || defaultWelcome}</p>
                    </div>
                </div>
        `;
                messagesContainer.appendChild(messageDiv);
            }
        },

        clearChatStorage(event) {
            event.preventDefault();
            event.stopPropagation();
            localStorage.removeItem(CHAT_STORAGE_KEY);
            localStorage.removeItem(CHAT_EXPIRATION_KEY);
            localStorage.removeItem(CONVERSATION_ID_KEY);
            const newConversationId = this.generateConversationId();
            localStorage.setItem(CONVERSATION_ID_KEY, newConversationId);

            const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
            localStorage.setItem(CHAT_EXPIRATION_KEY, twoHoursLater);

            const messagesContainer = shadow.getElementById('messagesContainer');
            const predefinedQuestions = shadow.getElementById('predefined-questions');

            messagesContainer.innerHTML = '';
            if (predefinedQuestions) {
                predefinedQuestions.style.display = 'block';
            }

            this.addWelcomeMessage();
        },

        toggleChat(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            const chatContainer = shadow.getElementById('mainChatContainer');
            if (!chatContainer) return;

            chatContainer.classList.remove('hidden');

            if (chatContainer.classList.contains('translate-x-[120%]')) {
                chatContainer.classList.remove('translate-x-[120%]');
                chatContainer.classList.add('translate-x-0');
                setTimeout(() => {
                    this.scrollToBottom();
                }, 1);
            } else {
                chatContainer.classList.add('translate-x-[120%]');
                chatContainer.classList.remove('translate-x-0');
            }
        },

        generateConversationId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        manageConversationId() {
            const currentId = localStorage.getItem(CONVERSATION_ID_KEY);
            const expirationTime = localStorage.getItem(CHAT_EXPIRATION_KEY);

            // 2h
            if (!currentId || !expirationTime || (new Date() - new Date(expirationTime)) > 2 * 60 * 60 * 1000) {
                const newId = this.generateConversationId();
                localStorage.setItem(CONVERSATION_ID_KEY, newId);

                const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
                localStorage.setItem(CHAT_EXPIRATION_KEY, twoHoursLater);

                return newId;
            }

            return currentId;
        },

        setupEventListeners() {
            const form = shadow.getElementById('chatForm');
            const input = form?.querySelector('input');
            const sendButton = form?.querySelector('button');
            const toggleButton = shadow.getElementById('chat-toggle-button');
            const clearButton = shadow.querySelector('.clearChatStorage');
            const closeButton = shadow.querySelector('.closeChat');
            const predefinedQuestions = shadow.getElementById('predefined-questions');

            if (predefinedQuestions) {
                predefinedQuestions.querySelectorAll('button').forEach(button => {
                    button.addEventListener('click', () => {
                        const form = shadow.getElementById('chatForm');
                        const input = form?.querySelector('input');
                        if (input && form) {
                            input.value = button.dataset.value || button.textContent.trim();
                            predefinedQuestions.style.display = 'none';
                            form.dispatchEvent(new Event('submit'));
                        }
                    });
                });
            }

            if (form && input && sendButton) {
                form.onsubmit = async (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const userMessage = input.value.trim();
                    if (!userMessage) return;

                    sendButton.disabled = true;
                    sendButton.style.opacity = "0.5";

                    this.appendMessage('Ty', userMessage, 'user');
                    this.saveMessageToLocalStorage('Ty', userMessage);
                    shadow.getElementById('predefined-questions').style.display = 'none';
                    input.value = '';

                    const typingPlaceholder = this.appendMessage(
                        window.chatbotName || 'AI',
                        `<div class="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>`,
                        'ai',
                        true
                    );

                    try {
                        const response = await fetch("https://talkly.chat/api/chatbot/get-answer/savicki", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-API-KEY": window.apiToken || "",
                                "X-Conversation-ID": localStorage.getItem(CONVERSATION_ID_KEY) || this.generateConversationId(),
                            },
                            body: JSON.stringify({ question: userMessage }),
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            let errorMessage = "Wystąpił nieoczekiwany błąd.";

                            switch (response.status) {
                                case 422:
                                    errorMessage = data.errors?.question?.[0] || data.message || "Błąd walidacji.";
                                    break;
                                case 429:
                                    errorMessage = data.message || "Zbyt wiele zapytań. Spróbuj ponownie później.";
                                    break;
                                default:
                                    errorMessage = data.message || `Niestety wystąpił błąd: ${response.statusText}`;
                            }
                            throw new Error(errorMessage);
                        }

                        if (typingPlaceholder) {
                            typingPlaceholder.remove();
                        }

                        const messageDiv = this.appendMessage(
                            window.chatbotName || "AI",
                            "",
                            "ai",
                            false
                        );
                        const messageElement = messageDiv.querySelector("p");

                        let currentText = "";
                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        let isInsideProductBlock = false;
                        let productContent = "";
                        let textBeforeProduct = "";


                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value);
                            currentText += chunk;

                            const segments = [];
                            let position = 0;
                            let searchStartPos = 0;

                            while (searchStartPos < currentText.length) {
                                const productStartIndex = currentText.indexOf("{PRODUCT}", searchStartPos);

                                if (productStartIndex === -1) {
                                    if (searchStartPos < currentText.length) {
                                        segments.push({
                                            type: 'text',
                                            content: currentText.substring(searchStartPos)
                                        });
                                    }
                                    break;
                                }

                                if (productStartIndex > searchStartPos) {
                                    segments.push({
                                        type: 'text',
                                        content: currentText.substring(searchStartPos, productStartIndex)
                                    });
                                }

                                const productEndIndex = currentText.indexOf("{/PRODUCT}", productStartIndex);

                                if (productEndIndex !== -1) {
                                    segments.push({
                                        type: 'product',
                                        content: currentText.substring(productStartIndex, productEndIndex + "{/PRODUCT}".length),
                                        isComplete: true
                                    });
                                    searchStartPos = productEndIndex + "{/PRODUCT}".length;
                                } else {
                                    segments.push({
                                        type: 'product',
                                        content: currentText.substring(productStartIndex),
                                        isComplete: false
                                    });
                                    searchStartPos = currentText.length;
                                }
                            }

                            let displayHtml = '';
                            for (const segment of segments) {
                                if (segment.type === 'text') {
                                    displayHtml += segment.content;
                                } else if (segment.type === 'product') {
                                    if (segment.isComplete) {
                                        displayHtml += segment.content;
                                    } else {
                                        // Incomplete product block - show loader
                                        displayHtml += `<div class="product-loading">
                                        <p class="text-gray-500 flex items-center">
                                            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Ładowanie produktów...
                                        </p>
                                    </div>`;
                                        // Hide the incomplete product block text without losing it for next iteration
                                        // We add it as hidden content that won't be displayed to users
                                        displayHtml += `<div style="display:none;">{PRODUCT_PLACEHOLDER}</div>`;
                                    }
                                }
                            }

                            // Apply the final formatting and update the UI
                            messageElement.innerHTML = protectedChat.formatAIMessageContent(displayHtml);
                            protectedChat.scrollToBottom();
                        }



                        sendButton.disabled = false;
                        sendButton.style.opacity = "1";
                        this.saveMessageToLocalStorage(window.chatbotName || "AI", currentText);
                    } catch (error) {
                        console.error("Error:", error);
                        if (typingPlaceholder) {
                            typingPlaceholder.remove();
                        }
                        this.appendMessage(
                            window.chatbotName || "AI",
                            error.message,
                            "ai error",
                            false
                        );
                    }

                };
            }

            if (toggleButton) {
                toggleButton.addEventListener('click', () => this.toggleChat());
            }

            if (clearButton) {
                clearButton.addEventListener('click', (e) => this.clearChatStorage(e));
            }

            if (closeButton) {
                closeButton.addEventListener('click', (e) => this.toggleChat(e));
            }

            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        form?.dispatchEvent(new Event('submit'));
                    }
                });
            }
        }
    };

    protectedChat.initialize();
    document.body.appendChild(chatRoot);
})();
