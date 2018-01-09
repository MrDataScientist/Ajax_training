function hasRole (user, roles) {
  roles = Array.isArray(roles) ? roles : [roles]
  return user.roles.filter(role => roles.includes(role)).length
  // return user.roles.includes(roles)
}

function hasRoleMiddleware (roles) {
  return async (ctx, next) => {
    if (hasRole(ctx.state.user, roles)) {
      await next()
    } else {
      ctx.throw(401, 'No permission')
    }
  }
}

module.exports = {
  hasRole,
  hasRoleMiddleware
}
