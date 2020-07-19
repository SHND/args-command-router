import { expect } from 'chai'
import { DynamicPathItem } from '../../src/PathTree/DynamicPathItem';

describe('DynamicPathItem', () => {
  it('instantiating DynamicPathItem subClass', () => {
    const pathItem = new DynamicPathItem('name1', null);
  });

  it('getUniqueName method', () => {
    const pathItem = new DynamicPathItem('name1', null);

    expect(pathItem.getUniqueName(false)).to.equal(':name1');
    expect(pathItem.getUniqueName(true)).to.equal('name1');
  });

});
