# MoneyHelper

To implement:

- Add moneyhelper.js script tag to your site
- Inject 'moneyHelperModule' into your ng app
- Inject 'moneyHelper' service into your controller

##Service API 


            formatCurrency(inputAmount, culture, precisionOverride)
            	inputAmount  ie: "1234567.89"
            	culture (optional)
            	precisionOverride (optional)  number of decimal places
            	returns "$1,234,567.89"

            formatNumber(inputAmount, culture)
            	inputAmount  ie: "1234567.45"
            	culture (optional)
            	returns "1,234,567.89"

            getValue(inputAmount,culture)
            	inputAmount  ie: "$1,234,567.89"
            	culture (optional)
            	return 1234567.89

            applySettings(culture)
                apply the default settings to use for API and filter function


 ##Filter   
		format number using the moneyHelper current cultureSetting.
		<br>Ex:<br>
			<div >{{amount | moneyhelper}}</div>


 ##Culture	
 			Contains all of the options for formatting
 			Defaults to USD settings.

 			    cultureSettings = { currencySymbol: "$",
						            decimalSeparator: ".",
						            thousandsSeparator: ",",
						            currencyPosition: "L"
							        };
