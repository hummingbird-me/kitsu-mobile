1. Run yarn install
2. Run react-native link
3. Because of weird bug, react native does not have btoa and atob functions, but it is needed in auth library, for that we need to import btoa and atob in that library. (this is temporary solution, I will create PR to support react-native to that library). For now, you can run the app by enabling Remote debug mode, and app will work as it should.

Installation Notes: 
- Download Facebook SDK and install it under ~/Documents/FacebookSDK