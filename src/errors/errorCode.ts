export const ErrorCodes = {
  // Auth
  UNAUTHENTICATED:         { code: "UNAUTHENTICATED",         status: 401 },
  FORBIDDEN:               { code: "FORBIDDEN",               status: 403 },
  EMAIL_EXIST:             { code: "EMAIL_EXIST",             status: 403 },
  USERNAME_EXIST:          { code: "USERNAME_EXIST",          status: 403 },
  INVALID_CONNECTION:      { code: "INVALID_CONNECTION",      status: 403 },
  RESOURCE_ID_MISSING:     { code: "RESOURCE_ID_MISSING",     status: 403 },
  AUTH_HEADER_MISSING:     { code: "AUTH_HEADER_MISSING",     status: 401 },
  AUTH_TOKEN_MISSING:      { code: "AUTH_TOKEN_MISSING",      status: 401 },
  AUTH_TOKEN_INVALID:      { code: "AUTH_TOKEN_INVALID",      status: 401 },
  AUTH_TOKEN_EXPIRED:      { code: "AUTH_TOKEN_EXPIRED",      status: 401 },


  // User
  USER_NOT_FOUND:          { code: "USER_NOT_FOUND",          status: 404 },
  USER_LANGUAGE_NOT_FOUND: { code: "USER_LANGUAGE_NOT_FOUND", status: 400 },

  // Recipe
  SLUG_EXIST:              { code: "SLUG_EXIST",              status: 409 },
  RECIPE_NOT_FOUND:        { code: "RECIPE_NOT_FOUND",        status: 404 },

  // Household
  HOUSEHOLD_NOT_FOUND:     { code: "HOUSEHOLD_NOT_FOUND",     status: 404 },
  ALREADY_MEMBER:          { code: "ALREADY_MEMBER",          status: 409 },
  NOT_MEMBER:              { code: "NOT_MEMBER",              status: 404 },
  HOUSEHOLD_LAST_OWNER:    { code: "HOUSEHOLD_LAST_OWNER",    status: 409 },

  // Générique
  VALIDATION_ERROR:        { code: "VALIDATION_ERROR",        status: 422 },
  RESOURCE_NOT_FOUND:      { code: "RESOURCE_NOT_FOUND",      status: 404 },
  RESOURCE_ALREADY_EXISTS: { code: "RESOURCE_ALREADY_EXISTS", status: 409 },
  RESOURCE_IN_USE:         { code: "RESOURCE_IN_USE",         status: 409 },
  INTERNAL_ERROR:          { code: "INTERNAL_ERROR",          status: 500 },
} as const;