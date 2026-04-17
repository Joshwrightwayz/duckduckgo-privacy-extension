const GPC = require('../../shared/js/background/GPC');
const settingsHelper = require('../helpers/settings');

describe('GPC.getHeader()', () => {
    describe('when GPC is enabled', () => {
        beforeEach(() => {
            settingsHelper.stub({ GPC: true });
        });

        it('returns the Sec-GPC header object', () => {
            const header = GPC.getHeader();
            expect(header).toEqual({ name: 'Sec-GPC', value: '1' });
        });
    });

    describe('when GPC is disabled', () => {
        beforeEach(() => {
            settingsHelper.stub({ GPC: false });
        });

        it('returns undefined', () => {
            const header = GPC.getHeader();
            expect(header).toBeUndefined();
        });
    });

    describe('when GPC setting is not set', () => {
        beforeEach(() => {
            settingsHelper.stub({});
        });

        it('returns undefined', () => {
            const header = GPC.getHeader();
            expect(header).toBeUndefined();
        });
    });
});
