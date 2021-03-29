import { expect } from 'chai'
import { SpreadPathItem } from '../../src/PathTree/SpreadPathItem';

describe('SpreadPathItem', () => {
  it('SpreadPathItem getUniqueName', () => {
    const spreadPathItem = new SpreadPathItem('spread', null);

    expect(spreadPathItem.getUniqueName()).equal('...spread');
    expect(spreadPathItem.getUniqueName(true)).equal('spread');
  })
});
