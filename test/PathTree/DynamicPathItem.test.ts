import { expect } from 'chai'
import { DynamicPathItem } from '../../src/PathTree/DynamicPathItem';
import { Switch } from '../../src/Switch';

describe('DynamicPathItem', () => {
  it('instantiating DynamicPathItem subClass', () => {
    const pathItem = new DynamicPathItem('name1', null);
  });

  it('getUniqueName method', () => {
    const pathItem = new DynamicPathItem('name1', null);

    expect(pathItem.getUniqueName(false)).to.equal(':name1');
    expect(pathItem.getUniqueName(true)).to.equal('name1');
  });
  
  it('getCommonSwitchNames', () => {
    const pathItem = new DynamicPathItem('name1', null);

    expect(pathItem.getCommonSwitchNames()).deep.equal({});

    const aSwitch = new Switch('a', 'aa');
    pathItem.addRequiredSwitch(aSwitch);
    expect(pathItem.getCommonSwitchNames()).deep.equal({});

    const bSwitch = new Switch('b', 'bb');
    pathItem.addOptionalSwitch(bSwitch);
    expect(pathItem.getCommonSwitchNames()).deep.equal({});

    const cSwitch = new Switch('c', null);
    pathItem.addCommonRequiredSwitch(cSwitch);
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: cSwitch });

    const dSwitch = new Switch(null, 'dd');
    pathItem.addCommonRequiredSwitch(dSwitch);
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: cSwitch, dd: dSwitch });

    const eSwitch = new Switch('e', 'ee');
    pathItem.addCommonRequiredSwitch(eSwitch);
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: cSwitch, dd: dSwitch, e: eSwitch, ee: eSwitch });

    const fSwitch = new Switch('f', null);
    pathItem.addCommonOptionalSwitch(fSwitch);
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: cSwitch, dd: dSwitch, e: eSwitch, ee: eSwitch, f: fSwitch });

    const gSwitch = new Switch(null, 'gg');
    pathItem.addCommonOptionalSwitch(gSwitch);
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: cSwitch, dd: dSwitch, e: eSwitch, ee: eSwitch, f: fSwitch, gg: gSwitch });

    const hSwitch = new Switch('h', 'hh');
    pathItem.addCommonOptionalSwitch(hSwitch);
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: cSwitch, dd: dSwitch, e: eSwitch, ee: eSwitch, f: fSwitch, gg: gSwitch, h: hSwitch, hh: hSwitch });
  });

  it('getDynamicPathItemName', () => {
    const pathItem = new DynamicPathItem('name1', null);

    expect(pathItem.getDynamicPathItemName()).equal('name1')
  });

});
