import { expect } from 'chai'
import { Route } from '../src/Route';
import { Visibility } from '../src/enums';
import { PathTree } from '../src/PathTree/PathTree';
import { StaticPathItem } from '../src/PathTree/StaticPathItem';
import { SwitchPathItem } from '../src/PathTree/SwitchPathItem';
import { DynamicPathItem } from '../src/PathTree/DynamicPathItem';


describe('Route', () => {
  class CustomRoute extends Route {
    constructor(tree: PathTree, path: string) {
      super(tree, path);
    }

    public _lastPathItem() {
      return this['lastPathItem']();
    }
  }

  it('matchRouteToTreePathItems for empty tree', () => {
    const tree = new PathTree();

    const items = Route.matchRouteToTreePathItems(tree, '');

    expect(items).lengthOf(0);
  });

  it('matchRouteToTreePathItems for empty tree', () => {
    const tree = new PathTree();

    {
      const items = Route.matchRouteToTreePathItems(tree, 'staticX');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal('staticX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, ':dynamicX');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal(':dynamicX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, '[a=X]');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal('[a=X]');
    }
  });

  it('matchRouteToTreePathItems for tree {static1}', () => {
    const tree = new PathTree();
    const root = tree.getRoot()
    const static1 = new StaticPathItem('static1', null);
    root.addStaticPathItem(static1);

    {
      const items = Route.matchRouteToTreePathItems(tree, '');
      expect(items).lengthOf(0);
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'static1');
      expect(items).lengthOf(1);
      expect(items[0]).equal(static1);
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'staticX');
      expect(items).lengthOf(1);
      expect(items[0]).not.equal(static1);
      expect(items[0].getUniqueName()).equal('staticX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, ':dynamicX');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal(':dynamicX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, '[a=X]');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal('[a=X]');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'static1/staticX');
      expect(items).lengthOf(2);
      expect(items[0]).equal(static1);
      expect(items[1].getUniqueName()).equal('staticX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'static1/:dynamicX');
      expect(items).lengthOf(2);
      expect(items[0]).equal(static1);
      expect(items[1].getUniqueName()).equal(':dynamicX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'static1[a=X]');
      expect(items).lengthOf(2);
      expect(items[0]).equal(static1);
      expect(items[1].getUniqueName()).equal('[a=X]');
    }
  });

  it('matchRouteToTreePathItems for tree {:dynamic1}', () => {
    const tree = new PathTree();
    const root = tree.getRoot()
    const dynamic1 = new DynamicPathItem('dynamic1', null);
    root.setDynamicPathItem(dynamic1);

    {
      const items = Route.matchRouteToTreePathItems(tree, '');
      expect(items).lengthOf(0);
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'staticX');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal('staticX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, ':dynamic1');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal(':dynamic1');
    }

    {
      expect(() => {
        // Dynamic pathItem with name 'dynamic1' already exist
        Route.matchRouteToTreePathItems(tree, ':dynamicX');
      }).throws()
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, '[a=X]');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal('[a=X]');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'staticX/staticXX');
      expect(items).lengthOf(2);
      expect(items[0].getUniqueName()).equal('staticX');
      expect(items[1].getUniqueName()).equal('staticXX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'staticX/:dynamicX');
      expect(items).lengthOf(2);
      expect(items[0].getUniqueName()).equal('staticX');
      expect(items[1].getUniqueName()).equal(':dynamicX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'staticX[a=X]');
      expect(items).lengthOf(2);
      expect(items[0].getUniqueName()).equal('staticX');
      expect(items[1].getUniqueName()).equal('[a=X]');
    }
  });

  it('matchRouteToTreePathItems for tree {[a=1]}', () => {
    const tree = new PathTree();
    const root = tree.getRoot()
    const switch1 = new SwitchPathItem('[a=1]', null);
    root.addSwitchPathItem(switch1)

    {
      const items = Route.matchRouteToTreePathItems(tree, '');
      expect(items).lengthOf(0);
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, 'staticX');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal('staticX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, ':dynamicX');
      expect(items).lengthOf(1);
      expect(items[0].getUniqueName()).equal(':dynamicX');
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, '[a=1]');
      expect(items).lengthOf(1);
      expect(items[0]).equal(switch1)
    }

    {
      const items = Route.matchRouteToTreePathItems(tree, '[a=X]');
      expect(items).lengthOf(1);
      expect(items[0]).not.equal(switch1)
      expect(items[0].getUniqueName()).equal('[a=X]');
    }
  });

  it('lastPathItem when pathItems length is zero', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '');
    expect(route._lastPathItem().isRootPathItem()).true;
  });

  it('lastPathItem when pathItems length is zero', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, 'static1');
    expect(route._lastPathItem().getUniqueName(false)).equal('static1');
  });

  it('alias for staticPathItem', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/static1');
    const returnValue = route.alias('alias1');
    
    expect(route._lastPathItem() instanceof StaticPathItem).true;
    expect((route._lastPathItem() as StaticPathItem).getAliases()).property('alias1', true);

    expect(returnValue instanceof CustomRoute).true;
  });

  it('alias for non-staticPathItem throws', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/:dynamic1');

    expect(() => {
      route.alias('alias1');
    }).throw();
  });

  it('add callback', () => {
    const tree = new PathTree();

    const route = new CustomRoute(tree, '/static1');
    expect(route._lastPathItem().getCallbacks()).lengthOf(0);

    const returnValue1 = route.callback(function function1() {});
    expect(route._lastPathItem().getCallbacks()).lengthOf(1);

    const returnValue2 = route.callback(function function2() {});
    expect(route._lastPathItem().getCallbacks()).lengthOf(2);

    expect(returnValue1 instanceof CustomRoute).true;
    expect(returnValue1 === returnValue2).true;
  });

  it('add description', () => {
    const tree = new PathTree();

    const route = new CustomRoute(tree, '/static1');
    expect(route._lastPathItem().hasDescription()).false;

    const returnValue = route.description('some description');
    expect(route._lastPathItem().hasDescription()).true;
    expect(route._lastPathItem().getDescription()).equal('some description');

    expect(returnValue instanceof CustomRoute).true;
  });

  it('hide', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/static1');

    expect(route._lastPathItem().getVisibility()).equals(Visibility.PUBLIC);
    const returnValue = route.hide();
    expect(route._lastPathItem().getVisibility()).equals(Visibility.PRIVATE);

    expect(returnValue instanceof CustomRoute).true;
  });

  it('requiredSwitch', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/static1');

    expect(route._lastPathItem().getRequiredSwitches()).lengthOf(0);
    const returnValue = route.requiredSwitch('a', 'aa', 'description', ['param1', 'param2']);
    expect(route._lastPathItem().getRequiredSwitches()).lengthOf(1);
    
    expect(returnValue instanceof CustomRoute).true;
  });

  it('optionalSwitch', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/static1');

    expect(route._lastPathItem().getOptionalSwitches()).lengthOf(0);
    const returnValue = route.optionalSwitch('a', 'aa', 'description', ['param1', 'param2']);
    expect(route._lastPathItem().getOptionalSwitches()).lengthOf(1);
    
    expect(returnValue instanceof CustomRoute).true;
  });

  it('option', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/static1');

    expect(route._lastPathItem().getOptionalSwitches()).lengthOf(0);
    const returnValue = route.option('a', 'aa', 'description', ['param1', 'param2']);
    expect(route._lastPathItem().getOptionalSwitches()).lengthOf(1);
    
    expect(returnValue instanceof CustomRoute).true;
  });

  it('commonRequiredSwitch when lastPathItem is BlockPathItem', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/static1');

    expect(Object.keys(route._lastPathItem().getCommonRequiredSwitchNames())).lengthOf(0);
    const returnValue1 = route.commonRequiredSwitch('a', 'aa', 'description', ['param1', 'param2']);
    const returnValue2 = route.commonRequiredSwitch('b', null, 'description', ['param1', 'param2']);
    expect(Object.keys(route._lastPathItem().getCommonRequiredSwitchNames())).lengthOf(3);
    
    expect(returnValue1 instanceof CustomRoute).true;
    expect(returnValue1 === returnValue2).true;
  });

  it('commonRequiredSwitch when lastPathItem is not a BlockPathItem throws', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/...spread1');

    expect(() => {
      route.commonRequiredSwitch('a', 'aa', 'description', ['param1', 'param2']);
    }).throws();
  });

  it('commonOptionalSwitch when lastPathItem is BlockPathItem', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/static1');

    expect(Object.keys(route._lastPathItem().getCommonOptionalSwitchNames())).lengthOf(0);
    const returnValue1 = route.commonOptionalSwitch('a', 'aa', 'description', ['param1', 'param2']);
    const returnValue2 = route.commonOptionalSwitch('b', null, 'description', ['param1', 'param2']);
    expect(Object.keys(route._lastPathItem().getCommonOptionalSwitchNames())).lengthOf(3);
    
    expect(returnValue1 instanceof CustomRoute).true;
    expect(returnValue1 === returnValue2).true;
  });

  it('commonOptionalSwitch when lastPathItem is not a BlockPathItem throws', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/...spread1');

    expect(() => {
      route.commonOptionalSwitch('a', 'aa', 'description', ['param1', 'param2']);
    }).throws();
  });

  it('commonOption when lastPathItem is BlockPathItem', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/static1');

    expect(Object.keys(route._lastPathItem().getCommonOptionalSwitchNames())).lengthOf(0);
    const returnValue1 = route.commonOption('a', 'aa', 'description', ['param1', 'param2']);
    const returnValue2 = route.commonOption('b', null, 'description', ['param1', 'param2']);
    expect(Object.keys(route._lastPathItem().getCommonOptionalSwitchNames())).lengthOf(3);
    
    expect(returnValue1 instanceof CustomRoute).true;
    expect(returnValue1 === returnValue2).true;
  });

  it('commonOption when lastPathItem is not a BlockPathItem throws', () => {
    const tree = new PathTree();
    const route = new CustomRoute(tree, '/...spread1');

    expect(() => {
      route.commonOption('a', 'aa', 'description', ['param1', 'param2']);
    }).throws();
  });

});
