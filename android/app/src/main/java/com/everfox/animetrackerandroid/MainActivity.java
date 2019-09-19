package com.everfox.animetrackerandroid;
import com.reactnativenavigation.NavigationActivity;
import android.content.Intent;
import android.os.Bundle;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends NavigationActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics());
        MobileAds.initialize(this, "ca-app-pub-1730996169473196~3842160171");
    }

    /**
     * NOTE: DISABLED because React Native Navigation handles this automatically
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     
    @Override
    protected String getMainComponentName() {
        return "kitsu_mobile";
    }
    */
    
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
