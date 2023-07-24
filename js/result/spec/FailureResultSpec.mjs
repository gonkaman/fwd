import { result } from "../lib/index.js";

describe('Failure result', function(){
    let fnResult = result.failure("error message");

    it('should be false when asked is success', function() {

        expect(fnResult.isSuccess()).toEqual(false);
    });

    it('should be true when asked is not success', function() {

        expect(!fnResult.isSuccess()).toEqual(true);
    });
    
});