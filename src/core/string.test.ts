import {getTextDirection} from "./string";

describe("Playground#getTextDirection", () => {
    it("returns rtl", () => {
        expect(getTextDirection("וַ⁠יַּ֥עַשׂ")).toEqual('rtl');
    });
    it("returns ltr", () => {
        expect(getTextDirection("hello")).toEqual('ltr');
    });
});