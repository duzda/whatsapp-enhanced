# WhatsApp Enhanced
## Unofficial WhatsApp app using electron wrapper for official WhatsApp PWA

There is a lots of other WhatsApp wrappers and apps, but they seem questionably maintained or add 
features that I do not use. This is aiming to be plain yet featurefull wrapper for official PWA.
Not really Enhanced in any way (yet), just a common name for electron wrappers like Messenger enhanced or
[duzda/deezer-enhanced](https://github.com/duzda/deezer-enhanced) (btw check the V1 version, it's a really cool project and it actually IS very much enhanced)

Icon is specifically this bad on purpose to play it safe in regards to trademark (since the logo is trademarked by Meta). If you want to use official logo of WhatsApp, there is an official .zip archive with brand assets here:
[https://about.meta.com/brand/resources/whatsapp/whatsapp-brand/](https://about.meta.com/brand/resources/whatsapp/whatsapp-brand/)

### Compilation, build, running
`npm install`

`npm run start` - start Messenger enhanced

`npm run make` - create zip file with executable app (also creates folder with contents of the zip), use this to prepare executables for .desktop file

*Don't forget to modify the .desktop file if you are going to use it. You have to replace "[REPO LOCATION]" with location where you cloned this repository*
