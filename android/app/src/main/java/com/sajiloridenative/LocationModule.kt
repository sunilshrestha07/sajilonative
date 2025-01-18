package com.sajiloridenative

import android.location.Location
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

class LocationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val fusedLocationProviderClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(reactContext)

    override fun getName(): String {
        return "LocationModule"
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        try {
            fusedLocationProviderClient.lastLocation
                .addOnSuccessListener { location: Location? ->
                    if (location != null) {
                        val locationData = mapOf(
                            "latitude" to location.latitude,
                            "longitude" to location.longitude
                        )
                        promise.resolve(locationData)
                    } else {
                        promise.reject("NO_LOCATION", "Location is null")
                    }
                }
                .addOnFailureListener { e ->
                    promise.reject("LOCATION_ERROR", e.message)
                }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
