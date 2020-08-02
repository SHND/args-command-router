import { expect } from 'chai'
import { parsePath, splitFromSwitchPathItem, splitSwitchExpressions } from '../src/utility';
import { StaticPathItem } from '../src/PathTree/StaticPathItem';
import { DynamicPathItem } from '../src/PathTree/DynamicPathItem';

describe('utility', () => {

  it('splitFromSwitchPathItem for ""', () => {
    const path = "";

    const strs = splitFromSwitchPathItem(path);

    expect(strs[0]).to.equal('');  
    expect(strs[1]).to.equal('');  
  });

  it('splitFromSwitchPathItem for "/"', () => {
    const path = "/";

    const strs = splitFromSwitchPathItem(path);

    expect(strs[0]).to.equal('/');
    expect(strs[1]).to.equal('');
  });

  it('splitFromSwitchPathItem for "abc"', () => {
    const path = "abc";

    const strs = splitFromSwitchPathItem(path);

    expect(strs[0]).to.equal('abc');
    expect(strs[1]).to.equal('');
  });

  it('splitFromSwitchPathItem for "/abc/edf"', () => {
    const path = "/abc/edf";

    const strs = splitFromSwitchPathItem(path);

    expect(strs[0]).to.equal('/abc/edf');
    expect(strs[1]).to.equal('');
  });

  it('splitFromSwitchPathItem for "[abc]"', () => {
    const path = "[abc]";

    const strs = splitFromSwitchPathItem(path);

    expect(strs[0]).to.equal('');
    expect(strs[1]).to.equal('[abc]');
  });

  it('splitFromSwitchPathItem for "/[abc]"', () => {
    const path = "/[abc]";

    const strs = splitFromSwitchPathItem(path);

    expect(strs[0]).to.equal('/');
    expect(strs[1]).to.equal('[abc]');
  });

  it('splitFromSwitchPathItem for "/abc/edf[abc]"', () => {
    const path = "/abc/edf[abc]";

    const strs = splitFromSwitchPathItem(path);

    expect(strs[0]).to.equal('/abc/edf');
    expect(strs[1]).to.equal('[abc]');
  });

  it('splitFromSwitchPathItem for "/abc/edf[abc][edf]"', () => {
    const path = "/abc/edf[abc][edf]";

    const strs = splitFromSwitchPathItem(path);

    expect(strs[0]).to.equal('/abc/edf');
    expect(strs[1]).to.equal('[abc][edf]');
  });

  it('splitSwitchExpressions for "[abc][def]"', () => {
    const expressions = "[abc][edf]";

    const strs = splitSwitchExpressions(expressions);

    expect(strs.length).to.equal(2);
    expect(strs).to.deep.equal(['abc', 'edf']);
  });

  it('splitSwitchExpressions for ""', () => {
    const expressions = "";

    const strs = splitSwitchExpressions(expressions);

    expect(strs.length).to.equal(0);
    expect(strs).to.deep.equal([]);
  });

  it('splitSwitchExpressions for " "', () => {
    const expressions = " ";

    expect(() => {
      splitSwitchExpressions(expressions);
    }).throws();
  });

  it('splitSwitchExpressions for "[]"', () => {
    const expressions = "[]";

    const strs = splitSwitchExpressions(expressions);

    expect(strs.length).to.equal(1);
    expect(strs).to.deep.equal(['']);
  });

  it('splitSwitchExpressions for "[][]"', () => {
    const expressions = "[][]";

    const strs = splitSwitchExpressions(expressions);

    expect(strs.length).to.equal(2);
    expect(strs).to.deep.equal(['', '']);
  });

  it('splitSwitchExpressions for "[] []"', () => {
    const expressions = "[] []";

    expect(() => {
      splitSwitchExpressions(expressions);
    }).throws();
  });

  it('splitSwitchExpressions for "[abc]xx[def]"', () => {
    const expressions = "[abc]xx[def]";

    expect(() => {
      splitSwitchExpressions(expressions);
    }).throws();
  });

  it('splitSwitchExpressions for "[[]"', () => {
    const expressions = "[[]";

    const strs = splitSwitchExpressions(expressions);

    expect(strs.length).to.equal(1);
    expect(strs).to.deep.equal(['[']);
  });

  it('splitSwitchExpressions for "[]]"', () => {
    const expressions = "[]]";

    expect(() => {
      splitSwitchExpressions(expressions);
    }).throws();
  });

  it('splitSwitchExpressions for " [abc]"', () => {
    const expressions = " [abc]";

    expect(() => {
      splitSwitchExpressions(expressions);
    }).throws();
  });

  it('splitSwitchExpressions for "[abc] "', () => {
    const expressions = "[abc] ";

    expect(() => {
      splitSwitchExpressions(expressions);
    }).throws();
  });

  it('splitSwitchExpressions for "[abc]"', () => {
    const expressions = "[abc]";

    const strs = splitSwitchExpressions(expressions);

    expect(strs.length).to.equal(1);
    expect(strs).to.deep.equal(['abc']);
  });

  it('parsePath for ""', () => {
    const path = "";

    const pathItems = parsePath(path);

    expect(pathItems).have.lengthOf(0);
  });

  it('parsePath for " " throws', () => {
    const path = " ";

    expect(() => {
      parsePath(path);
    }).throws();
  });

  it('parsePath for "/ " throws', () => {
    const path = "/ ";

    expect(() => {
      parsePath(path);
    }).throws();
  });

  it('parsePath for " /" throws', () => {
    const path = " /";

    expect(() => {
      parsePath(path);
    }).throws();
  });

  it('parsePath for "//" throws', () => {
    const path = "//";

    expect(() => {
      parsePath(path);
    }).throws();
  });

  it('parsePath for "/"', () => {
    const path = "/";

    const pathItems = parsePath(path);

    expect(pathItems).have.lengthOf(0);
  });

  it('parsePath for "item1/" throws', () => {
    const path = "item1/";

    expect(() => {
      parsePath(path);
    }).throws();
  });

  it('parsePath for "/item1/" throws', () => {
    const path = "/item1/";

    expect(() => {
      parsePath(path);
    }).throws();
  });

  it('parsePath for "/item1"', () => {
    const path = "/item1";

    const pathItems = parsePath(path);

    expect(pathItems).have.lengthOf(1);
    expect(pathItems[0]).to.instanceOf(StaticPathItem);
    expect(pathItems[0].getUniqueName(false)).to.equal('item1');
  });

  it('parsePath for "/:item1"', () => {
    const path = "/:item1";

    const pathItems = parsePath(path);

    expect(pathItems).have.lengthOf(1);
    expect(pathItems[0]).to.instanceOf(DynamicPathItem);
    expect(pathItems[0].getUniqueName(false)).to.equal(':item1');
  });

  it('parsePath for "/item1/item2"', () => {
    const path = "/item1/item2";

    const pathItems = parsePath(path);

    expect(pathItems).have.lengthOf(2);
    expect(pathItems[0]).to.instanceOf(StaticPathItem);
    expect(pathItems[0].getUniqueName(false)).to.equal('item1');
    expect(pathItems[1]).to.instanceOf(StaticPathItem);
    expect(pathItems[1].getUniqueName(false)).to.equal('item2');
  });

  it('parsePath for "/item1[x=/etc]"', () => {
    const path = "/item1[x=/etc]";

    const pathItems = parsePath(path);

    expect(pathItems).have.lengthOf(1);
    expect(pathItems[0]).to.instanceOf(StaticPathItem);
    expect(pathItems[0].getUniqueName(false)).to.equal('item1');
  });

  it('parsePath for "/item1[a=My folder]"', () => {
    const path = "/item1[a=My folder]";

    const pathItems = parsePath(path);

    expect(pathItems).have.lengthOf(1);
    expect(pathItems[0]).to.instanceOf(StaticPathItem);
    expect(pathItems[0].getUniqueName(false)).to.equal('item1');
  });

})
