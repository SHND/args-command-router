import { expect } from 'chai'
import { BlockPathItem } from '../../src/PathTree/BlockPathItem';
import { StaticPathItem } from '../../src/PathTree/StaticPathItem';
import { DynamicPathItem } from '../../src/PathTree/DynamicPathItem';
import { SwitchPathItem } from '../../src/PathTree/SwitchPathItem';
import { Switch } from '../../src/Switch';
import { RootPathItem } from '../../src/PathTree/RootPathItem';


class TestBlockPathItem extends BlockPathItem {
  public getUniqueName = (shortForm: boolean) => {
    return 'uniqueName'
  }

  public isRootPathItem = () => false;

  public getDynamicPathItemName: () => string | null = () => null;
}

describe('BlockPathItem', () => {
  it('instantiating BlockPathItem subClass', () => {
    const pathItem = new TestBlockPathItem();
  });

  describe('getCommonSwitchNames', () => {
    it('getCommonSwitchNames when no commonSwitchNames exist', () => {
      const pathItem = new TestBlockPathItem();

      expect(pathItem.getCommonSwitchNames()).deep.equal({});
    });

    it('getCommonSwitchNames when some commonSwitchNames exist', () => {
      const pathItem = new TestBlockPathItem();

      const aSwitch = new Switch('a', 'aa')
      const bSwitch = new Switch('b', 'bb');

      pathItem.addCommonRequiredSwitch(aSwitch);
      pathItem.addCommonOptionalSwitch(bSwitch);

      expect(pathItem.getCommonSwitchNames()).deep.equal({ a: aSwitch, aa: aSwitch, b: bSwitch, bb: bSwitch });
    });
  });

  it('addDownwardCommonRequiredSwitchesAndUpdateParents', () => {
    const blockPathItem1 = new StaticPathItem('static1', null);
    const blockPathItem2 = new StaticPathItem('static2', blockPathItem1);

    const aSwitch = new Switch('a', 'aa');
    const bSwitch = new Switch('b', null);
    const cSwitch = new Switch(null, 'cc');

    const dSwitch = new Switch('d', 'dd');
    const eSwitch = new Switch('e', null);
    const fSwitch = new Switch(null, 'ff');

    blockPathItem1.addDownwardCommonRequiredSwitchesAndUpdateParents(aSwitch);
    blockPathItem1.addDownwardCommonRequiredSwitchesAndUpdateParents(bSwitch);
    blockPathItem1.addDownwardCommonRequiredSwitchesAndUpdateParents(cSwitch);
    blockPathItem2.addDownwardCommonRequiredSwitchesAndUpdateParents(dSwitch);
    blockPathItem2.addDownwardCommonRequiredSwitchesAndUpdateParents(eSwitch);
    blockPathItem2.addDownwardCommonRequiredSwitchesAndUpdateParents(fSwitch);

    expect(blockPathItem1.getDownwardCommonRequiredSwitches()).deep.equal([aSwitch, bSwitch, cSwitch, dSwitch, eSwitch, fSwitch]);
    expect(blockPathItem1.getDownwardShortCommonRequiredSwitches()).deep.equal({ a: aSwitch, b: bSwitch, d: dSwitch, e: eSwitch });
    expect(blockPathItem1.getDownwardLongCommonRequiredSwitches()).deep.equal({ aa: aSwitch, cc: cSwitch, dd: dSwitch, ff: fSwitch });

    expect(blockPathItem2.getDownwardCommonRequiredSwitches()).deep.equal([dSwitch, eSwitch, fSwitch]);
    expect(blockPathItem2.getDownwardShortCommonRequiredSwitches()).deep.equal({ d: dSwitch, e: eSwitch });
    expect(blockPathItem2.getDownwardLongCommonRequiredSwitches()).deep.equal({ dd: dSwitch, ff: fSwitch });
  });

  it('addDownwardCommonOptionalSwitchesAndUpdateParents', () => {
    const blockPathItem1 = new StaticPathItem('static1', null);
    const blockPathItem2 = new StaticPathItem('static2', blockPathItem1);

    const aSwitch = new Switch('a', 'aa');
    const bSwitch = new Switch('b', 'bb');

    blockPathItem1.addDownwardCommonOptionalSwitchesAndUpdateParents(aSwitch);
    blockPathItem2.addDownwardCommonOptionalSwitchesAndUpdateParents(bSwitch);

    expect(blockPathItem1.getDownwardCommonOptionalSwitches()).deep.equal([aSwitch, bSwitch]);
    expect(blockPathItem1.getDownwardShortCommonOptionalSwitches()).deep.equal({ a: aSwitch, b: bSwitch });
    expect(blockPathItem1.getDownwardLongCommonOptionalSwitches()).deep.equal({ aa: aSwitch, bb: bSwitch });

    expect(blockPathItem2.getDownwardCommonOptionalSwitches()).deep.equal([bSwitch]);
    expect(blockPathItem2.getDownwardShortCommonOptionalSwitches()).deep.equal({ b: bSwitch });
    expect(blockPathItem2.getDownwardLongCommonOptionalSwitches()).deep.equal({ bb: bSwitch });
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

  it('switchPathItems property, addSwitchPathItem methods', () => {
    const blockPathItem = new TestBlockPathItem();

    expect(blockPathItem.getSwitchPathItems()).to.lengthOf(0);

    const switchPathItem = new SwitchPathItem('', null);
    blockPathItem.addSwitchPathItem(switchPathItem);
    expect(blockPathItem.getSwitchPathItems()).to.lengthOf(1);
  });

  it('commonRequiredSwitches property, addCommonRequiredSwitch methods', () => {
    const blockPathItem = new TestBlockPathItem();
    const swich = new Switch('a', 'aa');

    expect(blockPathItem.getCommonRequiredSwitches()).to.lengthOf(0);

    blockPathItem.addCommonRequiredSwitch(swich);
    expect(blockPathItem.getCommonRequiredSwitches()).to.lengthOf(1);
    expect(blockPathItem.getCommonRequiredSwitches()[0]).to.equal(swich);
  });

  it('hasCommonRequiredSwitchWithShortname', () => {
    const blockPathItem = new TestBlockPathItem();

    expect(blockPathItem.hasCommonRequiredSwitchWithShortname('a')).be.false;
    expect(blockPathItem.hasCommonRequiredSwitchWithShortname('b')).be.false;
    expect(blockPathItem.hasCommonRequiredSwitchWithShortname('c')).be.false;
    blockPathItem.addCommonRequiredSwitch(new Switch('a', null));
    blockPathItem.addCommonRequiredSwitch(new Switch('b', 'bb'));
    expect(blockPathItem.hasCommonRequiredSwitchWithShortname('a')).be.true;
    expect(blockPathItem.hasCommonRequiredSwitchWithShortname('b')).be.true;
    expect(blockPathItem.hasCommonRequiredSwitchWithShortname('c')).be.false;
  });

  it('hasCommonRequiredSwitchWithLongname', () => {
    const blockPathItem = new TestBlockPathItem();

    expect(blockPathItem.hasCommonRequiredSwitchWithLongname('aa')).be.false;
    expect(blockPathItem.hasCommonRequiredSwitchWithLongname('bb')).be.false;
    expect(blockPathItem.hasCommonRequiredSwitchWithLongname('cc')).be.false;
    blockPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));
    blockPathItem.addCommonRequiredSwitch(new Switch('b', 'bb'));
    expect(blockPathItem.hasCommonRequiredSwitchWithLongname('aa')).be.true;
    expect(blockPathItem.hasCommonRequiredSwitchWithLongname('bb')).be.true;
    expect(blockPathItem.hasCommonRequiredSwitchWithLongname('cc')).be.false;
  });

  it('hasCommonOptionalSwitchWithShortname', () => {
    const blockPathItem = new TestBlockPathItem();

    expect(blockPathItem.hasCommonOptionalSwitchWithShortname('a')).be.false;
    expect(blockPathItem.hasCommonOptionalSwitchWithShortname('b')).be.false;
    expect(blockPathItem.hasCommonOptionalSwitchWithShortname('c')).be.false;
    blockPathItem.addCommonOptionalSwitch(new Switch('a', null));
    blockPathItem.addCommonOptionalSwitch(new Switch('b', 'bb'));
    expect(blockPathItem.hasCommonOptionalSwitchWithShortname('a')).be.true;
    expect(blockPathItem.hasCommonOptionalSwitchWithShortname('b')).be.true;
    expect(blockPathItem.hasCommonOptionalSwitchWithShortname('c')).be.false;
  });

  it('hasCommonOptionalSwitchWithLongname', () => {
    const blockPathItem = new TestBlockPathItem();

    expect(blockPathItem.hasCommonOptionalSwitchWithLongname('aa')).be.false;
    expect(blockPathItem.hasCommonOptionalSwitchWithLongname('bb')).be.false;
    expect(blockPathItem.hasCommonOptionalSwitchWithLongname('cc')).be.false;
    blockPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));
    blockPathItem.addCommonOptionalSwitch(new Switch('b', 'bb'));
    expect(blockPathItem.hasCommonOptionalSwitchWithLongname('aa')).be.true;
    expect(blockPathItem.hasCommonOptionalSwitchWithLongname('bb')).be.true;
    expect(blockPathItem.hasCommonOptionalSwitchWithLongname('cc')).be.false;
  });

  describe('Adding common switches when the name is already used', () => {
    it('For when leaf PathItem in PathTree branch has the shortCommonRequiredSwitchName', () => {
      const rootPathItem = new RootPathItem();
      
      rootPathItem.addCommonRequiredSwitch(new Switch('a', null));

      expect(() => {
        rootPathItem.addCommonRequiredSwitch(new Switch('a', null));
      }).throws();

      expect(() => {
        rootPathItem.addCommonOptionalSwitch(new Switch('a', null));
      }).throws();
    });

    it('For when leaf PathItem in PathTree branch has the shortCommonOptionalSwitchName', () => {
      const rootPathItem = new RootPathItem();
      
      rootPathItem.addCommonOptionalSwitch(new Switch('a', null));

      expect(() => {
        rootPathItem.addCommonRequiredSwitch(new Switch('a', null));
      }).throws();

      expect(() => {
        rootPathItem.addCommonOptionalSwitch(new Switch('a', null));
      }).throws();
    });

    it('For when leaf PathItem in PathTree branch has the longCommonRequiredSwitchName', () => {
      const rootPathItem = new RootPathItem();
      
      rootPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));

      expect(() => {
        rootPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));
      }).throws();

      expect(() => {
        rootPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));
      }).throws();
    });

    it('For when leaf PathItem in PathTree branch has the longCommonOptionalSwitchName', () => {
      const rootPathItem = new RootPathItem();
      
      rootPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));

      expect(() => {
        rootPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));
      }).throws();

      expect(() => {
        rootPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));
      }).throws();
    });

    //------------

    it('For when higher PathItem in PathTree branch has the shortCommonRequiredSwitchName', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static1', rootPathItem);
      
      rootPathItem.addCommonRequiredSwitch(new Switch('a', null));

      expect(() => {
        staticPathItem.addCommonRequiredSwitch(new Switch('a', null));
      }).throws();

      expect(() => {
        staticPathItem.addCommonOptionalSwitch(new Switch('a', null));
      }).throws();
    });

    it('For when higher PathItem in PathTree branch has the shortCommonOptionalSwitchName', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static1', rootPathItem);
      
      rootPathItem.addCommonOptionalSwitch(new Switch('a', null));

      expect(() => {
        staticPathItem.addCommonRequiredSwitch(new Switch('a', null));
      }).throws();

      expect(() => {
        staticPathItem.addCommonOptionalSwitch(new Switch('a', null));
      }).throws();
    });

    it('For when higher PathItem in PathTree branch has the longCommonRequiredSwitchName', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static1', rootPathItem);
      
      rootPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));

      expect(() => {
        staticPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));
      }).throws();

      expect(() => {
        staticPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));
      }).throws();
    });

    it('For when higher PathItem in PathTree branch has the longCommonOptionalSwitchName', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static1', rootPathItem);
      
      rootPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));

      expect(() => {
        staticPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));
      }).throws();

      expect(() => {
        staticPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));
      }).throws();
    });

  });

  it('optionalCommonSwitches property, addCommonOptionalSwitch methods', () => {
    const blockPathItem = new TestBlockPathItem();
    const swich = new Switch('a', 'aa');

    expect(blockPathItem.getCommonOptionalSwitches()).to.lengthOf(0);

    blockPathItem.addCommonOptionalSwitch(swich);
    expect(blockPathItem.getCommonOptionalSwitches()).to.lengthOf(1);
    expect(blockPathItem.getCommonOptionalSwitches()[0]).to.equal(swich);
  });

})
