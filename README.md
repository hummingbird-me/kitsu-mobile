# Kitsu Mobile

This is our mobile repository. It contains the React Native app. Check out the [tools], [web], [server] and [api docs] repositories.

[tools]:	https://github.com/hummingbird-me/kitsu-tools
[web]:	https://github.com/hummingbird-me/hummingbird-client
[server]:	https://github.com/hummingbird-me/kitsu-server
[api docs]:	https://github.com/hummingbird-me/api-docs

## Setup

You can develop in one of two ways:

-	In an emulator (recommended for general development).
-	On an actual device (good for performance testing and debugging device-specific issues).

### Environment Setup

See [Emulator Environment Setup](https://reactnative.dev/docs/environment-setup):

- Follow the React Native CLI Quickstart, _not_ the Expo Go Quickstart!
- Make sure you pick the right OS combo that you're using!
- We use Ruby 2.7.3 and Node 18!

### Running it

See [Running on a Device](https://reactnative.dev/docs/running-on-device):

1.	Run `npm install`.
1.	Run `bundle install`.
1.	-	Run `npx expo run:ios` or `npx expo run:android` to start the app in an emulator.
	-	Alternatively, you can run `npx expo`.

### Debugging

1.	Install [Flipper](https://fbflipper.com).
1.	It should automatically connect when you start it.
1.	Install and enable useful plugins:
	1.	Install the "Redux Debugger" plugin.
	1.	Enable the Network plugin.

## Download

<a href='https://play.google.com/store/apps/details?id=com.everfox.animetrackerandroid&utm_source=github&utm_campaign=kitsu-mobile&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
	<img
		style='height:4em'
		alt='Get it on Google Play'
		src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
</a> <!-- https://play.google.com/intl/en_us/badges/ -->
