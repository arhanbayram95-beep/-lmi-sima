import { Platform } from 'react-native';

// TODO: replace IOS_APP_STORE_ID once the App Store Connect app record
// exists and has a real numeric Apple ID - keeps "Rate on App Store" wired
// to real navigation logic now, without pretending a listing exists.
const IOS_APP_STORE_ID = 'REPLACE_WITH_REAL_APP_STORE_ID';
const ANDROID_PACKAGE_NAME = 'com.arhanbayram.facereader';

export function getStoreListingUrl(): string {
  if (Platform.OS === 'ios') {
    return `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
  }
  if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;
  }
  return `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
}
