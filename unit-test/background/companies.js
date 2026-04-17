const Companies = require('../../shared/js/background/companies');

describe('Companies', () => {
    beforeEach(() => {
        Companies.resetData();
    });

    describe('add()', () => {
        it('adds a new company and returns it', () => {
            const company = Companies.add({ name: 'TestCo' });
            expect(company).toBeDefined();
            expect(company.name).toEqual('TestCo');
        });

        it('increments count on repeated adds of the same company', () => {
            Companies.add({ name: 'TestCo' });
            Companies.add({ name: 'TestCo' });
            const company = Companies.get('TestCo');
            expect(company.count).toEqual(2);
        });

        it('adds different companies independently', () => {
            Companies.add({ name: 'Alpha' });
            Companies.add({ name: 'Beta' });
            expect(Companies.get('Alpha')).toBeDefined();
            expect(Companies.get('Beta')).toBeDefined();
        });
    });

    describe('get()', () => {
        it('returns the company by name', () => {
            Companies.add({ name: 'Lookup' });
            const c = Companies.get('Lookup');
            expect(c.name).toEqual('Lookup');
        });

        it('returns undefined for a company that has not been added', () => {
            expect(Companies.get('NonExistent')).toBeUndefined();
        });
    });

    describe('all()', () => {
        it('returns an empty array when no companies have been added', () => {
            expect(Companies.all()).toEqual([]);
        });

        it('returns all company names', () => {
            Companies.add({ name: 'A' });
            Companies.add({ name: 'B' });
            const names = Companies.all();
            expect(names).toContain('A');
            expect(names).toContain('B');
            expect(names.length).toEqual(2);
        });
    });

    describe('getTotalPages()', () => {
        it('starts at 0', () => {
            expect(Companies.getTotalPages()).toEqual(0);
        });

        it('increments with incrementTotalPages()', () => {
            Companies.incrementTotalPages();
            Companies.incrementTotalPages();
            expect(Companies.getTotalPages()).toEqual(2);
        });

        it('can be set via setTotalPagesFromStorage()', () => {
            Companies.setTotalPagesFromStorage(50);
            expect(Companies.getTotalPages()).toEqual(50);
        });

        it('ignores falsy values in setTotalPagesFromStorage()', () => {
            Companies.incrementTotalPages();
            Companies.setTotalPagesFromStorage(0);
            expect(Companies.getTotalPages()).toEqual(1);
        });
    });

    describe('countCompanyOnPage()', () => {
        it('increments pagesSeenOn for a named company', () => {
            Companies.add({ name: 'TrackerCo' });
            Companies.countCompanyOnPage({ name: 'TrackerCo' });
            expect(Companies.get('TrackerCo').pagesSeenOn).toEqual(1);
        });

        it('does not increment pagesSeenOn for the "unknown" company', () => {
            Companies.add({ name: 'unknown' });
            Companies.countCompanyOnPage({ name: 'unknown' });
            expect(Companies.get('unknown').pagesSeenOn).toEqual(0);
        });
    });

    describe('getTopBlocked()', () => {
        it('returns top blocked companies sorted by count', () => {
            Companies.add({ name: 'Low' });
            // Add High twice so its count is 2, Low is 1
            Companies.add({ name: 'High' });
            Companies.add({ name: 'High' });

            const top = Companies.getTopBlocked(2);
            expect(top[0].name).toEqual('High');
            expect(top[0].count).toEqual(2);
            expect(top[1].name).toEqual('Low');
            expect(top[1].count).toEqual(1);
        });

        it('returns at most n results', () => {
            ['A', 'B', 'C', 'D'].forEach((name) => Companies.add({ name }));
            const top = Companies.getTopBlocked(2);
            expect(top.length).toEqual(2);
        });
    });

    describe('sanitizeData()', () => {
        it('removes the "twitter" key if present', () => {
            const data = { twitter: { count: 10, name: 'twitter' }, google: { count: 5 } };
            const result = Companies.sanitizeData(data);
            expect(result.twitter).toBeUndefined();
            expect(result.google).toBeDefined();
        });

        it('leaves data unchanged when "twitter" key is absent', () => {
            const data = { google: { count: 5 }, facebook: { count: 3 } };
            const result = Companies.sanitizeData(data);
            expect(result).toEqual({ google: { count: 5 }, facebook: { count: 3 } });
        });

        it('returns null/undefined as-is', () => {
            expect(Companies.sanitizeData(null)).toBeNull();
            expect(Companies.sanitizeData(undefined)).toBeUndefined();
        });
    });

    describe('getLastResetDate()', () => {
        it('is set when resetData() is called', () => {
            const before = Date.now();
            Companies.resetData();
            const after = Date.now();
            const resetDate = Companies.getLastResetDate();
            expect(resetDate).toBeGreaterThanOrEqual(before);
            expect(resetDate).toBeLessThanOrEqual(after);
        });
    });
});
