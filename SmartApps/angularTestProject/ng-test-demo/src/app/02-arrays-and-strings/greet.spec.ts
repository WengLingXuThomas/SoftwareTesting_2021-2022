import {greet} from './greet'

describe('greet', () => {
    it('it should include the name in the message', () => {
        const res = greet('Thomas')
        expect(res).toContain('Thomas');
    });
});