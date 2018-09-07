package com.everfox.animetrackerandroid;

import android.app.Application;
import android.support.multidex.MultiDex;
import android.content.Context;

import io.sentry.RNSentryPackage;
import com.airship.customwebview.CustomWebViewPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.microsoft.codepush.react.CodePush;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication  {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }

  @Override
  protected ReactGateway createReactGateway() {
      ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
          @Override
          protected String getJSMainModuleName() {
              return "index";
          }

          @Override
          protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
          }

          @Override
          public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
          }
      };
      return new ReactGateway(this, isDebug(), host);
  }

  @Override
  public boolean isDebug() {
      return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(
          new RNSentryPackage(MainApplication.this),
          new CustomWebViewPackage(),
          new FastImageViewPackage(),
          new PickerPackage(),
          new ReactNativeOneSignalPackage(),
          new ReactNativeYouTube(),
          new LinearGradientPackage(),
          new FBSDKPackage(mCallbackManager),
          new VectorIconsPackage(),
          new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG)
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }
}
