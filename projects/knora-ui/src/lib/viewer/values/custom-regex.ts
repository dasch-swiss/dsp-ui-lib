// @dynamic
// https://github.com/ng-packagr/ng-packagr/issues/641

export class CustomRegex{

    public static readonly INT_REGEX = /^-?\d+$/;

    public static readonly URI_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    
}
