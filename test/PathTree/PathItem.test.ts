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

  public getCommonRequiredSwitchNames = () => ({});

  public getCommonOptionalSwitchNames = () => ({});

  public getCommonSwitchNames = () => ({});
  
  public getDynamicPathItemName: () => string | null = () => null;

  public getDownwardCommonSwitchNames = () => ({});

  public showHelp = (applicationName: string) => {};
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

  it('callbacks property, callback addCallback, hasCallback methods', () => {
    const pathItem = new TestPathItem();
    const callback = () => {};

    expect(pathItem.getCallbacks()).have.lengthOf(0);
    expect(pathItem.hasCallback(callback)).to.equal(false);

    pathItem.addCallback(callback);
    pathItem.addCallback(callback);
    expect(pathItem.getCallbacks()).have.lengthOf(1);
    expect(pathItem.getCallbacks()[0]).to.equal(callback);
    expect(pathItem.hasCallback(callback)).to.equal(true);
  });

  it('requiredSwitches property, getRequiredSwitches, addRequiredSwitch, hasRequiredSwitch, hasRequiredSwitchWithShortname, hasRequiredSwitchWithLongname methods', () => {
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
  });

  it('optionalSwitches property, getOptionalSwitches, addOptionalSwitch, hasOptionalSwitch, hasOptionalSwitchWithShortname, hasOptionalSwitchWithLongname methods', () => {
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

      expect(dynamicPathItem1.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1 });
    })

    it('getBranchDynamicPathItemNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> dynamicPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const dynamicPathItem2 = new DynamicPathItem('dynamic2', staticPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', dynamicPathItem2);

      expect(rootPathItem.getBranchDynamicPathItemNames()).deep.equal({});
      expect(dynamicPathItem1.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1 });
      expect(staticPathItem1.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1 });
      expect(dynamicPathItem2.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1, dynamic2: dynamicPathItem2 });
      expect(switchPathItem1.getBranchDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1, dynamic2: dynamicPathItem2 });
    });
  });

  describe('getUpwardCommonSwitchNames', () => {
    it('getUpwardCommonSwitchNames() for only RootPathItem', () => {
      const rootPathItem = new RootPathItem();

      expect(rootPathItem.getUpwardCommonSwitchNames()).deep.equal({});

      const aSwitch = new Switch('a', 'aa');
      rootPathItem.addRequiredSwitch(aSwitch);  
      const bSwitch = new Switch('b', 'bb');
      rootPathItem.addOptionalSwitch(bSwitch);  
      const cSwitch = new Switch('c', null);
      rootPathItem.addCommonRequiredSwitch(cSwitch);  
      const dSwitch = new Switch(null, 'dd');
      rootPathItem.addCommonRequiredSwitch(dSwitch);  
      const eSwitch = new Switch('e', 'ee');
      rootPathItem.addCommonRequiredSwitch(eSwitch);  
      const fSwitch = new Switch('f', null);
      rootPathItem.addCommonOptionalSwitch(fSwitch);  
      const gSwitch = new Switch(null, 'gg');
      rootPathItem.addCommonOptionalSwitch(gSwitch);  
      const hSwitch = new Switch('h', 'hh');
      rootPathItem.addCommonOptionalSwitch(hSwitch);

      expect(rootPathItem.getUpwardCommonSwitchNames()).deep.equal({ c: cSwitch, dd: dSwitch, e: eSwitch, ee: eSwitch, f: fSwitch, gg: gSwitch, h: hSwitch, hh: hSwitch });
    });

    it('getUpwardCommonSwitchNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', staticPathItem1);

      const aSwitch = new Switch('a', 'a1');
      rootPathItem.addCommonRequiredSwitch(aSwitch);
      const bSwitch = new Switch('b', 'b1');
      rootPathItem.addCommonOptionalSwitch(bSwitch);
      const cSwitch = new Switch('c', 'c1');
      rootPathItem.addRequiredSwitch(cSwitch);
      const dSwitch = new Switch('d', 'd1');
      rootPathItem.addOptionalSwitch(dSwitch);

      const eSwitch = new Switch('e', 'e1');
      dynamicPathItem1.addCommonRequiredSwitch(eSwitch);
      const fSwitch = new Switch('f', 'f1');
      dynamicPathItem1.addCommonOptionalSwitch(fSwitch);
      const gSwitch = new Switch('g', 'g1');
      dynamicPathItem1.addRequiredSwitch(gSwitch);
      const hSwitch = new Switch('h', 'h1');
      dynamicPathItem1.addOptionalSwitch(hSwitch);

      const iSwitch = new Switch('i', 'i1');
      staticPathItem1.addCommonRequiredSwitch(iSwitch);
      const jSwitch = new Switch('j', 'j1');
      staticPathItem1.addCommonOptionalSwitch(jSwitch);
      const kSwitch = new Switch('k', 'k1');
      staticPathItem1.addRequiredSwitch(kSwitch);
      const lSwitch = new Switch('l', 'l1');
      staticPathItem1.addOptionalSwitch(lSwitch);

      const mSwitch = new Switch('m', 'm1');
      switchPathItem1.addRequiredSwitch(mSwitch);
      const nSwtich = new Switch('n', 'n1');
      switchPathItem1.addOptionalSwitch(nSwtich);

      expect(rootPathItem.getUpwardCommonSwitchNames()).deep.equal({ a: aSwitch, a1: aSwitch, b: bSwitch, b1: bSwitch });
      expect(dynamicPathItem1.getUpwardCommonSwitchNames()).deep.equal({ a: aSwitch, a1: aSwitch, b: bSwitch, b1: bSwitch, e: eSwitch, e1: eSwitch, f: fSwitch, f1: fSwitch });
      expect(staticPathItem1.getUpwardCommonSwitchNames()).deep.equal({ a: aSwitch, a1: aSwitch, b: bSwitch, b1: bSwitch, e: eSwitch, e1: eSwitch, f: fSwitch, f1: fSwitch, i: iSwitch, i1: iSwitch, j: jSwitch, j1: jSwitch });
      expect(switchPathItem1.getUpwardCommonSwitchNames()).deep.equal({ a: aSwitch, a1: aSwitch, b: bSwitch, b1: bSwitch, e: eSwitch, e1: eSwitch, f: fSwitch, f1: fSwitch, i: iSwitch, i1: iSwitch, j: jSwitch, j1: jSwitch });
    });
  });

  describe('getDownwardCommonSwitchNames', () => {
    it('getDownwardCommonSwitchNames() for only RootPathItem', () => {
      const rootPathItem = new RootPathItem();

      expect(rootPathItem.getDownwardCommonSwitchNames()).deep.equal({});

      const aSwitch = new Switch('a', 'aa');
      rootPathItem.addRequiredSwitch(aSwitch);  
      const bSwitch = new Switch('b', 'bb');
      rootPathItem.addOptionalSwitch(bSwitch);  
      const cSwitch = new Switch('c', null);
      rootPathItem.addCommonRequiredSwitch(cSwitch);  
      const dSwitch = new Switch(null, 'dd');
      rootPathItem.addCommonRequiredSwitch(dSwitch);  
      const eSwitch = new Switch('e', 'ee');
      rootPathItem.addCommonRequiredSwitch(eSwitch);  
      const fSwitch = new Switch('f', null);
      rootPathItem.addCommonOptionalSwitch(fSwitch);  
      const gSwitch = new Switch(null, 'gg');
      rootPathItem.addCommonOptionalSwitch(gSwitch);  
      const hSwitch = new Switch('h', 'hh');
      rootPathItem.addCommonOptionalSwitch(hSwitch);

      expect(rootPathItem.getDownwardCommonSwitchNames()).deep.equal({});
    });

    it('getDownwardCommonSwitchNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', staticPathItem1);

      const aSwitch = new Switch('a', 'a1');
      rootPathItem.addCommonRequiredSwitch(aSwitch);
      const bSwitch = new Switch('b', 'b1');
      rootPathItem.addCommonOptionalSwitch(bSwitch);
      const cSwitch = new Switch('c', 'c1');
      rootPathItem.addRequiredSwitch(cSwitch);
      const dSwitch = new Switch('d', 'd1');
      rootPathItem.addOptionalSwitch(dSwitch);

      const eSwitch = new Switch('e', 'e1');
      dynamicPathItem1.addCommonRequiredSwitch(eSwitch);
      const fSwitch = new Switch('f', 'f1');
      dynamicPathItem1.addCommonOptionalSwitch(fSwitch);
      const gSwitch = new Switch('g', 'g1');
      dynamicPathItem1.addRequiredSwitch(gSwitch);
      const hSwitch = new Switch('h', 'h1');
      dynamicPathItem1.addOptionalSwitch(hSwitch);

      const iSwitch = new Switch('i', 'i1');
      staticPathItem1.addCommonRequiredSwitch(iSwitch);
      const jSwitch = new Switch('j', 'j1');
      staticPathItem1.addCommonOptionalSwitch(jSwitch);
      const kSwitch = new Switch('k', 'k1');
      staticPathItem1.addRequiredSwitch(kSwitch);
      const lSwitch = new Switch('l', 'l1');
      staticPathItem1.addOptionalSwitch(lSwitch);

      const mSwitch = new Switch('m', 'm1');
      switchPathItem1.addRequiredSwitch(mSwitch);
      const nSwitch = new Switch('n', 'n1');
      switchPathItem1.addOptionalSwitch(nSwitch);

      expect(rootPathItem.getDownwardCommonSwitchNames()).deep.equal({ e: eSwitch, e1: eSwitch, f: fSwitch, f1: fSwitch, i: iSwitch, i1: iSwitch, j: jSwitch, j1: jSwitch });
      expect(dynamicPathItem1.getDownwardCommonSwitchNames()).deep.equal({ i: iSwitch, i1: iSwitch, j: jSwitch, j1: jSwitch });
      expect(staticPathItem1.getDownwardCommonSwitchNames()).deep.equal({});
      expect(switchPathItem1.getDownwardCommonSwitchNames()).deep.equal({});
    });
  });

  describe('getDisAllowedDynamicPathItemNames', () => {
    it('getDisAllowedDynamicPathItemNames for only DynamicPathItem', () => {
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', null);

      expect(dynamicPathItem1.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1 });
    })

    it('getDisAllowedDynamicPathItemNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> dynamicPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const dynamicPathItem2 = new DynamicPathItem('dynamic2', staticPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', dynamicPathItem2);

      expect(rootPathItem.getDisAllowedDynamicPathItemNames()).deep.equal({});
      expect(dynamicPathItem1.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1 });
      expect(staticPathItem1.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1 });
      expect(dynamicPathItem2.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1, dynamic2: dynamicPathItem2 });
      expect(switchPathItem1.getDisAllowedDynamicPathItemNames()).deep.equal({ dynamic1: dynamicPathItem1, dynamic2: dynamicPathItem2 });
    });
  });

  describe('getDisAllowedSwitchNames', () => {
    it('getDisAllowedSwitchNames() for only RootPathItem', () => {
      const rootPathItem = new RootPathItem();

      expect(rootPathItem.getDisAllowedSwitchNames()).deep.equal({});

      const aSwitch = new Switch('a', 'aa');
      rootPathItem.addRequiredSwitch(aSwitch);  
      const bSwitch = new Switch('b', 'bb');
      rootPathItem.addOptionalSwitch(bSwitch);  
      const cSwitch = new Switch('c', null);
      rootPathItem.addCommonRequiredSwitch(cSwitch);  
      const dSwitch = new Switch(null, 'dd');
      rootPathItem.addCommonRequiredSwitch(dSwitch);  
      const eSwitch = new Switch('e', 'ee');
      rootPathItem.addCommonRequiredSwitch(eSwitch);  
      const fSwitch = new Switch('f', null);
      rootPathItem.addCommonOptionalSwitch(fSwitch);  
      const gSwitch = new Switch(null, 'gg');
      rootPathItem.addCommonOptionalSwitch(gSwitch);  
      const hSwitch = new Switch('h', 'hh');
      rootPathItem.addCommonOptionalSwitch(hSwitch);

      expect(rootPathItem.getDisAllowedSwitchNames()).deep.equal({ 
        a: aSwitch, 
        aa: aSwitch, 
        b: bSwitch, 
        bb: bSwitch, 
        c: cSwitch, 
        dd: dSwitch, 
        e: eSwitch, 
        ee: eSwitch, 
        f: fSwitch, 
        gg: gSwitch, 
        h: hSwitch, 
        hh: hSwitch 
      });
    });

    it('getDisAllowedSwitchNames() for RootPathItem -> dynamicPathItem -> staticPathItem -> switchPathItem', () => {
      const rootPathItem = new RootPathItem();
      const dynamicPathItem1 = new DynamicPathItem('dynamic1', rootPathItem);
      const staticPathItem1 = new StaticPathItem('static1', dynamicPathItem1);
      const switchPathItem1 = new SwitchPathItem('[askedSwitch]', staticPathItem1);

      const aSwitch = new Switch('a', 'a1');
      rootPathItem.addCommonRequiredSwitch(aSwitch);
      const bSwitch = new Switch('b', 'b1');
      rootPathItem.addCommonOptionalSwitch(bSwitch);
      const cSwitch = new Switch('c', 'c1');
      rootPathItem.addRequiredSwitch(cSwitch);
      const dSwitch = new Switch('d', 'd1');
      rootPathItem.addOptionalSwitch(dSwitch);

      const eSwitch = new Switch('e', 'e1');
      dynamicPathItem1.addCommonRequiredSwitch(eSwitch);
      const fSwitch = new Switch('f', 'f1');
      dynamicPathItem1.addCommonOptionalSwitch(fSwitch);
      const gSwitch = new Switch('g', 'g1');
      dynamicPathItem1.addRequiredSwitch(gSwitch);
      const hSwitch = new Switch('h', 'h1');
      dynamicPathItem1.addOptionalSwitch(hSwitch);

      const iSwitch = new Switch('i', 'i1');
      staticPathItem1.addCommonRequiredSwitch(iSwitch);
      const jSwitch = new Switch('j', 'j1');
      staticPathItem1.addCommonOptionalSwitch(jSwitch);
      const kSwitch = new Switch('k', 'k1');
      staticPathItem1.addRequiredSwitch(kSwitch);
      const lSwitch = new Switch('l', 'l1');
      staticPathItem1.addOptionalSwitch(lSwitch);

      const mSwitch = new Switch('m', 'm1');
      switchPathItem1.addRequiredSwitch(mSwitch);
      const nSwitch = new Switch('n', 'n1');
      switchPathItem1.addOptionalSwitch(nSwitch);

      expect(rootPathItem.getDisAllowedSwitchNames()).deep.equal({ 
        a: aSwitch, 
        a1: aSwitch, 
        b: bSwitch, 
        b1: bSwitch, 
        c: cSwitch, 
        c1: cSwitch, 
        d: dSwitch, 
        d1: dSwitch, 
        e: eSwitch, 
        e1: eSwitch, 
        f: fSwitch, 
        f1: fSwitch, 
        i: iSwitch, 
        i1: iSwitch, 
        j: jSwitch, 
        j1: jSwitch 
      });
      expect(dynamicPathItem1.getDisAllowedSwitchNames()).deep.equal({ 
        a: aSwitch, 
        a1: aSwitch, 
        b: bSwitch, 
        b1: bSwitch, 
        e: eSwitch, 
        e1: eSwitch, 
        f: fSwitch, 
        f1: fSwitch, 
        g: gSwitch,
        g1: gSwitch,
        h: hSwitch,
        h1: hSwitch,
        i: iSwitch, 
        i1: iSwitch, 
        j: jSwitch, 
        j1: jSwitch 
      });
      expect(staticPathItem1.getDisAllowedSwitchNames()).deep.equal({ 
        a: aSwitch,
        a1: aSwitch,
        b: bSwitch,
        b1: bSwitch,
        e: eSwitch,
        e1: eSwitch,
        f: fSwitch,
        f1: fSwitch,
        i: iSwitch,
        i1: iSwitch,
        j: jSwitch,
        j1: jSwitch,
        k: kSwitch,
        k1: kSwitch,
        l: lSwitch,
        l1: lSwitch 
      });
      expect(switchPathItem1.getDisAllowedSwitchNames()).deep.equal({ 
        a: aSwitch, 
        a1: aSwitch, 
        b: bSwitch, 
        b1: bSwitch, 
        e: eSwitch, 
        e1: eSwitch, 
        f: fSwitch, 
        f1: fSwitch, 
        i: iSwitch, 
        i1: iSwitch, 
        j: jSwitch, 
        j1: jSwitch, 
        m: mSwitch, 
        m1: mSwitch, 
        n: nSwitch, 
        n1: nSwitch 
      });
    });
  });

})
