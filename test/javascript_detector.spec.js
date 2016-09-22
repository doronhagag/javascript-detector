import fs from 'fs';
import chai from 'chai';
const expect = chai.expect;

import JavascriptDetector from '../src/javascript_detector';

describe('Execute all encoded templates using JS Detector - E2E', () => {
    let detector = null,
        templatesDir = __dirname + '/_encoded_templates/';

    beforeEach(() => {
        detector = new JavascriptDetector();
    });

    afterEach(() => {
    });

    // loading all templates.. and running
    fs.readdirSync(templatesDir).forEach(file => {
        let solution = file.split('.')[1],
            data = fs.readFileSync(templatesDir + file).toString();

        it('Testing E2E File: "'+ file +'" solution: '+solution, () => {
            let getID = detector.getID(data);

            return getID.then(ID => {
                expect(ID.value).to.equal(solution);
            });
        });
    });
});