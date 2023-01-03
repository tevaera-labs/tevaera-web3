import "mocha";
import { assert } from "chai";

import * as tevaera from "../src/index";

describe("tevaera-web3", () => {
  it("should be an object", () => {
    assert.isObject(tevaera);
  });

  it("should have a CitizenId property", () => {
    assert.property(tevaera, "CitizenId");
  });

  it("should have a Claim property", () => {
    assert.property(tevaera, "Claim");
  });

  it("should have a Guardians property", () => {
    assert.property(tevaera, "Guardians");
  });

  it("should have a KarmaPoint property", () => {
    assert.property(tevaera, "KarmaPoint");
  });

  it("should have a types property", () => {
    assert.property(tevaera, "types");
  });
});
