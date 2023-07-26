import { result } from "../lib/index.js";

describe('Success result', function(){
    let fnResult = result.success("data");

    it('should be true when asked is success', function() {

        expect(fnResult.isSuccess()).toEqual(true);
    });
    
});