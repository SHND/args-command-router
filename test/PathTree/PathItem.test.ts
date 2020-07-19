import { expect } from 'chai'
import { PathItem } from '../../src/PathTree/PathItem';
import { Switch } from '../../src/Switch';


class TestPathItem extends PathItem {
  public getUniqueName = (shortForm: boolean) => {
    return 'uniqueName'
  }
}

describe('PathItem', () => {
  it('instantiating PathItem subClass', () => {
    const pathItem = new TestPathItem();
  });

  it ('description property, getDescription, setDescription methods', () => {
    const pathItem = new TestPathItem();
    expect(pathItem.getDescription()).to.equal(undefined)
    pathItem.setDescription("description 1");
    expect(pathItem.getDescription()).to.equal('description 1');
  });

  it('callbacks property, callback addCallback, removeCallback methods', () => {
    const pathItem = new TestPathItem();
    const callback = () => {};

    expect(pathItem.getCallbacks()).have.lengthOf(0);

    pathItem.addCallback(callback);
    expect(pathItem.getCallbacks()).have.lengthOf(1);
    expect(pathItem.getCallbacks()[0]).to.equal(callback);

    pathItem.removeCallback(callback);
    expect(pathItem.getCallbacks()).have.lengthOf(0);
  });

  it('helpCallback property, getHelpCallback, setHelpCallback methods', () => {
    const pathItem = new TestPathItem();
    const callback = () => {};

    expect(pathItem.getHelpCallback()).to.equal(undefined);
    
    pathItem.setHelpCallback(callback);
    expect(pathItem.getHelpCallback()).to.equal(callback);
  });

  it('requiredSwitches property, addRequiredSwitch, removeRequiredSwitch methods', () => {
    const pathItem = new TestPathItem();
    const swich = new Switch('a', 'aa');

    expect(pathItem.getRequiredSwitches()).to.lengthOf(0);

    pathItem.addRequiredSwitch(swich);
    expect(pathItem.getRequiredSwitches()).to.lengthOf(1);
    expect(pathItem.getRequiredSwitches()[0]).to.equal(swich);

    pathItem.removeRequiredSwitch(swich);
    expect(pathItem.getRequiredSwitches()).to.length(0)
  });

  it('optionalSwitches property, addOptionalSwitch, removeOptionalSwitch methods', () => {
    const pathItem = new TestPathItem();
    const swich = new Switch('a', 'aa');

    expect(pathItem.getOptionalSwitches()).to.lengthOf(0);

    pathItem.addOptionalSwitch(swich);
    expect(pathItem.getOptionalSwitches()).to.lengthOf(1);
    expect(pathItem.getOptionalSwitches()[0]).to.equal(swich);

    pathItem.removeOptionalSwitch(swich);
    expect(pathItem.getOptionalSwitches()).to.length(0)
  });

})
