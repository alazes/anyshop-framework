import {
  GoogleSignInResult,
  FacebookSignInResult,
  TwitterSignInResult,
  PhoneSignInResult,
  AppleSignInResult,
} from 'capacitor-firebase-auth';

import IProviderUserData from './provider-user-data.interface';

export interface IProviderResultInfo {
  data?: IProviderUserData;
  providerResult?:
    | GoogleSignInResult
    | TwitterSignInResult
    | FacebookSignInResult
    | AppleSignInResult
    | PhoneSignInResult;
}

export default IProviderResultInfo;
