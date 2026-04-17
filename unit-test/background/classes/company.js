const Company = require('../../../shared/js/background/classes/company');

describe('Company', () => {
    describe('constructor', () => {
        it('sets name and count starts at 0', () => {
            const c = new Company({ name: 'Acme' });
            expect(c.name).toEqual('Acme');
            expect(c.count).toEqual(0);
        });

        it('sets pagesSeenOn to 0', () => {
            const c = new Company({ name: 'Acme' });
            expect(c.pagesSeenOn).toEqual(0);
        });

        it('uses displayName when provided', () => {
            const c = new Company({ name: 'acme', displayName: 'Acme Corp' });
            expect(c.displayName).toEqual('Acme Corp');
        });

        it('falls back to name when displayName is absent', () => {
            const c = new Company({ name: 'acme' });
            expect(c.displayName).toEqual('acme');
        });
    });

    describe('incrementCount()', () => {
        it('increments count by 1 each time', () => {
            const c = new Company({ name: 'Test' });
            expect(c.count).toEqual(0);
            c.incrementCount();
            expect(c.count).toEqual(1);
            c.incrementCount();
            expect(c.count).toEqual(2);
        });
    });

    describe('incrementPagesSeenOn()', () => {
        it('increments pagesSeenOn by 1 each time', () => {
            const c = new Company({ name: 'Test' });
            expect(c.pagesSeenOn).toEqual(0);
            c.incrementPagesSeenOn();
            expect(c.pagesSeenOn).toEqual(1);
            c.incrementPagesSeenOn();
            expect(c.pagesSeenOn).toEqual(2);
        });
    });

    describe('get()', () => {
        it('returns the value of an existing property', () => {
            const c = new Company({ name: 'Test' });
            expect(c.get('name')).toEqual('Test');
        });

        it('returns undefined for a non-existent property', () => {
            const c = new Company({ name: 'Test' });
            expect(c.get('nonExistent')).toBeUndefined();
        });
    });

    describe('set()', () => {
        it('sets an arbitrary property', () => {
            const c = new Company({ name: 'Test' });
            c.set('count', 42);
            expect(c.count).toEqual(42);
        });

        it('can set a new property', () => {
            const c = new Company({ name: 'Test' });
            c.set('customProp', 'customVal');
            expect(c.get('customProp')).toEqual('customVal');
        });
    });
});
