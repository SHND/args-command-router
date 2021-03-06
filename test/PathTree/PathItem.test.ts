import { expect } from 'chai'
import { Switch } from '../../src/Switch';
import { PathItem } from '../../src/PathTree/PathItem';
import { RootPathItem } from '../../src/PathTree/RootPathItem';
import { StaticPathItem } from '../../src/PathTree/StaticPathItem';
import { SwitchPathItem } from '../../src/PathTree/SwitchPathItem';
import { DynamicPathItem } from '../../src/PathTree/DynamicPathItem';
import { Visibility } from '../../src/enums';


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

  it ('getVisibility, setVisibility methods', () => {
    const pathItem = new TestPathItem();
    expect(pathItem.getVisibility()).equal(Visibility.PUBLIC);
    pathItem.setVisibility(Visibility.PRIVATE);
    expect(pathItem.getVisibility()).equal(Visibility.PRIVATE);
  })

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

    expect(pathItem.getOptionalSwitches()).to.lengthOf(1);
    expect(pathItem.getOptionalSwitches()[0]).to.equal(swich);
    expect(pathItem.hasOptionalSwitch(swich)).to.true;
    expect(pathItem.hasOptionalSwitchWithShortname('a')).to.true;
    expect(pathItem.hasOptionalSwitchWithLongname('aa')).to.true;
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

})
