# My Portfolio

A statically-compiled web app built using Next.js 16 that employs components from [Aceternity UI](https://ui.aceternity.com/), [Namer UI](https://namer-ui.vercel.app/), [Codepen](https://codepen.io/), [21st.dev](https://21st.dev/community/components), and [React Bits](https://www.reactbits.dev/).

Check it out at https://maxim-bortnikov.netlify.app/

![Alt Preview](https://raw.githubusercontent.com/Northstrix/my-portfolio/refs/heads/main/preview.gif)

# Firestore Rules:
If you decide to use this as a template for your own portfolio and want the metrics to work, please follow these steps:

 - Run Firestore with rules that don't prohibit anything.

 - Create the necessary fields using the MetricsInitializer.tsx component:

 - Set the following rules for Firestore:

        service cloud.firestore {
          match /databases/{database}/documents {
            match /data/thirdPortfolio {
              allow read: if false;
              allow update: if isIncrement(resource, request);
              allow create, delete: if false;
            }
          }
        
          // Only allow updates that increment a single existing numeric field
          function isIncrement(resource, request) {
            return request.writeFields.size() == 1 &&
              resource.data[request.writeFields[0]] is int &&
              request.resource.data[request.writeFields[0]] > resource.data[request.writeFields[0]] &&
              request.resource.data.keys().hasOnly(resource.data.keys());
          }
        }
                

# Credit

The existence of this portfolio (at least in its current form) wouldn't've been possible without the following:

[Resizable Navbar](https://ui.aceternity.com/components/resizable-navbar) by [Aceternity UI](https://ui.aceternity.com/)

[Limelight Nav](https://21st.dev/easemize/limelight-nav/default) by [EaseMize UI](https://21st.dev/easemize)

[Chronicle Button](https://codepen.io/Haaguitos/pen/OJrVZdJ) by [Haaguitos](https://codepen.io/Haaguitos)

[Wheel Picker](https://21st.dev/ncdai/wheel-picker/default) by [Chánh Đại](https://21st.dev/ncdai)

[React Wheel Picker](https://www.npmjs.com/package/@ncdai/react-wheel-picker) by [Chánh Đại](https://github.com/ncdai)

[すりガラスなプロフィールカード](https://codepen.io/ash_creator/pen/zYaPZLB) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)

[Text Rotate](https://www.fancycomponents.dev/docs/components/text/text-rotate) by [Fancy Components](https://www.fancycomponents.dev/)

[GSAP (GreenSock Animation Platform)](https://www.npmjs.com/package/gsap)

[framer-motion](https://www.npmjs.com/package/framer-motion)

[AnimateIcons](https://animateicons.vercel.app/)

[Hero Section 6](https://21st.dev/meschacirung/hero-section-6/default) by [Tailark](https://21st.dev/tailark)

[Modern Hero Section](https://21st.dev/ravikatiyar162/modern-hero-section/default) by [Ravi Katiyar](https://21st.dev/ravikatiyar)

[Travel section #tailwind #slick.js](https://codepen.io/kristen17/pen/bGxEqqj) by [Kristen](https://codepen.io/kristen17)

[Scroll Down Icon Animation](https://codepen.io/TKS31/pen/gOaKaxx) by [Tsukasa Aoki](https://codepen.io/TKS31)

[i18next](https://www.npmjs.com/package/i18next)

[Lucide React](https://www.npmjs.com/package/lucide-react)

[Phosphor Icons](https://phosphoricons.com/)

[tabler-icons-react](https://www.npmjs.com/package/tabler-icons-react)

[Gooey Text Morphing](https://21st.dev/victorwelander/gooey-text-morphing/default) by [Victor Welander](https://21st.dev/victorwelander)

[Morphing Text](https://21st.dev/dillionverma/morphing-text/default) by [Magic UI](https://21st.dev/magicui)

[Text scroll and hover effect with GSAP and clip](https://codepen.io/Juxtopposed/pen/mdQaNbG) by [Juxtopposed](https://codepen.io/Juxtopposed)

[Fill Text with Image Using CSS](https://codepen.io/iamdejean/pen/wvwjjer) by [Ezekiel Japheth Ayuba](https://codepen.io/iamdejean)

[firebase-js-sdk](https://github.com/firebase/firebase-js-sdk) by [firebase](https://github.com/firebase/firebase-js-sdk)

[Letter Glitch](https://www.reactbits.dev/backgrounds/letter-glitch) by [React Bits](https://www.reactbits.dev/)

[Decrypted Text](https://www.reactbits.dev/text-animations/decrypted-text) by [React Bits](https://www.reactbits.dev/)

[Silk](https://www.reactbits.dev/backgrounds/silk) by [React Bits](https://www.reactbits.dev/)

[Animated Testimonials](https://ui.aceternity.com/components/animated-testimonials) by [Aceternity UI](https://ui.aceternity.com/)

[Text Reveal Animation](https://codepen.io/swatiparge/pen/LYVMEag) by [Swati Parge](https://codepen.io/swatiparge)

[Bento Grid](https://ui.aceternity.com/components/bento-grid) by [Aceternity UI](https://ui.aceternity.com/)

[Profile Card Testimonial Carousel](https://21st.dev/arunachalam0606/profile-card-testimonial-carousel/default) by [Arunachalam](https://21st.dev/arunachalam0606)

[Custom Checkbox](https://21st.dev/Edil-ozi/custom-checkbox/default) by [Edil Ozi](https://21st.dev/Edil-ozi)

[チェックしないと押せないボタン](https://codepen.io/ash_creator/pen/JjZReNm) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)

[Cards with inverted border-radius #scss](https://codepen.io/kristen17/pen/pomgrKp) by [Kristen](https://codepen.io/kristen17)

[Input Floating Label animation](https://codepen.io/Mahe76/pen/qBQgXyK) by [Elpeeda](https://codepen.io/Mahe76)

[Inverted border-radius using CSS mask II](https://codepen.io/t_afif/pen/LEPBYvK) by [Temani Afif](https://codepen.io/t_afif)

[Accordion](https://21st.dev/molecule-lab-rushil/accordion/default) by [Molecule UI](https://21st.dev/molecule-ui)

[JTB studios - Link](https://codepen.io/zzznicob/pen/GRPgKLM) by [Nico](https://codepen.io/zzznicob)

[Hover Link Animation](https://21st.dev/erikvalencia1/hover-link-animation/default) by [Ruben](https://21st.dev/rubenerik)

[Multi Colored Text with CSS](https://codepen.io/TajShireen/pen/YzZmbep) by [Shireen Taj](https://codepen.io/TajShireen)

[404 galaxy not found](https://codepen.io/remid/pen/YOVawm) by [Rémi Denimal](https://codepen.io/remid)

[react-three-fiber](https://github.com/pmndrs/react-three-fiber) by [Poimandres](https://github.com/pmndrs)

[BUTTONS](https://codepen.io/uchihaclan/pen/NWOyRWy) by [TAYLOR](https://codepen.io/uchihaclan)

[Perplexity](https://www.perplexity.ai/)

[Google AI Studio](https://aistudio.google.com/)

[Kippo Hover Card Effect](https://codepen.io/Hyperplexed/pen/zYWdYoo) by [Hyperplexed](https://codepen.io/Hyperplexed)

[Color Picker](https://21st.dev/community/components/uplusion23/color-picker/color-picker-with-swatches-and-onchange) by [Trevor McIntire](https://21st.dev/community/uplusion23)

[vue-color-wheel](https://vue-color-wheel.vercel.app/) by [Robert Shaw](https://github.com/xiaoluoboding)

[Elastic Div](https://codepen.io/Juxtopposed/pen/vYMMRyR) by [Juxtopposed](https://codepen.io/Juxtopposed)

[Electric Border](https://codepen.io/BalintFerenczy/pen/KwdoyEN) by [Bálint Ferenczy](https://codepen.io/BalintFerenczy)

[Electric Border (iOS Safe)](https://codepen.io/BalintFerenczy/pen/yyYErXa) by [Bálint Ferenczy](https://codepen.io/BalintFerenczy)

[Splashed Toast Notifications - CSS](https://codepen.io/josetxu/pen/OJGXdzY) by [Josetxu](https://codepen.io/josetxu/pen/OJGXdzY)

[Push Notifications](https://codepen.io/FlorinPop17/pen/xxORmaB) by [Florin Pop](https://codepen.io/FlorinPop17)

[Daily UI#011 | Flash Message (Error/Success)](https://codepen.io/juliepark/pen/vjMOKQ) by [Julie Park](https://codepen.io/juliepark)

[Neon Button](https://codepen.io/HighFlyer) by [Thea](https://codepen.io/HighFlyer/pen/WNXRZBv)

[AI Image Generator](https://redpandaai.com/tools/ai-image-generator) by [Red Panda AI](https://redpandaai.com/)

[Pollinations](https://pollinations.ai/)

[Grok Imagine](https://grok.com/imagine)

[Glowing Effect](https://ui.aceternity.com/components/glowing-effect) by [Aceternity UI](https://ui.aceternity.com/)

[Draggable Card](https://ui.aceternity.com/components/draggable-card) by [Aceternity UI](https://ui.aceternity.com/)

[GradientGen](https://github.com/noegarsoux/GradientGen) by [noegarsoux](https://github.com/noegarsoux)

[Tranquiluxe](https://uvcanvas.com/docs/components/tranquiluxe) by [UVCanvas](https://uvcanvas.com/)

[Balatro Background Shaders](https://www.shadertoy.com/view/XXtBRr) by [xxidbr9](https://www.shadertoy.com/user/xxidbr9)

[Voronoi - distances](https://www.shadertoy.com/view/ldl3W8) by [iq](https://www.shadertoy.com/user/iq)
