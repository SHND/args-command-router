import { expect } from 'chai'
import { PathItem } from '../../src/PathTree/PathItem';
import { Switch } from '../../src/Switch';
import { RootPathItem } from '../../src/PathTree/RootPathItem';
import { StaticPathItem } from '../../src/PathTree/StaticPathItem';
import { DynamicPathItem } from '../../src/PathTree/DynamicPathItem';
import { SwitchPathItem } from '../../src/PathTree/SwitchPathItem';


class TestPathItem extends PathItem {

  public name: string;

  constructor(name = 'uniqueName', parent: PathItem = null) {
    super();
    this.name = name;
    this.parentPathItem = parent;
  }

  public getUniqueName = (shortForm: boolean = false) => {
    return `${shortForm ? 'short' : 'long'}_${this.name}`;
  }
}

describe('PathItem', () => {
  it('instantiating PathItem subClass', () => {
    const pathItem = new TestPathItem();
  });

  it('parentPathItem property, getParentPathItem, setParentPathItem method', () => {
    const pathItem = new TestPathItem();
    const parentPathItem = new TestPathItem();
    expect(pathItem.getParentPathItem()).to.equal(null);
    pathItem.setParentPathItem(parentPathItem);
    expect(pathItem.getParentPathItem()).to.equal(parentPathItem);
  });

  it ('description property, getDescription, setDescription methods', () => {
    const pathItem = new TestPathItem();
    expect(pathItem.getDescription()).to.equal(undefined)
    pathItem.setDescription("description 1");
    expect(pathItem.getDescription()).to.equal('description 1');
  });

  it('callbacks property, callback addCallback, hasCallback, removeCallback methods', () => {
    const pathItem = new TestPathItem();
    const callback = () => {};

    expect(pathItem.getCallbacks()).have.lengthOf(0);
    expect(pathItem.hasCallback(callback)).to.equal(false);

    pathItem.addCallback(callback);
    pathItem.addCallback(callback);
    expect(pathItem.getCallbacks()).have.lengthOf(1);
    expect(pathItem.getCallbacks()[0]).to.equal(callback);
    expect(pathItem.hasCallback(callback)).to.equal(true);

    pathItem.removeCallback(callback);
    pathItem.removeCallback(callback);
    expect(pathItem.getCallbacks()).have.lengthOf(0);
    expect(pathItem.hasCallback(callback)).to.equal(false);
  });

  it('helpCallback property, getHelpCallback, setHelpCallback methods', () => {
    const pathItem = new TestPathItem();
    const callback = () => {};

    expect(pathItem.getHelpCallback()).to.equal(undefined);
    
    pathItem.setHelpCallback(callback);
    expect(pathItem.getHelpCallback()).to.equal(callback);
  });

  it('requiredSwitches property, getRequiredSwitches, addRequiredSwitch, hasRequiredSwitch, removeRequiredSwitch methods', () => {
    const pathItem = new TestPathItem();
    const swich = new Switch('a', 'aa');

    expect(pathItem.getRequiredSwitches()).to.lengthOf(0);
    expect(pathItem.hasRequiredSwitch(swich)).to.false;

    pathItem.addRequiredSwitch(swich);
    pathItem.addRequiredSwitch(swich);
    expect(pathItem.getRequiredSwitches()).to.lengthOf(1);
    expect(pathItem.getRequiredSwitches()[0]).to.equal(swich);
    expect(pathItem.hasRequiredSwitch(swich)).to.true;

    pathItem.removeRequiredSwitch(swich);
    pathItem.removeRequiredSwitch(swich);
    expect(pathItem.getRequiredSwitches()).to.length(0);
    expect(pathItem.hasRequiredSwitch(swich)).to.false;
  });

  it('optionalSwitches property, getOptionalSwitches, addOptionalSwitch, hasOptionalSwitch, removeOptionalSwitch methods', () => {
    const pathItem = new TestPathItem();
    const swich = new Switch('a', 'aa');

    expect(pathItem.getOptionalSwitches()).to.lengthOf(0);
    expect(pathItem.hasOptionalSwitch(swich)).to.false;

    pathItem.addOptionalSwitch(swich);
    pathItem.addOptionalSwitch(swich);
    expect(pathItem.getOptionalSwitches()).to.lengthOf(1);
    expect(pathItem.getOptionalSwitches()[0]).to.equal(swich);
    expect(pathItem.hasOptionalSwitch(swich)).to.true;

    pathItem.removeOptionalSwitch(swich);
    pathItem.removeOptionalSwitch(swich);
    expect(pathItem.getOptionalSwitches()).to.length(0);
    expect(pathItem.hasOptionalSwitch(swich)).to.false;
  });

  it('path() for no parents', () => {
    const pathItem = new TestPathItem('name');

    expect(pathItem.path(true)).equal('/short_name');
    expect(pathItem.path(false)).equal('/long_name');
  });

  it('path() for with one parent', () => {
    const pathItem1 = new TestPathItem('p1');
    const pathItem2 = new TestPathItem('p2', pathItem1);

    expect(pathItem2.path(true)).equal('/short_p1/short_p2');
    expect(pathItem2.path(false)).equal('/long_p1/long_p2');
  });

  it('path() for with two parent', () => {
    const pathItem1 = new TestPathItem('p1');
    const pathItem2 = new TestPathItem('p2', pathItem1);
    const pathItem3 = new TestPathItem('p3', pathItem2);

    expect(pathItem3.path(true)).equal('/short_p1/short_p2/short_p3');
    expect(pathItem3.path(false)).equal('/long_p1/long_p2/long_p3');
  });

  it('path() for StaticPathItem with RootPathItem parent', () => {
    const rootPathItem = new RootPathItem();
    const staticPathItem = new StaticPathItem('static1', rootPathItem);
    rootPathItem.addStaticPathItem(staticPathItem);

    expect(staticPathItem.path(true)).equal('/static1');
    expect(staticPathItem.path(false)).equal('/static1');
  });

  it('path() for DynamicPathItem with RootPathItem parent', () => {
    const rootPathItem = new RootPathItem();
    const dynamicPathItem = new DynamicPathItem('dynamic1', rootPathItem);
    rootPathItem.setDynamicPathItem(dynamicPathItem);

    expect(dynamicPathItem.path(true)).equal('/dynamic1');
    expect(dynamicPathItem.path(false)).equal('/:dynamic1');
  });

  it('path() for SwitchPathItem with RootPathItem parent', () => {
    const rootPathItem = new RootPathItem();
    const switchPathItem = new SwitchPathItem('[a]', rootPathItem);
    rootPathItem.addSwitchPathItem(switchPathItem);

    expect(switchPathItem.path(true)).equal('/[a]');
    expect(switchPathItem.path(false)).equal('/[a]');
  });

})
