import { expect } from 'chai'
import { BlockPathItem } from '../../src/PathTree/BlockPathItem';
import { StaticPathItem } from '../../src/PathTree/StaticPathItem';
import { DynamicPathItem } from '../../src/PathTree/DynamicPathItem';
import { SwitchPathItem } from '../../src/PathTree/SwitchPathItem';
import { Switch } from '../../src/Switch';


class TestBlockPathItem extends BlockPathItem {
  public getUniqueName = (shortForm: boolean) => {
    return 'uniqueName'
  }

  public isRootPathItem = () => false;
}

describe('BlockPathItem', () => {
  it('instantiating BlockPathItem subClass', () => {
    const pathItem = new TestBlockPathItem();
  });

  it('name property, getName, setName methods', () => {
    const blockPathItem = new TestBlockPathItem();

    expect(blockPathItem.getName()).to.equal(undefined);

    blockPathItem.setName('name1');
    expect(blockPathItem.getName()).to.equal('name1');
  });

  it('staticPathItems property, getStaticPathItem, getStaticPathItems, hasStaticPathItem, addStaticPathItem methods', () => {
    const blockPathItem = new TestBlockPathItem();
    
    expect(Object.keys(blockPathItem.getStaticPathItems())).to.lengthOf(0);
    expect(blockPathItem.hasStaticPathItem('name1')).to.equal(false);
    
    expect(() => {
      blockPathItem.getStaticPathItem('name1')
    }).throws();

    const staticPathItem = new StaticPathItem('name1', null);

    blockPathItem.addStaticPathItem(staticPathItem);
    expect(Object.keys(blockPathItem.getStaticPathItems())).to.lengthOf(1);
    expect(blockPathItem.hasStaticPathItem('name1')).to.equal(true);
    expect(blockPathItem.getStaticPathItem('name1')).to.equal(staticPathItem);
  });

  it('dynamicPathItem property, getDynamicPathItem, setDynamicPathItem, hasDynamicPathItem methods', () => {
    const blockPathItem = new TestBlockPathItem();

    expect(blockPathItem.hasDynamicPathItem()).to.equal(false);
    expect(blockPathItem.getDynamicPathItem()).to.equal(undefined);

    const dynamicPathItem = new DynamicPathItem('name1', null);
    blockPathItem.setDynamicPathItem(dynamicPathItem);
    expect(blockPathItem.getDynamicPathItem()).to.equal(dynamicPathItem);
  });

  it('switchPathItems property, addSwitchPathItem, removeSwitchPathItem methods', () => {
    const blockPathItem = new TestBlockPathItem();

    expect(blockPathItem.getSwitchPathItems()).to.lengthOf(0);

    const switchPathItem = new SwitchPathItem('', null);
    blockPathItem.addSwitchPathItem(switchPathItem);
    expect(blockPathItem.getSwitchPathItems()).to.lengthOf(1);

    blockPathItem.removeSwitchPathItem(switchPathItem);
    expect(blockPathItem.getSwitchPathItems()).to.lengthOf(0);
  });

  it('commonRequiredSwitches property, addCommonRequiredSwitch, removeCommonRequiredSwitch methods', () => {
    const blockPathItem = new TestBlockPathItem();
    const swich = new Switch('a', 'aa');

    expect(blockPathItem.getCommonRequiredSwitches()).to.lengthOf(0);

    blockPathItem.addCommonRequiredSwitch(swich);
    expect(blockPathItem.getCommonRequiredSwitches()).to.lengthOf(1);
    expect(blockPathItem.getCommonRequiredSwitches()[0]).to.equal(swich);

    blockPathItem.removeCommonRequiredSwitch(swich);
    expect(blockPathItem.getCommonRequiredSwitches()).to.length(0)
  });

  it('optionalCommonSwitches property, addCommonOptionalSwitch, removeCommonOptionalSwitch methods', () => {
    const blockPathItem = new TestBlockPathItem();
    const swich = new Switch('a', 'aa');

    expect(blockPathItem.getCommonOptionalSwitches()).to.lengthOf(0);

    blockPathItem.addCommonOptionalSwitch(swich);
    expect(blockPathItem.getCommonOptionalSwitches()).to.lengthOf(1);
    expect(blockPathItem.getCommonOptionalSwitches()[0]).to.equal(swich);

    blockPathItem.removeCommonOptionalSwitch(swich);
    expect(blockPathItem.getCommonOptionalSwitches()).to.length(0)
  });

})
