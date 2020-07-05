import { expect } from 'chai'
import { PathTree } from '../../src/PathTree/PathTree'å

describe('index method', () => {
  it('create', () => {

    const tree = new PathTree();

    console.log(tree.getTreeString())

  })
})
