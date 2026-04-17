const TopBlocked = require('../../../shared/js/background/classes/top-blocked');

describe('TopBlocked', () => {
    describe('add() / getTop()', () => {
        it('returns elements in insertion order when no sort is applied', () => {
            const tb = new TopBlocked();
            tb.add('alpha');
            tb.add('beta');
            tb.add('gamma');
            const top = tb.getTop(3, () => 0);
            expect(top).toContain('alpha');
            expect(top).toContain('beta');
            expect(top).toContain('gamma');
        });

        it('limits results to n elements', () => {
            const tb = new TopBlocked();
            ['a', 'b', 'c', 'd', 'e'].forEach((el) => tb.add(el));
            expect(tb.getTop(3, () => 0).length).toEqual(3);
        });

        it('defaults to 10 items when n is not provided', () => {
            const tb = new TopBlocked();
            for (let i = 0; i < 15; i++) {
                tb.add(String(i));
            }
            expect(tb.getTop(null, () => 0).length).toEqual(10);
        });

        it('returns all elements when n exceeds total', () => {
            const tb = new TopBlocked();
            tb.add('only');
            expect(tb.getTop(100, () => 0).length).toEqual(1);
        });
    });

    describe('sort()', () => {
        it('sorts data using the provided sort function', () => {
            const tb = new TopBlocked();
            const counts = { b: 5, a: 10, c: 1 };
            ['b', 'a', 'c'].forEach((el) => tb.add(el));
            tb.sort((x, y) => counts[y] - counts[x]);
            const top = tb.getTop(3, () => 0);
            expect(top[0]).toEqual('a');
            expect(top[1]).toEqual('b');
            expect(top[2]).toEqual('c');
        });
    });

    describe('clear()', () => {
        it('removes all elements', () => {
            const tb = new TopBlocked();
            tb.add('x');
            tb.add('y');
            tb.clear();
            expect(tb.getTop(10, () => 0).length).toEqual(0);
        });
    });

    describe('setData()', () => {
        it('replaces existing data with the provided array', () => {
            const tb = new TopBlocked();
            tb.add('old');
            tb.setData(['new1', 'new2']);
            const top = tb.getTop(5, () => 0);
            expect(top).toContain('new1');
            expect(top).toContain('new2');
            expect(top).not.toContain('old');
        });
    });
});
