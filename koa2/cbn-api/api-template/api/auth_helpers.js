function checkRole (user, roles) {
  roles = Array.isArray(roles) ? roles : [roles]
  return user.roles.filter(role => roles.includes(role)).length
}

function checkRoleMiddleware (roles) {
  return async (ctx, next) => {
    if (checkRole(ctx.state.user, roles)) {
      await next()
    } else {
      ctx.throw(401, 'No permission')
    }
  }
}

module.exports = {
  checkRole,
  checkRoleMiddleware
}
