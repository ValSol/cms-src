/*
основная часть кода взята здесь:
https://blog.nodeswat.com/implement-access-control-in-node-js-8567e7b484d
*/
/* пример использования

import rbac from '../../core/rbac';

let user = { role: 'guest' };
console.log('guest', 'Article:get', rbac.can('Article:get', { user }));
console.log('guest', 'Article:update', rbac.can('Article:update', { user }));
user = { role: 'admin' };
console.log('admin', 'Article:update', rbac.can('Article:update', { user }));

*/
class RBAC {
  constructor(opts) {
    this.init(opts);
  }

  init(roles) {
    if (typeof roles !== 'object') {
      throw new TypeError('Expected an object as input');
    }

    this.roles = roles;
    const map = {};
    Object.keys(roles).forEach(role => {
      map[role] = {
        can: {},
      };
      if (roles[role].inherits) {
        map[role].inherits = roles[role].inherits;
      }

      roles[role].can.forEach(operation => {
        if (typeof operation === 'string') {
          map[role].can[operation] = 1;
        } else if (
          typeof operation.name === 'string' &&
          typeof operation.when === 'function'
        ) {
          map[role].can[operation.name] = operation.when;
        }
        // Ignore definitions we don't understand
      });
    });
    this.roles = map;
  }

  can(operation, params) {
    // Check if role exists
    let role;
    if (!params.user) {
      role = 'guest'; // если пользователь на задан он guest
    } else {
      role = params.user.role; // eslint-disable-line prefer-destructuring
    }
    // если такой роли нет, дальше не проверяем
    if (!this.roles[role]) return false;
    // если * роль может все, дальше не проверяем
    if (this.roles[role].can['*'] === 1) return true;

    const $role = this.roles[role];
    // Check if this role has this operation
    if ($role.can[operation]) {
      // Not a function so we are good
      if (typeof $role.can[operation] !== 'function') {
        return true;
      }
      // If the function check passes return true
      if ($role.can[operation](params)) {
        return true;
      }
    }

    // Check if there are any parents
    if (!$role.inherits || $role.inherits.length < 1) {
      return false;
    }

    // Check child roles until one returns true or all return false
    return $role.inherits.some(childRole =>
      this.can(childRole, operation, params),
    );
  }
}

export default RBAC;
