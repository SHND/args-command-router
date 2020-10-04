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

  public isRootPathItem = () => false;

  public getCommonSwitchNames = () => ({});
  
  public getDynamicPathItemName: () => string | null = () => null;
}

describe('PathItem', () => {
  it('instantiating PathItem subClass', () => {
    const pathItem = new TestPathItem();
  });

  describe('isInRootPathItemBranch', () => {
    it('isInRootPathItemBranch when pathItem is RootPathItem', () => {
      const rootPathItem = new RootPathItem();

      expect(rootPathItem.isInRootPathItemBranch()).be.true;
    });

    it('isInRootPathItemBranch when pathItem is in branch starting with RootPathItem', () => {
      const rootPathItem = new RootPathItem();
      const pathItem1 = new TestPathItem('name', rootPathItem);

      expect(pathItem1.isInRootPathItemBranch()).be.true;
    });

    it('isInRootPathItemBranch when pathItem is Not in branch starting with RootPathItem', () => {
      const pathItem1 = new TestPathItem('name', null);

      expect(pathItem1.isInRootPathItemBranch()).be.false;
    });
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

  it('requiredSwitches property, getRequiredSwitches, addRequiredSwitch, hasRequiredSwitch, hasRequiredSwitchWithShortname, hasRequiredSwitchWithLongname, removeRequiredSwitch methods', () => {
    const pathItem = new TestPathItem();
    const swich = new Switch('a', 'aa');

    expect(pathItem.getRequiredSwitches()).to.lengthOf(0);
    expect(pathItem.hasRequiredSwitch(swich)).to.false;
    expect(pathItem.hasRequiredSwitchWithShortname('a')).to.false;
    expect(pathItem.hasRequiredSwitchWithLongname('aa')).to.false;

    pathItem.addRequiredSwitch(swich);
    expect(() => {
      pathItem.addRequiredSwitch(swich);
    }).throws();
    expect(pathItem.getRequiredSwitches()).to.lengthOf(1);
    expect(pathItem.getRequiredSwitches()[0]).to.equal(swich);
    expect(pathItem.hasRequiredSwitch(swich)).to.true;
    expect(pathItem.hasRequiredSwitchWithShortname('a')).to.true;
    expect(pathItem.hasRequiredSwitchWithLongname('aa')).to.true;

    pathItem.removeRequiredSwitch(swich);
    pathItem.removeRequiredSwitch(swich);
    expect(pathItem.getRequiredSwitches()).to.length(0);
    expect(pathItem.hasRequiredSwitch(swich)).to.false;
    expect(pathItem.hasRequiredSwitchWithShortname('a')).to.false;
    expect(pathItem.hasRequiredSwitchWithLongname('aa')).to.false;
  });

  it('optionalSwitches property, getOptionalSwitches, addOptionalSwitch, hasOptionalSwitch, hasOptionalSwitchWithShortname, hasOptionalSwitchWithLongname, removeOptionalSwitch methods', () => {
    const pathItem = new TestPathItem();
    const swich = new Switch('a', 'aa');

    expect(pathItem.getOptionalSwitches()).to.lengthOf(0);
    expect(pathItem.hasOptionalSwitch(swich)).to.false;
    expect(pathItem.hasOptionalSwitchWithShortname('a')).to.false;
    expect(pathItem.hasOptionalSwitchWithLongname('aa')).to.false;

    pathItem.addOptionalSwitch(swich);
    expect(() => {
      pathItem.addOptionalSwitch(swich);
    }).throws();
    expect(pathItem.getOptionalSwitches()).to.lengthOf(1);
    expect(pathItem.getOptionalSwitches()[0]).to.equal(swich);
    expect(pathItem.hasOptionalSwitch(swich)).to.true;
    expect(pathItem.hasOptionalSwitchWithShortname('a')).to.true;
    expect(pathItem.hasOptionalSwitchWithLongname('aa')).to.true;

    pathItem.removeOptionalSwitch(swich);
    pathItem.removeOptionalSwitch(swich);
    expect(pathItem.getOptionalSwitches()).to.length(0);
    expect(pathItem.hasOptionalSwitch(swich)).to.false;
    expect(pathItem.hasOptionalSwitchWithShortname('a')).to.false;
    expect(pathItem.hasOptionalSwitchWithLongname('aa')).to.false;
  });

  describe('Adding switches when the name is already used', () => {
    it('For when leaf PathItem in PathTree branch has the shortCommonRequiredSwitchName', () => {
      const rootPathItem = new RootPathItem();
      
      rootPathItem.addCommonRequiredSwitch(new Switch('a', null));

      expect(() => {
        rootPathItem.addRequiredSwitch(new Switch('a', null));
      }).throws();

      expect(() => {
        rootPathItem.addOptionalSwitch(new Switch('a', null));
      }).throws();
    });

    it('For when leaf PathItem in PathTree branch has the shortCommonOptionalSwitchName', () => {
      const rootPathItem = new RootPathItem();
      
      rootPathItem.addCommonOptionalSwitch(new Switch('a', null));

      expect(() => {
        rootPathItem.addRequiredSwitch(new Switch('a', null));
      }).throws();

      expect(() => {
        rootPathItem.addOptionalSwitch(new Switch('a', null));
      }).throws();
    });

    it('For when leaf PathItem in PathTree branch has the longCommonRequiredSwitchName', () => {
      const rootPathItem = new RootPathItem();
      
      rootPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));

      expect(() => {
        rootPathItem.addRequiredSwitch(new Switch(null, 'aa'));
      }).throws();

      expect(() => {
        rootPathItem.addOptionalSwitch(new Switch(null, 'aa'));
      }).throws();
    });

    it('For when leaf PathItem in PathTree branch has the longCommonOptionalSwitchName', () => {
      const rootPathItem = new RootPathItem();
      
      rootPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));

      expect(() => {
        rootPathItem.addRequiredSwitch(new Switch(null, 'aa'));
      }).throws();

      expect(() => {
        rootPathItem.addOptionalSwitch(new Switch(null, 'aa'));
      }).throws();
    });

    //------------

    it('For when higher PathItem in PathTree branch has the shortCommonRequiredSwitchName', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static1', rootPathItem);
      
      rootPathItem.addCommonRequiredSwitch(new Switch('a', null));

      expect(() => {
        staticPathItem.addRequiredSwitch(new Switch('a', null));
      }).throws();

      expect(() => {
        staticPathItem.addOptionalSwitch(new Switch('a', null));
      }).throws();
    });

    it('For when higher PathItem in PathTree branch has the shortCommonOptionalSwitchName', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static1', rootPathItem);
      
      rootPathItem.addCommonOptionalSwitch(new Switch('a', null));

      expect(() => {
        staticPathItem.addRequiredSwitch(new Switch('a', null));
      }).throws();

      expect(() => {
        staticPathItem.addOptionalSwitch(new Switch('a', null));
      }).throws();
    });

    it('For when higher PathItem in PathTree branch has the longCommonRequiredSwitchName', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static1', rootPathItem);
      
      rootPathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));

      expect(() => {
        staticPathItem.addRequiredSwitch(new Switch(null, 'aa'));
      }).throws();

      expect(() => {
        staticPathItem.addOptionalSwitch(new Switch(null, 'aa'));
      }).throws();
    });

    it('For when higher PathItem in PathTree branch has the longCommonOptionalSwitchName', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static1', rootPathItem);
      
      rootPathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));

      expect(() => {
        staticPathItem.addRequiredSwitch(new Switch(null, 'aa'));
      }).throws();

      expect(() => {
        staticPathItem.addOptionalSwitch(new Switch(null, 'aa'));
      }).throws();
    });

  });

  describe('path', () => {
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
  });

  describe('getBranchDynamicPathItemNames', () => {
    it('getBranchDynamicPathItemNames for only DynamicPathItem', () => {
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', null);

      expect(dynamicPathItem1.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: true });
    })

    it('getBranchDynamicPathItemNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> dynamicPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const dynamicPathItem2 = new DynamicPathItem('dynamic2', staticPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', dynamicPathItem2);

      expect(rootPathItem.getBranchDynamicPathItemNames()).deep.equal({});
      expect(dynamicPathItem1.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: true });
      expect(staticPathItem1.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: true });
      expect(dynamicPathItem2.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: true, dynamic2: true });
      expect(switchPathItem1.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: true, dynamic2: true });
    });
  });

  describe('getBranchCommonSwitchNames', () => {
    it('getBranchCommonSwitchNames() for only RootPathItem', () => {
      const rootPathItem = new RootPathItem();

      expect(rootPathItem.getBranchCommonSwitchNames()).deep.equal({});

      rootPathItem.addRequiredSwitch(new Switch('a', 'aa'));  
      rootPathItem.addOptionalSwitch(new Switch('b', 'bb'));  
      rootPathItem.addCommonRequiredSwitch(new Switch('c', null));  
      rootPathItem.addCommonRequiredSwitch(new Switch(null, 'dd'));  
      rootPathItem.addCommonRequiredSwitch(new Switch('e', 'ee'));  
      rootPathItem.addCommonOptionalSwitch(new Switch('f', null));  
      rootPathItem.addCommonOptionalSwitch(new Switch(null, 'gg'));  
      rootPathItem.addCommonOptionalSwitch(new Switch('h', 'hh'));

      expect(rootPathItem.getBranchCommonSwitchNames()).deep.equal({ c: true, dd: true, e: true, ee: true, f: true, gg: true, h: true, hh: true });
    });

    it('getBranchCommonSwitchNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', staticPathItem1);

      rootPathItem.addCommonRequiredSwitch(new Switch('a', 'a1'));
      rootPathItem.addCommonOptionalSwitch(new Switch('b', 'b1'));
      rootPathItem.addRequiredSwitch(new Switch('c', 'c1'));
      rootPathItem.addOptionalSwitch(new Switch('d', 'd1'));

      dynamicPathItem1.addCommonRequiredSwitch(new Switch('e', 'e1'));
      dynamicPathItem1.addCommonOptionalSwitch(new Switch('f', 'f1'));
      dynamicPathItem1.addRequiredSwitch(new Switch('g', 'g1'));
      dynamicPathItem1.addOptionalSwitch(new Switch('h', 'h1'));

      staticPathItem1.addCommonRequiredSwitch(new Switch('i', 'i1'));
      staticPathItem1.addCommonOptionalSwitch(new Switch('j', 'j1'));
      staticPathItem1.addRequiredSwitch(new Switch('k', 'k1'));
      staticPathItem1.addOptionalSwitch(new Switch('l', 'l1'));

      switchPathItem1.addRequiredSwitch(new Switch('m', 'm1'));
      switchPathItem1.addOptionalSwitch(new Switch('n', 'n1'));

      expect(rootPathItem.getBranchCommonSwitchNames()).deep.equal({ a: true, a1: true, b: true, b1: true });
      expect(dynamicPathItem1.getBranchCommonSwitchNames()).deep.equal({ a: true, a1: true, b: true, b1: true, e: true, e1: true, f: true, f1: true });
      expect(staticPathItem1.getBranchCommonSwitchNames()).deep.equal({ a: true, a1: true, b: true, b1: true, e: true, e1: true, f: true, f1: true, i: true, i1: true, j: true, j1: true });
      expect(switchPathItem1.getBranchCommonSwitchNames()).deep.equal({ a: true, a1: true, b: true, b1: true, e: true, e1: true, f: true, f1: true, i: true, i1: true, j: true, j1: true });
    });
  });

  describe('getDisAllowedDynamicPathItemNames', () => {
    it('getDisAllowedDynamicPathItemNames for only DynamicPathItem', () => {
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', null);

      expect(dynamicPathItem1.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: true });
    })

    it('getDisAllowedDynamicPathItemNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> dynamicPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const dynamicPathItem2 = new DynamicPathItem('dynamic2', staticPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', dynamicPathItem2);

      expect(rootPathItem.getDisAllowedDynamicPathItemNames()).deep.equal({});
      expect(dynamicPathItem1.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: true });
      expect(staticPathItem1.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: true });
      expect(dynamicPathItem2.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: true, dynamic2: true });
      expect(switchPathItem1.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: true, dynamic2: true });
    });
  });

  describe('getDisAllowedSwitchNames', () => {
    it('getDisAllowedSwitchNames() for only RootPathItem', () => {
      const rootPathItem = new RootPathItem();

      expect(rootPathItem.getDisAllowedSwitchNames()).deep.equal({});

      rootPathItem.addRequiredSwitch(new Switch('a', 'aa'));  
      rootPathItem.addOptionalSwitch(new Switch('b', 'bb'));  
      rootPathItem.addCommonRequiredSwitch(new Switch('c', null));  
      rootPathItem.addCommonRequiredSwitch(new Switch(null, 'dd'));  
      rootPathItem.addCommonRequiredSwitch(new Switch('e', 'ee'));  
      rootPathItem.addCommonOptionalSwitch(new Switch('f', null));  
      rootPathItem.addCommonOptionalSwitch(new Switch(null, 'gg'));  
      rootPathItem.addCommonOptionalSwitch(new Switch('h', 'hh'));

      expect(rootPathItem.getDisAllowedSwitchNames()).deep.equal({ a: true, aa: true, b: true, bb: true, c: true, dd: true, e: true, ee: true, f: true, gg: true, h: true, hh: true });
    });

    it('getDisAllowedSwitchNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', staticPathItem1);

      rootPathItem.addCommonRequiredSwitch(new Switch('a', 'a1'));
      rootPathItem.addCommonOptionalSwitch(new Switch('b', 'b1'));
      rootPathItem.addRequiredSwitch(new Switch('c', 'c1'));
      rootPathItem.addOptionalSwitch(new Switch('d', 'd1'));

      dynamicPathItem1.addCommonRequiredSwitch(new Switch('e', 'e1'));
      dynamicPathItem1.addCommonOptionalSwitch(new Switch('f', 'f1'));
      dynamicPathItem1.addRequiredSwitch(new Switch('g', 'g1'));
      dynamicPathItem1.addOptionalSwitch(new Switch('h', 'h1'));

      staticPathItem1.addCommonRequiredSwitch(new Switch('i', 'i1'));
      staticPathItem1.addCommonOptionalSwitch(new Switch('j', 'j1'));
      staticPathItem1.addRequiredSwitch(new Switch('k', 'k1'));
      staticPathItem1.addOptionalSwitch(new Switch('l', 'l1'));

      switchPathItem1.addRequiredSwitch(new Switch('m', 'm1'));
      switchPathItem1.addOptionalSwitch(new Switch('n', 'n1'));

      expect(rootPathItem.getDisAllowedSwitchNames()).deep.equal({ a: true, a1: true, b: true, b1: true, c: true, c1: true, d: true, d1: true });
      expect(dynamicPathItem1.getDisAllowedSwitchNames()).deep.equal({ a: true, a1: true, b: true, b1: true, e: true, e1: true, f: true, f1: true, g: true, g1: true, h: true, h1: true });
      expect(staticPathItem1.getDisAllowedSwitchNames()).deep.equal({ a: true, a1: true, b: true, b1: true, e: true, e1: true, f: true, f1: true, i: true, i1: true, j: true, j1: true, k: true, k1: true, l: true, l1: true });
      expect(switchPathItem1.getDisAllowedSwitchNames()).deep.equal({ a: true, a1: true, b: true, b1: true, e: true, e1: true, f: true, f1: true, i: true, i1: true, j: true, j1: true, m: true, m1: true, n: true, n1: true });
    });
  });

})
