import { expect } from 'chai'
import { StaticPathItem } from '../../src/PathTree/StaticPathItem';

describe('StaticPathItem', () => {
  it('instantiating StaticPathItem subClass', () => {
    const pathItem = new StaticPathItem('name1', null);
  });

  it('getUniqueName method', () => {
    const pathItem = new StaticPathItem('name1', null);

    expect(pathItem.getUniqueName()).to.equal('name1');
  });

});
