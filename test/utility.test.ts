import { expect } from 'chai'
import { parsePath, splitFromSwitchExpressions } from '../src/utility';
import { StaticPathItem } from '../src/PathTree/StaticPathItem';
import { DynamicPathItem } from '../src/PathTree/DynamicPathItem';

describe('utility', () => {

  it('splitFromSwitchExpressions for ""', () => {
    const path = "";

    const strs = splitFromSwitchExpressions(path);

    expect(strs[0]).to.equal('');  
    expect(strs[1]).to.equal('');  
  });

  it('splitFromSwitchExpressions for "abc"', () => {
    const path = "abc";

    const strs = splitFromSwitchExpressions(path);

    expect(strs[0]).to.equal('abc');  
    expect(strs[1]).to.equal('');  
  });

  it('splitFromSwitchExpressions for "/abc/edf"', () => {
    const path = "/abc/edf";

    const strs = splitFromSwitchExpressions(path);

    expect(strs[0]).to.equal('/abc/edf');  
    expect(strs[1]).to.equal('');  
  });

  it('splitFromSwitchExpressions for "[abc]"', () => {
    const path = "[abc]";

    const strs = splitFromSwitchExpressions(path);

    expect(strs[0]).to.equal('');  
    expect(strs[1]).to.equal('[abc]');  
  });

  it('splitFromSwitchExpressions for "/[abc]"', () => {
    const path = "/[abc]";

    const strs = splitFromSwitchExpressions(path);

    expect(strs[0]).to.equal('/');  
    expect(strs[1]).to.equal('[abc]');  
  });

  it('splitFromSwitchExpressions for "/abc/edf[abc]"', () => {
    const path = "/abc/edf[abc]";

    const strs = splitFromSwitchExpressions(path);

    expect(strs[0]).to.equal('/abc/edf');
    expect(strs[1]).to.equal('[abc]');  
  });

  it('splitFromSwitchExpressions for "/abc/edf[abc][edf]"', () => {
    const path = "/abc/edf[abc][edf]";

    const strs = splitFromSwitchExpressions(path);

    expect(strs[0]).to.equal('/abc/edf');  
    expect(strs[1]).to.equal('[abc][edf]');  
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
