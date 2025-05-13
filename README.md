# My Portfolio

A statically-compiled web app built using Next.js 15, It utilizes the GSAP and Framer Motion, and employs components from [Aceternity UI](https://ui.aceternity.com/), [Namer UI](https://namer-ui.netlify.app/), [HextaUI](https://hextaui.com/), and [React Bits](https://www.reactbits.dev/).

Check it out at https://maxim-bortnikov.netlify.app/

Features:

 - Like button

 - Link click count

 - Playground section with draggable cards (desktop only)

Playground Events:

 - Change the active card

 - Change the background of the wildcard

 - Change the inscriptions on the penumbra card

 - Show an animated rectangle notification

 - Show a full-viewport notification with Balatro

 - Change the inscription in the playground area

 - Change the style of the inscription in the playground area

 - Display a notification with a random intro quote from the "Losing Alice" TV show

# Firestore Rules:
If you decide to use this as a template for your own portfolio and want the link/like counter to work, please follow these steps:

 - Run Firestore in test mode.

 - Create the necessary fields by modifying the relevant functions:

   Before:
   
        const handleProjectClick = async (link: string) => {
          incrementLinkCount(i18n.language, link);
        };

        async function incrementLinkCount(language: string, link: string) {
          const cleanedLink = sanitizeLink(link);
          const safeLink = encodeURIComponent(cleanedLink);
          const fieldName = `${language}:${safeLink}`;
          const docRef = doc(db, "data", "linkCounts");
          try {
            await updateDoc(docRef, { [fieldName]: increment(1) });
          } catch (error: any) {
            if (error.code === "not-found") {
              await setDoc(docRef, { [fieldName]: 1 }, { merge: true });
            } else {
              //console.error("Error incrementing link count:", error);
            }
          }
          return safeLink;
        }
   
    After:

       const handleProjectClick = async (link: string) => {
          for (const lang of languages) {
            incrementLinkCount(lang.code, link);
          }
        };
   
       async function incrementLinkCount(language: string, link: string) {
          const cleanedLink = sanitizeLink(link);
          const safeLink = encodeURIComponent(cleanedLink);
          const fieldName = `${language}:${safeLink}`;
          const docRef = doc(db, "data", "linkCounts");
          try {
            await updateDoc(docRef, { [fieldName]: increment(0) });
          } catch (error: any) {
            if (error.code === "not-found") {
              await setDoc(docRef, { [fieldName]: 0 }, { merge: true });
            } else {
              //console.error("Error incrementing link count:", error);
            }
          }
          return safeLink;
        }
   
   And clicking on each link-opening button to initialize the fields. Don’t forget to set up the fields for other types of links in a similar manner.

 - Restore the original functions.

 - Set the following rules for Firestore:

        service cloud.firestore {
          match /databases/{database}/documents {
        
            // LIKE COUNTS: Anyone can read and increment
            match /data/likeCounts {
              allow read: if true;
              allow update: if isIncrement(resource, request);
              allow create, delete: if false;
            }
        
            // LINK COUNTS: Anyone can increment, no one can read
            match /data/linkCounts {
              allow read: if false;
              allow update: if isIncrement(resource, request);
              allow create, delete: if false;
            }
        
            // SOCIAL COUNTS: Same as LINK COUNTS
            match /data/socialCounts {
              allow read: if false;
              allow update: if isIncrement(resource, request);
              allow create, delete: if false;
            }
          
            // ARTICLE COUNTS: Same as LINK COUNTS
            match /data/articleCounts {
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

[BUTTONS](https://codepen.io/uchihaclan/pen/NWOyRWy) by [TAYLOR](https://codepen.io/uchihaclan)

[Spotlight Card](https://hextaui.com/docs/animation/spotlight-card) by [HextaUI](https://hextaui.com/)

[tabler-icons](https://github.com/tabler/tabler-icons) by [tabler](https://github.com/tabler)

[lucide](https://github.com/lucide-icons/lucide) by [lucide-icons](https://github.com/lucide-icons)

[react-toastify](https://github.com/fkhadra/react-toastify) by [Fadi Khadra](https://github.com/fkhadra)

[react-i18next](https://github.com/i18next/react-i18next) by [i18next](https://github.com/i18next)

[firebase-js-sdk](https://github.com/firebase/firebase-js-sdk) by [firebase](https://github.com/firebase/firebase-js-sdk)

[Animated Tooltip](https://ui.aceternity.com/components/animated-tooltip) by [Aceternity UI](https://ui.aceternity.com/)

[Daily UI#011 | Flash Message (Error/Success)](https://codepen.io/juliepark/pen/vjMOKQ) by [Julie Park](https://codepen.io/juliepark)

[すりガラスなプロフィールカード](https://codepen.io/ash_creator/pen/zYaPZLB) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)

[Neon Button](https://codepen.io/HighFlyer) by [Thea](https://codepen.io/HighFlyer/pen/WNXRZBv)

[Signup Form](https://ui.aceternity.com/components/signup-form) from [Aceternity UI](https://ui.aceternity.com/)

[motion](https://github.com/motiondivision/motion) by [motiondivision](https://github.com/motiondivision)

[GSAP](https://github.com/greensock/GSAP) by [greensock](https://github.com/greensock)

[Bouncing Cube Loader](https://codepen.io/haja-ran/pen/xxWRKNm) by [Haja Randriakoto](https://codepen.io/haja-ran)

[JTB studios - Link](https://codepen.io/zzznicob/pen/GRPgKLM) by [Nico](https://codepen.io/zzznicob)

[AI Image Generator](https://redpandaai.com/tools/ai-image-generator) by [Red Panda AI](https://redpandaai.com/)

[Bento Grid](https://ui.aceternity.com/components/bento-grid) by [Aceternity UI](https://ui.aceternity.com/)

[Lens](https://ui.aceternity.com/components/lens) by [Aceternity UI](https://ui.aceternity.com/)

[Glowing Effect](https://ui.aceternity.com/components/glowing-effect) by [Aceternity UI](https://ui.aceternity.com/)

[Draggable Card](https://ui.aceternity.com/components/draggable-card) by [Aceternity UI](https://ui.aceternity.com/)

[Canvas Reveal Effect](https://ui.aceternity.com/components/canvas-reveal-effect) by [Aceternity UI](https://ui.aceternity.com/)

[Blog Post Header](https://codepen.io/nodws/pen/GgKErep) by [Nodws](https://codepen.io/nodws/pen)

[Confetti](https://hextaui.com/docs/animation/confetti) by [HextaUI](https://hextaui.com/)

[Card hover effect](https://codepen.io/aaroniker/pen/yLEPJXj) by [Aaron Iker](https://codepen.io/aaroniker)

[ogl](https://github.com/oframe/ogl) by [oframe](https://github.com/oframe)

[Balatro](https://www.reactbits.dev/backgrounds/balatro) by [React Bits](https://www.reactbits.dev/)

[Aurora](https://www.reactbits.dev/backgrounds/aurora) by [React Bits](https://www.reactbits.dev/)

[Letter Glitch](https://www.reactbits.dev/backgrounds/letter-glitch) by [React Bits](https://www.reactbits.dev/)

[Decrypted Text](https://www.reactbits.dev/text-animations/decrypted-text) by [React Bits](https://www.reactbits.dev/)

[Blur Text](https://www.reactbits.dev/text-animations/blur-text) by [React Bits](https://www.reactbits.dev/)

[animate-css](https://github.com/animate-css/animate.css) by [animate-css](https://github.com/animate-css)

[Click Spark](https://www.reactbits.dev/text-animations/blur-text) by [React Bits](https://www.reactbits.dev/)

[Perplexity](https://www.perplexity.ai/)

[Mistral's Le Chat](https://chat.mistral.ai/chat)

Used [Namer UI](https://namer-ui.netlify.app/) components:

- Halomot Button

- Structured Block

- Unfolding Sidebar

- Blog Post Header
