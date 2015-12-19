(function(){

    var module = angular.module('moneyHelperModule', []);

    module.factory('moneyHelper', ['$q','$http',MoneyHelper]);

    function MoneyHelper($q, $http) {

        var cultureSettings = {
            currencySymbol: "$",
            decimalSeparator: ".",
            thousandsSeparator: ",",
            currencyPosition: "L"
        };

        var settings = {
            currency: {
                symbol: "$",		// default currency symbol is '$'
                format: "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)
                decimal: ".",		// decimal point separator
                thousand: ",",		// thousands separator
                precision: 2,		// decimal places
                grouping: 3		// digit grouping (not implemented yet)
            },
            number: {
                precision: 0,		// default precision on numbers is 0
                grouping: 3,		// digit grouping (not implemented yet)
                thousand: ",",
                decimal: "."
            }
        };

        function isObject(obj) {
            return obj && toString.call(obj) === '[object Object]';
        }

        function isString(obj) {
            return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
        }

        function checkPrecision(val, base) {
            val = Math.round(Math.abs(val));
            return isNaN(val) ? base : val;
        }

        function defaults(object, defs) {
            var key;
            object = object || {};
            defs = defs || {};
            // Iterate over object non-prototype properties:
            for (key in defs) {
                if (defs.hasOwnProperty(key)) {
                    // Replace values with defaults only if undefined (allow empty/zero values):
                    if (object[key] == null) object[key] = defs[key];
                }
            }
            return object;
        }

        function _cleanString(input, myChar) {
            var output = "";
            var n = myChar.charCodeAt(0);
            for (var i = 0; i < input.length; i++) {
                if (input.charCodeAt(i) !== n) {
                    output += input.charAt(i);
                }
            }
            return output;
        }

        function toFixed(value, precision) {
            //precision = checkPrecision(precision, lib.settings.number.precision);
            var power = Math.pow(10, precision);

            // Multiply up by precision, round accurately, then divide and use native toFixed():
            return (Math.round(_unformat(value) * power) / power).toFixed(precision);
        };

        function _unformat (value, decimal) {
            // Fails silently (need decent errors):
            value = value || 0;

            // Return the value as-is if it's already a number:
            if (typeof value === "number") return value;

            // Default decimal point comes from settings, but could be set to eg. "," in opts:
            decimal = decimal || cultureSettings.decimalSeparator;

            // Build regex to strip out everything except digits, decimal point and minus sign:
            var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
                unformatted = parseFloat(
                    ("" + value)
                        .replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
                        .replace(regex, '')         // strip out any cruft
                        .replace(decimal, '.')      // make sure decimal point is standard
                );

            // This will fail silently which may cause trouble, let's wait and see:
            return !isNaN(unformatted) ? unformatted : 0;
        };

        function _formatNumber (number, precision, thousand, decimal) {
            // Clean up number:
            number = _unformat(number);

            // Build options object from second param (if object) or all params, extending defaults:
            var opts = defaults(
                    (isObject(precision) ? precision : {
                        precision: precision,
                        thousand: thousand,
                        decimal: decimal
                    }),
                    settings.number
                ),

            // Clean up precision
                usePrecision = precision; //checkPrecision(opts.precision),

            // Do some calc:
            negative = number < 0 ? "-" : "",
                //base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
                base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
                mod = base.length > 3 ? base.length % 3 : 0;

            // Format the number:
            return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
        };

        function checkCurrencyFormat(format) {
            var defaults = settings.currency.format;

            // Allow function as format parameter (should return string or object):
            if (typeof format === "function") format = format();

            // Format can be a string, in which case `value` ("%v") must be present:
            if (isString(format) && format.match("%v")) {

                // Create and return positive, negative and zero formats:
                return {
                    pos: format,
                    neg: format.replace("-", "").replace("%v", "-%v"),
                    zero: format
                };

                // If no format, or object is missing valid positive value, use defaults:
            } else if (!format || !format.pos || !format.pos.match("%v")) {

                // If defaults is a string, casts it to an object for faster checking next time:
                return (!isString(defaults)) ? defaults : lib.settings.currency.format = {
                    pos: defaults,
                    neg: defaults.replace("%v", "-%v"),
                    zero: defaults
                };

            }
            // Otherwise, assume format was fine:
            return format;
        }

        function formatMoney (number, symbol, precision, thousand, decimal, format) {

            // Clean up number:
            number = _unformat(number);

            // Build options object from second param (if object) or all params, extending defaults:
            var opts = defaults(
                (isObject(symbol) ? symbol : {
                    symbol: symbol,
                    precision: precision,
                    thousand: thousand,
                    decimal: decimal,
                    format: format
                }),
                settings.currency
            );

            // Check format (returns object with pos, neg and zero):
            var formats = checkCurrencyFormat(opts.format);

            // Choose which format to use for this value:
            var useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;

            // Return with currency symbol added:
            var tmpVal = _formatNumber(Math.abs(number), opts.precision, opts.thousand, opts.decimal);
            return useFormat.replace('%s', opts.symbol).replace('%v', tmpVal);
        };


        function formatCurrency(src, culture, precisionOverride) {
            cultureSettings = culture;
            var precision = angular.isDefined(culture.precision)?culture.precision:2;
            if (arguments.length == 3)
                precision = precisionOverride;

            var format = "%s%v";
            if (culture.currencyPosition[0] == 'r')
                format = "%v %s";

            var tmp = formatMoney(src, culture.currencySymbol, precision, culture.thousandsSeparator, culture.decimalSeparator, format);
            return tmp;
        }

        function formatNumber(src, culture) {
            cultureSettings = culture;
            var precision = angular.isDefined(culture.precision)?culture.precision:2;
            var tmp = _formatNumber(src, precision, culture.thousandsSeparator, culture.decimalSeparator);
            return tmp;
        }

        function unformatCurrency(src){
            var tmp = _unformat(src);
            return tmp;
        }

        function getCurrencyValue(src, culture) {
            // Return a float value for given src string
            cultureSettings = culture;
            var tmp = _unformat(src);
            return tmp;
        }

        function getValue(src,culture){
            if( arguments.length ==2)
               return getCurrencyValue(src,culture);
            //else
            return unformatCurrency(src);
        }

        /***  API    ****/
        return {
            formatCurrency: formatCurrency,
            formatNumber: formatNumber,
            getValue: getValue
        }

    };
})();


