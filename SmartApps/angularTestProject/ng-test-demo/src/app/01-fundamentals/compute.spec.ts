import {compute} from './compute'

describe('compute', () => {
    it('should return 0 if input is negative', () => {
        const res = compute(-1);
        expect(res).toBe(0);
    });
    it('should increment the input if it is positive', () => {
        const res = compute(1);
        expect(res).toBe(2);
    });
});