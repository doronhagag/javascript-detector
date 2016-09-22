const fs = require('fs'),
      JSDOM = require('jsdom');


/**
 *
 */
class JavascriptDetector {
    /**
     *
     */
    isEncoded(html) {
        return 0 > html.indexOf('Incident Id');
    }


    /**
     *
     */
    getID(html) {
        return this._parse(html);
    }


    /**
     *
     */
    _getEncoded(html) {
        let encodedBits = html.match(/cc='(.*)';.*cc='(.*);.*Pid\(\) {return (.*); }/);

        return {
            html: this._normalizeInput(encodedBits[1]),
            functions: this._normalizeInput(encodedBits[2]),
            callback: this._normalizeInput(encodedBits[3])
        };
    }


    /**
     *
     */
    _normalizeInput(str) {
        return unescape(decodeURIComponent(str))
            .replace(/^<\!\-\-\s*|\s*\-\->$/g, '')
            .replace(/'/g, '"')
            .replace(/finalStr=""/g, 'var finalStr=""')
            .replace(/sbbObj = /g, 'var sbbObj=')
            .replace(/sbbFrm=/g, 'var sbbFrm=')
            .replace(/i=0/g, 'var i=0')
            .replace(/document\./g, 'window\.document\.')

            .replace(/onclick="return "(.*?)""/g, 'value="$1"')
            .replace(/\.onclick\(\)/g, '\.getAttribute\(\'value\'\)')
            ;
    }


    /**
     *
     */
    _customReplaces(str) {
        let wrongRef = str.match(/} var (.*)=.*getElementsByName.*x=.*?\((.*?)\)/);
        if (null !== wrongRef)
            str = str.replace(wrongRef[2], wrongRef[1]);

        return str;
    }


    /**
     *
     */
    _parse(jsDetectionHTML) {
        return new Promise((resolve, reject) => {
            let markup = this._getEncoded(jsDetectionHTML);

            markup.functions = this._customReplaces(markup.functions);

            return JSDOM.env({
                html: markup.html,
                done: (err, window) => {
                    let getID = new Function('window', [
                            markup.functions,
                            'return',
                            markup.callback
                        ].join(' ')),
                        sessionKey = jsDetectionHTML.match(/document\.cookie="(.*?)=(.*?);/);

                    try {
                        let genPid = getID(window),
                            output = {
                                PRID: {
                                    value: genPid
                                }
                            };

                        if (0 > sessionKey[2].indexOf('genPid')) {
                            output[sessionKey[1]] = {
                                value: sessionKey[2]
                            };
                        }

                        resolve(output);
                    } catch(e) {
                        reject({error: e});
                    }
                }

            });
        });
    }

}

module.exports = JavascriptDetector;