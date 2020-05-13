// @dynamic
// https://github.com/ng-packagr/ng-packagr/issues/641

export class CustomRegex {

    public static readonly INT_REGEX = /^-?\d+$/;

    public static readonly DECIMAL_REGEX = /^[-+]?[0-9]*\.?[0-9]*$/;

    public static readonly URI_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    public static readonly COLOR_REGEX = /^#(?:[0-9a-fA-F]{6})$/;

    public static readonly TIME_REGEX = /^([0-1]{1}[0-9]{1}|[2]{1}[0-4]{1}):{1}[0-5]{1}[0-9]{1}$/;

    public static readonly GEONAME_REGEX = /^[0-9]{7}$/;

}
