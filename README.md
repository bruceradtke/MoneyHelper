# MoneyHelper

To implement:

- Add moneyhelper.js script tag to your site
- Inject 'moneyHelperModule' into your ng app
- Inject 'moneyHelper' service into your controller

Service API:  moneyHelper 


            formatCurrency(inputAmount, culture, precisionOverride)
            	inputAmount  ie: "123.45"
            	culture (optional)
            	precisionOverride (optional)  number of decimal places

            formatNumber(inputAmount, culture)
            	inputAmount  ie: "123.45"
            	culture (optional)

            getValue(inputAmount,culture)
            	inputAmount  ie: "$1,234,567.89"
            	culture (optional)

            applySettings(culture)
                apply the default settings to use for API and filter function

 Filter:    format number using the moneyHelper current cultureSetting.



 Culture:	Object containing all of the options for formatting
 			Defaults to USD settings.
 			
 			    cultureSettings = { currencySymbol: "$",
						            decimalSeparator: ".",
						            thousandsSeparator: ",",
						            currencyPosition: "L"
							        };
