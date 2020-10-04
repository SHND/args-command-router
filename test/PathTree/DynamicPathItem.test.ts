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

    pathItem.addRequiredSwitch(new Switch('a', 'aa'));
    expect(pathItem.getCommonSwitchNames()).deep.equal({});

    pathItem.addOptionalSwitch(new Switch('b', 'bb'));
    expect(pathItem.getCommonSwitchNames()).deep.equal({});

    pathItem.addCommonRequiredSwitch(new Switch('c', null));
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: true });

    pathItem.addCommonRequiredSwitch(new Switch(null, 'dd'));
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: true, dd: true });

    pathItem.addCommonRequiredSwitch(new Switch('e', 'ee'));
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: true, dd: true, e: true, ee: true });

    pathItem.addCommonOptionalSwitch(new Switch('f', null));
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: true, dd: true, e: true, ee: true, f: true });

    pathItem.addCommonOptionalSwitch(new Switch(null, 'gg'));
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: true, dd: true, e: true, ee: true, f: true, gg: true });

    pathItem.addCommonOptionalSwitch(new Switch('h', 'hh'));
    expect(pathItem.getCommonSwitchNames()).deep.equal({ c: true, dd: true, e: true, ee: true, f: true, gg: true, h: true, hh: true });
  });

  it('getDynamicPathItemName', () => {
    const pathItem = new DynamicPathItem('name1', null);

    expect(pathItem.getDynamicPathItemName()).equal('name1')
  });

});
