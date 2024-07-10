import { Prisma, UserRole } from '@medihacks/prisma'
import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import { GraphQLError } from 'graphql'
import { DateResolver, DateTimeResolver } from 'graphql-scalars'
import { YogaInitialContext } from 'graphql-yoga'
import { prisma } from './prisma'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import ValidationPlugin from '@pothos/plugin-validation'
import type PrismaTypes from '@medihacks/prisma/pothos-types'
import { newUser, userRequired } from './validation/auth'

export interface CustomContext extends YogaInitialContext {
  privyDid: string
  userId: string
  authToken: string
  isPrivyAuth: boolean
}

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: {
      Input: Date
      Output: Date
    }
    ID: {
      Input: string
      Output: string
    }
    File: {
      Input: File
      Output: never
    }
    DateTime: {
      Input: Date
      Output: Date
    }
  }
  PrismaTypes: PrismaTypes
  AuthScopes: {
    public: boolean
    userRequired: boolean
    newUser: boolean
    hasRole: UserRole
  }
  Context: CustomContext
  DefaultInputFieldRequiredness: true
}>({
  defaultInputFieldRequiredness: true,
  plugins: [ValidationPlugin, ScopeAuthPlugin, PrismaPlugin],
  prisma: {
    client: prisma,
    filterConnectionTotalCount: true,
    dmmf: Prisma.dmmf
  },
  authScopes: () => ({
    public: true,
    newUser: () => newUser(),
    userRequired: () => userRequired(),
    hasRole: () => userRequired()
  }),
  validationOptions: {
    validationError: (zodError) => new GraphQLError(zodError.message)
  },
  scopeAuthOptions: {
    authorizeOnSubscribe: true,
    treatErrorsAsUnauthorized: true,
    unauthorizedError: () => new GraphQLError('Unauthorized')
  }
})

builder.addScalarType('Date', DateResolver, {})
builder.addScalarType('DateTime', DateTimeResolver, {})
builder.scalarType('File', {
  serialize: () => {
    throw new GraphQLError('File Uploads can only be used as input types')
  }
})
builder.queryType({})
builder.mutationType()
