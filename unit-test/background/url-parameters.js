const tdsStorage = require('../../shared/js/background/storage/tds').default;
const tdsStorageStub = require('../helpers/tds');
const { stripTrackingParameters, trackingParametersStrippingEnabled } = require('../../shared/js/background/url-parameters');
const settingsHelper = require('../helpers/settings');
const load = require('../helpers/utils');
const tds = require('../data/tds');
const config = require('../data/extension-config.json');
const surrogates = require('../data/surrogates').surrogates;

// Build a config that includes the trackingParameters feature
const trackingParamsConfig = Object.assign({}, config, {
    features: Object.assign({}, config.features, {
        trackingParameters: {
            state: 'enabled',
            settings: {
                parameters: ['fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign'],
            },
        },
    }),
});

// Build a config without the trackingParameters feature
const noTrackingParamsConfig = Object.assign({}, config, {
    features: Object.assign({}, config.features, {
        trackingParameters: undefined,
    }),
});

describe('stripTrackingParameters()', () => {
    describe('when trackingParameters config is present', () => {
        beforeAll(() => {
            tdsStorageStub.stub({ config: trackingParamsConfig });
            return tdsStorage.getLists();
        });

        it('returns false when URL has no query string', () => {
            const url = new URL('https://example.com/page');
            const result = stripTrackingParameters(url);
            expect(result).toBeFalse();
            expect(url.search).toEqual('');
        });

        it('returns false when URL has only an empty query string', () => {
            const url = new URL('https://example.com/page?');
            const result = stripTrackingParameters(url);
            expect(result).toBeFalse();
        });

        it('strips a known tracking parameter and returns true', () => {
            const url = new URL('https://example.com/page?fbclid=ABC123');
            const result = stripTrackingParameters(url);
            expect(result).toBeTrue();
            expect(url.search).toEqual('');
        });

        it('strips multiple known tracking parameters', () => {
            const url = new URL('https://example.com/page?utm_source=newsletter&utm_medium=email&utm_campaign=summer');
            const result = stripTrackingParameters(url);
            expect(result).toBeTrue();
            expect(url.search).toEqual('');
        });

        it('keeps unknown (non-tracking) parameters', () => {
            const url = new URL('https://example.com/page?q=hello&page=2');
            const result = stripTrackingParameters(url);
            expect(result).toBeFalse();
            expect(url.searchParams.get('q')).toEqual('hello');
            expect(url.searchParams.get('page')).toEqual('2');
        });

        it('strips only tracking parameters and keeps others', () => {
            const url = new URL('https://example.com/search?q=test&fbclid=ABC&page=1');
            const result = stripTrackingParameters(url);
            expect(result).toBeTrue();
            expect(url.searchParams.has('fbclid')).toBeFalse();
            expect(url.searchParams.get('q')).toEqual('test');
            expect(url.searchParams.get('page')).toEqual('1');
        });

        it('handles parameters with no value', () => {
            const url = new URL('https://example.com/page?gclid&q=hello');
            const result = stripTrackingParameters(url);
            expect(result).toBeTrue();
            expect(url.searchParams.has('gclid')).toBeFalse();
            expect(url.searchParams.get('q')).toEqual('hello');
        });
    });

    describe('when trackingParameters config is absent', () => {
        beforeAll(() => {
            tdsStorageStub.stub({ config: noTrackingParamsConfig });
            return tdsStorage.getLists();
        });

        it('returns false and leaves URL unchanged', () => {
            const url = new URL('https://example.com/page?fbclid=ABC123');
            const result = stripTrackingParameters(url);
            expect(result).toBeFalse();
            expect(url.searchParams.get('fbclid')).toEqual('ABC123');
        });
    });
});

describe('trackingParametersStrippingEnabled()', () => {
    beforeAll(() => {
        load.loadStub({ tds, surrogates, config: trackingParamsConfig });
        tdsStorageStub.stub({ config: trackingParamsConfig });
        settingsHelper.stub({});
        return tdsStorage.getLists();
    });

    it('returns false for a special domain (e.g. localhost)', () => {
        const Site = require('../../shared/js/background/classes/site').default;
        const site = new Site('http://localhost/page');
        const result = trackingParametersStrippingEnabled(site);
        expect(result).toBeFalse();
    });

    it('returns false when the initiator URL is a special domain', () => {
        const Site = require('../../shared/js/background/classes/site').default;
        const site = new Site('https://example.com/page');
        const result = trackingParametersStrippingEnabled(site, 'chrome://newtab');
        expect(result).toBeFalse();
    });
});
